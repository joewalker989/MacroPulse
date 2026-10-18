/* Isolated synthetic records: local and deployed acceptance share the same checks. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),a=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),KEY='macropulse_pwa_v1';
const legacy={settings:{cal:2000,p:150,c:180,f:65,goal:180},weight:200,weights:[],meals:[{id:'old',date:'2026-10-17',name:'Preserved',cal:400,p:30,c:40,f:12}],workouts:[],foods:[],supplements:{},unknown:{keep:true}};
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+(new URL(req.url,'http://localhost').pathname==='/'?'/index.html':new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(file,(e,b)=>{res.writeHead(e?404:200,{'Content-Type':file.endsWith('.js')?'application/javascript':file.endsWith('.html')?'text/html':'application/octet-stream'});res.end(e?'missing':b);});});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 browser=await chromium.launch(process.env.MACROPULSE_BROWSER_CHANNEL?{channel:process.env.MACROPULSE_BROWSER_CHANNEL}:{});
 const context=await browser.newContext({viewport:{width:390,height:844},timezoneId:'America/New_York'});
 await context.addInitScript(({key,data})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(data));},{key:KEY,data:legacy});
 const page=await context.newPage(),errors=[];page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));let approve=true;page.on('dialog',d=>d.type()==='confirm'&&approve?d.accept():d.dismiss());
 const url=process.env.MACROPULSE_HEALTH_URL||'http://127.0.0.1:'+server.address().port;
 await page.goto(url);await page.locator('#healthDaily').waitFor();const read=()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY),click=n=>page.getByRole('button',{name:n,exact:true}).click();
 a.deepEqual(await read(),legacy);
 for(const [label,n] of [['Full',1],['Half',.5],['Quarter',.25]]){await click(`+ ${label} jug (${40*n} US fl oz)`);a.ok(Math.abs((await read()).upgrade.water.at(-1).ml-40*n*29.5735295625)<.001);}
 await click('▥ Progress');let f=page.locator('#healthProfile');await f.locator('[name=eligible]').check();await click('Save profile & preview estimates');a.equal((await read()).settings.cal,2000);a.equal((await read()).health.history.length,1);
 approve=false;await click('Approve these diary targets');a.equal((await read()).health.targets.length,0);approve=true;await click('Approve these diary targets');a.equal((await read()).health.targets.length,1);
 const target=(await read()).settings.cal;await page.locator('#weightInput').fill('190');await click('Save');a.equal((await read()).settings.cal,target);a.match(await page.locator('#healthDaily').innerText(),/weight changed/);
 f=page.locator('#healthProfile');await f.locator('[name=units]').selectOption('metric');a.ok(Math.abs(+(await f.locator('[name=height]').inputValue())-177.8)<.1);await click('Save profile & preview estimates');await click('Approve these diary targets');
 a.equal((await read()).health.profile.units,'metric');await page.locator('#weightInput').fill('85');await click('Save');a.ok(Math.abs((await read()).weight-85*2.2046226218487757)<.001);
 await page.getByText('Navy body fat & ideal weight references',{exact:true}).click();f=page.locator('#healthBodyForm');await f.locator('[name=waist]').fill('91.44');await f.locator('[name=neck]').fill('38.1');await click('Calculate body fat reference');a.match(await page.locator('#bodyFatResult').innerText(),/21.3%/);
 a.equal((await read()).health.history.at(-1).kind,'bodyFat');a.deepEqual((await read()).meals,legacy.meals);a.deepEqual((await read()).unknown,legacy.unknown);
 await page.getByText('Photo Progression Studio',{exact:true}).click();f=page.locator('#photoAddForm');await f.locator('[name=file]').setInputFiles(path.join(root,'icon-192.png'));await f.locator('[name=at]').fill('2026-10-17T12:00');await f.locator('[name=consent]').check();await click('Save progress photo');await page.waitForFunction(async()=> (await MacroPhotos.all()).length===1);
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await page.waitForFunction(()=>document.querySelector('#photoStatus').textContent.startsWith('Progress photo saved'));const before=await read();await context.setOffline(true);await page.reload();await page.locator('#healthCenter').waitFor({state:'attached'});a.deepEqual(await read(),before);a.equal(await page.evaluate(async()=> (await MacroPhotos.all()).length),1);
 a.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);a.deepEqual(errors,[]);
 if(!process.env.MACROPULSE_HEALTH_URL){
  await context.setOffline(false);const stale=await context.newPage();await stale.goto(url);await stale.locator('#healthDaily').waitFor({state:'attached'});await page.getByRole('button',{name:'Home',exact:false}).click();await click('+ Quarter jug (10 US fl oz)');const saved=await read();await stale.getByRole('button',{name:'Home',exact:false}).click();await stale.getByRole('button',{name:'+ Half jug (20 US fl oz)',exact:true}).click();a.deepEqual(await read(),saved);
 }
 console.log('5.1 browser acceptance passed: jug sizes, lazy migration, preview/decline/approval, weight-change review, metric round-trip, Navy estimate/history, legacy records, photos, offline reload, mobile layout and stale tabs. URL: '+url);
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});


