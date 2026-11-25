/* hero logo: tilts toward the pointer (the idle sway and the stroke animation are pure CSS) */
(()=>{const hero=document.querySelector('.hero'),t=hero&&hero.querySelector('.l3d-in');
if(!t||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  t.style.setProperty('--ry',(x*26)+'deg');t.style.setProperty('--rx',(-y*18)+'deg')},{passive:true});
hero.addEventListener('pointerleave',()=>{t.style.removeProperty('--rx');t.style.removeProperty('--ry')});
})();
