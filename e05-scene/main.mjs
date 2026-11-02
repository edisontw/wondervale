// E05 isolated future scene shell: reuses strict station and mock-source reducers.
import {fresh,dispatch,can,view} from './scene-model.mjs';
import {projectReplicaBoard} from './replica-visual.mjs';
import {projectMapRoomLayout} from './layout-visual.mjs';
import * as GardenReturn from './garden-return-model.mjs';
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
let gardenReturnHistory=[];
const $=id=>document.getElementById(id);
const boardNames={'peg-pair':'PEG PAIR','worn-edge':'WORN EDGE'};
function renderReplicaBoard(station){
  const p=projectReplicaBoard(station),grid=$('replica-board');
  grid.replaceChildren();
  for(const item of p.cells){
    const cell=document.createElement('div');
    cell.className='replica-cell';
    cell.dataset.cell=item.x+','+item.y;
    if(item.board){
      const inspect=document.createElement('button');
      inspect.type='button';
      inspect.className='board-feature';
      inspect.dataset.boardInspect=item.board;
      inspect.textContent=(item.board==='peg-pair'?'○ ○':'▰')+' '+boardNames[item.board];
      inspect.setAttribute('aria-label','Inspect PAPER board '+boardNames[item.board].toLowerCase());
      inspect.setAttribute('aria-pressed',String(item.inspected));
      inspect.disabled=!can(state,{scene:'station',action:{type:'inspect',value:item.board}});
      cell.append(inspect);
    }
    if(item.copy){
      cell.dataset.copy=item.copy;
      cell.dataset.overlap=String(item.overlap);
      if(p.checked)cell.dataset.checked='true';
      const marker=document.createElement('span');
      marker.className='copy-feature';
      marker.textContent='COPY '+(item.copy==='peg-pair'?'○ ○':'▰');
      marker.setAttribute('aria-label','Removable copy '+boardNames[item.copy].toLowerCase()+
        (item.overlap?' overlaps the same board mark':' is offset from its board mark'));
      cell.append(marker);
    }
    grid.append(cell);
  }
  const status=$('replica-status');
  status.textContent=!p.orientation?
    'Look at the two PAPER board marks. The removable copy is not placed yet.':
    p.fit===null?
    'COPY '+p.orientation.toUpperCase()+' is placed. Look at both positions, then compare the marks.':
    p.fit?
    'PAPER COPY: both marks line up on this MODEL. The real station history is still UNKNOWN.':
    'PAPER COPY: '+p.mismatches+' marks are offset. Turn the removable copy and compare again.';
  const turn=$('board-turn'),next=p.orientation==='side-b'?'side-a':'side-b';
  turn.dataset.orientation=next;
  turn.textContent=p.orientation?'Turn PAPER copy to '+next.toUpperCase():'Place PAPER copy B';
  turn.disabled=!can(state,{scene:'station',action:{type:'try-copy',value:next}});
}
function renderMapRoomLayout(station){
  const p=projectMapRoomLayout(station),grid=$('layout-spatial-grid');
  grid.replaceChildren();
  for(const item of p.cells){
    const cell=document.createElement('div');
    cell.className='layout-spatial-cell';
    cell.dataset.cell=item.x+','+item.y;
    cell.dataset.walkway=String(item.walkway);
    cell.dataset.table=String(item.occupied);
    cell.dataset.blocked=String(item.blocked);
    if(item.option){
      const button=document.createElement('button');
      button.type='button';
      button.dataset.layoutPosition=item.option;
      button.textContent=item.option==='near-wall'?'Wall':'Path';
      button.setAttribute('aria-label',item.option==='near-wall'?
        'Move PAPER table by wall':'Move PAPER table into model walkway');
      button.setAttribute('aria-pressed',String(p.position===item.option));
      button.disabled=!can(state,{scene:'station',action:{type:'place-table',value:item.option}});
      cell.append(button);
    }else{
      const label=document.createElement('span');
      label.textContent=item.blocked?'BLOCKED':item.occupied?'TABLE':
        item.endpoint|| (item.walkway?'PATH':'·');
      cell.append(label);
    }
    grid.append(cell);
  }
  $('layout-spatial-status').textContent=p.ready?
    'PAPER Map Room ready: table by wall, model passage open. Not a real station layout.':
    p.position===null?'No PAPER table yet. Milo can try either marked place.':
    p.clear?'PAPER model passage OPEN. Check it, or move the table again.':
    'PAPER model passage BLOCKED: '+p.blockedCells+' path squares covered. Move the table and retry.';
}
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
  renderReplicaBoard(v.station);
  renderMapRoomLayout(v.station);
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
  const ret=GardenReturn.view(gardenReturnHistory,state,linkedE06);
  $('garden-return').hidden=!ret.eligible||v.stage!=='review';
  if(ret.eligible){
    $('return-map').dataset.mark=ret.annotation;
    $('return-map').setAttribute('aria-label',ret.now+'; two separate PAPER garden markers, not real geography');
    $('return-pin-current').dataset.inspected=String(ret.current);
    $('return-pin-lower').dataset.inspected=String(ret.lower);
    $('return-current').textContent=ret.currentObservation;
    $('return-lower').textContent=ret.lowerObservation+' · '+ret.growth;
    $('return-first').textContent=ret.first;
    $('return-now').textContent=ret.now;
    $('return-feedback').textContent=ret.feedback;
    $('return-chronicle').textContent=ret.paperChronicle||'No PAPER return comparison yet. This does not change the official Chronicle.';
    for(const b of document.querySelectorAll('[data-return-action]')){
      b.disabled=!GardenReturn.can(gardenReturnHistory,b.dataset.returnAction,state,linkedE06);
      b.setAttribute('aria-pressed',String(b.dataset.returnAction==='mark-question'&&ret.annotation==='question'));
    }
  }
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
    linkedE06=freshE06();linkedE07=freshE07();linkedE08=freshE08();gardenReturnHistory=[];
  }
  render();
}));
$('replica-board').addEventListener('click',event=>{
  const target=event.target.closest('button[data-board-inspect]');
  if(!target)return;
  state=dispatch(state,{scene:'station',action:{type:'inspect',value:target.dataset.boardInspect}});
  render();
});
$('layout-spatial-grid').addEventListener('click',event=>{
  const target=event.target.closest('button[data-layout-position]');
  if(!target)return;
  state=dispatch(state,{scene:'station',action:{type:'place-table',value:target.dataset.layoutPosition}});
  render();
});
$('board-turn').addEventListener('click',()=>{
  state=dispatch(state,{scene:'station',action:{type:'try-copy',value:$('board-turn').dataset.orientation}});
  render();
});
document.querySelectorAll('[data-return-action]').forEach(b=>b.addEventListener('click',()=>{
  gardenReturnHistory=GardenReturn.dispatch(gardenReturnHistory,b.dataset.returnAction,state,linkedE06);
  render();
}));
render();
