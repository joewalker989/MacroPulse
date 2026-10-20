/* Connected tools: pure adapters. Imported observations never silently become diary records. */
(function(root){
 'use strict';
 const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),text=(x,max=200)=>typeof x==='string'&&x.length<=max;
 const number=(x,min=0,max=1e7)=>typeof x==='number'&&Number.isFinite(x)&&x>=min&&x<=max;
 const date=x=>text(x,10)&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&Number.isFinite(Date.parse(x+'T12:00:00Z'))&&new Date(x+'T12:00:00Z').toISOString().slice(0,10)===x;
 const stamp=x=>text(x,50)&&Number.isFinite(Date.parse(x));
 const shift=(d,n)=>{if(!date(d))throw Error('Choose a valid date.');const v=new Date(d+'T12:00:00Z');v.setUTCDate(v.getUTCDate()+n);return v.toISOString().slice(0,10);};
 const kinds=['weight','steps','activeEnergy','heartRate','sleep','workout'];
 const units={weight:'lb',steps:'count',activeEnergy:'kcal',heartRate:'bpm',sleep:'min',workout:'min'};
 const defaults=()=>({version:1,observations:[],imports:[],products:[],programs:[],autoRest:false});
 const observation=r=>obj(r)&&kinds.includes(r.type)&&text(r.source,120)&&r.source.trim()&&stamp(r.start)&&stamp(r.end)&&Date.parse(r.end)>=Date.parse(r.start)&&date(r.date)&&r.date===r.start.slice(0,10)&&number(r.value,0,r.type==='weight'?1000:1e7)&&r.unit===units[r.type];
 const macro=x=>obj(x)&&['cal','p','c','f'].every(k=>number(x[k],0,10000));
 const product=x=>macro(x)&&text(x.code,20)&&/^\d{8,14}$/.test(x.code)&&text(x.name,120)&&x.name.trim()&&['100 g','100 ml','100 g/ml (check label)'].includes(x.serving)&&text(x.source,500)&&x.source===`https://world.openfoodfacts.org/product/${x.code}`&&obj(x.nutrients)&&Object.entries(x.nutrients).every(([k,v])=>text(k,80)&&number(v,0,1e7))&&stamp(x.fetched);
 function valid(s){try{return obj(s)&&s.version===1&&typeof s.autoRest==='boolean'&&Array.isArray(s.observations)&&s.observations.length<=3000&&s.observations.every(observation)&&Array.isArray(s.imports)&&s.imports.length<=100&&s.imports.every(i=>obj(i)&&text(i.id,160)&&i.id&&stamp(i.at)&&text(i.name,120)&&number(i.added,0,3000))&&Array.isArray(s.products)&&s.products.length<=200&&s.products.every(product)&&Array.isArray(s.programs)&&s.programs.length<=20&&s.programs.every(p=>obj(p)&&text(p.id,160)&&p.id&&text(p.name,120)&&p.name.trim()&&date(p.start)&&Number.isInteger(p.weeks)&&number(p.weeks,2,12)&&number(p.increment,0,10)&&Number.isInteger(p.deloadEvery)&&number(p.deloadEvery,2,6)&&Array.isArray(p.days)&&p.days.length>0&&p.days.length<=6&&p.days.every(d=>text(d.name,120)&&Array.isArray(d.exercises)&&d.exercises.length>0&&d.exercises.length<=20&&d.exercises.every(e=>text(e.exerciseId,80)&&Number.isInteger(e.sets)&&number(e.sets,1,10)&&Number.isInteger(e.reps)&&number(e.reps,1,100)&&Number.isInteger(e.rest)&&number(e.rest,0,600)&&['reps','minutes'].includes(e.unit))));}catch{return false;}}
 function normalize(raw){
  if(!obj(raw)||!kinds.includes(raw.type)||!text(raw.source,120)||!raw.source.trim()||!stamp(raw.start)||!stamp(raw.end||raw.start))return null;
  let value=Number(raw.value),unit=raw.unit;
  if(!Number.isFinite(value)||value<0)return null;
  if(raw.type==='weight'&&unit==='kg'){value*=2.2046226218487757;unit='lb';}
  if(raw.type==='activeEnergy'&&unit==='kJ'){value/=4.184;unit='kcal';}
  if(['sleep','workout'].includes(raw.type)&&unit==='s'){value/=60;unit='min';}
  if(raw.type==='steps'&&unit==='count')value=Math.round(value);
  const row={type:raw.type,source:raw.source.trim(),start:raw.start,end:raw.end||raw.start,date:raw.start.slice(0,10),value,unit};
  return observation(row)&&!(row.type==='weight'&&(value<50||value>1000))?row:null;
 }
 const key=r=>JSON.stringify([r.type,r.source,Date.parse(r.start),Date.parse(r.end),r.value,r.unit]);
 function merge(existing,incoming){const seen=new Set(existing.map(key)),added=[];for(const r of incoming){if(!observation(r))throw Error('Invalid health observation.');if(!seen.has(key(r))){seen.add(key(r));added.push(structuredClone(r));}}if(existing.length+added.length>3000)throw Error('Import exceeds 3,000 saved observations. Choose a smaller date range.');return {rows:[...structuredClone(existing),...added],added:added.length,duplicates:incoming.length-added.length};}
 function csvRows(input){
  if(!text(input,20000000))throw Error('Choose a CSV smaller than 20 MB.');
  const rows=[];let row=[],cell='',quoted=false;
  for(let i=0;i<input.length;i++){const c=input[i];if(c==='"'){if(quoted&&input[i+1]==='"'){cell+='"';i++;}else if(quoted||cell==='')quoted=!quoted;else throw Error('Invalid CSV quote.');}else if(c===','&&!quoted){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&input[i+1]==='\n')i++;row.push(cell);if(row.some(Boolean))rows.push(row);row=[];cell='';}else cell+=c;}
  if(quoted)throw Error('Unclosed CSV quote.');row.push(cell);if(row.some(Boolean))rows.push(row);return rows;
 }
 function parseCsv(input){const rows=csvRows(input),head=(rows.shift()||[]).map(x=>x.replace(/^\uFEFF/,'').trim());if(!['type','source','start','value','unit'].every(k=>head.includes(k)))throw Error('CSV needs type,source,start,end,value,unit columns. Download the example.');let skipped=0;const records=[];for(const row of rows){const raw=Object.fromEntries(head.map((k,i)=>[k,row[i]||''])),r=normalize(raw);if(r)records.push(r);else skipped++;}return {records,skipped};}
 const appleTypes={HKQuantityTypeIdentifierBodyMass:'weight',HKQuantityTypeIdentifierStepCount:'steps',HKQuantityTypeIdentifierActiveEnergyBurned:'activeEnergy',HKQuantityTypeIdentifierHeartRate:'heartRate'};
 function appleRecord(attrs){let type=appleTypes[attrs.type],unit=attrs.unit,value=attrs.value;if(attrs.type==='HKCategoryTypeIdentifierSleepAnalysis'){if(!/^HKCategoryValueSleepAnalysisAsleep/.test(attrs.value))return null;type='sleep';unit='min';value=(Date.parse(attrs.endDate)-Date.parse(attrs.startDate))/60000;}
  if(!type)return null;if(unit==='count/min')unit='bpm';return normalize({type,source:attrs.sourceName||'Apple Health',start:attrs.startDate,end:attrs.endDate,value,unit});}
 const nutrientKeys={fiber:'fiber_100g',sodium:'sodium_100g',calcium:'calcium_100g',iron:'iron_100g',potassium:'potassium_100g',magnesium:'magnesium_100g',zinc:'zinc_100g',vitaminC:'vitamin-c_100g',vitaminD:'vitamin-d_100g',vitaminB12:'vitamin-b12_100g',sugars:'sugars_100g',saturatedFat:'saturated-fat_100g'};
 function foodProduct(raw,now=new Date().toISOString()){
  const x=raw.product||raw,n=x.nutriments||{},result={code:String(x.code||raw.code||''),name:String(x.product_name||x.product_name_en||'').trim().slice(0,120),serving:x.nutrition_data_per==='100ml'?'100 ml':x.nutrition_data_per==='100g'?'100 g':'100 g/ml (check label)',source:'',fetched:now,nutrients:{}};
  result.source=`https://world.openfoodfacts.org/product/${result.code}`;
  const energy=n['energy-kcal_100g']??(number(n.energy_100g)?n.energy_100g/4.184:undefined);
  for(const [k,v] of Object.entries({cal:energy,p:n.proteins_100g,c:n.carbohydrates_100g,f:n.fat_100g})){if(!number(v,0,10000))throw Error('This product has incomplete nutrition. Use its label instead.');result[k]=v;}
  for(const [name,k] of Object.entries(nutrientKeys))if(number(n[k],0,1e7))result.nutrients[name]=n[k]*(name==='sodium'||['calcium','iron','potassium','magnesium','zinc','vitaminC'].includes(name)?1000:['vitaminD','vitaminB12'].includes(name)?1e6:1);
  if(!product(result))throw Error('Product name, barcode or nutrition is missing.');return result;
 }
 function describe(input,foods){
  if(!text(input,2000)||!input.trim())throw Error('Describe a meal.');
  const chunks=input.trim().split(/\s*(?:,|;|\band\b|\n)\s*/i).filter(Boolean),items=[],unmatched=[];
  for(const chunk of chunks){const m=chunk.match(/^(?:(\d+(?:\.\d+)?)\s*(?:x\s*|servings?\s+of\s+)?)?(.+)$/i),qty=m?.[1]?Number(m[1]):1,name=m?.[2]?.trim().toLowerCase(),food=foods.find(f=>f[0].toLowerCase()===name);if(!food||!number(qty,.01,100)){unmatched.push(chunk);continue;}items.push({name:food[0],serving:food[1],qty,cal:food[2],p:food[3],c:food[4],f:food[5]});}
  return {items,unmatched};
 }
 function recipeJson(input){
  let raw;try{raw=JSON.parse(input);}catch{throw Error('Paste Recipe JSON-LD from a recipe website.');}
  const found=[];function walk(x){if(Array.isArray(x))x.forEach(walk);else if(obj(x)){if([x['@type']].flat().some(t=>t==='Recipe'))found.push(x);if(x['@graph'])walk(x['@graph']);}}walk(raw);
  const r=found[0];if(!r)throw Error('No Recipe structured data found.');const yieldText=String(Array.isArray(r.recipeYield)?r.recipeYield[0]:r.recipeYield||''),yieldCount=Number(yieldText.match(/\d+(?:\.\d+)?/)?.[0]);
  const nutrition=r.nutrition||{},read=k=>{const match=String(nutrition[k]??'').match(/^\s*(\d+(?:\.\d+)?)\s*(?:g|grams?|kcal|calories?)?\s*$/i);return match?Number(match[1]):null;};
  const perPortion={cal:read('calories'),p:read('proteinContent'),c:read('carbohydrateContent'),f:read('fatContent')};
  return {name:String(r.name||'Imported recipe').slice(0,120),yield:number(yieldCount,.1,1000)?yieldCount:null,ingredients:(Array.isArray(r.recipeIngredient)?r.recipeIngredient:[]).map(x=>String(x).slice(0,300)).slice(0,100),perPortion:macro(perPortion)?perPortion:null};
 }
 function mealPlan(foods,target,pantry=[],excluded=''){
  if(!macro(target)||target.cal<1200)throw Error('Set a daily target of at least 1,200 kcal.');
  const omit=excluded.toLowerCase().split(',').map(x=>x.trim()).filter(Boolean),stock=pantry.filter(x=>x.qty>0).map(x=>x.name.toLowerCase());
  const pool=foods.filter(f=>Array.isArray(f)&&text(f[0])&&[2,3,4,5].every(k=>number(f[k],0,10000))&&f[2]>20&&!omit.some(x=>f[0].toLowerCase().includes(x)));
  if(pool.length<3)throw Error('At least three allowed foods with complete macros are needed.');
  const portions=[.5,1,1.5,2],items=[];let totals={cal:0,p:0,c:0,f:0};
  const score=t=>['cal','p','c','f'].reduce((s,k)=>s+Math.pow((t[k]-target[k])/Math.max(10,target[k]),2)*(k==='cal'?2:1),0);
  for(let i=0;i<9;i++){let best=null;for(const f of pool)for(const qty of portions){if(items.filter(x=>x.name===f[0]).length>=2)continue;const t={cal:totals.cal+f[2]*qty,p:totals.p+f[3]*qty,c:totals.c+f[4]*qty,f:totals.f+f[5]*qty};if(t.cal>target.cal*1.15)continue;const rank=score(t)-(stock.includes(f[0].toLowerCase())?.03:0);if(!best||rank<best.rank)best={f,qty,t,rank};}if(!best||score(best.t)>=score(totals))break;items.push({name:best.f[0],serving:best.f[1],qty:best.qty,cal:best.f[2],p:best.f[3],c:best.f[4],f:best.f[5]});totals=best.t;}
  return {items,totals,coverage:totals.cal/target.cal};
 }
 function adaptive(state,end){
  const complete=new Set((state.six?.recovery||[]).filter(r=>r.completeFood).map(r=>r.date));
  const days=Array.from({length:14},(_,i)=>shift(end,i-13));
  if(days.some(d=>!complete.has(d)))throw Error('Confirm complete food logging on all 14 days in Daily Check-in first.');
  const weights=new Map(state.weights.filter(w=>days.includes(w.date)).map(w=>[w.date,w.value]));
  const average=dates=>{const values=dates.filter(d=>weights.has(d)).map(d=>weights.get(d));if(values.length<3)throw Error('Record weight on at least three days in each week.');return values.reduce((s,v)=>s+v,0)/values.length;};
  const first=average(days.slice(0,7)),last=average(days.slice(7)),change=last-first;
  if(Math.abs(change)>4)throw Error('Weight change is too large for a useful short-window estimate. Review water changes and logging.');
  const intake=days.reduce((s,d)=>s+state.meals.filter(m=>m.date===d).reduce((n,m)=>n+m.cal,0),0)/14;
  if(intake<1000||intake>7000)throw Error('Review food logging before estimating expenditure.');
  const expenditure=intake-change*3500/7;
  if(expenditure<1200||expenditure>6000)throw Error('Estimated expenditure is outside the supported range.');
  return {days:14,first,last,change,intake:Math.round(intake),expenditure:Math.round(expenditure)};
 }
 function programWeek(program,index){if(!Number.isInteger(index)||index<0||index>=program.weeks)throw Error('Choose a week in the saved block.');const deload=(index+1)%program.deloadEvery===0;return {week:index+1,deload,loadReview:deload?-10:program.increment*Math.floor(index/program.deloadEvery),days:program.days.map(d=>({...structuredClone(d),exercises:d.exercises.map(e=>({...structuredClone(e),sets:deload?Math.max(1,Math.ceil(e.sets/2)):e.sets}))}))};}
 const api={defaults,valid,date,shift,observation,normalize,appleRecord,merge,key,parseCsv,foodProduct,product,describe,recipeJson,mealPlan,adaptive,programWeek,nutrientKeys};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MacroConnected=api;
})(typeof window!=='undefined'?window:globalThis);
