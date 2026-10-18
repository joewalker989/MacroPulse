const {test}=require('node:test'),a=require('node:assert/strict'),S=require('../six.js'),H=require('../health.js'),D=require('../data.js'),T=require('../training.js');
const base=()=>({settings:{cal:2000,p:150,c:200,f:60,goal:180},weight:200,weights:[],meals:[],workouts:[],foods:[],supplements:{},unknown:{preserve:true}});
const p={units:'us',sex:'male',age:30,height:177.8,activity:1.55,mode:'lose',rate:1,protein:1.6,fat:.25,eligible:true};
test('6.0 lazy extension preserves all old fields and independent immutable byte snapshot; quota failures abort',()=>{
 const old=base(),raw=JSON.stringify(old),map=new Map([[D.KEY,raw]]),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};a.equal(D.valid(old,T),true);
 const s={...old,six:{...S.defaults(),future:{keep:true}}};D.write(storage,s,T);a.equal(map.get(D.SIX_MIGRATION),raw);D.write(storage,s,T);a.equal(map.get(D.SIX_MIGRATION),raw);a.deepEqual(JSON.parse(map.get(D.KEY)),s);
 const full={getItem:k=>k===D.KEY?raw:null,setItem:()=>{throw Error('quota')}};a.throws(()=>D.write(full,s,T));a.equal(full.getItem(D.KEY),raw);
});
test('6.0 rejects future schemas, invalid dates, malformed nested data, budgets and duplicate IDs',()=>{
 const d=S.defaults();for(const patch of [{version:2},{measurements:[{id:'m',date:'2026-02-30',waist:80,note:''}]},{budgets:[{id:'b',start:'2026-10-12',amounts:[0,0,0,0,0,0,0]}]},{kitchen:[null]},{recovery:[{}]},{costs:[{}]},{proteinSlots:{x:7}},{nutrientGoals:{magic:10}},{targetHistory:[{}]}]){a.equal(D.valid({...base(),six:{...d,...patch}},T),false);}
 const item={id:'x',name:'Rice',qty:1,unit:'cup',expires:''};a.equal(S.valid({...d,kitchen:[item,item]}),false);
});
test('weekly budget uses Monday, explicit plans and completion attestations; missing food is unknown',()=>{
 const s={...base(),six:S.defaults()};s.meals=[{id:'m',date:'2026-10-13',cal:500}];s.six.recovery=[{date:'2026-10-13',completeFood:true}];s.six.targetHistory=[{date:'2026-10-14',after:{cal:2100}}];
 const b=S.budget(s,'2026-10-17');a.equal(b.start,'2026-10-12');a.equal(b.days[0].logged,0);a.equal(b.days[0].complete,false);a.equal(b.completeDays,1);a.equal(b.days[2].target,2100);a.equal(b.total,14500);
 s.six.budgets=[{start:b.start,amounts:[2000,2000,2100,2100,2200,2300,2400]}];a.equal(S.budget(s,'2026-10-17').total,15100);a.equal(S.budget(s,'2026-10-17').days[6].future,true);
});
test('smoothing deduplicates by date, excludes future points and does not fill missing dates',()=>{
 const r=S.smooth([{date:'2026-10-01',value:200},{date:'2026-10-01',value:202},{date:'2026-10-03',value:198},{date:'2026-10-20',value:100}],'2026-10-17');a.equal(r.length,2);a.equal(r[0].value,202);a.equal(r[1].average,200);a.equal(r[1].count,2);
});
test('protein assignment accounts for unassigned/out-of-range slots and nutrient gaps gate coverage',()=>{
 const s={...base(),six:S.defaults(),meals:[{id:'a',date:'2026-10-17',p:30},{id:'b',date:'2026-10-17',p:20}],complete:{nutrients:[{mealId:'a',source:'Label',fiber:3}]}};
 s.six.proteinSlots={a:1,b:5};a.equal(S.distribution(s,'2026-10-17').unassigned,20);a.equal(S.distribution(s,'2026-10-17').slots[0].logged,30);s.six.nutrientGoals={fiber:25};let g=S.gaps(s,'2026-10-17');a.equal(g.protein,100);a.equal(g.nutrients[0].gap,null);s.complete.nutrients.push({mealId:'b',source:'Label',fiber:2});a.equal(S.gaps(s,'2026-10-17').nutrients[0].gap,20);
});
test('local swaps exclude original and enforce serving limits without mutating foods',()=>{
 const foods=[['A','cup',500,10,0,0],['B','100g',200,30,0,0],['C','serving',600,50,0,0]],before=structuredClone(foods),r=S.swaps(foods,0,400,20);a.equal(r.length,1);a.equal(r[0].calChange,-300);a.deepEqual(foods,before);a.throws(()=>S.swaps(foods,9,400,20));
});
test('meal costs keep currencies separate and exclude removed meal records',()=>{
 const s={...base(),six:S.defaults(),meals:[{id:'a',date:'2026-10-17'},{id:'b',date:'2026-10-17'}]};s.six.costs=[{mealId:'a',currency:'USD',amount:5},{mealId:'b',currency:'EUR',amount:4},{mealId:'removed',currency:'USD',amount:99}];a.deepEqual(S.costs(s,'2026-10-11','2026-10-17'),{totals:{USD:5,EUR:4},covered:2,meals:2,orphaned:1});
});
test('1RM plateau gates comparable positive loads/reps, distinct dates and observed span',()=>{
 const w=(date,weight=100,reps=5)=>({date,exercise:'Dumbbell Row',weight,reps,sets:3});const s={...base(),workouts:[w('2026-10-01'),w('2026-10-08'),w('2026-10-17'),w('2026-10-17',0),w('2026-10-17',1000,20)]};const r=S.strength(s,'Dumbbell Row','2026-10-17');a.equal(r.points.length,3);a.ok(Math.abs(r.best-116.6667)<.01);a.equal(r.plateau,true);a.equal(S.strength({...s,workouts:[w('2026-10-17'),w('2026-10-17') ]},'Dumbbell Row','2026-10-17').eligible,false);
});
test('time analytics excludes per-set live durations from manual sum; equipment uses actual inventory',()=>{
 const s={...base(),five:{sessions:[{status:'finished',started:'2026-10-17T12:00:00Z',finished:'2026-10-17T12:30:00Z'}],inventory:[{kind:'Dumbbells'}]},workouts:[{date:'2026-10-17',sessionId:'x',duration:1},{date:'2026-10-17',duration:20}]};a.deepEqual(S.times(s,'2026-10-17'),{sessions:1,elapsed:30,average:30,manualEntryMinutes:20});a.ok(S.equipment(s).have.includes('Dumbbells'));
});
test('daily rules respect pain/readiness; scenarios stay hypothetical and reports expose coverage',()=>{
 const s={...base(),six:S.defaults(),health:{...H.defaults(),profile:p}};a.match(S.checkin(s,'2026-10-17',{pain:true}).advice,/Pain/);a.match(S.checkin(s,'2026-10-17',{energy:1}).advice,/Low readiness/);
 const before=structuredClone(s),r=S.scenario(p,200,180,2);a.equal(r.mode,'lose');a.ok(r.limited);a.ok(r.weeks>10);a.deepEqual(s,before);a.throws(()=>S.scenario({...p,eligible:false},200,180,1));const report=S.report(s,'2026-10-17');a.equal(report.from,'2026-10-11');a.equal(report.weekly.current.cal,null);a.ok(report.scope.includes('No photos'));
});
