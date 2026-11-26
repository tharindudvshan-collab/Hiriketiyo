/* HIRIKETIYO content map.
   ONE source of truth for every editable text / link / on-off switch on the site.
   Loaded by index.html (before data.js) and by admin.html.
   To make a new thing editable, add one line below. No other file needs to change.

   Field:  k = unique key   l = label in the admin   s = CSS selector on index.html
           t = text (one line) | long (paragraph) | attr (an attribute, see a) | addr (name + address lines) | show (on/off)
   Saved format (Supabase site_theme, key "content"):  { t:{key:"new text"}, h:{key:true = hidden}, css:"custom css" }  */
(()=>{
const F=[];
const add=(g,o)=>F.push(Object.assign({g,t:'text'},o));

/* ---------- Site & search engines ---------- */
const G0='Site & Google';
add(G0,{k:'seo.title',l:'Browser tab / Google title',s:'title'});
add(G0,{k:'seo.desc',l:'Google description',s:'meta[name="description"]',t:'attr',a:'content'});
add(G0,{k:'seo.ogt',l:'Share title (WhatsApp, Facebook)',s:'meta[property="og:title"]',t:'attr',a:'content'});
add(G0,{k:'seo.ogd',l:'Share description',s:'meta[property="og:description"]',t:'attr',a:'content'});
add(G0,{k:'seo.tc',l:'Phone browser bar color',s:'meta[name="theme-color"]',t:'attr',a:'content'});

/* ---------- Top bar & menus ---------- */
const G1='Top bar & menus';
const NAV=[['home','Home'],['discover','Discover'],['surf','Surf & Experiences'],['stay','Stay & Eat'],['transport','Transport'],['shop','Shop']];
NAV.forEach(([h,l])=>add(G1,{k:'nav.'+h,l:'Top bar: '+l,s:`.nl a[href="#${h}"]:not(.cta) .rl i`}));
add(G1,{k:'nav.cta',l:'Top bar button (and mobile menu button)',s:'.nl a.cta .rl i,.mobnav a.cta'});
add(G1,{k:'nav.ctaH',l:'Top bar button: link',s:'.nl a.cta,.mobnav a.cta',t:'attr',a:'href'});
NAV.forEach(([h,l])=>add(G1,{k:'mob.'+h,l:'Phone menu: '+l,s:`.mobnav a[href="#${h}"]:not(.cta)`}));

/* ---------- Home ---------- */
const G2='Home: Hero (top of page)';
add(G2,{k:'hero.cap',l:'Line under the logo',s:'.hero .cap'});
add(G2,{k:'hero.b1',l:'Main button',s:'.hero a.box:not(.s)'});
add(G2,{k:'hero.b1h',l:'Main button: link',s:'.hero a.box:not(.s)',t:'attr',a:'href'});
add(G2,{k:'hero.b2',l:'Second button',s:'.hero a.box.s'});
add(G2,{k:'hero.b2h',l:'Second button: link',s:'.hero a.box.s',t:'attr',a:'href'});

const G3='Home: Welcome';
add(G3,{k:'intro.cap',l:'Small heading',s:'#home>section:nth-of-type(1) .cap'});
add(G3,{k:'intro.h',l:'Heading',s:'#home>section:nth-of-type(1) h2'});
add(G3,{k:'intro.p',l:'Text',s:'#home>section:nth-of-type(1) .in>p',t:'long'});
for(let i=1;i<=4;i++){
  add(G3,{k:'fact'+i+'l',l:'Fact '+i+': title',s:`#home .facts>div:nth-child(${i}) b`});
  add(G3,{k:'fact'+i+'v',l:'Fact '+i+': value',s:`#home .facts>div:nth-child(${i}) span`});
}
for(let i=1;i<=6;i++)add(G3,{k:'cat'+i,l:'Quick link '+i,s:`#home .cats a:nth-child(${i})`});
add(G3,{k:'show.intro',l:'Show the Welcome section',s:'#home>section:nth-of-type(1)',t:'show'});

const G4='Home: The brand';
add(G4,{k:'brand.cap',l:'Small heading',s:'#home>section:nth-of-type(2) .cap'});
add(G4,{k:'brand.h',l:'Heading',s:'#home>section:nth-of-type(2) h2'});
add(G4,{k:'brand.p',l:'Text',s:'#home>section:nth-of-type(2) p',t:'long'});
add(G4,{k:'brand.b',l:'Button',s:'#home>section:nth-of-type(2) a.btn'});
add(G4,{k:'brand.bh',l:'Button: link',s:'#home>section:nth-of-type(2) a.btn',t:'attr',a:'href'});
add(G4,{k:'show.brand',l:'Show the brand section',s:'#home>section:nth-of-type(2)',t:'show'});

const G5='Home: About';
add(G5,{k:'about.h',l:'Heading',s:'#home>section:nth-of-type(3) h2'});
add(G5,{k:'about.p1',l:'Paragraph 1',s:'#home>section:nth-of-type(3) p:nth-of-type(1)',t:'long'});
add(G5,{k:'about.p2',l:'Paragraph 2',s:'#home>section:nth-of-type(3) p:nth-of-type(2)',t:'long'});
add(G5,{k:'about.b',l:'Button',s:'#home>section:nth-of-type(3) a.btn'});
add(G5,{k:'about.bh',l:'Button: link',s:'#home>section:nth-of-type(3) a.btn',t:'attr',a:'href'});
add(G5,{k:'show.about',l:'Show the About section',s:'#home>section:nth-of-type(3)',t:'show'});

const G6='Home: Service catalog';
add(G6,{k:'cat.cap',l:'Small heading',s:'#catalog .in>.cap'});
add(G6,{k:'cat.h',l:'Heading',s:'#catalog h2'});
add(G6,{k:'cat.p',l:'Intro text',s:'#catalog .in>p.mut',t:'long'});
[['all','All'],['surf','Surf'],['stay','Stay & Eat'],['ride','Transport'],['exp','Experiences'],['shop','Shop']].forEach(([k,l])=>
  add(G6,{k:'flt.'+k,l:'Filter button: '+l,s:`.cat-filter button[data-k="${k}"]`}));
[['surf','Surf lessons'],['stay','Places to stay'],['food','Food & drink'],['ride','Tuk-tuk & transfers'],['exp','Local experiences'],['shop','Shop']].forEach(([id,l],n)=>{
  const q=`.svc-grid>.svc:nth-of-type(${n+1})`,p='Card '+(n+1)+' ('+l+'): ';
  add(G6,{k:'svc'+(n+1)+'t',l:p+'tag',s:q+' .tg'});
  add(G6,{k:'svc'+(n+1)+'h',l:p+'title',s:q+' h3'});
  add(G6,{k:'svc'+(n+1)+'p',l:p+'text',s:q+' p.mut',t:'long'});
  add(G6,{k:'svc'+(n+1)+'b',l:p+'button',s:q+' a.btn'});
  add(G6,{k:'svc'+(n+1)+'bh',l:p+'button link',s:q+' a.btn',t:'attr',a:'href'});
  add(G6,{k:'show.svc'+(n+1),l:'Show card '+(n+1)+' ('+l+')',s:q,t:'show'});
});
add(G6,{k:'cat.note',l:'Small note under the cards',s:'#catalog .note',t:'long'});
add(G6,{k:'show.cat',l:'Show the whole catalog',s:'#catalog',t:'show'});

const G7='Home: Travel responsibly';
add(G7,{k:'resp.h',l:'Heading',s:'#home>section:nth-of-type(5) h2'});
add(G7,{k:'resp.p',l:'Text',s:'#home>section:nth-of-type(5) p:nth-of-type(1)',t:'long'});
add(G7,{k:'resp.n',l:'Small note (fees)',s:'#home>section:nth-of-type(5) .note',t:'long'});
add(G7,{k:'show.resp',l:'Show this section',s:'#home>section:nth-of-type(5)',t:'show'});

/* ---------- Other pages ---------- */
const ph=(id,g)=>{
  add(g,{k:id+'.h',l:'Page title',s:`#${id} .ph h2`});
  add(g,{k:id+'.sub',l:'Sentence under the title',s:`#${id} .ph p`});
};
const G8='Page: Discover';ph('discover',G8);
add(G8,{k:'disc.note',l:'Notice box',s:'#discover .note',t:'long'});
add(G8,{k:'disc.h',l:'Planner heading',s:'#discover h3'});
[1,2,3,4].forEach(i=>add(G8,{k:'chip'+i,l:'Planner option '+i,s:`#chips label:nth-child(${i})`}));
add(G8,{k:'show.disc.note',l:'Show the notice box',s:'#discover .note',t:'show'});

const G9='Page: Surf & Experiences';ph('surf',G9);
add(G9,{k:'surf.lh',l:'Listings heading',s:'#surf .split>div:nth-child(1)>h3'});
add(G9,{k:'surf.empty',l:'Message when no listings yet',s:'#surf .card.empty p',t:'long'});
add(G9,{k:'surf.fh',l:'Booking form heading',s:'#surf .split>div:nth-child(2)>h3'});
add(G9,{k:'surf.fb',l:'Booking form button',s:'#surf form[data-kind="Booking request"] button'});
add(G9,{k:'surf.ph',l:'Partner heading',s:'#partner h3'});
add(G9,{k:'surf.pb',l:'Partner form button',s:'#partner button'});
add(G9,{k:'show.surf.form',l:'Show the booking form',s:'#surf .split>div:nth-child(2)',t:'show'});
add(G9,{k:'show.partner',l:'Show the partner application',s:'#partner',t:'show'});

const G10='Page: Stay & Eat';ph('stay',G10);
add(G10,{k:'stay.h1',l:'Heading: places to stay',s:'#stay .in>h3:nth-of-type(1)'});
add(G10,{k:'stay.e1',l:'Message: no stays yet',s:'#stay .live:nth-of-type(1) .empty p',t:'long'});
add(G10,{k:'stay.h2',l:'Heading: food & drink',s:'#stay .in>h3:nth-of-type(2)'});
add(G10,{k:'stay.e2',l:'Message: no venues yet',s:'#stay .live:nth-of-type(2) .empty p',t:'long'});
add(G10,{k:'stay.n',l:'Fee note',s:'#stay .note',t:'long'});

const G11='Page: Transport';ph('transport',G11);
add(G11,{k:'tr.b',l:'Quote form button',s:'#transport form button'});
add(G11,{k:'tr.n',l:'Note under the form',s:'#transport .note:not(.msg)',t:'long'});
add(G11,{k:'show.tr.form',l:'Show the quote form',s:'#transport form',t:'show'});

const G12='Page: Shop';ph('shop',G12);
add(G12,{k:'shop.h',l:'Empty shop heading',s:'#shop .empty h3'});
add(G12,{k:'shop.p',l:'Empty shop text',s:'#shop .empty p',t:'long'});

/* ---------- Footer ---------- */
const G13='Footer';
add(G13,{k:'ft.tag',l:'Tagline under the logo',s:'.ftag',t:'long'});
add(G13,{k:'ft.h1',l:'Column 1 heading',s:'footer nav h4'});
add(G13,{k:'ft.h2',l:'Column 2 heading',s:'footer address h4'});
add(G13,{k:'ft.addr',l:'Business name + address (one line each)',s:'footer address p',t:'addr'});
[['em','Email'],['ph','Phone'],['web','Website'],['fb','Facebook']].forEach(([id,l],i)=>{
  const q=`footer address a:nth-of-type(${i+1})`;
  add(G13,{k:'ft.'+id,l:l+': text shown',s:q});
  add(G13,{k:'ft.'+id+'h',l:l+': link',s:q,t:'attr',a:'href'});
});
add(G13,{k:'ft.h3',l:'Column 3 heading',s:'footer .ft>div:last-child h4'});
add(G13,{k:'ft.pl',l:'Partner link',s:'footer .ft>div:last-child a:not(.fcta)'});
add(G13,{k:'ft.cta',l:'Footer button',s:'footer .fcta'});
add(G13,{k:'ft.ctah',l:'Footer button: link',s:'footer .fcta',t:'attr',a:'href'});
add(G13,{k:'ft.c',l:'Copyright line',s:'.fbar span'});
add(G13,{k:'ft.top',l:'Back to top link',s:'.fbar a'});
add(G13,{k:'show.ft.work',l:'Show the "Work with us" column',s:'footer .ft>div:last-child',t:'show'});

/* ---------- helpers ---------- */
const safeHref=v=>{v=String(v).trim();if(/[\u0000-\u001f\u007f]/.test(v))return false;
  return /^(https?:|mailto:|tel:)/i.test(v)||!/^[a-z][a-z0-9+.\-]*:/i.test(v)};
/* the text node that holds the visible words (so child icons / inputs / arrows survive) */
const tnode=el=>{if(!el.children.length)return el;
  for(const n of el.childNodes)if(n.nodeType===3&&n.nodeValue.trim())return n;return null};
const getText=el=>{const n=tnode(el);return n?(n===el?el.textContent:n.nodeValue).trim():''};
const addrLines=el=>{const out=[];el.childNodes.forEach(n=>{const t=n.textContent.trim();if(t&&n.nodeName!=='BR')out.push(t)});return out};

function extract(doc){const o={};
  F.forEach(f=>{const el=doc.querySelector(f.s);
    if(f.t==='show'){o[f.k]=true;return}
    if(!el){o[f.k]=null;return}
    o[f.k]=f.t==='attr'?(el.getAttribute(f.a)||''):f.t==='addr'?addrLines(el).join('\n'):getText(el)});
  return o}

function put(el,f,v){           /* v === undefined -> put the original back */
  if(f.t==='attr'){
    if(el.__oa===undefined)el.__oa={};
    if(!(f.a in el.__oa))el.__oa[f.a]=el.getAttribute(f.a);
    const nv=v===undefined?el.__oa[f.a]:v;
    if(nv==null)return;if(f.a==='href'&&!safeHref(nv))return;
    el.setAttribute(f.a,nv);return}
  if(f.t==='addr'){
    if(el.__oh===undefined)el.__oh=el.innerHTML;
    if(v===undefined){el.innerHTML=el.__oh;return}
    const L=String(v).split('\n').map(s=>s.trim()).filter(Boolean);if(!L.length)return;
    el.textContent='';const b=document.createElement('b');b.textContent=L[0];el.append(b);
    L.slice(1).forEach(s=>{el.append(document.createElement('br'),document.createTextNode(s))});return}
  const n=tnode(el);if(!n)return;
  if(el.__o===undefined)el.__o=n===el?el.textContent:n.nodeValue;
  const o=el.__o,nv=v===undefined?o:String(v);
  if(n===el)el.textContent=nv;
  else{const m=o.match(/^(\s*)[\s\S]*?(\s*)$/);n.nodeValue=v===undefined?o:m[1]+nv+m[2]}
  if(el.tagName==='I'&&el.parentElement&&el.parentElement.classList.contains('rl')){   /* top bar: keep the accessible name in sync */
    const a=el.closest('a');if(a){if(a.__al===undefined)a.__al=a.getAttribute('aria-label');
      v===undefined?(a.__al==null?a.removeAttribute('aria-label'):a.setAttribute('aria-label',a.__al)):a.setAttribute('aria-label',nv)}}
}

function sheet(id,css){let s=document.getElementById(id);
  if(!css){if(s)s.remove();return}
  if(!s){s=document.createElement('style');s.id=id;document.head.append(s)}
  if(s.textContent!==css)s.textContent=css}

function apply(c){c=c||{};const T=c.t||{},H=c.h||{};
  F.forEach(f=>{if(f.t==='show')return;
    const els=document.querySelectorAll(f.s);if(!els.length)return;
    const v=Object.prototype.hasOwnProperty.call(T,f.k)&&String(T[f.k]).trim()!==''?T[f.k]:undefined;
    els.forEach(el=>{try{put(el,f,v)}catch(e){}})});
  sheet('hk-hide',F.filter(f=>f.t==='show'&&H[f.k]).map(f=>f.s+'{display:none!important}').join('\n'));
  sheet('hk-css',typeof c.css==='string'?c.css.slice(0,20000):'');
}

window.HK={fields:F,extract,apply,safeHref};
})();
