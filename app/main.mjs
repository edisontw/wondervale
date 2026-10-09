import {fresh,dispatch,restore,payload,projection,near,locations,constrainToRoad,roadRoute,KEY,groups} from '../engine/episode.mjs';
const content=await fetch('public/episode.json').then(r=>r.json());
const root=document.getElementById('app');
let saved=null;try{saved=JSON.parse(localStorage.getItem(KEY));}catch{}
let state=restore(saved),prefs={audio:false,motion:!matchMedia('(prefers-reduced-motion: reduce)').matches,motor:false,...saved?.preferences};
let ui={parent:false,parentCollapsed:false,map:false,pause:false,storageError:false,moving:false,mapClosed:false,recap:!!state.recap,reread:null,resetConfirm:false,resetError:false,parentPreview:false,rubCompleted:false,rubReady:false};
const short=(who,n)=>`S01E01-${who}-${String(n).padStart(3,'0')}`;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(label,action,attrs='')=>`<button data-action="${action}" ${attrs}>${esc(label)}</button>`;
const char=(name)=>['MILO','NIA','FINN'].includes(name)?`<svg aria-hidden="true" viewBox="${({MILO:'60 0 465 1024',NIA:'545 0 450 1024',FINN:'1025 0 485 1024'})[name]}"><image href="public/art/trio-sprites.webp" width="1536" height="1024"/></svg>`:name==='STEWARD'?'<img src="public/art/steward.webp" alt="">':'<span aria-hidden="true" style="font-size:38px">❧</span>';
// The scene uses the approved full-body trio atlas. Dialogue portraits instead
// crop a single speaker to safe, non-overlapping atlas regions. No new identity art.
const portrait=(name)=>{
 const crops={MILO:'95 12 425 474',NIA:'555 18 435 474',FINN:'1045 18 445 474'};
 return crops[name]
  ? `<svg class="portrait-art" aria-hidden="true" viewBox="${crops[name]}" preserveAspectRatio="xMidYMid slice"><image href="public/art/trio-sprites.webp" width="1536" height="1024"/></svg>`
  : '<span class="portrait-mark" aria-hidden="true">✦</span>';
};
const line=id=>content.lines[id];
function speakLines(ids,manual=false){
 if((!manual&&!prefs.audio)||!('speechSynthesis' in window))return false;
 const selected=ids.map(id=>line(id)).filter(Boolean);
 if(!selected.length)return false;
 try{
  speechSynthesis.cancel();
  const voices=speechSynthesis.getVoices();
  const voice=voices.find(v=>v.lang==='en-US')||voices.find(v=>v.lang.startsWith('en'))||null;
  for(const l of selected){
   const u=new SpeechSynthesisUtterance(l.exact_text);
   u.lang='en-US';u.rate=.86;u.voice=voice;
   speechSynthesis.speak(u);
  }
  return true;
 }catch{return false;}
}
const speak=id=>speakLines([id]);
function reread(ids,scope){
 const played=speakLines(ids,true); // Explicit action works even with autoplay turned off.
 ui.reread={scope,message:played?'Reading aloud again.':'Audio unavailable. Read the words shown above.'};
 render();
}
function resetSavedAdventure(){
 // Erase only Wondervale's versioned story progress; do not touch unrelated site data.
 try{
  localStorage.removeItem(KEY);
  if(localStorage.getItem(KEY)!==null)throw new Error('Saved progress remains');
 }catch{ui.resetError=true;render();return;}
 globalThis.speechSynthesis?.cancel();
 state=fresh();
 prefs={audio:false,motion:!matchMedia('(prefers-reduced-motion: reduce)').matches,motor:false};
 ui={parent:false,parentCollapsed:false,map:false,pause:false,storageError:false,moving:false,mapClosed:false,recap:false,reread:null,resetConfirm:false,resetError:false,parentPreview:false};
 render();
}
function save(){const p=payload(state,prefs);if(!p)return;try{localStorage.setItem(KEY,JSON.stringify(p));ui.storageError=false;}catch{ui.storageError=true;}}
function act(action){
 if(ui.pause||ui.recap||ui.moving)return;
 // Engine rejects cleaning while a dialogue queue is active; do not mark the
 // on-screen dust removed until the engine actually accepts the action.
 if(action.type==='clean'&&(state.queue.length||state.phase!=='marker_search'||!state.plateFound||state.markerRevealed))return;
 ui.reread=null;
 const previous=state;state=dispatch(state,action);
 if(action.type==='clean'&&state.after==='reveal'){ui.rubCompleted=true;ui.rubReady=false;}if(state.phase!==previous.phase){ui.map=false;ui.mapClosed=false;}save();ui.moving=action.type==='move'&&prefs.motion&&state.position.some((v,i)=>v!==previous.position[i]);render();if(state.queue[0]!==previous.queue[0])speak(state.queue[0]);if(ui.moving)animateTravel(previous.position,state.position);}
function animateTravel(from,to){
 const actor=root.querySelector('.actor.milo');
 if(!actor){ui.moving=false;return;}
 const route=roadRoute(from,to);
 if(route.length<2){ui.moving=false;render();return;}
 const lengths=[0];
 for(let i=1;i<route.length;i++)lengths.push(lengths[i-1]+Math.hypot(route[i][0]-route[i-1][0],route[i][1]-route[i-1][1]));
 const total=lengths.at(-1);
 if(!total||!Number.isFinite(total)){ui.moving=false;render();return;}
 const frames=route.map(([x,y],i)=>({offset:lengths[i]/total,left:`${x*100}%`,top:`${y*100}%`}));
 const duration=Math.min(2300,Math.max(350,total*2600));
 let done=false;
 const finish=()=>{if(done)return;done=true;ui.moving=false;render();};
 const timer=setTimeout(finish,duration+100);
 try{
  const a=actor.animate(frames,{duration,easing:'linear'});
  a.finished.catch(()=>{}).then(()=>{clearTimeout(timer);finish();});
 }catch{clearTimeout(timer);finish();}
}
function mapArt(){return `<svg class="map-art" viewBox="0 0 760 390" role="img" aria-label="Old paper with a faded line, an unnamed outlined shape, round fountain, large tree and old holes behind a newer paper"><path d="M25 23 L715 20 L735 358 L26 367 L18 170Z" fill="#ead9b1" stroke="#ac8e65" stroke-width="3"/><path class="line" d="M110 218 Q220 172 280 218 Q400 254 467 160 Q525 166 552 268 L650 293"/><g class="feature"><ellipse cx="282" cy="223" rx="44" ry="19"/><ellipse cx="282" cy="218" rx="32" ry="13" fill="none"/><path d="M282 207v-31m-12 5q12 8 24 0" fill="none"/><path d="M471 167v55m-10 0h20"/><path d="M438 151q-22-22 3-37q-10-32 26-31q22-28 40 2q36-2 32 31q27 20 0 39q-6 17-30 9q-30 18-50-2Z"/></g><image href="public/art/glyph.svg" x="572" y="65" width="112" height="112"/><g class="holes"><circle cx="220" cy="100" r="8"/><circle cx="244" cy="122" r="8"/><circle cx="219" cy="144" r="8"/></g><path d="M52 27H209L204 87L172 127L53 112Z" fill="#fff5db" stroke="#b5a48d" stroke-width="2"/><path d="M173 127l5-36 26-4" fill="#efdab2" stroke="#b5a48d" stroke-width="2"/>${state.sketch?'<path d="M90 324H640" stroke="#9f8663" stroke-width="1"/>':''}${state.anchors.includes('fountain')?'<g class="map-confirmed" role="img" aria-label="Fountain checked"><circle cx="282" cy="183" r="18"/><path d="M273 183l7 8 14-17"/></g>':''}${state.anchors.includes('large_tree')?'<g class="map-confirmed" role="img" aria-label="Big tree checked"><circle cx="484" cy="128" r="18"/><path d="M475 128l7 8 14-17"/></g>':''}</svg>`;}
// The atlas has two complete reference posts. During rubbing, an intact dirty
// frame is erased to expose the clean frame + ink underneath; the underlying
// canonical marker event is still committed only on Finish cleaning.
function plate(clean,cleanFace=clean,pending=false){
 const letters='<span class="plate-word"><span>RIVER</span><span>SIDE</span></span><span class="arrow" aria-hidden="true">→</span>';
 return `<div class="plate-close ${clean?'clean':''}" role="img" aria-label="${clean?'Clean old plate with RIVERSIDE and a right arrow':'Old post awaiting cleaning'}">${cleanFace?'<div class="plate-clean-surface" aria-hidden="true"></div>':''}${clean||pending?`<div class="plate-text ${pending?'plate-preview-text':''}">${letters}</div>`:''}</div>`;
}
function world(){const nonInteractive=['preview','opening'].includes(state.phase);const pos=nonInteractive?[.34,.77]:constrainToRoad(...state.position);const nia=nonInteractive?[.48,.72]:constrainToRoad(pos[0]+.04,pos[1]+.035),finn=nonInteractive?[.23,.70]:constrainToRoad(pos[0]-.04,pos[1]+.025),steward=constrainToRoad(state.plateFound?.86:.22,state.plateFound?.63:.62);const show=state.markerRevealed||state.phase==='completed'&&projection(state.ledger).markerVisible;const stage=`<div class="viewport" id="viewport"><div class="world" id="world" ${nonInteractive?'aria-label="Town Square illustration. Begin or continue the story to explore."':'tabindex="0" aria-label="Town Square. Use arrow keys or choose a place to walk Milo."'}>${nonInteractive?'':Object.entries(locations).filter(([x])=>x!=='bench').map(([target,p])=>`<button class="spot" style="left:${p[0]*100}%;top:${(target==='fountain'?50:p[1]*100-9)}%" data-action="walk:${target}" aria-label="Walk to ${({board:'the noticeboard',fountain:'the fountain',large_tree:'the big tree',marker:'the old post'})[target]}" ><span class="spot-symbol" aria-hidden="true">${({board:'▤',fountain:'≈',large_tree:'♧',marker:'▯'})[target]}</span></button>`).join('')}${show?'<span class="marker-original-ink" role="img" aria-label="Original old post now reads RIVERSIDE and points right"><span>RIVER</span><span>SIDE</span><span class="ink-arrow">→</span></span>':''}<div class="actor steward" style="left:${steward[0]*100}%;top:${steward[1]*100}%">${char('STEWARD')}</div><div class="actor companion" style="left:${nia[0]*100}%;top:${nia[1]*100}%">${char('NIA')}</div><div class="actor companion" style="left:${finn[0]*100}%;top:${finn[1]*100}%">${char('FINN')}</div><div class="actor milo" style="left:${pos[0]*100}%;top:${pos[1]*100}%">${char('MILO')}<span class="milo-label">Milo</span></div></div></div>`;
if(nonInteractive)return stage;return stage+`<div class="navigation" aria-label="Choose where Milo walks">${button('Noticeboard','walk:board')}${button('Fountain','walk:fountain')}${button('Big tree','walk:large_tree')}${button('Old post','walk:marker')}</div>`;}
function actions(){if(ui.moving)return '<div class="action-dock" role="status">Walking to the place…</div>';if(state.queue.length)return '';let b='';if(state.phase==='square_explore'){
 if(near(state,'board'))b=button(line(short('UI',1)).exact_text,'hold','class="primary"');
 for(const t of ['fountain','large_tree'])if(near(state,t))b=button('Look closely',`ambient:${t}`,'class="primary"');
}if(state.phase==='square_compare'){
 const atFountain=near(state,'fountain'),atTree=near(state,'large_tree');
 if(atFountain&&!state.anchors.includes('fountain'))b=button('Compare the round mark','compare:fountain','class="primary"');
 else if(atTree&&!state.anchors.includes('large_tree'))b=button('Compare the tree mark','compare:large_tree','class="primary"');
 else b='<span class="comparison-guide" role="status">'+(state.anchors.length===2?'Both landmarks matched.':atFountain||atTree?'This landmark is matched. Find the other place.':'Walk to the Fountain or Big tree, then compare its shape.')+'</span>';
}
if(state.phase==='marker_search'&&near(state,'marker'))b=state.plateFound?'<span role="status">Rub the old plate to clean it. A keyboard alternative is below.</span>':button('Look at the old post','findPlate','class="primary"');
if(state.markerRevealed&&state.phase==='chronicle_close')b=button('Finish this page','finish','class="primary"')+button('Look at the mark again','inspectMarker');return `<div class="action-dock">${b}</div>`;}
function sceneBody(){const p=state.phase;
 if(p==='preview')return `<div class="scene-heading"><span class="eyebrow">Season 1 · Episode 1</span><h1>The Map Behind the Board</h1><p>Meet Milo, Nia and Finn in Town Square. Press Begin, then read every story line with Continue. You can explore after the introduction.</p></div>${world()}<div class="action-dock">${button('Begin','begin','class="primary"')}${button('Parent preview','parent-preview')}</div>`;
 if(p==='map_observe'&&ui.mapClosed)return `<div class="scene-heading"><h1>Town Square</h1></div>${world()}<div class="action-dock">${button('Open the old map','open-map','class="primary"')}</div>`;
 if(p==='map_observe')return `<div class="scene-heading"><span class="eyebrow">Town Square · Old paper</span><h1>${line(short('UI',2)).exact_text}</h1></div>${world()}<div class="action-dock">${button('Open the old map','open-map','class="primary"')}</div><section class="scene-map-sheet map-task" role="region" aria-label="Study the old map"><div class="sheet-heading"><strong>Look closely at the old map</strong>${button('Back to Square','close-map')}</div>${mapArt()}<div class="evidence-actions">${['line','blank_shape','layer_holes'].map((r,i)=>button(['Look at the line','Look at the shape','Look at the paper'][i],`inspect:${r}`,`aria-pressed="${state.inspected.includes(r)}"`)).join('')}</div>${state.inspected.length>=2&&!state.queue.length?`<div class="choices" aria-label="Milo's guess">${['A','B','C'].map((c,i)=>button(line(short('MILO',13+i)).exact_text,`guess:${c}`)).join('')}</div>`:''}${state.sketch?'<p class="notice">Nia’s drawing keeps the line and unnamed shape.</p>':''}</section>`;
 if(['chronicle_close','completed'].includes(p))return `<div class="chronicle"><span class="eyebrow">Wondervale Chronicle</span><h2>${content.chronicle.title}</h2>${mapArt()}<div class="chronicle-columns"><div><h3>What we found</h3><ul>${content.chronicle.found.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><h3>What we wonder</h3><ul>${content.chronicle.wonder.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div><div class="memory-pair">${plate(false)}${plate(true)}</div>${p==='completed'?`<p class="notice">Town Square remembers. The old mark stays clear.</p><div class="row">${button('Visit Town Square','present')}${button('Replay this memory','replay')}</div>`:actions()}</div>`;
 let title={opening:'A normal day in Town Square',square_explore:'Walk with Milo',square_compare:line(short('UI',5)).exact_text,marker_search:state.plateFound?line(short('UI',8)).exact_text:line(short('UI',9)).exact_text}[p];
 return `<div class="scene-heading"><span class="eyebrow">Town Square</span><h1>${esc(title)}</h1></div>${world()}${state.phase==='square_compare'?`<p class="comparison-progress" role="status">Old map clues: Fountain ${state.anchors.includes('fountain')?'✓':'○'} · Big tree ${state.anchors.includes('large_tree')?'✓':'○'}. Walk to each place, then select Map to check the paper.</p>`:''}${actions()}${p==='square_explore'&&groups.board.indexOf(state.queue[0])>=5?`<div class="close-panel"><div class="board-close" role="img" aria-label="Old paper preserved behind the current notice"></div></div>`:''}${p==='marker_search'&&state.plateFound?`<div class="close-panel" id="plate-swipe">
<p class="rub-guide">${state.queue.length?(ui.rubCompleted?'Dust cleared. Continue the story to uncover the old writing.':'Listen to the story first. Then you can rub the plate.'):state.markerRevealed?'The old writing is clear.':ui.rubCompleted?'The dust is gone. Continue the story to reveal the writing.':'Rub the middle of the post until the hidden writing is clear.'}</p>
<div class="plate-rub-wrap ${!state.queue.length&&!state.markerRevealed&&!ui.rubCompleted?'rub-loading':''}">${plate(state.markerRevealed,ui.rubCompleted||(!state.queue.length&&!state.markerRevealed),ui.rubCompleted&&!state.markerRevealed)}${!state.queue.length&&!state.markerRevealed&&!ui.rubCompleted?'<canvas id="plate-ink-preview" width="240" height="300" aria-hidden="true"></canvas><canvas id="plate-rub" width="240" height="300" role="img" aria-label="Old post: rub the picture to reveal the writing beneath"></canvas>':''}</div>
${state.queue.length?`<div class="rub-next" role="status"><p>Read the next line to continue.</p>${button('Continue story','next','class="primary"')}</div>`:!state.markerRevealed&&!ui.rubCompleted?`<div class="rub-progress"><p id="rub-status" role="status">Writing uncovered: 0%. Rub over the hidden writing.</p><progress id="rub-meter" max="100" value="0" aria-label="Writing uncovered"></progress><div class="rub-actions">${button('Finish cleaning','rub-finish','class="primary" disabled')}${button('Clean without rubbing','clean','class="secondary"')}</div></div>`:state.markerRevealed?'<p class="rub-guide" role="status">The old writing has been revealed.</p>':'<p class="rub-guide" role="status">Dust cleared. Continue the story to uncover the mark.</p>'}
</div>`:''}${ui.map?`<section class="scene-map-sheet map-optional" role="region" aria-label="Old map"><div class="sheet-heading"><strong>Old map</strong>${button('Close map','map','class="primary"')}</div>${mapArt()}</section>`:''}`;
}
function caption(){const q=state.queue[0];if(!q)return '';const l=line(q);return `<section class="caption" aria-label="Story dialogue" aria-live="polite" aria-atomic="true"><div class="portrait portrait-${esc(l.speaker.toLowerCase())}">${portrait(l.speaker)}</div><div class="caption-message"><div class="speaker">${esc(l.speaker==='NARRATOR'?'Story':l.speaker==='UI'?'Look & play':l.speaker[0]+l.speaker.slice(1).toLowerCase())}</div><p class="text" data-line-id="${q}">${esc(l.exact_text)}</p>${ui.reread?.scope==='caption'?`<p role="status" class="reread-status">${esc(ui.reread.message)}</p>`:''}</div><div class="caption-actions" role="group" aria-label="Story dialogue controls">${button('Continue','next','class="primary"')}${button('Read again','read')}${state.phase==='opening'?'':button('Skip dialogue','skip','class="secondary"')}</div></section>`;}
function parent(){const eligible=state.cueOffered;return `<aside class="parent ${ui.parent?'mobile-open':''}" aria-label="Parent View"><span class="eyebrow">Alongside your child</span><h2>Parent View</h2><div class="mobile-only">${button('Back to Child View','parent')}</div><p>${esc(content.parent.preview)}</p>${eligible?`<div class="notice" id="parent-cue"><h3>One question to share</h3><p>${esc(content.parent.cue)}</p><p>${esc(content.parent.followup)}</p><p>${esc(content.parent.fallback)}</p></div>`:'<p class="meta">A short question will be available after your child looks at the map.</p>'}${['chronicle_close','completed'].includes(state.phase)?`<h3>After the story</h3><p>${esc(content.parent.reflection)}</p>`:''}<h3>Comfort & support</h3><label><input type="checkbox" data-setting="audio" ${prefs.audio?'checked':''}>Read aloud</label><label><input type="checkbox" data-setting="motion" ${prefs.motion?'checked':''}>Gentle movement</label><label><input type="checkbox" data-setting="motor" ${prefs.motor?'checked':''}>Single-action assistance</label><p class="meta">Read-aloud uses this device’s synthetic English voice for the prototype. Recorded character performances and music are still in production.</p><p class="meta">Progress stays on this device. No account, microphone or child-response recording.</p><div class="restart-tools"><h3>Start over</h3><p class="meta">Erase this device’s Wondervale story progress and episode unlocks.</p>${button("Start new adventure","reset-request")}</div><p class="meta">Build ${content.buildId}</p></aside>`;}
let lastRenderedPhase=null;
function render(){const focused=document.activeElement?.dataset?.action;
 const previousSceneScroll=lastRenderedPhase===state.phase?(root.querySelector('.scene-card')?.scrollTop||0):0;
 root.className=prefs.motion?'':'motion-off';root.innerHTML=`<header><div><div class="brand">Wondervale</div><div class="episode-title">The Map Behind the Board</div></div><div class="tools">${['square_compare','marker_search'].includes(state.phase)?button('Map','map',`aria-expanded="${ui.map}"`):''}${button(state.cueOffered?'Parent •':'Parent','parent',`class="mobile-only" aria-expanded="${ui.parent}" aria-label="Parent"`)}${button(ui.parentCollapsed?'Show parent':'Hide parent','parent-collapse','class="desktop-only"')}</div></header><main class="layout ${ui.parentCollapsed?'parent-hidden':''}"><div class="child ${ui.parent?'mobile-hidden':''}"><section class="scene-card">${sceneBody()}</section>${caption()}${state.mode==='historical_replay'?`<div class="footer">Historical memory · present progress stays safe. ${button('Leave replay','exitReplay')}</div>`:''}${ui.storageError?'<p role="alert">Progress could not be saved. Keep this page open to continue.</p>':''}</div>${ui.parentCollapsed&&!ui.parent?'':parent()}</main><footer>Explore. Notice. Wonder together.</footer>${ui.recap&&!ui.resetConfirm?`<div class="overlay"><section class="dialog" role="dialog" aria-modal="true" aria-label="Story so far"><h2>Story so far</h2>${state.recap.map(id=>`<p data-line-id="${id}">${esc(line(id).exact_text)}</p>`).join('')}<div class="row">${button('Continue the story','dismiss-recap','class="primary"')}${button('Read again','read-recap')}${button('Start new adventure','reset-request')}</div>${ui.reread?.scope==='recap'?`<p role="status" class="reread-status">${esc(ui.reread.message)}</p>`:''}</section></div>`:''}${ui.parentPreview&&!ui.resetConfirm&&!ui.pause&&!ui.recap?`<div class="overlay"><section class="dialog" role="dialog" aria-modal="true" aria-label="Parent preview"><h2>Before your child begins</h2><p>${esc(content.parent.preview)}</p>${button('Back to the story','parent-preview-close','class="primary"')}</section></div>`:''}${ui.resetConfirm?`<div class="overlay reset-overlay"><section class="dialog" role="dialog" aria-modal="true" aria-label="Confirm new adventure"><h2>Start a new adventure?</h2><p>This will erase your Wondervale story progress, discoveries and episode unlocks on this device. You cannot undo this.</p><div class="row">${button('Keep my progress','reset-cancel','class="primary"')}${button('Erase progress and restart','reset-confirm','class="danger"')}</div>${ui.resetError?'<p role="alert">Progress could not be erased. Your saved adventure has not been changed.</p>':''}</section></div>`:''}`;
root.removeAttribute('aria-busy');initPlateRub();
 const scene=root.querySelector('.scene-card');if(scene&&lastRenderedPhase===state.phase)scene.scrollTop=previousSceneScroll;
 lastRenderedPhase=state.phase;
 if(focused)root.querySelector(`[data-action="${focused}"]`)?.focus({preventScroll:true});
 const viewport=root.querySelector('.viewport');if(viewport&&innerWidth<=760)viewport.scrollLeft=Math.max(0,state.position[0]*760-viewport.clientWidth/2);
 if(ui.parentPreview)setTimeout(()=>root.querySelector('.dialog button')?.focus(),0);if(ui.resetConfirm)setTimeout(()=>root.querySelector('.reset-overlay .dialog button')?.focus(),0);else if(ui.pause||ui.recap)setTimeout(()=>root.querySelector('.dialog button')?.focus(),0);
}
root.addEventListener('click',event=>{const b=event.target.closest('[data-action]');if(!b){if(event.target.closest('#world')&&!event.target.closest('.spot')){const rect=root.querySelector('#world').getBoundingClientRect();act({type:'move',x:(event.clientX-rect.left)/rect.width,y:(event.clientY-rect.top)/rect.height});}return;}
const [type,value]=b.dataset.action.split(':');
if(type==='reset-request'){ui.resetConfirm=true;ui.resetError=false;globalThis.speechSynthesis?.cancel();render();return;}
if(type==='reset-cancel'){ui.resetConfirm=false;ui.resetError=false;render();return;}
if(type==='reset-confirm'){resetSavedAdventure();return;}
if(type==='rub-finish'){if(ui.rubReady&&!state.queue.length)act({type:'clean'});return;}
if(ui.resetConfirm)return;
if(type==='close-map'){ui.mapClosed=true;render();return;}if(type==='open-map'){ui.mapClosed=false;render();return;}if(type==='parent-preview'){ui.parentPreview=true;render();return;}if(type==='parent-preview-close'){ui.parentPreview=false;render();return;}if(type==='parent'){ui.parent=!ui.parent;render();return;}if(type==='parent-collapse'){ui.parentCollapsed=!ui.parentCollapsed;render();return;}if(type==='map'){ui.map=!ui.map;render();return;}if(type==='dismiss-recap'){ui.recap=false;ui.reread=null;delete state.recap;render();return;}if(type==='read-recap'){reread(state.recap||[],'recap');return;}if(type==='read'){reread(state.queue.slice(0,1),'caption');return;}
if(type==='replay'){state=fresh('historical_replay',state.ledger);ui.map=false;ui.rubCompleted=false;ui.rubReady=false;render();return;}if(type==='exitReplay'){state=restore(JSON.parse(localStorage.getItem(KEY)));ui.recap=!!state.recap;ui.rubCompleted=false;ui.rubReady=false;render();return;}if(type==='present'){ui.present=true;root.querySelector('.scene-card').innerHTML=`<div class="scene-heading"><h1>Town Square</h1></div>${world()}<div class="action-dock">${button('Back to the Chronicle','chronicle')}</div>`;return;}if(type==='chronicle'){ui.present=false;render();return;}
if(type==='walk')act({type:'move',target:value});else if(type==='inspect')act({type:'inspect',region:value});else if(type==='ambient')act({type:'ambient',target:value});else if(type==='guess')act({type:'guess',choice:value});else if(type==='compare')act({type:'compare',symbol:value});else act({type});
});
root.addEventListener('change',event=>{const setting=event.target.dataset.setting;if(!setting)return;prefs[setting]=event.target.checked;save();render();});
root.addEventListener('keydown',event=>{if(event.key==='Escape'){if(ui.resetConfirm){ui.resetConfirm=false;ui.resetError=false;}else{ui.pause=false;ui.map=false;ui.parent=false;ui.parentPreview=false;}render();return;}if(event.target.closest('.dialog')){if(event.key==='Tab'){const list=[...event.target.closest('.dialog').querySelectorAll('button')];if(event.shiftKey&&event.target===list[0]){event.preventDefault();list.at(-1).focus();}else if(!event.shiftKey&&event.target===list.at(-1)){event.preventDefault();list[0].focus();}}return;}
if(event.target.id==='world'&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','w','a','s','d'].includes(event.key)){event.preventDefault();const x=state.position[0],y=state.position[1];act({type:'move',x:x+(['ArrowRight','d'].includes(event.key)?.05:['ArrowLeft','a'].includes(event.key)?-.05:0),y:y+(['ArrowDown','s'].includes(event.key)?.04:['ArrowUp','w'].includes(event.key)?-.04:0)});}});
// Whole-post 240x300 rubbing restored at the owner's request. The scratch
// layer is a *copy of the approved dirty original image* rather than a flat
// paint rectangle, and wiping it reveals the clean original with RIVERSIDE
// already drawn underneath. Both images stay aligned throughout the gesture.
// No canonical discovery is saved until explicit Finish cleaning / clean bypass.
// The hit surface remains the whole original picture, but "done" describes
// whether the central writing can be read, not whether unrelated wood/roof has
// been erased. 6×8 evenly spaced witness cells cover the inscription and arrow.
const RUB={width:240,height:300,brush:16,ink:{x:88,y:96,w:58,h:80,cols:6,rows:8,needed:36}};
let rubbingCanvas=null,rubbingCtx=null,rubbingPointer=null,rubbingLast=null,rubbingCells=null;
function initPlateRub(){
 const canvas=root.querySelector('#plate-rub');
 if(!canvas||canvas===rubbingCanvas)return;
 rubbingCanvas=canvas;rubbingCtx=canvas.getContext('2d');rubbingCells=new Set();rubbingLast=null;rubbingPointer=null;
 if(!rubbingCtx)return;
 const ink=root.querySelector('#plate-ink-preview'),inkCtx=ink?.getContext('2d');
 if(inkCtx){
  inkCtx.clearRect(0,0,RUB.width,RUB.height);
  inkCtx.textAlign='center';inkCtx.textBaseline='middle';
  inkCtx.fillStyle='#493b29';
  inkCtx.font='700 11px system-ui, sans-serif';inkCtx.fillText('RIVER',116,117);
  inkCtx.fillText('SIDE',116,133);
  inkCtx.font='700 18px system-ui, sans-serif';inkCtx.fillText('→',116,153);
 }
 // Avoid briefly showing the clean reference/letters before the original
 // cover has loaded. A disabled scratch target remains over the dirty base.
 const image=new Image();
 image.onload=()=>{
  if(!canvas.isConnected||rubbingCanvas!==canvas)return;
  const ctx=rubbingCtx;ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,RUB.width,RUB.height);
  const drawnWidth=RUB.width*2.05,drawnHeight=drawnWidth*image.naturalHeight/image.naturalWidth;
  ctx.drawImage(image,(RUB.width-drawnWidth)*.18,(RUB.height-drawnHeight)/2,drawnWidth,drawnHeight);
  canvas.closest('.plate-rub-wrap')?.classList.add('rubbing-active');
 };
 image.onerror=()=>{
  if(!canvas.isConnected||rubbingCanvas!==canvas)return;
  rubbingCtx.globalCompositeOperation='source-over';
  rubbingCtx.fillStyle='rgba(116,90,62,.94)';
  rubbingCtx.fillRect(0,0,RUB.width,RUB.height);
  canvas.closest('.plate-rub-wrap')?.classList.add('rubbing-active');
 };
 image.src='public/art/marker-reference.webp';
}
function rubPoint(event){
 const canvas=rubbingCanvas,ctx=rubbingCtx;
 if(!canvas?.isConnected||!canvas.closest('.rubbing-active')||!ctx||!rubbingCells||state.queue.length||ui.rubCompleted||ui.rubReady)return;
 const b=canvas.getBoundingClientRect();if(b.width<1||b.height<1)return;
 const x=Math.max(0,Math.min(RUB.width-1,(event.clientX-b.left)*RUB.width/b.width));
 const y=Math.max(0,Math.min(RUB.height-1,(event.clientY-b.top)*RUB.height/b.height));
 const prev=rubbingLast||[x,y];
 ctx.globalCompositeOperation='destination-out';
 ctx.lineWidth=RUB.brush*2;ctx.lineCap='round';ctx.lineJoin='round';
 ctx.beginPath();ctx.moveTo(prev[0],prev[1]);ctx.lineTo(x,y);ctx.stroke();
 // Only count genuinely rubbed points over the plaque inscription. Strokes
 // on the roof or wooden post still erase the artwork, but do not inflate the
 // meter; otherwise RIVERSIDE can be legible with the meter stuck at ~50%.
 const target=RUB.ink;
 const distance=Math.hypot(x-prev[0],y-prev[1]),steps=Math.max(1,Math.ceil(distance/4));
 for(let i=0;i<=steps;i++){
  const px=prev[0]+(x-prev[0])*i/steps,py=prev[1]+(y-prev[1])*i/steps;
  for(let row=0;row<target.rows;row++)for(let col=0;col<target.cols;col++){
   const cx=target.x+(col+.5)*target.w/target.cols;
   const cy=target.y+(row+.5)*target.h/target.rows;
   if(Math.hypot(cx-px,cy-py)<=RUB.brush)rubbingCells.add(row*target.cols+col);
  }
 }
 rubbingLast=[x,y];
 const progress=Math.min(100,Math.round(rubbingCells.size/target.needed*100));
 const status=root.querySelector('#rub-status'),meter=root.querySelector('#rub-meter');
 if(meter)meter.value=progress;
 if(status)status.textContent='Writing uncovered: '+progress+'%. '+(progress<100?'Rub over the middle writing.':'Ready! Select Finish cleaning to continue.');
 if(rubbingCells.size>=RUB.ink.needed){
  ui.rubReady=true;
  const finish=root.querySelector('[data-action="rub-finish"]');
  if(finish){finish.disabled=false;finish.focus({preventScroll:true});}
 }
}
// Some touch devices synthesize pointerdown/up on a focused button but omit
// the subsequent click after a canvas scrubbing gesture. Accept a short,
// deliberate touch release on Finish cleaning without relying on that click.
let finishTouch=null;
root.addEventListener('pointerdown',event=>{
 const target=event.target.closest('[data-action="rub-finish"]');
 if(event.pointerType==='touch'&&target&&!target.disabled)
  finishTouch={pointerId:event.pointerId,x:event.clientX,y:event.clientY};
});
root.addEventListener('pointerup',event=>{
 if(!finishTouch||finishTouch.pointerId!==event.pointerId)return;
 const wasTap=Math.hypot(event.clientX-finishTouch.x,event.clientY-finishTouch.y)<22;
 finishTouch=null;
 if(wasTap&&event.target.closest('[data-action="rub-finish"]')&&ui.rubReady&&!state.queue.length){
  event.preventDefault();act({type:'clean'});
 }
});
root.addEventListener('pointercancel',event=>{
 if(finishTouch?.pointerId===event.pointerId)finishTouch=null;
});
root.addEventListener('pointerdown',event=>{
 if(event.target.id!=='plate-rub'||!rubbingCanvas||state.markerRevealed||state.queue.length||ui.rubReady)return;
 event.preventDefault();rubbingPointer=event.pointerId;rubbingLast=null;
 // Native touch already has implicit capture. An explicit capture could swallow
 // a subsequent tap on Finish cleaning on mobile Chromium.
 rubPoint(event);
});
root.addEventListener('pointermove',event=>{
 if(event.pointerId!==rubbingPointer||!rubbingCanvas?.isConnected)return;
 event.preventDefault();rubPoint(event);
});
root.addEventListener('pointerup',event=>{
 if(event.pointerId!==rubbingPointer)return;
 rubPoint(event);rubbingPointer=null;rubbingLast=null;
});
root.addEventListener('pointercancel',event=>{
 if(event.pointerId===rubbingPointer){rubbingPointer=null;rubbingLast=null;}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden){globalThis.speechSynthesis?.cancel();save();}});
render();if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
