/* Storage compatibility: retain the original key, records and unknown extensions. */
(function(root){
  'use strict';
  const KEY='macropulse_pwa_v1', RECOVERY=KEY+'_recovery', MIGRATION=KEY+'_before_upgrade', COMPLETE_MIGRATION=KEY+'_before_complete';
  const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
  const number=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
  const text=x=>typeof x==='string';
  const date=x=>text(x)&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&!Number.isNaN(Date.parse(x+'T12:00:00'))&&new Date(x+'T12:00:00').toISOString().slice(0,10)===x;
  function valid(x,training){
    try{return object(x)&&object(x.settings)&&['cal','p','c','f','goal'].every(k=>number(x.settings[k]))&&number(x.weight)&&
      Array.isArray(x.meals)&&x.meals.every(m=>object(m)&&text(m.id)&&date(m.date)&&text(m.name)&&['cal','p','c','f'].every(k=>number(m[k])))&&
      Array.isArray(x.workouts)&&x.workouts.every(w=>object(w)&&text(w.id)&&date(w.date)&&text(w.exercise)&&['sets','reps','weight','duration','cal'].every(k=>number(w[k])))&&
      Array.isArray(x.weights)&&x.weights.every(w=>object(w)&&date(w.date)&&number(w.value))&&
      Array.isArray(x.foods)&&x.foods.every(f=>Array.isArray(f)&&text(f[0])&&text(f[1])&&[2,3,4,5].every(k=>number(f[k])))&&
      object(x.supplements)&&Object.entries(x.supplements).every(([d,a])=>date(d)&&Array.isArray(a)&&a.every(Number.isInteger))&&
      (x.training===undefined||training.validState(x.training))&&(x.upgrade===undefined||validUpgrade(x.upgrade,training))&&(x.complete===undefined||validComplete(x.complete,training));
    }catch{return false;}
  }
  function validUpgrade(u,training){
    if(!object(u)||u.version!==1)return false;
    const arrays=['water','habits','checks','measurements','feedback','schedule','mealPlan','grocery','reviews'];
    if(arrays.some(k=>!Array.isArray(u[k])||u[k].some(x=>!object(x))))return false;
    return number(u.waterGoal)&&u.waterGoal>0&&
      u.water.every(x=>text(x.id)&&date(x.date)&&number(x.ml)&&x.ml>0)&&
      u.habits.every(x=>text(x.id)&&text(x.name)&&x.name.trim())&&
      u.checks.every(x=>text(x.habitId)&&date(x.date))&&
      u.measurements.every(x=>text(x.id)&&date(x.date)&&number(x.waist)&&x.waist>0&&text(x.note))&&
      u.feedback.every(x=>text(x.workoutId)&&['easy','right','hard'].includes(x.rating))&&
      u.schedule.every(x=>text(x.id)&&date(x.date)&&text(x.name)&&Number.isInteger(x.day)&&x.day>=0&&x.day<6&&['planned','done','skipped'].includes(x.status)&&number(x.readiness)&&x.readiness<=5&&(x.light===undefined||typeof x.light==='boolean')&&(x.session===undefined||(training&&training.validState({equipment:training.equipment,options:{days:3,minutes:30,goal:'general',core:true,cardio:false},routine:[x.session]}))))&&
      u.mealPlan.every(x=>text(x.id)&&date(x.date)&&text(x.name)&&Array.isArray(x.items)&&x.items.length>0&&x.items.every(f=>text(f.name)&&text(f.serving)&&number(f.qty)&&f.qty>0&&['cal','p','c','f'].every(k=>number(f[k]))))&&
      u.grocery.every(x=>text(x.id)&&text(x.name)&&text(x.serving)&&number(x.qty)&&typeof x.checked==='boolean')&&
      u.reviews.every(x=>text(x.id)&&date(x.date)&&text(x.exercise)&&text(x.note)&&Array.isArray(x.checks)&&x.checks.every(text));
  }
  function defaults(){return {version:1,waterGoal:2000,water:[],habits:[],checks:[],measurements:[],feedback:[],schedule:[],mealPlan:[],grocery:[],reviews:[]};}
  function completeDefaults(){return {version:1,goals:[],limitations:[],mealTemplates:[],workoutTemplates:[],restaurants:[],nutrients:[],routineArchive:[],preferences:{largeText:false,highContrast:false,reducedMotion:false,startPage:'home'}};}
  function validComplete(c,training){
    try{
      const named=x=>object(x)&&text(x.id)&&text(x.name)&&x.name.trim().length>0&&x.name.length<=120;
      const macros=x=>object(x)&&['cal','p','c','f'].every(k=>number(x[k]));
      const workout=x=>object(x)&&text(x.exercise)&&['sets','reps','weight','duration','cal'].every(k=>number(x[k]))&&x.sets>=1&&x.reps>=1&&x.duration>=1;
      return object(c)&&c.version===1&&['goals','limitations','mealTemplates','workoutTemplates','restaurants','nutrients','routineArchive'].every(k=>Array.isArray(c[k]))&&
        c.goals.every(x=>named(x)&&['weight','trainingDays'].includes(x.metric)&&number(x.baseline)&&number(x.target)&&date(x.start)&&date(x.due)&&x.due>x.start&&(x.metric!=='trainingDays'||(x.target>=1&&x.target<=7&&Number.isInteger(x.target))))&&
        c.limitations.every(x=>text(x)&&training.library.some(e=>e.id===x))&&
        c.mealTemplates.every(x=>named(x)&&x.items.length>0&&x.items.every(y=>text(y.name)&&macros(y)))&&
        c.workoutTemplates.every(x=>named(x)&&x.entries.length>0&&x.entries.every(workout))&&
        c.restaurants.every(x=>named(x)&&text(x.restaurant)&&text(x.serving)&&text(x.source)&&date(x.verified)&&macros(x))&&
        c.nutrients.every(x=>object(x)&&text(x.id)&&text(x.mealId)&&text(x.source)&&x.source.trim()&&['fiber','sodium','calcium','iron'].some(k=>x[k]!==undefined)&&['fiber','sodium','calcium','iron'].every(k=>x[k]===undefined||number(x[k])))&&
        c.routineArchive.every(x=>object(x)&&text(x.id)&&training.validState(x.training))&&
        object(c.preferences)&&['largeText','highContrast','reducedMotion'].every(k=>typeof c.preferences[k]==='boolean')&&['home','food','fitness','stack','progress'].includes(c.preferences.startPage);
    }catch{return false;}
  }
  function write(storage,state,training,{replacing=false}={}){
    if(!valid(state,training))throw Error('Data validation failed. Existing saved data has been preserved.');
    const raw=storage.getItem(KEY), encoded=JSON.stringify(state);
    // Write the recovery copy first. If storage is full, abort before replacing any data.
    if(raw!==null){
      if(replacing)storage.setItem(RECOVERY,raw);
      else if(storage.getItem(MIGRATION)===null)storage.setItem(MIGRATION,raw);
      if(state.complete!==undefined&&storage.getItem(COMPLETE_MIGRATION)===null)storage.setItem(COMPLETE_MIGRATION,raw);
    }
    storage.setItem(KEY,encoded);
  }
  const FIVE_MIGRATION=KEY+'_before_five';
  const baseValid=valid,baseWrite=write;
  function fiveValid(x,training){
    const F=typeof module!=='undefined'&&module.exports?require('./five.js'):root.MacroFive;
    return baseValid(x,training)&&(x.five===undefined||!!F&&F.valid(x.five));
  }
  function fiveWrite(storage,state,training,options){
    if(!fiveValid(state,training))throw Error('Invalid or future 5.0 data. Original data preserved.');
    const raw=storage.getItem(KEY);
    if(raw!==null&&state.five!==undefined&&storage.getItem(FIVE_MIGRATION)===null)storage.setItem(FIVE_MIGRATION,raw);
    baseWrite(storage,state,training,options);
  }
  const api={KEY,RECOVERY,MIGRATION,COMPLETE_MIGRATION,FIVE_MIGRATION,valid:fiveValid,validUpgrade,defaults,completeDefaults,validComplete,write:fiveWrite,date};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MacroData=api;
})(typeof window!=='undefined'?window:globalThis);
