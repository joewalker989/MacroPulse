const {test}=require('node:test'),assert=require('node:assert/strict');
const D=require('../data.js'),T=require('../training.js');
const legacy=()=>({settings:{cal:2000,p:180,c:170,f:65,goal:180},weight:220,weights:[],meals:[],workouts:[],supplements:{},foods:[],extension:{preserve:'untouched'}});
const storage=raw=>{const map=new Map([[D.KEY,raw]]);return {map,getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)}};
test('additive upgrade preserves legacy payload and takes an immutable pre-upgrade snapshot',()=>{
 const original=legacy(),raw=JSON.stringify(original),s=storage(raw),next={...original,upgrade:D.defaults()};
 D.write(s,next,T);assert.equal(s.getItem(D.MIGRATION),raw);assert.deepEqual(JSON.parse(s.getItem(D.KEY)),next);
 next.upgrade.water.push({id:'1',date:'2026-10-17',ml:250});D.write(s,next,T);assert.equal(s.getItem(D.MIGRATION),raw);
});
test('import captures current raw data and failed recovery writes leave it intact',()=>{
 const old=JSON.stringify(legacy()),s=storage(old),next={...legacy(),weight:210};D.write(s,next,T,{replacing:true});assert.equal(s.getItem(D.RECOVERY),old);
 const full=storage(old);full.setItem=()=>{throw Error('Quota exceeded')};assert.throws(()=>D.write(full,next,T));assert.equal(full.getItem(D.KEY),old);
});
test('malformed nested records, future upgrade versions and impossible dates are rejected',()=>{
 for(const patch of [{meals:[null]},{weights:[{date:'2026-02-30',value:200}]},{foods:[['bad','serving',null,0,0,0]]},{supplements:[]},{upgrade:{...D.defaults(),version:2}},{upgrade:{...D.defaults(),water:[{id:'a',date:'2026-10-17',ml:-1}]}}])assert.equal(D.valid({...legacy(),...patch},T),false);
 assert.equal(D.valid(legacy(),T),true);assert.equal(D.valid({...legacy(),upgrade:D.defaults()},T),true);
});
