const {test}=require('node:test'),a=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),P=require('../exercise-previews'),R=require('../realmotion'),proof=require('../media/exercise-pilot/provenance.json');
test('pilot provenance binds shipped files; reviewed coaching manifest stays empty',()=>{
 a.equal(P.pilot.length,2);a.equal(proof.commercialAppUse,true);a.equal(proof.standaloneRedistribution,false);a.equal(R.reviews.length,0);
 for(const c of P.pilot){const record=proof.assets.find(x=>x.exerciseId===c.exerciseId);a.ok(record);a.deepEqual(R.exercise(c.exerciseId).requires,['Dumbbells']);for(const file of record.files){const bytes=fs.readFileSync(require('node:path').join(__dirname,'..',file.file));a.equal(bytes.length,file.bytes);a.equal(crypto.createHash('sha256').update(bytes).digest('hex'),file.sha256);}a.match(P.preview(c.exerciseId),/Exercise video by Your Move/);a.match(P.preview(c.exerciseId),/loading="lazy"/);a.match(P.preview(c.exerciseId),/<video/);a.doesNotMatch(P.preview(c.exerciseId),/src="[^" ]+\.mp4/);}
 for(const id of ['rdl','bench-press','curl','crunch'])a.equal(P.reference(id),null);
});
test('every category has exact references, equipment, muscles, cues and library navigation',()=>{
 for(const [category,ids] of Object.entries(P.categories)){a.equal(ids.length,4);for(const id of ids){const e=R.exercise(id);a.ok(e);a.ok(P.cue(e));a.ok(P.muscles(e));a.match(P.card(e,[]),/Equipment:/);a.match(P.card(e,[]),/data-realmotion/);}a.match(P.template(category,ids),/data-exercise-category/);}
 a.match(P.library([],'Lower Body',true),/0 exercises|2 exercises/);a.doesNotMatch(P.library([],'Lower Body',true),/data-exercise-card="goblet"/);a.match(P.library([],'Lower Body',false),/Not in your inventory: Dumbbells/);
});
test('screenshot examples have hash-bound generated 3D motion, not fabricated human footage or reviewed coaching',()=>{
 const proof=require('../media/exercise-3d/provenance.json'),path=require('node:path');a.equal(proof.professionalFormReview,false);a.equal(proof.model.meshLicense,'CC0-1.0');a.equal(P.models.length,3);
 for(const id of ['leg-raise','dead-bug','band-row']){const c=P.reference(id),row=proof.assets.find(x=>x.exerciseId===id);a.equal(c.kind,'3d-motion');a.ok(row);a.match(P.preview(id),/Realistic 3D motion reference/);a.match(P.preview(id),/Generated motion by MacroPulse/);a.match(P.preview(id),/Specialist form review pending/);a.doesNotMatch(P.preview(id),/<svg/);a.deepEqual(R.clips(id),[]);for(const f of row.files){const bytes=fs.readFileSync(path.join(__dirname,'..',f.file));a.equal(bytes.length,f.bytes);a.equal(crypto.createHash('sha256').update(bytes).digest('hex'),f.sha256);}}
});
