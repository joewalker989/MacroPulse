/* Explicit first-use downloads, SHA-256 verification, then same-origin offline execution. */
(function(root){'use strict';
 const A=root.MacroOCRAssets,hex=bytes=>Array.from(new Uint8Array(bytes),v=>v.toString(16).padStart(2,'0')).join('');
 async function valid(bytes,asset){return hex(await crypto.subtle.digest('SHA-256',bytes))===asset.sha256;}
 const runtimeURL=name=>new URL(A.path+name,new URL('./',location.href)).href;
 async function controller(){
  if(!('serviceWorker'in navigator)||!('caches'in root)||!crypto.subtle)throw Error('A secure browser with offline storage is required.');
  await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('Offline support is not ready. Reopen MacroPulse online and retry.')),15000);navigator.serviceWorker.ready.then(value=>{clearTimeout(timeout);resolve(value);},error=>{clearTimeout(timeout);reject(error);});});
  if(!navigator.serviceWorker.controller)await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>{navigator.serviceWorker.removeEventListener('controllerchange',changed);reject(Error('Close MacroPulse tabs and reopen online to activate offline label reading.'));},10000);function changed(){clearTimeout(timeout);resolve();}navigator.serviceWorker.addEventListener('controllerchange',changed,{once:true});});
  await new Promise((resolve,reject)=>{const channel=new MessageChannel(),timeout=setTimeout(()=>{channel.port1.close();reject(Error('Close all MacroPulse tabs and reopen online to activate the updated label reader.'));},3000);channel.port1.onmessage=e=>{clearTimeout(timeout);channel.port1.close();if(e.data?.ocrCache===A.cache)resolve();else reject(Error('Update MacroPulse before downloading the label reader.'));};navigator.serviceWorker.controller.postMessage({type:'mp-ocr-ready'},[channel.port2]);});
 }
 async function prepare(status=()=>{}){
  await controller();const cache=await caches.open(A.cache);
  for(const [i,asset]of A.files.entries()){
   const url=runtimeURL(asset.name),saved=await cache.match(url);
   if(saved&&await valid(await saved.arrayBuffer(),asset))continue;
   if(saved)await cache.delete(url);
   status(`Downloading and checking label reader ${i+1}/${A.files.length}. Pictures stay on this device.`);
   const response=await fetch(asset.url,{credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(60000)});
   if(!response.ok)throw Error('Label-reader download unavailable ('+response.status+'). Try online later.');
   const bytes=await response.arrayBuffer();if(!await valid(bytes,asset))throw Error('Label-reader integrity check failed. The download was not installed.');
   await cache.put(url,new Response(bytes,{headers:{'Content-Type':asset.type,'Cache-Control':'no-store'}}));
  }
  if(!root.Tesseract)await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=runtimeURL('tesseract.min.js');script.onload=()=>{if(root.Tesseract)resolve();else reject(Error('Label-reader library did not initialize.'));};script.onerror=()=>{script.remove();reject(Error('Label-reader cache is unavailable. Reopen online and retry.'));};document.head.append(script);});
  status('Verified label reader ready. Cached files can be used offline.');return runtimeURL;
 }
 root.MacroOCRLoader={prepare,runtimeURL};
})(window);
