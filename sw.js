const CACHE='wondervale-e01-20261008-slice2';
const FILES=['./', './index.html', './app/main.mjs', './app/style.css', './engine/episode.mjs', './public/episode.json', './public/art/town-square-master.webp', './public/art/trio-sprites.webp', './public/art/noticeboard-reference.webp', './public/art/marker-reference.webp', './public/art/steward.webp', './public/art/glyph.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('wondervale-e01-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method==='GET'&&new URL(e.request.url).origin===self.location.origin)e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});
