/* Read-only release gate. Evidence completeness is not independent legal/clinical approval. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const R=require('../realmotion');
const PILOTS=Object.freeze(['curl','bench-press','squat','rdl','band-row']);
const requiredShots=()=>PILOTS.flatMap(exerciseId=>R.angles.map(angle=>({exerciseId,angle})));
const sha=s=>typeof s==='string'&&/^[a-f0-9]{64}$/.test(s);
const filled=s=>typeof s==='string'&&s.trim().length>2&&!/^(pending|todo|tbd|placeholder|unknown|test|example)\b/i.test(s.trim());
function stableURL(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.search&&!u.hash&&!/\.(test|invalid|example)$/.test(u.hostname)&&u.hostname!=='example.com';}catch{return false;}}
function date(s){return /^\d{4}-\d{2}-\d{2}$/.test(s||'')&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;}
function receipt(r,hash){return !!(r&&r.decision==='approved'&&filled(r.by)&&filled(r.evidenceId)&&date(r.date)&&stableURL(r.source)&&r.reviewedSha256===hash);}
function fastStart(buffer){
 let position=0,moov=-1,mdat=-1;
 while(position+8<=buffer.length){const size=buffer.readUInt32BE(position),type=buffer.toString('ascii',position+4,position+8);if(size<8||position+size>buffer.length)return false;if(type==='moov')moov=position;if(type==='mdat'&&mdat<0)mdat=position;position+=size;}
 return moov>=0&&mdat>=0&&moov<mdat;
}
function probeFile(file){
 const result=spawnSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',file],{encoding:'utf8',windowsHide:true,maxBuffer:1024*1024});
 if(result.error||result.status!==0)throw Error('ffprobe is required to verify final media encodes.');return JSON.parse(result.stdout);
}
function inside(root,url){if(!R.mediaURL(url)||/^https:/.test(url))return null;const file=path.resolve(root,url),relative=path.relative(root,file);if(relative.startsWith('..')||path.isAbsolute(relative))return null;try{const resolved=fs.realpathSync(file),rel=path.relative(fs.realpathSync(root),resolved);return rel.startsWith('..')||path.isAbsolute(rel)?null:resolved;}catch{return null;}}
const canonical=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v);
function audit(bundle,{root=path.resolve(__dirname,'..'),commit,probe=probeFile,published=R.reviews}={}){
 const blockers=[],checked=[];const add=(shot,message)=>blockers.push({shot,message});
 if(bundle?.schemaVersion!==1)add('release','Unsupported review package schema.');
 if(!/^[a-f0-9]{40}$/.test(commit||'')||bundle?.buildCommit!==commit)add('release','Pin the package to the exact release candidate commit.');
 const rows=Array.isArray(bundle?.clips)?bundle.clips:[];
 if(canonical(rows)!==canonical(published))add('release','Approved intake clips must exactly match the trusted production manifest.');
 if(rows.length!==15)add('release','Full pilot requires exactly 15 approved clips: five exact variants × three angles.');
 const hashes=rows.map(c=>c?.sha256).filter(sha);if(new Set(hashes).size!==hashes.length)add('release','Distinct exercise/camera deliveries must not reuse identical video bytes.');
 for(const shot of requiredShots()){
  const key=shot.exerciseId+':'+shot.angle,matches=rows.filter(c=>c&&c.exerciseId===shot.exerciseId&&c.angle===shot.angle);
  if(matches.length!==1){add(key,'Supply one uniquely identified clip for this exercise and angle.');continue;}
  const c=matches[0],exercise=R.exercise(shot.exerciseId);
  if(!R.validClip(c,exercise))add(key,'Human footage, exact equipment, camera, mechanics and rights manifest requirements are incomplete.');
  if(!filled(c.author)||!filled(c.license)||!stableURL(c.licenseURL))add(key,'Supply the final public creator credit and stable license link, without placeholder text or access tokens.');
  if(!sha(c.sha256))add(key,'Final video SHA-256 is missing.');
  for(const field of ['rights','modelRelease','mechanics','camera','repReview','muscleReview','formReview','coachingReview','technicalReview'])if(!receipt(c[field],c.sha256))add(key,field+': require a dated approval bound to this video hash, with an evidence ID and stable private/public record URL.');
  if(!filled(c.mechanics?.credential)||!stableURL(c.mechanics?.credentialVerification))add(key,'Verify the exercise reviewer’s relevant credential and record its verification source.');
  const read=fn=>{try{return fn(c);}catch{return [];}};
  const reps=read(R.reps),cues=read(R.coaching),muscles=read(R.muscles),form=read(R.form);
  if(!reps.length||reps.length!==(c.reps||[]).length)add(key,'Supply reviewed complete-rep bounds entirely inside the final clip.');
  if(!cues.length||cues.length!==(c.coaching||[]).length||cues.some((x,i)=>i&&x.start<cues[i-1].end))add(key,'Supply non-overlapping reviewed coaching captions and transcript timestamps.');
  if(!muscles.length||muscles.length!==(c.muscles||[]).length)add(key,'Supply reviewed muscle labels and supported schematic zones.');
  if(!form.length||form.length!==(c.form||[]).length)add(key,'Supply reviewed correct/avoid form cue pairs.');
  const file=inside(root,c.url);
  if(!file){add(key,'Place final video under media/ in the release workspace; remote publisher URLs are not hash-verified by this gate.');continue;}
  if(fs.statSync(file).size>6000000){add(key,'Video exceeds the 6 MB mobile budget; export a smaller reviewed delivery copy.');continue;}
  const buffer=fs.readFileSync(file),hash=crypto.createHash('sha256').update(buffer).digest('hex');
  if(hash!==c.sha256)add(key,'Video bytes changed after review; repeat media-bound approvals.');
  if(buffer.length!==c.bytes||buffer.length>6000000)add(key,'Video must match the manifest byte count and stay within the 6 MB mobile budget.');
  if(!fastStart(buffer))add(key,'Require an MP4 with moov before mdat for progressive playback.');
  try{
   const info=probe(file),streams=info.streams||[],v=streams.find(s=>s.codec_type==='video'),duration=Number(info.format?.duration),fps=v?.avg_frame_rate?.split('/').reduce((a,b)=>a/Number(b));
   if(v?.codec_name!=='h264'||v?.pix_fmt!=='yuv420p'||!Number.isFinite(fps)||fps<24||fps>60||Math.max(v?.width||0,v?.height||0)>1280||Math.min(v?.width||0,v?.height||0)<480)add(key,'Require phone-sized H.264/yuv420p at 24–60 fps, short edge ≥480 and long edge ≤1280.');
   if(!Number.isFinite(duration)||duration<=0||duration>25||Math.abs(duration-c.seconds)>.15)add(key,'Video duration must match the manifest within 0.15s and be at most 25s.');
   if(streams.some(s=>s.codec_type==='audio'))add(key,'Deliver silent video plus the separately cleared coaching audio; remove incidental music/speech.');
  }catch(error){add(key,error.message);}
  const voice=c.voice,voiceFile=inside(root,voice?.url);
  if(!sha(voice?.sha256)||c.coachingReview?.voiceSha256!==voice.sha256)add(key,'Coaching review must bind both video and voice checksums.');
  if(!voiceFile||!sha(voice?.sha256)||!R.licensed(voice)||!filled(voice.author)||!filled(voice.license)||!stableURL(voice.licenseURL)||!receipt(voice?.rights,voice?.sha256))add(key,'Supply a separately rights-cleared voice file, checksum and hash-bound rights receipt.');
  else{
   if(fs.statSync(voiceFile).size>1000000){add(key,'Voice file exceeds the 1 MB mobile budget.');continue;}
   const data=fs.readFileSync(voiceFile);if(data.length>1000000||crypto.createHash('sha256').update(data).digest('hex')!==voice.sha256)add(key,'Voice bytes must match review and stay within 1 MB.');
   try{const info=probe(voiceFile),duration=Number(info.format?.duration);if(!info.streams?.some(s=>s.codec_type==='audio'&&s.codec_name==='aac')||info.streams?.some(s=>s.codec_type==='video')||!Number.isFinite(duration)||Math.abs(duration-c.seconds)>.15)add(key,'Coaching must be AAC audio aligned to the full video duration, including silence.');}catch(error){add(key,error.message);}
  }
  checked.push(key);
 }
 const cases=['playback','angles','speeds','repLoop','voiceSync','captionsTranscript','mute','offlineFallback','screenReaderKeyboard','savedDataPreservation'];
 for(const platform of ['ios-safari','android-chrome']){const signoff=bundle?.devices?.[platform];if(signoff?.decision!=='approved'||!filled(signoff.by)||!date(signoff.date)||!filled(signoff.device)||!filled(signoff.os)||!filled(signoff.browser)||!stableURL(signoff.evidence)||signoff.buildCommit!==commit||cases.some(x=>signoff.cases?.[x]!==true))add(platform,'Record real-device review, evidence and all ten checks against this exact build.');}
 if(bundle?.releaseOwner?.decision!=='approved'||!filled(bundle.releaseOwner.by)||!date(bundle.releaseOwner.date)||bundle.releaseOwner.buildCommit!==commit||!stableURL(bundle.releaseOwner.evidence))add('release','Release owner must approve the exact candidate after rights, content, devices and CI review.');
 return {ready:blockers.length===0,scope:'Full five-exercise, three-angle pilot',checked,blockers,note:'This read-only gate checks evidence structure and media integrity. It cannot authenticate signatures, confer rights, or replace an exercise specialist. It never deploys.'};
}
module.exports={audit,requiredShots,fastStart,receipt};
if(require.main===module){
 try{const file=process.argv[2]||'review/realmotion/release-intake.template.json',commit=spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8',windowsHide:true}).stdout?.trim(),result=audit(JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,'')),{commit});process.stdout.write(JSON.stringify(result,null,2)+'\n');process.exitCode=result.ready?0:1;}catch(error){process.stderr.write(error.message+'\n');process.exitCode=1;}
}
