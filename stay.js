/* HIRIKETIYO Stay & Eat (page #stay). Loads after data.js.
   SOURCES (both real, both approved):
   1) Admin Studio > Stay & Eat: properties and venues you add (Supabase `site_theme`, key "stay"). Shown only when "Show on the website" is on.
      "Verified Partner" is shown only when you tick it.
   2) Approved partners' rows in the Supabase `listings` table (partners.type = 'stay' | 'food'), through the existing row-level-security rules.
   NOTHING IS INVENTED: no ratings, no availability, no placeholder businesses. A field that is empty is hidden.
   BOOKING is a REQUEST flow. It is never confirmed automatically and no payment is taken here (PAYMENT.enabled = false).
   Status lifecycle (see supabase-stay-bookings.sql): requested > availability_confirmed > payment_pending > paid > completed | cancelled | declined | expired.
   FEES: the customer service fee (platform_settings.customer_fee_bps, default 2%) is shown in the price breakdown before payment.
   The 8% partner commission is NEVER shown to customers. It belongs to the partner dashboard / agreement and is calculated server-side
   (window.hkFees.commission below documents the rule; the database enforces it once per paid booking). */
(()=>{
const root=document.getElementById('stay');const app=document.getElementById('se-app');if(!root||!app)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=v=>{v=parseFloat(v);return isFinite(v)?v:0};
const lines=v=>Array.isArray(v)?v.map(x=>String(x).trim()).filter(Boolean):String(v||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
const okUrl=u=>typeof u==='string'&&/^https?:\/\//i.test(u);
const money=(n,c)=>n>0?(c||'LKR')+' '+n.toLocaleString('en-LK',{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2}):'';
const WA_DEFAULT='94717505506';
const PAYMENT={enabled:false};          /* flip when a payment gateway is connected: branch in submit() after the partner confirms */
const STAY_CATS=['Boutique Hotels','Villas & Private Stays','Guesthouses','Hostels','Budget Accommodation'];
const FOOD_CATS=['Restaurants','Beachfront Caf\u00e9s','Breakfast & Brunch','Sri Lankan Cuisine','Seafood & Dining'];
const STATUS={open:['Accepting requests','ok'],limited:['Limited availability','warn'],full:['Fully booked','no'],closed:['Closed for the season','no']};
let FEE=200;                             /* customer service fee in basis points (2%), overridden by platform_settings */

/* Commercial rules in one place (display only; the database is the authority).
   Customer fee = FEE bps of the listed price. Partner commission = 8% of the listed price, only for a successful PAID booking, once. */
window.hkFees={
  customerFee:sub=>Math.round(sub*FEE)/10000,
  commission:b=>(b&&b.payment_status==='paid'&&!b.commission_charged&&!['cancelled','declined','expired'].includes(b.status))?Math.round((+b.subtotal||0)*800)/10000:0
};

const I={
 pin:'M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
 bed:'M3 18V7M3 14h18v4M21 14v-2a3 3 0 00-3-3h-7v5M7 11.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z',
 cup:'M5 8h11v6a5 5 0 01-5 5h-1a5 5 0 01-5-5zM16 9h2a2.5 2.5 0 010 5h-2M8 3v2M12 3v2',
 user:'M16 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M9.5 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM21 20v-1a4 4 0 00-3-3.9M16 4.1a3.5 3.5 0 010 6.8',
 clock:'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2',
 ok:'M5 12.5l4.5 4.5L19 7.5'};
const ic=(k,c)=>`<svg class="${c||''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${I[k]}"/></svg>`;
const ver='<span class="se-vf">'+ic('ok')+'Verified Partner</span>';

/* ---------- normalise (one shape for properties and venues, from either source) ---------- */
const common=x=>({id:String(x.id),name:String(x.title||''),loc:String(x.loc||''),map:okUrl(x.map)?x.map:'',desc:String(x.desc||''),hl:lines(x.highlights),
  imgs:(Array.isArray(x.imgs)?x.imgs:[]).filter(okUrl).slice(0,6),verified:!!x.verified,status:STATUS[x.status]?x.status:'open',cur:String(x.cur||'LKR'),
  cats:Array.isArray(x.cats)?x.cats:[],wa:String((x.contact&&x.contact.wa)||'').replace(/\D/g,''),phone:String((x.contact&&x.contact.phone)||''),email:String((x.contact&&x.contact.email)||'')});
function normProp(x){
  const rooms=(Array.isArray(x.rooms)?x.rooms:[]).filter(r=>r&&r.name).map(r=>({id:String(r.id||r.name),n:String(r.name),price:num(r.price),sleeps:Math.max(1,parseInt(r.sleeps,10)||2),beds:String(r.beds||''),d:String(r.desc||'')}));
  const prices=rooms.map(r=>r.price).filter(p=>p>0),pl=x.policy||{};
  return Object.assign(common(x),{kind:'stay',rooms,from:prices.length?Math.min(...prices):0,cap:parseInt(x.cap,10)||(rooms.length?Math.max(...rooms.map(r=>r.sleeps)):0),
    fac:lines(x.facilities),cin:String(x.cin||''),cout:String(x.cout||''),cancel:String(pl.cancel||''),children:String(pl.children||''),pets:String(pl.pets||''),rules:String(pl.rules||'')});
}
function normVenue(x){
  return Object.assign(common(x),{kind:'food',cuisine:String(x.cuisine||''),hours:String(x.hours||''),range:String(x.range||''),menu:okUrl(x.menu)?x.menu:'',
    slots:lines(x.slots),maxparty:Math.max(1,Math.min(50,parseInt(x.maxparty,10)||12)),notice:String(x.notice||'')});
}
function fromListing(l){      /* an approved partner's row in `listings` */
  const p=l.partners||{},stay=p.type==='stay';let g=l.gallery;if(typeof g==='string'){try{g=JSON.parse(g)}catch(e){g=[]}}
  const imgs=(Array.isArray(g)?g:[]).filter(okUrl);if(okUrl(l.image_url)&&!imgs.includes(l.image_url))imgs.unshift(l.image_url);
  const base={id:'l-'+l.id,title:l.title,loc:l.location||p.location||'',desc:l.long_description||l.description||'',imgs,verified:true,cats:[],contact:{phone:p.public_phone||''},map:l.map_url};
  if(stay){const pr=(+l.price_cents||0)/100;return normProp(Object.assign(base,{cap:l.capacity,facilities:l.facilities,
    rooms:[{id:'l-'+l.id,name:l.title,price:pr,sleeps:parseInt(l.capacity,10)||2}]}))}
  return normVenue(Object.assign(base,{cuisine:l.cuisine,hours:l.opening_hours,range:l.price_range}));
}

/* ---------- state ---------- */
let props=[],venues=[];
const S={mode:'stay',in:'',out:'',guests:2,date:'',time:'',staycat:'',foodcat:'',q:''};
const $=(s,r=root)=>r.querySelector(s),$$=(s,r=root)=>[...r.querySelectorAll(s)];

/* ---------- cards (reusable for properties and venues) ---------- */
const photo=x=>`<div class="se-ph">${x.imgs[0]?`<img src="${esc(x.imgs[0])}" alt="${esc(x.name)}" loading="lazy" decoding="async">`:`<span class="se-pp" aria-hidden="true">${ic(x.kind==='stay'?'bed':'cup')}</span>`}${x.verified?ver:''}</div>`;
function card(x){
  const st=STATUS[x.status],off=x.status==='full'||x.status==='closed';
  const meta=x.kind==='stay'
    ?`<p class="se-m">${x.cap?ic('user')+'Sleeps up to '+x.cap:''}</p>`
    :`<p class="se-m">${x.cuisine?ic('cup')+esc(x.cuisine):''}</p>${x.hours?`<p class="se-m">${ic('clock')}${esc(x.hours)}</p>`:''}`;
  const foot=x.kind==='stay'
    ?`<p class="se-pr">${x.from?`<small>From</small> <b>${money(x.from,x.cur)}</b> <small>per night</small>`:'<small>Rates on request</small>'}</p>`
    :`<p class="se-pr">${x.range?`<b>${esc(x.range)}</b>`:'<small>Price range on request</small>'}</p>`;
  return `<article class="se-card" data-id="${esc(x.id)}">${photo(x)}<div class="se-bd"><p class="se-cat">${esc(x.cats.slice(0,2).join(' \u00b7 '))}</p><h3>${esc(x.name)}</h3>`+
   `<p class="se-lc">${x.loc?ic('pin')+esc(x.loc):''}<span class="se-s ${st[1]}">${st[0]}</span></p>${meta}`+
   (x.kind==='stay'&&x.fac.length?`<ul class="se-tags">${x.fac.slice(0,4).map(f=>`<li>${esc(f)}</li>`).join('')}</ul>`:'')+
   (x.kind==='food'&&x.hl.length?`<ul class="se-tags">${x.hl.slice(0,3).map(f=>`<li>${esc(f)}</li>`).join('')}</ul>`:'')+
   `<footer class="se-ft">${foot}<span><button type="button" class="btn" data-view="${esc(x.id)}">View Details</button> <button type="button" class="btn fill" data-book="${esc(x.id)}"${off?' disabled':''}>${x.kind==='stay'?'BOOK NOW':'BOOK A TABLE'}</button></span></footer></div></article>`;
}
function paint(){
  const k=S.q.trim().toLowerCase();
  const ps=props.filter(p=>(!S.staycat||p.cats.includes(S.staycat))&&(!S.guests||!p.cap||p.cap>=S.guests||S.mode!=='stay'||!S.searched)&&(!k||(p.name+' '+p.loc).toLowerCase().includes(k)));
  const vs=venues.filter(v=>(!S.foodcat||v.cats.includes(S.foodcat))&&(!k||(v.name+' '+v.loc+' '+v.cuisine).toLowerCase().includes(k)));
  $('#se-stay-grid').innerHTML=ps.map(card).join('');$('#se-food-grid').innerHTML=vs.map(card).join('');
  $('#se-stay-none').hidden=!!ps.length;$('#se-food-none').hidden=!!vs.length;
  $('#se-stay-none').textContent=props.length?'No stays match these filters. Try another category or guest number.':'Our first stays are being verified. They appear here as soon as they are approved.';
  $('#se-food-none').textContent=venues.length?'No venues match these filters. Try another category.':'Our first venues are being verified. They appear here as soon as they are approved.';
  $$('#se-stay-chips button').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.c||'')===S.staycat)));
  $$('#se-food-chips button').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.c||'')===S.foodcat)));
}
const chipHtml=a=>'<button type="button" data-c="" aria-pressed="true">All</button>'+a.map(c=>`<button type="button" data-c="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join('');
$('#se-stay-chips').innerHTML=chipHtml(STAY_CATS);$('#se-food-chips').innerHTML=chipHtml(FOOD_CATS);
$('#se-stay-chips').addEventListener('click',e=>{const b=e.target.closest('button');if(b){S.staycat=b.dataset.c;paint()}});
$('#se-food-chips').addEventListener('click',e=>{const b=e.target.closest('button');if(b){S.foodcat=b.dataset.c;paint()}});
const find=id=>props.concat(venues).find(x=>x.id===String(id));
root.addEventListener('click',e=>{const v=e.target.closest('[data-view]'),b=e.target.closest('[data-book]');
  if(b&&!b.disabled){const x=find(b.dataset.book);x&&book(x)}else if(v){const x=find(v.dataset.view);x&&detail(x)}
  else{const c=e.target.closest('.se-card');if(c&&!e.target.closest('a,button')){const x=find(c.dataset.id);x&&detail(x)}}});

/* ---------- hero search ---------- */
const sf=$('#se-search');
const today=()=>new Date().toISOString().slice(0,10);
const addDay=(s,n)=>{const d=new Date(s+'T00:00');d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
sf.querySelectorAll('[type=date]').forEach(i=>i.min=today());
function mode(m){S.mode=m;sf.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.tab===m)));sf.querySelectorAll('[data-m]').forEach(g=>g.hidden=g.dataset.m!==m)}
sf.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>mode(b.dataset.tab)));
sf.querySelector('#se-in').addEventListener('change',e=>{const o=sf.querySelector('#se-out');o.min=e.target.value?addDay(e.target.value,1):today();if(o.value&&o.value<=e.target.value)o.value=''});
sf.addEventListener('submit',e=>{e.preventDefault();const g=id=>sf.querySelector(id).value;S.searched=true;
  if(S.mode==='stay'){S.in=g('#se-in');S.out=g('#se-out');S.guests=Math.max(1,parseInt(g('#se-g'),10)||2);S.staycat=g('#se-sc');S.q=g('#se-q')}
  else{S.date=g('#se-d');S.time=g('#se-t');S.guests=Math.max(1,parseInt(g('#se-dg'),10)||2);S.foodcat=g('#se-dc');S.q=g('#se-q2')}
  paint();(S.mode==='stay'?$('#se-stay'):$('#se-food')).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})});
sf.querySelector('#se-sc').innerHTML='<option value="">All stay types</option>'+STAY_CATS.map(c=>`<option>${esc(c)}</option>`).join('');
sf.querySelector('#se-dc').innerHTML='<option value="">All dining types</option>'+FOOD_CATS.map(c=>`<option>${esc(c)}</option>`).join('');

/* ---------- detail dialog ---------- */
const dd=document.createElement('dialog');dd.id='sed';dd.setAttribute('aria-labelledby','sed-t');document.body.append(dd);
const ul=a=>a.length?`<ul class="se-ul">${a.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';
const sec=(t,h)=>h?`<section class="se-sec2"><h4>${t}</h4>${h}</section>`:'';
const fact=(k,v)=>v?`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`:'';
function detail(x){
  const im=x.imgs.length?x.imgs:[''],st=STATUS[x.status],off=x.status==='full'||x.status==='closed';
  const gal=`<div class="se-gal"><div class="se-main">${im[0]?`<img src="${esc(im[0])}" alt="${esc(x.name)}" decoding="async">`:ic(x.kind==='stay'?'bed':'cup')}</div>`+
    (im.length>1?`<div class="se-th">${im.map((u,i)=>`<button type="button" data-i="${i}" aria-label="Photo ${i+1}"${i?'':' aria-current="true"'}><img src="${esc(u)}" alt="" loading="lazy"></button>`).join('')}</div>`:'')+'</div>';
  let body='';
  if(x.kind==='stay'){
    body=(x.desc?`<p class="se-ds">${esc(x.desc)}</p>`:'')+sec('Highlights',ul(x.hl))+sec('Facilities',ul(x.fac))+
     (x.rooms.length?sec('Rooms',`<div class="se-rooms">${x.rooms.map(r=>`<div class="se-room"><div><b>${esc(r.n)}</b><p>${[r.sleeps?'Sleeps '+r.sleeps:'',r.beds].filter(Boolean).map(esc).join(' \u00b7 ')}</p>${r.d?`<p>${esc(r.d)}</p>`:''}</div><div class="se-rp"><b>${r.price>0?money(r.price,x.cur):'On request'}</b>${r.price>0?'<small>per night</small>':''}<button type="button" class="btn" data-room="${esc(r.id)}"${off?' disabled':''}>Select</button></div></div>`).join('')}</div>`):'')+
     `<dl class="se-facts">${fact('Check-in',x.cin)}${fact('Check-out',x.cout)}${fact('Cancellation',x.cancel)}${fact('Children',x.children)}${fact('Pets',x.pets)}${fact('House rules',x.rules)}</dl>`;
  }else{
    body=(x.desc?`<p class="se-ds">${esc(x.desc)}</p>`:'')+sec('Highlights',ul(x.hl))+
     `<dl class="se-facts">${fact('Cuisine',x.cuisine)}${fact('Opening hours',x.hours)}${fact('Price range',x.range)}${fact('Largest group',x.maxparty?x.maxparty+' guests':'')}${fact('Reserve ahead',x.notice)}</dl>`+
     (x.slots.length?sec('Reservation times',`<ul class="se-tags">${x.slots.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`):'')+
     (x.menu?`<p><a class="btn" href="${esc(x.menu)}" target="_blank" rel="noopener">View menu</a></p>`:'');
  }
  dd.innerHTML=`<button type="button" class="se-x" aria-label="Close">\u2715</button>${gal}<div class="se-dt"><p class="se-cat">${esc(x.cats.join(' \u00b7 '))}</p><h3 id="sed-t">${esc(x.name)}</h3>`+
    `<p class="se-lc">${x.loc?ic('pin')+esc(x.loc):''}<span class="se-s ${st[1]}">${st[0]}</span>${x.verified?ver:''}</p>${body}`+
    (x.map?`<p><a class="btn" href="${esc(x.map)}" target="_blank" rel="noopener">Open in Google Maps</a></p>`:'')+
    (x.phone||x.email?`<p class="note">${[x.phone,x.email].filter(Boolean).map(esc).join(' \u00b7 ')}</p>`:'')+
    `<div class="se-act"><button type="button" class="btn fill" data-bk="${esc(x.id)}"${off?' disabled':''}>${x.kind==='stay'?'BOOK NOW':'BOOK A TABLE'}</button></div></div>`;
  dd._x=x;dd.showModal();dd.scrollTop=0;
}
dd.addEventListener('click',e=>{
  if(e.target===dd||e.target.closest('.se-x')){dd.close();return}
  const th=e.target.closest('.se-th button');if(th&&dd._x){dd.querySelector('.se-main').innerHTML=`<img src="${esc(dd._x.imgs[+th.dataset.i])}" alt="${esc(dd._x.name)}" decoding="async">`;
    dd.querySelectorAll('.se-th button').forEach(b=>b.removeAttribute('aria-current'));th.setAttribute('aria-current','true');return}
  const r=e.target.closest('[data-room]');if(r&&dd._x){const x=dd._x;dd.close();book(x,r.dataset.room);return}
  const b=e.target.closest('[data-bk]');if(b&&dd._x){const x=dd._x;dd.close();book(x)}});

/* ---------- booking dialog (request flow, never auto-confirmed) ---------- */
const bd=document.createElement('dialog');bd.id='seb';bd.setAttribute('aria-labelledby','seb-t');document.body.append(bd);
const fmt=s=>{try{return new Date(s+'T00:00').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric'})}catch(e){return s}};
const contact=`<fieldset class="se-fs"><legend>Your details</legend><div class="se-g2"><label>Full name<input type="text" name="name" maxlength="80" autocomplete="name" required></label>`+
  `<label>Email<input type="email" name="email" maxlength="120" autocomplete="email" required></label>`+
  `<label>WhatsApp number<input type="tel" name="whatsapp" maxlength="25" autocomplete="tel" placeholder="+country code" required></label>`+
  `<label>Country<input type="text" name="country" maxlength="60" autocomplete="country-name"></label></div></fieldset>`;
const closeBtn='<button type="button" class="se-x" aria-label="Close">\u2715</button>';
function book(x,roomId){
  const t=today();let h;
  if(x.kind==='stay'){
    const inD=S.in&&S.in>=t?S.in:'',outD=inD&&S.out>inD?S.out:'';
    h=`${closeBtn}<form class="se-form" id="seb-f" novalidate><p class="se-cat">Request to book</p><h3 id="seb-t">${esc(x.name)}</h3><p class="mut">${esc(x.loc)}</p>`+
     `<fieldset class="se-fs"><legend>Your stay</legend><div class="se-g2"><label>Check-in<input type="date" name="cin" min="${t}" value="${inD}" required></label>`+
     `<label>Check-out<input type="date" name="cout" min="${inD?addDay(inD,1):t}" value="${outD}" required></label>`+
     `<label>Guests<input type="number" name="guests" min="1" max="50" value="${S.guests||2}" inputmode="numeric" required></label>`+
     `<label>Rooms<input type="number" name="rooms" min="1" max="10" value="1" inputmode="numeric" required></label></div>`+
     (x.rooms.length?`<label>Room<select name="room">${x.rooms.map(r=>`<option value="${esc(r.id)}"${r.id===roomId?' selected':''}>${esc(r.n)}${r.price>0?' \u2013 '+money(r.price,x.cur)+' per night':''} (sleeps ${r.sleeps})</option>`).join('')}</select></label>`:'<p class="mut">The partner will suggest a room and a rate.</p>')+`</fieldset>`+
     contact+`<label>Special requests<textarea name="notes" maxlength="500" placeholder="Arrival time, dietary needs, extra bed..."></textarea></label>`+
     `<section class="se-bk" aria-live="polite" id="seb-bk"></section><p class="msg" role="status"></p>`+
     `<div class="se-act"><button type="submit" class="btn fill">Send booking request</button><a class="btn" id="seb-wa" target="_blank" rel="noopener" href="#">Ask on WhatsApp</a></div>`+
     `<p class="se-fine">Availability is confirmed by the partner before anything is charged. No payment is taken on this website yet; you will be told how to pay when your stay is confirmed.</p></form>`;
  }else{
    const dt=S.date&&S.date>=t?S.date:'';
    h=`${closeBtn}<form class="se-form" id="seb-f" novalidate><p class="se-cat">Table reservation request</p><h3 id="seb-t">${esc(x.name)}</h3><p class="mut">${esc(x.loc)}${x.hours?' \u00b7 '+esc(x.hours):''}</p>`+
     `<fieldset class="se-fs"><legend>Your table</legend><div class="se-g2"><label>Reservation date<input type="date" name="date" min="${t}" value="${dt}" required></label>`+
     (x.slots.length?`<label>Preferred time<select name="time">${x.slots.map(s=>`<option${s===S.time?' selected':''}>${esc(s)}</option>`).join('')}</select></label>`:`<label>Preferred time<input type="time" name="time" value="${esc(S.time)}" required></label>`)+
     `<label>Guests<input type="number" name="guests" min="1" max="${x.maxparty}" value="${Math.min(x.maxparty,S.guests||2)}" inputmode="numeric" required></label></div></fieldset>`+
     contact+`<label>Special requests<textarea name="notes" maxlength="500" placeholder="Allergies, celebrations, high chair, seating preference..."></textarea></label>`+
     `<section class="se-bk"><h4>Price</h4><dl><div><dt>Table reservation</dt><dd>No charge</dd></div></dl><p class="se-fine">You pay the venue directly for what you order. The venue confirms your table by email or WhatsApp.</p></section><p class="msg" role="status"></p>`+
     `<div class="se-act"><button type="submit" class="btn fill">Send reservation request</button><a class="btn" id="seb-wa" target="_blank" rel="noopener" href="#">Ask on WhatsApp</a></div></form>`;
  }
  bd.innerHTML=h;bd._x=x;wire(x);bd.showModal();bd.scrollTop=0;
}
function calc(x,f){
  const r=x.rooms.find(z=>z.id===(f.room?f.room.value:''))||x.rooms[0]||null;
  const a=f.cin.value,b=f.cout.value,nights=a&&b&&b>a?Math.round((new Date(b+'T00:00')-new Date(a+'T00:00'))/864e5):0;
  const rooms=Math.max(1,Math.min(10,parseInt(f.rooms.value,10)||1)),guests=Math.max(1,parseInt(f.guests.value,10)||1);
  const sub=r&&r.price>0&&nights?Math.round(r.price*nights*rooms*100)/100:0,fee=sub?window.hkFees.customerFee(sub):0;
  return {r,nights,rooms,guests,sub,fee,total:Math.round((sub+fee)*100)/100};
}
function wire(x){
  const f=bd.querySelector('#seb-f'),msg=f.querySelector('.msg'),bad=t=>{msg.textContent=t;msg.classList.add('show')};
  const wa='https://wa.me/'+(x.wa.length>=9?x.wa:WA_DEFAULT)+'?text=';
  const text=()=>x.kind==='stay'
    ?(c=>`Hello HIRIKETIYO, I\u2019d like to book ${x.name}.\nCheck-in: ${f.cin.value||'tbc'}\nCheck-out: ${f.cout.value||'tbc'}\nGuests: ${c.guests}\nRooms: ${c.rooms}${c.r?'\nRoom: '+c.r.n:''}${c.sub?'\nEstimate: '+money(c.total,x.cur):''}${f.name.value?'\nName: '+f.name.value:''}`)(calc(x,f))
    :`Hello HIRIKETIYO, I\u2019d like to reserve a table at ${x.name}.\nDate: ${f.date.value||'tbc'}\nTime: ${f.time.value||'flexible'}\nGuests: ${f.guests.value}${f.name.value?'\nName: '+f.name.value:''}${f.notes.value?'\nRequests: '+f.notes.value:''}`;
  const upd=()=>{
    if(x.kind==='stay'){
      const a=f.cin.value;f.cout.min=a?addDay(a,1):today();if(f.cout.value&&a&&f.cout.value<=a)f.cout.value='';
      const c=calc(x,f),box=f.querySelector('#seb-bk');let h='<h4>Price breakdown</h4>';
      if(c.sub){h+=`<dl><div><dt>${esc(c.r.n)}<small>${money(c.r.price,x.cur)} \u00d7 ${c.nights} night${c.nights>1?'s':''} \u00d7 ${c.rooms} room${c.rooms>1?'s':''}</small></dt><dd>${money(c.sub,x.cur)}</dd></div>`+
        `<div><dt>Customer service fee (${FEE/100}%)<small>Added to the listed price</small></dt><dd>${money(c.fee,x.cur)}</dd></div><div class="tot"><dt>Estimated total</dt><dd>${money(c.total,x.cur)}</dd></div></dl>`+
        `<p class="se-fine">Estimate for the listed price. The partner confirms availability and the final amount. Nothing is charged now.</p>`}
      else h+=`<p class="mut">${c.r&&c.r.price>0?'Choose your check-in and check-out dates to see the price.':'The partner will quote the rate when they confirm availability.'}</p>`;
      box.innerHTML=h;
    }
    f.querySelector('#seb-wa').href=wa+encodeURIComponent(text());
  };
  f.addEventListener('input',upd);f.addEventListener('change',upd);upd();
  f.addEventListener('submit',async e=>{e.preventDefault();msg.classList.remove('show');
    const c=x.kind==='stay'?calc(x,f):null;
    if(x.kind==='stay'){
      if(!f.cin.value||!f.cout.value)return bad('Choose your check-in and check-out dates.');
      if(f.cin.value<today())return bad('Check-in must be today or later.');
      if(f.cout.value<=f.cin.value)return bad('Check-out must be after check-in.');
      if(c.r&&c.guests>c.r.sleeps*c.rooms)return bad(`${c.r.n} sleeps ${c.r.sleeps}. Add rooms or choose a larger room for ${c.guests} guests.`);
    }else{
      if(!f.date.value)return bad('Choose your reservation date.');
      if(f.date.value<today())return bad('Choose a date from today onwards.');
      if(!f.time.value)return bad('Choose a preferred time.');
    }
    if(f.name.value.trim().length<2)return bad('Enter your full name.');
    if(!/^\S+@\S+\.\S+$/.test(f.email.value.trim()))return bad('Enter a valid email address.');
    if(f.whatsapp.value.replace(/\D/g,'').length<7)return bad('Enter a WhatsApp number with the country code.');
    const who={name:f.name.value.trim(),email:f.email.value.trim(),whatsapp:f.whatsapp.value.trim(),country:f.country.value.trim(),notes:f.notes.value.trim()};
    const pay=x.kind==='stay'
      ?Object.assign({kind:'stay_booking',listing_id:x.id,partner:x.name,room_id:c.r?c.r.id:'',room:c.r?c.r.n:'',check_in:f.cin.value,check_out:f.cout.value,nights:c.nights,rooms:c.rooms,guests:c.guests,
        pricing:{currency:x.cur,subtotal:c.sub,customer_fee_bps:FEE,customer_fee:c.fee,total:c.total},status:'requested',payment_status:PAYMENT.enabled?'pending':'not_required_yet'},who)
      :Object.assign({kind:'table_reservation',listing_id:x.id,venue:x.name,date:f.date.value,time:f.time.value,guests:Math.max(1,parseInt(f.guests.value,10)||1),status:'requested',payment_status:'not_required'},who);
    const b=f.querySelector('[type=submit]');b.disabled=true;const sb=window.hkSb;let error=sb?null:{message:'not connected'};
    if(sb)({error}=await sb.rpc('submit_enquiry',{p_kind:'booking_request',p_email:pay.email,p_payload:pay}));
    b.disabled=false;
    if(error){bad('We could not send your request online. Use the WhatsApp button to send the same details.');return}
    const stay=x.kind==='stay';
    bd.innerHTML=`${closeBtn}<div class="se-done"><h3>Request sent</h3><p class="se-status"><b>Status:</b> ${stay?'Waiting for the partner to confirm availability':'Waiting for the venue to confirm your table'}</p>`+
      `<p>Thank you, ${esc(who.name.split(' ')[0])}. ${stay?`Your request for <b>${esc(x.name)}</b>, ${esc(fmt(pay.check_in))} to ${esc(fmt(pay.check_out))}, ${pay.guests} guest${pay.guests>1?'s':''}`:`Your table request at <b>${esc(x.name)}</b> on ${esc(fmt(pay.date))} at ${esc(pay.time)} for ${pay.guests} guest${pay.guests>1?'s':''}`} was received. It is <b>not confirmed yet</b>.</p>`+
      `<ol class="se-flow"><li class="done">Request received by HIRIKETIYO</li><li>${stay?'The partner checks availability':'The venue checks the table'}</li>${stay?'<li>You get the confirmed price and how to pay</li><li>Booking confirmed once paid</li>':'<li>You get a confirmation by email or WhatsApp</li>'}</ol>`+
      `<div class="se-act"><a class="btn fill" target="_blank" rel="noopener" href="${wa+encodeURIComponent(text())}">Also send on WhatsApp</a><button type="button" class="btn" data-close>Close</button></div></div>`;
  });
}
bd.addEventListener('click',e=>{if(e.target===bd||e.target.closest('.se-x')||e.target.closest('[data-close]'))bd.close()});

/* ---------- load ---------- */
const sb=window.hkSb;
const safe=p=>{try{return Promise.resolve(p).catch(()=>null)}catch(e){return Promise.resolve(null)}};
paint();
if(!sb)return;
safe(sb.from('platform_settings').select('customer_fee_bps').single()).then(r=>{const v=r&&r.data&&+r.data.customer_fee_bps;if(v>=0&&isFinite(v))FEE=v});
const a=safe(sb.from('site_theme').select('value').eq('key','stay').maybeSingle());
const b=safe(sb.from('listings').select('*,partners(name,type,location,public_phone)').order('created_at',{ascending:false}).limit(80));
Promise.all([a,b]).then(([t,l])=>{
  const v=t&&t.data&&t.data.value||{};
  const mine=(v.props||[]).filter(x=>x&&x.id&&x.title&&x.show!==false).map(normProp),mv=(v.venues||[]).filter(x=>x&&x.id&&x.title&&x.show!==false).map(normVenue);
  const rows=((l&&l.data)||[]).filter(r=>r.partners&&(r.partners.type==='stay'||r.partners.type==='food'));
  props=mine.concat(rows.filter(r=>r.partners.type==='stay').map(fromListing));venues=mv.concat(rows.filter(r=>r.partners.type==='food').map(fromListing));
  paint();
});
})();
