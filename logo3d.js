/* hero logo: tilts toward the pointer (the idle sway and the stroke animation are pure CSS) */
(()=>{const hero=document.querySelector('.hero'),t=hero&&hero.querySelector('.l3d-in');
if(!t||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  t.style.setProperty('--ry',(x*26)+'deg');t.style.setProperty('--rx',(-y*18)+'deg')},{passive:true});
hero.addEventListener('pointerleave',()=>{t.style.removeProperty('--rx');t.style.removeProperty('--ry')});
})();

/* header logo: tilts toward the pointer while the pointer is over the header */
(()=>{const hd=document.querySelector('header.hd'),t=hd&&hd.querySelector('.l3d-in');
if(!t||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
hd.addEventListener('pointermove',e=>{const r=t.getBoundingClientRect(),x=Math.max(-1,Math.min(1,(e.clientX-(r.left+r.width/2))/400)),y=Math.max(-1,Math.min(1,(e.clientY-(r.top+r.height/2))/120));
  t.style.setProperty('--ry',(x*22)+'deg');t.style.setProperty('--rx',(-y*14)+'deg')},{passive:true});
hd.addEventListener('pointerleave',()=>{t.style.removeProperty('--rx');t.style.removeProperty('--ry')});
})();
