import {KEY,E02_KEY,VERSION,BUILD,EVENTS,places,restricted,e02Ready,fresh,restore,payload,dispatch,has} from '../engine/s01e03.mjs';
import {actorHeight,spriteBox} from './perspective.mjs';
const root=document.querySelector('#app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=k=>{try{return JSON.parse(localStorage.getItem(k));}catch{return null;}};
 // Matches E04's read-only canonical handoff guard without packaging E04 prototype.
 // Release allowlist deliberately includes ONLY E03 + its E02 prerequisite.
 const chapter04Unlocked=()=>{
  if(!e02Ready(read(E02_KEY)))return false;
  const saved=restore(read(KEY));
  return saved.mode==='canonical'&&saved.phase==='completed'&&saved.chronicleSeen&&
   !saved.queue.length&&!saved.travel.length&&saved.after===null&&saved.travelEnd===null&&
   Object.values(EVENTS).every(id=>saved.achieved.includes(id)&&saved.ledger.includes(id))&&
   new Set(saved.ledger).size===saved.ledger.length;
 };
let content;
try{const r=await fetch('../public/s01e03.json');if(!r.ok)throw Error();content=await r.json();if(content.version!==VERSION||content.build!==BUILD||content.count!==79)throw Error();}
catch{root.innerHTML='<main class="sheet"><h1>Market Lane could not open</h1><p>Please reload to try again.</p><button onclick="location.reload()">Reload</button></main>';throw Error('E03 content unavailable');}
const canonicalReady=e02Ready(read(E02_KEY));
let unlocked=canonicalReady;
let state=unlocked?restore(read(KEY)):fresh();
let ui={parent:false,modal:null,inspected:null,moving:false,artError:false,storageError:false,review:false,resetError:false,focus:null};
let visual=[...places[state.position]],lastFocus=null,raf=0;
const button=(label,a,primary=false,extra='')=>`<button data-a="${esc(a)}" ${primary?'class="primary"':''} ${extra}>${esc(label)}</button>`;
const names={MILO:'Milo',NIA:'Nia',FINN:'Finn',COORDINATOR:'Market coordinator',RESIDENT:'Garden resident',NARRATOR:'Narrator',UI:'Story'};
const full={MILO:'60 0 490 990',NIA:'545 0 450 1024',FINN:'1025 0 485 1024'},heads={MILO:'95 12 425 474',NIA:'555 18 435 474',FINN:'1045 18 445 474'};
// E03-only provisional role portraits. They are not additions to the canonical C01 trio.
function npcPortrait(who){
 if(who==='COORDINATOR')return `<svg data-npc-portrait="COORDINATOR" aria-hidden="true" viewBox="0 0 80 102" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="e03-co-bg" x2="1" y2="1"><stop stop-color="#e7cf9b"/><stop offset="1" stop-color="#a1bba5"/></linearGradient></defs><rect x="1" y="1" width="78" height="100" rx="11" fill="url(#e03-co-bg)"/><path d="M4 102Q7 73 40 71Q73 73 76 102" fill="#426679" stroke="#35494e" stroke-width="2"/><path d="M31 72l9 18 10-18" fill="#e8dcb7"/><path d="M22 70Q28 60 39 58Q55 59 59 70" fill="#6b4637"/><ellipse cx="40" cy="49" rx="23" ry="27" fill="#dca77b" stroke="#885c46" stroke-width="1.5"/><path d="M19 44Q14 17 31 18Q48 11 59 28L63 43Q55 33 50 34Q31 37 19 44" fill="#4a3a30"/><path d="M16 30q24-13 47 0l-7-13H24z" fill="#5f7b77" stroke="#344e4a" stroke-width="2"/><path d="M21 29q19-4 38 0" fill="none" stroke="#e8d8ad" stroke-width="3"/><g fill="#382d2a"><ellipse cx="31" cy="48" rx="2.2" ry="2.8"/><ellipse cx="49" cy="48" rx="2.2" ry="2.8"/></g><path d="M39 49l-2 9 4 1" fill="none" stroke="#ad755d" stroke-width="1.5"/><path d="M33 64q7 4 14-1" stroke="#904f43" fill="none" stroke-width="2" stroke-linecap="round"/><path d="M8 94h64" stroke="#e8c884" opacity=".75" stroke-width="3"/></svg>`;
 if(who==='RESIDENT')return `<svg data-npc-portrait="RESIDENT" aria-hidden="true" viewBox="0 0 80 102" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="e03-ga-bg" x2="1" y2="1"><stop stop-color="#dce9b5"/><stop offset="1" stop-color="#9fc8b7"/></linearGradient></defs><rect x="1" y="1" width="78" height="100" rx="11" fill="url(#e03-ga-bg)"/><path d="M3 102Q8 72 40 71Q72 73 77 102" fill="#578464" stroke="#345846" stroke-width="2"/><path d="M28 75Q40 87 52 75L57 102H23z" fill="#f4e0a7"/><path d="M17 45Q9 19 31 18Q52 13 62 36L65 67Q57 78 53 75L55 51Q42 44 22 51L24 75Q14 69 17 45" fill="#66615a"/><ellipse cx="40" cy="48" rx="22" ry="27" fill="#e2b18f" stroke="#a77862" stroke-width="1.5"/><path d="M16 40Q20 9 48 16Q67 18 63 42Q50 29 34 32Q24 39 16 40" fill="#77746b"/><path d="M18 27Q40 6 64 27" stroke="#e0ce9d" stroke-width="7" fill="none" stroke-linecap="round"/><g fill="#413b32"><ellipse cx="31" cy="49" rx="2" ry="2.7"/><ellipse cx="49" cy="49" rx="2" ry="2.7"/></g><path d="M39 51l-2 8h5" fill="none" stroke="#be8b71" stroke-width="1.5"/><path d="M32 64q8 6 16-1" stroke="#a66b63" fill="none" stroke-width="2" stroke-linecap="round"/><path d="M58 16q9-9 13 0l-5 8z" fill="#d7838c"/><circle cx="63" cy="19" r="3" fill="#f8db83"/><path d="M23 87h34" stroke="#769c65" stroke-width="3"/></svg>`;
 return '';
}
const art=(who,portrait=false)=>{const crop=(portrait?heads:full)[who];return crop?`<svg aria-hidden="true" viewBox="${crop}" preserveAspectRatio="xMidYMid ${portrait?'slice':'meet'}"><image href="../public/art/trio-sprites.webp" width="1536" height="1024"/></svg>`:portrait?npcPortrait(who):'<span aria-hidden="true">❧</span>';};
function save(){const p=payload(state);if(!p)return;try{localStorage.setItem(KEY,JSON.stringify(p));ui.storageError=false;}catch{ui.storageError=true;}}
function act(a){if(ui.moving&&a.type!=='step')return;state=dispatch(state,a);save();render();}
function line(){return content.lines[state.queue[0]];}
function listen(){if(!line()||!globalThis.speechSynthesis)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(line().text);u.lang='en-US';u.rate=.87;speechSynthesis.speak(u);}catch{}}
function actorFeet(i){
 if(i===0)return visual;
 const trail=[places.front,places.bend,places.west,places.H,...state.history.filter(a=>a.type==='step').map(a=>places[a.to]),visual];
 let remaining=i*155;
 for(let n=trail.length-1;n>0;n--){const a=trail[n],b=trail[n-1],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(d>=remaining)return a.map((x,k)=>x+(b[k]-x)*remaining/d);remaining-=d;}
 return i===1?[155,671]:[55,680];
}
function propArt(kind){
 if(kind==='books')return `<span class="load-visual load-books" data-load-visual="books" role="img" aria-label="Book bundle"><svg viewBox="0 0 72 48" aria-hidden="true"><path d="M8 36h47l8 5H16z" fill="#7b4c37" stroke="#4b392d" stroke-width="2"/><path d="M13 31h43l7 5H9z" fill="#d9a45f" stroke="#4b392d" stroke-width="2"/><path d="M18 25h39l6 6H13z" fill="#75918b" stroke="#4b392d" stroke-width="2"/><path d="M23 19h34l5 6H18z" fill="#c97967" stroke="#4b392d" stroke-width="2"/><path d="M24 20h32M19 26h38M14 32h41" stroke="#fff1cf" stroke-width="1.5" opacity=".85"/></svg></span>`;
 if(kind==='flowers')return `<span class="load-visual load-flowers" data-load-visual="flowers" role="img" aria-label="Flower delivery tray"><svg viewBox="0 0 106 88" aria-hidden="true"><defs><linearGradient id="e03-tray" x2="0" y2="1"><stop stop-color="#e9bd81"/><stop offset="1" stop-color="#b77b4e"/></linearGradient></defs><g fill="none" stroke="#547954" stroke-width="3.2" stroke-linecap="round"><path d="M24 63Q20 37 35 20M44 63Q42 29 53 13M62 62Q70 32 72 18M82 62Q88 42 89 30M34 62Q37 41 26 32M72 62Q63 48 60 37"/></g><g fill="#649867" stroke="#3c6748" stroke-width="1.2"><path d="M29 45Q4 37 11 25Q29 26 29 45"/><path d="M44 43Q58 24 68 33Q61 46 44 43"/><path d="M65 52Q83 42 93 50Q79 61 65 52"/><path d="M38 56Q15 50 13 56Q23 67 38 56"/><path d="M75 40Q78 27 97 24Q93 42 75 40"/></g><g class="flower-bloom" transform="translate(34 20)"><g fill="#f48d98" stroke="#a85370" stroke-width="1.4"><ellipse cx="0" cy="-8" rx="6" ry="9"/><ellipse cx="8" cy="-2" rx="6" ry="9" transform="rotate(65 8 -2)"/><ellipse cx="5" cy="8" rx="6" ry="9" transform="rotate(135 5 8)"/><ellipse cx="-5" cy="8" rx="6" ry="9" transform="rotate(-135 -5 8)"/><ellipse cx="-8" cy="-2" rx="6" ry="9" transform="rotate(-65 -8 -2)"/></g><circle r="5" fill="#ffdd7e" stroke="#b67f42" stroke-width="1.3"/></g><g class="flower-bloom" transform="translate(54 14) scale(.94)"><g fill="#f7d374" stroke="#b99142" stroke-width="1.3"><ellipse cy="-8" rx="5.8" ry="9"/><ellipse cx="8" cy="2" rx="6" ry="8" transform="rotate(65 8 2)"/><ellipse cx="4" cy="9" rx="6" ry="8" transform="rotate(140 4 9)"/><ellipse cx="-7" cy="6" rx="6" ry="8" transform="rotate(-130 -7 6)"/><ellipse cx="-8" cy="-3" rx="6" ry="8" transform="rotate(-65 -8 -3)"/></g><circle r="4" fill="#8f6442"/></g><g class="flower-bloom" transform="translate(76 22) scale(1.02)"><g fill="#a6a1da" stroke="#7264aa" stroke-width="1.3"><ellipse cy="-8" rx="6" ry="9"/><ellipse cx="8" cy="-1" rx="6" ry="9" transform="rotate(67 8 -1)"/><ellipse cx="5" cy="8" rx="6" ry="9" transform="rotate(135 5 8)"/><ellipse cx="-6" cy="7" rx="6" ry="9" transform="rotate(-135 -6 7)"/><ellipse cx="-8" cy="-2" rx="6" ry="9" transform="rotate(-65 -8 -2)"/></g><circle r="4.6" fill="#f7e1a1"/></g><g class="flower-bloom" transform="translate(22 35) scale(.6)"><g fill="#fff3d4" stroke="#d2b686" stroke-width="2"><ellipse cy="-9" rx="7" ry="10"/><ellipse cx="9" cy="3" rx="7" ry="10" transform="rotate(65 9 3)"/><ellipse cx="-9" cy="3" rx="7" ry="10" transform="rotate(-65 -9 3)"/></g><circle r="5" fill="#edb76e"/></g><g class="flower-bloom" transform="translate(90 37) scale(.67)"><g fill="#ffae80" stroke="#b57554" stroke-width="2"><ellipse cy="-9" rx="7" ry="10"/><ellipse cx="9" cy="3" rx="7" ry="10" transform="rotate(65 9 3)"/><ellipse cx="-9" cy="3" rx="7" ry="10" transform="rotate(-65 -9 3)"/></g><circle r="5" fill="#f7df81"/></g><path d="M13 63H94L85 81H23z" fill="url(#e03-tray)" stroke="#654733" stroke-width="2.5"/><path d="M12 60h83l-4 9H17z" fill="#f3d7a0" stroke="#79523a" stroke-width="2"/><g fill="none" stroke="#a16e46" stroke-width="1.8"><path d="M22 71h65M27 76h55M32 66l6 14M47 66l3 15M63 66l-3 15M78 66l-6 14"/></g><path d="M22 81h63" stroke="#61462f" stroke-width="2.5" stroke-linecap="round"/></svg></span>`;
 return `<span class="load-visual load-cart" data-load-visual="cart" role="img" aria-label="Tea cup handcart"><svg viewBox="0 0 132 72" aria-hidden="true"><path d="M9 18h16l10 31h57l10-25H30" fill="none" stroke="#5b4333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 25h47v20H42z" fill="#d79b60" stroke="#5b4333" stroke-width="2"/><path d="M45 25v20M57 25v20M69 25v20" stroke="#f2d4a0" stroke-width="2" opacity=".9"/><g fill="#f7eee0" stroke="#806b5b" stroke-width="2"><path d="M42 20h13v8a6 6 0 0 1-13 0z"/><path d="M59 20h13v8a6 6 0 0 1-13 0z"/><path d="M76 20h13v8a6 6 0 0 1-13 0z"/></g><circle cx="47" cy="58" r="8" fill="#4b392d"/><circle cx="91" cy="58" r="8" fill="#4b392d"/><circle cx="47" cy="58" r="3" fill="#dfb56f"/><circle cx="91" cy="58" r="3" fill="#dfb56f"/></svg></span>`;
}
// Use the same approved M1 perspective as the isolated route-depth review.
// Scale each actor and attached load together; never change the authoritative C01 pixels.
function actorDimensions(i,p){
 const height=actorHeight(p)*(i===0?1:.90);
 const ratio=i===0?spriteBox.width/spriteBox.height:i===1?450/1024:485/1024;
 return {height,width:height*ratio};
}
function actorStyle(i,p){const d=actorDimensions(i,p);return `--x:${p[0]/16.72}%;--y:${p[1]/9.41}%;--w:${d.width/16.72}%;--h:${d.height/9.41}%`;}
function actor(who,i){const p=actorFeet(i),load=i===0?state.load:'none';return `<div class="actor ${i?'companion':''} ${load==='tea_cart'?'has-cart':''}" data-actor="${who}" data-foot-y="${p[1]}" data-source-height="${actorDimensions(i,p).height}" style="${actorStyle(i,p)}">${load!=='none'?propArt(load==='tea_cart'?'cart':load):''}${art(who)}<span class="actor-label">${names[who]}</span></div>`;}
// Fit the complete painting above the caption dock. Focus is a camera transform
// of the same plate AND all world overlays, never new art or a teleported actor.
function fit(){const space=root.querySelector('.world-space'),world=root.querySelector('.world');if(!space||!world)return;const w=Math.min(space.clientWidth,space.clientHeight*1672/941);world.style.width=w+'px';world.style.height=w*941/1672+'px';}
function world(){const camera=ui.focus??(state.position==='F');const scale=camera?1.6:1;const tx=camera?-60:0,ty=camera?-60:0;
 return `<div class="world-space"><div class="world" aria-label="Market Lane scene"><div class="plane" style="transform:translate(${tx}%,${ty}%) scale(${scale})"><img class="backdrop" src="../public/art/s01e03-market-lane-m0.webp" alt="Painted market with stairs above an arcade, unloading crates, and a wide outside path to books, tea and flowers">${actor('MILO',0)+actor('NIA',1)+actor('FINN',2)}${has(state,'signs')?'<div class="new-signs" aria-label="New signs: WALK to bookstall and CART to tea via the outer lane"><span>WALK · BOOKS →</span><span>CART · TEA →</span></div>':''}<img class="mark" src="../public/art/glyph.svg" alt="Faint old mark on existing stone"></div><div class="scene-note">${ui.moving?'':has(state,'signs')?'Market Lane · Clearer signs':state.load==='tea_cart'?'Cups stay on the cart':state.load==='flowers'?'Keep the flower tray steady':'Market Lane'}</div>${state.phase==='flowers'||state.position==='F'?button(camera?'Whole market':'Flower focus','focus',false,'class="camera"'):''}</div></div>`;}
function caption(){if(!state.queue.length)return '';const l=line();return `<section class="caption" aria-label="Story dialogue"><div class="portrait">${art(l.speaker,true)}</div><div><div class="speaker">${names[l.speaker]}</div><p data-line="${l.id}" aria-live="polite">${esc(l.text)}</p></div><div class="caption-actions">${button('Continue','next',true)}${button('Listen','listen',false,'aria-label="Listen to this line"')}</div></section>`;}
function toolbar(){if(state.queue.length)return '';let b='';
 if(state.travel.length)b=button(ui.moving?'Walking…':'Continue walking','resume',true,ui.moving?'disabled':'');
 else if(['books','tea','flowers'].includes(state.phase))b=state.position===({books:'B',tea:'T',flowers:'F'})[state.phase]?button('Make delivery','deliver',true):button('Walk outer lane','walk',true)+button('Try another route','paths')+button('Not sure yet','unsure');
 else if(state.phase.startsWith('return-'))b=button('Return for next load','return',true);
 else if(state.phase==='comparison')b=button('Compare paths','compare-open',true)+button('Not sure yet','unsure');
 else if(state.phase==='signs')b=button('Make route signs','signs-open',true);
 else if(state.phase==='glyph')b=state.position==='stone'?button('Look at old stone','glyph',true):button('Go to old stone','go-glyph',true);
 else if(state.phase==='memories')b=button(has(state,'station')?'Hear station memory again':'Talk to coordinator','station',!has(state,'station'))+button(has(state,'garden')?'Hear garden memory again':'Talk to garden resident','garden',!has(state,'garden'));
 return b?`<div class="toolbar">${b}</div>`:'';
}
function chronicle(){return `<h2>Wondervale Chronicle</h2><p><strong>Today:</strong> books, cups and flowers reached their shops. The load changed which path could help. Market Lane has clearer signs.</p><div class="chronicle-memories"><p><strong>Market coordinator:</strong> remembers a way to the station.</p><p><strong>Garden resident:</strong> remembers a way to the garden.</p><p><strong>Not yet checked.</strong> These are two memories. We do not yet know when each was true.</p></div><p>The Riverside old crossing stays closed. The old route is still a mystery.</p>`;}
function sheet(){
 if(state.phase==='preview')return `<section class="sheet"><span class="badge">Chapter 03 · Market Lane</span><h1>Three Deliveries, One Wrong Turn</h1><img class="preview-art" src="../public/art/s01e03-market-lane-m0.webp" alt="Market Lane"><p>Help Milo carry three different loads. Look at the paths, compare what fits, and help people find the way.</p><p class="small">The outer lane is open in this preview. Steps and arcade can be inspected; their connecting paths are not open in this preview.</p>${button('Begin Market Lane adventure','begin',true)}</section>`;
 if(state.phase==='chronicle')return `<section class="sheet">${chronicle()}${!state.queue.length?state.chronicleSeen?button('Finish this chapter','finish',true):button('Read the Chronicle','chronicle',true):''}</section>`;
 if(state.phase==='completed'){const next=state.mode==='canonical'&&chapter04Unlocked();return `<section class="sheet"><span class="badge">Chapter complete</span><h1>Different loads, different ways</h1><p>Market Lane remembers the new signs. Two memories are waiting to be explored.</p><div class="next-chapter" role="status"><strong>Chapter 04 · ${next?'Unlocked':'Not unlocked in this preview'}</strong><p>${next?'Your saved adventure is ready for the next story. Chapter 04 is still in production and cannot be played yet.':'Only a completed, saved adventure unlocks the next chapter.'}</p></div>${ui.review?chronicle():''}<div class="actions">${button(ui.review?'Close Chronicle':'Review Chronicle','review')}${button('Replay this chapter','replay')}${state.mode==='canonical'?button('Start E03 again','reset-open'):button('Return to saved chapter','exit-replay')}</div></section>`;}
 return '';
}
function parent(){return `<aside class="parent" aria-label="Parent View"><h2>Parent View</h2><p>This chapter is about routes that fit different loads. Let the child look at the load and the paths, then choose.</p>${state.observed.some(x=>['S','N'].includes(x))&&['tea','comparison','return-tea','flowers','return-flowers','signs','glyph','memories','chronicle','completed'].includes(state.phase)?'<h3>After looking together</h3><p>Which route works for this delivery, and what makes it different from the others?</p><p>Who else might need the wider way?</p>':'<p class="small">A conversation cue appears after the child has seen the steps or narrow entrance with the cup delivery.</p>'}<p>All prompts are optional. The child makes the choice.</p><p class="small">${BUILD} · Captions and optional device Listen. Recorded audio deferred.</p></aside>`;}
function crop(which){const [x,y,w,h]=restricted[which].crop;return `<div class="inspection" style="aspect-ratio:${w}/${h}"><img src="../public/art/s01e03-market-lane-m0.webp" alt="${which==='S'?'Real stone steps in Market Lane':'Real narrow arch entrance beside the unloading crates'}" style="width:${1672/w*100}%;left:${-x/w*100}%;top:${-y/h*100}%"></div>`;}
function modal(){if(!ui.modal)return '';let body='';
 if(ui.modal==='paths'||ui.modal==='comparison'){
  const comparing=ui.modal==='comparison';body=`<h2>${comparing?'What changed for the cart?':'Look at the load and paths'}</h2><div class="path-options"><div>${crop('S')}<h3>Steps</h3><p>A short way for people on foot.</p>${button('Look closely at steps','inspect-S')}</div><div>${crop('N')}<h3>Narrow arcade</h3><p>A narrow entrance with a tight turn.</p>${button('Look closely at arcade','inspect-N')}</div></div>${comparing?'':`<div class="actions">${button('Walk outer lane','walk',true)}${button('Try steps','try-S')}${button('Try narrow arcade','try-N')}</div>`}<p class="small">The outer lane is the continuous paved way around the boxes. In this preview, look at the steps and arcade, then use the open outer lane.</p>${comparing?`<div class="actions">${button('The cart cannot climb steps','reason-steps',true,state.observed.includes('S')?'':'disabled')}${button('The cart needs more room','reason-width',true,state.observed.includes('N')?'':'disabled')}${button('Back to market','close')}</div>`:`<div class="actions">${button('Look at this load','load')}${button('Back to market','close',true)}</div>`}`;
 }else if(ui.modal==='inspection')body=`<h2>${restricted[ui.inspected].label}</h2>${crop(ui.inspected)}<p>${ui.inspected==='S'?'Look at the steps. Can this load use them?':'Look at the entrance beside the crates. Is it wide enough for a loaded cart?'}</p><div class="actions">${button('I can see it','observe',true)}${button('Back','inspection-back')}</div>`;
 else if(ui.modal==='signs')body=`<h2>Help people find their way</h2><p>Choose where each present-day sign points.</p><h3>WALK · Bookstall ${state.signs.includes('WALK')?'✓':''}</h3><div class="actions">${button('Outer lane to books','walk-sign',true)}${button('Through unloading boxes','bad-walk')}</div><h3>CART · Tea ${state.signs.includes('CART')?'✓':''}</h3><div class="actions">${button('Outer lane to tea','cart-sign',true)}${button('Up the steps','bad-cart')}</div>${button('Back to market','close')}`;
 else if(ui.modal==='menu')body=`<h2>Adventure options</h2><p>Progress stays on this device. No child account or recording.</p><div class="actions">${state.mode==='canonical'?button('Start E03 again','reset-open'):button('Return to saved chapter','exit-replay')}${button('Back to market','close',true)}</div><p class="small">E03 engineering preview · ${BUILD}. Owner, physical-device and hidden-route checks remain open.</p>`;
 else if(ui.modal==='reset')body=`<h2>Start E03 again?</h2><p>Erase only this chapter's saved progress and Chronicle on this device?</p><div class="actions">${button('Clear E03 and restart','reset-confirm')}${button('Cancel','close',true)}</div>`;
 return `<div class="modal-wrap"><section class="modal" role="dialog" aria-modal="true" aria-label="${ui.modal==='inspection'?'Path inspection':ui.modal==='comparison'?'Compare paths':ui.modal==='signs'?'Route signs':'Adventure panel'}" tabindex="-1">${body}${state.feedback?`<p role="status">${esc(state.feedback)}</p>`:''}</section></div>`;
}
function preserveWorldVisuals(oldWorld){
 const nextWorld=root.querySelector('.world');
 if(!oldWorld||!nextWorld)return;
 const oldBackdrop=oldWorld.querySelector('.backdrop'),nextBackdrop=nextWorld.querySelector('.backdrop');
 if(oldBackdrop&&nextBackdrop)nextBackdrop.replaceWith(oldBackdrop);
 for(const who of ['MILO','NIA','FINN']){
  const oldActor=oldWorld.querySelector('[data-actor="'+who+'"]'),nextActor=nextWorld.querySelector('[data-actor="'+who+'"]');
  if(!oldActor||!nextActor)continue;
  const oldLoad=oldActor.querySelector('[data-load-visual]')?.getAttribute('data-load-visual')||'none';
  const nextLoad=nextActor.querySelector('[data-load-visual]')?.getAttribute('data-load-visual')||'none';
  if(oldLoad===nextLoad)nextActor.replaceWith(oldActor);
 }
}
function render(){
 const focused=root.querySelector(':focus')?.dataset.a;
 if(!unlocked){root.innerHTML='<main class="sheet"><h1>Market Lane comes after Riverside</h1><p>Finish Riverside and record its Market Lane marker first.</p><a href="../e02/">Return to Riverside</a><p class="small">You can also look at this chapter without changing progress.</p><button data-a="preview">Preview without saving</button></main>';return;}
 const special=sheet();
 const oldWorld=root.querySelector('.world');
 root.innerHTML=`<header><div><strong>Wondervale</strong> <span class="chapter">Three Deliveries, One Wrong Turn</span></div><nav>${button(ui.parent?'Child View':'Parent View','parent',false,'class="phone-parent" aria-expanded="'+ui.parent+'"')}${button('Options','menu',false,ui.moving?'disabled':'')}</nav></header><main class="layout ${ui.parent?'parent-open':''}"><section class="child" aria-label="Market Lane adventure" data-phase="${state.phase}">${state.mode!=='canonical'?'<p class="badge">'+(state.mode==='historical_replay'?'Historical replay':'Chapter preview')+' · no progress changes</p>':''}${special||world()}${ui.artError?'<p class="warning" role="alert">Picture could not load. Please reload before walking.</p>':''}${state.feedback&&!ui.modal?`<div class="feedback" role="status">${esc(state.feedback)}</div>`:''}${toolbar()}${caption()}${ui.storageError?'<p class="warning" role="alert">Saving is unavailable. Play can continue, but a reload may lose progress.</p>':''}${ui.resetError?'<p class="warning" role="alert">Saved E03 progress could not be erased. Nothing was reset.</p>':''}</section>${parent()}</main>${modal()}`;
 preserveWorldVisuals(oldWorld);
 fit();
 if(ui.modal)root.querySelector('.modal')?.focus({preventScroll:true});else if(focused)root.querySelector(`[data-a="${focused}"]`)?.focus({preventScroll:true});
 if(!ui.modal&&lastFocus){root.querySelector(`[data-a="${lastFocus}"]`)?.focus({preventScroll:true});lastFocus=null;}
}
function openModal(kind){lastFocus=document.activeElement?.dataset.a;ui.modal=kind;render();}
function closeModal(){ui.modal=null;render();}
// Animate and commit one legal graph edge at a time. Refresh restores the last
// completed node and the remaining itinerary, never the destination prematurely.
async function walk(){if(ui.moving||!state.travel.length||ui.artError)return;ui.moving=true;ui.focus=false;render();
 while(state.travel.length){const to=state.travel[0],from=[...visual],dest=places[to];const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?1:Math.max(180,Math.hypot(dest[0]-from[0],dest[1]-from[1])*3);
  await new Promise(resolve=>{const start=performance.now();function tick(now){const t=Math.min(1,(now-start)/duration);visual=from.map((n,i)=>n+(dest[i]-n)*t);for(const [i,who] of ['MILO','NIA','FINN'].entries()){const el=root.querySelector('[data-actor="'+who+'"]'),p=actorFeet(i);if(el){const d=actorDimensions(i,p);el.style.setProperty('--x',p[0]/16.72+'%');el.style.setProperty('--y',p[1]/9.41+'%');el.style.setProperty('--w',d.width/16.72+'%');el.style.setProperty('--h',d.height/9.41+'%');el.dataset.footY=p[1];el.dataset.sourceHeight=d.height;}}if(t<1)raf=requestAnimationFrame(tick);else resolve();}raf=requestAnimationFrame(tick);});
  state=dispatch(state,{type:'step',to});save();
 }
 ui.moving=false;ui.focus=null;visual=[...places[state.position]];render();
}
root.addEventListener('click',e=>{const b=e.target.closest('button[data-a]');if(!b||b.disabled)return;const a=b.dataset.a;
 if(a==='preview'){unlocked=true;state=fresh('development_preview');visual=[...places.H];render();return;}
 if(a==='listen'){listen();return;}
 if(a==='parent'){ui.parent=!ui.parent;render();return;}
 if(ui.moving)return;
 if(a==='begin'){act({type:'begin',ready:unlocked});return;}
 if(a==='next'){act({type:'next'});return;}
 if(a==='focus'){ui.focus=!(ui.focus??(state.position==='F'));render();return;}
 if(a==='paths'||a==='compare-open'){openModal(a==='paths'?'paths':'comparison');return;}
 if(a==='inspect-S'||a==='inspect-N'){ui.inspected=a.at(-1);ui.back=ui.modal;openModal('inspection');return;}
 if(a==='observe'){const img=root.querySelector('.inspection img');if(!img?.complete||!img.naturalWidth){state.feedback='Wait for the picture, or reload if it cannot load.';render();return;}state=dispatch(state,{type:'inspect',what:ui.inspected});save();ui.modal=ui.back;render();return;}
 if(a==='inspection-back'){ui.modal=ui.back;render();return;}
 if(a==='load'){act({type:'inspect',what:'load'});return;}
 if(a==='close'){closeModal();return;}
 if(a==='walk'){ui.modal=null;act({type:'take-route',route:'L'});walk();return;}
 if(a==='try-S'||a==='try-N'){ui.modal=null;act({type:'try-route',route:a.slice(-1)});walk();return;}
 if(a==='return'){act({type:'return'});walk();return;}
 if(a==='resume'){walk();return;}
 if(a==='reason-steps'||a==='reason-width'){ui.modal=null;act({type:'compare',reason:a.slice(7)});return;}
 if(a==='signs-open'){openModal('signs');return;}
 if(['walk-sign','cart-sign','bad-walk','bad-cart'].includes(a)){
  state=dispatch(state,{type:'sign',kind:a.includes('walk')?'WALK':'CART',to:a.startsWith('bad')?'blocked':'L'});save();if(has(state,'signs'))ui.modal=null;render();return;
 }
 if(a==='go-glyph'){act({type:'go-glyph'});walk();return;}
 if(a==='station'||a==='garden'){act({type:'memory',which:a});return;}
 if(a==='exit-replay'){unlocked=canonicalReady;state=canonicalReady?restore(read(KEY)):fresh();ui.modal=null;visual=[...places[state.position]];render();return;}
 if(a==='review'){ui.review=!ui.review;render();return;}
 if(a==='menu'){openModal('menu');return;}
 if(a==='reset-open'){openModal('reset');return;}
 if(a==='reset-confirm'&&state.mode==='canonical'){
  try{localStorage.removeItem(KEY);if(localStorage.getItem(KEY)!==null)throw Error();}catch{ui.resetError=true;closeModal();return;}
  globalThis.speechSynthesis?.cancel();state=fresh();visual=[...places.H];ui={...ui,modal:null,review:false,resetError:false,focus:null,storageError:false};render();return;
 }
 if(a==='replay'){state=fresh('historical_replay');visual=[...places.H];ui.review=false;render();return;}
 act({type:a});
});
document.addEventListener('keydown',e=>{
 if(ui.modal){const dialog=root.querySelector('.modal');if(e.key==='Escape'){e.preventDefault();closeModal();return;}if(e.key==='Tab'){const buttons=[...dialog.querySelectorAll('button:not(:disabled),a')];const i=buttons.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();buttons.at(-1)?.focus();}else if(!e.shiftKey&&(i<0||i===buttons.length-1)){e.preventDefault();buttons[0]?.focus();}}}
});
root.addEventListener('error',e=>{if(e.target.matches?.('.backdrop')&&!ui.artError){ui.artError=true;render();}},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden){save();globalThis.speechSynthesis?.cancel();}});
new ResizeObserver(fit).observe(root);
render();
