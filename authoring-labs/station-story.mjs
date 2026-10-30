// Isolated paper rehearsal UI. Child chooses Milo's marker and tests a removable replica.
import {fresh,dispatch,can,view} from './station-story-model.mjs';
let state=fresh();
const $=id=>document.getElementById(id);
const actionOf=b=>b.dataset.value?{type:b.dataset.action,value:b.dataset.value}:{type:b.dataset.action};
function render(){
 const v=view(state);
 $('speaker').textContent=v.speaker;
 $('line').textContent=v.line;
 $('phase').textContent='Paper stage: '+v.phase+' · Milo: '+v.milo;
 $('parent').textContent=v.parentCue?'Optional parent question: '+v.parentCue:'Parent: let the child look first.';
 $('board').dataset.orientation=v.orientation||'none';
 $('board').textContent='Board marks: '+(v.inspected.length?v.inspected.join(' + '):'look closely')+
   ' · removable copy: '+(v.orientation||'not placed')+
   ' · '+(v.fit===null?'not compared':v.fit?'both marks align':'marks do not align');
 $('table').dataset.position=v.table||'none';
 $('table').textContent=v.mapRoom?'PAPER Map Room · clear path':
   v.table?(v.clear?'Trial table near wall · path clear':'Trial table blocks public path'):'Empty paper foyer · public path clear';
 $('milo').textContent='Milo paper marker: '+v.milo;
 $('note').textContent=v.chroniclePreview||'No real station entry, source dates, Chronicle or episode unlock.';
 for(const b of document.querySelectorAll('[data-action]')){
  b.disabled=!can(state,actionOf(b));
  if(b.dataset.action==='walk')b.setAttribute('aria-pressed',String(v.milo===b.dataset.value));
  if(b.dataset.action==='try-copy')b.setAttribute('aria-pressed',String(v.orientation===b.dataset.value));
  if(b.dataset.action==='place-table')b.setAttribute('aria-pressed',String(v.table===b.dataset.value));
 }
}
document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>{
 state=dispatch(state,actionOf(b));render();
}));
$('restart').addEventListener('click',()=>{state=fresh();render();});
render();
