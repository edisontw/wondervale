// Isolated E05 authoring laboratory. No localStorage, production unlock or canonical imports.
import {
  FEATURES,BOARD,REPLICA,WALKWAY,TABLES,fresh,dispatch,previewProjection,
  corridorClear
} from '../engine/s01e05-authoring-prototype.mjs';
let state=fresh();
const $=id=>document.getElementById(id);
const mark=(host,id,point,copy=false)=>{
  const dot=document.createElement('span');
  dot.className='marker'+(copy?' copy':'');
  dot.style.left=((point.x+.5)/5*100)+'%';
  dot.style.top=((point.y+.5)/4*100)+'%';
  const name=document.createElement('b');
  name.textContent=(id==='peg-pair'?'Peg pair':'Worn edge')+(copy?' (copy)':'');
  dot.append(name);host.append(dot);
};
function drawReplica(){
  const host=$('replica-diagram');host.replaceChildren();
  for(const id of FEATURES)mark(host,id,BOARD[id]);
  if(state.orientation)for(const id of FEATURES)mark(host,id,REPLICA[state.orientation][id],true);
  host.setAttribute('aria-label',state.orientation
    ? 'Board marks and copy '+state.orientation+'. '+(state.comparison
      ? state.comparison.checks.map(c=>c.id+': '+(c.fits?'aligned':'not aligned')).join('; ')
      : 'Press Check both marks for a text comparison.')
    : 'Two solid board marks. Select and inspect each feature, then try the removable copy.');
}
function drawRoom(){
  const host=$('room-diagram');host.replaceChildren();
  const corridor=document.createElement('div');
  corridor.className='corridor';corridor.textContent='Public walkway';
  host.append(corridor);
  if(state.table){
    const table=document.createElement('div');table.className='table '+state.table;
    table.textContent=state.roomPreview?'Map table':'Trial table';
    host.append(table);
  }
  host.setAttribute('aria-label',state.table
    ? 'Table '+(corridorClear(state.table)?'leaves the public walkway clear':'overlaps the public walkway')
    : 'A clear public walkway at the right, with an empty area by the left wall.');
}
function render(){
  const p=previewProjection(state);
  drawReplica();drawRoom();
  for(const button of document.querySelectorAll('button[data-type]')){
    const type=button.dataset.type;
    const id=button.dataset.id;
    const orient=button.dataset.orientation;
    const pos=button.dataset.position;
    let enabled=false;
    if(type==='inspect-feature')enabled=state.phase!=='done'&&state.phase!=='layout'&&!state.inspected.includes(id);
    if(type==='place-replica')enabled=state.inspected.length>0&&state.phase!=='layout'&&state.phase!=='done'&&state.orientation!==orient;
    if(type==='compare-fit')enabled=state.inspected.length===2&&!!state.orientation&&!state.comparison;
    if(type==='note-limits')enabled=state.phase==='replica'&&state.comparison?.matched===true;
    if(type==='place-table')enabled=state.phase==='layout'&&state.table!==pos;
    if(type==='confirm-room')enabled=state.phase==='layout'&&corridorClear(state.table)===true;
    button.disabled=!enabled;
    if(orient)button.setAttribute('aria-pressed',String(state.orientation===orient));
    if(pos)button.setAttribute('aria-pressed',String(state.table===pos));
  }
  const observations=state.inspected.map(x=>x==='peg-pair'?'peg pair':'worn edge');
  $('fit-status').textContent='Observed: '+(observations.join(' and ')||'none yet')+'. '+
    (state.comparison?state.comparison.checks.map(x=>(x.id==='peg-pair'?'Peg pair':'Worn edge')+
      (x.fits?' aligns.':' does not align.')).join(' '):'Compare the marks after trying the copy.')+
    (state.limitedConclusion?' This is only a fit test, not the station history.':'');
  $('room-status').textContent=state.table
    ? (corridorClear(state.table)?'The walkway stays clear.':'The table blocks the walkway; move it before confirming.')
      +(state.roomPreview?' A small map workspace is now visible in this preview.':'')
    :'The public walkway is open. Try a table placement after the replica test.';
  $('summary').textContent=p.message+' No real history, save, reward or E06 unlock was created.';
}
document.querySelectorAll('button[data-type]').forEach(button=>{
  button.addEventListener('click',()=>{
    const action={type:button.dataset.type};
    if(button.dataset.id)action.id=button.dataset.id;
    if(button.dataset.orientation)action.orientation=button.dataset.orientation;
    if(button.dataset.position)action.position=button.dataset.position;
    state=dispatch(state,action);render();
  });
});
$('reset').addEventListener('click',()=>{state=fresh();render();$('summary').focus?.();});
render();
