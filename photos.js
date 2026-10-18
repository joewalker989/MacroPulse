/* Private local photo store. No network calls. Backups are explicit downloads. */
(function(root){
 'use strict';
 const NAME='macropulse_photos_v1',VERSION=1,MAX=12000000;
 const V=typeof module!=='undefined'&&module.exports?require('./photo-compare.js'):root.MacroPhotoCompare;
 const stamp=x=>typeof x==='string'&&Number.isFinite(Date.parse(x));
 function valid(p){return p&&typeof p.id==='string'&&p.id.length>0&&p.id.length<=160&&stamp(p.at)&&['front','side','back'].includes(p.view)&&typeof p.measurement==='string'&&p.measurement.length<=500&&typeof p.note==='string'&&p.note.length<=2000&&p.align&&Number.isFinite(p.align.x)&&Math.abs(p.align.x)<=50&&Number.isFinite(p.align.y)&&Math.abs(p.align.y)<=50&&Number.isFinite(p.align.scale)&&p.align.scale>=.5&&p.align.scale<=2&&(p.revision===undefined||(Number.isSafeInteger(p.revision)&&p.revision>=0))&&(p.comparisons===undefined&&p.comparisonVersion===undefined||p.comparisonVersion===1&&V.validPairs(p.comparisons))&&p.blob instanceof Blob&&p.blob.type==='image/jpeg'&&p.blob.size>0&&p.blob.size<=MAX;}
 function open(){return new Promise((resolve,reject)=>{const r=indexedDB.open(NAME,VERSION);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('photos'))r.result.createObjectStore('photos',{keyPath:'id'});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(Error('Close other MacroPulse tabs before opening photo storage.'));});}
 async function transaction(mode,task){const db=await open();try{return await new Promise((resolve,reject)=>{const tx=db.transaction('photos',mode);let result;tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error||Error('Photo storage failed.'));tx.onabort=()=>reject(tx.error||Error('Photo transaction aborted.'));task(tx.objectStore('photos'),v=>result=v,tx,reject);});}finally{db.close();}}
 const all=()=>transaction('readonly',(store,done)=>{const r=store.getAll();r.onsuccess=()=>done(r.result.sort((a,b)=>a.at.localeCompare(b.at)));});
 const add=p=>{if(!valid(p))throw Error('Invalid photo record.');return transaction('readwrite',s=>s.add(p));};
 const update=p=>{if(!valid(p))throw Error('Invalid photo record.');return transaction('readwrite',(s,done,tx,reject)=>{const r=s.get(p.id);r.onsuccess=()=>{if(!r.result||(r.result.revision||0)!==(p.revision||0)){tx.abort();reject(Error('Photo changed or was removed in another tab. Reload before saving.'));return;}s.put({...p,revision:(p.revision||0)+1});};});};
 const remove=id=>transaction('readwrite',s=>s.delete(id));
 const clear=()=>transaction('readwrite',s=>s.clear());
 async function normalize(file){
  if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>MAX||file.size===0)throw Error('Choose JPEG, PNG or WebP up to 12 MB. Convert HEIC to JPEG first.');
  const bitmap=await createImageBitmap(file);try{
   if(bitmap.width*bitmap.height>60000000)throw Error('Image dimensions too large. Resize before importing.');
   const ratio=Math.min(1,1600/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*ratio);canvas.height=Math.round(bitmap.height*ratio);const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
   return await new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('Image conversion failed.')),'image/jpeg',.88));
  }finally{bitmap.close();}
 }
 async function digest(text){const bytes=new TextEncoder().encode(text);return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');}
 const dataURL=blob=>new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.readAsDataURL(blob);});
 async function backup(ids=null){const rows=(await all()).filter(p=>!ids||ids.includes(p.id)),photos=[];for(const p of rows){const {blob,...meta}=p;photos.push({...meta,data:await dataURL(blob)});}const payload={version:1,photos};return {format:'MacroPulse Photos',sha256:await digest(JSON.stringify(payload)),payload};}
 async function decode(backup){
  if(backup?.format!=='MacroPulse Photos'||backup.payload?.version!==1||!Array.isArray(backup.payload.photos)||backup.payload.photos.length>5000)throw Error('Unsupported photo backup.');
  if(await digest(JSON.stringify(backup.payload))!==backup.sha256)throw Error('Checksum mismatch. No photos changed.');
  const ids=new Set(),rows=[];for(const p of backup.payload.photos){
   if(typeof p.data!=='string'||!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(p.data)||p.data.length>MAX*1.4)throw Error('Invalid photo encoding.');
   const bytes=Uint8Array.from(atob(p.data.split(',')[1]),x=>x.charCodeAt(0)),{data,...meta}=p,record={...meta,blob:new Blob([bytes],{type:'image/jpeg'})};
   if(!valid(record)||ids.has(record.id)||bytes[0]!==255||bytes[1]!==216)throw Error('Invalid or duplicate photo.');
   const bitmap=await createImageBitmap(record.blob);try{if(bitmap.width*bitmap.height>60000000)throw Error('Backup image dimensions too large.');}finally{bitmap.close();}
   ids.add(record.id);rows.push(record);
  }return rows;
 }
 async function restore(backup){
  const rows=await decode(backup);
  // One transaction, add-only. Existing IDs are never overwritten, even by a stale tab.
  await transaction('readwrite',store=>{for(const p of rows){const r=store.get(p.id);r.onsuccess=()=>{if(!r.result)store.add(p);};}});return rows.length;
 }
 const api={NAME,VERSION,MAX,valid,all,add,update,remove,clear,normalize,digest,backup,decode,restore};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MacroPhotos=api;
})(typeof window!=='undefined'?window:globalThis);
