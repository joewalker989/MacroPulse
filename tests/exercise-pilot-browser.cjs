/* Uses actual licensed pilot files for decoding; all state is disposable synthetic data. */
const a=require('node:assert/strict'),run=require('./app-fixture.cjs');
const seed={settings:{cal:2000,p:150,c:180,f:65,goal:180},weight:200,weights:[],meals:[],workouts:[{id:'old',date:'2026-10-29',exercise:'Custom squat',sets:3,reps:10,weight:20,duration:15,cal:0,unknown:{keep:true}}],foods:[],supplements:{},training:{equipment:['Dumbbells'],options:{days:3,minutes:30,goal:'general',core:true,cardio:false},routine:[]},unknown:{keep:true}};
run(seed,async({page,ctx,key,read,screenshot})=>{
 const media=[];ctx.on('request',r=>{if(/exercise-pilot\/.*mp4/.test(r.url()))media.push(r.url());});await ctx.route(/^https:\/\//,r=>r.abort());
 await page.locator('.nav [data-page=fitness]').click();a.equal(media.length,0);a.equal(await page.locator('#templateList [data-exercise-category]').count(),5);
 for(const category of ['Upper Body','Lower Body','Full Body','Core','Resistance Bands']){
  await page.locator('#templateList [data-exercise-category="'+category+'"]').click();a.equal(await page.locator('#exerciseCategory').inputValue(),category);a.equal(await page.locator('#exerciseAvailable').isChecked(),false);a.equal(await page.locator('[data-exercise-card]').count(),4);a.equal(await page.locator('#exerciseLibraryTitle').evaluate(e=>e===document.activeElement),true);
 }
 await page.locator('#exerciseCategory').selectOption('All');a.equal(await page.locator('[data-exercise-card]').count(),25);
 await page.locator('#exerciseAvailable').check();a.equal(await page.locator('[data-exercise-card=band-row]').count(),0);a.equal(await page.locator('[data-exercise-card=goblet]').count(),1);
 a.match(await page.locator('[data-exercise-card=goblet]').innerText(),/Target muscles: Quads, glutes/);
 await page.locator('[data-exercise-card=goblet]').screenshot({path:require('node:path').join(__dirname,'../test-results/pilot-card.png')});
 for(const id of ['goblet','row']){
  await page.locator('#templateList [data-realmotion='+id+']').first().click();a.equal(await page.locator('#rmVideo').getAttribute('src'),null);a.equal(await page.locator('[data-rm-angle]:disabled').count(),3);
  await page.locator('[data-rm-reference]').click();await page.waitForFunction(()=>document.getElementById('rmVideo').readyState>=2);a.equal(await page.locator('#rmVideo').evaluate(v=>v.paused),true);
  a.match(await page.locator('#rmCredit').innerText(),/Exercise video by Your Move/);a.match(await page.locator('#rmCredit').innerText(),/no specialist review/);a.match(await page.locator('#rmGuidance').innerText(),/Cue:/);
  a.equal(await page.locator('#rmVideo').evaluate(v=>v.videoWidth),720);a.equal(await page.locator('#rmVideo').evaluate(v=>v.videoHeight),1280);
  await page.locator('#rmClipLoop').check();a.equal(await page.locator('#rmVideo').evaluate(v=>v.loop),true);
  for(const speed of ['0.25','0.5','0.75','1']){await page.locator('#rmSpeed').selectOption(speed);a.equal(await page.locator('#rmVideo').evaluate(v=>v.playbackRate),Number(speed));}
  await page.locator('#rmVideo').evaluate(v=>v.play());await page.waitForFunction(()=>document.getElementById('rmVideo').currentTime>.3);await page.locator('#rmVideo').evaluate(v=>v.pause());
  await page.locator('#rmVideo').evaluate(async v=>{v.currentTime=v.duration-.2;await v.play();});await page.waitForFunction(()=>document.getElementById('rmVideo').currentTime<1);await page.locator('#rmVideo').evaluate(v=>v.pause());
  if(await page.locator('#rmReadCues').isVisible()){
   await page.evaluate(()=>{window.pilotSpeech={text:'',cancels:0};speechSynthesis.speak=u=>pilotSpeech.text=u.text;speechSynthesis.cancel=()=>pilotSpeech.cancels++;});
   await page.locator('#rmReadCues').click();a.equal(await page.locator('#rmVideo').evaluate(v=>v.paused),true);a.ok(await page.evaluate(()=>pilotSpeech.text.length>10));a.match(await page.locator('#rmStatus').innerText(),/not synchronized/);const n=await page.evaluate(()=>pilotSpeech.cancels);await page.locator('#rmStopReading').click();a.ok(await page.evaluate(()=>pilotSpeech.cancels)>n);
  }
  for(const control of ['rmVoice','rmCaptions','rmRep','rmLoop'])a.equal(await page.locator('#'+control).isDisabled(),true);
  if(id==='goblet')await screenshot('pilot-player.png');await page.keyboard.press('Escape');a.equal(await page.locator('#rmVideo').getAttribute('src'),null);a.equal(await page.locator('#rmVideo').evaluate(v=>v.loop),false);
 }
 // Local media failure restores original offline artwork and written cues.
 await ctx.route('**/media/exercise-pilot/*.mp4',r=>r.abort());await page.locator('#templateList [data-realmotion=goblet]').click();await page.locator('[data-rm-reference]').click();await page.waitForFunction(()=>document.getElementById('rmStatus').textContent.includes('unavailable'));a.equal(await page.locator('#rmFallback [data-demonstration=goblet]').isVisible(),true);await page.keyboard.press('Escape');
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await ctx.setOffline(true);await page.reload();await page.locator('.nav [data-page=fitness]').click();await page.locator('#templateList [data-realmotion=goblet]').click();a.match(await page.locator('#rmStatus').innerText(),/Offline/);a.match(await page.locator('#rmGuidance').innerText(),/Hold the weight close/);await page.keyboard.press('Escape');
 await page.locator('#templateList img').first().scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('#templateList img').naturalWidth>0);
 await page.evaluate(()=>document.body.classList.add('large-text'));for(const width of [320,390]){await page.setViewportSize({width,height:844});a.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);}
 a.deepEqual(await read(),seed);a.equal(await page.evaluate(()=>testDataWrites),0);a.ok(media.length>=2);
 console.log('Pilot passed: real MP4 decoding/playback, no startup video, attribution, category/equipment filters, focus, speed/repeat, error/offline fallback, narrow large-text layout and zero saved-data writes.');
}).catch(e=>{console.error(e);process.exitCode=1;});
