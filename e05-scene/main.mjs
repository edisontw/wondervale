// E05 isolated future scene shell: reuses strict station and mock-source reducers.
import {fresh,dispatch,can,view} from './scene-model.mjs';
import {fresh as freshE06} from '../e06-scene/scene-model.mjs';
import {fresh as freshE07} from '../e07-scene/scene-model.mjs';
import {fresh as freshE08} from '../e08-scene/scene-model.mjs';
import {decodeMemoryLantern,encodeMemoryLantern} from '../authoring-labs/e04-e08-scene-transfer.mjs';
import {decodeMemoryGardenShortcut,encodeMemoryGardenShortcut} from '../authoring-labs/e04-e07-scene-transfer.mjs';
import {decodeStationGardenTransfer,encodeStationGardenTransfer} from '../authoring-labs/e05-e06-scene-transfer.mjs';
import {decodeMemoryStationGardenTransfer,encodeMemoryStationGardenTransfer}
 from '../authoring-labs/e04-e06-scene-transfer.mjs';
const lantern=decodeMemoryLantern(location.hash);
const extended=lantern||decodeMemoryGardenShortcut(location.hash);
const arcIncoming=extended||decodeMemoryStationGardenTransfer(location.hash);
const incoming=decodeStationGardenTransfer(location.hash);
let state=arcIncoming?.e05||incoming?.e05||fresh(),
 linkedE06=arcIncoming?.e06||incoming?.e06||freshE06(),
 linkedE07=extended?.e07||freshE07(),linkedE08=lantern?.e08||freshE08();
const linkedE04=arcIncoming?.e04||null;
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
  const g=v.gardenMap;
  const garden=$('garden-map');garden.replaceChildren();
  const grid=document.createElement('div');grid.className='trace-grid';
  for(const [i,name] of ['lower pocket','middle path','upper hill'].entries()){
    const cell=document.createElement('div');cell.className='trace-cell';
    const title=document.createElement('strong');title.textContent=name;cell.append(title);
    const label=document.createElement('small');
    const lower=i===0&&g.inspected.includes('older'),upper=i===2&&g.inspected.includes('present');
    label.textContent=g.overlay?(lower?'LOWER PAPER mark':upper?'UPPER PAPER mark':'no mark'):
      lower?'LOWER mark on first sheet':upper?'UPPER mark on second sheet':'not yet observed';
    cell.append(label);grid.append(cell);
  }
  const legend=document.createElement('p');legend.textContent='MODEL GRID — not real geography. '+
    (g.overlay?'Two marks shown together; no date or cause known.':'Inspect both PAPER sheets before overlay.')+
    (g.question?' E06 question recorded on PAPER only.':'');
  garden.append(grid,legend);
  const memoryFragment=linkedE04&&(lantern?
  (encodeMemoryLantern(linkedE04,state,linkedE06,linkedE07,linkedE08)||
   encodeMemoryGardenShortcut(linkedE04,state,linkedE06,linkedE07)):
  extended?encodeMemoryGardenShortcut(linkedE04,state,linkedE06,linkedE07):
  encodeMemoryStationGardenTransfer(linkedE04,state,linkedE06));
 const memoryLink=$('e04-return'),memoryContext=$('e04-context');
 memoryLink.hidden=!memoryFragment;memoryContext.hidden=!memoryFragment;
 if(memoryFragment){
  memoryLink.href='../authoring-labs/arc1-memory-station-handoff.html'+memoryFragment;
  memoryContext.textContent='E04 PAPER: two sincere attributed memories remain undated; EARLIER/LATER unsupported. Milo marked both UNKNOWN. No canonical E04 completion or station rights.';
 }
 const earned=encodeStationGardenTransfer(state,linkedE06);
 const fragment=earned&&(linkedE04?memoryFragment:earned),link=$('e06-paper');
  link.hidden=!fragment;
  if(fragment)link.href='../e06-scene/'+fragment;
  $('parent').textContent=v.parentCue?'Optional parent cue: '+v.parentCue:'Parent: allow Milo to observe and try first.';
  $('guard').textContent='Production E05 LOCKED · E04 canonical completion absent · access/source approval absent · E06 NOT UNLOCKED';
  for(const b of document.querySelectorAll('button[data-scene]')){
    const a=actionOf(b);b.disabled=!can(state,a);
    if(b.dataset.type==='walk')b.setAttribute('aria-pressed',String((a.scene==='station'?v.station.milo:v.sources.milo)===b.dataset.value));
    if(b.dataset.type==='try-copy')b.setAttribute('aria-pressed',String(v.station.orientation===b.dataset.value));
    if(b.dataset.type==='place-table')b.setAttribute('aria-pressed',String(v.station.table===b.dataset.value));
    if(a.scene==='garden'&&b.dataset.type==='inspect')b.setAttribute('aria-pressed',String(g.inspected.includes(b.dataset.value)));
    if(a.scene==='garden'&&b.dataset.type==='overlay')b.setAttribute('aria-pressed',String(g.overlay));
    if(a.scene==='garden'&&b.dataset.type==='ask-why')b.setAttribute('aria-pressed',String(g.question));
  }
}
document.querySelectorAll('button[data-scene]').forEach(b=>b.addEventListener('click',()=>{
  const action=actionOf(b);
  state=dispatch(state,action);
  if(action.scene==='nav'&&action.type==='restart'){
    linkedE06=freshE06();linkedE07=freshE07();linkedE08=freshE08();
  }
  render();
}));
render();
