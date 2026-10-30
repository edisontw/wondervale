// Separate E05 mock-source board; no production imports, storage or unlock writes.
import {fresh,dispatch,can,view,CARDS} from './station-sources-model.mjs';
let state=fresh();
const $=id=>document.getElementById(id);
function actionOf(b){
 const type=b.dataset.action;
 if(type==='walk')return {type,value:b.dataset.value};
 if(['inspect','source-check','test'].includes(type))return {type,card:b.dataset.card};
 if(type==='place')return {type,card:b.dataset.card,slot:b.dataset.slot};
 return {type};
}
function render(){
 const v=view(state);
 $('speaker').textContent=v.speaker;
 $('line').textContent=v.line;
 $('phase').textContent='Paper stage: '+v.phase+' · Milo: '+v.milo;
 $('milo').textContent='Milo paper marker: '+v.milo;
 $('parent').textContent=v.parentCue?'Optional parent question: '+v.parentCue:'Parent: let the child investigate first.';
 $('note').textContent=v.paperNote;
 for(const card of ['a','b']){
   const panel=$('card-'+card);
   panel.dataset.checked=String(v.sourceChecked.includes(card));
   panel.querySelector('.drawing').textContent=CARDS[card].drawing;
   panel.querySelector('.provenance').textContent=v.sourceChecked.includes(card)
     ?'SOURCE CHECK: maker UNKNOWN · date UNKNOWN · original UNKNOWN'
     :'SOURCE CHECK: flip the paper source tag; no verified record supplied';
   panel.querySelector('.placement').textContent='Paper timeline: '+(v.placements[card]||'not placed')+
     ' · '+(v.tested[card]==='needs-source'?'needs a real dated source':
       v.tested[card]==='bounded'?'UNKNOWN supported by missing provenance':'not tested');
   panel.querySelector('.placement').dataset.slot=v.placements[card]||'none';
 }
 $('comparison').textContent=v.compared
   ?'MOCK A and MOCK B show different drawn paths. Historical order and route cause: UNKNOWN.'
   :'Put both mock cards on the paper timeline, test them, then compare.';
 for(const b of document.querySelectorAll('[data-action]')){
   b.disabled=!can(state,actionOf(b));
   if(b.dataset.action==='walk')b.setAttribute('aria-pressed',String(v.milo===b.dataset.value));
   if(b.dataset.action==='place')b.setAttribute('aria-pressed',String(v.placements[b.dataset.card]===b.dataset.slot));
 }
}
document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>{
 state=dispatch(state,actionOf(b));render();
}));
$('restart').addEventListener('click',()=>{state=fresh();render();});
render();
