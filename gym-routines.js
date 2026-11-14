/* Fixed, editable training templates for generally healthy adults. No calorie or outcome predictions. */
(function(root){
 'use strict';
 const T=typeof module!=='undefined'&&module.exports?require('./training'):root.MacroTraining;
 const lift=(exerciseId,sets,min,max,rest=90)=>({exerciseId,sets,reps:min,repMin:min,repMax:max,rest,unit:'reps',targetNote:`Target ${min}–${max} reps per set. Choose a controllable load; finish with about 2–3 reps left. Increase the smallest available load only after all sets reach the upper end with good control.`});
 const cardio=minutes=>({exerciseId:'bike',sets:1,reps:minutes,rest:0,unit:'minutes',targetNote:'Moderate, conversational pace. Reduce time or intensity if needed; no calorie burn is assumed.'});
 const day=(name,exercises)=>({name,exercises});
 const progression='Repeat the weekly schedule for 4–6 weeks. Start at the lower rep target with roughly 2–3 reps left. When every set reaches the upper target with good control on two sessions, use the smallest available load increase and return to the lower target. For bodyweight moves, add controlled reps before increasing difficulty. Reduce load or sets when recovery is poor; stop for pain.';
 const base={catalog:'gym',progression,warmup:'Allow about 8 minutes for easy movement and light rehearsal/ramp-up sets before working sets. Warm-up sets are not included in the listed working sets.',effort:'Choose starting loads yourself; no max testing or training to failure is required.',safety:'General templates, not injury-specific prescriptions. Review unfamiliar lifts with a qualified trainer. Use the existing readiness check before a live session.'};
 const rows=[
  {...base,id:'gym-foundation',name:'Gym Foundation · 3 days',level:'Beginner / returning',focus:'Build a consistent full-body strength habit',schedule:'Mon A · Wed B · Fri C; recovery days between sessions.',options:{days:3,minutes:45,goal:'general',core:true,cardio:false},days:[
   day('Foundation A',[lift('goblet',2,8,12),lift('bench-press',2,8,12),lift('row',2,8,12),lift('rdl',2,8,10),lift('crunch',2,10,15,60)]),
   day('Foundation B',[lift('squat',2,10,15),lift('floor-press',2,8,12),lift('row',2,8,12),lift('bridge',2,10,15,60),lift('shoulder-press',2,8,12),lift('calf-raise',2,12,15,60)]),
   day('Foundation C',[lift('goblet',2,8,12),lift('bench-press',2,8,12),lift('row',2,8,12),lift('rdl',2,8,10),lift('curl',2,10,15,60),lift('crunch',2,10,15,60)])]},
  {...base,id:'gym-fat-loss',name:'Strength + Cardio · 3 days',level:'Beginner / returning',focus:'Support fat loss while maintaining strength',schedule:'Mon A · Wed B · Fri C. Add comfortable walking on other days as recovery allows.',weightNote:'Exercise supports weight management; fat loss also depends on food intake and overall energy balance. This plan does not promise weight loss, estimate burn, or change your food targets.',options:{days:3,minutes:60,goal:'general',core:true,cardio:true},days:[
   day('Strength + Cardio A',[lift('goblet',2,8,12),lift('bench-press',2,8,12),lift('row',2,8,12),lift('rdl',2,8,10),lift('crunch',2,10,15,60),cardio(12)]),
   day('Strength + Cardio B',[lift('squat',2,10,15),lift('floor-press',2,8,12),lift('row',2,8,12),lift('bridge',2,10,15,60),lift('calf-raise',2,12,15,60),cardio(15)]),
   day('Strength + Cardio C',[lift('goblet',2,8,12),lift('bench-press',2,8,12),lift('row',2,8,12),lift('rdl',2,8,10),lift('curl',2,10,15,60),cardio(12)])]},
  {...base,id:'gym-muscle',name:'Muscle Builder · 4 days',level:'Intermediate',focus:'Upper/lower split with repeatable working volume',schedule:'Mon Upper A · Tue Lower A · Thu Upper B · Fri Lower B; Wed/weekend recovery or easy activity.',adaptation:'For pull-ups, use only reps you can control. If needed, substitute dumbbell rows in My Routine rather than forcing the rep target.',options:{days:4,minutes:60,goal:'muscle',core:true,cardio:false},days:[
   day('Upper A',[lift('bench-press',3,8,12,120),lift('row',3,8,12,120),lift('shoulder-press',2,8,12),lift('curl',2,10,15,60),lift('push-up',2,6,12)]),
   day('Lower A',[lift('barbell-squat',3,6,10,120),lift('rdl',3,8,12,120),lift('bridge',2,10,15),lift('calf-raise',3,12,15,60),lift('crunch',2,10,15,60)]),
   day('Upper B',[lift('bench-press',3,8,12,120),lift('pull-up',3,5,8,120),lift('row',2,8,12,120),lift('shoulder-press',2,8,12),lift('curl',2,10,15,60)]),
   day('Lower B',[lift('goblet',3,10,12,120),lift('rdl',3,8,12,120),lift('bridge',2,10,15),lift('calf-raise',3,12,15,60),lift('crunch',2,10,15,60)])]},
  {...base,id:'gym-strength-muscle',name:'Strength & Muscle · 3 days',level:'Intermediate',focus:'Full-body compounds with longer rests',schedule:'Mon A · Wed B · Fri C; leave recovery days between lifting sessions.',adaptation:'Use rack safeties for barbell squats. Substitute dumbbell rows if controlled pull-ups are not available to you.',options:{days:3,minutes:60,goal:'strength',core:true,cardio:false},days:[
   day('Strength A',[lift('barbell-squat',3,5,8,150),lift('bench-press',3,5,8,150),lift('row',3,6,10,120),lift('rdl',2,6,10,120),lift('crunch',2,10,15,60)]),
   day('Strength B',[lift('goblet',3,8,10,120),lift('shoulder-press',3,6,10,120),lift('pull-up',3,5,8,150),lift('bridge',3,8,12),lift('curl',2,8,12,60)]),
   day('Strength C',[lift('barbell-squat',3,5,8,150),lift('bench-press',3,5,8,150),lift('row',3,6,10,120),lift('rdl',2,6,10,120),lift('calf-raise',2,12,15,60)])]}
 ];
 // Planning allowance: warm-up 8 min, cool-down 3 min, transitions 1 min/exercise,
 // upper rep bound at ~4 seconds/rep, and all between-set rests. Not an outcome forecast.
 function estimate(exercises){return Math.ceil(11+exercises.length+exercises.reduce((sum,e)=>sum+(e.unit==='minutes'?e.reps:e.sets*e.repMax*4/60+Math.max(0,e.sets-1)*e.rest/60),0));}
 function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
 const programs=freeze(rows.map(p=>{const days=p.days.map(d=>({...d,estimatedMinutes:estimate(d.exercises)}));const required=[...new Set(days.flatMap(d=>d.exercises.flatMap(e=>T.library.find(x=>x.id===e.exerciseId).requires)))];return {...p,days,required,detail:p.focus+'. '+p.level+'.',cardioMinutes:days.flatMap(d=>d.exercises).filter(e=>e.unit==='minutes').reduce((n,e)=>n+e.reps,0)};}));
 function preview(id,equipment,excluded=[]){
  const p=programs.find(p=>p.id===id);if(!p)throw Error('Choose a known gym routine.');if(!Array.isArray(equipment)||!Array.isArray(excluded))throw Error('Review your equipment and movement preferences.');
  const missing=p.required.filter(x=>!equipment.includes(x)),avoided=[...new Set(p.days.flatMap(d=>d.exercises.map(e=>e.exerciseId)).filter(x=>excluded.includes(x)))];
  const training={equipment:[...equipment],options:{...p.options},routine:p.days.map(d=>({...structuredClone(d),programId:p.id,programGuidance:p.schedule+' '+p.warmup+' '+p.progression}))};
  return {program:p,training,missing,avoided,canApply:!missing.length&&!avoided.length&&T.validState(training)};
 }
 const api={programs,preview,estimate};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MacroGymRoutines=api;
})(typeof window!=='undefined'?window:globalThis);
