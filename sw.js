// HIRIKETIYO service worker: caches the app shell so the site opens fast and works offline.
// Change VERSION whenever you update any file, so visitors receive the new version.
const VERSION='hiriketiyo-v33';
const CORE=[
 "./",
 "index.html",
 "style.css",
 "app.js",
 "content-map.js",
 "data.js",
 "slideshow.js",
 "logo3d.js",
 "kites.js",
 "flagbar.js",
 "manifest.webmanifest",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/maskable-512.png",
 "assets/brand-emblem-white.png",
 "assets/brand-emblem-black.png",
 "assets/brand-wordmark-white.png",
 "assets/brand-wordmark-black.png",
 "assets/brand-slogan-white.png",
 "assets/hero-1200.webp",
 "assets/hero-1920.webp",
 "assets/hero-1920.jpg",
 "assets/bay-600.webp",
 "assets/svc-surf.webp",
 "assets/svc-stay.webp",
 "assets/svc-food.webp",
 "assets/svc-ride.webp",
 "assets/svc-exp.webp",
 "assets/svc-shop.webp",

 "assets/bay-1000.webp",
 "assets/bay-1000.jpg"
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==VERSION).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin===location.origin&&u.pathname.endsWith('admin.html'))return;
  if(u.origin===location.origin){
    if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(VERSION).then(c=>c.put('index.html',cp));return res}).catch(()=>caches.match('index.html')));return}
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp));return res})));return}
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.open(VERSION).then(c=>c.match(r).then(hit=>{const net=fetch(r).then(res=>{c.put(r,res.clone());return res}).catch(()=>hit);return hit||net})))}
});
