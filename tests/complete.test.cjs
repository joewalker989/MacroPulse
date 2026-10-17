const {test}=require('node:test'),a=require('node:assert/strict'),C=require('../complete.js');
const w=(date,weight=100)=>({date,exercise:'Dumbbell Row',sets:3,reps:5,weight,duration:20,cal:0});
test('volume counts primary muscle once, leaves unknown labels unclassified and excludes out-of-range logs',()=>{
 const v=C.volume([w('2026-10-17'),{...w('2026-10-17'),exercise:'Unknown'},{...w('2026-10-01')}],'2026-10-11','2026-10-17');a.equal(v.groups.Back.sets,3);a.equal(v.groups.Back.load,1500);a.equal(v.unknown,1);a.equal(v.groups.Chest.sets,0);
});
test('goal milestones work both directions and trends require distinct dates and span',()=>{
 const g={metric:'weight',baseline:200,target:180,start:'2026-10-01',due:'2027-01-01'},s={weights:[{date:'2026-10-01',value:200},{date:'2026-10-09',value:195},{date:'2026-10-17',value:190}],workouts:[]};
 a.equal(C.goalStatus(g,s,'2026-10-17').progress,50);a.match(C.goalStatus(g,s,'2026-10-17').suggestion,/Estimated target date/);a.equal(C.trend(Array(3).fill({date:'2026-10-01',value:200})),null);
 a.equal(C.goalStatus({...g,baseline:180,target:200},{...s,weights:[{date:'2026-10-17',value:190}]},'2026-10-17').progress,50);
});
test('predictor gates sparse, flat, declining, bodyweight and high-rep observations',()=>{
 const dates=['2026-10-01','2026-10-09','2026-10-17'];a.match(C.predictor(dates.map(d=>w(d,0)),'Dumbbell Row',200,'2026-10-17').message,/Need/);
 a.match(C.predictor(dates.map(d=>w(d,100)),'Dumbbell Row',200,'2026-10-17').message,/No credible/);
 a.match(C.predictor(dates.map((d,i)=>w(d,100+i*10)),'Dumbbell Row',160,'2026-10-17').message,/Trend estimate/);
});
test('replacement honors equipment and explicit limitations; calendar and review use real logs',()=>{
 a.deepEqual(C.replacements('goblet',[],['squat','lunge']),[]);a.ok(C.replacements('bench-press',[],[]).every(x=>x.requires.length===0));
 const state={workouts:[w('2026-10-17'),w('2026-10-17')],meals:[]};a.equal(C.calendar(state,'2026-10-17').at(-1).workouts,2);a.equal(C.weekly(state,'2026-10-17').current.trainingDays,1);a.equal(C.weekly(state,'2026-10-17').current.cal,null);
});
test('meal transcript accepts only exact library names and bounded servings; restaurant filters saved values',()=>{
 const foods=[['Chicken Breast','100g',165,31,0,3.6]];a.equal(C.mealDraft('2 servings of Chicken Breast',foods).cal,330);a.throws(()=>C.mealDraft('some chicken',foods));a.throws(()=>C.mealDraft('2 servings of mystery',foods));a.throws(()=>C.scale(foods[0],101));
 a.equal(C.restaurantSearch([{restaurant:'Cafe',name:'Salad',cal:300},{restaurant:'Cafe',name:'Burger',cal:700}],'cafe',500).length,1);
});
test('nutrition totals exclude orphaned entries, distinguish missing and true zero, show coverage',()=>{
 const q=C.nutritionQuality({meals:[{id:'a',date:'2026-10-17',p:20},{id:'b',date:'2026-10-17',p:10}],complete:{nutrients:[{mealId:'a',source:'label',iron:0,fiber:3},{mealId:'deleted',source:'old',iron:100}]}},'2026-10-17');a.equal(q.totals.iron.value,0);a.equal(q.totals.iron.covered,1);a.equal(q.totals.calcium.covered,0);a.equal(q.protein,30);
});
