import {fresh,dispatch,can,view} from './scene-model.mjs';
import {decodeTransfer,encodeTransfer} from '../authoring-labs/e06-e07-scene-transfer.mjs';
import {fresh as freshE08,view as viewE08} from '../e08-scene/scene-model.mjs';
import {decodeStepsTransfer,encodeStepsTransfer} from '../authoring-labs/e07-e08-scene-transfer.mjs';
const stepsIncoming=decodeStepsTransfer(location.hash);
const gardenIncoming=stepsIncoming?null:decodeTransfer(location.hash);
let state=stepsIncoming?.e07||gardenIncoming?.e07||fresh(),
 linkedE06=stepsIncoming?.e06||gardenIncoming?.e06||null,
 linkedE08=stepsIncoming?.e08||freshE08();const $=id=>document.getElementById(id);
const a=(type,value)=>({scene:'story',action:value===undefined?{type}:{type,value}});
const n=type=>({scene:'nav',type});
const w=(type,value)=>({scene:'walkthrough',type,...(value===undefined?{}:{value})});
const rows=[
 ['start','Begin Finn’s PAPER idea',a('start')],
 ['walk-entry','Walk Milo to Entry',a('walk','entry')],
 ['walk-shared','Walk Milo to Shared Path',a('walk','shared-path')],
 ['inspect-shared','Look: shared path',a('inspect','shared-path')],
 ['walk-channel','Walk Milo to Water Channel',a('walk','channel')],
 ['inspect-channel','Look: water route',a('inspect','channel')],
 ['walk-workbench','Walk Milo to Model Bench',a('walk','workbench')],
 ['test-milo','Test Milo',a('trial','milo')],
 ['test-resident','Test another traveler',a('trial','resident')],
 ['test-water','Test water',a('trial','water')],
 ['place-water','Move piece: path clear, water blocked',a('place','path-clear-water-blocked')],
 ['place-path','Move piece: water clear, path blocked',a('place','channel-clear-path-blocked')],
 ['place-upper','Move piece: upper detour',a('place','side-offset')],
 ['place-lower','Move piece: lower detour',a('place','lower-offset')],
 ['undo','Undo piece',a('undo')],
 ['compare','Compare FIRST / NOW',a('compare')],
 ['finish','Keep PAPER proposal',a('finish')],
 ['garden','Review two garden PAPER contexts',n('garden')],
 ['connector','Return to connector',n('connector')],
 ['restart','Restart E07 PAPER story',n('restart')]
];
const walkRows=[
 ['walk-start','Begin revised PAPER route walk',w('start')],
 ['walk-crossing','Walk Milo to model crossing',w('move','crossing')],
 ['walk-check-crossing','Look: can another traveler pass?',w('inspect','crossing')],
 ['walk-closed','Try CLOSED North Hill boundary (stop)',w('try-closed')],
 ['walk-water','Walk Milo to model water edge',w('move','water-edge')],
 ['walk-check-water','Look: can water pass?',w('inspect','water-edge')],
 ['walk-base','Walk Milo to Lantern Steps BASE',w('move','steps-base')],
 ['walk-review','Review the PAPER route walk',w('review')]
];
const allRows=[...rows,...walkRows];
const groups={'walkthrough-controls':walkRows,'walk-controls':rows.slice(0,7),'test-controls':rows.slice(7,10),
 'piece-controls':rows.slice(10,15),'compare-controls':rows.slice(15,17),'nav-controls':rows.slice(17)};
for(const [host,items] of Object.entries(groups))for(const [key,label,action] of items){
 const b=document.createElement('button');b.type='button';b.dataset.key=key;b.textContent=label;
 b.addEventListener('click',()=>{state=dispatch(state,action);
 if(action.scene==='nav'&&action.type==='restart')linkedE08=freshE08();
 render();});$(host).append(b);
}
const names={milo:'Milo',resident:'Traveler',water:'Water'};
const results=t=>['milo','resident','water'].map(k=>names[k]+': '+(t[k]?(t[k].pass?'PASS':'BLOCKED'):'NOT TESTED')).join(' · ');
function draw(layout){
 const root=$('board');root.replaceChildren();const C=new Set(layout.footprint),P=new Set(layout.traces.resident.path),W=new Set(layout.traces.water.path);
 let conflicts=0;
 for(let y=0;y<7;y++)for(let x=0;x<8;x++){const id=x+','+y,c=C.has(id),p=P.has(id),w=W.has(id),el=document.createElement('div');
 el.className='cell';el.dataset.conflict=String(c&&(p||w));if(c&&(p||w))conflicts++;
 el.textContent=c&&(p||w)?'X':c?'C':p?'P':w?'W':'·';root.append(el);}
 root.setAttribute('aria-label','Synthetic connector grid, '+conflicts+' overlap cells');
}
function render(){
 const v=view(state),s=v.story;
 $('connector-scene').hidden=v.screen!=='connector';$('garden-revisit').hidden=v.screen!=='garden';
 $('route-walk').hidden=v.screen!=='connector'||s.stage!=='finished';
 $('route-position').textContent='Milo at '+v.walkthrough.positionLabel+' (synthetic MODEL only).';
 $('route-feedback').textContent=v.walkthrough.feedback;
 $('route-note').textContent='Checked: '+(v.walkthrough.checked.join(', ')||'none yet')+
  ' · Hill CLOSED · Steps lights OFF · no real route or unlock.';
 for(const el of document.querySelectorAll('[data-walk-point]'))
  el.dataset.here=String(el.dataset.walkPoint===v.walkthrough.position);
 $('stage').textContent='E07 '+s.stage+' · '+v.screen+' · production LOCKED';
 $('speaker').textContent=s.speaker;$('line').textContent=s.line;
 $('milo').textContent='Milo at '+s.milo.replaceAll('-',' ');
 $('observed').textContent='Looked at: '+(s.observed.join(', ')||'nothing yet');
 $('first').textContent='FIRST — '+results(s.firstTrials);$('now').textContent='NOW — '+results(s.revisedTrials);
 $('layout').textContent='Model footprint: '+s.layout.layout+' · Milo route steps: '+s.layout.traces.milo.steps;
 $('connector-world').dataset.done=String(v.connectorPaperRevised);
 const checkedWater=s.revisedTrials.water?.pass===true&&v.walkthrough.reviewed;
 $('e06-transfer-note').textContent=linkedE06?
  (checkedWater?
   'E06 hypothetical PAPER sprout revisited after Milo checked E07 MODEL water: PASS. No real drainage, planting or growth proven.':
   'E06 hypothetical PAPER sprout carried from the other playable model. E07 MODEL water still needs a child-checked route walk.'):
  'No E06 PAPER care record in this independent visit; the lower pocket remains unbuilt.';
 const stepsFragment=encodeStepsTransfer(state,linkedE08,linkedE06);
 const stepsLink=$('e08-transfer');stepsLink.hidden=!stepsFragment;
 if(stepsFragment)stepsLink.href='../e08-scene/'+stepsFragment;
 $('e08-paper-callback').textContent=viewE08(linkedE08).story.previewComplete?
  'E08 PAPER callback: Milo compared two lower-model viewpoints. The real Steps remain unlit and the hill CLOSED.':
  'E08 PAPER comparison not yet made. Real Steps lights OFF; no official E08 unlock.';
 const back=$('e06-return'),fragment=linkedE06&&encodeTransfer(linkedE06,state);
 back.hidden=!fragment;
 if(fragment)back.href='../e06-scene/'+fragment;
 $('connector-world-note').textContent=v.walkthrough.reviewed?
  'Milo walked and checked the revised PAPER route. No real route built.':
  v.connectorPaperRevised?'Revised PAPER proposal visible. No real route built.':'FIRST model needs testing.';
 $('note').textContent=s.paperNote+(v.walkthrough.reviewed?
  ' PAPER WALK: BEFORE only a tested connector layout; NOW Milo checked a shared crossing and water edge on the synthetic route. No construction or historical proof.':'');
 $('parent').textContent='Optional parent cue: '+(s.parentCue||'Who else uses this space?');
 $('hook').textContent=v.walkthrough.reviewed?
  'Milo reached the PAPER Steps BASE. Lights remain OFF; E08 is NOT unlocked.':
  v.connectorPaperRevised?'Next: try walking the PAPER route to Lantern Steps BASE. Lights OFF.':'Lantern Steps not yet open.';
 draw(s.layout);
 for(const [key,,action] of allRows)document.querySelector('[data-key="'+key+'"]').disabled=!can(state,action);
 for(const el of document.querySelectorAll('[data-anchor]'))el.dataset.here=String(el.dataset.anchor===s.milo);
}
render();
