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
  state=dispatch(state,actionOf(b));render();
}));
render();
