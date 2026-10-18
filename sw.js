const CACHE='macropulse-v5-1-1';
const ASSETS=['./health.js?v=5.1.0','./health-ui.js?v=5.1.0','./','./index.html','./five.js?v=5.1.0','./five-ui.js?v=5.1.0','./photos.js?v=5.1.0','./photos-ui.js?v=5.1.0','./complete.js?v=5.1.0','./complete-ui.js?v=5.1.0','./app.js?v=5.1.0','./data.js?v=5.1.0','./upgrade.js?v=5.1.0','./upgrade-ui.js?v=5.1.0','./training.js?v=5.1.0','./training-ui.js?v=5.1.0','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(url=>new Request(url,{cache:'reload'}))))));
// Activate after existing tabs close so each tab uses one release.
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('macropulse-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(event.request))||fetch(event.request)));
});
