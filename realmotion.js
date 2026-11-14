/* Trusted content manifest and pure playback rules. Never inferred from saved logs. */
(function(root){
 'use strict';
 const node=typeof module!=='undefined'&&module.exports;
 const V=node?require('./workout-visuals'):root.MacroWorkoutVisuals;
 const T=node?require('./training'):root.MacroTraining;
 const C=node?require('./video-catalog'):root.MacroVideoCatalog;
 const speeds=Object.freeze([.25,.5,.75,1]),angles=Object.freeze(['front','side','45']);
 // Empty until actual footage, rights and specialist review evidence are supplied.
 const reviews=Object.freeze([]);
 const extras={curl:['Dumbbells'],'band-curl':['Resistance bands'],'band-squat':['Resistance bands'],'shoulder-press':['Dumbbells'],'calf-raise':[],plank:[],'leg-raise':[]};
 const exercises=Object.freeze(Object.entries(V.labels).map(([id,name])=>Object.freeze({id,name,requires:Object.freeze([...(T.library.find(e=>e.id===id)?.requires||extras[id]||[])]),cue:T.library.find(e=>e.id===id)?.cue||''})));
 const legacy=Object.freeze({'bench-press':Object.freeze([17,18,19,20]),curl:Object.freeze([48])});
 const evidence=x=>!!(x&&typeof x.by==='string'&&x.by.trim()&&/^\d{4}-\d{2}-\d{2}$/.test(x.date||'')&&Number.isFinite(Date.parse(x.date))&&new Date(x.date).toISOString().slice(0,10)===x.date&&/^https:\/\//.test(x.source||''));
 const mediaURL=s=>typeof s==='string'&&(/^(?:\.\/)?media\/[a-zA-Z0-9_./-]+$/.test(s)&&!s.includes('..')||/^https:\/\/wger\.de\/media\/exercise-video\/\d+\/[a-f0-9-]+\.(?:MOV|MP4|mp4)$/.test(s));
 const licensed=x=>!!(x&&typeof x.author==='string'&&x.author.trim()&&typeof x.license==='string'&&x.license.trim()&&/^https:\/\//.test(x.licenseURL||'')&&evidence(x.rights));
 function exercise(value){const id=V.resolve(value);return exercises.find(e=>e.id===id)||null;}
 function validClip(c,e){return !!(c&&e&&c.exerciseId===e.id&&c.origin==='human-footage'&&typeof c.revision==='string'&&c.revision.trim()&&c.reviewedRevision===c.revision&&mediaURL(c.url)&&licensed(c)&&evidence(c.modelRelease)&&evidence(c.mechanics)&&evidence(c.camera)&&angles.includes(c.angle)&&Array.isArray(c.equipment)&&JSON.stringify([...c.equipment].sort())===JSON.stringify([...e.requires].sort())&&Number.isFinite(c.seconds)&&c.seconds>0&&Number.isInteger(c.bytes)&&c.bytes>0&&['h264','hevc'].includes(c.codec));}
 function clips(value,rows=reviews){const e=exercise(value);return rows.filter(c=>validClip(c,e));}
 function candidates(value){const e=exercise(value);return (legacy[e?.id]||[]).map(id=>C.rows.find(v=>v.id===id)).filter(Boolean).sort((a,b)=>a.bytes-b.bytes);}
 function reps(c,duration=c?.seconds){return evidence(c?.repReview)&&Number.isFinite(duration)?(c.reps||[]).filter(r=>Number.isFinite(r.start)&&Number.isFinite(r.end)&&r.start>=0&&r.end>r.start&&r.end<=Math.min(duration,c.seconds)):[];}
 function coaching(c){return evidence(c?.coachingReview)&&Array.isArray(c.coaching)?c.coaching.filter(x=>typeof x.text==='string'&&x.text.trim()&&Number.isFinite(x.start)&&Number.isFinite(x.end)&&x.start>=0&&x.end>x.start&&x.end<=c.seconds).sort((a,b)=>a.start-b.start):[];}
 const zones=Object.freeze(['arms','chest','back','thighs','hips']);
 function muscles(c){return evidence(c?.muscleReview)&&Array.isArray(c.muscles)?c.muscles.filter(x=>zones.includes(x.zone)&&typeof x.label==='string'&&x.label.trim()):[];}
 function form(c){return evidence(c?.formReview)&&Array.isArray(c.form)?c.form.filter(x=>typeof x.correct==='string'&&x.correct.trim()&&typeof x.incorrect==='string'&&x.incorrect.trim()):[];}
 function loopTarget(time,range){return range&&(time>=range.end||time<range.start)?range.start:null;}
 const api=Object.freeze({reviews,exercises,speeds,angles,zones,exercise,validClip,clips,candidates,reps,coaching,muscles,form,loopTarget,mediaURL,licensed});
 if(node)module.exports=api;else root.MacroRealMotion=api;
})(typeof window!=='undefined'?window:globalThis);
