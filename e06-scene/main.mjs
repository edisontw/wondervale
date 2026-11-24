import {fresh,dispatch,can,view} from './scene-model.mjs';
import {waterModelEvidence} from './water-model-view.mjs';
import * as E05 from '../e05-scene/scene-model.mjs';
import {stationWorld} from './station-world.mjs';
import {decodeStationGardenTransfer,encodeStationGardenTransfer} from '../authoring-labs/e05-e06-scene-transfer.mjs';
import {fresh as freshE07} from '../e07-scene/scene-model.mjs';
import {fresh as freshE08} from '../e08-scene/scene-model.mjs';
import {decodeMemoryLantern,encodeMemoryLantern} from '../authoring-labs/e04-e08-scene-transfer.mjs';
import {decodeTransfer,encodeTransfer} from '../authoring-labs/e06-e07-scene-transfer.mjs';
import {decodeMemoryStationGardenTransfer,encodeMemoryStationGardenTransfer}
 from '../authoring-labs/e04-e06-scene-transfer.mjs';
import {decodeMemoryGardenShortcut,encodeMemoryGardenShortcut}
 from '../authoring-labs/e04-e07-scene-transfer.mjs';
const lantern=decodeMemoryLantern(location.hash);
const extended=lantern||decodeMemoryGardenShortcut(location.hash);
const arcIncoming=extended||decodeMemoryStationGardenTransfer(location.hash);
const incoming=decodeTransfer(location.hash);
const stationIncoming=decodeStationGardenTransfer(location.hash);
let state=arcIncoming?.e06||stationIncoming?.e06||incoming?.e06||fresh(),
 linkedE07=extended?.e07||incoming?.e07||freshE07(),
 linkedE08=lantern?.e08||freshE08();
const linkedE05=arcIncoming?.e05||stationIncoming?.e05||null;
const linkedE04=arcIncoming?.e04||null;
let stationMapView='now';
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
  ['compare-gardens','Milo: compare NOW and POSSIBLE',nav('compare-gardens')],
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
      if(action.scene==='nav'&&action.type==='restart'){linkedE07=freshE07();linkedE08=freshE08();}
      render();
    });
    root.append(b);
  }
}
// Each PAPER location is a child-operated place, not a route inferred from artwork.
// First tap moves Milo; a second tap inspects or places a reversible marker.
const spotNames={
 'present-bed':'Healthy bed','slope':'Uphill slope','shared-path':'Shared path',
 'model-tray':'MODEL tray','runoff-trace':'Runoff trace','public-path':'Public path',
 'runoff-channel':'Water route','footpath':'Walking route','raised-pocket':'Raised pocket'
};
function spotAction(spot,g){
 if(g.milo!==spot)return garden('walk',spot);
 if(['present-bed','slope','shared-path','runoff-trace','public-path'].includes(spot))
  return garden('inspect',spot);
 if(['runoff-channel','footpath','raised-pocket'].includes(spot))
  return garden('place',spot);
 return null;
}
function renderSpots(v){
 const g=v.garden,last=g.attempts.at(-1);
 for(const spot of document.querySelectorAll('[data-spot]')){
  const id=spot.dataset.spot,here=g.milo===id,marked=g.markerSite===id;
  const observed=g.observedCurrent.includes(id)||g.observedLower.includes(id);
  const grown=id==='raised-pocket'&&v.lowerGrowthVisible;
  const action=spotAction(id,g);
  spot.disabled=!action||!can(state,action);
  spot.dataset.here=String(here);
  spot.dataset.observed=String(observed);
  spot.dataset.marker=String(marked);
  spot.dataset.growth=String(grown);
  spot.setAttribute('aria-pressed',String(here));
  const status=grown?'🌱 PAPER sprout · MODEL only':marked?(last?.site===id?
    last.wet?'PAPER marker · WET':last.blocksPath?'PAPER marker · PATH BLOCKED':
      'PAPER marker · CLEAR MODEL':'PAPER marker · check it'):
   here?'Milo here':observed?'Observed':'';
  const hint=spot.disabled?'':here?
   (['runoff-channel','footpath','raised-pocket'].includes(id)?'Tap to place':'Tap to inspect'):
   'Tap to walk';
  const label=document.createElement('span');
  label.className='spot-state';
  label.textContent=[status,hint].filter(Boolean).join(' · ');
  spot.replaceChildren(document.createTextNode(spotNames[id]),label);
 }
}
function renderComparisonCard(id,prefix,run,side){
 const card=$(id),flow=$(prefix+'-flow');
 card.dataset.result=run.weather+'-'+run.channel;
 card.dataset.runIndex=String(run.index);
 $(prefix+'-label').textContent=side+' · Run '+run.index+' · RAIN / '+run.channel.toUpperCase();
 flow.replaceChildren();
 const source=document.createElement('div');source.className='mini-source';
 source.textContent='HIGH SOURCE ↓ DRAIN CHANNEL '+run.channel.toUpperCase();
 const low=document.createElement('div');low.className='mini-outcome';
 low.append(document.createTextNode('↓ LOW BASIN'));
 const lowValue=document.createElement('strong');lowValue.textContent=run.catchment+'/3';low.append(lowValue);
 const bypass=document.createElement('div');bypass.className='mini-outcome';
 bypass.append(document.createTextNode('↗ BYPASS'));
 const bypassValue=document.createElement('strong');bypassValue.textContent=run.bypass+'/2';bypass.append(bypassValue);
 flow.append(source,low,bypass);
}
function renderModelEvidence(g){
 const evidence=waterModelEvidence(g.runs),runs=evidence?.history||[],last=evidence?.last,
  map=$('water-model'),meter=$('model-catchment');
 const channelAction=garden('channel',g.channel==='open'?'blocked':'open');
 const level=last?.catchment??0;
 map.dataset.result=last?.visualState||'none';
 meter.dataset.level=String(level);
 meter.setAttribute('aria-valuenow',String(level));
 $('model-catchment-label').textContent=level+' / 3';
 $('model-bypass-label').textContent=last?'BYPASS '+last.bypass+'/2':'no completed run';
 $('model-channel-control').setAttribute('aria-pressed',String(g.channel==='open'));
 $('model-channel-control').disabled=!can(state,channelAction);
 $('model-channel-control').setAttribute('aria-label',
  'Change selected MODEL channel; currently '+g.channel+'. This does not change the last run.');
 $('model-channel-state').textContent=g.channel.toUpperCase();
 $('model-channel-hint').textContent=g.channel==='open'?'tap to block':'tap to open';
 $('model-next-setup').textContent='Selected setup: '+g.weather.toUpperCase()+' · channel '+g.channel.toUpperCase()+
  ' · setup only; water above comes from completed runs.';
 $('model-flow-caption').textContent=last?
  'Last observed run '+runs.length+': '+last.weather.toUpperCase()+' · channel '+last.channel.toUpperCase()+
  ' · low basin '+last.catchment+'/3 · bypass '+last.bypass+'/2. This is a synthetic PAPER result, not garden history.':
  'No completed run yet. A changed next-run setting is not an observation.';
 const pair=evidence?.comparison,comparison=$('model-comparison');
 comparison.hidden=!pair;
 if(pair){
  renderComparisonCard('model-before','model-before',pair.before,'BEFORE');
  renderComparisonCard('model-after','model-after',pair.after,'AFTER');
  $('model-comparison-caption').textContent='Both completed runs used RAIN. The channel changed from '+
  pair.before.channel.toUpperCase()+' to '+pair.after.channel.toUpperCase()+
   '. Compare the real run snapshots in this PAPER model; this cannot prove the real garden\'s past.';
 }
 const historyPanel=$('model-run-history-panel'),history=$('model-run-history');
 historyPanel.hidden=!runs.length;history.replaceChildren();
 runs.forEach(run=>{
  const item=document.createElement('span');item.className='run-chip';
  item.textContent='Run '+run.index+' · '+run.weather.toUpperCase()+'/'+run.channel.toUpperCase()+
   ' · low '+run.catchment+'/3 · bypass '+run.bypass+'/2';
  item.dataset.result=run.visualState;
  history.append(item);
 });
}

function renderStationMap(){
 const paper=stationWorld(linkedE05),panel=$('e05-world');
 panel.hidden=!paper;
 if(!paper)return;
 panel.dataset.view=stationMapView;
 for(const key of ['first','now'])
   $('e05-world-'+key).setAttribute('aria-pressed',String(stationMapView===key));
 const tiles=paper[stationMapView];
 $('station-map-board').textContent=tiles.board;
 $('station-map-table').textContent=tiles.table;
 $('station-map-path').textContent=tiles.path;
 $('station-map-feedback').textContent=stationMapView==='first'?
   'FIRST: no removable table yet. The old station board stays untouched.':
   'NOW: Milo aligned two marks on a COPY and placed the PAPER table by the wall. '+
   (paper.triedWalkway?'He tried the walkway first, then moved the table. ':'')+
   'The garden question remains open; maker, dates, site access and cause are UNKNOWN.';
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
  $('garden-revisit-result').hidden=!v.revisitCompared;
  $('garden-revisit-result').textContent=v.revisitCompared?'NOW: the upper bed is healthy today. POSSIBLE PAPER: our lower model shows a sprout, not a real plant. Milo asks what we must check before planting.':'';
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
  renderSpots(v);
  renderModelEvidence(g);
  const stationFragment=linkedE05&&(linkedE04?
   (lantern?(encodeMemoryLantern(linkedE04,linkedE05,state,linkedE07,linkedE08)||
     encodeMemoryGardenShortcut(linkedE04,linkedE05,state,linkedE07)):
    extended?encodeMemoryGardenShortcut(linkedE04,linkedE05,state,linkedE07):
    encodeMemoryStationGardenTransfer(linkedE04,linkedE05,state)):
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
  const earnedE07=encodeTransfer(state,linkedE07);
  const fragment=linkedE04?(earnedE07&&(lantern?
    (encodeMemoryLantern(linkedE04,linkedE05,state,linkedE07,linkedE08)||
     encodeMemoryGardenShortcut(linkedE04,linkedE05,state,linkedE07)):
    encodeMemoryGardenShortcut(linkedE04,linkedE05,state,linkedE07))):earnedE07,
   link=$('e07-transfer');
  link.hidden=!fragment;
  if(fragment)link.href='../e07-scene/'+fragment;
  renderStationMap();
  buttons('current-actions',current);
  buttons('lower-actions',lower);
  buttons('care-actions',careActions);
  buttons('nav-actions',navigation);
}
for(const key of ['first','now'])$('e05-world-'+key).addEventListener('click',()=>{
 stationMapView=key;
 render();
});
for(const spot of document.querySelectorAll('[data-spot]')){
 spot.addEventListener('click',()=>{
  const g=view(state)?.garden;
  if(!g)return;
  const action=spotAction(spot.dataset.spot,g);
  if(action&&can(state,action)){state=dispatch(state,action);render();}
 });
}
// Spatial and listed controls use the same existing action and reducer legality.
$('model-channel-control').addEventListener('click',()=>{
 const g=view(state)?.garden;if(!g)return;
 const action=garden('channel',g.channel==='open'?'blocked':'open');
 if(can(state,action)){state=dispatch(state,action);render();}
});
render();
