// E07 browser authoring lab. Imports only the isolated deterministic model, not production.
import {
  ANCHORS,ANCHOR_EDGES,BOARD,BASELINE,RESIDENT_PATH,WATER_PATH,SNAPS,
  fresh,dispatch,previewProjection,evaluateLayout
} from '../engine/s01e07-authoring-prototype.mjs';

const $=id=>document.getElementById(id);
const names={'entry':'Entry','shared-path':'Shared path','channel':'Water channel','workbench':'Model bench'};
const coords={'entry':[12,59],'shared-path':[36,40],'channel':[62,59],'workbench':[86,40]};
const snapNames={
  'short-crossing':'Finn short crossing',
  'side-offset':'Upper side detour',
  'path-clear-water-blocked':'Path clear, water blocked',
  'channel-clear-path-blocked':'Water clear, path blocked',
  'lower-offset':'Lower side detour'
};
const kinds=['milo','resident','water'];
const kindNames={milo:'Milo',resident:'Another person',water:'Water'};
let state=fresh();
const actor=document.createElement('div');
actor.className='milo';actor.textContent='Milo';
actor.setAttribute('aria-hidden','true');
const adjacent=(from,to)=>ANCHOR_EDGES.some(([a,b])=>
  a===from&&b===to||a===to&&b===from);
const firstComplete=()=>kinds.every(k=>!!state.firstTrials[k]);
const revisedComplete=()=>kinds.every(k=>!!state.revisedTrials[k]);
const revisedPass=()=>revisedComplete()&&kinds.every(k=>
  state.revisedTrials[k].pass&&
  state.revisedTrials[k].layoutHash===evaluateLayout(state.currentSnap).layoutHash);
const ready=()=>state.observed.includes('shared-path')&&
  state.observed.includes('channel')&&state.miloPosition==='workbench';
function act(action){
  state=dispatch(state,action);
  render();
}
function button(host,label,action,disabled=false,pressed=false){
  const b=document.createElement('button');
  b.type='button';b.textContent=label;b.disabled=disabled;
  if(pressed)b.setAttribute('aria-pressed','true');
  b.addEventListener('click',()=>act(action));
  host.append(b);
  return b;
}
function world(){
  const host=$('scene');host.replaceChildren();
  const label=document.createElement('span');label.className='world-label';
  label.textContent='SYNTHETIC CONNECTOR PASSAGE';
  host.append(label);
  for(const anchor of ANCHORS){
    const b=document.createElement('button');b.className='anchor'+
      (state.miloPosition===anchor?' active':'');
    b.type='button';b.textContent=names[anchor];
    b.setAttribute('aria-label','Walk Milo to '+names[anchor]);
    b.disabled=state.previewComplete||!adjacent(state.miloPosition,anchor);
    b.style.left=coords[anchor][0]+'%';b.style.top=coords[anchor][1]+'%';
    b.addEventListener('click',()=>act({type:'walk',anchor}));
    host.append(b);
  }
  host.append(actor);
  actor.style.left=coords[state.miloPosition][0]+'%';
  actor.style.top=(coords[state.miloPosition][1]+22)+'%';
  host.dataset.phase=state.phase;
}
function inspections(){
  const host=$('inspect-controls');host.replaceChildren();
  for(const anchor of ['shared-path','channel']){
    button(host,'Look: '+names[anchor],{type:'inspect',anchor},
      state.phase!=='inspect'||state.miloPosition!==anchor||state.observed.includes(anchor));
  }
  $('observations').textContent='Milo: '+names[state.miloPosition]+
    '. Looked at: '+(state.observed.map(x=>names[x]).join(', ')||'nothing yet')+
    '. Walk only to a neighboring place. Walking is not the same as looking.';
}
function result(kind,trial){
  if(!trial)return kindNames[kind]+': NEEDS TEST';
  return kindNames[kind]+': '+(trial.pass?'PASS':'BLOCKED')+
    (kind==='milo'?' ('+trial.steps+' steps)':
      trial.overlaps.length?' (overlap '+trial.overlaps.join(', ')+')':' (clear)');
}
function trials(){
  const host=$('trial-controls');host.replaceChildren();
  for(const kind of kinds){
    const first=state.phase==='inspect'||state.phase==='first-trial';
    const permitted=first?(
      kind==='milo'?state.phase==='inspect'&&ready():
        state.phase==='first-trial'&&ready()&&!state.firstTrials[kind]
    ):state.phase==='revise'&&ready()&&state.currentSnap!==BASELINE&&
      !state.revisedTrials[kind];
    button(host,'Test '+kindNames[kind],{type:'test-'+kind},!permitted);
  }
  $('trial-results').textContent='FIRST — '+kinds.map(k=>result(k,state.firstTrials[k])).join(' · ')+
    '. A short route working for Milo is not enough.';
  $('parent-cue').hidden=!state.firstTrials.milo;
}
function snaps(){
  const host=$('snap-controls');host.replaceChildren();
  for(const id of Object.keys(SNAPS)){
    button(host,'Place: '+snapNames[id],{type:'place-piece',pieceId:'connector',snapId:id},
      state.phase!=='revise'||state.miloPosition!=='workbench'||id===state.currentSnap,
      state.currentSnap===id);
  }
  const revision=$('revision-controls');revision.replaceChildren();
  button(revision,'Undo piece',{type:'undo-piece'},
    state.phase!=='revise'||state.previousSnaps.length===0);
  button(revision,'Run all three traces',{type:'run-all-traces'},
    state.phase!=='revise'||state.currentSnap===BASELINE||revisedComplete()||!ready());
  $('revision-results').textContent='NOW — '+snapNames[state.currentSnap]+
    '. '+kinds.map(k=>result(k,state.revisedTrials[k])).join(' · ')+
    '. Moving the piece clears previous NOW tests; retest the new footprint.';
}
function board(){
  const host=$('board');host.replaceChildren();
  const layout=evaluateLayout(state.currentSnap);
  const footprint=new Set(layout.footprint);
  const resident=new Set(RESIDENT_PATH);
  const water=new Set(WATER_PATH);
  const trace=new Set(layout.traces.milo.path);
  for(let y=0;y<BOARD.height;y++)for(let x=0;x<BOARD.width;x++){
    const id=x+','+y,route=footprint.has(id),r=resident.has(id),w=water.has(id);
    const c=document.createElement('div');
    c.className='cell'+(route?' route':'')+(r?' resident':'')+
      (w?' water':'')+(route&&(r||w)?' overlap':'')+(trace.has(id)?' trace':'');
    c.textContent=(route&&(r||w))?'!':(id===BOARD.start?'S':
      id===BOARD.finish?'E':route?'·':r?'R':w?'W':'');
    c.setAttribute('title','Cell '+id+
      (route?', connector':'')+(r?', resident path':'')+(w?', water channel':''));
    host.append(c);
  }
  host.setAttribute('aria-label','Synthetic 8 by 7 model, '+snapNames[state.currentSnap]+
    '. Milo '+(layout.traces.milo.pass?'can pass':'blocked')+
    ', another person '+(layout.traces.resident.pass?'clear':'blocked')+
    ', water '+(layout.traces.water.pass?'clear':'blocked'));
}
function comparison(){
  const p=previewProjection(state);
  const host=$('compare-controls');host.replaceChildren();
  button(host,'Compare FIRST and NOW',{type:'compare-layouts'},
    state.phase!=='revise'||state.currentSnap===BASELINE||!revisedPass());
  button(host,'Confirm model preview',{type:'confirm-preview'},state.phase!=='compare');
  const first=evaluateLayout(BASELINE),now=evaluateLayout(state.currentSnap);
  const fmt=x=>'Milo '+(x.traces.milo.pass?'PASS':'BLOCKED')+
    '; person '+(x.traces.resident.pass?'PASS':'BLOCKED')+
    '; water '+(x.traces.water.pass?'PASS':'BLOCKED');
  $('comparison').textContent=(state.compared?
    'FIRST: '+fmt(first)+'. NOW: '+fmt(now)+'. The revised model leaves a way for all three.':
    'Compare becomes available after three successful NOW tests on one layout. ')+
    ' Phase: '+state.phase+'. '+p.message;
  $('hook').hidden=!state.previewComplete;
  $('hook').textContent=p.stepsHook||'';
  $('chronicle').textContent='MODEL OBSERVATIONS: '+
    (state.observed.map(x=>names[x]).join(', ')||'none')+
    '. FIRST: '+(firstComplete()?'tested':'incomplete')+
    '. NOW: '+(revisedComplete()?'tested':'needs retest')+
    '. '+(state.previewComplete?'Provisional connector shown; Finn revises his idea. ':
      'No connector built. ')+
    'Real terrain, permission and historical evidence remain unknown. '+
    'Canonical events: 0; unlocks: 0; historical claims: 0.';
}
function render(){world();inspections();trials();snaps();board();comparison();}
$('restart').addEventListener('click',()=>act({type:'reset'}));
render();
