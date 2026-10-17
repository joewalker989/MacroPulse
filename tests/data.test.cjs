const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const base=path.resolve(__dirname,'..');
const training=require('../training.js');
const KEY='macropulse_pwa_v1';
const legacy={settings:{cal:2100,p:150,c:200,f:70,goal:175},weight:200,weights:[{date:'2026-10-16',value:200}],meals:[{id:'meal1',date:'2026-10-16',name:'Existing meal',cal:400,p:30,c:40,f:12}],workouts:[{id:'work1',date:'2026-10-16',exercise:'Row',sets:3,reps:8,weight:20,duration:20,cal:0}],foods:[['Saved food','serving',100,10,10,2]],supplements:{'2026-10-16':[1]},unrelatedExtension:{keep:true}};
function boot(raw){
  const elements=new Map(),alerts=[];let saved=raw,captured,exported;
  const element=id=>{if(!elements.has(id))elements.set(id,{value:'',style:{},innerHTML:'',textContent:'',classList:{add(){},remove(){},toggle(){}},addEventListener(){},click(){},elements:{}});return elements.get(id)};
  const context={document:{getElementById:element,querySelectorAll:()=>[],addEventListener(){},createElement:()=>element('download')},localStorage:{getItem:()=>saved,setItem:(key,value)=>{assert.equal(key,KEY);saved=value}},window:{MacroTraining:training,mountTraining:api=>(captured=api,{render(){}})},alert:m=>alerts.push(m),confirm:()=>true,Blob:class {constructor(parts){exported=parts.join('')}},URL:{createObjectURL:()=>'',revokeObjectURL(){}},setTimeout(){},navigator:{},location:{protocol:'http:'},console};
  vm.runInNewContext(fs.readFileSync(path.join(base,'app.js'),'utf8'),context);
  return {api:()=>captured,element,alerts,read:()=>saved,export:()=>{element('exportBtn').onclick();return JSON.parse(exported)}};
}
test('equipment saves preserve legacy entries, storage key and unrelated fields',()=>{
  const app=boot(JSON.stringify(legacy)),state=app.api().getState();
  assert.deepEqual(JSON.parse(JSON.stringify(state)),legacy);
  const options={days:3,minutes:30,goal:'general',core:true,cardio:false};
  state.training={equipment:['Dumbbells'],options,routine:training.generate(options,['Dumbbells'])};app.api().save();
  const saved=JSON.parse(app.read());for(const key of Object.keys(legacy))assert.deepEqual(saved[key],legacy[key]);
  assert.deepEqual(app.export().data,saved);
  assert.deepEqual(JSON.parse(JSON.stringify(boot(app.read()).api().getState())),saved);
});
test('legacy and extended backups both restore without losing records',async()=>{
  const app=boot(JSON.stringify(legacy));
  for(const data of [legacy,{...legacy,training:{equipment:[],options:{days:3,minutes:30,goal:'general',core:false,cardio:false},routine:[]}}]){
    const input={value:'file',files:[{size:1000,text:async()=>JSON.stringify({format:'MacroPulse',version:1,data})}]};
    await app.element('importFile').onchange({target:input});
    assert.deepEqual(JSON.parse(app.read()),data);
  }
});
test('unreadable saved data and malformed training backups are not overwritten',async()=>{
  const app=boot('{broken');app.api().save();assert.equal(app.read(),'{broken');assert.ok(app.alerts.length>0);
  const good=boot(JSON.stringify(legacy));const raw=good.read();
  await good.element('importFile').onchange({target:{files:[{size:100,text:async()=>JSON.stringify({format:'MacroPulse',version:1,data:{...legacy,training:{equipment:[null]}}})}]}});
  assert.equal(good.read(),raw);
});
