/* logos: strip the white box/background from every logo image (white connected to the image edge becomes transparent) */
(()=>{const root=document.documentElement,done=()=>root.classList.remove('lg-wait');
const cache={};
function clean(src){return cache[src]||(cache[src]=new Promise((res,rej)=>{const im=new Image();
 im.onload=()=>{try{const w=im.naturalWidth,h=im.naturalHeight,c=document.createElement('canvas');c.width=w;c.height=h;
  const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0);const id=x.getImageData(0,0,w,h),d=id.data,N=w*h,rm=new Uint8Array(N),st=new Int32Array(N);let sp=0;
  const bg=i=>{const k=i*4;return d[k+3]<20||(d[k]>=232&&d[k+1]>=232&&d[k+2]>=232)};
  const seed=i=>{if(!rm[i]&&bg(i)){rm[i]=1;st[sp++]=i}};
  for(let a=0;a<w;a++){seed(a);seed((h-1)*w+a)}for(let b=0;b<h;b++){seed(b*w);seed(b*w+w-1)}
  while(sp){const i=st[--sp],px=i%w;
   if(px>0)seed(i-1);if(px<w-1)seed(i+1);if(i>=w)seed(i-w);if(i<N-w)seed(i+w)}
  for(let i=0;i<N;i++)if(rm[i])d[i*4+3]=0;
  /* soften the light halo next to removed areas */
  for(let i=0;i<N;i++){if(rm[i])continue;const px=i%w;
   if((px>0&&rm[i-1])||(px<w-1&&rm[i+1])||(i>=w&&rm[i-w])||(i<N-w&&rm[i+w])){const k=i*4,m=Math.min(d[k],d[k+1],d[k+2]);
    if(m>185)d[k+3]=Math.round(d[k+3]*Math.max(0,(255-m))/70)}}
  x.putImageData(id,0,0);c.toBlob(b=>b?res(URL.createObjectURL(b)):rej(),'image/png')}catch(e){rej(e)}};
 im.onerror=rej;im.src=src}))}
const imgs=[...document.querySelectorAll('img.nlogo')].filter(i=>!i.hasAttribute('data-keep'));
Promise.all(imgs.map(i=>clean(i.getAttribute('src')).then(u=>{i.removeAttribute('loading');i.src=u},()=>{}))).then(done,done);
})();

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
