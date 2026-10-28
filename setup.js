/* Guided setup reuses existing schemas. No inferred measurements or automatic calorie changes. */
(function(root){'use strict';
 const H=typeof module!=='undefined'&&module.exports?require('./health'):root.MacroHealth,T=typeof module!=='undefined'&&module.exports?require('./training'):root.MacroTraining,D=typeof module!=='undefined'&&module.exports?require('./data'):root.MacroData;
 function propose(app,v,date){
  if(!D.valid(app,T)||!D.date(date))throw Error('Existing data or setup date is unsupported. Preserve your backup before continuing.');
  if(!['us','metric'].includes(v.units)||!['simple','full'].includes(v.homeView))throw Error('Choose valid units and tracking detail.');
  const next=structuredClone(app),old=app.health?.profile,profile={...(old||{}),units:v.units,sex:v.sex,age:v.age,height:v.height*(v.units==='us'?2.54:1),activity:v.activity,mode:v.mode,rate:v.rate,protein:old?.protein??1.6,fat:old?.fat??.25,eligible:v.eligible};
  if(!H.profile(profile))throw Error('Complete the adult profile with valid height, age, activity and goal choices.');
  const goal=v.goalWeight*(v.units==='metric'?H.LB:1);if(!Number.isFinite(goal)||goal<50||goal>1000)throw Error('Goal weight must be between 50 and 1,000 lb, or its metric equivalent.');
  if(!Array.isArray(v.equipment)||new Set(v.equipment).size!==v.equipment.length)throw Error('Review the equipment list.');
  const training={...(app.training||{}),equipment:[...v.equipment],options:{...(app.training?.options||{}),days:v.days,minutes:v.minutes,goal:v.trainingGoal,core:v.core,cardio:v.cardio},routine:structuredClone(app.training?.routine||[])};
  if(!T.validState(training))throw Error('Check training preferences. Keep equipment used by your existing routine; change that routine in Fitness before removing its required equipment.');
  next.health={...(app.health||H.defaults()),profile};next.training=training;next.settings={...next.settings,goal:Math.abs(goal-app.settings.goal)<1e-7?app.settings.goal:goal};next.complete=next.complete||D.completeDefaults();next.complete.preferences={...next.complete.preferences,homeView:v.homeView};
  if(v.recordWeight){const weight=v.weight*(v.units==='metric'?H.LB:1);if(!Number.isFinite(weight)||weight<50||weight>1000)throw Error('Check the new measured weight.');next.weight=weight;next.weights.push({date,value:weight});}
  if(!D.valid(next,T))throw Error('Setup failed validation. No records changed.');return next;
 }
 const api={propose};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MacroSetup=api;
})(typeof window!=='undefined'?window:globalThis);
