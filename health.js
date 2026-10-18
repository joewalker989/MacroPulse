/* 5.1: deterministic adult reference calculations; canonical cm/kg, legacy logs remain lb. */
(function(root){
 'use strict';
 const LB=2.2046226218487757,OZ=29.5735295625;
 const num=(x,min,max)=>typeof x==='number'&&Number.isFinite(x)&&x>=min&&x<=max;
 const date=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&new Date(x+'T12:00:00Z').toISOString().slice(0,10)===x;
 const profile=p=>p&&['us','metric'].includes(p.units)&&['male','female'].includes(p.sex)&&num(p.age,18,100)&&num(p.height,120,230)&&[1.2,1.375,1.55,1.725,1.9].includes(p.activity)&&['maintain','lose','gain'].includes(p.mode)&&[.5,1,1.5,2].includes(p.rate)&&num(p.protein,1.2,2.2)&&num(p.fat,.2,.35)&&typeof p.eligible==='boolean';
 function defaults(){return {version:1,profile:null,history:[],targets:[]};}
 function valid(s){try{return s&&s.version===1&&(s.profile===null||profile(s.profile))&&Array.isArray(s.history)&&new Set(s.history.map(x=>x.id)).size===s.history.length&&s.history.every(x=>x&&typeof x.id==='string'&&x.id.length>0&&date(x.date)&&x.inputs&&x.result&&
  (x.kind==='energy'?profile(x.inputs.profile)&&num(x.inputs.weight,35*LB,350*LB)&&['bmr','maintenance','cal','p','c','f','weight'].every(k=>num(x.result[k],0,10000))&&['requestedDelta','effectiveDelta'].every(k=>num(x.result[k],-1000,1000))&&typeof x.result.limited==='boolean':x.kind==='bodyFat'&&['male','female'].includes(x.inputs.sex)&&['height','waist','neck','hip'].every(k=>num(x.inputs[k],0,250))&&num(x.result.percent,2,65)))&&Array.isArray(s.targets)&&new Set(s.targets.map(x=>x.id)).size===s.targets.length&&s.targets.every(x=>x&&typeof x.id==='string'&&x.id.length>0&&date(x.date)&&profile(x.profile)&&num(x.weight,35*LB,350*LB)&&['cal','p','c','f'].every(k=>num(x[k],0,10000)));}catch{return false;}}
 function calculate(p,weightLb){
  if(!profile(p)||!num(weightLb,35*LB,350*LB))throw Error('Complete a valid adult profile and recorded weight (35–350 kg).');
  if(!p.eligible)throw Error('Calorie targets require adult, non-pregnant/non-breastfeeding eligibility. Review individual needs with a qualified professional.');
  const kg=weightLb/LB,bmr=10*kg+6.25*p.height-5*p.age+(p.sex==='male'?5:-161),maintenance=bmr*p.activity;
  const requested=p.mode==='maintain'?0:p.rate*500*(p.mode==='lose'?-1:1);
  const floor=Math.max(bmr,p.sex==='male'?1500:1200);
  const delta=requested<0?-Math.min(-requested,1000,maintenance*.25,Math.max(0,maintenance-floor)):Math.min(requested,500);
  const cal=Math.round(maintenance+delta),protein=Math.round(Math.min(kg*p.protein,cal*.4/4)),fat=Math.round(cal*p.fat/9),carbs=Math.max(0,(cal-protein*4-fat*9)/4);
  return {bmr:Math.round(bmr),maintenance:Math.round(maintenance),cal,p:protein,c:Math.round(carbs*10)/10,f:fat,requestedDelta:requested,effectiveDelta:Math.round(delta),limited:Math.abs(delta-requested)>.5,weight:weightLb};
 }
 function bodyFat(sex,height,waist,neck,hip){
  if(!['male','female'].includes(sex)||![height,waist,neck].every(x=>num(x,10,250))||(sex==='female'&&!num(hip,30,250)))throw Error('Enter valid measured circumferences and height in cm.');
  const term=(sex==='male'?waist-neck:waist+hip-neck)/2.54;
  if(term<=0)throw Error('Circumferences are incompatible with the Navy formula.');
  const value=sex==='male'?86.010*Math.log10(term)-70.041*Math.log10(height/2.54)+36.76:163.205*Math.log10(term)-97.684*Math.log10(height/2.54)-78.387;
  if(!num(value,2,65))throw Error('Result outside supported reference range; check measurement technique.');
  return {percent:Math.round(value*10)/10};
 }
 function ideal(sex,height){if(!['male','female'].includes(sex)||!num(height,152.4,230))return null;const i=height/2.54-60,m=sex==='male';return {Devine:(m?50:45.5)+2.3*i,Robinson:(m?52:49)+(m?1.9:1.7)*i,Miller:(m?56.2:53.1)+(m?1.41:1.36)*i,Hamwi:((m?106:100)+(m?6:5)*i)/LB};}
 function trend(weights,end){
  const shift=(d,n)=>{const x=new Date(d+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10);};
  // Last check-in on a date wins; repeat weigh-ins do not bias daily averages.
  const days=new Map(weights.filter(x=>x.date<=end&&x.value>0).map(x=>[x.date,x.value]));
  const weeks=[0,1,2].map(i=>{const lo=shift(end,-6-i*7),hi=shift(end,-i*7),rows=[...days].filter(([d])=>d>=lo&&d<=hi);return {count:rows.length,average:rows.length?rows.reduce((n,[,v])=>n+v,0)/rows.length:null};});
  const enough=weeks.every(x=>x.count>=3),change=weeks[0].count>=3&&weeks[1].count>=3?weeks[0].average-weeks[1].average:null;
  return {weeks,change,plateau:enough&&Math.max(...weeks.map(x=>x.average))-Math.min(...weeks.map(x=>x.average))<.5};
 }
 const api={LB,OZ,num,profile,defaults,valid,calculate,bodyFat,ideal,trend};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MacroHealth=api;
})(typeof window!=='undefined'?window:globalThis);
