/* HIRIKETIYO product line: a slow, endlessly running band of the products added in the Shopping area.
   It sits in the middle of whichever page (tab) is open and moves with the visitor from page to page.
   It shows ONLY real products (added in Admin Studio > Products, plus partner products in Supabase `listings`; loaded once by shop.js as window.hkProducts).
   While there are none, the strip stays hidden. It is not shown on the Shopping page itself (the full grid is there).
   Clicking a product opens its detail dialog (window.hkShop). Reduced-motion visitors get a calm, swipeable row. */
(()=>{
const main=document.querySelector('main');if(!main)return;
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LKR=c=>'LKR '+(c/100).toLocaleString('en-LK',{minimumFractionDigits:2});
const ICON='<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M24 6l14 18-14 18L10 24z"/><path d="M24 14l7 10-7 10-7-10z"/><circle cx="24" cy="24" r="2.2"/></svg>';

const sec=document.createElement('section');sec.className='pline';sec.setAttribute('aria-label','Products from the HIRIKETIYO shop');
sec.innerHTML='<div class="pl-hd"><h2>Traditional Art of Ceylon</h2><p>Hand-crafted pieces from Sri Lanka\u2019s makers</p></div><div class="pl-run"><div class="pl-t"></div></div><a class="pl-all" href="#shop">View the collection</a>';
const track=sec.querySelector('.pl-t');
let current=[];

const item=(o,clone)=>`<a class="pl-i" href="#shop" data-pid="${esc(o.id)}"${clone?' aria-hidden="true" tabindex="-1"':''}><span class="pl-f">${o.img?`<img src="${esc(o.img)}" alt="" loading="lazy" decoding="async">`:ICON}</span><span class="pl-n">${esc(o.n)}</span><span class="pl-p">${esc(o.p)}</span></a>`;

let gen=0;
function build(list){
  const g=++gen,one=list.map(o=>item(o,false)).join(''),cl=list.map(o=>item(o,true)).join('');
  track.style.removeProperty('--pld');track.innerHTML=one;
  if(calm)return;
  requestAnimationFrame(()=>{
    if(g!==gen)return;                 /* a newer build replaced this one */
    const setW=track.scrollWidth;if(!setW)return;
    const reps=Math.max(1,Math.ceil(Math.max(innerWidth,screen.width,1200)/setW));
    track.innerHTML=one+cl.repeat(reps-1)+cl.repeat(reps);       /* two identical halves, so the loop is seamless */
    track.style.setProperty('--pld',(setW*reps/38).toFixed(1)+'s'); /* ~38px per second */
  });
}

/* sit in the middle of the open page (not on the Shopping page) and follow the visitor between tabs */
function place(){
  const pg=document.querySelector('.page.on');
  if(!pg||!current.length||pg.id==='shop'){sec.remove();return}
  const kids=[...pg.children].filter(e=>e!==sec&&!/^(SCRIPT|STYLE)$/.test(e.tagName));if(!kids.length)return;
  const at=kids[Math.max(0,Math.ceil(kids.length/2)-1)];
  if(sec.parentElement===pg&&at.nextElementSibling===sec)return;
  at.after(sec);
  if(!calm&&!track.style.getPropertyValue('--pld'))build(current);
}
addEventListener('hashchange',place);

if('IntersectionObserver'in window)new IntersectionObserver(e=>sec.classList.toggle('paused',!e[0].isIntersecting)).observe(sec);

/* a product opens its detail dialog right where the visitor is */
track.addEventListener('click',e=>{const a=e.target.closest('[data-pid]');
  if(a&&window.hkShop){e.preventDefault();window.hkShop.open(a.dataset.pid)}});

(window.hkProducts||Promise.resolve([])).then(list=>{
  if(!list.length)return;
  current=list.map(l=>({id:l.id,n:l.title,img:l.image_url||'',p:l.price_cents>0?LKR(l.price_cents):'Ask for price'}));
  build(current);place();
});
})();
