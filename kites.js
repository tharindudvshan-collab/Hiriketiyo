/* HIRIKETIYO hero: ~25 country-flag kites of random size floating up the sky */
(()=>{
const hero=document.querySelector('.hero');if(!hero)return;
const W=30,H=40,NS='http://www.w3.org/2000/svg';
const R=(x,y,w,h,f)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"/>`;
const C=(x,y,r,f)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"/>`;
const HS=a=>a.map((f,i)=>R(0,i*H/a.length,W,H/a.length+.2,f)).join('');
const VS=a=>a.map((f,i)=>R(i*W/a.length,0,W/a.length+.2,H,f)).join('');
const ST=(cx,cy,r,f)=>{let p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.4:r;p.push((cx+rr*Math.cos(a)).toFixed(1)+','+(cy+rr*Math.sin(a)).toFixed(1))}return `<polygon points="${p.join(' ')}" fill="${f}"/>`};
const GB=R(0,0,W,H,'#012169')+'<path d="M0 0L30 40M30 0L0 40" stroke="#fff" stroke-width="6"/><path d="M0 0L30 40M30 0L0 40" stroke="#c8102e" stroke-width="2"/><path d="M15 0V40M0 20H30" stroke="#fff" stroke-width="9"/><path d="M15 0V40M0 20H30" stroke="#c8102e" stroke-width="5.4"/>';
let us=HS(Array.from({length:13},(_,i)=>i%2?'#fff':'#b22234'))+R(0,0,14,21.5,'#3c3b6e');
for(let r=0;r<4;r++)for(let c=0;c<3;c++)us+=C(2.8+c*4.2,3+r*4.8,.9,'#fff');
const F={
FR:VS(['#0055a4','#fff','#ef4135']),DE:HS(['#000','#dd0000','#ffce00']),IT:VS(['#009246','#fff','#ce2b37']),
NL:HS(['#ae1c28','#fff','#21468b']),RU:HS(['#fff','#0039a6','#d52b1e']),
IN:HS(['#ff9933','#fff','#138808'])+'<circle cx="15" cy="20" r="3.6" fill="none" stroke="#000080" stroke-width=".8"/>',
CN:R(0,0,W,H,'#de2910')+ST(8,9,4.6,'#ffde00')+ST(16,4.5,1.5,'#ffde00')+ST(19,9,1.5,'#ffde00')+ST(19,14,1.5,'#ffde00')+ST(16,18.5,1.5,'#ffde00'),
JP:R(0,0,W,H,'#fff')+C(15,20,8.5,'#bc002d'),GB:GB,US:us,
AU:R(0,0,W,H,'#00008b')+`<svg x="0" y="0" width="15" height="20" viewBox="0 0 30 40">${GB}</svg>`+ST(8,31,4.2,'#fff')+ST(22,29,2,'#fff')+ST(25,17,2,'#fff')+ST(19,9,2,'#fff')+ST(24,23,1.6,'#fff'),
CA:R(0,0,7.5,H,'#f00')+R(7.5,0,15,H,'#fff')+R(22.5,0,7.5,H,'#f00')+ST(15,20,6.6,'#f00'),
SE:R(0,0,W,H,'#006aa7')+R(9,0,5,H,'#fecc00')+R(0,17.5,W,5,'#fecc00'),
CH:R(0,0,W,H,'#d52b1e')+R(12.5,10,5,20,'#fff')+R(5,17.5,20,5,'#fff'),
ES:R(0,0,W,10,'#aa151b')+R(0,10,W,20,'#f1bf00')+R(0,30,W,10,'#aa151b'),
PL:HS(['#fff','#dc143c']),UA:HS(['#0057b7','#ffd700']),
BR:R(0,0,W,H,'#009b3a')+'<path d="M15 5L27 20L15 35L3 20Z" fill="#fedf00"/>'+C(15,20,6,'#002776'),
IE:VS(['#169b62','#fff','#ff883e']),BE:VS(['#000','#fdda24','#ef3340']),AT:HS(['#ed2939','#fff','#ed2939']),
TR:R(0,0,W,H,'#e30a17')+C(13,20,8,'#fff')+C(15.5,20,6.4,'#e30a17')+ST(21,20,2.8,'#fff'),
KR:R(0,0,W,H,'#fff')+C(15,20,6,'#cd2e3a')+'<path d="M9 20a6 6 0 0 0 12 0a3 3 0 0 1-6 0a3 3 0 0 0-6 0z" fill="#0047a0"/><path d="M4 6l5-3M21 3l5 3M4 34l5 3M21 37l5-3" stroke="#000" stroke-width="2"/>',
MV:R(0,0,W,H,'#d21034')+R(4,8,22,24,'#007e3a')+C(15,20,6.5,'#fff')+C(17,20,5.5,'#007e3a'),
LK:R(0,0,W,H,'#ffbe29')+R(2,2,4,36,'#00534e')+R(6,2,4,36,'#eb7400')+R(10.5,2,17.5,36,'#8d153a')+C(19.2,19,4.2,'#ffbe29')+R(15,26,8.5,1.6,'#ffbe29')+C(13.2,5,.9,'#ffbe29')+C(26.2,5,.9,'#ffbe29')+C(13.2,35,.9,'#ffbe29')+C(26.2,35,.9,'#ffbe29')
};
const BOW=['#ffd23f','#e0243f','#0bb3b7','#fff','#ff8a3d'];
function kite(code,i){
  const id='kc'+i,b=BOW[i%5],b2=BOW[(i+2)%5];
  return `<svg viewBox="0 0 60 150" aria-hidden="true" focusable="false"><defs><clipPath id="${id}"><polygon points="30,0 60,34 30,84 0,34"/></clipPath></defs>`+
   `<g class="fkt"><path d="M30 84q-9 11 0 22t0 22t0 22" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>`+
   `<path d="M30 98l-6-4v8zM30 98l6-4v8z" fill="${b}"/><path d="M30 120l-6-4v8zM30 120l6-4v8z" fill="${b2}"/><path d="M30 142l-6-4v8zM30 142l6-4v8z" fill="${b}"/></g>`+
   `<svg x="0" y="0" width="60" height="84" viewBox="0 0 30 40" preserveAspectRatio="none" clip-path="url(#${id})">${F[code]}</svg>`+
   `<polygon points="30,0 60,34 30,84" fill="#000" opacity=".14"/><path d="M30 0V84M0 34H60" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>`+
   `<polygon points="30,0 60,34 30,84 0,34" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
}
const box=document.createElement('div');box.className='fkites';box.setAttribute('aria-hidden','true');hero.append(box);
const small=matchMedia('(max-width:700px)').matches,codes=Object.keys(F),rnd=(a,b)=>a+Math.random()*(b-a);
const list=codes.sort(()=>Math.random()-.5).slice(0,small?14:codes.length).map(c=>({c,sz:small?rnd(26,64):rnd(30,96)})).sort((a,b)=>a.sz-b.sz);
list.forEach(({c,sz},i)=>{const d=document.createElement('div'),dur=rnd(26,52)*(1.15-sz/260);
  d.className='fkite';d.style.cssText=`--x:${rnd(0,94).toFixed(1)}%;--sz:${sz.toFixed(0)}px;--dur:${dur.toFixed(1)}s;--dl:-${(Math.random()*dur).toFixed(1)}s;--sw:${rnd(10,40).toFixed(0)}px;--swt:${rnd(4,8).toFixed(1)}s;--rot:${rnd(6,16).toFixed(0)}deg;--y:${rnd(5,80).toFixed(0)}%;--o:${(.78+sz/430).toFixed(2)}`;
  d.innerHTML=`<div class="fks">${kite(c,i)}</div>`;box.append(d)});
function rise(){box.style.setProperty('--rise',(hero.clientHeight+260)+'px')}rise();addEventListener('resize',rise,{passive:true});
if('IntersectionObserver'in window)new IntersectionObserver(e=>box.classList.toggle('paused',!e[0].isIntersecting)).observe(hero);
})();
