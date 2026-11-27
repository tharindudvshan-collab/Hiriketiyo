/* DO HIRIKETIYO experience marketplace (page #do). Loads after data.js.
   - Categories are fixed below (the taxonomy). Listings come from the Supabase `listings` table via data.js (window.hkSb).
   - Only experiences that have an approved provider's listing are shown. Nothing is invented: every card/detail field is
     optional and simply left out when the listing does not have it. Ratings only appear when `reviews_verified` is true.
   - Booking is a REQUEST flow: it is never confirmed automatically. Payment is not wired yet (see PAYMENT below).
   Optional listing columns read here: do_category, do_service, summary, long_description, location, map_url, currency,
   price_unit, duration_text, duration_minutes, group_min, group_max, group_text, available_dates, time_slots, included,
   excluded, cancellation_policy, gallery, rating, review_count, reviews_verified, reviews.
   Optional partner columns: description, avatar_url, location, public_phone. (See supabase-do-marketplace.sql.) */
(()=>{
const root=document.getElementById('do');if(!root)return;
const $=(s,r=root)=>r.querySelector(s),$$=(s,r=root)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const sb=window.hkSb;
const WA='94717505506';          /* HIRIKETIYO WhatsApp (same number as the trip planner) */
/* PAYMENT: not connected. When a gateway is added, branch in submitBooking() on this flag and send the customer to checkout
   after the provider confirms. Commission tracking belongs server-side (private table), never in this public file. */
const PAYMENT={enabled:false};

/* ---------- taxonomy (one list, used by tiles, filters and cards) ---------- */
const CATS=[
 {id:'surf',t:'Surf & Ocean',svc:['Beginner Surf Lessons','Intermediate & Advanced Surf Coaching','Private Surf Lessons','Surfboard Rentals','Snorkelling','Other Ocean Activities']},
 {id:'wellness',t:'Wellness & Fitness',svc:['Yoga Classes','Private Yoga Sessions','Fitness & Gym Access','Personal Training','Meditation','Breathwork Sessions']},
 {id:'food',t:'Food & Culinary',svc:['Sri Lankan Cooking Classes','Traditional Food Experiences','Seafood Experiences','Local Food Tours','Private Dining Experiences']},
 {id:'tours',t:'Tours & Adventures',svc:['Guided Coastal Tours','Village Experiences','Cultural Experiences','Nature & Wildlife Tours','Nearby Destination Tours']},
 {id:'spa',t:'Spa & Relaxation',svc:['Ayurvedic Treatments','Traditional Massage','Spa Experiences','Wellness Packages']},
 {id:'rentals',t:'Rentals & Equipment',svc:['Motorbike Rentals','Scooter Rentals','Bicycle Rentals','Car Rentals','Surfboard & Equipment Rentals']},
 {id:'creative',t:'Creative & Lifestyle',svc:['Photography Sessions','Sunset Experiences','Art & Craft Workshops','Local Creative Experiences']},
 {id:'events',t:'Events & Special Experiences',svc:['Beach Events','Live Music Experiences','Private Celebrations','Group Activities','Special Packages']}
];
/* A listing with no do_category is placed by its partner type; stay / transport / shop partners belong to other sections */
const TYPE={surf:'surf',experience:'tours'};
const key=s=>String(s||'').toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,' ').trim();

/* ---------- helpers ---------- */
const P={pin:'M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',clock:'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2',users:'M16 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M9.5 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM21 20v-1a4 4 0 00-3-3.9M16 4.1a3.5 3.5 0 010 6.8',cal:'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',img:'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9.5h.01'};
const ic=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[p]||p}"/></svg>`;
const list=(v,re)=>Array.isArray(v)?v.map(String).map(x=>x.trim()).filter(Boolean):String(v||'').split(re||/\r?\n|;/).map(x=>x.trim()).filter(Boolean);
const okUrl=u=>typeof u==='string'&&/^https?:\/\//i.test(u);
const money=l=>{const c=+l.price_cents;if(!(c>0))return '';const a=c/100;return (l.currency||'LKR')+' '+a.toLocaleString('en-LK',{maximumFractionDigits:a%1?2:0})};
const dur=l=>{if(l.duration_text)return String(l.duration_text);const m=+l.duration_minutes;if(!(m>0))return '';return m<60?m+' min':Math.floor(m/60)+' h'+(m%60?' '+(m%60)+' min':'')};
const grp=l=>l.group_text?String(l.group_text):(+l.group_max>0?(+l.group_min>1?l.group_min+'–'+l.group_max+' guests':'Up to '+l.group_max+' guests'):'');
const wa=t=>'https://wa.me/'+WA+'?text='+encodeURIComponent(t);
const catOf=l=>{const c=String(l.do_category||'').toLowerCase();if(CATS.some(x=>x.id===c))return c;return (l.partners&&TYPE[l.partners.type])||null};

function norm(l){
  const p=l.partners||{},c=catOf(l),cat=CATS.find(x=>x.id===c);
  let g=l.gallery;if(typeof g==='string'){try{g=JSON.parse(g)}catch(e){g=[]}}
  g=(Array.isArray(g)?g:[]).filter(okUrl);if(okUrl(l.image_url)&&!g.includes(l.image_url))g.unshift(l.image_url);
  const verified=l.reviews_verified===true&&+l.rating>0&&+l.review_count>0;
  const revs=verified&&Array.isArray(l.reviews)?l.reviews.filter(r=>r&&r.text).slice(0,6):[];
  return {id:l.id,c,cat:cat?cat.t:'',s:(cat?cat.svc.find(s=>key(s)===key(l.do_service)):'')||'',
    title:l.title||'',desc:l.description||'',summary:l.summary||'',long:l.long_description||'',
    price:money(l),unit:l.price_unit||'',dur:dur(l),grp:grp(l),gmax:+l.group_max>0?+l.group_max:20,
    dates:l.available_dates?String(l.available_dates):'',slots:list(l.time_slots,/\r?\n|;|,/),
    inc:list(l.included),exc:list(l.excluded),cancel:l.cancellation_policy||'',gal:g,
    loc:l.location||p.location||'',map:okUrl(l.map_url)?l.map_url:'',
    prov:p.name||'',pdesc:p.description||'',pimg:okUrl(p.avatar_url)?p.avatar_url:'',phone:p.public_phone||'',
    rating:verified?+l.rating:0,rcount:verified?+l.review_count:0,revs};
}

/* ---------- state + rendering ---------- */
const S={cat:'all',svc:'all',items:[],loaded:!sb};
const byId=id=>S.items.find(i=>String(i.id)===String(id));
const grid=$('#do-grid'),empty=$('#do-empty'),svcBar=$('#do-svc'),cnt=$('#do-count'),allBtn=$('.do-all'),listTop=$('#do-list');

function card(i){
  const meta=[i.dur&&['clock',i.dur],i.grp&&['users',i.grp],i.dates&&['cal',i.dates]].filter(Boolean)
    .map(([p,t])=>`<li>${ic(p)}<span>${esc(t)}</span></li>`).join('');
  return `<article class="dx rv"><button type="button" class="dx-im" data-open="${esc(i.id)}" aria-label="View details: ${esc(i.title)}">`+
   (i.gal[0]?`<img src="${esc(i.gal[0])}" alt="${esc(i.title)}" loading="lazy" decoding="async">`:`<span class="dxph">${ic('img')}</span>`)+
   `<span class="dx-cat">${esc(i.s||i.cat)}</span></button><div class="dx-bd">`+
   `<p class="dx-prov">${esc(i.prov)}${i.prov&&i.loc?' · ':''}${esc(i.loc)}</p><h3>${esc(i.title)}</h3>`+
   (i.rating?`<p class="dx-rate"><b>${i.rating.toFixed(1)}</b> <span>(${i.rcount} verified review${i.rcount>1?'s':''})</span></p>`:'')+
   (i.desc?`<p class="dx-desc">${esc(i.desc)}</p>`:'')+(meta?`<ul class="dx-meta">${meta}</ul>`:'')+
   `<div class="dx-foot"><p class="dx-price">${i.price?`<small>From</small> <b>${esc(i.price)}</b>${i.unit?` <small>${esc(i.unit)}</small>`:''}`:'<small>Price on request</small>'}</p>`+
   `<div class="dx-act"><button type="button" class="btn" data-open="${esc(i.id)}">View Details</button><button type="button" class="btn fill" data-book="${esc(i.id)}">Book Now</button></div></div></div></article>`;
}

function render(){
  const c=CATS.find(x=>x.id===S.cat);
  CATS.forEach(k=>{const n=S.items.filter(i=>i.c===k.id).length,el=$(`.dcnt[data-c="${k.id}"]`);
    if(el)el.textContent=!S.loaded?'':n?n+' experience'+(n>1?'s':''):'Opening soon'});
  $$('.dcat').forEach(t=>t.setAttribute('aria-pressed',String(t.dataset.cat===S.cat)));
  allBtn.setAttribute('aria-pressed',String(S.cat==='all'));
  cnt.textContent=c?c.t:'All experiences';
  const pool=S.items.filter(i=>S.cat==='all'||i.c===S.cat);
  const svcs=c?c.svc.filter(s=>pool.some(i=>i.s===s)):[];
  svcBar.hidden=svcs.length<1;
  svcBar.innerHTML=svcs.length?['All'].concat(svcs).map(s=>`<button type="button" class="dsv" data-svc="${s==='All'?'all':esc(s)}" aria-pressed="${(s==='All'?'all':s)===S.svc}">${esc(s)}</button>`).join(''):'';
  const shown=pool.filter(i=>S.svc==='all'||i.s===S.svc);
  grid.innerHTML=shown.map(card).join('');
  $$('.dx',grid).forEach(el=>el.classList.add('rvin'));
  empty.hidden=shown.length>0;
  $('p',empty).textContent=!S.loaded?'Loading experiences…':S.items.length&&S.cat!=='all'
    ?'No approved providers in this category yet. Check back soon, or become a partner.'
    :'Experiences from approved local partners will appear here as they join.';
}
function pick(cat,svc){S.cat=cat;S.svc=svc||'all';render()}
function toList(){listTop.scrollIntoView({behavior:calm?'auto':'smooth',block:'start'})}

/* ---------- dialogs ---------- */
const dlg=(id,cls)=>{const d=document.createElement('dialog');d.id=id;d.className='dod '+(cls||'');
  d.addEventListener('click',e=>{if(e.target===d||e.target.closest('[data-x]'))d.close()});document.body.append(d);return d};
const det=dlg('dodet'),bk=dlg('dobk','dobk');

function openDetail(id){
  const i=byId(id);if(!i)return;
  const facts=[i.dur&&['clock','Duration',i.dur],i.grp&&['users','Group size',i.grp],i.loc&&['pin','Location',i.loc]].filter(Boolean)
    .map(([p,k,v])=>`<li>${ic(p)}<span><small>${k}</small>${esc(v)}</span></li>`).join('');
  const lst=(h,a)=>a.length?`<div><h4>${h}</h4><ul class="dd-l">${a.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:'';
  const q=encodeURIComponent((i.loc||i.title)+' Sri Lanka');
  const mapUrl=i.map||`https://www.google.com/maps/search/?api=1&query=${q}`;
  det.innerHTML=`<div class="dod-in"><button type="button" class="dod-x" data-x aria-label="Close">✕</button>`+
   `<div class="dd-g">${i.gal.length?`<img class="dd-main" src="${esc(i.gal[0])}" alt="${esc(i.title)}">`+(i.gal.length>1?`<div class="dd-th">${i.gal.map((u,k)=>`<button type="button" data-th="${esc(u)}" aria-label="Photo ${k+1}"${k?'':' aria-current="true"'}><img src="${esc(u)}" alt="" loading="lazy"></button>`).join('')}</div>`:''):`<div class="dxph big">${ic('img')}</div>`}</div>`+
   `<div class="dd-b"><span class="cap" style="color:var(--teal)">${esc(i.cat)}${i.s?' · '+esc(i.s):''}</span><h2>${esc(i.title)}</h2>`+
   (i.rating?`<p class="dx-rate"><b>${i.rating.toFixed(1)}</b> <span>(${i.rcount} verified review${i.rcount>1?'s':''})</span></p>`:'')+
   (facts?`<ul class="dd-facts">${facts}</ul>`:'')+
   ((i.summary||i.desc)?`<h4>Overview</h4><p>${esc(i.summary||i.desc)}</p>`:'')+
   (i.long?`<h4>About this experience</h4><p>${esc(i.long).replace(/\n/g,'<br>')}</p>`:'')+
   ((i.prov||i.pdesc)?`<h4>Your local provider</h4><div class="dd-prov">${i.pimg?`<img src="${esc(i.pimg)}" alt="" loading="lazy">`:''}<div><b>${esc(i.prov)}</b>${i.pdesc?`<p>${esc(i.pdesc)}</p>`:''}${i.phone?`<p><a href="tel:${esc(i.phone.replace(/[^+0-9]/g,''))}">${esc(i.phone)}</a></p>`:''}</div></div>`:'')+
   `<div class="dd-2">${lst('What’s included',i.inc)}${lst('What’s not included',i.exc)}</div>`+
   `<h4>Pricing</h4><p>${i.price?`<b>From ${esc(i.price)}</b>${i.unit?' '+esc(i.unit):''}. `:''}Final price and availability are confirmed by the provider after you send a request.</p>`+
   ((i.dates||i.slots.length)?`<h4>Available dates and times</h4>${i.dates?`<p>${esc(i.dates)}</p>`:''}${i.slots.length?`<ul class="dochips">${i.slots.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`:''}`:'')+
   (i.cancel?`<h4>Cancellation policy</h4><p>${esc(i.cancel)}</p>`:'')+
   (i.loc?`<h4>Location</h4><p>${esc(i.loc)} · <a href="${esc(mapUrl)}" target="_blank" rel="noopener">Open in Google Maps</a></p><iframe class="dd-map" title="Map: ${esc(i.loc)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${q}&output=embed"></iframe>`:'')+
   (i.revs.length?`<h4>Customer reviews</h4>${i.revs.map(r=>`<blockquote class="dd-rev">${esc(r.text)}<cite>${esc(r.name||'Guest')}${+r.rating>0?' · '+(+r.rating).toFixed(1)+'/5':''}</cite></blockquote>`).join('')}`:'')+
   `<div class="dd-bar"><button type="button" class="btn fill" data-book="${esc(i.id)}">Book Now</button><a class="btn" target="_blank" rel="noopener" href="${esc(wa(`Hello DO HIRIKETIYO, I have a question about “${i.title}”${i.prov?' by '+i.prov:''}.`))}">WhatsApp enquiry</a></div></div></div>`;
  det.showModal();det.scrollTop=0;
}
det.addEventListener('click',e=>{
  const t=e.target.closest('[data-th]');if(t){const m=$('.dd-main',det);m.src=t.dataset.th;$$('.dd-th button',det).forEach(b=>b.removeAttribute('aria-current'));t.setAttribute('aria-current','true');return}
  const b=e.target.closest('[data-book]');if(b){det.close();openBook(b.dataset.book)}});

/* ---------- booking request flow: Experience > Date > Guests > Details > Submit ---------- */
function openBook(id){
  if(!S.items.length)return;
  const today=new Date().toISOString().slice(0,10);
  bk.innerHTML=`<div class="dod-in"><button type="button" class="dod-x" data-x aria-label="Close">✕</button><h2 class="bk-h">Request to book</h2>`+
   `<ol class="bk-steps">${['Experience','Date','Guests','Details'].map((t,n)=>`<li${n?'':' aria-current="step"'}><b>${n+1}</b><span>${t}</span></li>`).join('')}</ol>`+
   `<form id="bkf" novalidate>`+
   `<section data-s="1"><label>Experience<select name="exp" required>${S.items.map(i=>`<option value="${esc(i.id)}"${String(i.id)===String(id)?' selected':''}>${esc(i.title)}${i.prov?' – '+esc(i.prov):''}</option>`).join('')}</select></label><div class="bk-sum"></div></section>`+
   `<section data-s="2" hidden><label>Preferred date<input type="date" name="date" required min="${today}"></label><label>Preferred time<span class="bk-time"></span></label><p class="mut bk-av"></p></section>`+
   `<section data-s="3" hidden><label>Number of guests<span class="bk-q"><button type="button" data-q="-1" aria-label="Fewer guests">−</button><input type="number" name="guests" value="2" min="1" max="20" required><button type="button" data-q="1" aria-label="More guests">+</button></span></label><label>Special requests (optional)<textarea name="notes" rows="3" maxlength="500"></textarea></label></section>`+
   `<section data-s="4" hidden><label>Full name<input name="name" required minlength="2" maxlength="80" autocomplete="name"></label><label>Email address<input name="email" type="email" required maxlength="120" autocomplete="email"></label><label>WhatsApp number<input name="whatsapp" type="tel" required maxlength="24" placeholder="+94 …" autocomplete="tel"></label><dl class="bk-rev"></dl><p class="note">This is a booking request, not a confirmed booking. The provider checks availability and replies by email or WhatsApp.</p></section>`+
   `<div class="msg note bk-msg" role="status"></div>`+
   `<div class="bk-nav"><button type="button" class="btn" data-back hidden>Back</button><button type="button" class="btn fill" data-next>Next</button><button type="submit" class="btn fill" hidden>Submit booking request</button></div></form><div class="bk-done" hidden></div></div>`;
  const f=$('#bkf',bk),secs=$$('section',f),lis=$$('.bk-steps li',bk),back=$('[data-back]',f),next=$('[data-next]',f),sub=$('[type=submit]',f),msg=$('.bk-msg',f);
  let step=1;const cur=()=>byId(f.exp.value);
  const fmtD=v=>{const d=new Date(v+'T00:00');return isNaN(d)?v:d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric'})};
  function sync(){const i=cur();if(!i)return;
    $('.bk-sum',f).innerHTML=`<b>${esc(i.title)}</b><span>${esc([i.prov,i.loc].filter(Boolean).join(' · '))}</span><span>${i.price?'From '+esc(i.price)+(i.unit?' '+esc(i.unit):''):'Price on request'}${i.dur?' · '+esc(i.dur):''}</span>`;
    $('.bk-time',f).innerHTML=i.slots.length?`<select name="time"><option value="">Flexible</option>${i.slots.map(s=>`<option>${esc(s)}</option>`).join('')}</select>`:`<input type="time" name="time">`;
    $('.bk-av',f).textContent=i.dates?'Available: '+i.dates+'. Your provider confirms the exact date.':'Your provider confirms the exact date and time.';
    f.guests.max=i.gmax;if(+f.guests.value>i.gmax)f.guests.value=i.gmax}
  function go(n){step=n;secs.forEach(s=>s.hidden=+s.dataset.s!==n);lis.forEach((l,k)=>k+1===n?l.setAttribute('aria-current','step'):l.removeAttribute('aria-current'));
    back.hidden=n===1;next.hidden=n===4;sub.hidden=n!==4;msg.classList.remove('show');
    if(n===4){const i=cur();$('.bk-rev',f).innerHTML=[['Experience',i.title],['Provider',i.prov],['Date',fmtD(f.date.value)],['Time',f.time.value||'Flexible'],['Guests',f.guests.value]].filter(r=>r[1]).map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}}
  const valid=()=>[...secs[step-1].querySelectorAll('input,select,textarea')].every(x=>{x.setCustomValidity('');
    if(x.name==='whatsapp'){const d=x.value.replace(/\D/g,'');if(d.length<7||d.length>15)x.setCustomValidity('Enter a WhatsApp number with country code')}return x.reportValidity()});
  sync();
  f.exp.addEventListener('change',sync);
  next.onclick=()=>{if(valid())go(step+1)};back.onclick=()=>go(step-1);
  f.addEventListener('click',e=>{const q=e.target.closest('[data-q]');if(q){const n=Math.max(1,Math.min(+f.guests.max||20,(+f.guests.value||1)+ +q.dataset.q));f.guests.value=n}});
  f.addEventListener('submit',async e=>{e.preventDefault();if(!valid())return;
    const i=cur(),p={source:'do-hiriketiyo',listing_id:i.id,experience:i.title,provider:i.prov,date:f.date.value,time:f.time.value||'Flexible',guests:+f.guests.value,
      name:f.elements.name.value.trim(),email:f.email.value.trim(),whatsapp:f.whatsapp.value.trim(),notes:f.notes.value.trim(),status:'pending_provider_confirmation',payment:PAYMENT.enabled?'pending':'not_required'};
    const text=`Hello DO HIRIKETIYO, I’d like to book “${i.title}”${i.prov?' with '+i.prov:''}.\nDate: ${fmtD(p.date)}\nTime: ${p.time}\nGuests: ${p.guests}\nName: ${p.name}`+(p.notes?`\nNotes: ${p.notes}`:'');
    sub.disabled=true;let error=sb?null:{message:'not connected'};
    if(sb)({error}=await sb.rpc('submit_enquiry',{p_kind:'booking_request',p_email:p.email,p_payload:p}));
    sub.disabled=false;
    if(error){msg.textContent='We could not send your request online. You can send the same details on WhatsApp instead.';msg.classList.add('show');
      if(!$('.bk-wa',f))msg.insertAdjacentHTML('afterend',`<p><a class="btn fill bk-wa" target="_blank" rel="noopener" href="${esc(wa(text))}">Send on WhatsApp</a></p>`);return}
    f.hidden=true;$('.bk-steps',bk).hidden=true;$('.bk-h',bk).textContent='Request sent';
    const d=$('.bk-done',bk);d.hidden=false;
    d.innerHTML=`<p class="bk-status"><b>Status:</b> Pending provider confirmation</p><p>Thank you, ${esc(p.name.split(' ')[0])}. Your request for <b>${esc(i.title)}</b> on ${esc(fmtD(p.date))} for ${p.guests} guest${p.guests>1?'s':''} has been received. It is <b>not confirmed yet</b>.</p>`+
     `<ol class="bk-flow"><li class="done">Request received by HIRIKETIYO</li><li>Provider checks availability</li><li>You get a confirmation or an alternative by email (${esc(p.email)}) or WhatsApp</li></ol>`+
     `<div class="dact"><a class="btn fill" target="_blank" rel="noopener" href="${esc(wa(text))}">Also send on WhatsApp</a><button type="button" class="btn" data-x>Close</button></div>`});
  bk.showModal();bk.scrollTop=0;
}

/* ---------- events ---------- */
root.addEventListener('click',e=>{
  const g=e.target.closest('[data-go]');if(g){const t=document.getElementById(g.dataset.go);if(t){e.preventDefault();t.scrollIntoView({behavior:calm?'auto':'smooth',block:'start'})}return}
  const o=e.target.closest('[data-open]');if(o){openDetail(o.dataset.open);return}
  const b=e.target.closest('[data-book]');if(b){openBook(b.dataset.book);return}
  const s=e.target.closest('[data-svc]');if(s){S.svc=s.dataset.svc;render();return}
  const t=e.target.closest('.dcat');if(t){pick(S.cat===t.dataset.cat?'all':t.dataset.cat);toList();return}
  if(e.target.closest('.do-all'))pick('all')});

if('IntersectionObserver'in window){root.classList.add('rvon');
  const rv=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('rvin');rv.unobserve(en.target)}}),{rootMargin:'0px 0px -8% 0px',threshold:.08});
  $$('.rv').forEach(el=>rv.observe(el))}

/* ---------- load approved listings ---------- */
render();
if(sb){
  const run=cols=>sb.from('listings').select(cols).order('created_at',{ascending:false});
  run('*,partners(name,type,description,avatar_url,location,public_phone)').then(r=>r.error?run('*,partners(name,type)'):r).then(({data})=>{
    S.items=(data||[]).filter(l=>l.kind!=='product').map(norm).filter(i=>i.c&&i.title);
    S.loaded=true;render()}).catch(()=>{S.loaded=true;render()});
}
})();
