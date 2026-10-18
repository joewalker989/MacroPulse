/* End-to-end regression checks against an isolated browser profile, never real app data. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),KEY='macropulse_pwa_v1';
const legacy={settings:{cal:2100,p:150,c:200,f:70,goal:175},weight:200,weights:[{date:'2026-10-16',value:200}],meals:[{id:'m1',date:'2026-10-16',name:'Legacy meal',cal:400,p:30,c:40,f:12}],workouts:[{id:'w1',date:'2026-10-16',exercise:'Row',sets:3,reps:8,weight:20,duration:20,cal:0}],foods:[["Joe's food",'serving',100,10,10,2]],supplements:{'2026-10-16':[1]},extension:{keep:true}};
let serveLegacy=false;
const legacyAssets={
 '/index.html':'<!doctype html><html lang="en"><title>Legacy MacroPulse</title><h1>Legacy 3.1</h1><script src="app.js"></script></html>',
 '/app.js':"navigator.serviceWorker.register('./sw.js');",
 '/sw.js':"const C='macropulse-v1';self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./app.js'])).then(()=>self.skipWaiting())));self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));"
};
const server=http.createServer((req,res)=>{let name=new URL(req.url,'http://localhost').pathname;if(name==='/')name='/index.html';const file=path.resolve(root,'.'+decodeURIComponent(name));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}res.setHeader('Cache-Control','max-age=600');if(serveLegacy&&legacyAssets[name]){res.writeHead(200,{'Content-Type':name.endsWith('.js')?'application/javascript':'text/html'});return res.end(legacyAssets[name]);}fs.readFile(file,(err,b)=>{res.writeHead(err?404:200,{'Content-Type':({'.html':'text/html','.js':'application/javascript','.png':'image/png','.webmanifest':'application/manifest+json'})[path.extname(file)]||'text/plain'});res.end(err?'missing':b);});});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;let browser,testPage;
 try{
  browser=await chromium.launch(process.env.MACROPULSE_BROWSER_CHANNEL?{channel:process.env.MACROPULSE_BROWSER_CHANNEL}:{});const context=await browser.newContext({viewport:{width:390,height:844},timezoneId:'America/New_York'});
  await context.addInitScript(({key,data})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(data));},{key:KEY,data:legacy});
  const page=await context.newPage(),errors=[];testPage=page;page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.type()==='confirm'?d.accept():d.dismiss());
  await page.goto(url);await page.getByRole('heading',{name:'Daily Fitness Command Center',exact:true}).waitFor();
  const read=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
  const open=title=>page.getByText(title,{exact:true}).click();
  const click=name=>page.getByRole('button',{name,exact:true}).click();
  await click('+ 250 ml');await page.getByLabel('Daily habit',{exact:true}).fill('Walk');await click('Add habit');await page.getByLabel('Completed today',{exact:true}).check();await page.reload();assert.equal((await read()).upgrade.water[0].ml,250);assert.equal(await page.getByText('1 day streak',{exact:true}).count(),1);
  for(const k of Object.keys(legacy))assert.deepEqual((await read())[k],legacy[k]);
  console.log('Passed legacy preservation, hydration, habits and reload.');
  await click('🏋 Fitness');await click('Generate routine');await open('Adaptive Workout Scheduler');await page.locator('#scheduleForm select[name="readiness"]').selectOption('1');await click('Add adaptive week');assert.equal((await read()).upgrade.schedule.length,3);assert.ok((await read()).upgrade.schedule.every(x=>x.light));
  await open('Warm-up Builder & Deload Planner');await click('Build warm-up');assert.match(await page.locator('#prepResult').innerText(),/60 seconds/);await click('Preview deload');assert.match(await page.locator('#prepResult').innerText(),/90s rest/);
  await open('Plate / Weight Calculator');await click('Calculate');assert.match(await page.locator('#plateResult').innerText(),/Total: 135 lb/);
  await open('Workout Supersets');await click('Pair movements');assert.ok((await read()).training.routine[0].exercises[0].superset);
  await open('Workout Difficulty Feedback');await click('Hard');assert.equal((await read()).upgrade.feedback[0].rating,'hard');
  await open('Exercise Form Review · Manual');await page.getByLabel('My observations',{exact:true}).fill('Controlled');await click('Save manual review');assert.equal((await read()).upgrade.reviews.length,1);console.log('Passed training, scheduling, feedback and manual review.');
  await click('▤ Food');await open('Smart Meal Builder');await page.locator('#builderFood').selectOption({label:"Joe's food · serving"});await page.getByLabel('Servings',{exact:true}).fill('2');await click('Add ingredient');await page.getByLabel('Meal name',{exact:true}).fill('Lunch');await click('Save planned meal');await click('Log for planned date');assert.equal((await read()).meals.at(-1).cal,200);
  await open('Smart Grocery List');await click('Build / refresh list');assert.equal((await read()).upgrade.grocery[0].qty,2);await page.locator('[data-grocery]').check();console.log('Passed meal planning, nutrition logging and grocery quantities.');
  await click('▥ Progress');await page.getByLabel('Waist (inches)',{exact:true}).fill('38');await click('Save measurement');assert.equal((await read()).upgrade.measurements[0].waist,38);
  await click('Open settings');await open('Data Privacy Center');const downloadPromise=page.waitForEvent('download');await click('Export all app data');const dl=await downloadPromise,backup=JSON.parse(fs.readFileSync(await dl.path(),'utf8'));assert.deepEqual(backup.data,await read());
  const original=JSON.parse(JSON.stringify(await read()));const replacement={format:'MacroPulse',version:1,data:legacy};
  await page.locator('#importFile').setInputFiles({name:'legacy.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(replacement))});await page.locator('#modal').waitFor({state:'hidden'});assert.deepEqual(await read(),legacy);assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key+'_recovery')),KEY),original);
  await click('⌂ Home');await page.reload();await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  const cacheNames=await page.evaluate(()=>caches.keys());assert.ok(cacheNames.some(x=>x===fs.readFileSync(path.join(root,'sw.js'),'utf8').match(/const CACHE='([^']+)'/)[1]));
  await context.setOffline(true);await page.reload();await page.getByRole('heading',{name:'Daily Fitness Command Center',exact:true}).waitFor();await click('+ 500 ml');assert.equal((await read()).upgrade.water.at(-1).ml,500);await context.setOffline(false);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
  await page.screenshot({path:path.join(root,'test-results','mobile-home.png'),fullPage:true});await context.close();
  const bad=await browser.newContext();await bad.addInitScript(key=>localStorage.setItem(key,'{corrupt'),KEY);const p=await bad.newPage();p.on('dialog',d=>d.dismiss());await p.goto(url);await p.getByRole('button',{name:'+ 250 ml',exact:true}).click();assert.equal(await p.evaluate(key=>localStorage.getItem(key),KEY),'{corrupt');await bad.close();
  serveLegacy=true;const upgrading=await browser.newContext(),oldPage=await upgrading.newPage();testPage=oldPage;await oldPage.goto(url);await oldPage.getByRole('heading',{name:'Legacy 3.1',exact:true}).waitFor();await oldPage.waitForFunction(()=>!!navigator.serviceWorker.controller);await oldPage.evaluate(({key,data})=>localStorage.setItem(key,JSON.stringify(data)),{key:KEY,data:legacy});
  serveLegacy=false;await oldPage.goto(url+'/index.html?release=4.0');await oldPage.getByRole('heading',{name:'Daily Fitness Command Center',exact:true}).waitFor();await oldPage.locator('#waterSummary').waitFor({state:'visible'});await oldPage.evaluate(async()=>{const r=await navigator.serviceWorker.ready;await r.update();});await oldPage.waitForFunction(async()=>!!(await navigator.serviceWorker.getRegistration()).waiting);await oldPage.close();
  const upgradedPage=await upgrading.newPage();testPage=upgradedPage;await upgradedPage.goto(url);await upgradedPage.getByRole('heading',{name:'Daily Fitness Command Center',exact:true}).waitFor();assert.deepEqual(await upgradedPage.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY),legacy);await upgrading.close();
  console.log('Passed 3.1-style service worker upgrade with stale HTTP assets and preserved app data.');
  console.log('Browser checks passed: legacy preservation, feature flows, backups, corrupt data protection, mobile layout and offline reload.');
 }catch(err){if(testPage&&!testPage.isClosed()){fs.mkdirSync(path.join(root,'test-results'),{recursive:true});await testPage.screenshot({path:path.join(root,'test-results','failure.png'),fullPage:true}).catch(()=>{});}throw err;}finally{if(browser)await browser.close();server.close();}
})().catch(err=>{console.error(err);process.exitCode=1;server.close();});


