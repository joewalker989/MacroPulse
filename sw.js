const CACHE='macropulse-v4-complete-5';
const ASSETS=['./','./index.html','./app.js?v=4.0.1','./data.js?v=4.0.1','./upgrade.js?v=4.0.1','./upgrade-ui.js?v=4.0.1','./training.js?v=4.0.1','./training-ui.js?v=4.0.1','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(url=>new Request(url,{cache:'reload'}))))));
// Activate after existing tabs close so each tab uses one release.
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('macropulse-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(event.request))||fetch(event.request)));
});
