/* Pure training rules shared by the PWA and Node tests. No network required. */
(function (root) {
  'use strict';
  const equipment = ['Dumbbells', 'Bench', 'Resistance bands', 'Barbell', 'Squat rack', 'Pull-up bar', 'Stationary bike'];
  const rows = [
    ['push-up','Push-Up','Push',[], 'Keep your body straight; lower under control.'],
    ['floor-press','Dumbbell Floor Press','Push',['Dumbbells'],'Keep wrists stacked over elbows; pause gently on the floor.'],
    ['bench-press','Dumbbell Bench Press','Push',['Dumbbells','Bench'],'Keep feet planted and lower with control.'],
    ['band-press','Band Chest Press','Push',['Resistance bands'],'Use a secure anchor; press without shrugging.'],
    ['row','Dumbbell Row','Pull',['Dumbbells'],'Hinge at hips and pull elbow toward your waist.'],
    ['band-row','Band Row','Pull',['Resistance bands'],'Use a secure anchor and draw shoulder blades together.'],
    ['pull-up','Pull-Up','Pull',['Pull-up bar'],'Use a secure bar and a controlled range.'],
    ['prone-pull','Prone W Raise','Pull',[],'Lie face down; raise arms into a W without arching. Low-load fallback, not an equivalent to a loaded row.'],
    ['squat','Bodyweight Squat','Legs',[],'Keep heels down; use a comfortable depth.'],
    ['goblet','Goblet Squat','Legs',['Dumbbells'],'Hold the weight close; keep knees tracking over toes.'],
    ['barbell-squat','Barbell Squat','Legs',['Barbell','Squat rack'],'Set safety bars and use a controlled depth.'],
    ['lunge','Reverse Lunge','Legs',[],'Step back and lower under control; alternate sides.'],
    ['bridge','Glute Bridge','Hinge',[],'Drive through heels without arching your back.'],
    ['rdl','Dumbbell Romanian Deadlift','Hinge',['Dumbbells'],'Push hips back; keep weights close and spine neutral.'],
    ['dead-bug','Dead Bug','Core',[],'Keep lower back gently against the floor; alternate limbs.'],
    ['crunch','Controlled Crunch','Core',[],'Curl shoulders up gently without pulling your neck.'],
    ['march','Brisk March','Cardio',[],'March at a comfortable pace with room to move.'],
    ['bike','Stationary Bike','Cardio',['Stationary bike'],'Adjust seat and ride at a comfortable pace.']
  ];
  const library = rows.map(([id,name,group,requires,cue])=>({id,name,group,requires,cue}));
  const available = inventory => library.filter(e=>e.requires.every(r=>inventory.includes(r)));
  function generate(options, inventory) {
    const {days,minutes,goal,core,cardio}=options;
    if(!Number.isInteger(days)||days<3||days>6||![20,30,45,60].includes(minutes)||!['strength','muscle','general'].includes(goal)||typeof core!=='boolean'||typeof cardio!=='boolean'||!Array.isArray(inventory)) throw Error('Invalid routine preferences');
    const pool=available(inventory), reps=goal==='strength'?6:goal==='muscle'?10:12, rest=goal==='strength'?120:60;
    const slots=(days<=4?4:2)+(core?1:0);
    const sets=Math.max(1,Math.min(goal==='strength'?4:3,Math.floor(((minutes-3-(cardio?5:0))/slots-1)/(rest/60+0.75))));
    // Conservative per-set estimate includes movement, rest and transitions.
    const strengthMinutes=sets*(rest/60+0.75)+1;
    return Array.from({length:days},(_,i)=>{
      const exercises=[]; let used=3; // Warm-up budget.
      const full=['Legs','Push','Pull','Hinge'];
      const groups=days<=4?[...full.slice(i%4),...full.slice(0,i%4)]:i%3===0?['Push','Pull']:i%3===1?['Legs','Hinge']:['Pull','Push'];
      const add=(group,optional=false)=>{
        const choices=pool.filter(e=>e.group===group).sort((a,b)=>b.requires.length-a.requires.length);
        const exercise=choices[(Math.floor(i/3))%choices.length];
        const cost=group==='Cardio'?5:strengthMinutes;
        if(!exercise||used+cost>minutes)return;
        exercises.push({exerciseId:exercise.id,sets:group==='Cardio'?1:sets,reps:group==='Cardio'?5:reps,rest:group==='Cardio'?0:rest,unit:group==='Cardio'?'minutes':'reps',optional});used+=cost;
      };
      // Reserve preference slots first, then add balanced main movements.
      if(core)add('Core',true); if(cardio)add('Cardio',true);
      for(const group of groups)add(group);
      return {name:`Day ${i+1} · ${days<=4?'Full body':['Upper','Lower','Upper'][i%3]}`,estimatedMinutes:Math.ceil(used),exercises};
    });
  }
  function validState(s){
    try{
      if(!s||!Array.isArray(s.equipment)||s.equipment.length>100||s.equipment.some(x=>typeof x!=='string'||!x.trim()||x.length>60)||!Array.isArray(s.routine)||s.routine.length>6)return false;
      generate(s.options,s.equipment);
      return s.routine.every(d=>typeof d.name==='string'&&d.name.length<=100&&Number.isFinite(d.estimatedMinutes)&&d.estimatedMinutes>0&&Array.isArray(d.exercises)&&d.exercises.length<=20&&d.exercises.every(x=>available(s.equipment).some(e=>e.id===x.exerciseId)&&Number.isInteger(x.sets)&&x.sets>0&&x.sets<=10&&Number.isInteger(x.reps)&&x.reps>0&&x.reps<=100&&Number.isFinite(x.rest)&&x.rest>=0&&x.rest<=600&&['minutes','reps'].includes(x.unit)));
    }catch{return false;}
  }
  const api={equipment,library,available,generate,validState};
  if(typeof module!=='undefined'&&module.exports)module.exports=api; else root.MacroTraining=api;
})(typeof window!=='undefined'?window:globalThis);
