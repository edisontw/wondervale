// E08 browser-only authoring lab; no production runtime, storage or source claims.
import {VIEWPOINTS,SAFE_EDGES,FIXTURES,FEATURES,MARKERS,
  fresh,dispatch,geometryAt,previewProjection} from '../engine/s01e08-authoring-prototype.mjs';

const $=id=>document.getElementById(id);
const names={base:'Base','lower-landing':'Lower landing',side:'Side lookout'};
const featureNames={brackets:'Brackets',boundary:'Closed upper boundary',
  'lower-a':'Lower lamp A','lower-b':'Lower lamp B','service-plate':'Undated service plate'};
const coords={base:[17,40],'lower-landing':[49,44],side:[82,40]};
let state=fresh();
const actor=document.createElement('div');
actor.className='milo';actor.textContent='Milo';actor.setAttribute('aria-hidden','true');
const adjacent=(a,b)=>SAFE_EDGES.some(([x,y])=>x===a&&y===b||x===b&&y===a);
const both=()=>FIXTURES.every(id=>state.lights[id]);
const ready=()=>['brackets','boundary'].every(id=>state.inspected.includes(id));
const hasTwo=()=>state.observations.some((o,i)=>i>0&&o.viewpoint!==state.observations[0].viewpoint&&
  Math.abs(o.spreadDegrees-state.observations[0].spreadDegrees)>=5);
function act(action){state=dispatch(state,action);render();}
function button(host,label,action,disabled=false,pressed=false){
  const b=document.createElement('button');b.type='button';b.textContent=label;
  b.disabled=disabled;if(pressed)b.setAttribute('aria-pressed','true');
  b.addEventListener('click',()=>act(action));host.append(b);return b;
}
function world(){
  const host=$('scene');host.replaceChildren();
  const label=document.createElement('span');label.className='world-label';
  label.textContent='SYNTHETIC LOWER STEPS';host.append(label);
  const closed=document.createElement('span');closed.className='upper';
  closed.textContent='UPPER HILL CLOSED — NO ROUTE';host.append(closed);
  for(const id of FIXTURES){
    const lamp=document.createElement('span');
    lamp.className='lamp '+(id==='lower-a'?'a':'b')+(state.lights[id]?' on':'');
    lamp.setAttribute('aria-label',featureNames[id]+(state.lights[id]?' on':' off'));
    host.append(lamp);
  }
  for(const anchor of Object.keys(VIEWPOINTS)){
    const b=document.createElement('button');b.type='button';
    b.className='anchor'+(state.miloPosition===anchor?' active':'');
    b.textContent=names[anchor];b.setAttribute('aria-label','Walk Milo to '+names[anchor]);
    b.disabled=state.previewComplete||!adjacent(state.miloPosition,anchor);
    b.style.left=coords[anchor][0]+'%';b.style.top=coords[anchor][1]+'%';
    b.addEventListener('click',()=>act({type:'walk',anchor}));host.append(b);
  }
  host.append(actor);
  actor.style.left=coords[state.miloPosition][0]+'%';
  actor.style.top=(coords[state.miloPosition][1]+27)+'%';
  host.dataset.phase=state.phase;
}
function inspections(){
  const host=$('inspect-controls');host.replaceChildren();
  for(const feature of Object.keys(FEATURES)){
    button(host,'Look: '+featureNames[feature],{type:'inspect',feature},
      state.previewComplete||state.miloPosition!==FEATURES[feature]||
      state.inspected.includes(feature));
  }
  $('inspections').textContent='Milo: '+names[state.miloPosition]+'. Looked at: '+
    (state.inspected.map(x=>featureNames[x]).join(', ')||'nothing yet')+
    '. The upper hill stays closed.';
}
function lights(){
  const host=$('light-controls');host.replaceChildren();
  for(const id of FIXTURES){
    button(host,(state.lights[id]?'Turn off: ':'Turn on: ')+featureNames[id],
      {type:'toggle-lamp',lampId:id},
      state.previewComplete||!ready()||!state.inspected.includes(id),
      state.lights[id]);
  }
  $('light-status').textContent='Lower A: '+(state.lights['lower-a']?'ON':'OFF')+
    '. Lower B: '+(state.lights['lower-b']?'ON':'OFF')+
    '. '+previewProjection(state).message+
    ' Switching a lamp clears old viewpoint evidence; try again.';
}
function views(){
  const host=$('view-controls');host.replaceChildren();
  button(host,'Observe from '+names[state.miloPosition],{type:'observe-view'},
    state.previewComplete||!both()||!ready()||state.observations.length>=8);
  $('view-status').textContent='Recorded: '+(state.observations.map(o=>
    names[o.viewpoint]+' ('+o.spreadDegrees.toFixed(1)+'° spread)').join('; ')||'none yet')+
    '. The three physical model marks stay fixed.';
  $('parent-cue').hidden=state.observations.length===0||state.previewComplete;
}
function card(host,title,observation){
  const el=document.createElement('div');el.className='view-card';
  const h=document.createElement('h3');h.textContent=title;el.append(h);
  const p=document.createElement('p');p.textContent=observation?
    'Angular spread: '+observation.spreadDegrees.toFixed(1)+'°. Same marks A, B, C.':
    'Look from a safe viewpoint with both lower lamps on.';el.append(p);
  const strip=document.createElement('div');strip.className='strip';
  strip.setAttribute('role','img');
  strip.setAttribute('aria-label',observation?
    title+': three fixed markers; angular spread '+observation.spreadDegrees.toFixed(1)+' degrees':
    title+': no observation yet');
  if(observation)for(const [i,m] of observation.angles.entries()){
    const dot=document.createElement('span');dot.className='mark';dot.textContent=MARKERS[i].id.slice(-1).toUpperCase();
    dot.style.left=Math.max(8,Math.min(92,50+m.angleDegrees*.7))+'%';
    dot.style.top=(6+i*31)+'px';strip.append(dot);
  }
  el.append(strip);host.append(el);
}
function compare(){
  const host=$('projections');host.replaceChildren();
  const first=state.comparison?.from||state.observations[0]||null;
  const second=state.comparison?.to||
    state.observations.find(o=>first&&o.viewpoint!==first.viewpoint)||null;
  card(host,'FROM HERE'+(first?' — '+names[first.viewpoint]:''),first);
  card(host,'FROM THERE'+(second?' — '+names[second.viewpoint]:''),second);
  const controls=$('compare-controls');controls.replaceChildren();
  button(controls,'Compare two viewpoints',{type:'compare-views'},
    state.previewComplete||state.compared||!hasTwo());
  button(controls,'Confirm model preview',{type:'confirm-preview'},
    state.previewComplete||!state.compared||!state.inspected.includes('service-plate'));
  $('comparison').textContent=state.comparison?
    'The same three marks look different from two places. Gap difference: '+
      state.comparison.spreadDifferenceDegrees.toFixed(1)+'°. A line-up is not historical proof.':
    'A single view is not proof. Try a second safe lookout; then compare.';
  const p=previewProjection(state);
  $('chronicle').textContent='MODEL OBSERVATIONS: '+state.observations.length+
    ' view(s); '+(p.servicePlate?'undated service plate, source pending':'service plate not inspected')+
    '. '+(state.previewComplete?'Two views compared; uncertainty kept.':'No conclusion yet.')+
    ' Canonical events: 0; unlocks: 0; historical claims: 0.';
  $('hook').hidden=!state.previewComplete;
  $('hook').textContent=state.previewComplete?
    'Model complete. E09: safe North Hill survey only — NOT UNLOCKED. Upper hill remains closed.':'';
}
function render(){world();inspections();lights();views();compare();}
$('restart').addEventListener('click',()=>act({type:'reset'}));
render();