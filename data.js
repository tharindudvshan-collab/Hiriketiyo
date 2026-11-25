/* HIRIKETIYO live data layer (Supabase + PayHere). Loaded after app.js.
   Until the two values below are filled, the site stays fully static and forms show the old "not sent" notice. */
(()=>{
const SUPABASE_URL="https://YOUR-PROJECT-REF.supabase.co";
const SUPABASE_ANON_KEY="YOUR-ANON-KEY";   // public key; RLS protects the data. Never put service_role here.
if(!window.supabase||SUPABASE_URL.includes("YOUR-"))return;

const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const LKR=c=>"LKR "+(c/100).toLocaleString("en-LK",{minimumFractionDigits:2});
let feeBps=200;

/* payment return banner (PayHere sends the customer back to #paid or #cancelled) */
function banner(){const b=$("#banner"),h=location.hash;if(!b)return;
  if(h==="#paid"||h==="#cancelled"){b.className="on "+(h==="#paid"?"ok":"no");
    b.textContent=h==="#paid"?"Payment received. Thank you! A confirmation will be emailed to you.":"Payment was cancelled. You have not been charged.";}
  else b.className="";}
addEventListener("hashchange",banner);banner();

/* image CMS: any <img data-slot="..."> is replaced by the image uploaded in admin.html */
function applyImages(rows){rows.forEach(r=>{if(!r.url)return;const src=r.url+"?v="+encodeURIComponent(r.updated_at);
  $$(`img[data-slot="${CSS.escape(r.slot)}"]`).forEach(el=>{
    const pic=el.closest("picture");if(pic)$$("source",pic).forEach(s=>s.remove());
    el.removeAttribute("srcset");el.removeAttribute("sizes");el.src=src;if(r.alt)el.alt=r.alt;
    if(r.focal_x!==50||r.focal_y!==50)el.style.objectPosition=r.focal_x+"% "+r.focal_y+"%";});});}
try{applyImages(JSON.parse(localStorage.getItem("hk_img")||"[]"))}catch(e){}
sb.from("site_images").select("slot,url,alt,focal_x,focal_y,updated_at").not("url","is",null).then(({data})=>{
  if(data){applyImages(data);try{localStorage.setItem("hk_img",JSON.stringify(data))}catch(e){}}});

sb.from("platform_settings").select("customer_fee_bps").single().then(({data})=>{if(data)feeBps=data.customer_fee_bps});

/* listings -> every .live container ( data-types="surf,experience" | data-kind="product" ) */
function card(l){const d=document.createElement("article");d.className="card lcard";
  d.innerHTML=(l.image_url?`<img class="lim" src="${esc(l.image_url)}" alt="${esc(l.title)}" loading="lazy" decoding="async">`:"")+
    `<h3>${esc(l.title)}</h3><p class="mut">${esc(l.partners?.name||"HIRIKETIYO")}</p><p>${esc(l.description)}</p>`+
    `<p class="lp"><b>${LKR(l.price_cents)}</b> <span class="mut">+ ${feeBps/100}% service fee</span></p>`+
    `<button type="button" class="btn">${l.kind==="product"?"Buy now":"Book now"}</button>`;
  $("button",d).onclick=()=>openCheckout(l);return d;}
sb.from("listings").select("id,title,description,price_cents,image_url,kind,partners(name,type)").order("created_at",{ascending:false}).then(({data})=>{
  if(!data)return;
  $$(".live").forEach(box=>{const types=(box.dataset.types||"").split(",").filter(Boolean),kind=box.dataset.kind;
    const rows=data.filter(l=>kind?l.kind===kind:l.partners&&types.includes(l.partners.type));
    if(rows.length)box.replaceChildren(...rows.map(card));});});

/* checkout: server computes price + fee; PayHere form is signed by the Edge Function */
const dlg=$("#co"),cf=$("#coForm");let cur=null;
function recalc(){if(!cur)return;const q=Math.max(1,Math.min(50,+cf.qty.value||1)),sub=cur.price_cents*q,fee=Math.round(sub*feeBps/10000);
  $("#sSub").textContent=LKR(sub);$("#sFeeL").textContent=`Service fee (${feeBps/100}%)`;$("#sFee").textContent=LKR(fee);$("#sTot").textContent=LKR(sub+fee);}
function openCheckout(l){cur=l;$("#coTitle").textContent=l.title;$("#coPartner").textContent=l.partners?.name||"HIRIKETIYO";
  const svc=l.kind==="service";$("#coDateL").hidden=!svc;cf.date.required=svc;cf.date.min=new Date().toISOString().slice(0,10);
  $("#coErr").textContent="";$("#coPay").disabled=false;recalc();dlg.showModal();}
cf.qty.oninput=recalc;$("#coX").onclick=()=>dlg.close();
cf.onsubmit=async e=>{e.preventDefault();const b=$("#coPay");b.disabled=true;$("#coErr").textContent="";
  const{data,error}=await sb.functions.invoke("create-checkout",{body:{listing_id:cur.id,quantity:+cf.qty.value,email:cf.email.value.trim(),name:cf.name.value.trim(),
    phone:cf.phone.value.trim(),service_date:cf.date.value||null,guests:cur.kind==="service"?+cf.qty.value:null,notes:cf.notes.value.trim()||null}});
  if(error||data?.error){$("#coErr").textContent=data?.error||"Checkout failed. Please try again.";b.disabled=false;return}
  const f=document.createElement("form");f.method="POST";f.action=data.action;
  Object.entries(data.fields).forEach(([k,v])=>{const i=document.createElement("input");i.type="hidden";i.name=k;i.value=v;f.append(i)});
  document.body.append(f);f.submit();};

/* existing forms become live (app.js skips any form with data-live) */
const ENQ={"Ride request":"transport_quote","Booking request":"booking_request"};
$$("form[data-kind]").forEach(f=>{f.dataset.live="1";
  f.addEventListener("submit",async e=>{e.preventDefault();const m=$(".msg",f),b=$("button",f),p=Object.fromEntries(new FormData(f));b.disabled=true;
    let error;
    if(f.dataset.kind==="Partner application")({error}=await sb.rpc("apply_as_partner",{p_name:p.name,p_type:p.type,p_email:p.email,p_phone:p.phone||null}));
    else({error}=await sb.rpc("submit_enquiry",{p_kind:ENQ[f.dataset.kind],p_email:p.email,p_payload:p}));
    b.disabled=false;m.classList.add("show");
    m.textContent=error?"Could not send. Please check your details and try again.":(f.dataset.kind==="Partner application"?"Application received. We will contact you after review.":"Request sent. You will get a reply by email.");
    if(!error)f.reset();});});
})();
