const CACHE='wondervale-e01-20261009-shell1';
const FILES=['./', './index.html', './app/main.mjs', './app/style.css', './engine/episode.mjs', './public/episode.json', './public/art/town-square-master.webp', './public/art/trio-sprites.webp', './public/art/noticeboard-reference.webp', './public/art/marker-reference.webp', './public/art/steward.webp', './public/art/glyph.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('wondervale-e01-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
// Revalidate unversioned source/data on each online visit; serve the cached copy offline.
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
 const path=new URL(e.request.url).pathname;
 const revalidate=path==='/'||path.endsWith('/index.html')||path.endsWith('/public/episode.json')||/\/(?:app|engine)\/.*\.(?:mjs|js|css)$/.test(path);
 e.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  if(revalidate){
   try{const response=await fetch(e.request);if(response.ok)await cache.put(e.request,response.clone());return response;}
   catch{return (await cache.match(e.request))||Response.error();}
  }
  return (await cache.match(e.request))||fetch(e.request);
 })());
});
