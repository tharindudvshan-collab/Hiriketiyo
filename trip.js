/* HIRIKETIYO trip planner (Surf & Experiences page). Front-end only: the plan can be sent on WhatsApp, copied,
   or submitted with the form (the hidden #tp-plan field carries the text once the backend is connected).
   Rides between stops are suggested as tuk-tuk and can be changed by the customer, one by one or all at once. */
(()=>{
const root=document.getElementById('tp');if(!root)return;
const $=s=>root.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const OTHER='Other (type below)';
const OPT={
 food:['Breakfast and coffee','Rice and curry lunch','Seafood dinner by the beach','Kottu or street food','Vegetarian or vegan meal'],
 gym:['Gym day pass','Yoga class','Beach workout','Personal trainer session'],
 surf:['Beginner surf lesson','Intermediate coaching','Board rental'],
 exp:['Blue Beach Island','Hummanaya Blowhole','Dondra Lighthouse','Turtle Point (Bathigama)','Mulkirigala Rock Temple','Rekawa Beach','Mawella Beach','Silent Beach']};
const NAME={food:'Food',gym:'Gym & yoga',surf:'Surf',exp:'Place to visit'};
const ROOMS=['Beach guesthouse room','Boutique villa','Surf hostel bed','Family homestay',OTHER];
const RIDE=[['tuk','Tuk-tuk'],['car','Car with driver'],['van','Van (groups)'],['bike','Scooter rental (self-drive)'],['walk','Walk'],['self','I will arrange it myself'],['other','Other (type below)']];
const rl=m=>(RIDE.find(r=>r[0]===m)||RIDE[0])[1];
const fresh=()=>({start:'',nights:3,guests:2,stay:true,room:ROOMS[0],roomc:'',rooms:1,from:'',arr:{mode:'tuk',c:''},stops:[],legs:{},seq:0});
let S=fresh();
try{const j=JSON.parse(localStorage.getItem('hk_trip')||'null');if(j&&Array.isArray(j.stops))S=Object.assign(fresh(),j)}catch(e){}
const days=()=>Math.max(1,(+S.nights||1)+1);
const opts=(a,v)=>a.map(x=>`<option${x===v?' selected':''}>${esc(x)}</option>`).join('');
const rideOpts=m=>RIDE.map(([v,l])=>`<option value="${v}"${v===m?' selected':''}>${l}</option>`).join('');
const dayLabel=d=>{if(!S.start)return'';const t=new Date(S.start+'T00:00');if(isNaN(t))return'';t.setDate(t.getDate()+d-1);return' · '+t.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})};
const nm=s=>s.pick===OTHER?(s.c||'Other'):s.pick;
const ride=l=>l?(l.mode==='other'?(l.c||'Other'):rl(l.mode)):rl('tuk');
const save=()=>{try{localStorage.setItem('hk_trip',JSON.stringify(S))}catch(e){}};

/* ---- fill the fixed controls ---- */
$('#tp-start').min=new Date().toISOString().slice(0,10);
$('#tp-room').innerHTML=opts(ROOMS,S.room);
$('#tp-arrmode').innerHTML=rideOpts(S.arr.mode);
$('#tp-allride').innerHTML='<option value="">Choose…</option>'+rideOpts('x').replace(' selected','');
function syncFixed(){
  $('#tp-start').value=S.start;$('#tp-nights').value=S.nights;$('#tp-guests').value=S.guests;
  $('#tp-stay').checked=S.stay;$('#tp-stayb').hidden=!S.stay;$('#tp-rooms').value=S.rooms;$('#tp-room').value=S.room;
  $('#tp-roomc').value=S.roomc;$('#tp-roomcl').hidden=S.room!==OTHER;
  $('#tp-from').value=S.from;$('#tp-arrmode').value=S.arr.mode;$('#tp-arrc').value=S.arr.c;$('#tp-arrcl').hidden=S.arr.mode!=='other';
  const n=days(),cur=$('#tp-addday').value||'1';
  $('#tp-addday').innerHTML=Array.from({length:n},(_,i)=>`<option value="${i+1}">Day ${i+1}${dayLabel(i+1)}</option>`).join('');
  $('#tp-addday').value=+cur<=n?cur:'1';
}

/* ---- itinerary + summary ---- */
function render(){
  S.stops.forEach(s=>{if(s.day>days())s.day=days()});
  const L=$('#tp-list');let h='';
  for(let d=1;d<=days();d++){
    const st=S.stops.filter(s=>s.day===d);if(!st.length)continue;
    h+=`<div class="tp-day"><h4>Day ${d}${esc(dayLabel(d))}</h4><ol>`;
    st.forEach((s,i)=>{
      const lg=S.legs[s.id]||{mode:'tuk',c:''};
      h+=`<li class="tp-leg"><span>Ride from ${i?esc(nm(st[i-1])):'your stay'}</span><select data-leg="${s.id}" aria-label="Ride">${rideOpts(lg.mode)}</select>`+
         (lg.mode==='other'?`<input data-legc="${s.id}" value="${esc(lg.c)}" maxlength="60" placeholder="Describe your transport">`:'')+`</li>`;
      h+=`<li class="tp-stop t-${s.type}"><div class="tp-top"><b>${NAME[s.type]}</b>`+
         `<span class="tp-mv"><button type="button" data-mv="${s.id}" data-dir="-1" aria-label="Move up">▲</button><button type="button" data-mv="${s.id}" data-dir="1" aria-label="Move down">▼</button><button type="button" data-rm="${s.id}" aria-label="Remove">✕</button></span></div>`+
         `<select data-pick="${s.id}" aria-label="${NAME[s.type]}">${opts(OPT[s.type].concat(OTHER),s.pick)}</select>`+
         (s.pick===OTHER?`<input data-pickc="${s.id}" value="${esc(s.c)}" maxlength="80" placeholder="Type it here">`:'')+
         `<div class="tp-row"><select data-day="${s.id}" aria-label="Day">${Array.from({length:days()},(_,k)=>`<option value="${k+1}"${k+1===s.day?' selected':''}>Day ${k+1}</option>`).join('')}</select><input type="time" data-time="${s.id}" value="${esc(s.time)}" aria-label="Time"></div></li>`;
    });
    h+='</ol></div>';
  }
  L.innerHTML=h||'<p class="mut">Nothing added yet. Use the buttons above to add meals, a gym session, surf or places to visit.</p>';
  sum();
}
function text(){
  const o=['HIRIKETIYO trip plan'];
  o.push('Arrival: '+(S.start?new Date(S.start+'T00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'date to be confirmed')+' · '+S.nights+' night(s) · '+S.guests+' guest(s)');
  o.push('Room: '+(S.stay?(S.room===OTHER?(S.roomc||'Other'):S.room)+' x'+S.rooms:'not needed'));
  o.push('Arrival transfer: '+(S.from?'from '+S.from+' by ':'by ')+ride({mode:S.arr.mode,c:S.arr.c}));
  for(let d=1;d<=days();d++){
    const st=S.stops.filter(s=>s.day===d);if(!st.length)continue;
    o.push('','Day '+d+dayLabel(d));
    st.forEach((s,i)=>o.push('- '+(s.time?s.time+' ':'')+NAME[s.type]+': '+nm(s)+'  (ride from '+(i?nm(st[i-1]):'stay')+': '+ride(S.legs[s.id])+')'));
  }
  return o.join('\n')}
function sum(){const t=text();$('#tp-sum').textContent=t;$('#tp-plan').value=t;
  $('#tp-wa').href='https://wa.me/94717505506?text='+encodeURIComponent(t);save()}

/* ---- events ---- */
const num=(el,min,max)=>Math.min(max,Math.max(min,parseInt(el.value,10)||min));
root.addEventListener('input',e=>{const t=e.target,g=k=>t.dataset[k],f=id=>S.stops.find(s=>s.id===+id);
  if(t.id==='tp-start'){S.start=t.value;syncFixed();render();return}
  if(t.id==='tp-from')S.from=t.value;
  else if(t.id==='tp-roomc')S.roomc=t.value;
  else if(t.id==='tp-arrc')S.arr.c=t.value;
  else if(g('pickc')&&f(g('pickc')))f(g('pickc')).c=t.value;
  else if(g('legc')){(S.legs[g('legc')]=S.legs[g('legc')]||{mode:'other',c:''}).c=t.value}
  else if(g('time')&&f(g('time')))f(g('time')).time=t.value;
  else return;
  sum()});
root.addEventListener('change',e=>{const t=e.target,g=k=>t.dataset[k],f=id=>S.stops.find(s=>s.id===+id);
  if(t.id==='tp-nights'){S.nights=num(t,1,21);syncFixed();render();return}
  if(t.id==='tp-guests'){S.guests=num(t,1,20);sum();return}
  if(t.id==='tp-rooms'){S.rooms=num(t,1,10);sum();return}
  if(t.id==='tp-stay'){S.stay=t.checked;syncFixed();sum();return}
  if(t.id==='tp-room'){S.room=t.value;syncFixed();sum();return}
  if(t.id==='tp-arrmode'){S.arr.mode=t.value;syncFixed();sum();return}
  if(t.id==='tp-allride'){if(!t.value)return;S.arr.mode=t.value;S.stops.forEach(s=>{S.legs[s.id]={mode:t.value,c:(S.legs[s.id]||{}).c||''}});t.value='';syncFixed();render();return}
  if(g('leg')){S.legs[g('leg')]={mode:t.value,c:(S.legs[g('leg')]||{}).c||''};render();return}
  if(g('pick')&&f(g('pick'))){f(g('pick')).pick=t.value;render();return}
  if(g('day')&&f(g('day'))){f(g('day')).day=+t.value;render()}});
root.addEventListener('click',e=>{const b=e.target.closest('button,a');if(!b)return;
  if(b.dataset.add){const type=b.dataset.add;S.stops.push({id:++S.seq,type,pick:OPT[type][0],c:'',day:+$('#tp-addday').value||1,time:''});render();return}
  if(b.dataset.rm){S.stops=S.stops.filter(s=>s.id!==+b.dataset.rm);delete S.legs[b.dataset.rm];render();return}
  if(b.dataset.mv){const i=S.stops.findIndex(s=>s.id===+b.dataset.mv),d=+b.dataset.dir,cur=S.stops[i];if(!cur)return;
    for(let j=i+d;j>=0&&j<S.stops.length;j+=d){if(S.stops[j].day===cur.day){[S.stops[i],S.stops[j]]=[S.stops[j],S.stops[i]];break}}render();return}
  if(b.id==='tp-copy'){const t=text();(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>{b.textContent='Copied'},()=>{});setTimeout(()=>{b.textContent='Copy plan'},1800);return}
  if(b.id==='tp-clear'){S=fresh();syncFixed();render()}});

syncFixed();render();
})();
