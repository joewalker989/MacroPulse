/* Core 3.2 acceptance checks, with synthetic data in a disposable browser context.
 * MACROPULSE_URL optionally runs this same suite against the deployed Pages app.
 * No existing browser profile or real user data is opened.
 */
const {chromium}=require('playwright');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),a=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),KEY='macropulse_pwa_v1';
const seed={settings:{cal:2100,p:150,c:200,f:70,goal:175},weight:200,weights:[],meals:[],workouts:[],foods:[],supplements:{},unknownCoreExtension:{keep:true}};
const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(!pathname.startsWith('/MacroPulse/')){res.writeHead(404);return res.end();}
  const relative=pathname.slice('/MacroPulse/'.length)||'index.html',file=path.resolve(root,relative);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
  fs.readFile(file,(err,data)=>{res.writeHead(err?404:200,{'Content-Type':({'.html':'text/html','.js':'application/javascript','.webmanifest':'application/manifest+json','.png':'image/png'})[path.extname(file)]||'text/plain'});res.end(err?'missing':data);});
});
(async()=>{
  let browser,page;
  try{
    let url=process.env.MACROPULSE_URL;
    if(!url){await new Promise(r=>server.listen(0,'127.0.0.1',r));url='http://127.0.0.1:'+server.address().port+'/MacroPulse/';}
    browser=await chromium.launch();
    const context=await browser.newContext({viewport:{width:390,height:844},timezoneId:'America/New_York'});
    // Seed once; reloads must read the application's own persisted records.
    await context.addInitScript(({key,data})=>{if(localStorage.getItem(key)===null)localStorage.setItem(key,JSON.stringify(data));},{key:KEY,data:seed});
    page=await context.newPage();await page.clock.install({time:new Date('2026-10-17T16:00:00-04:00')});
    const errors=[],dialogs=[];let confirm=true;
    page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>{dialogs.push(d.message());return d.type()==='confirm'&&confirm?d.accept():d.dismiss();});
    const click=name=>(['🏋 Fitness','▤ Food','⌂ Home','💊 Stack','▥ Progress'].includes(name)?page.getByRole('navigation'):page).getByRole('button',{name,exact:true}).click();
    const read=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
    const formValues=async(id,values)=>{for(const [key,value]of Object.entries(values))await page.locator('#'+id+' [name="'+key+'"]').fill(value);};
    await page.goto(url);await page.locator('#training').waitFor({state:'attached'});a.deepEqual(await read(),seed);
    await click('🏋 Fitness');
    await page.getByLabel('Dumbbells',{exact:true}).check();await page.getByLabel('Bench',{exact:true}).check();
    await page.locator('#equipmentForm [name=equipment]').fill('Cable machine');await click('Add');
    await page.locator('#routineForm [name=days]').selectOption('4');await page.locator('#routineForm [name=minutes]').selectOption('45');await page.locator('#routineForm [name=goal]').selectOption('strength');await page.locator('#routineForm [name=cardio]').check();await click('Generate routine');
    let saved=await read();a.equal(saved.training.routine.length,4);a.ok(saved.training.equipment.includes('Cable machine'));a.equal(saved.workouts.length,0);
    await page.reload();a.deepEqual((await read()).training,saved.training);
    await page.locator('#training summary').filter({hasText:'Day 1'}).click();
    const substitute=page.locator('[data-substitute]').first();const choices=await substitute.locator('option').evaluateAll(nodes=>nodes.map(x=>x.value));a.ok(choices.length>1);
    const replacement=choices.find(x=>x!=='dead-bug');await substitute.selectOption(replacement);a.equal((await read()).training.routine[0].exercises[0].exerciseId,replacement);
    // Saving rerenders and closes routine details.
    await page.locator('#training summary').filter({hasText:'Day 1'}).click();await page.locator('[data-training=log]').first().click();
    a.notEqual(await page.locator('#workoutForm [name=exercise]').inputValue(),'');
    await formValues('workoutForm',{sets:'3',reps:'8',weight:'25',duration:'20',cal:'120'});await click('Save Workout');
    a.equal((await read()).workouts.length,1);a.equal((await read()).workouts[0].weight,25);a.match(await page.locator('#activeCal').innerText(),/120/);
    await page.locator('#training summary').filter({hasText:'Day 1'}).click();await page.locator('[data-training=rest]').filter({hasText:'Start rest'}).first().click();a.match(await page.locator('#restStatus').innerText(),/remaining/);await click('Cancel rest');a.equal(await page.locator('#restStatus').innerText(),'Rest timer ready');
    await page.locator('[data-training=rest]').first().click();await page.clock.fastForward(130000);a.equal(await page.locator('#restStatus').innerText(),'Rest complete');
    // Removing supported equipment invalidates the plan, never the exercise history.
    await page.getByLabel('Bench',{exact:true}).uncheck();a.equal((await read()).training.routine.length,0);a.equal((await read()).workouts.length,1);
    await click('Use Upper Body');a.equal(await page.locator('#workoutForm [name=exercise]').inputValue(),'Dumbbell Bench Press');await click('✕ Close');
    await click('▤ Food');await page.locator('#foodSearch').fill('chicken breast');await page.locator('[data-food]').click();a.equal((await read()).meals[0].cal,165);
    await click('+ Custom');await formValues('foodForm',{name:'Core test lunch',cal:'450',p:'35',c:'50',f:'12'});await click('Save Meal');
    a.equal((await read()).foods[0][0],'Core test lunch');await page.locator('#foodSearch').fill('Core test lunch');await page.locator('[data-food]').click();a.equal((await read()).meals.length,3);
    await click('⌂ Home');a.equal(await page.locator('#remaining').innerText(),'1,035');a.match(await page.locator('#macroCards').innerText(),/101/);a.match(await page.locator('#burnDetail').innerText(),/120/);
    await click('💊 Stack');await page.locator('[data-sup="0"]').check();a.deepEqual((await read()).supplements['2026-10-17'],[0]);a.equal((await read()).meals.length,3);await page.reload();a.equal(await page.locator('[data-sup="0"]').isChecked(),true);
    await click('▥ Progress');await page.locator('#weightInput').fill('198.5');await click('Save');a.equal((await read()).weight,198.5);a.equal((await read()).weights.length,1);a.match(await page.locator('#weeklySummary').innerText(),/1065 kcal/);
    await click('Open settings');await formValues('settingsForm',{cal:'2200',p:'160',c:'220',f:'70',goal:'170'});await click('Save Goals');a.equal((await read()).settings.cal,2200);
    await click('Open settings');const pending=page.waitForEvent('download');await click('Export backup');const download=await pending,backup=JSON.parse(fs.readFileSync(await download.path(),'utf8'));a.deepEqual(backup.data,await read());a.deepEqual(backup.data.unknownCoreExtension,seed.unknownCoreExtension);
    const before=await read();confirm=false;await page.locator('#importFile').setInputFiles({name:'cancel.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'MacroPulse',version:1,data:seed}))});await page.waitForFunction(()=>document.getElementById('importFile').value==='');a.deepEqual(await read(),before);confirm=true;
    await page.locator('#importFile').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{invalid')});await page.waitForFunction(()=>document.getElementById('importFile').value==='');a.deepEqual(await read(),before);a.match(dialogs.at(-1),/Import failed/);
    await click('✕ Close');await click('▤ Food');confirm=false;await page.locator('[data-delete=meal]').first().click();a.equal((await read()).meals.length,3);confirm=true;await page.locator('[data-delete=meal]').first().click();a.equal((await read()).meals.length,2);
    // Offline caching must work at the repository subpath used by GitHub Pages.
    await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload();await page.locator('#foodSearch').fill('Core test lunch');await page.locator('[data-food]').click();a.equal((await read()).meals.length,3);await page.reload();a.equal((await read()).meals.length,3);
    a.deepEqual(errors,[]);a.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    fs.mkdirSync(path.join(root,'test-results'),{recursive:true});await page.screenshot({path:path.join(root,'test-results',process.env.MACROPULSE_URL?'core-deployed.png':'core-mobile.png'),fullPage:true});
    console.log('Core 3.2 acceptance passed: equipment, preferences, routines, substitution, logging, templates, rest completion/cancel, meals/custom foods/macros, supplements, progress, goals, backup export/canceled-invalid import, delete confirmation, legacy fields and offline writes/reload at /MacroPulse/.');
    await context.close();
  }catch(err){if(page&&!page.isClosed()){fs.mkdirSync(path.join(root,'test-results'),{recursive:true});await page.screenshot({path:path.join(root,'test-results','core-failure.png'),fullPage:true}).catch(()=>{});}throw err;}
  finally{if(browser)await browser.close();server.close();}
})().catch(err=>{console.error(err);process.exitCode=1;});

