/* HIRIKETIYO shop (Shopping page #shop).
   Products come from two places, both real and approved:
   1) Products you add in Admin Studio > Products (saved in Supabase `site_theme`, key "shop"; shown only when "Show on the website" is on).
   2) Partner products in the Supabase `listings` table (kind = 'product'); these keep the existing secure checkout (window.hkCheckout from data.js).
   How customers pay for the Admin Studio products is set in Admin Studio > Payment (`site_theme`, key "payment").
   The same list feeds the product line strip (window.hkProducts). Nothing is invented: with no products the original "Collection coming soon" card stays.
   Loads after data.js, before productline.js. */
(()=>{
const app=document.getElementById('shop-app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LKR=c=>'LKR '+(c/100).toLocaleString('en-LK',{minimumFractionDigits:2,maximumFractionDigits:2});
const price=p=>p.price_cents>0?LKR(p.price_cents):'Ask for price';
const WA_DEFAULT='94717505506';
const ST={in:'',order:'Made to order',out:'Sold out'};
const PH='<svg class="sp-ph" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M24 6l14 18-14 18L10 24z"/><path d="M24 14l7 10-7 10-7-10z"/><circle cx="24" cy="24" r="2.2"/></svg>';
let items=[],q='',sort='new',cat='';

const fromAdmin=x=>({id:'a-'+x.id,title:String(x.title||''),description:String(x.desc||''),price_cents:Math.round((+x.price||0)*100),
  image_url:(x.imgs||[])[0]||'',imgs:(x.imgs||[]).slice(0,3),by:'HIRIKETIYO',cat:String(x.cat||''),status:ST[x.status]!==undefined?x.status:'in',src:'admin'});
const fromListing=l=>({id:'l-'+l.id,title:l.title,description:l.description||'',price_cents:l.price_cents,image_url:l.image_url||'',imgs:l.image_url?[l.image_url]:[],
  by:(l.partners&&l.partners.name)||'HIRIKETIYO',cat:'',status:'in',src:'listing',raw:l});
const safe=p=>{try{return Promise.resolve(p).catch(()=>null)}catch(e){return Promise.resolve(null)}};

/* one shared load: the shop grid and the product line strip both use it */
window.hkProducts=new Promise(res=>{
  const sb=window.hkSb;if(!sb){res([]);return}
  const a=safe(sb.from('site_theme').select('key,value').in('key',['shop','payment']));
  const b=safe(sb.from('listings').select('id,title,description,price_cents,image_url,kind,partners(name)').eq('kind','product').order('created_at',{ascending:false}).limit(60));
  Promise.all([a,b]).then(([t,l])=>{
    const rows=(t&&t.data)||[],get=k=>(rows.find(r=>r.key===k)||{}).value;
    const sh=get('shop'),pay=get('payment')||{},M=pay.methods||{};
    const own=((sh&&sh.items)||[]).filter(x=>x&&x.show!==false&&x.title).map(fromAdmin);
    const part=((l&&l.data)||[]).map(fromListing);
    const wa=String(pay.wa||'').replace(/\D/g,'');
    window.hkPay={wa:wa.length>=9?wa:WA_DEFAULT,info:String(pay.info||''),
      methods:[['whatsapp','Order on WhatsApp'],['bank','Bank transfer'],['cod','Pay on delivery or pickup'],['other','']]
        .map(([k,d])=>({k,on:M[k]?!!M[k].on:k==='whatsapp',label:String((M[k]&&M[k].label)||d),note:String((M[k]&&M[k].note)||'')}))
        .filter(m=>m.on&&m.label)};
    res(own.concat(part));
  }).catch(()=>res([]));
});

if(!app)return;
const empty=app.querySelector('.empty');
const bar=document.createElement('div');bar.className='shop-bar';bar.hidden=true;
bar.innerHTML='<input type="search" id="shop-q" placeholder="Search products" aria-label="Search products" maxlength="60" autocomplete="off">'+
  '<select id="shop-k" aria-label="Category" hidden><option value="">All categories</option></select>'+
  '<select id="shop-s" aria-label="Sort products"><option value="new">Our order</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option><option value="az">Name: A to Z</option></select>'+
  '<span class="shop-n" id="shop-c" aria-live="polite"></span>';
const grid=document.createElement('ul');grid.className='shop-grid';
const none=document.createElement('p');none.className='mut c';none.hidden=true;none.textContent='No products match your search.';
const trust=document.createElement('p');trust.className='note shop-note';trust.hidden=true;
app.append(bar,grid,none,trust);

const card=p=>`<li><button type="button" class="sp${p.status==='out'?' out':''}" data-id="${esc(p.id)}"><span class="sp-im">${p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.title)}" loading="lazy" decoding="async">`:PH}${ST[p.status]?`<span class="sp-tag">${ST[p.status]}</span>`:''}</span>`+
  `<span class="sp-b"><span class="sp-by">${esc(p.cat||p.by)}</span><span class="sp-t">${esc(p.title)}</span><span class="sp-pr">${price(p)}</span><span class="sp-v">View details</span></span></button></li>`;

function view(){
  const k=q.trim().toLowerCase();
  const r=items.filter(p=>(!cat||p.cat===cat)&&(!k||(p.title+' '+p.description+' '+p.by+' '+p.cat).toLowerCase().includes(k)));
  if(sort==='lo')r.sort((a,b)=>a.price_cents-b.price_cents);
  else if(sort==='hi')r.sort((a,b)=>b.price_cents-a.price_cents);
  else if(sort==='az')r.sort((a,b)=>a.title.localeCompare(b.title));
  grid.innerHTML=r.map(card).join('');
  none.hidden=!(items.length&&!r.length);
  document.getElementById('shop-c').textContent=r.length+(r.length===1?' product':' products');
}

/* product detail dialog */
const dlg=document.createElement('dialog');dlg.id='pd';dlg.setAttribute('aria-labelledby','pd-t');document.body.append(dlg);
function open(id){
  const p=items.find(x=>x.id===String(id));if(!p)return;
  const adm=p.src==='admin',out=p.status==='out',pay=window.hkPay||{wa:WA_DEFAULT,info:'',methods:[]};
  const im=p.imgs.length?p.imgs:[''];
  const thumbs=im.length>1?'<div class="pd-th">'+im.map((u,i)=>`<button type="button" data-i="${i}" aria-label="Photo ${i+1}"${i?'':' aria-current="true"'}><img src="${esc(u)}" alt="" loading="lazy"></button>`).join('')+'</div>':'';
  let h='<button type="button" class="pd-x" aria-label="Close">\u2715</button><div class="pd-g"><div class="pd-im"><div class="pd-main">'+(im[0]?`<img src="${esc(im[0])}" alt="${esc(p.title)}" decoding="async">`:PH)+'</div>'+thumbs+'</div><div class="pd-tx">'+
    `<p class="pd-by">${esc(p.cat||p.by)}</p><h3 id="pd-t">${esc(p.title)}</h3><p class="pd-pr">${price(p)}${ST[p.status]?` <span class="pd-badge">${ST[p.status]}</span>`:''}</p>`+
    (p.description?`<p class="pd-ds">${esc(p.description)}</p>`:'');
  if(adm&&!out){
    h+='<div class="pd-ord"><label>Quantity<input type="number" id="pd-q" min="1" max="20" value="1" inputmode="numeric"></label>'+
      (pay.methods.length?`<label>How would you like to pay?<select id="pd-m">${pay.methods.map(m=>`<option>${esc(m.label)}</option>`).join('')}</select></label>`:'')+
      (p.price_cents>0?'<p class="pd-tot">Total: <b id="pd-t2"></b></p>':'')+'</div>';
  }
  if(adm&&pay.methods.length){
    h+='<ul class="pd-pay">'+pay.methods.map(m=>`<li><b>${esc(m.label)}</b>${m.note?`<span>${esc(m.note)}</span>`:''}</li>`).join('')+'</ul>';
  }
  if(adm&&pay.info)h+=`<p class="note">${esc(pay.info)}</p>`;
  if(!adm)h+='<p class="note">Service fee and total are shown at checkout.</p>';
  h+='<div class="pd-act">'+(out?'<button type="button" class="btn" disabled>Sold out</button>':adm?'<button type="button" class="btn pd-buy" data-order="1">'+(pay.methods.some(m=>m.k==='whatsapp')||!pay.methods.length?'Order on WhatsApp':'Send order by email')+'</button>':`<button type="button" class="btn pd-buy" data-buy="${esc(p.id)}">Buy now</button>`)+
    `<a class="btn" href="https://wa.me/${pay.wa}?text=${encodeURIComponent('Hi HIRIKETIYO, I have a question about: '+p.title)}" target="_blank" rel="noopener">Ask a question</a></div></div></div>`;
  dlg.innerHTML=h;dlg.dataset.id=p.id;
  const qe=dlg.querySelector('#pd-q'),me=dlg.querySelector('#pd-m'),te=dlg.querySelector('#pd-t2');
  const qty=()=>Math.min(20,Math.max(1,parseInt(qe&&qe.value,10)||1));
  const upd=()=>{if(te)te.textContent=LKR(p.price_cents*qty())};upd();
  if(qe)qe.addEventListener('input',upd);
  dlg._order=()=>{
    const n=qty(),lines=['Hi HIRIKETIYO, I would like to order:',n+' x '+p.title+(p.price_cents>0?' ('+LKR(p.price_cents)+' each)':'')];
    if(p.price_cents>0)lines.push('Total: '+LKR(p.price_cents*n));
    if(me)lines.push('Payment: '+me.value);
    lines.push('','My name and delivery details:');
    const t=lines.join('\n');
    if(pay.methods.some(m=>m.k==='whatsapp')||!pay.methods.length)window.open('https://wa.me/'+pay.wa+'?text='+encodeURIComponent(t),'_blank','noopener');
    else location.href='mailto:hiriketiyo@gmail.com?subject='+encodeURIComponent('Order: '+p.title)+'&body='+encodeURIComponent(t);
  };
  dlg.showModal();
}
dlg.addEventListener('click',e=>{
  if(e.target===dlg||e.target.closest('.pd-x')){dlg.close();return}
  const t=e.target.closest('.pd-th button');
  if(t){const p=items.find(x=>x.id===dlg.dataset.id);if(!p)return;
    dlg.querySelector('.pd-main').innerHTML=`<img src="${esc(p.imgs[+t.dataset.i])}" alt="${esc(p.title)}" decoding="async">`;
    dlg.querySelectorAll('.pd-th button').forEach(b=>b.removeAttribute('aria-current'));t.setAttribute('aria-current','true');return}
  if(e.target.closest('[data-order]')){dlg._order&&dlg._order();return}
  const b=e.target.closest('[data-buy]');if(!b)return;
  const p=items.find(x=>x.id===b.dataset.buy);dlg.close();
  if(p&&p.raw&&window.hkCheckout)window.hkCheckout(p.raw);
});
grid.addEventListener('click',e=>{const b=e.target.closest('.sp');if(b)open(b.dataset.id)});
bar.addEventListener('input',e=>{if(e.target.id==='shop-q'){q=e.target.value;view()}});
bar.addEventListener('change',e=>{if(e.target.id==='shop-s'){sort=e.target.value;view()}if(e.target.id==='shop-k'){cat=e.target.value;view()}});
window.hkShop={open};

window.hkProducts.then(list=>{
  items=list;if(!items.length)return;
  if(empty)empty.hidden=true;bar.hidden=false;
  const cs=[...new Set(items.map(p=>p.cat).filter(Boolean))];
  if(cs.length){const k=document.getElementById('shop-k');k.hidden=false;cs.forEach(c=>k.append(new Option(c,c)))}
  const pay=window.hkPay;
  trust.textContent=items.some(p=>p.src==='admin')&&pay&&pay.methods.length?'Payment options: '+pay.methods.map(m=>m.label).join(', ')+'. Open a product to see how to order.':'Secure checkout. The service fee and your total are shown before you pay.';
  trust.hidden=false;view();
});
})();
