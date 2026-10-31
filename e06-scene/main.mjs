import {fresh,dispatch,can,view} from './scene-model.mjs';
import * as E05 from '../e05-scene/scene-model.mjs';
import {decodeStationGardenTransfer,encodeStationGardenTransfer} from '../authoring-labs/e05-e06-scene-transfer.mjs';
import {fresh as freshE07} from '../e07-scene/scene-model.mjs';
import {decodeTransfer,encodeTransfer} from '../authoring-labs/e06-e07-scene-transfer.mjs';
import {decodeMemoryStationGardenTransfer,encodeMemoryStationGardenTransfer}
 from '../authoring-labs/e04-e06-scene-transfer.mjs';
const arcIncoming=decodeMemoryStationGardenTransfer(location.hash);
const incoming=decodeTransfer(location.hash);
const stationIncoming=decodeStationGardenTransfer(location.hash);
let state=arcIncoming?.e06||stationIncoming?.e06||incoming?.e06||fresh(),
 linkedE07=incoming?.e07||freshE07();
const linkedE05=arcIncoming?.e05||stationIncoming?.e05||null;
const linkedE04=arcIncoming?.e04||null;
const $=id=>document.getElementById(id);
const garden=(type,value)=>({scene:'garden',action:value===undefined?{type}:{type,value}});
const nav=type=>({scene:'nav',type});
const care=(type,value)=>value===undefined?{scene:'care',type}:{scene:'care',type,value};
const current=[
  ['start','Begin garden story',garden('start')],
  ['bed','Inspect healthy bed',garden('inspect','present-bed')],
  ['slope-walk','Milo: walk to slope',garden('walk','slope')],
  ['slope','Inspect slope',garden('inspect','slope')],
  ['path-walk','Milo: walk to shared path',garden('walk','shared-path')],
  ['path','Inspect shared path',garden('inspect','shared-path')],
  ['tray-walk','Milo: walk to MODEL tray',garden('walk','model-tray')],
  ['dry','Set DRY',garden('weather','dry')],
  ['rain','Set RAIN',garden('weather','rain')],
  ['open','Open MODEL channel',garden('channel','open')],
  ['blocked','Block MODEL channel',garden('channel','blocked')],
  ['run','Run MODEL tray',garden('run')],
  ['compare','Compare MODEL runs',garden('compare')],
  ['enter','Walk to Lower Garden PAPER model',garden('enter')]
];
const lower=[
  ['trace','Inspect runoff trace',garden('inspect','runoff-trace')],
  ['lower-path-walk','Milo: walk to public path',garden('walk','public-path')],
  ['lower-path','Inspect public path',garden('inspect','public-path')],
  ['channel-walk','Milo: walk to runoff channel',garden('walk','runoff-channel')],
  ['channel-place','Try marker in water route',garden('place','runoff-channel')],
  ['footpath-walk','Milo: walk to footpath',garden('walk','footpath')],
  ['footpath-place','Try marker on footpath',garden('place','footpath')],
  ['pocket-walk','Milo: walk to raised pocket',garden('walk','raised-pocket')],
  ['pocket-place','Move marker to raised pocket',garden('place','raised-pocket')],
  ['check','Check water and people',garden('check')],
  ['think','I think: keep the path open',garden('think','keep-path')],
  ['unsure','I need more evidence',garden('think','need-more')],
  ['finish','Keep small PAPER pocket plan',garden('finish')]
];
const careActions=[
  ['heavy-care','Try LOTS of MODEL water',care('choose','heavy')],
  ['gentle-care','Try a LITTLE MODEL water',care('choose','gentle')],
  ['test-care','Test the PAPER seed',care('test')],
  ['compare-care','Compare BEFORE / NOW',care('compare')]
];
const navigation=[
  ['to-current','Revisit healthy Current Garden',nav('to-current')],
  ['to-lower','Return to Lower Garden model',nav('to-lower')],
  ['restart','Restart both PAPER garden scenes',nav('restart')]
];
function buttons(id,rows){
  const root=$(id);root.replaceChildren();
  for(const [key,label,action] of rows){
    const b=document.createElement('button');
    b.type='button';b.dataset.key=key;b.textContent=label;
    b.disabled=!can(state,action);
    b.addEventListener('click',()=>{
      state=dispatch(state,action);
      if(action.scene==='nav'&&action.type==='restart')linkedE07=freshE07();
      render();
    });
    root.append(b);
  }
}
function render(){
  const v=view(state),g=v.garden;
  $('current-scene').hidden=v.screen!=='current';
  $('lower-scene').hidden=v.screen!=='lower';
  $('current-world').dataset.done=String(v.currentCompared);
  $('lower-world').dataset.done=String(v.lowerPaperStarted);
  $('current-world-note').textContent='Healthy present beds remain. '+(v.currentCompared?
    'MODEL water comparison completed.':'MODEL water comparison open.');
  $('lower-world-note').textContent=v.lowerGrowthVisible?
    'PAPER pocket: a hypothetical sprout appears after two water tests. No actual growth.':
    v.care.stage==='paper-soggy'?'PAPER pocket: too much MODEL water. A retry is possible.':
    v.lowerPaperStarted?'A removable PAPER pocket plan remains. No real plants or growth.':
    v.lowerVisited?'Lower garden MODEL inspected; no approved planting.':'Not visited yet.';
  $('care-panel').hidden=!(v.screen==='lower'&&v.lowerPaperStarted);
  $('upper-bed-tile').dataset.stage='healthy';
  $('lower-growth-tile').dataset.stage=v.care.stage;
  $('lower-growth-tile').textContent=v.care.stage==='paper-sprout'?
    'PAPER sprout (possible) · NOT a real plant':
    v.care.stage==='paper-soggy'?'PAPER seed is soggy · try less MODEL water':
    v.care.stage==='paper-seed'?'PAPER seed looks ready · compare tests':
    'Future growth · NOT APPROVED';
  $('care-feedback').textContent='PAPER water tests: '+v.care.trials.map(t=>
    t.choice.toUpperCase()+' → '+(t.result==='paper-soggy'?'soggy seed':'possible sprout')).join('; ')+
    (v.care.compared?' · BEFORE / NOW compared.':' · comparison open.');
  $('stage').textContent='Viewing '+(v.screen==='current'?'Current Garden':'Lower Garden')+
    ' · model phase '+g.phase+' · production entry LOCKED';
  $('speaker').textContent=v.speaker;
  $('line').textContent=v.line;
  $('milo').textContent='Milo at '+g.milo;
  $('tray').textContent='PAPER tray: '+g.runs.length+' run(s). Weather '+g.weather+
    '; channel '+g.channel+'; compared '+g.modelCompared+'. A model is not historical proof.';
  $('upper-observations').textContent='Observed now: '+(g.observedCurrent.join(', ')||'nothing yet');
  $('lower-observations').textContent='Observed MODEL: '+(g.observedLower.join(', ')||'nothing yet');
  const last=g.attempts.at(-1);
  $('marker').textContent='Temporary marker: '+(g.markerSite||'not placed')+
    (last?' · last check: '+(last.wet?'WET in model':last.blocksPath?'BLOCKS path':'model path and water clear'):' · not checked');
  $('note').textContent=v.paperChronicle;
  $('parent').textContent='Optional parent question: '+v.parentCue;
  const stationFragment=linkedE05&&(linkedE04?
   encodeMemoryStationGardenTransfer(linkedE04,linkedE05,state):
   encodeStationGardenTransfer(linkedE05,state));
  const memoryContext=$('e04-context');
  memoryContext.hidden=!stationFragment||!linkedE04;
  if(stationFragment&&linkedE04)
    memoryContext.textContent='E04 PAPER: both E03 memories were heard, compared and left undated/UNKNOWN. No canonical source approval or E05/E06 unlock.';
  const stationLink=$('e05-return'),stationNote=$('e05-context');
  stationLink.hidden=!stationFragment;
  stationNote.hidden=!stationFragment;
  if(stationFragment){
    stationLink.href='../e05-scene/'+stationFragment;
    const paper=E05.view(linkedE05);
    stationNote.textContent='E05 PAPER revisit: Milo tested a removable station copy, checked two MOCK sources (maker/date/original UNKNOWN), kept the walkway clear and overlaid two fictional garden marks. His question travels; no real site, date, access or E06 unlock is proved. E06 actions remain yours to perform.';
  }
  const fragment=encodeTransfer(state,linkedE07),link=$('e07-transfer');
  link.hidden=!fragment;
  if(fragment)link.href='../e07-scene/'+fragment;
  buttons('current-actions',current);
  buttons('lower-actions',lower);
  buttons('care-actions',careActions);
  buttons('nav-actions',navigation);
}
render();
