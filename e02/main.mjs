import {E01_KEY,KEY,BUILD,VERSION,places,route,e01Ready,fresh,restore,payload,dispatch,projected} from '../engine/s01e02.mjs';

const root=document.querySelector('#app');
const content=await fetch('../public/s01e02.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Missing E02 script data');return r.json();});
if(content.count!==81||content.version!==VERSION||content.build!==BUILD)throw Error('E02 script mismatch');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lines=content.lines;
const line=id=>lines[id]||{speaker:'UI',text:'...'};
const voice=id=>{if(!id||!('speechSynthesis'in window))return;try{speechSynthesis.cancel();const l=line(id),u=new SpeechSynthesisUtterance(l.text);u.lang='en-US';u.rate=.87;speechSynthesis.speak(u);}catch{}};
function read(key){try{return JSON.parse(localStorage.getItem(key));}catch{return null;}}
const unlocked=e01Ready(read(E01_KEY));
let state=restore(read(KEY)),ui={parent:false,map:false,storageError:false,moving:false,recentAudio:'',showCue:false,focus:null,resetConfirm:false,completedReview:false,artError:null,artRetry:0};
if(!unlocked)state=fresh();
const button=(label,action,attrs='',primary=false)=>'<button '+(primary?'class="primary" ':'')+'data-a="'+esc(action)+'" '+attrs+'>'+esc(label)+'</button>';
const ref=name=>({MILO:'60 0 465 1024',NIA:'545 0 450 1024',FINN:'1025 0 485 1024'})[name];
function sprite(name){
 return '<svg aria-hidden="true" viewBox="'+ref(name)+'" preserveAspectRatio="xMidYMid meet"><image href="../public/art/trio-sprites.webp" width="1536" height="1024"/></svg>';
}
function portrait(name){
 const crop=({MILO:'95 12 425 474',NIA:'555 18 435 474',FINN:'1045 18 445 474'})[name];
 return crop?'<svg aria-hidden="true" viewBox="'+crop+'" preserveAspectRatio="xMidYMid slice"><image href="../public/art/trio-sprites.webp" width="1536" height="1024"/></svg>':'<span class="portrait-mark" aria-hidden="true">❧</span>';
}
function save(){
 const p=payload(state);if(!p)return;
 try{localStorage.setItem(KEY,JSON.stringify(p));ui.storageError=false;}catch{ui.storageError=true;}
}
// Advance a line without replacing the scene, images, or focused Continue.
function updateCurrentLine(){
 const caption=root.querySelector('.caption:not(.idle)');
 if(!caption||!state.queue.length)return false;
 const l=line(state.queue[0]);
 const name=caption.querySelector('.caption-speaker');
 const text=caption.querySelector('.caption-text');
 const face=caption.querySelector('.portrait');
 if(!name||!text||!face)return false;
 name.textContent=speakerName(l.speaker);
 text.textContent=l.text;
 text.dataset.line=l.id;
 text.scrollTop=0;
 face.innerHTML=portrait(l.speaker);
 const counter=caption.querySelector('.caption-buttons .small');
 if(counter)counter.textContent=state.queue.length+' line(s) left';
 return true;
}
function doAction(a){
 if(ui.moving)return;
 const was=state;
 state=dispatch(state,a);save();
 const sameScene=state.phase===was.phase&&state.view===was.view;
 if(!(a.type==='next'&&sameScene&&state.queue.length&&updateCurrentLine()))render();
 if(state.queue.length)voice(null); // Never autoplay; Listen is the deliberate replay action.
}
// Independently painted R0 art is not registered to the engine's 1600x900
// topology. These are image-specific actor FEET locations on paved foreground.
// Only the canonical graph controls where Milo is legally allowed to travel.
const stageStops={
 spawn:[19,88],plaza:[30,88],oldSpurFork:[41,88],oldStones:[49,88],
 promenadeEast:[59,88],publicSideFork:[66,88],sidePathMiddle:[71,88],
 lookoutEntry:[76,88],lookoutView:[81,88]
};
function coords(name,i){
 const [lead,y]=stageStops[state.position]||stageStops.spawn;
 const x=i===0?lead:lead<30?lead+i*14:lead>70?lead-i*14:lead+(i===1?-14:14);
 return [Math.max(8,Math.min(92,x)),y];
}
function actor(name,i){
 const [x,y]=coords(name,i);
 return '<div class="actor '+(i?'companion':'milo')+'" data-actor="'+name+'" style="--x:'+x+'%;--y:'+y+'%">'+sprite(name)+'<span class="actor-label">'+name.charAt(0)+name.slice(1).toLowerCase()+'</span></div>';
}
function travel(to){
 if(ui.moving||state.queue.length||!['explore','market'].includes(state.phase))return;
 const points=route(state.position,to);
 if(!points.length)return;
 // R1/R2 are unrelated camera compositions. Never animate a route on those
 // pictures; restore the R0 promenade before walking.
 if(state.view!=='r0'){state=dispatch(state,{type:'close-detail'});save();render();}
 const prefersReduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const path=points.map(k=>stageStops[k]);
 const duration=Math.min(1350,Math.max(260,points.length*180));
 if(prefersReduce||points.length<2){doAction({type:'go',to});return;}
 ui.moving=true;
 const target=root.querySelector('[data-actor="MILO"]');
 const frames=path.map((p,i)=>({offset:i/(path.length-1),left:p[0]+'%',top:p[1]+'%'}));
 if(!target){ui.moving=false;doAction({type:'go',to});return;}
 try{
  const animation=target.animate(frames,{duration,easing:'linear'});
  animation.finished.catch(()=>{}).then(()=>{ui.moving=false;doAction({type:'go',to});});
 }catch{ui.moving=false;doAction({type:'go',to});}
}
function viewUrl(){return '../public/art/s01e02-riverside-'+state.view+'.webp'+(ui.artRetry?'?retry='+ui.artRetry:'');}
function renderWorld(){
 if(state.phase==='preview')return '';
 const exploring=state.phase==='explore',market=state.phase==='market';
 const detail=state.view!=='r0';
 const alt=state.view==='r1'?'Old stone landings at the former connection':state.view==='r2'?'Current river gap and edge viewed safely from the public lookout':'Riverside public promenade, a closed old spur and a protected lookout';
 const picture=ui.artError===state.view
  ?'<div class="art-error" role="alert"><p>Riverside picture could not load.</p>'+button('Retry picture','retry-art')+'</div>'
  :'<img class="backdrop" src="'+viewUrl()+'" data-view="'+state.view+'" loading="eager" decoding="async" alt="'+alt+'">';
 return '<div class="world'+(detail?' inspection-view':'')+'" id="world" data-view="'+state.view+'" aria-label="Riverside illustrated scene with safe public paths">'+
  picture+
  (detail?'<span class="view-tag">'+(state.view==='r1'?'Old stones · Close-up':'Lookout · Close-up')+'</span>':'')+
  (!detail&&ui.artError!==state.view&&(exploring||market)
   ?'<button class="hotspot old" data-a="go-stones" aria-label="Walk to old stones">Old stones</button>'+
    '<button class="hotspot lookout" data-a="go-lookout" aria-label="Walk to public lookout">Lookout</button>'+
    (exploring?'<button class="hotspot closed" data-a="closed">Closed path</button>':'')
   :'')+
  (!detail&&state.market?'<span class="market-sign" aria-label="Old mark toward Market Lane">MARKET LANE →</span>':'')+
  (!detail&&ui.artError!==state.view?actor('MILO',0)+actor('NIA',1)+actor('FINN',2):'')+
  '</div>';
}
const speakerName=s=>({MILO:'Milo',NIA:'Nia',FINN:'Finn',NARRATOR:'Narrator',UI:'Story'})[s]||s;
function queuePanel(){
 if(!state.queue.length)return '<div class="caption idle" aria-label="Story dialogue"><div class="portrait"><span class="portrait-mark" aria-hidden="true">❧</span></div><div><div class="caption-speaker">Riverside</div><p class="caption-text">Choose what Milo does next.</p></div></div>';
 const l=line(state.queue[0]);
 const speaker=speakerName(l.speaker);
 return '<section class="caption" aria-label="Story dialogue"><div class="portrait">'+portrait(l.speaker)+'</div><div><div class="caption-speaker">'+esc(speaker)+'</div><p class="caption-text" data-line="'+esc(l.id)+'">'+esc(l.text)+'</p><div class="caption-buttons">'+
 button('Continue','next','',true)+button('🔊','listen','aria-label="Listen to this line" title="Listen"')+
 '<span class="small">'+state.queue.length+' line(s) left</span></div></div></section>';
}
function statusPanel(){
 const p=projected(state);
 return '<div class="status" role="status">'+(p.stones?'Old stones seen · ':'')+(p.gap?'Gap seen · ':'')+
 (p.lookout?'Lookout discovered · ':'')+(p.revised?'Milo revised his idea · ':'')+
 (p.market?'Old route mark recorded':'')+'</div>';
}
function navigation(){
 if(state.queue.length&&state.phase!=='notebook')return '';
 const ph=state.phase,p=projected(state);
 if(ph==='preview')return '<section class="card"><h2>Follow the Riverside clue</h2><p>The old marker in Town Square pointed here. Milo, Nia, and Finn want to see what is really there.</p>'+
 button('Begin Riverside adventure','begin','',true)+'</section>';
 if(ph==='intro')return '';
 if(ph==='explore'&&state.view!=='r0')return '<div class="actions detail-actions">'+button('Back to Riverside','close-detail','',true)+'</div>';
 if(ph==='explore')return '<div class="actions">'+
 button('Walk to old stones','go-stones')+button('Go to public lookout','go-lookout')+
 (state.position==='oldStones'?button('Look at old stones','inspect-stones'):'')+
 (state.position==='lookoutView'?button('Look across','inspect-gap'):'')+
 (state.observed.length?button('Open old map','map'):'')+
 (p.stones&&p.gap?button('Open evidence notebook','notebook'):'')+
 '</div>';
 if(ph==='notebook')return '<section class="card notebook-sheet" id="notebook" aria-label="Nia’s evidence notebook">'+
 '<h2>Nia’s evidence notebook</h2><p class="notebook-question">Milo thought only the fence changed. Which fact does not fit?</p>'+
 '<div class="evidence notebook-evidence"><button data-a="fact-stones" '+(state.queue.length?'disabled':'')+'><img src="../public/art/s01e02-riverside-r1.webp" alt="Old stones on both sides"><span>Old stones on both banks</span></button>'+
 '<button data-a="fact-gap" '+(state.queue.length?'disabled':'')+'><img src="../public/art/s01e02-riverside-r2.webp" alt="The open gap and missing deck today"><span>No bridge deck today</span></button></div>'+
 '<div class="notebook-footer">'+button('Not sure yet','unsure',state.queue.length?'disabled':'')+
 '<p class="notebook-feedback" role="status">'+esc(state.lastFeedback)+'</p></div></section>';
 if(ph==='revision')return '<section class="card" id="revision"><h2>What can Milo say now?</h2><p>We can describe what changed without guessing the cause.</p>'+
 '<div class="actions">'+button('The bridge was here before. It is not here now.','revision-A','',true)+
 button('I was wrong about only the fence.','revision-B')+button('Not sure yet','unsure')+'</div>'+
 '<p>'+esc(state.lastFeedback)+'</p></section>';
 if(ph==='market')return '<section class="card" id="market"><h2>A clue for another day</h2><p>Return by the public path to the safe lookout. Something old is on the nearby wayfinding fixture.</p>'+
 '<div class="actions">'+button('Go to public lookout','go-lookout')+
 (state.position==='lookoutView'?button('Look at the old mark','inspect-market','',true):'')+'</div></section>';
 if(ph==='chronicle')return '<section class="card" id="chronicle"><h2>Wondervale Chronicle · Then and Now</h2>'+
 '<div class="evidence"><div><img src="../public/art/s01e02-riverside-r1.webp" width="100%" alt="Old route stones"><p><strong>Then:</strong> the old crossing was here.</p></div>'+
 '<div><img src="../public/art/s01e02-riverside-r2.webp" width="100%" alt="Current open gap"><p><strong>Now:</strong> the deck is gone. We do not know why.</p></div></div>'+
 '<p>The Riverside Overlook is a safe place to revisit. A route mark points toward Market Lane.</p>'+
 (state.chronicleSeen?button('Finish this chapter','finish','',true):button('Read the Chronicle','chronicle','',true))+'</section>';
 if(ph==='completed')return '<section class="card"><h2>Chapter complete</h2><p>Milo changed his idea after looking at the evidence. The old bridge remains closed, and the safe lookout is remembered.</p><p>Next chapter: Market Lane (not yet available).</p>'+
 button(ui.completedReview?'Close Chronicle review':'Review the Chronicle','show-chronicle')+
 (ui.completedReview?'<p><strong>Then:</strong> old stones marked a crossing. <strong>Now:</strong> the deck is gone. <strong>Unknown:</strong> why it changed. The safe overlook remains available.</p>':'')+
 button('Start E02 again','reset-prompt')+'</section>';
 return '';
}
function parentPanel(){
 return '<aside class="parent '+(ui.parent?'shown-on-phone':'')+'" id="parent" aria-label="Parent View"><h2>Parent View</h2>'+
 '<p>'+esc(content.parent.preview)+'</p>'+
 (state.offeredCue?'<h3>When the child compares the two facts</h3><p>'+esc(content.parent.cue)+'</p>':'<p class="small">A conversation cue appears after the child has inspected both facts.</p>')+
 (state.phase==='completed'?'<h3>After the story</h3><p>'+esc(content.parent.reflection)+'</p>':'')+
 '<p class="small">All parent prompts are optional. Milo makes the choice.</p></aside>';
}
function render(){
 const paintedWorld=renderWorld();
 if(!unlocked){
  root.innerHTML='<header><div class="brand">Wondervale</div></header><main class="outer" style="display:block"><section class="card"><h1>Riverside is next</h1><p>Finish the Town Square chapter and reveal the RIVERSIDE marker first. Your E01 progress is never changed here.</p><p><a href="../">Return to Town Square</a></p></section></main>';return;
 }
 const markup='<header><div><a class="brand" href="../">Wondervale</a><h1 class="title">Episode 02 · The Bridge That Stops</h1></div><button class="parent-toggle" data-a="parent" aria-expanded="'+ui.parent+'">Child / Parent View</button></header>'+
 '<main class="outer '+(ui.parent?'phone-parent-open':'')+'"><section class="child phase-'+esc(state.phase)+'"><div class="scene-card"><div class="headline"><div class="byline">Milo · Nia · Finn · Riverside</div><h1>Find the way that is safe today</h1>'+
 '<p>Closed old crossing · Open public path · Protected lookout</p></div>'+
 (['notebook','revision','completed'].includes(state.phase)?'':paintedWorld?'<div class="world-frame">'+paintedWorld+'</div>':'')+(['notebook','revision','completed'].includes(state.phase)?'':statusPanel())+navigation()+'</div>'+
 (state.phase==='notebook'&&!state.queue.length?'':queuePanel())+
 (ui.map?'<div class="scene-modal" role="dialog" aria-modal="true" aria-label="Old map fragment"><section class="card" id="old-map"><h2>Old map fragment</h2><p>An old line points toward Riverside. We do not yet know how the present bank changed.</p>'+button('Close map','close-map')+'</section></div>':'')+
 (ui.resetConfirm?'<section class="card"><p>Start E02 again? This only clears the E02 draft; Town Square progress stays.</p>'+button('Yes, start E02 again','reset-confirm')+button('Cancel','reset-cancel')+'</section>':'')+
 (ui.storageError?'<p class="warning">Saving is unavailable in this browser session. You can continue, but this progress may not survive a reload.</p>':'')+
 '<p class="footer">E02 first playable engineering preview · '+BUILD+' · C01 characters / captions · No recorded voice yet</p></section>'+parentPanel()+'</main>';
 // Keep a decoded background in place when a phase or dialogue ends.
 const previous=root.querySelector('.world img.backdrop');
 const fragment=document.createElement('template');
 fragment.innerHTML=markup;
 const upcoming=fragment.content.querySelector('.world img.backdrop');
 if(previous&&upcoming&&previous.getAttribute('src')===upcoming.getAttribute('src')){
  upcoming.replaceWith(previous);
 }
 root.replaceChildren(fragment.content);
}
root.addEventListener('click',e=>{
 const btn=e.target.closest('button[data-a]');if(!btn||btn.disabled)return;
 const a=btn.dataset.a;
 if(a==='parent'){ui.parent=!ui.parent;render();return;}
 if(a==='listen'){voice(state.queue[0]);return;}
 if(a==='retry-art'){ui.artError=null;ui.artRetry++;render();return;}
 if(a==='next'){doAction({type:'next'});return;}
 if(a==='close-detail'){doAction({type:'close-detail'});return;}
 if(a==='go-stones'){travel('oldStones');return;}
 if(a==='go-lookout'){travel('lookoutView');return;}
 if(a==='closed'){doAction({type:'closed'});return;}
 if(a==='inspect-stones'){doAction({type:'inspect',what:'stones'});return;}
 if(a==='inspect-gap'){doAction({type:'inspect',what:'gap'});return;}
 if(a==='fact-stones'||a==='fact-gap'){doAction({type:'fact',choice:a.slice(5)});return;}
 if(a==='revision-A'||a==='revision-B'){doAction({type:'revision',choice:a.slice(-1)});return;}
 if(a==='unsure'){doAction({type:'unsure'});return;}
 if(a==='inspect-market'){doAction({type:'market'});return;}
 if(a==='map'){ui.map=true;doAction({type:'map'});return;}
 if(a==='close-map'){ui.map=false;render();return;}
 if(a==='reset-prompt'){ui.resetConfirm=true;render();return;}
 if(a==='reset-cancel'){ui.resetConfirm=false;render();return;}
 if(a==='reset-confirm'){try{localStorage.removeItem(KEY);}catch{}state=fresh();ui.resetConfirm=false;render();return;}
 if(a==='show-chronicle'){ui.completedReview=!ui.completedReview;render();return;}
 doAction({type:a});
});
document.addEventListener('keydown',e=>{
 if(!unlocked||ui.moving||state.queue.length||!['explore','market'].includes(state.phase)||e.target instanceof HTMLButtonElement)return;
 if(e.key==='Escape'&&state.view!=='r0'){e.preventDefault();doAction({type:'close-detail'});return;}
 if(e.key==='ArrowRight'){e.preventDefault();travel('lookoutView');}
 if(e.key==='ArrowLeft'){e.preventDefault();travel('oldStones');}
});
// Image errors must never show an empty painting without an explanation.
root.addEventListener('error',e=>{
 if(e.target.matches?.('img.backdrop')&&e.target.dataset.view===state.view){
  ui.artError=state.view;render();
 }
},true);
// Rotation and browser UI resize are handled by CSS, not a full DOM teardown.
document.addEventListener('visibilitychange',()=>{if(document.hidden){save();globalThis.speechSynthesis?.cancel();}});
render();
