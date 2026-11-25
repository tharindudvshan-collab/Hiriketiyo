/* HIRIKETIYO slideshows (loads after data.js).
   Hero: slot "hero" + hero-2..4.  Service cards: svc-surf / svc-stay / svc-food / svc-ride / svc-exp / svc-shop, each + "-2".."-4".
   Upload the photos in admin.html. Empty slots are skipped, so 1 to 4 photos all work. */
(()=>{
const SEC=6000,calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const st=document.createElement('style');
st.textContent='.ss-x{position:absolute;inset:0;opacity:0}.hero-bg img{transition:opacity 1.4s ease}'+
 '.svc .im img{transition:transform .9s cubic-bezier(.22,1,.36,1),opacity 1.4s ease}'+
 '.ss-wrap{display:block;position:relative}.ss-wrap img{display:block}.photo{transition:opacity 1.4s ease}';
document.head.append(st);

function cycle(els,delay){
  if(calm)return;let cur=0;
  const ok=e=>e===els[0]||(e.getAttribute('src')&&e.naturalWidth>0);
  setTimeout(()=>setInterval(()=>{if(document.hidden)return;
    for(let k=1;k<els.length;k++){const j=(cur+k)%els.length;
      if(ok(els[j])){els[cur].style.opacity=0;els[j].style.opacity=1;cur=j;return}}},SEC),delay);
}
function extras(first,base){const out=[];let at=first;
  for(let n=2;n<=4;n++){const i=document.createElement('img');i.className='ss-x';i.alt='';i.decoding='async';i.loading='lazy';i.dataset.slot=base+'-'+n;at.after(i);at=i;out.push(i)}
  return out}

const h=document.querySelector('.hero-bg img[data-slot="hero"]');
if(h)cycle([h,...extras(h,'hero')],SEC);

let k=0;
document.querySelectorAll('.svc .im img[data-slot^="svc-"]').forEach(img=>{
  if(/-\d$/.test(img.dataset.slot))return;
  cycle([img,...extras(img,img.dataset.slot)],SEC+(k++)*900);
});

const bay=document.querySelector('img.photo[data-slot="bay"]');
if(bay){const p=bay.closest('picture');if(p)p.classList.add('ss-wrap');
  const ex=extras(bay,'bay');ex.forEach(e=>e.className='photo ss-x');cycle([bay,...ex],SEC+7*900)}

/* show cached uploads on the new slides immediately (data.js refreshes them when new data arrives) */
try{JSON.parse(localStorage.getItem('hk_img')||'[]').forEach(r=>{if(!r.url)return;
  document.querySelectorAll('img.ss-x[data-slot="'+r.slot+'"]').forEach(el=>{
    el.src=r.url+'?v='+encodeURIComponent(r.updated_at);
    if(r.focal_x!==50||r.focal_y!==50)el.style.objectPosition=r.focal_x+'% '+r.focal_y+'%'})})}catch(e){}
})();
