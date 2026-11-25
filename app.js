const bd=document.getElementById('birds');[[120,26,0,1],[180,24,-6,.8],[90,30,-12,.9],[240,27,-17,.7],[150,33,-22,.6]].forEach(([y,d,dl,s])=>{const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class','bird');g.style.cssText=`--y:${y}px;animation-duration:${d}s;animation-delay:${dl}s`;g.innerHTML=`<path transform="scale(${s})" d="M0 0q9-11 18 0q9-11 18 0"/>`;bd.appendChild(g)});
addEventListener('scroll',()=>document.querySelector('header').classList.toggle('sm',scrollY>60),{passive:true});
const P=['home','discover','surf','stay','transport','shop'];
function tog(){const n=document.getElementById('mob');const o=n.classList.toggle('open');document.querySelector('.menu').setAttribute('aria-expanded',o)}
function route(){let h=location.hash.slice(1)||'home';const pt=h==='partner';if(pt)h='surf';if(!P.includes(h))h='home';
document.querySelectorAll('.page').forEach(p=>p.classList.toggle('on',p.id===h));
document.querySelectorAll('.nl a').forEach(a=>a.getAttribute('href')==='#'+h&&a.textContent!=='Plan your trip'?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
document.getElementById('mob').classList.remove('open');pt?document.getElementById('partner').scrollIntoView():window.scrollTo(0,0)}
addEventListener('hashchange',route);route();
const S={surf:['Surf lesson','Browse surf partners','#surf'],stay:['A stay by the bay','Browse stays','#stay'],food:['Local food','Browse food &amp; drink','#stay'],ride:['Coastal tuk-tuk trip','Request a quote','#transport']};
document.getElementById('chips').addEventListener('change',()=>{const v=[...document.querySelectorAll('#chips input:checked')].map(i=>i.value);document.getElementById('plan').innerHTML=v.map(k=>`<div class="card"><h3>${S[k][0]}</h3><a href="${S[k][2]}">${S[k][1]}</a></div>`).join('')});
document.querySelectorAll('form').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const m=f.querySelector('.msg');m.textContent=f.dataset.kind+' checked, but not sent. Bookings need the database and email service to be connected first.';m.classList.add('show')}));

// Offline support (service worker works on https or localhost)
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')){addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}
