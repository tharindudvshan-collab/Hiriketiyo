/* HIRIKETIYO slideshows (loads after data.js).
   Every photo slot can hold up to 4 photos (slot, slot-2, slot-3, slot-4), uploaded in admin.html > Photos.
   Covered: hero, "About" photo, the 6 service cards, the Discover banner, the 7 Discover chapters and the 8 place cards.
   Empty slots are skipped, so 1 to 4 photos all work. A slideshow only runs while it is on screen.
   Reduced-motion visitors still get the next photo, but as a plain swap (no fade) and more slowly. */
(()=>{
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const SEC=calm?9000:6000;

const st=document.createElement('style');
st.textContent=
 '.ss-x{position:absolute;inset:0;opacity:0}'+
 '.ss-w{position:absolute;inset:0;display:block;pointer-events:none}'+
 '.ss-wrap{display:block;position:relative}.ss-wrap img{display:block}'+
 (calm?'':
 '.hero-bg img,.dhero>img,.photo{transition:opacity 1.4s ease}'+
 '.svc .im img,.dim img,.dpl .im img{transition:transform .9s cubic-bezier(.22,1,.36,1),opacity 1.4s ease}');
document.head.append(st);

/* Extra photos are normal <img> elements. Inside a <picture> they get a wrapper span, because a <picture>
   applies its <source> list to every <img> after it, which would show the first photo again instead of theirs. */
function extras(first,base){
  const out=[],inPic=first.parentElement.tagName==='PICTURE',cls=first.classList.contains('photo')?'photo ss-x':'ss-x';
  let at=first;
  for(let n=2;n<=4;n++){
    const i=document.createElement('img');
    i.className=cls;i.alt='';i.decoding='async';i.loading='lazy';i.dataset.slot=base+'-'+n;
    if(inPic){const w=document.createElement('span');w.className='ss-w';w.append(i);at.after(w);at=w}
    else{at.after(i);at=i}
    out.push(i)}
  return out}

const ok=e=>!!e.getAttribute('src')&&e.complete&&e.naturalWidth>0;

function tick(s){
  if(document.hidden||!s.vis)return;
  const els=s.els;
  for(let k=1;k<els.length;k++){
    const j=(s.cur+k)%els.length;
    if(ok(els[j])){els[s.cur].style.opacity=0;els[j].style.opacity=1;s.cur=j;return}}}

function start(first,base,delay){
  const els=[first,...extras(first,base)],s={els,cur:0,vis:true};
  const box=first.closest('.hero-bg,.dhero,.svc .im,.dim,.dpl .im,.ss-wrap')||first.parentElement;
  if('IntersectionObserver' in window)new IntersectionObserver(e=>{s.vis=e[0].isIntersecting}).observe(box);
  setTimeout(()=>{tick(s);setInterval(()=>tick(s),SEC)},delay);
}

let k=0;
const hero=document.querySelector('.hero-bg img[data-slot="hero"]');
if(hero)start(hero,'hero',SEC);

const bay=document.querySelector('img.photo[data-slot="bay"]');
if(bay){const p=bay.closest('picture');if(p)p.classList.add('ss-wrap');start(bay,'bay',SEC-700)}

document.querySelectorAll('img[data-slot^="svc-"],img[data-slot^="disc-"]').forEach(img=>{
  if(img.classList.contains('ss-x')||/-\d$/.test(img.dataset.slot))return;
  start(img,img.dataset.slot,4500+((k++)%8)*500);
});

/* show cached uploads on the extra slides immediately (data.js refreshes them when new data arrives) */
try{JSON.parse(localStorage.getItem('hk_img')||'[]').forEach(r=>{if(!r.url)return;
  document.querySelectorAll('img.ss-x[data-slot="'+r.slot+'"]').forEach(el=>{
    el.src=r.url+'?v='+encodeURIComponent(r.updated_at);
    if(r.focal_x!==50||r.focal_y!==50)el.style.objectPosition=r.focal_x+'% '+r.focal_y+'%'})})}catch(e){}
})();
