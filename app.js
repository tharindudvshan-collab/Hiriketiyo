const bd=document.getElementById('birds');[[120,26,0,1],[180,24,-6,.8],[90,30,-12,.9],[240,27,-17,.7],[150,33,-22,.6]].forEach(([y,d,dl,s])=>{const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class','bird');g.style.cssText=`--y:${y}px;animation-duration:${d}s;animation-delay:${dl}s`;g.innerHTML=`<path transform="scale(${s})" d="M0 0q9-11 18 0q9-11 18 0"/>`;bd.appendChild(g)});
addEventListener('scroll',()=>document.querySelector('header').classList.toggle('sm',scrollY>60),{passive:true});
const P=['home','discover','surf','stay','transport','shop'];
// Menu names that open a page and then jump to a section: name -> [page, section id, menu item to highlight]
const AL={partner:['surf','partner','surf'],destinations:['discover','d-places','destinations'],plan:['surf','tp','plan']};
function tog(){const n=document.getElementById('mob');const o=n.classList.toggle('open');document.querySelector('.menu').setAttribute('aria-expanded',o)}
function route(){let k=location.hash.slice(1)||'home';const al=AL[k];let h=al?al[0]:k;if(!P.includes(h)){h='home';k='home'}const cur=al?al[2]:h;
document.querySelectorAll('.page').forEach(p=>p.classList.toggle('on',p.id===h));
document.querySelectorAll('.nl a,.mobnav a').forEach(a=>a.getAttribute('href')==='#'+cur&&!a.classList.contains('cta')?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
document.getElementById('mob').classList.remove('open');document.querySelector('.menu').setAttribute('aria-expanded','false');const t=al&&document.getElementById(al[1]);t?t.scrollIntoView():window.scrollTo(0,0)}
addEventListener('hashchange',route);route();
const S={surf:['Surf lesson','Browse surf partners','#surf'],stay:['A stay by the bay','Browse stays','#stay'],food:['Local food','Browse food &amp; drink','#stay'],ride:['Coastal tuk-tuk trip','Request a quote','#transport']};
document.getElementById('chips').addEventListener('change',()=>{const v=[...document.querySelectorAll('#chips input:checked')].map(i=>i.value);document.getElementById('plan').innerHTML=v.map(k=>`<div class="card"><h3>${S[k][0]}</h3><a href="${S[k][2]}">${S[k][1]}</a></div>`).join('')});
document.querySelectorAll('form').forEach(f=>f.addEventListener('submit',e=>{if(f.dataset.live)return;e.preventDefault();const m=f.querySelector('.msg');m.textContent=f.dataset.kind+' checked, but not sent. Bookings need the database and email service to be connected first.';m.classList.add('show')}));

// Offline support (service worker works on https or localhost)
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')){addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}

// nav: 3D tilt on the CTA pill + Esc closes the menu
document.querySelectorAll('.cta').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.setProperty('--ry',(x*18)+'deg');el.style.setProperty('--rx',(-y*16)+'deg');el.style.setProperty('--mx',((x+.5)*100)+'%')});el.addEventListener('pointerleave',()=>{el.style.removeProperty('--rx');el.style.removeProperty('--ry')})});
addEventListener('keydown',e=>{if(e.key==='Escape'){document.getElementById('mob').classList.remove('open');document.querySelector('.menu').setAttribute('aria-expanded','false')}});

// service catalog filter
document.querySelectorAll('.cat-filter button').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.k;document.querySelectorAll('.cat-filter button').forEach(x=>x.setAttribute('aria-pressed',x===b));document.querySelectorAll('.svc').forEach(c=>{const on=k==='all'||c.dataset.c===k;c.hidden=!on;if(on){c.style.animation='none';c.offsetWidth;c.style.animation=''}})}));

// nav click animation: ripple on the pressed link + the new page slides in
document.querySelectorAll('.nl a,.mobnav a,.logo').forEach(a=>a.addEventListener('pointerdown',e=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||a.classList.contains('cta')||a.classList.contains('logo'))return;
  const r=a.getBoundingClientRect(),d=Math.max(r.width,r.height)*2,s=document.createElement('span');
  s.className='fx-rip';s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;
  a.append(s);s.addEventListener('animationend',()=>s.remove())}));
addEventListener('hashchange',()=>{const p=document.querySelector('.page.on');if(!p)return;p.classList.remove('fx-in');void p.offsetWidth;p.classList.add('fx-in')});

// Discover guide: chapter bar (smooth scroll + highlight) and reveal-on-scroll.
// In-page jumps use data-go (not #hash), because the hash is reserved for page routing.
(()=>{const d=document.getElementById('discover'),hd=document.querySelector('header');if(!d||!hd)return;
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hh=()=>document.documentElement.style.setProperty('--hh',hd.offsetHeight+'px');hh();
if('ResizeObserver'in window)new ResizeObserver(hh).observe(hd);else addEventListener('resize',hh,{passive:true});
d.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(!b)return;const t=document.getElementById(b.dataset.go);if(!t)return;e.preventDefault();t.scrollIntoView({behavior:calm?'auto':'smooth',block:'start'})});
if(!('IntersectionObserver'in window))return;
const nav=[...d.querySelectorAll('.dnav [data-go]')],bar=d.querySelector('.dnav-in');
const spy=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;
  nav.forEach(b=>b.removeAttribute('aria-current'));const b=nav.find(x=>x.dataset.go===en.target.id);
  if(b){b.setAttribute('aria-current','true');bar.scrollTo({left:b.offsetLeft-(bar.clientWidth-b.offsetWidth)/2,behavior:calm?'auto':'smooth'})}}),{rootMargin:'-30% 0px -60% 0px'});
nav.forEach(b=>{const s=document.getElementById(b.dataset.go);s&&spy.observe(s)});
d.classList.add('rvon');
const rv=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('rvin');rv.unobserve(en.target)}}),{rootMargin:'0px 0px -8% 0px',threshold:.08});
d.querySelectorAll('.rv').forEach(el=>rv.observe(el));
})();

// Discover: "how far from the bay" chart, built from the distance written on each place card
// (so editing a distance in Admin Studio updates the chart too).
(()=>{const g=document.querySelector('#d-places .dpl-grid'),L=document.getElementById('dlad');if(!g||!L)return;
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
let timer;
function build(){
  const rows=[...g.querySelectorAll('.dpl')].map(c=>({id:c.id,n:(c.querySelector('h4')||{}).textContent,
    km:parseFloat(((c.querySelector('.dd b')||{}).textContent||'').replace(',','.'))}))
    .filter(r=>r.id&&r.n&&isFinite(r.km)).sort((a,b)=>a.km-b.km);
  L.replaceChildren();if(!rows.length)return;
  const max=Math.max(...rows.map(r=>r.km)),ol=el('ol');
  L.append(el('h4','dlh','How far from the bay'),el('p','dls','Road distance from Hiriketiya Beach. Tap a place to jump to it.'),ol);
  rows.forEach((r,i)=>{const li=el('li'),b=el('button'),tr=el('span','tr'),f=el('i');
    b.type='button';b.dataset.go=r.id;b.style.setProperty('--i',i);
    f.style.setProperty('--w',Math.max(4,r.km/max*100).toFixed(1)+'%');tr.append(f);
    b.append(el('span','nm',r.n.trim()),tr,el('span','kk',r.km+' km'));li.append(b);ol.append(li)})}
build();
new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(build,60)}).observe(g,{subtree:true,childList:true,characterData:true});
})();
