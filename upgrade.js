/* Deterministic, offline feature rules. No AI, health service or cloud calls. */
(function(root){
 'use strict';
 const shift=(date,n)=>{const d=new Date(date+'T12:00:00');d.setDate(d.getDate()+n);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
 function streak(checks,id,today){const days=new Set(checks.filter(x=>x.habitId===id).map(x=>x.date));let d=days.has(today)?today:shift(today,-1),n=0;while(days.has(d)){n++;d=shift(d,-1)}return n;}
 function recovery(state,today){
   const recent=state.workouts.filter(w=>w.date<=today&&w.date>=shift(today,-6));
   const ids=new Set(recent.map(w=>w.id));const hard=(state.upgrade?.feedback||[]).filter(f=>ids.has(f.workoutId)&&f.rating==='hard').length;
   const days=new Set(recent.map(w=>w.date)).size;
   return {days,hard,deload:hard>=2||days>=6,reason:hard>=2?'Two or more workouts felt hard this week.':days>=6?'Training was logged on six or more days this week.':'No deload trigger in your recent logs.'};
 }
 function schedule(routine,start,readiness,existing=[],state={workouts:[]}){
   if(!routine.length)throw Error('Generate an equipment-based routine first.');
   const r=recovery(state,start),rest=readiness<=2||r.deload;
   const occupied=new Set(existing.filter(x=>x.status!=='skipped').map(x=>x.date));
   // Spread sessions over a week. Low readiness shifts the week by a day; existing dates are skipped.
   const plan=[];let previous='';
   for(let i=0;i<routine.length;i++){
     let d=shift(start,(rest?1:0)+Math.floor(i*7/routine.length));
     while(occupied.has(d)||d<=previous)d=shift(d,1);
     occupied.add(d);previous=d;plan.push({date:d,day:i,name:routine[i].name,status:'planned',readiness,light:rest});
   }
   return plan;
 }
 function prescription(day,light){return {...day,exercises:day.exercises.map(x=>({...x,sets:light?Math.max(1,Math.ceil(x.sets/2)):x.sets,rest:light?Math.max(x.rest,90):x.rest}))};}
 function warmup(day,library){
   const groups=new Set(day.exercises.map(x=>library.find(e=>e.id===x.exerciseId)?.group));
   return ['60 seconds easy marching',groups.has('Legs')?'30 seconds comfortable bodyweight squats':'30 seconds gentle shoulder circles',groups.has('Hinge')?'30 seconds unloaded hip hinges':'30 seconds gentle trunk rotations','60 seconds slow rehearsal of the first movement without weight'];
 }
 function plates(target,bar,denominations){
   if(![target,bar].every(x=>Number.isFinite(x)&&x>=0)||target<bar)throw Error('Target must be at least the bar weight.');
   if(!denominations.length||denominations.length>30||denominations.some(x=>!Number.isFinite(x)||x<0.01||Math.abs(x*100-Math.round(x*100))>1e-6)||target>3000)throw Error('Enter up to 30 positive plate sizes with at most two decimal places and a target up to 3000.');
   const sizes=[...new Set(denominations)].sort((a,b)=>b-a);
   // Integer hundredths + bounded dynamic programming finds non-greedy combinations.
   const cap=Math.floor((target-bar)*50+1e-6),counts=new Int32Array(cap+1).fill(1e9),choice=new Int32Array(cap+1);counts[0]=0;
   for(let n=1;n<=cap;n++)for(let i=0;i<sizes.length;i++){const q=Math.round(sizes[i]*100);if(q<=n&&counts[n-q]+1<counts[n]){counts[n]=counts[n-q]+1;choice[n]=i;}}
   let best=cap;while(best>0&&counts[best]===1e9)best--;
   const perSide=[];for(let n=best;n>0;){const size=sizes[choice[n]];perSide.push(size);n-=Math.round(size*100);}
   return {perSide,actual:Math.round((bar+best/50)*100)/100,remainder:Math.round((target-bar-best/50)*100)/100};
 }
 function mealTotals(items){return items.reduce((t,f)=>{for(const k of ['cal','p','c','f'])t[k]+=f[k]*f.qty;return t},{cal:0,p:0,c:0,f:0});}
 function groceries(plan,existing=[]){
   const rows=new Map();
   for(const meal of plan)for(const f of meal.items){const key=JSON.stringify([f.name,f.serving]);const prev=rows.get(key);if(prev)prev.qty+=f.qty;else rows.set(key,{name:f.name,serving:f.serving,qty:f.qty});}
   return [...rows.values()].map((x,i)=>({...x,id:String(i),checked:existing.some(g=>g.name===x.name&&g.serving===x.serving&&g.qty===x.qty&&g.checked)}));
 }
 function transformation(state){
   const rows=state.weights.slice().sort((a,b)=>a.date.localeCompare(b.date));
   if(!rows.length)return {count:0,change:null,average:null,goalProgress:null};
   const first=rows[0].value,last=rows.at(-1).value,goal=state.settings.goal;
   const recent=rows.filter(w=>w.date>=shift(rows.at(-1).date,-6));
   return {count:rows.length,first,last,change:last-first,average:recent.reduce((s,w)=>s+w.value,0)/recent.length,goalProgress:first===goal?null:Math.min(100,Math.max(0,(last-first)/(goal-first)*100))};
 }
 const api={shift,streak,recovery,schedule,prescription,warmup,plates,mealTotals,groceries,transformation};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MacroUpgrade=api;
})(typeof window!=='undefined'?window:globalThis);
