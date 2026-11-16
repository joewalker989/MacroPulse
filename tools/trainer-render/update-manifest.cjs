/* Bind rendered files and source to the shared, state-free exercise catalogue. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
function refresh(){const root=path.resolve(__dirname,'../..'),media=require('../../exercise-media'),proofFile=path.join(root,'media/exercise-3d/provenance.json'),proof=JSON.parse(fs.readFileSync(proofFile,'utf8')),hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
 const records=media.records.map(c=>({...c,bytes:fs.statSync(path.join(root,c.url)).size}));
 fs.writeFileSync(path.join(root,'exercise-media.js'),`/* Free reusable exercise media; no app state or network access. */\n(function(root){'use strict';const records=${JSON.stringify(records)};const api=Object.freeze({records:Object.freeze(records.map(Object.freeze))});if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MacroExerciseMedia=api;})(typeof window!=='undefined'?window:globalThis);\n`);
 proof.assets=records.filter(c=>c.kind==='3d-motion').map(c=>({...c,files:[c.url,c.poster].map(file=>({file,bytes:fs.statSync(path.join(root,file)).size,sha256:hash(path.join(root,file))}))}));proof.rendererHashes=Object.fromEntries(['scene.mjs','render.cjs','update-manifest.cjs'].map(file=>[file,hash(path.join(__dirname,file))]));fs.writeFileSync(proofFile,JSON.stringify(proof,null,2)+'\n');
}
module.exports={refresh};if(require.main===module)refresh();
