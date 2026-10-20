importScripts('./ocr-assets.js?v=8.0.1');
const CACHE='macropulse-v8-0-1';
const ASSETS=['./ocr-assets.js?v=8.0.1','./ocr-loader.js?v=8.0.1','./label-reader.js?v=8.0.1','./privacy-lock.js?v=8.0.1','./connected.js?v=8.0.1','./connected-ui.js?v=8.0.1','./extras.js?v=8.0.1','./extras-ui.js?v=8.0.1','./restaurant-guide.js?v=8.0.1','./workout-visuals.js?v=8.0.1','./stack-guide.js?v=8.0.1','./seven.js?v=8.0.1','./seven-ui.js?v=8.0.1','./photo-compare.js?v=8.0.1','./six.js?v=8.0.1','./six-ui.js?v=8.0.1','./health.js?v=8.0.1','./health-ui.js?v=8.0.1','./','./index.html','./five.js?v=8.0.1','./five-ui.js?v=8.0.1','./photos.js?v=8.0.1','./photos-ui.js?v=8.0.1','./complete.js?v=8.0.1','./complete-ui.js?v=8.0.1','./app.js?v=8.0.1','./data.js?v=8.0.1','./upgrade.js?v=8.0.1','./upgrade-ui.js?v=8.0.1','./training.js?v=8.0.1','./training-ui.js?v=8.0.1','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(url=>new Request(url,{cache:'reload'}))))));
// Activate after existing tabs close so each tab uses one release.
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('macropulse-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  const asset=MacroOCRAssets.files.find(a=>new URL(MacroOCRAssets.path+a.name,self.registration.scope).href===event.request.url);
  if(asset){event.respondWith((async()=>{const cache=await caches.open(MacroOCRAssets.cache),response=await cache.match(event.request);if(response){const bytes=await response.clone().arrayBuffer(),hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');if(hash===asset.sha256)return response;await cache.delete(event.request);}return new Response('Verified label reader not cached. Open the reader online first.',{status:503,headers:{'Content-Type':'text/plain'}});})());return;}
  event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(event.request))||fetch(event.request)));
});

self.addEventListener('message',event=>{if(event.data?.type==='mp-ocr-ready'&&event.ports[0])event.ports[0].postMessage({ocrCache:MacroOCRAssets.cache});});
