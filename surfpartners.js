/* HIRIKETIYO Surf Partners page (#surfpartners). Loads after data.js.
   Partners are added in Admin Studio > Surf partners (saved in Supabase `site_theme`, key "surfpartners").
   Only partners with "Show on the website" ticked appear. Nothing is invented: every field is optional and hidden when empty.
   Ratings come from the reviews the admin adds (average of them); with no reviews the manual rating is used.
   Booking is a REQUEST flow (never auto-confirmed): saved through submit_enquiry('booking_request') or sent on WhatsApp. */
(()=>{
const root=document.getElementById('surfpartners');const app=document.getElementById('sf-app');if(!root||!app)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const WA_DEFAULT='94717505506';
const num=v=>{v=parseFloat(v);return isFinite(v)?v:0};
const lines=v=>Array.isArray(v)?v.map(x=>String(x).trim()).filter(Boolean):String(v||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
const okUrl=u=>typeof u==='string'&&/^https?:\/\//i.test(u);
const money=(n,c)=>n>0?(c||'LKR')+' '+n.toLocaleString('en-LK',{maximumFractionDigits:n%1?2:0}):'';
const UNIT={person:'per person',group:'per group',session:'per session',day:'per day',hour:'per hour'};
const STATUS={open:['Open for bookings','ok'],limited:['Limited spots','warn'],full:['Fully booked','no'],closed:['Closed for the season','no']};
const stars=r=>`<span class="sf-st" role="img" aria-label="${r.toFixed(1)} out of 5" style="--r:${(r/5*100).toFixed(1)}%"></span>`;
const PIN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
const WAVE='<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M24 5c6 8 6 30 0 38-6-8-6-30 0-38z"/><path d="M24 11v26"/></svg>';

let items=[],f={q:'',lv:'',ty:'',sort:'top'};

function norm(x){
  const revs=(Array.isArray(x.reviews)?x.reviews:[]).filter(r=>r&&r.text&&num(r.rating)>0)
    .map(r=>({n:String(r.name||'Guest'),c:String(r.country||''),r:Math.min(5,Math.max(1,num(r.rating))),t:String(r.text),d:String(r.date||''),v:!!r.verified}));
  const pk=(Array.isArray(x.packages)?x.packages:[]).filter(p=>p&&p.name).map(p=>({id:String(p.id||p.name),n:String(p.name),d:String(p.desc||''),dur:String(p.duration||''),
    price:num(p.price),unit:UNIT[p.unit]?p.unit:'person',grp:String(p.group||''),lv:String(p.level||''),ty:String(p.type||''),inc:lines(p.inc)}));
  const avg=revs.length?revs.reduce((a,r)=>a+r.r,0)/revs.length:num(x.rating),cnt=revs.length||Math.round(num(x.rcount));
  const prices=pk.map(p=>p.price).filter(p=>p>0);
  const b=x.booking||{};
  return {id:String(x.id),name:String(x.title||''),tag:String(x.tag||''),desc:String(x.desc||''),team:String(x.team||''),years:String(x.years||''),
    langs:String(x.langs||''),certs:String(x.certs||''),safety:String(x.safety||''),loc:String(x.loc||''),map:okUrl(x.map)?x.map:'',
    status:STATUS[x.status]?x.status:'open',badge:String(x.badge||''),feat:!!x.feat,logo:okUrl(x.logo)?x.logo:'',imgs:(x.imgs||[]).filter(okUrl).slice(0,5),
    lv:Array.isArray(x.levels)?x.levels:[],ty:Array.isArray(x.types)?x.types:[],gmax:String(x.gmax||''),minage:String(x.minage||''),
    equip:lines(x.equip),inc:lines(x.inc),exc:lines(x.exc),bring:lines(x.bring),pk,revs,
    rating:avg>0?Math.min(5,avg):0,rcount:cnt,from:prices.length?Math.min(...prices):0,cur:String(x.cur||'LKR'),
    how:String(b.how||''),hours:String(b.hours||''),slots:lines(b.slots),notice:String(b.notice||''),deposit:String(b.deposit||''),cancel:String(b.cancel||''),
    pay:Array.isArray(b.pay)?b.pay:[],paynote:String(b.paynote||''),wa:String(b.wa||'').replace(/\D/g,''),phone:String(b.phone||''),email:String(b.email||'')};
}

/* ---------- list ---------- */
const bar=document.createElement('div');bar.className='sf-bar';bar.hidden=true;
bar.innerHTML='<input type="search" id="sf-q" placeholder="Search by name, place or language" aria-label="Search surf partners" maxlength="60" autocomplete="off">'+
 '<select id="sf-ty" aria-label="Lesson type"><option value="">Any lesson type</option></select>'+
 '<select id="sf-s" aria-label="Sort"><option value="top">Top rated</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option><option value="az">Name: A to Z</option></select>';
const chips=document.createElement('div');chips.className='sf-chips';chips.hidden=true;chips.setAttribute('role','group');chips.setAttribute('aria-label','Skill level');
const count=document.createElement('p');count.className='sf-count';count.setAttribute('aria-live','polite');count.hidden=true;
const list=document.createElement('div');list.className='sf-list';
const none=document.createElement('p');none.className='mut sf-none';none.hidden=true;none.textContent='No surf partners match your search. Clear a filter to see more.';
app.append(bar,chips,count,list,none);
const emptyBox=app.querySelector('.sf-empty');

function card(p){
  const st=STATUS[p.status],cheap=p.pk.filter(k=>k.price>0).sort((a,b)=>a.price-b.price).slice(0,2);
  return `<article class="sf-card${p.feat?' feat':''}" data-id="${esc(p.id)}"><div class="sf-ph">${p.imgs[0]?`<img src="${esc(p.imgs[0])}" alt="${esc(p.name)}" loading="lazy" decoding="async">`:WAVE}`+
   `${p.feat?'<span class="sf-fl">Featured</span>':''}${p.badge?`<span class="sf-bd">${esc(p.badge)}</span>`:''}</div>`+
   `<div class="sf-bo"><header class="sf-hd">${p.logo?`<img class="sf-lg" src="${esc(p.logo)}" alt="" loading="lazy">`:''}<div><h3>${esc(p.name)}</h3>`+
   `<p class="sf-lc">${p.loc?PIN+esc(p.loc):''}<span class="sf-s ${st[1]}">${st[0]}</span></p></div></header>`+
   (p.rating?`<p class="sf-rt">${stars(p.rating)}<b>${p.rating.toFixed(1)}</b>${p.rcount?`<span>(${p.rcount} review${p.rcount>1?'s':''})</span>`:''}</p>`:'<p class="sf-rt mut">No reviews yet</p>')+
   (p.tag?`<p class="sf-tg">${esc(p.tag)}</p>`:'')+
   `<ul class="sf-tags">${p.lv.concat(p.ty).map(t=>`<li>${esc(t)}</li>`).join('')}${p.langs?`<li>${esc(p.langs)}</li>`:''}</ul>`+
   (cheap.length?`<ul class="sf-pk">${cheap.map(k=>`<li><span>${esc(k.n)}${k.dur?` <small>${esc(k.dur)}</small>`:''}</span><b>${money(k.price,p.cur)}</b></li>`).join('')}</ul>`:'')+
   `<footer class="sf-ft"><p class="sf-from">${p.from?`<small>From</small> <b>${money(p.from,p.cur)}</b>`:'<small>Price on request</small>'}</p>`+
   `<span><button type="button" class="btn" data-view="${esc(p.id)}">View details</button> <button type="button" class="btn fill" data-book="${esc(p.id)}"${p.status==='closed'||p.status==='full'?' disabled':''}>Book now</button></span></footer></div></article>`;
}
function view(){
  const k=f.q.trim().toLowerCase();
  const r=items.filter(p=>(!f.lv||p.lv.includes(f.lv))&&(!f.ty||p.ty.includes(f.ty))&&
    (!k||[p.name,p.loc,p.langs,p.tag,p.team].join(' ').toLowerCase().includes(k)));
  if(f.sort==='top')r.sort((a,b)=>b.feat-a.feat||b.rating-a.rating||b.rcount-a.rcount);
  else if(f.sort==='lo')r.sort((a,b)=>(a.from||1e12)-(b.from||1e12));
  else if(f.sort==='hi')r.sort((a,b)=>b.from-a.from);
  else r.sort((a,b)=>a.name.localeCompare(b.name));
  if(f.sort==='top'&&!items.some(p=>p.rating||p.feat)){r.sort((a,b)=>items.indexOf(a)-items.indexOf(b))}
  list.innerHTML=r.map(card).join('');none.hidden=!(items.length&&!r.length);
  count.textContent=r.length+(r.length===1?' surf partner':' surf partners');
  chips.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.lv||'')===f.lv)));
}
bar.addEventListener('input',e=>{if(e.target.id==='sf-q'){f.q=e.target.value;view()}});
bar.addEventListener('change',e=>{if(e.target.id==='sf-ty'){f.ty=e.target.value;view()}if(e.target.id==='sf-s'){f.sort=e.target.value;view()}});
chips.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;f.lv=b.dataset.lv||'';view()});
list.addEventListener('click',e=>{const v=e.target.closest('[data-view]'),b=e.target.closest('[data-book]');
  if(b&&!b.disabled)open(b.dataset.book,'book');else if(v)open(v.dataset.view,'about');
  else{const c=e.target.closest('.sf-card');if(c&&!e.target.closest('a'))open(c.dataset.id,'about')}});

/* ---------- detail dialog ---------- */
const dlg=document.createElement('dialog');dlg.id='sfd';dlg.setAttribute('aria-labelledby','sfd-t');document.body.append(dlg);
let cur=null,tab='about',pick='';
const TABS=[['about','About'],['packages','Packages'],['reviews','Reviews'],['book','Book']];
const sec=(t,h)=>h?`<section class="sf-sec"><h4>${t}</h4>${h}</section>`:'';
const ul=a=>a.length?`<ul class="sf-ul">${a.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';
const fact=(k,v)=>v?`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`:'';
function open(id,t){const p=items.find(x=>x.id===String(id));if(!p)return;cur=p;tab=t||'about';pick=(p.pk[0]||{}).id||'';paint();dlg.showModal();dlg.scrollTop=0}
function paint(){
  const p=cur,st=STATUS[p.status],im=p.imgs.length?p.imgs:[''];
  const gal=`<div class="sf-gal"><div class="sf-main">${im[0]?`<img src="${esc(im[0])}" alt="${esc(p.name)}" decoding="async">`:WAVE}</div>`+
    (im.length>1?`<div class="sf-th">${im.map((u,i)=>`<button type="button" data-i="${i}" aria-label="Photo ${i+1}"${i?'':' aria-current="true"'}><img src="${esc(u)}" alt="" loading="lazy"></button>`).join('')}</div>`:'')+'</div>';
  const head=`<div class="sf-dh"><button type="button" class="sf-x" aria-label="Close">\u2715</button>${gal}<div class="sf-dt">${p.logo?`<img class="sf-lg" src="${esc(p.logo)}" alt="">`:''}<h3 id="sfd-t">${esc(p.name)}</h3>`+
    `<p class="sf-lc">${p.loc?PIN+esc(p.loc):''}<span class="sf-s ${st[1]}">${st[0]}</span>${p.badge?`<span class="sf-s">${esc(p.badge)}</span>`:''}</p>`+
    (p.rating?`<p class="sf-rt">${stars(p.rating)}<b>${p.rating.toFixed(1)}</b>${p.rcount?`<span>(${p.rcount} review${p.rcount>1?'s':''})</span>`:''}</p>`:'')+
    (p.tag?`<p class="sf-tg">${esc(p.tag)}</p>`:'')+'</div></div>';
  const tabs=`<div class="sf-tabs" role="tablist">${TABS.map(([k,l])=>`<button type="button" role="tab" data-tab="${k}" aria-selected="${k===tab}">${l}${k==='packages'&&p.pk.length?` <small>${p.pk.length}</small>`:''}${k==='reviews'&&p.revs.length?` <small>${p.revs.length}</small>`:''}</button>`).join('')}</div>`;
  dlg.innerHTML=head+tabs+`<div class="sf-pn">${panel(p)}</div>`;dlg.dataset.id=p.id;
  if(tab==='book')wireBook();
}
function panel(p){
  if(tab==='about'){
    const facts=fact('Experience',p.years)+fact('Languages',p.langs)+fact('Certifications',p.certs)+fact('Max group size',p.gmax)+fact('Minimum age',p.minage)+fact('Team',p.team);
    return (p.desc?`<p class="sf-ds">${esc(p.desc)}</p>`:'<p class="mut">The partner has not added a description yet.</p>')+(facts?`<dl class="sf-facts">${facts}</dl>`:'')+
      sec('Skill levels and lesson types',p.lv.length||p.ty.length?`<ul class="sf-tags">${p.lv.concat(p.ty).map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:'')+
      sec('Equipment provided',ul(p.equip))+sec('Included',ul(p.inc))+sec('Not included',ul(p.exc))+sec('What to bring',ul(p.bring))+
      sec('Safety',p.safety?`<p>${esc(p.safety)}</p>`:'')+
      (p.map?`<p><a class="btn" href="${esc(p.map)}" target="_blank" rel="noopener">Open in Google Maps</a></p>`:'');
  }
  if(tab==='packages'){
    if(!p.pk.length)return '<p class="mut">Packages and prices have not been added yet. Send a booking request and the partner will quote you.</p><p><button type="button" class="btn fill" data-tab="book">Request a quote</button></p>';
    return `<div class="sf-pkg">${p.pk.map(k=>`<article class="sf-pc"><div><h4>${esc(k.n)}</h4><p class="sf-pm">${[k.ty,k.lv,k.dur,k.grp].filter(Boolean).map(esc).join(' \u00b7 ')}</p>${k.d?`<p>${esc(k.d)}</p>`:''}${ul(k.inc)}</div>`+
      `<div class="sf-pp"><b>${k.price>0?money(k.price,p.cur):'Ask for price'}</b>${k.price>0?`<small>${UNIT[k.unit]}</small>`:''}<button type="button" class="btn fill" data-pick="${esc(k.id)}"${p.status==='closed'||p.status==='full'?' disabled':''}>Choose</button></div></article>`).join('')}</div>`;
  }
  if(tab==='reviews'){
    if(!p.revs.length)return p.rating?`<p class="sf-rt">${stars(p.rating)}<b>${p.rating.toFixed(1)}</b>${p.rcount?`<span>(${p.rcount} guest ratings)</span>`:''}</p><p class="mut">Written reviews have not been added yet.</p>`:'<p class="mut">No reviews yet. Be the first to learn with this partner and tell us how it went.</p>';
    const dist=[5,4,3,2,1].map(n=>{const c=p.revs.filter(r=>Math.round(r.r)===n).length;return `<li><span>${n}</span><i><u style="width:${(c/p.revs.length*100).toFixed(0)}%"></u></i><em>${c}</em></li>`}).join('');
    return `<div class="sf-sum"><div><b>${p.rating.toFixed(1)}</b>${stars(p.rating)}<small>${p.revs.length} review${p.revs.length>1?'s':''}</small></div><ul>${dist}</ul></div>`+
      `<ul class="sf-rv">${p.revs.map(r=>`<li><div class="sf-rh"><b>${esc(r.n)}</b>${r.c?`<span>${esc(r.c)}</span>`:''}${stars(r.r)}${r.d?`<time>${esc(r.d)}</time>`:''}${r.v?'<span class="sf-vf">Verified lesson</span>':''}</div><p>${esc(r.t)}</p></li>`).join('')}</ul>`;
  }
  /* book */
  const k=p.pk.find(x=>x.id===pick),today=new Date().toISOString().slice(0,10);
  const info=[['How booking works',p.how],['Lesson hours',p.hours],['Book ahead',p.notice],['Deposit',p.deposit],['Cancellation',p.cancel]].filter(x=>x[1]).map(x=>`<div><dt>${x[0]}</dt><dd>${esc(x[1])}</dd></div>`).join('');
  const pay=p.pay.length||p.paynote?`<div><dt>Payment</dt><dd>${esc(p.pay.join(', '))}${p.paynote?(p.pay.length?'. ':'')+esc(p.paynote):''}</dd></div>`:'';
  return (info||pay?`<dl class="sf-facts one">${info}${pay}</dl>`:'')+
   `<form class="sf-form" id="sf-bk" novalidate><h4>Request a booking</h4><p class="mut">This is a request. The partner confirms availability first, and you pay as agreed with them.</p><div class="sf-g2">`+
   (p.pk.length?`<label>Package<select name="pk">${p.pk.map(x=>`<option value="${esc(x.id)}"${x.id===pick?' selected':''}>${esc(x.n)}${x.price>0?' \u2013 '+money(x.price,p.cur)+' '+UNIT[x.unit]:''}</option>`).join('')}</select></label>`:'')+
   `<label>Date<input type="date" name="date" min="${today}" required></label>`+
   (p.slots.length?`<label>Time<select name="time">${p.slots.map(s=>`<option>${esc(s)}</option>`).join('')}</select></label>`:'<label>Preferred time<input type="text" name="time" maxlength="40" placeholder="e.g. Morning"></label>')+
   `<label>Guests<input type="number" name="guests" min="1" max="${Math.max(1,Math.min(50,parseInt(p.gmax,10)||20))}" value="2" inputmode="numeric" required></label>`+
   `<label>Skill level<select name="level"><option>Complete beginner</option><option>Some experience</option><option>Intermediate</option><option>Advanced</option></select></label>`+
   `<label>Your name<input type="text" name="name" maxlength="80" autocomplete="name" required></label>`+
   `<label>WhatsApp number<input type="tel" name="whatsapp" maxlength="25" autocomplete="tel" placeholder="+country code" required></label>`+
   `<label>Email<input type="email" name="email" maxlength="120" autocomplete="email" required></label></div>`+
   `<label>Notes (swimming ability, age of children, anything else)<textarea name="notes" maxlength="500"></textarea></label>`+
   `<p class="sf-est" id="sf-est" aria-live="polite"></p><p class="msg" role="status"></p>`+
   `<div class="sf-act"><button type="submit" class="btn fill">Send booking request</button><a class="btn" id="sf-wa" target="_blank" rel="noopener" href="#">Ask on WhatsApp</a></div></form>`+
   ((p.phone||p.email)?`<p class="note">Contact: ${[p.phone,p.email].filter(Boolean).map(esc).join(' \u00b7 ')}</p>`:'');
}
function wireBook(){
  const p=cur,f2=dlg.querySelector('#sf-bk');if(!f2)return;
  const get=()=>{const k=p.pk.find(x=>x.id===(f2.pk?f2.pk.value:''));const g=Math.max(1,parseInt(f2.guests.value,10)||1);
    return {k,g,total:k&&k.price>0?(k.unit==='person'?k.price*g:k.price):0}};
  const text=()=>{const {k,g,total}=get();return `Hello HIRIKETIYO, I\u2019d like to book a surf lesson with ${p.name}.\n`+(k?`Package: ${k.n}\n`:'')+`Date: ${f2.date.value||'to be confirmed'}\nTime: ${f2.time.value||'flexible'}\nGuests: ${g}\nLevel: ${f2.level.value}`+(total?`\nEstimate: ${money(total,p.cur)}`:'')+(f2.name.value?`\nName: ${f2.name.value}`:'')+(f2.notes.value?`\nNotes: ${f2.notes.value}`:'')};
  const upd=()=>{const {k,g,total}=get();dlg.querySelector('#sf-est').innerHTML=total?`Estimated total: <b>${money(total,p.cur)}</b> <small>(${g} guest${g>1?'s':''} \u00d7 ${UNIT[k.unit]}, confirmed by the partner)</small>`:'';
    dlg.querySelector('#sf-wa').href='https://wa.me/'+(p.wa.length>=9?p.wa:WA_DEFAULT)+'?text='+encodeURIComponent(text())};
  f2.addEventListener('input',upd);upd();
  f2.addEventListener('submit',async e=>{e.preventDefault();const m=f2.querySelector('.msg'),b=f2.querySelector('[type=submit]');
    const bad=t=>{m.textContent=t;m.classList.add('show')};
    if(!f2.date.value)return bad('Choose the date you want.');
    if(f2.date.value<new Date().toISOString().slice(0,10))return bad('Choose a date from today onwards.');
    if(f2.name.value.trim().length<2)return bad('Enter your name.');
    if(f2.whatsapp.value.replace(/\D/g,'').length<7)return bad('Enter a WhatsApp number with the country code.');
    if(!/^\S+@\S+\.\S+$/.test(f2.email.value.trim()))return bad('Enter a valid email address.');
    const {k,g,total}=get();
    const pay={kind:'surf_lesson',partner_id:p.id,partner:p.name,package_id:k?k.id:'',package:k?k.n:'',date:f2.date.value,time:f2.time.value,guests:g,level:f2.level.value,
      estimate:total,currency:p.cur,name:f2.name.value.trim(),email:f2.email.value.trim(),whatsapp:f2.whatsapp.value.trim(),notes:f2.notes.value.trim(),status:'pending_provider_confirmation'};
    b.disabled=true;const sb=window.hkSb;let error=sb?null:{message:'not connected'};
    if(sb)({error}=await sb.rpc('submit_enquiry',{p_kind:'booking_request',p_email:pay.email,p_payload:pay}));
    b.disabled=false;
    if(error){bad('We could not send your request online. Use the WhatsApp button to send the same details.');return}
    dlg.querySelector('.sf-pn').innerHTML=`<div class="sf-done"><h4>Request sent</h4><p><b>Status:</b> Pending provider confirmation</p><p>Thank you, ${esc(pay.name.split(' ')[0])}. Your request for <b>${esc(p.name)}</b> on ${esc(pay.date)} for ${g} guest${g>1?'s':''} was received. It is <b>not confirmed yet</b>.</p>`+
      `<ol class="sf-flow"><li class="done">Request received by HIRIKETIYO</li><li>The partner checks availability</li><li>You get a confirmation or another time by email or WhatsApp</li></ol><p><button type="button" class="btn" data-close>Close</button></p></div>`});
}
dlg.addEventListener('click',e=>{
  if(e.target===dlg||e.target.closest('.sf-x')||e.target.closest('[data-close]')){dlg.close();return}
  const t=e.target.closest('[data-tab]');if(t){tab=t.dataset.tab;paint();return}
  const pk=e.target.closest('[data-pick]');if(pk){pick=pk.dataset.pick;tab='book';paint();return}
  const th=e.target.closest('.sf-th button');if(th&&cur){dlg.querySelector('.sf-main').innerHTML=`<img src="${esc(cur.imgs[+th.dataset.i])}" alt="${esc(cur.name)}" decoding="async">`;
    dlg.querySelectorAll('.sf-th button').forEach(b=>b.removeAttribute('aria-current'));th.setAttribute('aria-current','true')}});
dlg.addEventListener('change',e=>{if(e.target.name==='pk')pick=e.target.value});
window.hkSurf={open};

/* ---------- load ---------- */
const sb=window.hkSb;
function show(){
  if(!items.length){if(emptyBox)emptyBox.hidden=false;return}
  if(emptyBox)emptyBox.hidden=true;bar.hidden=false;chips.hidden=false;count.hidden=false;
  const lv=[...new Set(items.flatMap(p=>p.lv))],ty=[...new Set(items.flatMap(p=>p.ty))];
  chips.innerHTML=lv.length?'<button type="button" data-lv="" aria-pressed="true">All levels</button>'+lv.map(l=>`<button type="button" data-lv="${esc(l)}" aria-pressed="false">${esc(l)}</button>`).join(''):'';chips.hidden=!lv.length;
  const sel=bar.querySelector('#sf-ty');ty.forEach(t=>sel.append(new Option(t,t)));sel.hidden=!ty.length;
  view();
}
if(!sb){show();return}
Promise.resolve(sb.from('site_theme').select('value').eq('key','surfpartners').maybeSingle()).then(r=>{
  const v=r&&r.data&&r.data.value;
  items=((v&&v.items)||[]).filter(x=>x&&x.id&&x.title&&x.show!==false).map(norm);
  show();
  const want=sessionStorage.getItem('hk_sf_open');if(want){sessionStorage.removeItem('hk_sf_open');open(want,'about')}
}).catch(()=>show());
})();
