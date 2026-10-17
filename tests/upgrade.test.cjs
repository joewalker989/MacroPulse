const {test}=require('node:test'),assert=require('node:assert/strict');
const U=require('../upgrade.js'),T=require('../training.js');
const routine=T.generate({days:3,minutes:30,goal:'muscle',core:true,cardio:false},[]);
test('streaks ignore duplicate checks and use local calendar days across month boundaries',()=>{
 const checks=['2026-02-27','2026-02-28','2026-03-01','2026-03-01'].map(date=>({habitId:'a',date}));
 assert.equal(U.streak(checks,'a','2026-03-02'),3);assert.equal(U.streak(checks,'a','2026-03-03'),0);assert.equal(U.shift('2026-03-01',-1),'2026-02-28');
});
test('low readiness shifts sessions, skips occupied days and leaves original routine intact',()=>{
 const copy=JSON.stringify(routine),normal=U.schedule(routine,'2026-10-17',3),low=U.schedule(routine,'2026-10-17',1,[{date:'2026-10-18',status:'planned'}]);
 assert.equal(normal[0].date,'2026-10-17');assert.equal(low[0].date,'2026-10-19');assert.ok(low.every(x=>x.light));assert.equal(new Set(low.map(x=>x.date)).size,3);
 const light=U.prescription(routine[0],true);assert.ok(light.exercises.every((x,i)=>x.sets<=routine[0].exercises[i].sets));assert.equal(JSON.stringify(routine),copy);
 assert.throws(()=>U.schedule([],'2026-10-17',3));
});
test('only recent hard ratings trigger recovery suggestions',()=>{
 const s={workouts:[{id:'a',date:'2026-10-16'},{id:'b',date:'2026-10-17'},{id:'c',date:'2026-09-01'}],upgrade:{feedback:[{workoutId:'a',rating:'hard'},{workoutId:'b',rating:'hard'},{workoutId:'c',rating:'hard'}]}};
 assert.equal(U.recovery(s,'2026-10-17').deload,true);assert.equal(U.recovery(s,'2026-10-25').deload,false);
 assert.equal(U.warmup(routine[0],T.library).length,4);
});
test('plate solver handles standard, non-greedy, fractional and unreachable loads',()=>{
 assert.deepEqual(U.plates(135,45,[45,25,10,5,2.5]).perSide,[45]);assert.equal(U.plates(12,0,[4,3]).actual,12);assert.equal(U.plates(48,45,[2.5]).actual,45);
 assert.equal(U.plates(22.5,20,[1.25]).actual,22.5);assert.throws(()=>U.plates(20,45,[5]));assert.throws(()=>U.plates(100,45,[0]));
 assert.equal(U.plates(3000,0,[0.01]).actual,3000);assert.throws(()=>U.plates(100,45,[0.001]));
});
test('meal scaling and grocery consolidation respect serving units and changed quantities',()=>{
 const f={name:'Rice',serving:'cup',qty:2,cal:200,p:4,c:44,f:1},plan=[{items:[f]},{items:[{...f,qty:.5},{...f,serving:'gram',qty:100}]}];
 assert.deepEqual(U.mealTotals([f]),{cal:400,p:8,c:88,f:2});const rows=U.groceries(plan);assert.equal(rows.length,2);assert.equal(rows[0].qty,2.5);
 assert.equal(U.groceries(plan,[{...rows[0],checked:true}])[0].checked,true);assert.equal(U.groceries([{items:[f]}],[{...rows[0],checked:true}])[0].checked,false);
});
test('transformation uses recorded history, chronological endpoints and both goal directions',()=>{
 assert.equal(U.transformation({weights:[],settings:{goal:180}}).change,null);
 const s={weights:[{date:'2026-10-17',value:190},{date:'2026-10-01',value:200}],settings:{goal:180}};assert.equal(U.transformation(s).goalProgress,50);assert.equal(U.transformation(s).average,190);
 assert.equal(U.transformation({weights:[{date:'2026-10-01',value:150},{date:'2026-10-17',value:160}],settings:{goal:170}}).goalProgress,50);
});
