/* Offline calculations. Suggestions never change targets or create logs. */
(function(root){
 'use strict';
 const T=typeof module!=='undefined'&&module.exports?require('./training.js'):root.MacroTraining;
 const U=typeof module!=='undefined'&&module.exports?require('./upgrade.js'):root.MacroUpgrade;
 const muscleFor={Push:'Chest',Pull:'Back',Legs:'Quads',Hinge:'Glutes',Core:'Core',Cardio:'Cardio'};
 const muscles=['Chest','Back','Quads','Glutes','Core'];
 const identify=name=>T.library.find(e=>e.name.toLowerCase()===String(name).trim().toLowerCase()||e.id===name);
 const days=(a,b)=>(Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000;
 function trend(points){
   const groups=new Map();for(const p of points){const a=groups.get(p.date)||[];a.push(p.value);groups.set(p.date,a);}
   const a=[...groups].sort(([a],[b])=>a.localeCompare(b)).map(([date,v])=>({date,value:v.reduce((a,b)=>a+b,0)/v.length}));
   if(a.length<3||days(a[0].date,a.at(-1).date)<7)return null;
   const mx=a.reduce((s,p)=>s+days(a[0].date,p.date),0)/a.length,my=a.reduce((s,p)=>s+p.value,0)/a.length;
   const denominator=a.reduce((s,p)=>s+(days(a[0].date,p.date)-mx)**2,0);
   return {slope:a.reduce((s,p)=>s+(days(a[0].date,p.date)-mx)*(p.value-my),0)/denominator,count:a.length,last:a.at(-1)};
 }
 function goalStatus(goal,state,today){
   const weights=state.weights.filter(x=>x.date>=goal.start&&x.date<=today).sort((a,b)=>a.date.localeCompare(b.date));
   const value=goal.metric==='weight'?(weights.at(-1)?.value??goal.baseline):new Set(state.workouts.filter(x=>x.date>=U.shift(today,-6)&&x.date>=goal.start&&x.date<=today).map(x=>x.date)).size;
   const baseline=goal.metric==='weight'?goal.baseline:0,delta=goal.target-baseline;
   const progress=delta===0?100:Math.max(0,Math.min(100,(value-baseline)/delta*100));
   let suggestion=goal.metric==='trainingDays'?'Review your last seven days and choose a sustainable weekly frequency.':'Record at least three check-ins over seven days to see a trend.';
   const fit=goal.metric==='weight'?trend(weights):null;
   if(fit){const remaining=goal.target-value,wait=remaining/fit.slope;
     suggestion=progress===100?'Target reached. Review your next milestone.':wait>0&&wait<=365?`Recent trend: ${(fit.slope*7).toFixed(2)} lb/week. Estimated target date ${U.shift(fit.last.date,Math.ceil(wait))}. Consider adjusting the deadline yourself; this estimate is uncertain.`:'Recent trend does not support a target date within one year. Review your deadline and habits.';
   }
   return {value,progress,milestones:[25,50,75,100].map(percent=>({percent,reached:progress>=percent})),suggestion};
 }
 function volume(workouts,from,to){
   const result=Object.fromEntries(muscles.map(x=>[x,{sets:0,reps:0,load:0}]));let unknown=0;
   for(const w of workouts.filter(w=>w.date>=from&&w.date<=to)){const e=identify(w.exercise);if(!e){unknown++;continue;}const m=muscleFor[e.group];if(!result[m])continue;result[m].sets+=w.sets;result[m].reps+=w.sets*w.reps;result[m].load+=w.sets*w.reps*w.weight;}
   return {groups:result,unknown};
 }
 function predictor(workouts,exercise,target,today){
   const points=workouts.filter(w=>w.exercise.toLowerCase()===exercise.toLowerCase()&&w.date<=today&&w.date>=U.shift(today,-90)&&w.weight>0&&w.sets>=1&&w.reps>=1&&w.reps<=10).map(w=>({date:w.date,value:w.weight*(1+w.reps/30)}));
   const fit=trend(points);if(!fit)return {message:'Need three dated loaded sessions spanning seven days, within 90 days, with 1–10 reps. Bodyweight and unknown added loads are excluded.'};
   const best=Math.max(...points.map(p=>p.value)),wait=(target-fit.last.value)/fit.slope;
   return {best,message:best>=target?'Estimated strength milestone already reached.':fit.slope>0&&wait>0&&wait<=180?`Trend estimate: ${U.shift(fit.last.date,Math.ceil(wait))}. Epley estimated 1RM; not a safe lifting prescription or guarantee.`:'No credible increasing trend within six months. Keep logging comparable sessions.'};
 }
 function replacements(id,equipment,excluded){const e=T.library.find(x=>x.id===id);return e?T.available(equipment).filter(x=>x.group===e.group&&x.id!==id&&!excluded.includes(x.id)):[];}
 const programs=[{id:'foundation',name:'Foundation · 3 days',detail:'Full-body practice, 30 minutes, general fitness.',options:{days:3,minutes:30,goal:'general',core:true,cardio:false}},{id:'strength',name:'Strength · 3 days',detail:'Longer rests, 45 minutes. Choose loads yourself.',options:{days:3,minutes:45,goal:'strength',core:true,cardio:false}},{id:'muscle',name:'Muscle · 4 days',detail:'Full-body rotation, 45 minutes.',options:{days:4,minutes:45,goal:'muscle',core:true,cardio:false}}];
 function calendar(state,end,count=35){return Array.from({length:count},(_,i)=>{const date=U.shift(end,i-count+1);return {date,workouts:state.workouts.filter(w=>w.date===date).length,meals:state.meals.filter(m=>m.date===date).length,planned:(state.upgrade?.schedule||[]).filter(s=>s.date===date&&s.status==='planned').length};});}
 function weekly(state,today){
   const summarize=(end)=>{const from=U.shift(end,-6),w=state.workouts.filter(x=>x.date>=from&&x.date<=end),m=state.meals.filter(x=>x.date>=from&&x.date<=end),logged=new Set(m.map(x=>x.date)).size;return {trainingDays:new Set(w.map(x=>x.date)).size,mealDays:logged,cal:logged?Math.round(m.reduce((s,x)=>s+x.cal,0)/logged):null,sets:w.reduce((s,x)=>s+x.sets,0)};};
   return {current:summarize(today),previous:summarize(U.shift(today,-7))};
 }
 function scale(food,qty){if(!food||!Number.isFinite(qty)||qty<=0||qty>100)throw Error('Choose a food and 0–100 servings.');return {name:`${food[0]} · ${qty} × ${food[1]}`,cal:food[2]*qty,p:food[3]*qty,c:food[4]*qty,f:food[5]*qty};}
 function mealDraft(text,foods){const match=String(text).trim().match(/^(\d+(?:\.\d+)?) servings? of (.+)$/i);if(!match)throw Error('Say or type: 2 servings of Chicken Breast. Use an exact library name.');const food=foods.find(f=>f[0].toLowerCase()===match[2].trim().toLowerCase());if(!food)throw Error('Food not found. Add a custom food with nutrition first.');return scale(food,Number(match[1]));}
 function nutritionQuality(state,date){const meals=state.meals.filter(m=>m.date===date),ids=new Set(meals.map(m=>m.id)),rows=(state.complete?.nutrients||[]).filter(n=>ids.has(n.mealId)),totals={},sources=new Set(rows.map(n=>n.source)),keys={fiber:['1079','g'],sodium:['1093','mg'],calcium:['1087','mg'],iron:['1089','mg']};for(const [k,[id,unit]]of Object.entries(keys)){const present=rows.filter(n=>n[k]!==undefined);let value=present.reduce((s,n)=>s+n[k],0),covered=new Set(present.map(n=>n.mealId)),partial=0;for(const meal of meals){if(covered.has(meal.id))continue;const matches=meal.recipeBasisMacros&&['cal','p','c','f'].every(x=>meal[x]===meal.recipeBasisMacros[x]);if(!matches)continue;const n=meal.recipeNutrients?.[id]??meal.recipeNutrients?.[k];if(!n||!Number.isFinite(n.value)||n.value<0)continue;const from=String(n.unit).toLowerCase(),mass={g:1,mg:.001,'µg':.000001,'μg':.000001,ug:.000001};if(!Object.hasOwn(mass,from))continue;value+=n.value*mass[from]/mass[unit];if(n.complete===true&&Number.isInteger(n.coveredIngredients)&&n.coveredIngredients>0&&n.coveredIngredients===n.totalIngredients)covered.add(meal.id);else partial++;if(meal.source)sources.add(meal.source);}totals[k]={value,covered:covered.size,partial};}return {meals:meals.length,totals,protein:meals.reduce((s,m)=>s+m.p,0),sources:[...sources]};}

 function restaurantSearch(rows,query,max){return rows.filter(x=>(x.restaurant+' '+x.name).toLowerCase().includes(query.trim().toLowerCase())&&(!Number.isFinite(max)||x.cal<=max));}
 function workoutCommand(text){const t=String(text).trim().toLowerCase();if(t==='stop rest')return {action:'stop'};const m=t.match(/^(sets|reps|rest) (\d+)(?: seconds?)?$/);if(!m)throw Error('Use: sets 3, reps 10, rest 60 seconds, or stop rest.');const n=Number(m[2]),max={sets:20,reps:100,rest:600}[m[1]];if(n<1||n>max)throw Error(`Use ${m[1]} between 1 and ${max}.`);return {action:m[1],value:n};}
 const api={identify,muscleFor,muscles,trend,goalStatus,volume,predictor,replacements,programs,calendar,weekly,scale,mealDraft,nutritionQuality,restaurantSearch,workoutCommand};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MacroComplete=api;
})(typeof window!=='undefined'?window:globalThis);
