const CACHE='macropulse-v7-1-2';
const ASSETS=['./restaurant-guide.js?v=7.1.1','./workout-visuals.js?v=7.1.1','./stack-guide.js?v=7.1.1','./seven.js?v=7.1.1','./seven-ui.js?v=7.1.1','./photo-compare.js?v=7.1.1','./six.js?v=7.1.1','./six-ui.js?v=7.1.1','./health.js?v=7.1.1','./health-ui.js?v=7.1.1','./','./index.html','./five.js?v=7.1.1','./five-ui.js?v=7.1.1','./photos.js?v=7.1.1','./photos-ui.js?v=7.1.1','./complete.js?v=7.1.1','./complete-ui.js?v=7.1.1','./app.js?v=7.1.1','./data.js?v=7.1.1','./upgrade.js?v=7.1.1','./upgrade-ui.js?v=7.1.1','./training.js?v=7.1.1','./training-ui.js?v=7.1.1','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(url=>new Request(url,{cache:'reload'}))))));
// Activate after existing tabs close so each tab uses one release.
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('macropulse-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(event.request))||fetch(event.request)));
});
