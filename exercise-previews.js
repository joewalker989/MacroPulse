/* Read-only presentation metadata. Filmed references are not specialist-reviewed coaching. */
(function(root){
 'use strict';
 const node=typeof module!=='undefined'&&module.exports;
 const R=node?require('./realmotion'):root.MacroRealMotion;
 const V=node?require('./workout-visuals'):root.MacroWorkoutVisuals;
 const source='https://ymove.app/free-exercise-videos',creditURL='https://ymove.app/exercise-api';
 const pilot=Object.freeze([
  Object.freeze({exerciseId:'goblet',title:'Dumbbell Goblet Squat',url:'media/exercise-pilot/goblet.mp4',poster:'media/exercise-pilot/goblet.jpg',bytes:1875528,seconds:19.12,source,creditURL,publisherId:'a2a797d0-f6f6-436e-8616-6c1d93e73d67'}),
  Object.freeze({exerciseId:'row',title:'Single Arm Dumbbell Row — Legs Apart',url:'media/exercise-pilot/row.mp4',poster:'media/exercise-pilot/row.jpg',bytes:1074064,seconds:12.84,source,creditURL,publisherId:'d3fece95-c7e2-4794-ba8f-65a5b3e30a28'})
 ]);
 const categories=Object.freeze({'Upper Body':['bench-press','row','shoulder-press','curl'],'Lower Body':['goblet','rdl','lunge','calf-raise'],'Full Body':['squat','push-up','row','plank'],Core:['plank','crunch','dead-bug','leg-raise'],'Resistance Bands':['band-row','band-press','band-curl','band-squat']});
 const targets={ 'push-up':'Chest, triceps, shoulders','floor-press':'Chest, triceps','bench-press':'Chest, triceps, shoulders','band-press':'Chest, triceps',row:'Back, biceps','band-row':'Back, biceps','pull-up':'Back, biceps','prone-pull':'Upper back, rear shoulders',squat:'Quads, glutes',goblet:'Quads, glutes','barbell-squat':'Quads, glutes',lunge:'Quads, glutes',bridge:'Glutes, hamstrings',rdl:'Hamstrings, glutes','dead-bug':'Abdominals',crunch:'Abdominals',march:'Legs, cardiovascular',bike:'Quads, cardiovascular',curl:'Biceps','band-curl':'Biceps','band-squat':'Quads, glutes','shoulder-press':'Shoulders, triceps','calf-raise':'Calves',plank:'Abdominals, shoulders','leg-raise':'Abdominals, hip flexors'};
 const cues={curl:'Keep elbows near your sides; lower the weights under control.','band-curl':'Check the band for wear; keep elbows near your sides.','band-squat':'Check the band for wear and secure it under your feet; squat with control.','shoulder-press':'Press with control without leaning backward.','calf-raise':'Use support for balance; rise and lower with control.',plank:'Keep a straight line from shoulders to ankles; breathe steadily.','leg-raise':'Use a comfortable range without arching your lower back.'};
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const reference=value=>pilot.find(c=>c.exerciseId===R.exercise(value)?.id)||null;
 const cue=value=>{const e=R.exercise(value);return e?.cue||cues[e?.id]||'';};
 const muscles=value=>targets[R.exercise(value)?.id]||'See movement guidance';
 const credit=()=>`<a href="${creditURL}" target="_blank" rel="noopener noreferrer">Exercise video by Your Move</a>`;
 function preview(value){const e=R.exercise(value),c=reference(value);if(!e)return '';if(!c)return V.illustration(e);
  return `<figure class="exercise-visual exercise-photo" data-demonstration="${e.id}"><img src="${c.poster}" alt="${esc(c.title)} — filmed exercise preview" width="720" height="1280" loading="lazy" decoding="async"><figcaption><strong>${esc(c.title)}</strong><p>Real-human reference · ${(c.bytes/1e6).toFixed(1)} MB · ${c.seconds}s</p>${credit()}<p>Specialist form review pending.</p><button type="button" class="alt" data-realmotion="${e.id}">View demo</button></figcaption></figure>`;
 }
 function card(e,inventory){const missing=e.requires.filter(x=>!inventory.includes(x));return `<article class="entry exercise-card" data-exercise-card="${e.id}"><h4>${esc(e.name)}</h4><p>Equipment: ${esc(e.requires.join(' + ')||'Bodyweight')}${missing.length?' · Not in your inventory: '+esc(missing.join(', ')):''}</p><p>Target muscles: ${esc(muscles(e))}</p>${preview(e)}<p>${esc(cue(e))}</p>${reference(e)?'':'<p class="notice">Offline schematic and cues; an exact filmed pilot is not available.</p>'}</article>`;}
 function library(inventory,category='All',availableOnly=true){const rows=R.exercises.filter(e=>(category==='All'||categories[category]?.includes(e.id))&&(!availableOnly||e.requires.every(x=>inventory.includes(x))));
  return `<div class="panel" id="exerciseLibrary"><h3 id="exerciseLibraryTitle" tabindex="-1">Exercise Library</h3><p class="notice">Two licensed real-human pilot clips, existing community references, and original offline schematics. These are general guidance, not a form assessment. Target muscles are text guidance, not measured activation.</p><label>Movement category<select id="exerciseCategory" class="field">${['All',...Object.keys(categories)].map(c=>`<option ${c===category?'selected':''}>${esc(c)}</option>`).join('')}</select></label><label><input type="checkbox" id="exerciseAvailable" ${availableOnly?'checked':''}> Match my saved equipment</label><p role="status">${rows.length} exercises · ${esc(category)}</p><div class="exercise-cards">${rows.map(e=>card(e,inventory)).join('')||'<p>No matches for your saved equipment. Uncheck the equipment filter to browse all references.</p>'}</div></div>`;
 }
 function template(name,ex){return `<details class="entry" open><summary>${esc(name)} · movement references</summary><button type="button" class="alt" data-exercise-category="${esc(name)}">Browse ${esc(name)} in Exercise Library</button>${ex.map(preview).join('')}</details>`;}
 const api=Object.freeze({pilot,categories,reference,cue,muscles,credit,preview,card,library,template});if(node)module.exports=api;else root.MacroExercisePreviews=api;
})(typeof window!=='undefined'?window:globalThis);
