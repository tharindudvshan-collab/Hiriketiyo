/* HIRIKETIYO live data layer (Supabase + PayHere). Loaded after app.js.
   Until the two values below are filled, the site stays fully static and forms show the old "not sent" notice. */
(()=>{
const SUPABASE_URL="https://ojitwdejlhbvlnmsbwyy.supabase.co";
const SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qaXR3ZGVqbGhidmxubXNid3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU2MDM5NDksImV4cCI6MjExMTE3OTk0OX0.H1rISXmhlAXKB8OLkfYVb7JTTRLJ9TcxKih99FwPqZk";   // public key; RLS protects the data. Never put service_role here.
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

/* ---- logo + colour theme (set in admin.html > Logo / Colors) ---- */
const isDark=()=>{const t=document.documentElement.dataset.theme;return t?t==="dark":matchMedia("(prefers-color-scheme:dark)").matches};
let logoRows={};
function applyLogos(rows){if(rows)rows.forEach(r=>{if(/^logo-/.test(r.slot)&&r.url)logoRows[r.slot]=r.url+"?v="+encodeURIComponent(r.updated_at)});
  $$("img.nlogo,img.wmk").forEach(el=>{
    const o=el.dataset.o||(el.dataset.o=el.getAttribute("src")||"");
    const kind=/emblem/.test(o)?"emblem":/wordmark/.test(o)?"wordmark":null;if(!kind)return;
    const dark=el.closest("header")?isDark():/white/.test(o);   /* header follows the theme; other places keep their original contrast */
    const want="logo-"+kind+(dark?"-dark":"-light"),alt="logo-"+kind+(dark?"-light":"-dark"),u=logoRows[want]||logoRows[alt];
    if(u){if(el.getAttribute("src")!==u)el.src=u;el.dataset.custom="1"}});}
matchMedia("(prefers-color-scheme:dark)").addEventListener("change",()=>applyLogos());

const _s=(d,w)=>`<path d="${d}" fill="none" stroke="#000" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const PATSVG={dots:'<circle cx="20" cy="20" r="2.4"/>',grid:_s("M0 .5H40M.5 0V40",1),lines:_s("M0 40L40 0M-10 10L10 -10M30 50L50 30",1.4),
 waves:_s("M0 20Q10 6 20 20T40 20",1.6),diamonds:_s("M20 5L35 20L20 35L5 20Z",1.2),plus:_s("M20 13V27M13 20H27",1.8),zigzag:_s("M0 28L10 14L20 28L30 14L40 28",1.4),
 bubbles:'<circle cx="14" cy="24" r="9" fill="none" stroke="#000" stroke-width="1.3"/><circle cx="33" cy="9" r="4" fill="none" stroke="#000" stroke-width="1.3"/>'};
const patUrl=n=>PATSVG[n]?`url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">'+PATSVG[n]+'</svg>')}")`:"none";
const HF={"Kaushan Script":"cursive","Pacifico":"cursive","Lobster":"cursive","Caveat":"cursive","Playfair Display":"serif","Cormorant Garamond":"serif","DM Serif Display":"serif","Poppins":"sans-serif","Montserrat":"sans-serif"};
const BF={"Montserrat":["sans-serif","400;500;600"],"Inter":["sans-serif","400;500;600"],"Poppins":["sans-serif","400;500;600"],"Nunito":["sans-serif","400;500;600"],"Open Sans":["sans-serif","400;500;600"],"Lato":["sans-serif","400;700"],"Merriweather":["serif","400;700"]};
const fontHref=(h,b)=>{const f=[];if(h!=="Kaushan Script")f.push("family="+h.replace(/ /g,"+"));if(b!=="Montserrat")f.push("family="+b.replace(/ /g,"+")+":wght@"+BF[b][1]);return f.length?"https://fonts.googleapis.com/css2?"+f.join("&")+"&display=swap":""};

const DD={pattern:"none",pSize:32,pOpacity:8,pColor:"accent",bgType:"solid",angle:160,radius:"orig",shadow:"orig",scale:100,hFont:"Kaushan Script",bFont:"Montserrat",flags:true,kites:true};
function applyTheme(t){if(!t||!t.light||!t.dark)return;
  const d=Object.assign({},DD,t.design||{});
  if(!PATSVG[d.pattern])d.pattern="none";if(!HF[d.hFont])d.hFont=DD.hFont;if(!BF[d.bFont])d.bFont=DD.bFont;
  const col=c=>c[d.pColor]||c.accent;
  const v=c=>`--teal:${c.accent};--gold:${c.gold};--bg:${c.bg};--paper:${c.bg};--card:${c.card};--txt:${c.text};--ink:${c.text};`+
   `--mut:color-mix(in srgb,${c.text} 68%,${c.bg});--line:color-mix(in srgb,${c.text} 16%,${c.bg});--sand:color-mix(in srgb,${c.gold} 16%,${c.bg});--hdr-bg:${c.hbg};--hdr-ink:${c.hink};`+
   `--hk-pc:${col(c)};--hk-bgi:linear-gradient(${+d.angle||160}deg,${c.bg},${c.bg2||c.bg});`;
  const common=`--hk-po:${(+d.pOpacity||8)/100};--hk-ps:${+d.pSize||32}px;--hk-pm:${patUrl(d.pattern)};`+
   (d.hFont!==DD.hFont?`--script:'${d.hFont}',${HF[d.hFont]};`:"")+(d.bFont!==DD.bFont?`--sans:'${d.bFont}',${BF[d.bFont][0]};`:"");
  let css=`:root{${v(t.light)}${common}}@media(prefers-color-scheme:dark){:root:not([data-theme=light]){${v(t.dark)}}}:root[data-theme=dark]{${v(t.dark)}}`;
  if(d.radius!=="orig"){const r=Math.max(0,+d.radius||0);
    css+=`.card,.lcard,.svc,.btn,.box,select,textarea,input:not([type=checkbox]):not([type=radio]),.photo,.lim,#co{border-radius:${r}px!important}.svc,.lcard{overflow:hidden}`}
  if(d.shadow==="none")css+=`.card,.svc,.lcard{box-shadow:none!important}`;
  if(d.shadow==="strong")css+=`.card,.svc,.lcard{box-shadow:0 18px 44px -10px #0000004d!important}`;
  if(+d.scale&&+d.scale!==100)css+=`html{font-size:${+d.scale}%}`;
  if(d.flags===false)css+=`.flagbar{display:none!important}`;
  if(d.kites===false)css+=`.fkites{display:none!important}`;
  let s=$("#hk-theme");if(!s){s=document.createElement("style");s.id="hk-theme";document.head.append(s)}
  s.textContent=css;
  if(!$("#hk-bg")){const a=document.createElement("div");a.id="hk-bg";const b=document.createElement("div");b.id="hk-pat";document.body.prepend(b);document.body.prepend(a)}
  document.documentElement.classList.toggle("hk-pat",d.pattern!=="none");
  document.documentElement.classList.toggle("hk-grad",d.bgType==="gradient");
  const fh=fontHref(d.hFont,d.bFont);let l=$("#hk-fonts");
  if(fh){if(!l){l=document.createElement("link");l.id="hk-fonts";l.rel="stylesheet";document.head.append(l)}if(l.href!==fh)l.href=fh}else if(l)l.remove();}
try{applyTheme(JSON.parse(localStorage.getItem("hk_theme")||"null"))}catch(e){}
sb.from("site_theme").select("value").eq("key","theme").maybeSingle().then(({data})=>{
  if(data&&data.value){applyTheme(data.value);try{localStorage.setItem("hk_theme",JSON.stringify(data.value))}catch(e){}}
  else try{localStorage.removeItem("hk_theme");$("#hk-theme")?.remove();$("#hk-fonts")?.remove();document.documentElement.classList.remove("hk-pat","hk-grad")}catch(e){}});
try{const c=JSON.parse(localStorage.getItem("hk_img")||"[]");applyImages(c);applyLogos(c)}catch(e){}
sb.from("site_images").select("slot,url,alt,focal_x,focal_y,updated_at").not("url","is",null).then(({data})=>{
  if(data){applyImages(data);applyLogos(data);try{localStorage.setItem("hk_img",JSON.stringify(data))}catch(e){}}});

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
