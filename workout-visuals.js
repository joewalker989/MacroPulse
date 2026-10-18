/* Original offline SVG movement illustrations. Schematic references, not form analysis. */
(function(root){
 'use strict';
 const standing={head:[70,22],neck:[70,38],hip:[70,82],el:[55,62],hand:[60,85],el2:[85,62],hand2:[80,85],knee:[57,108],foot:[48,140],knee2:[83,108],foot2:[92,140]};
 const squat={...standing,head:[62,44],neck:[62,60],hip:[88,91],el:[47,77],hand:[66,67],el2:[80,77],hand2:[66,67],knee:[51,108],foot:[46,140],knee2:[105,111],foot2:[108,140]};
 const hinge={...standing,head:[46,57],neck:[59,62],hip:[94,84],el:[59,86],hand:[60,110],el2:[68,88],hand2:[72,112],knee:[78,112],foot:[71,140],knee2:[104,112],foot2:[105,140]};
 const plank={head:[30,62],neck:[43,70],hip:[85,90],el:[42,105],hand:[43,140],el2:[49,108],hand2:[51,140],knee:[112,112],foot:[140,140],knee2:[115,112],foot2:[142,140]};
 const lowPlank={...plank,head:[30,91],neck:[43,99],hip:[85,113],el:[67,115],hand:[43,140],el2:[72,120],hand2:[51,140],knee:[112,125],knee2:[115,126]};
 const lying={head:[25,104],neck:[40,110],hip:[91,110],el:[55,85],hand:[74,85],el2:[62,93],hand2:[80,93],knee:[119,96],foot:[142,140],knee2:[105,90],foot2:[127,140]};
 const pressLow={...lying,el:[55,120],hand:[55,82],el2:[70,124],hand2:[70,87]},pressHigh={...lying,el:[45,77],hand:[45,42],el2:[58,82],hand2:[58,47]};
 const hang={...standing,head:[75,50],neck:[75,65],hip:[75,105],el:[50,35],hand:[45,12],el2:[98,35],hand2:[105,12],knee:[62,126],foot:[60,145],knee2:[89,126],foot2:[93,145]};
 const pulled={...hang,head:[75,16],neck:[75,32],hip:[75,72],el:[40,48],hand:[45,12],el2:[112,48],hand2:[105,12],knee:[62,105],foot:[60,137],knee2:[89,105],foot2:[93,137]};
 const lunge={...standing,head:[66,34],neck:[66,50],hip:[66,91],knee:[30,98],foot:[30,140],knee2:[111,135],foot2:[138,140]};
 const poses={
  'push-up':[plank,lowPlank,'floor'], 'floor-press':[pressLow,pressHigh,'dumbbells-floor'], 'bench-press':[pressLow,pressHigh,'bench'],
  'band-press':[{...standing,el:[93,52],hand:[70,49],el2:[105,58],hand2:[82,55]},{...standing,el:[106,43],hand:[142,43],el2:[105,58],hand2:[142,58]},'band'],
  row:[hinge,{...hinge,el:[111,63],hand:[78,61],el2:[116,73],hand2:[88,72]},'dumbbells'],
  'band-row':[{...standing,el:[104,50],hand:[140,50],el2:[104,65],hand2:[140,65]},{...standing,el:[45,62],hand:[76,54],el2:[49,77],hand2:[80,69]},'band'],
  'pull-up':[hang,pulled,'bar'], 'prone-pull':[{...lying,el:[64,74],hand:[95,54],el2:[73,83],hand2:[110,65]},{...lying,el:[70,88],hand:[54,59],el2:[81,98],hand2:[65,69]},'floor'],
  squat:[standing,squat,'floor'],goblet:[{...standing,el:[53,58],hand:[70,48],el2:[87,58],hand2:[70,48]},squat,'goblet'],
  'barbell-squat':[{...standing,el:[40,53],hand:[40,39],el2:[99,53],hand2:[99,39]},{...squat,el:[34,76],hand:[34,61],el2:[91,76],hand2:[91,61]},'barbell'],
  lunge:[standing,lunge,'floor'],bridge:[lying,{...lying,head:[25,116],neck:[40,121],hip:[86,88],knee:[119,97],knee2:[105,88]},'floor'],
  rdl:[standing,hinge,'dumbbells'],
  'dead-bug':[{...lying,el:[47,78],hand:[47,43],el2:[60,78],hand2:[60,43],knee:[91,72],foot:[126,72],knee2:[104,77],foot2:[137,77]},{...lying,el:[25,100],hand:[3,78],el2:[60,78],hand2:[60,43],knee:[91,72],foot:[126,72],knee2:[121,118],foot2:[151,131]},'floor'],
  crunch:[lying,{...lying,head:[44,73],neck:[54,87],el:[66,67],hand:[49,64],el2:[74,76],hand2:[58,72]},'floor'],
  march:[{...standing,knee:[55,83],foot:[58,112]},{...standing,knee2:[90,83],foot2:[86,112]},'floor'],
  bike:[{...hinge,hip:[82,83],el:[65,74],hand:[45,78],el2:[71,79],hand2:[49,82],knee:[61,106],foot:[80,130],knee2:[111,102],foot2:[93,120]},{...hinge,hip:[82,83],el:[65,74],hand:[45,78],el2:[71,79],hand2:[49,82],knee:[110,103],foot:[96,120],knee2:[61,106],foot2:[80,130]},'bike']
 };
 poses['shoulder-press']=[{...standing,el:[40,56],hand:[40,28],el2:[100,56],hand2:[100,28]},{...standing,el:[55,16],hand:[55,1],el2:[85,16],hand2:[85,1]},'dumbbells'];
 poses.curl=[standing,{...standing,el:[53,67],hand:[62,42],el2:[87,67],hand2:[78,42]},'dumbbells'];
 poses['calf-raise']=[standing,{...standing,head:[70,16],neck:[70,32],hip:[70,76],knee:[57,102],knee2:[83,102],foot:[52,138],foot2:[88,138]},'floor'];
 poses.plank=[plank,plank,'floor'];poses['leg-raise']=[{...lying,knee:[120,120],foot:[150,135],knee2:[115,126],foot2:[146,140]},{...lying,knee:[98,76],foot:[102,40],knee2:[108,81],foot2:[114,46]},'floor'];
 poses['band-curl']=[standing,{...standing,el:[53,67],hand:[62,42],el2:[87,67],hand2:[78,42]},'band-floor'];poses['band-squat']=[standing,squat,'band-floor'];
 const aliases={'push-up':'push-up','squat':'squat','row':'row','romanian deadlift':'rdl','shoulder press':'shoulder-press','biceps curl':'curl','calf raise':'calf-raise','leg raise':'leg-raise','band curl':'band-curl','band squat':'band-squat','band row':'band-row','band chest press':'band-press','goblet squat':'goblet','lunge':'lunge','crunch':'crunch','dead bug':'dead-bug'};
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const line=(points,color='#6ee7b7',width=6)=>`<polyline points="${points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
 function figure(p,equipment){let bg=line([[9,146],[151,146]],'#376354',2);if(equipment==='bar')bg+=line([[25,10],[125,10]],'#fbbf24',5);if(equipment==='bench')bg+=line([[13,126],[105,126]],'#94a3b8',7)+line([[30,126],[30,145]],'#94a3b8',4)+line([[90,126],[90,145]],'#94a3b8',4);if(equipment==='bike')bg+='<circle cx="43" cy="125" r="19" fill="none" stroke="#94a3b8" stroke-width="3"/><circle cx="120" cy="125" r="19" fill="none" stroke="#94a3b8" stroke-width="3"/>'+line([[43,125],[80,104],[120,125],[43,125]],'#94a3b8',3);
  let body=`<circle cx="${p.head[0]}" cy="${p.head[1]}" r="10" fill="#6ee7b7"/>`+line([p.neck,p.hip])+line([p.neck,p.el,p.hand])+line([p.neck,p.el2,p.hand2],'#38bdf8',5)+line([p.hip,p.knee,p.foot])+line([p.hip,p.knee2,p.foot2],'#38bdf8',5);
  if(['dumbbells','dumbbells-floor','bench'].includes(equipment))for(const hand of [p.hand,p.hand2])body+=line([[hand[0]-8,hand[1]],[hand[0]+8,hand[1]]],'#fbbf24',7);
  if(equipment==='goblet')body+=`<rect x="${p.hand[0]-7}" y="${p.hand[1]-6}" width="14" height="17" rx="3" fill="#fbbf24"/>`;
  if(equipment==='barbell')body+=line([[p.neck[0]-37,p.neck[1]+1],[p.neck[0]+37,p.neck[1]+1]],'#fbbf24',5);
  if(equipment==='band-floor')body+=line([[70,146],p.hand],'#fbbf24',2)+line([[70,146],p.hand2],'#fbbf24',2);if(equipment==='band')body+=line([[153,72],p.hand],'#fbbf24',2)+line([[153,72],p.hand2],'#fbbf24',2);
  return bg+body;
 }
 function illustration(exercise){const raw=typeof exercise==='string'?exercise:exercise.id,id=poses[raw]?raw:aliases[String(raw).toLowerCase()]||(typeof window!=='undefined'?root.MacroTraining?.library.find(e=>e.name.toLowerCase()===String(raw).toLowerCase())?.id:undefined),name=typeof exercise==='string'?exercise:exercise.name,p=poses[id];if(!p)return '';return `<figure class="exercise-visual" style="margin:12px 0"><svg viewBox="0 0 340 190" role="img" aria-label="${esc(name)}: schematic start and movement positions" style="display:block;width:100%;max-height:210px;background:#0a211d;border-radius:12px"><text x="20" y="16" fill="#cbd5e1" font-size="11">START / POSITION A</text><text x="185" y="16" fill="#cbd5e1" font-size="11">MOVE / POSITION B</text><g transform="translate(4 27) scale(.96)">${figure(p[0],p[2])}</g><g transform="translate(176 27) scale(.96)">${figure(p[1],p[2])}</g><text x="163" y="103" fill="#fbbf24" font-size="17">→</text></svg><figcaption class="notice">${esc(name)} · Illustrated reference. Use the written setup and technique cues.</figcaption></figure>`;}
 const api={poses,illustration};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MacroWorkoutVisuals=api;
})(typeof window!=='undefined'?window:globalThis);
