/* HIRIKETIYO top bar: a live, endlessly scrolling line of world flags under the navigation */
(()=>{
const hd=document.querySelector('header.hd')||document.querySelector('header');
if(!hd||hd.querySelector('.flagbar'))return;
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* flags are drawn in a 60x40 box (3:2) */
const R=(x,y,w,h,f)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"/>`;
const C=(x,y,r,f)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"/>`;
const HS=a=>a.map((f,i)=>R(0,i*40/a.length,60,40/a.length+.2,f)).join('');
const VS=a=>a.map((f,i)=>R(i*60/a.length,0,60/a.length+.2,40,f)).join('');
const ST=(cx,cy,r,f)=>{const p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?r*.4:r;p.push((cx+q*Math.cos(a)).toFixed(1)+','+(cy+q*Math.sin(a)).toFixed(1))}return `<polygon points="${p.join(' ')}" fill="${f}"/>`};
const X=(c,d,w)=>`<path d="${d}" stroke="${c}" stroke-width="${w}" fill="none"/>`;
const GB=R(0,0,60,40,'#012169')+X('#fff','M0 0L60 40M60 0L0 40',8)+X('#c8102e','M0 0L60 40M60 0L0 40',3)+X('#fff','M30 0V40M0 20H60',12)+X('#c8102e','M30 0V40M0 20H60',7);
let us=HS(Array.from({length:13},(_,i)=>i%2?'#fff':'#b22234'))+R(0,0,26,21.5,'#3c3b6e');
for(let r=0;r<5;r++)for(let c=0;c<6;c++)us+=C(2.6+c*4.2,2.6+r*4,.8,'#fff');
const gr=Array.from({length:9},(_,i)=>i%2?'#fff':'#0d5eaf');
const F={
LK:R(0,0,60,40,'#ffbe29')+R(3,3,54,34,'#ffbe29')+R(5,5,7,30,'#00534e')+R(12,5,7,30,'#eb7400')+R(21,5,34,30,'#8d153a')+C(38,20,7.5,'#ffbe29')+R(30,29,16,2.4,'#ffbe29')+C(24,8,1.2,'#ffbe29')+C(52,8,1.2,'#ffbe29')+C(24,32,1.2,'#ffbe29')+C(52,32,1.2,'#ffbe29'),
MV:R(0,0,60,40,'#d21034')+R(8,7,44,26,'#007e3a')+C(30,20,8,'#fff')+C(33,20,6.8,'#007e3a'),
IN:HS(['#ff9933','#fff','#138808'])+'<circle cx="30" cy="20" r="5" fill="none" stroke="#000080" stroke-width="1.2"/>'+C(30,20,1,'#000080'),
GB:GB,US:us,
AU:R(0,0,60,40,'#00008b')+`<svg x="0" y="0" width="30" height="20" viewBox="0 0 60 40">${GB}</svg>`+ST(15,31,5.4,'#fff')+ST(42,32,2.6,'#fff')+ST(50,17,2.6,'#fff')+ST(40,9,2.6,'#fff')+ST(46,23,2.2,'#fff'),
NZ:R(0,0,60,40,'#00247d')+`<svg x="0" y="0" width="30" height="20" viewBox="0 0 60 40">${GB}</svg>`+ST(46,32,3.8,'#fff')+ST(46,32,2.9,'#cc142b')+ST(53,19,3.2,'#fff')+ST(53,19,2.4,'#cc142b')+ST(39,18,3.2,'#fff')+ST(39,18,2.4,'#cc142b')+ST(46,9,3.8,'#fff')+ST(46,9,2.9,'#cc142b'),
CA:R(0,0,15,40,'#f00')+R(15,0,30,40,'#fff')+R(45,0,15,40,'#f00')+ST(30,20,9.5,'#f00'),
FR:VS(['#0055a4','#fff','#ef4135']),DE:HS(['#000','#dd0000','#ffce00']),IT:VS(['#009246','#fff','#ce2b37']),
NL:HS(['#ae1c28','#fff','#21468b']),RU:HS(['#fff','#0039a6','#d52b1e']),
CN:R(0,0,60,40,'#de2910')+ST(10,10,6.5,'#ffde00')+ST(20,4,2,'#ffde00')+ST(24,9,2,'#ffde00')+ST(24,15,2,'#ffde00')+ST(20,20,2,'#ffde00'),
JP:R(0,0,60,40,'#fff')+C(30,20,12,'#bc002d'),
KR:R(0,0,60,40,'#fff')+C(30,20,9,'#cd2e3a')+'<path d="M21 20a9 9 0 0 0 18 0a4.5 4.5 0 0 1-9 0a4.5 4.5 0 0 0-9 0z" fill="#0047a0"/>'+X('#000','M7 7l6-4M47 3l6 4M7 33l6 4M47 37l6-4',3),
TR:R(0,0,60,40,'#e30a17')+C(22,20,10,'#fff')+C(25,20,8,'#e30a17')+ST(36,20,4.4,'#fff'),
BR:R(0,0,60,40,'#009b3a')+'<path d="M30 4L56 20L30 36L4 20Z" fill="#fedf00"/>'+C(30,20,8,'#002776'),
CH:R(0,0,60,40,'#d52b1e')+R(26,8,8,24,'#fff')+R(18,16,24,8,'#fff'),
SE:R(0,0,60,40,'#006aa7')+R(16,0,8,40,'#fecc00')+R(0,16,60,8,'#fecc00'),
NO:R(0,0,60,40,'#ba0c2f')+R(16,0,12,40,'#fff')+R(0,14,60,12,'#fff')+R(19,0,6,40,'#00205b')+R(0,17,60,6,'#00205b'),
DK:R(0,0,60,40,'#c8102e')+R(16,0,6,40,'#fff')+R(0,17,60,6,'#fff'),
FI:R(0,0,60,40,'#fff')+R(16,0,10,40,'#003580')+R(0,15,60,10,'#003580'),
ES:R(0,0,60,10,'#aa151b')+R(0,10,60,20,'#f1bf00')+R(0,30,60,10,'#aa151b'),
PT:R(0,0,24,40,'#006600')+R(24,0,36,40,'#ff0000')+C(24,20,6.5,'#ffe000')+C(24,20,3.6,'#ff0000'),
GR:HS(gr)+R(0,0,22.3,22.3,'#0d5eaf')+R(8.9,0,4.5,22.3,'#fff')+R(0,8.9,22.3,4.5,'#fff'),
TH:R(0,0,60,40,'#a51931')+R(0,6.7,60,26.6,'#f4f5f8')+R(0,13.3,60,13.4,'#2d2a4a'),
ID:HS(['#ce1126','#fff']),
SG:R(0,0,60,20,'#ef3340')+R(0,20,60,20,'#fff')+C(12,10,6.5,'#fff')+C(14.6,10,5.4,'#ef3340')+ST(21,5.5,1.7,'#fff')+ST(26,9.5,1.7,'#fff')+ST(24,15,1.7,'#fff')+ST(18,15,1.7,'#fff')+ST(16.5,7,1.7,'#fff'),
MX:VS(['#006847','#fff','#ce1126'])+C(30,20,5,'#8c6a2f'),
AR:HS(['#74acdf','#fff','#74acdf'])+C(30,20,4,'#f6b40e'),
EG:HS(['#ce1126','#fff','#000']),
AE:R(0,0,60,40,'#fff')+R(15,0,45,13.4,'#00732f')+R(15,13.3,45,13.4,'#fff')+R(15,26.6,45,13.4,'#000')+R(0,0,15,40,'#ff0000'),
PL:HS(['#fff','#dc143c']),UA:HS(['#0057b7','#ffd700']),IE:VS(['#169b62','#fff','#ff883e']),
BE:VS(['#000','#fdda24','#ef3340']),AT:HS(['#ed2939','#fff','#ed2939'])
};
const codes=Object.keys(F);
let nm;try{nm=new Intl.DisplayNames(['en'],{type:'region'})}catch(e){}
const name=c=>{try{return nm?nm.of(c):c}catch(e){return c}};

/* one hidden sprite, every flag is a <use> of it (keeps the DOM small) */
const sprite=`<svg width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute"><defs>${codes.map(c=>`<symbol id="fb-${c}" viewBox="0 0 60 40" preserveAspectRatio="none">${F[c]}</symbol>`).join('')}</defs></svg>`;
const one=codes.map((c,i)=>`<span class="fg" style="--i:${i}" title="${name(c)}"><svg viewBox="0 0 60 40" aria-hidden="true" focusable="false"><use href="#fb-${c}"/></svg></span>`).join('');

const bar=document.createElement('div');bar.className='flagbar';bar.setAttribute('aria-hidden','true');
bar.innerHTML=sprite+'<div class="ft">'+one+'</div>';
hd.append(bar);
const ft=bar.querySelector('.ft');
if(!calm){
  /* repeat the set until it is wider than the screen, then double it so the loop is seamless */
  requestAnimationFrame(()=>{
    const setW=ft.scrollWidth||1,reps=Math.max(1,Math.ceil(Math.max(innerWidth,screen.width)/setW));
    ft.innerHTML=one.repeat(reps*2);
    ft.style.setProperty('--fbd',(setW*reps/45).toFixed(1)+'s');   /* ~45px per second */
  });
}
})();
