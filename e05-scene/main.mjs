// E05 isolated future scene shell: reuses strict station and mock-source reducers.
import {fresh,dispatch,can,view} from './scene-model.mjs';
let state=fresh();
const $=id=>document.getElementById(id);
const actionOf=b=>{
  if(b.dataset.scene==='nav')return {scene:'nav',type:b.dataset.type};
  const a={type:b.dataset.type};
  if(b.dataset.value)a.value=b.dataset.value;
  if(b.dataset.card)a.card=b.dataset.card;
  if(b.dataset.slot)a.slot=b.dataset.slot;
  return {scene:b.dataset.scene,action:a};
};
function render(){
  const v=view(state);
  for(const id of ['foyer','records','layout','review'])$(id).hidden=v.stage!==id;
  $('speaker').textContent=v.speaker;
  $('line').textContent=v.line;
  $('stage-text').textContent=v.stageText;
  $('foyer-map').textContent='Milo at '+v.station.milo+' · inspected '+(v.station.inspected.join(', ')||'nothing')+
    ' · replica '+(v.station.orientation||'not tried')+' · fit '+
    (v.station.fit===null?'not checked':v.station.fit?'two marks align':'marks do not align');
  $('record-map').textContent='Milo at '+v.sources.milo+' · MOCK A: '+(v.sources.placements.a||'not placed')+
    ', '+(v.sources.tested.a||'not checked')+' · MOCK B: '+(v.sources.placements.b||'not placed')+
    ', '+(v.sources.tested.b||'not checked')+'. Maker/date/original: UNKNOWN for both.';
  $('layout-map').textContent=v.station.mapRoom?'PAPER Map Room: table placed, walkway clear':
    v.station.table?'Trial table '+v.station.table+' · walkway '+(v.station.clear?'clear':'BLOCKED'):
      'Foyer paper floor: empty; public walkway clear';
  $('paper-note').textContent=v.paperChronicle||'No canonical Chronicle.';
  $('parent').textContent=v.parentCue?'Optional parent cue: '+v.parentCue:'Parent: allow Milo to observe and try first.';
  $('guard').textContent='Production E05 LOCKED · E04 canonical completion absent · access/source approval absent · E06 NOT UNLOCKED';
  for(const b of document.querySelectorAll('button[data-scene]')){
    const a=actionOf(b);b.disabled=!can(state,a);
    if(b.dataset.type==='walk')b.setAttribute('aria-pressed',String((a.scene==='station'?v.station.milo:v.sources.milo)===b.dataset.value));
    if(b.dataset.type==='try-copy')b.setAttribute('aria-pressed',String(v.station.orientation===b.dataset.value));
    if(b.dataset.type==='place-table')b.setAttribute('aria-pressed',String(v.station.table===b.dataset.value));
  }
}
document.querySelectorAll('button[data-scene]').forEach(b=>b.addEventListener('click',()=>{
  state=dispatch(state,actionOf(b));render();
}));
render();
