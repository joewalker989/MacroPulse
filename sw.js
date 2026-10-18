const CACHE='macropulse-v7-1-3';
const ASSETS=['./restaurant-guide.js?v=7.1.2','./workout-visuals.js?v=7.1.2','./stack-guide.js?v=7.1.2','./seven.js?v=7.1.2','./seven-ui.js?v=7.1.2','./photo-compare.js?v=7.1.2','./six.js?v=7.1.2','./six-ui.js?v=7.1.2','./health.js?v=7.1.2','./health-ui.js?v=7.1.2','./','./index.html','./five.js?v=7.1.2','./five-ui.js?v=7.1.2','./photos.js?v=7.1.2','./photos-ui.js?v=7.1.2','./complete.js?v=7.1.2','./complete-ui.js?v=7.1.2','./app.js?v=7.1.2','./data.js?v=7.1.2','./upgrade.js?v=7.1.2','./upgrade-ui.js?v=7.1.2','./training.js?v=7.1.2','./training-ui.js?v=7.1.2','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(url=>new Request(url,{cache:'reload'}))))));
// Activate after existing tabs close so each tab uses one release.
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('macropulse-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(event.request))||fetch(event.request)));
});
