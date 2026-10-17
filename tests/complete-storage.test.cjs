const {test}=require('node:test'),assert=require('node:assert/strict'),D=require('../data.js'),T=require('../training.js');
const legacy=()=>({settings:{cal:2100,p:150,c:200,f:70,goal:175},weight:200,weights:[],meals:[],workouts:[],foods:[],supplements:{},unknown:{keep:true}});
test('complete extension is lazy, additive, round trips unknown fields and preserves raw snapshot',()=>{
 const old=legacy(),raw=JSON.stringify(old),map=new Map([[D.KEY,raw]]),s={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
 const next={...old,complete:{...D.completeDefaults(),futureField:{keep:1}}};D.write(s,next,T);
 assert.deepEqual(JSON.parse(s.getItem(D.KEY)),next);assert.equal(s.getItem(D.MIGRATION),raw);assert.deepEqual(next.unknown,old.unknown);
 D.write(s,old,T,{replacing:true});assert.deepEqual(JSON.parse(s.getItem(D.RECOVERY)),next);
});
test('future versions, broken templates, preferences, micronutrients and dates block replacement',()=>{
 for(const patch of [{version:2},{mealTemplates:[{id:'a',name:'Bad',items:null}]},{preferences:{largeText:'yes'}},{nutrients:[{id:'n',mealId:'m',source:'',iron:2}]},{goals:[{id:'g',name:'Goal',metric:'weight',baseline:200,target:180,start:'2026-10-17',due:'2026-02-30'}]}])assert.equal(D.valid({...legacy(),complete:{...D.completeDefaults(),...patch}},T),false);
});
