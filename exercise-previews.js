/* Read-only presentation metadata. Filmed references are not specialist-reviewed coaching. */
(function(root){
 'use strict';
 const node=typeof module!=='undefined'&&module.exports;
 const R=node?require('./realmotion'):root.MacroRealMotion;
 const V=node?require('./workout-visuals'):root.MacroWorkoutVisuals;
 const media=node?require('./exercise-media'):root.MacroExerciseMedia;
 const pilot=Object.freeze(media.records.filter(c=>c.kind==='human-footage')),models=Object.freeze(media.records.filter(c=>c.kind==='3d-motion'));
 const categories=Object.freeze({'Upper Body':['bench-press','row','shoulder-press','curl'],'Lower Body':['goblet','rdl','lunge','calf-raise'],'Full Body':['squat','push-up','row','plank'],Core:['plank','crunch','dead-bug','leg-raise'],'Resistance Bands':['band-row','band-press','band-curl','band-squat']});
 const targets={ 'push-up':'Chest, triceps, shoulders','floor-press':'Chest, triceps','bench-press':'Chest, triceps, shoulders','band-press':'Chest, triceps',row:'Back, biceps','band-row':'Back, biceps','pull-up':'Back, biceps','prone-pull':'Upper back, rear shoulders',squat:'Quads, glutes',goblet:'Quads, glutes','barbell-squat':'Quads, glutes',lunge:'Quads, glutes',bridge:'Glutes, hamstrings',rdl:'Hamstrings, glutes','dead-bug':'Abdominals',crunch:'Abdominals',march:'Legs, cardiovascular',bike:'Quads, cardiovascular',curl:'Biceps','band-curl':'Biceps','band-squat':'Quads, glutes','shoulder-press':'Shoulders, triceps','calf-raise':'Calves',plank:'Abdominals, shoulders','leg-raise':'Abdominals, hip flexors'};
 const cues={curl:'Keep elbows near your sides; lower the weights under control.','band-curl':'Check the band for wear; keep elbows near your sides.','band-squat':'Check the band for wear and secure it under your feet; squat with control.','shoulder-press':'Press with control without leaning backward.','calf-raise':'Use support for balance; rise and lower with control.',plank:'Keep a straight line from shoulders to ankles; breathe steadily.','leg-raise':'Use a comfortable range without arching your lower back.'};
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const reference=value=>[...pilot,...models].find(c=>c.exerciseId===R.exercise(value)?.id)||null;
 const cue=value=>{const e=R.exercise(value);return e?.cue||cues[e?.id]||'';};
 const muscles=value=>targets[R.exercise(value)?.id]||'See movement guidance';
 const credit=c=>V.credit(c||pilot[0]);
 const preview=value=>V.illustration(value);
 function card(e,inventory){const missing=e.requires.filter(x=>!inventory.includes(x));return `<article class="entry exercise-card" data-exercise-card="${e.id}"><h4>${esc(e.name)}</h4><p>Equipment: ${esc(e.requires.join(' + ')||'Bodyweight')}${missing.length?' · Not in your inventory: '+esc(missing.join(', ')):''}</p><p>Target muscles: ${esc(muscles(e))}</p>${preview(e)}<p>${esc(cue(e))}</p></article>`;}
 function library(inventory,category='All',availableOnly=true){const rows=R.exercises.filter(e=>(category==='All'||categories[category]?.includes(e.id))&&(!availableOnly||e.requires.every(x=>inventory.includes(x))));
  return `<div class="panel" id="exerciseLibrary"><h3 id="exerciseLibraryTitle" tabindex="-1">Exercise Library</h3><p class="notice">Every exercise has a realistic reference: two real-person videos and 23 generated 3D demos. These are general guidance, not a form assessment. Target muscles are text guidance, not measured activation.</p><label>Movement category<select id="exerciseCategory" class="field">${['All',...Object.keys(categories)].map(c=>`<option ${c===category?'selected':''}>${esc(c)}</option>`).join('')}</select></label><label><input type="checkbox" id="exerciseAvailable" ${availableOnly?'checked':''}> Match my saved equipment</label><p role="status">${rows.length} exercises · ${esc(category)}</p><div class="exercise-cards">${rows.map(e=>card(e,inventory)).join('')||'<p>No matches for your saved equipment. Uncheck the equipment filter to browse all references.</p>'}</div></div>`;
 }
 function template(name,ex){return `<details class="entry" open><summary>${esc(name)} · movement references</summary><button type="button" class="alt" data-exercise-category="${esc(name)}">Browse ${esc(name)} in Exercise Library</button>${ex.map(preview).join('')}</details>`;}
 function mountInline(){let active=null;
  function stop(){if(!active)return;const v=active;active=null;v.onerror=null;v.onplaying=null;v.pause();v.removeAttribute('src');v.load();v.hidden=true;v.closest('figure')?.querySelector('img')?.removeAttribute('hidden');}
  document.addEventListener('click',event=>{const b=event.target.closest('[data-inline-exercise]');if(!b){if(event.target.closest('[data-realmotion],[data-page],[data-modal],[data-close],[data-exercise-category],[data-template],[data-five=focus]'))stop();return;}
   const c=reference(b.dataset.inlineExercise),figure=b.closest('figure'),v=figure.querySelector('video'),status=figure.querySelector('[data-inline-status]');stop();if(!c)return;
   status.textContent='Loading exercise example…';v.onerror=()=>{stop();status.textContent='Video unavailable. Use the realistic still preview and written cues in demo controls.';};active=v;figure.querySelector('img').hidden=true;v.hidden=false;v.src=c.url;v.load();v.play().catch(()=>{if(active===v)status.textContent='Press the video Play control to begin.';});v.onplaying=()=>{status.textContent=(c.kind==='3d-motion'?'Generated 3D reference.':'Real-person reference.')+' Open demo controls for playback speed and repeat.';};
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);window.addEventListener('offline',stop);
  // Existing app renders replace cards. Release any detached stream without writing saved state.
  new MutationObserver(()=>{if(active&&(!active.isConnected||!active.getClientRects().length))stop();}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','hidden','open']});
 }
 const api=Object.freeze({pilot,models,categories,reference,cue,muscles,credit,preview,card,library,template});if(node)module.exports=api;else {root.MacroExercisePreviews=api;mountInline();}
})(typeof window!=='undefined'?window:globalThis);
