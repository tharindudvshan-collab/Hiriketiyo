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
const NAV=[['discover','01 Discover'],['surf','02 Experiences'],['stay','03 Stay & Eat'],['destinations','04 Destinations'],['shop','05 Shopping'],['services','Explore Services'],['plan','06 Plan Your Trip']];
NAV.forEach(([h,l])=>{
  add(G1,{k:'nav.'+h,l:'Top bar: '+l,s:`.nl a[href="#${h}"] .rl i`});
  add(G1,{k:'nav.'+h+'.tip',l:'Top bar hover text: '+l,s:`#nt-${h} .tx`,t:'long'});
  add(G1,{k:'mob.'+h,l:'Phone menu: '+l,s:`.mobnav a[href="#${h}"] .mt b`});
  add(G1,{k:'mob.'+h+'.s',l:'Phone menu text: '+l,s:`.mobnav a[href="#${h}"] .mt small`,t:'long'});
});
add(G1,{k:'nav.ctaH',l:'Plan Your Trip button: link',s:'.nl a.cta,.mobnav a.cta',t:'attr',a:'href'});

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

const GT='Surf page: Trip planner';
add(GT,{k:'tp.cap',l:'Small heading',s:'#tp .cap'});
add(GT,{k:'tp.h',l:'Heading',s:'#tp h2'});
add(GT,{k:'tp.p',l:'Intro text',s:'#tp .in>p.mut',t:'long'});
add(GT,{k:'show.tp',l:'Show the trip planner',s:'#tp',t:'show'});

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

/* ---------- Discover guide (full article page) ---------- */
add("Discover: Hero & intro",{k:"d.b1",l:"Hero map button",s:"#discover .dhero .dbtn.loc"});
add("Discover: Hero & intro",{k:"d.b1h",l:"Hero map button: link",s:"#discover .dhero .dbtn.loc",t:"attr",a:"href"});
add("Discover: Hero & intro",{k:"d.b2",l:"Hero directions button",s:"#discover .dhero .dbtn.fill"});
add("Discover: Hero & intro",{k:"d.b2h",l:"Hero directions button: link",s:"#discover .dhero .dbtn.fill",t:"attr",a:"href"});
add("Discover: Hero & intro",{k:"d.icap",l:"Intro small heading",s:"#d-intro .dcap"});
add("Discover: Hero & intro",{k:"d.ih",l:"Intro heading",s:"#d-intro h2"});
add("Discover: Hero & intro",{k:"d.ip1",l:"Intro paragraph 1",s:"#d-intro .dlead:nth-of-type(1)",t:"long"});
add("Discover: Hero & intro",{k:"d.ip2",l:"Intro paragraph 2",s:"#d-intro .dlead:nth-of-type(2)",t:"long"});
add("Discover: Hero & intro",{k:"d.f1l",l:"Fact 1: title",s:"#d-intro .dfacts>div:nth-child(1) b"});
add("Discover: Hero & intro",{k:"d.f1v",l:"Fact 1: value",s:"#d-intro .dfacts>div:nth-child(1) span"});
add("Discover: Hero & intro",{k:"d.f2l",l:"Fact 2: title",s:"#d-intro .dfacts>div:nth-child(2) b"});
add("Discover: Hero & intro",{k:"d.f2v",l:"Fact 2: value",s:"#d-intro .dfacts>div:nth-child(2) span"});
add("Discover: Hero & intro",{k:"d.f3l",l:"Fact 3: title",s:"#d-intro .dfacts>div:nth-child(3) b"});
add("Discover: Hero & intro",{k:"d.f3v",l:"Fact 3: value",s:"#d-intro .dfacts>div:nth-child(3) span"});
add("Discover: Hero & intro",{k:"d.f4l",l:"Fact 4: title",s:"#d-intro .dfacts>div:nth-child(4) b"});
add("Discover: Hero & intro",{k:"d.f4v",l:"Fact 4: value",s:"#d-intro .dfacts>div:nth-child(4) span"});
add("Discover: The Beauty of Hiriketiya Bay",{k:"d.bay.cap",l:"Small heading",s:"#d-bay .dcap"});
add("Discover: The Beauty of Hiriketiya Bay",{k:"d.bay.h",l:"Heading",s:"#d-bay h2"});
add("Discover: The Beauty of Hiriketiya Bay",{k:"d.bay.p1",l:"Paragraph 1",s:"#d-bay .dtx>p:nth-of-type(1)",t:"long"});
add("Discover: The Beauty of Hiriketiya Bay",{k:"d.bay.p2",l:"Paragraph 2",s:"#d-bay .dtx>p:nth-of-type(2)",t:"long"});
add("Discover: The Beauty of Hiriketiya Bay",{k:"d.bay.p3",l:"Paragraph 3",s:"#d-bay .dtx>p:nth-of-type(3)",t:"long"});
add("Discover: The Beauty of Hiriketiya Bay",{k:"d.bay.p4",l:"Paragraph 4",s:"#d-bay .dtx>p:nth-of-type(4)",t:"long"});
add("Discover: The Beauty of Hiriketiya Bay",{k:"show.d.bay",l:"Show this chapter",s:"#d-bay",t:"show"});
add("Discover: A Paradise for Surfing",{k:"d.surf.cap",l:"Small heading",s:"#d-surf .dcap"});
add("Discover: A Paradise for Surfing",{k:"d.surf.h",l:"Heading",s:"#d-surf h2"});
add("Discover: A Paradise for Surfing",{k:"d.surf.p1",l:"Paragraph 1",s:"#d-surf .dtx>p:nth-of-type(1)",t:"long"});
add("Discover: A Paradise for Surfing",{k:"d.surf.p2",l:"Paragraph 2",s:"#d-surf .dtx>p:nth-of-type(2)",t:"long"});
add("Discover: A Paradise for Surfing",{k:"d.surf.p3",l:"Paragraph 3",s:"#d-surf .dtx>p:nth-of-type(3)",t:"long"});
add("Discover: A Paradise for Surfing",{k:"d.surf.p4",l:"Paragraph 4",s:"#d-surf .dtx>p:nth-of-type(4)",t:"long"});
add("Discover: A Paradise for Surfing",{k:"show.d.surf",l:"Show this chapter",s:"#d-surf",t:"show"});
add("Discover: Explore the Local Lifestyle",{k:"d.life.cap",l:"Small heading",s:"#d-life .dcap"});
add("Discover: Explore the Local Lifestyle",{k:"d.life.h",l:"Heading",s:"#d-life h2"});
add("Discover: Explore the Local Lifestyle",{k:"d.life.p1",l:"Paragraph 1",s:"#d-life .dtx>p:nth-of-type(1)",t:"long"});
add("Discover: Explore the Local Lifestyle",{k:"d.life.p2",l:"Paragraph 2",s:"#d-life .dtx>p:nth-of-type(2)",t:"long"});
add("Discover: Explore the Local Lifestyle",{k:"d.life.p3",l:"Paragraph 3",s:"#d-life .dtx>p:nth-of-type(3)",t:"long"});
add("Discover: Explore the Local Lifestyle",{k:"d.life.p4",l:"Paragraph 4",s:"#d-life .dtx>p:nth-of-type(4)",t:"long"});
add("Discover: Explore the Local Lifestyle",{k:"show.d.life",l:"Show this chapter",s:"#d-life",t:"show"});
add("Discover: Taste the Flavours of Southern Sri",{k:"d.food.cap",l:"Small heading",s:"#d-food .dcap"});
add("Discover: Taste the Flavours of Southern Sri",{k:"d.food.h",l:"Heading",s:"#d-food h2"});
add("Discover: Taste the Flavours of Southern Sri",{k:"d.food.p1",l:"Paragraph 1",s:"#d-food .dtx>p:nth-of-type(1)",t:"long"});
add("Discover: Taste the Flavours of Southern Sri",{k:"d.food.p2",l:"Paragraph 2",s:"#d-food .dtx>p:nth-of-type(2)",t:"long"});
add("Discover: Taste the Flavours of Southern Sri",{k:"d.food.p3",l:"Paragraph 3",s:"#d-food .dtx>p:nth-of-type(3)",t:"long"});
add("Discover: Taste the Flavours of Southern Sri",{k:"d.food.p4",l:"Paragraph 4",s:"#d-food .dtx>p:nth-of-type(4)",t:"long"});
add("Discover: Taste the Flavours of Southern Sri",{k:"d.food.p5",l:"Paragraph 5",s:"#d-food .dtx>p:nth-of-type(5)",t:"long"});
add("Discover: Taste the Flavours of Southern Sri",{k:"show.d.food",l:"Show this chapter",s:"#d-food",t:"show"});
add("Discover: Discover Nature Beyond the Beach",{k:"d.nature.cap",l:"Small heading",s:"#d-nature .dcap"});
add("Discover: Discover Nature Beyond the Beach",{k:"d.nature.h",l:"Heading",s:"#d-nature h2"});
add("Discover: Discover Nature Beyond the Beach",{k:"d.nature.p1",l:"Paragraph 1",s:"#d-nature .dtx>p:nth-of-type(1)",t:"long"});
add("Discover: Discover Nature Beyond the Beach",{k:"d.nature.p2",l:"Paragraph 2",s:"#d-nature .dtx>p:nth-of-type(2)",t:"long"});
add("Discover: Discover Nature Beyond the Beach",{k:"d.nature.p3",l:"Paragraph 3",s:"#d-nature .dtx>p:nth-of-type(3)",t:"long"});
add("Discover: Discover Nature Beyond the Beach",{k:"d.nature.p4",l:"Paragraph 4",s:"#d-nature .dtx>p:nth-of-type(4)",t:"long"});
add("Discover: Discover Nature Beyond the Beach",{k:"d.nature.p5",l:"Paragraph 5",s:"#d-nature .dtx>p:nth-of-type(5)",t:"long"});
add("Discover: Discover Nature Beyond the Beach",{k:"show.d.nature",l:"Show this chapter",s:"#d-nature",t:"show"});
add("Discover: Experience the Culture and Heritag",{k:"d.culture.cap",l:"Small heading",s:"#d-culture .dcap"});
add("Discover: Experience the Culture and Heritag",{k:"d.culture.h",l:"Heading",s:"#d-culture h2"});
add("Discover: Experience the Culture and Heritag",{k:"d.culture.p1",l:"Paragraph 1",s:"#d-culture .dtx>p:nth-of-type(1)",t:"long"});
add("Discover: Experience the Culture and Heritag",{k:"d.culture.p2",l:"Paragraph 2",s:"#d-culture .dtx>p:nth-of-type(2)",t:"long"});
add("Discover: Experience the Culture and Heritag",{k:"d.culture.p3",l:"Paragraph 3",s:"#d-culture .dtx>p:nth-of-type(3)",t:"long"});
add("Discover: Experience the Culture and Heritag",{k:"d.culture.p4",l:"Paragraph 4",s:"#d-culture .dtx>p:nth-of-type(4)",t:"long"});
add("Discover: Experience the Culture and Heritag",{k:"d.culture.p5",l:"Paragraph 5",s:"#d-culture .dtx>p:nth-of-type(5)",t:"long"});
add("Discover: Experience the Culture and Heritag",{k:"show.d.culture",l:"Show this chapter",s:"#d-culture",t:"show"});
add("Discover: Slow Down and Enjoy the Tropical A",{k:"d.slow.cap",l:"Small heading",s:"#d-slow .dcap"});
add("Discover: Slow Down and Enjoy the Tropical A",{k:"d.slow.h",l:"Heading",s:"#d-slow h2"});
add("Discover: Slow Down and Enjoy the Tropical A",{k:"d.slow.p1",l:"Paragraph 1",s:"#d-slow .dtx>p:nth-of-type(1)",t:"long"});
add("Discover: Slow Down and Enjoy the Tropical A",{k:"d.slow.p2",l:"Paragraph 2",s:"#d-slow .dtx>p:nth-of-type(2)",t:"long"});
add("Discover: Slow Down and Enjoy the Tropical A",{k:"d.slow.p3",l:"Paragraph 3",s:"#d-slow .dtx>p:nth-of-type(3)",t:"long"});
add("Discover: Slow Down and Enjoy the Tropical A",{k:"d.slow.p4",l:"Paragraph 4",s:"#d-slow .dtx>p:nth-of-type(4)",t:"long"});
add("Discover: Slow Down and Enjoy the Tropical A",{k:"show.d.slow",l:"Show this chapter",s:"#d-slow",t:"show"});
add("Discover: Places around",{k:"d.pl.cap",l:"Small heading",s:"#d-places .dcap"});
add("Discover: Places around",{k:"d.pl.h",l:"Heading",s:"#d-places h2"});
add("Discover: Places around",{k:"d.pl.sub",l:"Intro text",s:"#d-places .dsub",t:"long"});
add("Discover: Places around",{k:"d.pl1h",l:"Place 1: name",s:"#d-places .dpl:nth-child(1) h4"});
add("Discover: Places around",{k:"d.pl1w",l:"Place 1: area",s:"#d-places .dpl:nth-child(1) .dwhere"});
add("Discover: Places around",{k:"d.pl1k",l:"Place 1: distance (number + km, the chart uses it)",s:"#d-places .dpl:nth-child(1) .dd b"});
add("Discover: Places around",{k:"d.pl1t",l:"Place 1: drive time",s:"#d-places .dpl:nth-child(1) .dt b"});
add("Discover: Places around",{k:"d.pl1p",l:"Place 1: text",s:"#d-places .dpl:nth-child(1) .dtxt",t:"long"});
add("Discover: Places around",{k:"d.pl1m",l:"Place 1: map link",s:"#d-places .dpl:nth-child(1) .dbtn.loc",t:"attr",a:"href"});
add("Discover: Places around",{k:"d.pl1d",l:"Place 1: directions link",s:"#d-places .dpl:nth-child(1) .dbtn:not(.loc)",t:"attr",a:"href"});
add("Discover: Places around",{k:"d.pl2h",l:"Place 2: name",s:"#d-places .dpl:nth-child(2) h4"});
add("Discover: Places around",{k:"d.pl2w",l:"Place 2: area",s:"#d-places .dpl:nth-child(2) .dwhere"});
add("Discover: Places around",{k:"d.pl2k",l:"Place 2: distance (number + km, the chart uses it)",s:"#d-places .dpl:nth-child(2) .dd b"});
add("Discover: Places around",{k:"d.pl2t",l:"Place 2: drive time",s:"#d-places .dpl:nth-child(2) .dt b"});
add("Discover: Places around",{k:"d.pl2p",l:"Place 2: text",s:"#d-places .dpl:nth-child(2) .dtxt",t:"long"});
add("Discover: Places around",{k:"d.pl2m",l:"Place 2: map link",s:"#d-places .dpl:nth-child(2) .dbtn.loc",t:"attr",a:"href"});
add("Discover: Places around",{k:"d.pl2d",l:"Place 2: directions link",s:"#d-places .dpl:nth-child(2) .dbtn:not(.loc)",t:"attr",a:"href"});
add("Discover: Places around",{k:"d.pl3h",l:"Place 3: name",s:"#d-places .dpl:nth-child(3) h4"});
add("Discover: Places around",{k:"d.pl3w",l:"Place 3: area",s:"#d-places .dpl:nth-child(3) .dwhere"});
add("Discover: Places around",{k:"d.pl3k",l:"Place 3: distance (number + km, the chart uses it)",s:"#d-places .dpl:nth-child(3) .dd b"});
add("Discover: Places around",{k:"d.pl3t",l:"Place 3: drive time",s:"#d-places .dpl:nth-child(3) .dt b"});
add("Discover: Places around",{k:"d.pl3p",l:"Place 3: text",s:"#d-places .dpl:nth-child(3) .dtxt",t:"long"});
add("Discover: Places around",{k:"d.pl3m",l:"Place 3: map link",s:"#d-places .dpl:nth-child(3) .dbtn.loc",t:"attr",a:"href"});
add("Discover: Places around",{k:"d.pl3d",l:"Place 3: directions link",s:"#d-places .dpl:nth-child(3) .dbtn:not(.loc)",t:"attr",a:"href"});
add("Discover: Places around",{k:"d.pl4h",l:"Place 4: name",s:"#d-places .dpl:nth-child(4) h4"});
add("Discover: Places around",{k:"d.pl4w",l:"Place 4: area",s:"#d-places .dpl:nth-child(4) .dwhere"});
add("Discover: Places around",{k:"d.pl4k",l:"Place 4: distance (number + km, the chart uses it)",s:"#d-places .dpl:nth-child(4) .dd b"});
add("Discover: Places around",{k:"d.pl4t",l:"Place 4: drive time",s:"#d-places .dpl:nth-child(4) .dt b"});
add("Discover: Places around",{k:"d.pl4p",l:"Place 4: text",s:"#d-places .dpl:nth-child(4) .dtxt",t:"long"});
add("Discover: Places around",{k:"d.pl4m",l:"Place 4: map link",s:"#d-places .dpl:nth-child(4) .dbtn.loc",t:"attr",a:"href"});
add("Discover: Places around",{k:"d.pl4d",l:"Place 4: directions link",s:"#d-places .dpl:nth-child(4) .dbtn:not(.loc)",t:"attr",a:"href"});
add("Discover: Places around",{k:"d.pl5h",l:"Place 5: name",s:"#d-places .dpl:nth-child(5) h4"});
add("Discover: Places around",{k:"d.pl5w",l:"Place 5: area",s:"#d-places .dpl:nth-child(5) .dwhere"});
add("Discover: Places around",{k:"d.pl5k",l:"Place 5: distance (number + km, the chart uses it)",s:"#d-places .dpl:nth-child(5) .dd b"});
add("Discover: Places around",{k:"d.pl5t",l:"Place 5: drive time",s:"#d-places .dpl:nth-child(5) .dt b"});
add("Discover: Places around",{k:"d.pl5p",l:"Place 5: text",s:"#d-places .dpl:nth-child(5) .dtxt",t:"long"});
add("Discover: Places around",{k:"d.pl5m",l:"Place 5: map link",s:"#d-places .dpl:nth-child(5) .dbtn.loc",t:"attr",a:"href"});
add("Discover: Places around",{k:"d.pl5d",l:"Place 5: directions link",s:"#d-places .dpl:nth-child(5) .dbtn:not(.loc)",t:"attr",a:"href"});
add("Discover: Places around",{k:"d.pl6h",l:"Place 6: name",s:"#d-places .dpl:nth-child(6) h4"});
add("Discover: Places around",{k:"d.pl6w",l:"Place 6: area",s:"#d-places .dpl:nth-child(6) .dwhere"});
add("Discover: Places around",{k:"d.pl6k",l:"Place 6: distance (number + km, the chart uses it)",s:"#d-places .dpl:nth-child(6) .dd b"});
add("Discover: Places around",{k:"d.pl6t",l:"Place 6: drive time",s:"#d-places .dpl:nth-child(6) .dt b"});
add("Discover: Places around",{k:"d.pl6p",l:"Place 6: text",s:"#d-places .dpl:nth-child(6) .dtxt",t:"long"});
add("Discover: Places around",{k:"d.pl6m",l:"Place 6: map link",s:"#d-places .dpl:nth-child(6) .dbtn.loc",t:"attr",a:"href"});
add("Discover: Places around",{k:"d.pl6d",l:"Place 6: directions link",s:"#d-places .dpl:nth-child(6) .dbtn:not(.loc)",t:"attr",a:"href"});
add("Discover: Places around",{k:"d.pl7h",l:"Place 7: name",s:"#d-places .dpl:nth-child(7) h4"});
add("Discover: Places around",{k:"d.pl7w",l:"Place 7: area",s:"#d-places .dpl:nth-child(7) .dwhere"});
add("Discover: Places around",{k:"d.pl7k",l:"Place 7: distance (number + km, the chart uses it)",s:"#d-places .dpl:nth-child(7) .dd b"});
add("Discover: Places around",{k:"d.pl7t",l:"Place 7: drive time",s:"#d-places .dpl:nth-child(7) .dt b"});
add("Discover: Places around",{k:"d.pl7p",l:"Place 7: text",s:"#d-places .dpl:nth-child(7) .dtxt",t:"long"});
add("Discover: Places around",{k:"d.pl7m",l:"Place 7: map link",s:"#d-places .dpl:nth-child(7) .dbtn.loc",t:"attr",a:"href"});
add("Discover: Places around",{k:"d.pl7d",l:"Place 7: directions link",s:"#d-places .dpl:nth-child(7) .dbtn:not(.loc)",t:"attr",a:"href"});
add("Discover: Places around",{k:"d.pl8h",l:"Place 8: name",s:"#d-places .dpl:nth-child(8) h4"});
add("Discover: Places around",{k:"d.pl8w",l:"Place 8: area",s:"#d-places .dpl:nth-child(8) .dwhere"});
add("Discover: Places around",{k:"d.pl8k",l:"Place 8: distance (number + km, the chart uses it)",s:"#d-places .dpl:nth-child(8) .dd b"});
add("Discover: Places around",{k:"d.pl8t",l:"Place 8: drive time",s:"#d-places .dpl:nth-child(8) .dt b"});
add("Discover: Places around",{k:"d.pl8p",l:"Place 8: text",s:"#d-places .dpl:nth-child(8) .dtxt",t:"long"});
add("Discover: Places around",{k:"d.pl8m",l:"Place 8: map link",s:"#d-places .dpl:nth-child(8) .dbtn.loc",t:"attr",a:"href"});
add("Discover: Places around",{k:"d.pl8d",l:"Place 8: directions link",s:"#d-places .dpl:nth-child(8) .dbtn:not(.loc)",t:"attr",a:"href"});
add("Discover: Places around",{k:"d.pl.note",l:"Small note under the cards",s:"#d-places .dnote",t:"long"});
add("Discover: Places around",{k:"show.d.places",l:"Show this section",s:"#d-places",t:"show"});
add("Discover: Map, season, responsible, closing",{k:"d.map.h",l:"Map heading",s:"#d-map h2"});
add("Discover: Map, season, responsible, closing",{k:"show.d.map",l:"Show the map section",s:"#d-map",t:"show"});
add("Discover: Map, season, responsible, closing",{k:"d.se.h",l:"Best time: heading",s:"#d-season h2"});
add("Discover: Map, season, responsible, closing",{k:"d.se.sub",l:"Best time: intro",s:"#d-season .dsub",t:"long"});
add("Discover: Map, season, responsible, closing",{k:"d.se1t",l:"Best time card 1: title",s:"#d-season .dcards>.card:nth-child(1) b"});
add("Discover: Map, season, responsible, closing",{k:"d.se1p",l:"Best time card 1: text",s:"#d-season .dcards>.card:nth-child(1)>p:nth-of-type(1)",t:"long"});
add("Discover: Map, season, responsible, closing",{k:"d.se2t",l:"Best time card 2: title",s:"#d-season .dcards>.card:nth-child(2) b"});
add("Discover: Map, season, responsible, closing",{k:"d.se2p",l:"Best time card 2: text",s:"#d-season .dcards>.card:nth-child(2)>p:nth-of-type(1)",t:"long"});
add("Discover: Map, season, responsible, closing",{k:"d.se3t",l:"Best time card 3: title",s:"#d-season .dcards>.card:nth-child(3) b"});
add("Discover: Map, season, responsible, closing",{k:"d.se3p",l:"Best time card 3: text",s:"#d-season .dcards>.card:nth-child(3)>p:nth-of-type(1)",t:"long"});
add("Discover: Map, season, responsible, closing",{k:"show.d.season",l:"Show best-time section",s:"#d-season",t:"show"});
add("Discover: Map, season, responsible, closing",{k:"d.rs.h",l:"Responsible: heading",s:"#d-resp h2"});
add("Discover: Map, season, responsible, closing",{k:"d.rs.sub",l:"Responsible: intro",s:"#d-resp .rv:first-child .dsub",t:"long"});
add("Discover: Map, season, responsible, closing",{k:"d.rs1",l:"Responsible tip 1",s:"#d-resp .dcheck li:nth-child(1) span"});
add("Discover: Map, season, responsible, closing",{k:"d.rs2",l:"Responsible tip 2",s:"#d-resp .dcheck li:nth-child(2) span"});
add("Discover: Map, season, responsible, closing",{k:"d.rs3",l:"Responsible tip 3",s:"#d-resp .dcheck li:nth-child(3) span"});
add("Discover: Map, season, responsible, closing",{k:"d.rs4",l:"Responsible tip 4",s:"#d-resp .dcheck li:nth-child(4) span"});
add("Discover: Map, season, responsible, closing",{k:"d.rs5",l:"Responsible tip 5",s:"#d-resp .dcheck li:nth-child(5) span"});
add("Discover: Map, season, responsible, closing",{k:"d.rs6",l:"Responsible tip 6",s:"#d-resp .dcheck li:nth-child(6) span"});
add("Discover: Map, season, responsible, closing",{k:"d.rs7",l:"Responsible tip 7",s:"#d-resp .dcheck li:nth-child(7) span"});
add("Discover: Map, season, responsible, closing",{k:"show.d.resp",l:"Show responsible section",s:"#d-resp",t:"show"});
add("Discover: Map, season, responsible, closing",{k:"d.cta.cap",l:"Closing: small heading",s:"#d-cta .dcap"});
add("Discover: Map, season, responsible, closing",{k:"d.cta.h",l:"Closing: heading",s:"#d-cta h2"});
add("Discover: Map, season, responsible, closing",{k:"d.cta.p",l:"Closing: text",s:"#d-cta .in>p:not(.dtagl)",t:"long"});
add("Discover: Map, season, responsible, closing",{k:"d.cta.tag",l:"Closing: tagline",s:"#d-cta .dtagl"});
add("Discover: Map, season, responsible, closing",{k:"show.d.cta",l:"Show closing section",s:"#d-cta",t:"show"});

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
