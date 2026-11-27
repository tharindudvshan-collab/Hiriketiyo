/* HIRIKETIYO product line: a slow, endlessly running band of traditional Sri Lankan craft.
   It sits in the middle of whichever page (tab) is open and moves with the visitor from page to page.
   Real approved products come from the Supabase `listings` table (kind = 'product', same source as the Shop page).
   Until there are any, it shows traditional craft categories (no prices, no stock claims) that link to the Shop.
   Loads after data.js (uses window.hkSb). Reduced-motion visitors get a calm, swipeable row instead of the run. */
(()=>{
const main=document.querySelector('main');if(!main)return;
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LKR=c=>'LKR '+(c/100).toLocaleString('en-LK',{minimumFractionDigits:2});
const G='viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"';
const IC={
 batik:`<svg ${G}><path d="M24 6l14 18-14 18L10 24z"/><path d="M24 14l7 10-7 10-7-10z"/><circle cx="24" cy="24" r="2.2"/></svg>`,
 loom:`<svg ${G}><path d="M8 10h32M8 38h32M14 10v28M22 10v28M30 10v28M38 10v28"/><path d="M8 18h32M8 26h32M8 34h32" stroke-dasharray="3 3"/></svg>`,
 mask:`<svg ${G}><path d="M12 12c0-4 24-4 24 0v10c0 10-6 16-12 16s-12-6-12-16z"/><path d="M17 20q3-3 6 0M25 20q3-3 6 0M19 30q5 4 10 0"/><path d="M12 12l-4-5M36 12l4-5"/></svg>`,
 lacquer:`<svg ${G}><path d="M8 28h32c0 8-7 13-16 13S8 36 8 28z"/><path d="M12 28c0-8 5-12 12-12s12 4 12 12"/><path d="M24 16v-3"/><circle cx="24" cy="11.4" r="1.6"/></svg>`,
 lamp:`<svg ${G}><path d="M24 5c3 4 3 7 0 10-3-3-3-6 0-10z"/><path d="M14 20h20l-2 8H16z"/><path d="M24 28v8M19 36h10M16 41h16"/></svg>`,
 tea:`<svg ${G}><path d="M10 22h24v6c0 6-5 10-12 10s-12-4-12-10z"/><path d="M34 24h3a4 4 0 0 1 0 8h-3"/><path d="M18 8c-2 3 2 4 0 9M26 8c-2 3 2 4 0 9"/></svg>`,
 cinn:`<svg ${G}><path d="M9 34L31 12a3 3 0 0 1 5 5L14 39z"/><path d="M13 38L35 16"/><path d="M20 40l18-18a2.5 2.5 0 0 0-4-4"/></svg>`
};
const BASE=[['batik','Batik'],['loom','Handloom'],['mask','Wooden masks'],['lacquer','Lacquerware'],['lamp','Brass lamps'],['tea','Ceylon tea'],['cinn','Cinnamon']]
 .map(([i,n])=>({n,icon:IC[i],p:'Coming soon'}));

const sec=document.createElement('section');sec.className='pline';sec.setAttribute('aria-label','Traditional art of Ceylon');
sec.innerHTML='<div class="pl-hd"><h2>Traditional Art of Ceylon</h2><p>Hand-crafted pieces from Sri Lanka\u2019s makers</p></div><div class="pl-run"><div class="pl-t"></div></div><a class="pl-all" href="#shop">View the collection</a>';
const track=sec.querySelector('.pl-t');

const item=(o,clone)=>`<a class="pl-i" href="#shop"${clone?' aria-hidden="true" tabindex="-1"':''}><span class="pl-f">${o.img?`<img src="${esc(o.img)}" alt="" loading="lazy" decoding="async">`:o.icon||IC.batik}</span><span class="pl-n">${esc(o.n)}</span><span class="pl-p">${esc(o.p)}</span></a>`;

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

/* sit in the middle of the open page and follow the visitor between tabs */
function place(){
  const pg=document.querySelector('.page.on');if(!pg)return;
  const kids=[...pg.children].filter(e=>e!==sec&&!/^(SCRIPT|STYLE)$/.test(e.tagName));if(!kids.length)return;
  const at=kids[Math.max(0,Math.ceil(kids.length/2)-1)];
  if(sec.parentElement===pg&&at.nextElementSibling===sec)return;
  at.after(sec);
  if(!calm&&!track.style.getPropertyValue('--pld'))build(current);
}
let current=BASE;
build(current);place();
addEventListener('hashchange',place);

if('IntersectionObserver'in window)new IntersectionObserver(e=>sec.classList.toggle('paused',!e[0].isIntersecting)).observe(sec);

/* real products, when there are any */
try{
  const sb=window.hkSb;
  if(sb)sb.from('listings').select('id,title,price_cents,image_url,kind,partners(name)').eq('kind','product').order('created_at',{ascending:false}).limit(24)
    .then(({data})=>{
      if(!data||!data.length)return;
      current=data.map(l=>({n:l.title,img:l.image_url||'',icon:l.image_url?'':IC.batik,p:LKR(l.price_cents)}));
      build(current);
    },()=>{});
}catch(e){}
})();
