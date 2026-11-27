/* HIRIKETIYO shop (Shopping page #shop). Loads the approved products from the Supabase `listings` table (kind = 'product'),
   shows them as a searchable, sortable grid with a product detail dialog, and hands "Buy now" to the existing checkout in data.js
   (window.hkCheckout). The same list feeds the product line strip (window.hkProducts). Nothing is invented: only real listings
   are shown; with none, the original "Collection coming soon" card stays. Loads after data.js, before productline.js. */
(()=>{
const app=document.getElementById('shop-app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LKR=c=>'LKR '+(c/100).toLocaleString('en-LK',{minimumFractionDigits:2});
const WA='94717505506';
const PH='<svg class="sp-ph" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M24 6l14 18-14 18L10 24z"/><path d="M24 14l7 10-7 10-7-10z"/><circle cx="24" cy="24" r="2.2"/></svg>';
let items=[],q='',sort='new';

/* one shared load: the shop grid and the product line strip both use it */
window.hkProducts=new Promise(res=>{
  try{const sb=window.hkSb;if(!sb){res([]);return}
    sb.from('listings').select('id,title,description,price_cents,image_url,kind,partners(name)').eq('kind','product').order('created_at',{ascending:false}).limit(60)
      .then(({data})=>res(data||[]),()=>res([]))}
  catch(e){res([])}
});

if(!app)return;
const empty=app.querySelector('.empty');
const bar=document.createElement('div');bar.className='shop-bar';bar.hidden=true;
bar.innerHTML='<input type="search" id="shop-q" placeholder="Search products" aria-label="Search products" maxlength="60" autocomplete="off">'+
  '<select id="shop-s" aria-label="Sort products"><option value="new">Newest first</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option><option value="az">Name: A to Z</option></select>'+
  '<span class="shop-n" id="shop-c" aria-live="polite"></span>';
const grid=document.createElement('ul');grid.className='shop-grid';
const none=document.createElement('p');none.className='mut c';none.hidden=true;none.textContent='No products match your search.';
const trust=document.createElement('p');trust.className='note shop-note';trust.hidden=true;
trust.textContent='Secure checkout. The service fee and your total are shown before you pay. Questions? Ask us on WhatsApp.';
app.append(bar,grid,none,trust);

const card=p=>`<li><button type="button" class="sp" data-id="${esc(p.id)}"><span class="sp-im">${p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.title)}" loading="lazy" decoding="async">`:PH}</span>`+
  `<span class="sp-b"><span class="sp-by">${esc(p.partners?.name||'HIRIKETIYO')}</span><span class="sp-t">${esc(p.title)}</span><span class="sp-pr">${LKR(p.price_cents)}</span><span class="sp-v">View details</span></span></button></li>`;

function view(){
  const k=q.trim().toLowerCase();
  const r=items.filter(p=>!k||(p.title+' '+(p.description||'')+' '+(p.partners?.name||'')).toLowerCase().includes(k));
  if(sort==='lo')r.sort((a,b)=>a.price_cents-b.price_cents);
  else if(sort==='hi')r.sort((a,b)=>b.price_cents-a.price_cents);
  else if(sort==='az')r.sort((a,b)=>String(a.title).localeCompare(String(b.title)));
  grid.innerHTML=r.map(card).join('');
  none.hidden=!(items.length&&!r.length);
  document.getElementById('shop-c').textContent=r.length+(r.length===1?' product':' products');
}

/* product detail dialog */
const dlg=document.createElement('dialog');dlg.id='pd';dlg.setAttribute('aria-labelledby','pd-t');document.body.append(dlg);
function open(id){
  const p=items.find(x=>String(x.id)===String(id));if(!p)return;
  const msg='Hi HIRIKETIYO, I have a question about: '+p.title+' ('+LKR(p.price_cents)+')';
  dlg.innerHTML='<button type="button" class="pd-x" aria-label="Close">\u2715</button><div class="pd-g"><div class="pd-im">'+
    (p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.title)}" decoding="async">`:PH)+'</div><div class="pd-tx">'+
    `<p class="pd-by">${esc(p.partners?.name||'HIRIKETIYO')}</p><h3 id="pd-t">${esc(p.title)}</h3><p class="pd-pr">${LKR(p.price_cents)}</p>`+
    (p.description?`<p class="pd-ds">${esc(p.description)}</p>`:'')+
    '<p class="note">Service fee and total are shown at checkout.</p>'+
    `<div class="pd-act"><button type="button" class="btn pd-buy" data-buy="${esc(p.id)}">Buy now</button><a class="btn" href="https://wa.me/${WA}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">Ask on WhatsApp</a></div></div></div>`;
  dlg.showModal();
}
dlg.addEventListener('click',e=>{
  if(e.target===dlg||e.target.closest('.pd-x')){dlg.close();return}
  const b=e.target.closest('[data-buy]');if(!b)return;
  const p=items.find(x=>String(x.id)===b.dataset.buy);dlg.close();
  if(p&&window.hkCheckout)window.hkCheckout(p);
});
grid.addEventListener('click',e=>{const b=e.target.closest('.sp');if(b)open(b.dataset.id)});
bar.addEventListener('input',e=>{if(e.target.id==='shop-q'){q=e.target.value;view()}});
bar.addEventListener('change',e=>{if(e.target.id==='shop-s'){sort=e.target.value;view()}});
window.hkShop={open};

window.hkProducts.then(list=>{
  items=list;if(!items.length)return;
  if(empty)empty.hidden=true;bar.hidden=false;trust.hidden=false;view();
});
})();
