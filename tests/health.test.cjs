const {test}=require('node:test'),a=require('node:assert/strict'),H=require('../health.js'),D=require('../data.js'),T=require('../training.js');
const p={units:'us',sex:'male',age:30,height:177.8,activity:1.2,mode:'lose',rate:1,protein:1.6,fat:.25,eligible:true};
const legacy=()=>({settings:{cal:2000,p:150,c:180,f:65,goal:180},weight:200,weights:[],meals:[],workouts:[],foods:[],supplements:{},unknown:{keep:1}});
test('Mifflin estimate, unit equivalence and macro energy closure',()=>{
 const r=H.calculate(p,200);a.equal(r.bmr,1873);a.equal(r.maintenance,2248);a.equal(r.cal,1873);a.equal(r.limited,true);a.ok(Math.abs(r.p*4+r.c*4+r.f*9-r.cal)<1);
 a.deepEqual(H.calculate({...p,units:'metric'},200),r);a.equal(H.calculate({...p,sex:'female'},200).bmr,1707);
});
test('all requested rates and modes respect loss floor/deficit and gain guardrails',()=>{
 for(const sex of ['male','female'])for(const rate of [.5,1,1.5,2])for(const mode of ['maintain','lose','gain']){
  const r=H.calculate({...p,sex,rate,mode,activity:1.55},200);a.ok(r.cal>=r.bmr-1);a.ok(r.effectiveDelta>=-1000&&r.effectiveDelta<=500);if(mode==='maintain')a.equal(r.cal,r.maintenance);
 }
 for(const bad of [{eligible:false},{age:17},{rate:3},{protein:NaN},{height:0}])a.throws(()=>H.calculate({...p,...bad},200));
 a.throws(()=>H.calculate(p,0));
});
test('Navy formulas reference male/female examples, reject impossible measurements; ideal references',()=>{
 a.ok(Math.abs(H.bodyFat('male',177.8,91.44,38.1,0).percent-21.3)<.2);
 const female=H.bodyFat('female',165.1,76.2,33.02,99.06).percent;a.ok(female>28&&female<33);
 a.throws(()=>H.bodyFat('male',177.8,30,40,0));a.throws(()=>H.bodyFat('female',165.1,76,33,0));
 a.equal(H.ideal('male',152.4).Devine,50);a.equal(H.ideal('male',140),null);
});
test('weekly trend deduplicates same-day entries, respects windows and gates sparse plateau',()=>{
 const w=Array.from({length:21},(_,i)=>({date:`2026-10-${String(i+1).padStart(2,'0')}`,value:200}));a.equal(H.trend(w,'2026-10-21').plateau,true);
 a.equal(H.trend(w.slice(-6),'2026-10-21').plateau,false);a.equal(H.trend(w.slice(-6),'2026-10-21').change,null);
 a.equal(H.trend([...w,{date:'2026-10-21',value:207}],'2026-10-21').weeks[0].average,201);
});
test('5.1 extension remains lazy, preserves unknown fields and takes separate immutable raw snapshot',()=>{
 const old=legacy(),raw=JSON.stringify(old),map=new Map([[D.KEY,raw]]),store={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
 a.equal(D.valid(old,T),true);const next={...old,health:{...H.defaults(),profile:{...p,future:'keep'},future:42}};D.write(store,next,T);a.equal(map.get(D.HEALTH_MIGRATION),raw);a.deepEqual(JSON.parse(map.get(D.KEY)),next);D.write(store,next,T);a.equal(map.get(D.HEALTH_MIGRATION),raw);
 for(const health of [{...H.defaults(),version:2},{...H.defaults(),history:[null]},{...H.defaults(),targets:[{}]}]){a.equal(D.valid({...old,health},T),false);a.throws(()=>D.write(store,{...old,health},T));}
 const full={getItem:k=>k===D.KEY?raw:null,setItem:()=>{throw Error('quota')}};a.throws(()=>D.write(full,next,T));a.equal(full.getItem(D.KEY),raw);
});

