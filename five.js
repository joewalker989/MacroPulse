/* 5.0 additive domain model. All suggestions are local, reviewable rules. */
(function(root){
 'use strict';
 const T=typeof module!=='undefined'&&module.exports?require('./training.js'):root.MacroTraining;
 const obj=x=>!!x&&typeof x==='object'&&!Array.isArray(x), str=x=>typeof x==='string', n=x=>Number.isFinite(x)&&x>=0;
 const bounded=(x,max)=>n(x)&&x<=max, integer=(x,max)=>Number.isInteger(x)&&x>=1&&x<=max;
 const stamp=x=>str(x)&&Number.isFinite(Date.parse(x)), id=x=>str(x)&&x.length>0&&x.length<=160;
 const timerValid=t=>obj(t)&&t.version===1&&(t.pausedAt===null||stamp(t.pausedAt))&&Number.isSafeInteger(t.pausedMs)&&t.pausedMs>=0&&typeof t.stopped==='boolean';
 const known=x=>T.library.some(e=>e.id===x);
 const defaults=()=>({version:1,active:null,sessions:[],favorites:[],ladders:{},challenges:[],inventory:[],backupChecks:[]});
 const readiness=r=>obj(r)&&['sleep','energy','soreness'].every(k=>integer(r[k],5))&&typeof r.pain==='boolean';
 function session(s){return obj(s)&&(s.timer===undefined||timerValid(s.timer))&&id(s.id)&&str(s.name)&&s.name.length<=120&&stamp(s.started)&&['active','finished','abandoned'].includes(s.status)&&readiness(s.readiness)&&str(s.note)&&s.note.length<=4000&&Array.isArray(s.exercises)&&s.exercises.length>0&&s.exercises.length<=20&&s.exercises.every(e=>obj(e)&&known(e.exerciseId)&&str(e.note)&&e.note.length<=2000&&integer(e.rest,600)&&['reps','minutes'].includes(e.unit)&&Array.isArray(e.sets)&&e.sets.length>0&&e.sets.length<=20&&e.sets.every(s=>obj(s)&&integer(s.reps,100)&&bounded(s.weight,3000)&&integer(s.effort,10)&&typeof s.done==='boolean'))&&(s.finished===undefined||stamp(s.finished));}
 function valid(s){try{return obj(s)&&s.version===1&&(s.active===null||(session(s.active)&&s.active.status==='active'))&&Array.isArray(s.sessions)&&s.sessions.every(x=>session(x)&&x.status!=='active')&&new Set(s.sessions.map(x=>x.id)).size===s.sessions.length&&Array.isArray(s.favorites)&&s.favorites.every(known)&&obj(s.ladders)&&Object.entries(s.ladders).every(([k,v])=>known(k)&&integer(v,5))&&Array.isArray(s.inventory)&&s.inventory.every(x=>obj(x)&&id(x.id)&&str(x.name)&&x.name.trim()&&x.name.length<=80&&str(x.kind)&&integer(x.quantity,1000)&&['lb','kg','level'].includes(x.unit)&&Array.isArray(x.loads)&&x.loads.every(v=>bounded(v,3000))&&str(x.notes)&&x.notes.length<=1000)&&Array.isArray(s.challenges)&&s.challenges.every(x=>obj(x)&&id(x.id)&&str(x.name)&&x.name.trim()&&x.name.length<=120&&['sessions','sets','trainingDays'].includes(x.metric)&&integer(x.target,10000)&&rootDate(x.start)&&rootDate(x.end)&&x.end>=x.start)&&Array.isArray(s.backupChecks)&&s.backupChecks.every(x=>obj(x)&&stamp(x.at)&&str(x.hash)&&integer(x.bytes,200000000));}catch{return false;}}
 function rootDate(x){return str(x)&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&!isNaN(Date.parse(x+'T12:00:00Z'))&&new Date(x+'T12:00:00Z').toISOString().slice(0,10)===x;}
 function readinessAdvice(r){return r.pain?'Stop and review: pain reported. Do not train through pain. Choose recovery or seek appropriate advice.':r.sleep<=2||r.energy<=2||r.soreness>=4?'Low readiness: consider recovery or fewer sets. Loads remain your choice.':'Readiness recorded. Warm up and review your working loads.';}
 function quick(minutes,equipment,favorites=[],excluded=[]){
  if(![5,10,15,20,30,45,60].includes(minutes))throw Error('Choose a supported duration.');
  const pool=T.available(equipment).filter(e=>!excluded.includes(e.id)),out=[];let used=3;
  for(const group of ['Legs','Push','Pull','Hinge','Core']){
   const e=pool.filter(e=>e.group===group).sort((a,b)=>Number(favorites.includes(b.id))-Number(favorites.includes(a.id))||b.requires.length-a.requires.length)[0];
   if(e&&used+2<=minutes){const sets=minutes>=20?2:1;if(used+sets*2>minutes)continue;out.push({exerciseId:e.id,sets,reps:10,rest:60,unit:'reps'});used+=sets*2;}
  }
  return {name:`Quick ${minutes} minute workout`,estimatedMinutes:used,exercises:out};
 }
 function start(plan,r,uid,now=new Date().toISOString()){if(!readiness(r)||!plan.exercises.length)throw Error('Choose a plan and complete readiness.');return {id:uid,name:plan.name,started:now,status:'active',readiness:r,note:'',timer:{version:1,pausedAt:null,pausedMs:0,stopped:false},exercises:plan.exercises.map(e=>({exerciseId:e.exerciseId,unit:e.unit,rest:Math.max(1,e.rest),note:'',sets:Array.from({length:e.sets},()=>({reps:e.reps,weight:0,effort:7,done:false}))}))};}
 function finish(s,existing,date,now=new Date().toISOString()){
  if(!session(s)||s.status!=='active'||!rootDate(date))throw Error('Invalid active session.');
  const records=[];s.exercises.forEach((e,i)=>e.sets.forEach((set,j)=>{if(!set.done)return;const key=`live-${s.id}-${i}-${j}`;if(!existing.some(w=>w.id===key))records.push({id:key,date,exercise:T.library.find(x=>x.id===e.exerciseId).name,sets:1,reps:e.unit==='minutes'?1:set.reps,weight:set.weight,duration:e.unit==='minutes'?set.reps:1,cal:0,sessionId:s.id,effort:set.effort,note:e.note});}));
  if(!s.exercises.some(e=>e.sets.some(x=>x.done)))throw Error('Complete at least one set before finishing.');
  return {session:{...structuredClone(s),status:'finished',finished:now},records};
 }
 function clockSeconds(s,at=Date.now()){
  if(!s||!stamp(s.started)||!Number.isFinite(at))return 0;
  const timer=s.timer||{pausedAt:null,pausedMs:0};let end=at;
  if(s.status!=='active'&&stamp(s.finished))end=Math.min(end,Date.parse(s.finished));
  if(timer.pausedAt)end=Math.min(end,Date.parse(timer.pausedAt));
  return Math.max(0,Math.floor((end-Date.parse(s.started)-(timer.pausedMs||0))/1000));
 }
 function pauseClock(s,stopped=false,now=new Date().toISOString()){
  if(!session(s)||s.status!=='active'||!stamp(now))throw Error('Choose an active session.');
  const next=structuredClone(s);next.timer=next.timer||{version:1,pausedAt:null,pausedMs:0,stopped:false};
  if(!next.timer.pausedAt)next.timer.pausedAt=now;next.timer.stopped=stopped;return next;
 }
 function resumeClock(s,now=new Date().toISOString()){
  if(!session(s)||s.status!=='active'||!stamp(now))throw Error('Choose an active session.');
  const next=structuredClone(s);next.timer=next.timer||{version:1,pausedAt:null,pausedMs:0,stopped:false};
  if(next.timer.pausedAt)next.timer.pausedMs+=Math.max(0,Date.parse(now)-Date.parse(next.timer.pausedAt));
  next.timer.pausedAt=null;next.timer.stopped=false;return next;
 }
 function formatClock(seconds){const n=Math.max(0,Math.floor(Number(seconds)||0));return [Math.floor(n/3600),Math.floor(n/60)%60,n%60].map(v=>String(v).padStart(2,'0')).join(':');}
 function recommend(exerciseId,workouts,inventory=[],r=null){
  const e=T.library.find(x=>x.id===exerciseId),rows=workouts.filter(w=>w.exercise.toLowerCase()===e.name.toLowerCase()&&w.weight>0).slice().sort((a,b)=>a.date.localeCompare(b.date));
  if(!rows.length)return {weight:null,reason:'No comparable loaded history. Choose a comfortable starting load after warming up.'};
  const last=rows.at(-1),hard=(r&&(r.pain||r.sleep<=2||r.energy<=2||r.soreness>=4))||last.effort>=9;
  const target=hard?last.weight*.9:last.reps>=12&&last.effort!==undefined&&last.effort<=7?last.weight*1.025:last.weight;
  const loads=inventory.filter(x=>e.requires.includes(x.kind)).flatMap(x=>x.loads.map(v=>x.unit==='kg'?v*2.2046226218:x.unit==='lb'?v:0)).filter(x=>x>0);
  const possible=loads.filter(x=>x<=target);return {weight:loads.length?(possible.length?Math.max(...possible):null):Math.round(target*10)/10,reason:`${hard?'Reduced':'Repeat or small increase from'} last recorded ${last.weight} lb. ${loads.length?'Rounded down to a listed equipment load.':'Inventory load limits unavailable.'} Added weight per logged implement; verify units and form. Review before applying.`};
 }
 const ladder=['Learn the movement','Controlled range','Consistent repetitions','Add repetitions','Review a small load increase'];
 function comparison(a,b){const stats=s=>({sets:s.exercises.reduce((n,e)=>n+e.sets.filter(s=>s.done).length,0),volume:s.exercises.reduce((n,e)=>n+e.sets.filter(s=>s.done&&e.unit==='reps').reduce((n,s)=>n+s.reps*s.weight,0),0)});const x=stats(a),y=stats(b);return {a:x,b:y,sets:y.sets-x.sets,volume:y.volume-x.volume};}
 function challenge(c,state){const rows=state.workouts.filter(x=>x.date>=c.start&&x.date<=c.end);const count=c.metric==='sets'?rows.reduce((n,x)=>n+x.sets,0):c.metric==='trainingDays'?new Set(rows.map(x=>x.date)).size:new Set(rows.map(x=>x.sessionId||x.id)).size;return {count,percent:Math.min(100,count/c.target*100)};}
 const api={defaults,valid,session,readiness,readinessAdvice,quick,start,finish,recommend,ladder,comparison,challenge,rootDate,timerValid,clockSeconds,pauseClock,resumeClock,formatClock};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MacroFive=api;
})(typeof window!=='undefined'?window:globalThis);
