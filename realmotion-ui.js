/* One integrated, ephemeral player; deliberately has no storage/save access. */
'use strict';
window.mountRealMotion=function({escapeHTML:esc,getEquipment}){
 const R=MacroRealMotion,dialog=document.createElement('dialog');dialog.id='realMotion';dialog.setAttribute('aria-labelledby','rmTitle');
 dialog.innerHTML=`<div class="rm-heading"><div><p class="notice">Workouts › Exercise › Watch Demonstration</p><h2 id="rmTitle">RealMotion Studio</h2></div><button type="button" id="rmClose" aria-label="Close RealMotion Studio">Close</button></div>
 <h3 id="rmExercise"></h3><p id="rmEquipment"></p><p id="rmNotice" class="notice"></p><p id="rmGuidance"></p>
 <details id="rmFallbackPanel" open><summary>Existing offline demonstration</summary><div id="rmFallback"></div></details>
 <div class="rm-angles" role="group" aria-label="Camera angle">${R.angles.map(a=>`<button type="button" data-rm-angle="${a}" disabled>${a==='45'?'45°':a[0].toUpperCase()+a.slice(1)} · unavailable</button>`).join('')}</div>
 <div id="rmChoices"></div><div id="rmCredit" class="notice"></div>
 <video id="rmVideo" controls playsinline preload="none" muted hidden aria-label="Exercise demonstration"></video>
 <p id="rmCaption" class="rm-caption" hidden></p>
 <div class="rm-controls"><label>Playback speed<select id="rmSpeed">${R.speeds.map(n=>`<option value="${n}" ${n===1?'selected':''}>${n}×</option>`).join('')}</select></label>
 <label>Complete rep<select id="rmRep" disabled><option value="">Reviewed rep timing unavailable</option></select></label>
 <label><input type="checkbox" id="rmLoop" disabled> Loop selected complete rep</label>
 <label><input type="checkbox" id="rmClipLoop" disabled> Repeat whole clip (not rep-trimmed)</label>
 <label><input type="checkbox" id="rmVoice" disabled> Synchronized voice coaching</label>
 <label><input type="checkbox" id="rmCaptions" disabled> Coaching captions</label>
 <label><input type="checkbox" id="rmMute" checked> Mute video / synchronized coaching</label></div>
 <button type="button" id="rmReadCues" hidden>Read written cue aloud (not synchronized)</button><button type="button" id="rmStopReading" hidden>Stop reading</button>
 <button type="button" id="rmStop">Stop & release stream</button><p id="rmStatus" role="status">No video loaded.</p>
 <details><summary>Coaching transcript</summary><div id="rmTranscript"></div></details>
 <details><summary>Muscle highlights</summary><div id="rmMuscles"></div></details>
 <details><summary>Correct vs incorrect form</summary><div id="rmForm"></div></details>`;
 document.body.append(dialog);const $=id=>dialog.querySelector('#'+id),video=$('rmVideo'),audio=new Audio();audio.preload='none';
 let current=null,selected=null,opener=null,frames=0,generation=0,voiceFailed=false;
 const status=s=>$('rmStatus').textContent=s;
 function stopReading(){if('speechSynthesis' in window)speechSynthesis.cancel();}
 function pause(){video.pause();audio.pause();stopReading();cancelAnimationFrame(frames);}
 function release(){generation++;pause();selected=null;voiceFailed=false;video.loop=false;$('rmClipLoop').checked=false;$('rmClipLoop').disabled=true;video.removeAttribute('src');video.load();video.hidden=true;audio.removeAttribute('src');audio.load();$('rmCaption').hidden=true;$('rmLoop').checked=false;$('rmLoop').disabled=true;$('rmRep').disabled=true;$('rmRep').innerHTML='<option value="">Reviewed rep timing unavailable</option>';$('rmVoice').checked=false;$('rmVoice').disabled=true;$('rmCaptions').checked=false;$('rmCaptions').disabled=true;$('rmCredit').textContent='';$('rmTranscript').textContent='Synchronized coaching unavailable. Existing written guidance appears in the offline demonstration.';$('rmMuscles').textContent='Reviewed muscle highlights unavailable. No anatomical overlay is inferred from this demo.';$('rmForm').textContent='Reviewed correct/incorrect form comparison unavailable.';}
 function close(){if(!dialog.open)return;release();dialog.close();if(opener?.isConnected)opener.focus();}
 function range(){return $('rmLoop').checked?R.reps(selected,video.duration)[Number($('rmRep').value)]:null;}
 function syncVoice(){
  video.muted=$('rmMute').checked||$('rmVoice').checked;
  if(!selected||!$('rmVoice').checked||$('rmMute').checked||voiceFailed||video.paused||video.seeking){audio.pause();return;}
  audio.playbackRate=video.playbackRate;if(Math.abs(audio.currentTime-video.currentTime)>.18)audio.currentTime=video.currentTime;
  if(audio.paused){const token=generation;audio.play().catch(()=>{if(token!==generation)return;voiceFailed=true;audio.pause();$('rmVoice').checked=false;status('Voice coaching could not play. Use the captions and transcript.');});}
 }
 function tick(){if(!selected)return;const target=R.loopTarget(video.currentTime,range());if(target!==null)video.currentTime=target;
  const cue=R.coaching(selected).find(c=>video.currentTime>=c.start&&video.currentTime<c.end);$('rmCaption').textContent=cue?.text||'';$('rmCaption').hidden=!$('rmCaptions').checked||!cue;syncVoice();}
 function animate(){tick();if(selected&&!video.paused&&!video.hidden&&dialog.open)frames=requestAnimationFrame(animate);}
 function renderMetadata(){
  const rep=R.reps(selected,video.duration);$('rmRep').disabled=!rep.length;$('rmLoop').disabled=!rep.length;$('rmRep').innerHTML=rep.length?rep.map((r,i)=>`<option value="${i}">Rep ${i+1} · ${r.start}–${r.end}s</option>`).join(''):'<option value="">Reviewed rep timing unavailable</option>';
 }
 function load(clip,reviewed){
  release();if(navigator.onLine===false){status('Offline: publisher footage unavailable. Use the existing demonstration pictures and written cues in this player.');return;}
  if(clip.codec==='hevc'&&!video.canPlayType('video/mp4; codecs="hvc1"')){status('HEVC is unsupported on this device. Existing offline pictures remain available.');return;}
  selected=reviewed?clip:null;
  $('rmCredit').innerHTML=`<strong>${esc(reviewed?current.name:clip.name)}</strong> · ${esc(clip.author)} · <a href="${esc(clip.licenseURL)}" target="_blank" rel="noopener noreferrer">${esc(clip.license)}</a> · <a href="${esc(reviewed?clip.rights.source:clip.source)}" target="_blank" rel="noopener noreferrer">Source / rights record</a><p>${reviewed?'Reviewed human footage · camera '+esc(clip.angle)+' · reviewer '+esc(clip.mechanics.by)+' · '+esc(clip.mechanics.date):'Existing community reference. Camera angle and mechanics are not reviewed.'} Original file unchanged; playback speed is a player setting.</p>${reviewed?'':`<p>Exercise-name metadata: ${esc(clip.exerciseAuthor)} (${esc(clip.exerciseLicenseName)}).</p>`}`;
  const coaching=R.coaching(selected),muscles=R.muscles(selected),form=R.form(selected);
  if(coaching.length){$('rmCaptions').disabled=false;$('rmCaptions').checked=true;$('rmTranscript').innerHTML='<ol>'+coaching.map(c=>`<li>${c.start}–${c.end}s: ${esc(c.text)}</li>`).join('')+'</ol>';}
  if(coaching.length&&R.mediaURL(clip.voice?.url)&&R.licensed(clip.voice)){audio.src=clip.voice.url;$('rmVoice').disabled=false;$('rmTranscript').insertAdjacentHTML('beforeend',`<p>Voice: ${esc(clip.voice.author)} · <a href="${esc(clip.voice.licenseURL)}" target="_blank" rel="noopener noreferrer">${esc(clip.voice.license)}</a></p>`);}
  if(muscles.length){$('rmMuscles').innerHTML=`<p>Reviewed muscle regions · schematic only, not measured activation.</p><svg viewBox="0 0 160 240" role="img" aria-label="Reviewed muscle regions: ${esc(muscles.map(x=>x.label).join(', '))}"><circle cx="80" cy="20" r="15" fill="#94a3b8"/>${[['chest',55,42,50,35],['back',55,80,50,25],['arms',25,48,23,65],['hips',55,110,50,26],['thighs',55,140,50,70]].map(([z,x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${muscles.some(m=>m.zone===z)?'#34d399':'#475569'}"/>`).join('')}</svg><ul>${muscles.map(m=>`<li>${esc(m.label)} (${esc(m.zone)})</li>`).join('')}</ul>`;}
  if(form.length)$('rmForm').innerHTML=form.map(f=>`<p><strong>Correct:</strong> ${esc(f.correct)}</p><p><strong>Avoid:</strong> ${esc(f.incorrect)}</p>`).join('');
  $('rmClipLoop').disabled=false;$('rmFallbackPanel').open=false;video.hidden=false;video.muted=$('rmMute').checked;video.src=clip.url;video.preload='metadata';video.load();video.playbackRate=Number($('rmSpeed').value);video.scrollIntoView({block:'nearest'});status('Selected video loading. Press Play when ready. No video is saved for offline use.');
 }
 function loadReference(){
  const c=MacroExercisePreviews.reference(current.id);if(!c)return;release();
  $('rmCredit').innerHTML=MacroExercisePreviews.credit(c)+(c.kind==='3d-motion'?'<p>Generated 3D reference using a reusable anatomical model and newly authored keyframes. Single rendered view; mechanics have no specialist review.</p>':'<p>Commercial app-use licence · <a href="'+c.source+'" target="_blank" rel="noopener noreferrer">Publisher terms</a>. Original file unchanged. Single filmed view; camera label and mechanics have no specialist review.</p>');
  $('rmFallbackPanel').open=false;$('rmClipLoop').disabled=false;video.hidden=false;video.src=c.url;video.preload='metadata';video.load();video.playbackRate=Number($('rmSpeed').value);
  status('Loading local exercise reference. Press Play to begin. Offline video availability is not guaranteed; pictures and cues remain available.');
 }
 function open(value,button){const e=R.exercise(value);if(!e)return;document.getElementById('licensedVideoStop')?.click();release();$('rmFallbackPanel').open=true;current=e;opener=button;$('rmExercise').textContent=e.name;
  const missing=e.requires.filter(x=>!getEquipment().includes(x));$('rmGuidance').textContent='Target muscles: '+MacroExercisePreviews.muscles(e)+' · Cue: '+MacroExercisePreviews.cue(e);$('rmReadCues').hidden=$('rmStopReading').hidden=!('speechSynthesis' in window&&'SpeechSynthesisUtterance' in window);$('rmEquipment').textContent='Equipment: '+(e.requires.join(' + ')||'Bodyweight')+(missing.length?' · Not in your saved inventory: '+missing.join(', '):'');
  const clips=R.clips(e.id),legacy=R.candidates(e.id),reference=MacroExercisePreviews.reference(e.id);$('rmNotice').textContent=clips.length?'Select reviewed footage below. Stop if a movement causes pain.':'Verified trainer footage is not available for this exercise. Existing demos remain available; no AI motion is presented as anatomically verified.';
  for(const b of dialog.querySelectorAll('[data-rm-angle]')){const found=clips.some(c=>c.angle===b.dataset.rmAngle);b.disabled=!found;b.textContent=(b.dataset.rmAngle==='45'?'45°':b.dataset.rmAngle[0].toUpperCase()+b.dataset.rmAngle.slice(1))+(found?'':' · unavailable');}
  $('rmChoices').innerHTML=[...(reference?['<button type="button" data-rm-reference>Load '+(reference.kind==='3d-motion'?'3D':'real-human')+' pilot · '+Math.max(.1,reference.bytes/1e6).toFixed(1)+' MB · '+esc(reference.title)+'</button>']:[]),...clips.map((c,i)=>`<button type="button" data-rm-clip="${i}">Load reviewed ${esc(c.angle)} · ${(c.bytes/1e6).toFixed(1)} MB · ${esc(c.codec)}</button>`),...legacy.map((c,i)=>`<button type="button" data-rm-legacy="${i}">Load existing community demo · ${(c.bytes/1e6).toFixed(1)} MB · ${esc(c.codec)}</button>`)].join('')||'<p>No equipment-matched filmed clip. Use the existing offline demonstration.</p>';
  $('rmFallback').innerHTML=MacroWorkoutVisuals.illustration(e.id).replace(/<button[^>]*data-realmotion[^>]*>.*?<\/button>/g,'')+`<p>${esc(e.cue||'Use the existing exercise coaching card for setup guidance.')}</p><p class="notice">Existing guidance; specialist review pending. This player does not assess your form.</p>`;
  status(navigator.onLine===false?'Offline: existing demonstration pictures available.':'No video loaded. Loading a publisher clip uses mobile data and contacts wger; no workout or health records are sent.');
  if(!dialog.open)dialog.showModal();$('rmClose').focus();
 }
 dialog.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-rm-reference'))loadReference();if(b.dataset.rmClip!==undefined)load(R.clips(current.id)[Number(b.dataset.rmClip)],true);if(b.dataset.rmLegacy!==undefined)load(R.candidates(current.id)[Number(b.dataset.rmLegacy)],false);if(b.dataset.rmAngle)load(R.clips(current.id).filter(c=>c.angle===b.dataset.rmAngle).sort((a,b)=>a.bytes-b.bytes)[0],true);});
 document.addEventListener('click',e=>{const b=e.target.closest('[data-realmotion]');if(b)open(b.dataset.realmotion,b);const nav=e.target.closest('[data-page]');if(nav||e.target.closest('[data-five=focus]'))close();});
 $('rmClose').onclick=close;dialog.addEventListener('cancel',e=>{e.preventDefault();close();});dialog.addEventListener('close',()=>release());
 $('rmStop').onclick=()=>{release();$('rmFallbackPanel').open=true;status('Video stopped. Stream released; existing pictures remain available.');};
 $('rmClipLoop').onchange=()=>{video.loop=$('rmClipLoop').checked;if(video.loop)$('rmLoop').checked=false;};
 $('rmReadCues').onclick=()=>{pause();const utterance=new SpeechSynthesisUtterance(MacroExercisePreviews.cue(current));utterance.lang='en';utterance.onerror=()=>status('Speech unavailable. Read the written cue above.');speechSynthesis.speak(utterance);status('Reading general written cue. Video paused; this is not synchronized coaching.');};$('rmStopReading').onclick=stopReading;
 $('rmSpeed').onchange=()=>{video.playbackRate=Number($('rmSpeed').value);syncVoice();};
 $('rmMute').onchange=()=>{video.muted=$('rmMute').checked;syncVoice();};$('rmVoice').onchange=syncVoice;$('rmCaptions').onchange=tick;
 $('rmLoop').onchange=()=>{if(range()){video.loop=false;$('rmClipLoop').checked=false;video.currentTime=range().start;}tick();};$('rmRep').onchange=()=>{if(range())video.currentTime=range().start;tick();};
 video.onloadedmetadata=()=>{renderMetadata();status('Video ready. Use Play to begin.');};video.onerror=()=>{if(!video.getAttribute('src'))return;pause();$('rmFallbackPanel').open=true;status('Video unavailable or unsupported. Use the existing offline demo above.');};
 video.onplay=()=>{cancelAnimationFrame(frames);animate();};video.onpause=()=>{audio.pause();cancelAnimationFrame(frames);};video.onseeking=()=>{audio.pause();tick();};video.onseeked=()=>{tick();};video.ontimeupdate=tick;video.onratechange=syncVoice;
 video.onvolumechange=()=>{if($('rmVoice').checked){if(!video.muted)video.muted=true;}else $('rmMute').checked=video.muted;};
 video.onended=()=>{if(range()){video.currentTime=range().start;video.play().catch(()=>status('Press Play to continue the selected rep.'));}else audio.pause();};
 audio.onerror=()=>{if(!selected||!audio.getAttribute('src'))return;voiceFailed=true;audio.pause();$('rmVoice').checked=false;status('Voice file unavailable. Captions and transcript remain available.');};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});window.addEventListener('hashchange',close);window.addEventListener('pagehide',close);window.addEventListener('offline',()=>{if(dialog.open){release();$('rmFallbackPanel').open=true;status('Offline: footage stopped. Existing demonstration pictures and cues remain available.');}});
 return {open,close};
};
