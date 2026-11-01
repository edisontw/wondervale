// E09 fictional safe-survey browser lab. No production imports, storage, telemetry or real route claims.
import {NODES,SAFE_EDGES,CLOSED_NODE,CLOSED_EDGE,CLUES,HYPOTHESES} from '../engine/s01e09-authoring-prototype.mjs';
import {fresh,dispatch,can,view} from './scene-model.mjs';
import {view as viewE08} from '../e08-scene/scene-model.mjs';
import {decodeHillTransfer,encodeHillTransfer} from '../authoring-labs/e08-e09-scene-transfer.mjs';
import {decodeMemoryHill,encodeMemoryHill} from '../authoring-labs/e04-e09-scene-transfer.mjs';
import {decodeMemoryCourtyard,encodeMemoryCourtyard} from '../authoring-labs/e04-e10-scene-transfer.mjs';
import {fresh as freshE10} from '../authoring-labs/unnamed-story-model.mjs';
import {decodeUnnamedTransfer,encodeUnnamedTransfer} from '../authoring-labs/e09-e10-scene-transfer.mjs';

const $=id=>document.getElementById(id);
const names={steps_base:'Steps base',signpost:'Signpost',fence_view:'Fence lookout',
  lower_bend:'Lower bend',overlook:'Overlook'};
const clueNames={entry_note:'Old sketch',boundary_sign:'Closed sign',
  disturbed_ground:'Uneven ground',runoff_marks:'Water marks',distant_symbol:'Distant mark'};
const edgeNames={'steps_base:signpost':'Steps–Signpost','signpost:fence_view':'Signpost–Fence',
  'signpost:lower_bend':'Signpost–Bend','lower_bend:overlook':'Bend–Overlook'};
const coords={steps_base:[13,56],signpost:[36,46],fence_view:[64,32],
  lower_bend:[57,76],overlook:[86,70],upper_closed:[80,16]};
const incoming=decodeMemoryCourtyard(location.hash)||decodeMemoryHill(location.hash)||decodeUnnamedTransfer(location.hash)||decodeHillTransfer(location.hash);
let state=incoming?.e09||fresh();
const linkedE08=incoming?.e08||null,linkedE07=incoming?.e07||null,linkedE06=incoming?.e06||null;
const linkedE04=incoming?.e04||null,linkedE05=incoming?.e05||null;
let linkedE10=incoming?.e10||null;
const story=()=>view(state).story;
const wrap=action=>({scene:'story',action});
const nav=type=>({scene:'nav',type});
const projection=()=>{const s=story();return {cards:{
 seen:s.observations,think:s.hypotheses.map(id=>HYPOTHESES[id]),
 unknown:['Actual closure cause and date','Actual public access and terrain safety','Identity of the distant place']}};};
const actor=document.createElement('div');
actor.className='milo';actor.textContent='Milo';actor.setAttribute('aria-hidden','true');
const adjacent=(a,b)=>SAFE_EDGES.some(e=>(e.a===a&&e.b===b)||(e.b===a&&e.a===b));
const required=['boundary_sign','disturbed_ground','runoff_marks','distant_symbol'];
function act(action){state=dispatch(state,wrap(action));render();}
function navigate(type){state=dispatch(state,nav(type));if(type==='restart')linkedE10=null;render();}
function button(host,label,action,disabled=false,pressed=false){
  const b=document.createElement('button');b.type='button';b.textContent=label;
  b.disabled=disabled||!can(state,wrap(action));
  b.dataset.key=action.type+(action.to?'-'+action.to:action.clueId?'-'+action.clueId:action.edgeId?'-'+action.edgeId:action.hypothesisId?'-'+action.hypothesisId:'');
  if(pressed)b.setAttribute('aria-pressed','true');
  b.addEventListener('click',()=>act(action));host.append(b);return b;
}
function edgeLine(host,a,b,classes){
  const w=host.clientWidth,h=host.clientHeight;
  const x1=coords[a][0]*w/100,y1=coords[a][1]*h/100;
  const x2=coords[b][0]*w/100,y2=coords[b][1]*h/100;
  const line=document.createElement('div');line.className='edge '+classes;
  line.style.left=x1+'px';line.style.top=y1+'px';
  line.style.width=Math.hypot(x2-x1,y2-y1)+'px';
  line.style.transform='rotate('+Math.atan2(y2-y1,x2-x1)+'rad)';
  host.append(line);
}
function world(){const s=story(),v=view(state);
  const notes=s.previewComplete&&v.surveyLayer==='notes';
  const host=$('scene');host.replaceChildren();
  const label=document.createElement('span');label.className='world-label';
  label.textContent=s.previewComplete?(notes?'MODEL NOW — MILO\'S NOTES':'MODEL BEFORE — BLANK SKETCH'):'SYNTHETIC SURVEY';host.append(label);
  const closed=document.createElement('span');closed.className='closed-label';
  closed.textContent='UPPER HILL CLOSED — NO ENTRY';host.append(closed);
  for(const e of SAFE_EDGES){
    edgeLine(host,e.a,e.b,(notes||!s.previewComplete)&&s.surveyedEdges.includes(e.id)?
      'surveyed '+((notes||!s.previewComplete)&&s.markedEdges.includes(e.id)?'marked':''):'');
  }
  edgeLine(host,'fence_view',CLOSED_NODE,'closed');
  const closedNode=document.createElement('span');closedNode.className='closed-node';
  closedNode.textContent='CLOSED';host.append(closedNode);
  if(notes){
    const pins=[['boundary_sign','signpost','SIGN'],['disturbed_ground','fence_view','GROUND'],
      ['runoff_marks','lower_bend','WATER'],['distant_symbol','overlook','MARK']];
    for(const [id,at,word] of pins){
      if(!s.inspected.includes(id))continue;
      const pin=document.createElement('span');pin.className='evidence-pin';
      pin.textContent=word;pin.setAttribute('aria-label','Milo observed '+clueNames[id]);
      pin.style.left=Math.min(94,coords[at][0]+5)+'%';
      pin.style.top=Math.max(5,coords[at][1]-13)+'%';host.append(pin);
    }
  }
  for(const id of NODES){
    const b=document.createElement('button');b.type='button';
    b.className='anchor'+(s.position===id?' active':'');
    b.textContent=names[id];b.setAttribute('aria-label','Walk Milo to '+names[id]);
    b.disabled=!can(state,wrap({type:'walk',to:id}));
    b.style.left=coords[id][0]+'%';b.style.top=coords[id][1]+'%';
    b.addEventListener('click',()=>act({type:'walk',to:id}));host.append(b);
  }
  host.append(actor);
  actor.style.left=coords[s.position][0]+'%';
  actor.style.top=Math.min(91,coords[s.position][1]+16)+'%';
  host.dataset.phase=s.previewComplete?'complete':'survey';
}
function movement(){const s=story();
  const host=$('walk-controls');host.replaceChildren();
  for(const id of NODES){
    button(host,'Go to '+names[id],{type:'walk',to:id},
      s.previewComplete||!adjacent(s.position,id));
  }
}
function inspect(){const s=story();
  const host=$('inspect-controls');host.replaceChildren();
  for(const [id,clue] of Object.entries(CLUES)){
    button(host,'Look: '+clueNames[id],{type:'inspect',clueId:id},
      s.previewComplete||s.position!==clue.at||s.inspected.includes(id));
  }
  const boundary=$('boundary-controls');boundary.replaceChildren();
  button(boundary,'Try closed way (stop safely)',{type:'walk',to:CLOSED_NODE},
    s.previewComplete||s.position!=='fence_view');
  $('feedback').textContent=s.feedback;
  $('inspections').textContent='Milo: '+names[s.position]+'. Inspected: '+
    (s.inspected.map(id=>clueNames[id]).join(', ')||'nothing yet')+
    '. Closed attempts: '+s.blockedAttempts+'. No crossing.';
  $('parent-cue').hidden=!s.inspected.includes('boundary_sign')||s.previewComplete;
}
function sketch(){const s=story();
  const host=$('mark-controls');host.replaceChildren();
  for(const e of SAFE_EDGES){
    const marked=s.markedEdges.includes(e.id);
    button(host,(marked?'Remove: ':'Mark: ')+edgeNames[e.id],
      {type:marked?'unmark':'mark',edgeId:e.id},s.previewComplete,marked);
  }
  button(host,'Try marking closed edge',{type:'mark',edgeId:CLOSED_EDGE},
    s.previewComplete);
  const controls=$('route-controls');controls.replaceChildren();
  button(controls,'Check my sketch',{type:'check-route'},s.previewComplete);
  const r=s.routeResult;
  $('route-status').textContent='Walked '+s.surveyedEdges.length+'/4 model edges; marked '+
    s.markedEdges.length+'. '+(!r?'Check your marked route.':
      r.complete?'Continuous model route to overlook.':
      'Sketch has a gap at '+edgeNames[r.nextGap]+'. Walk and revise.')+
    ' A model route is not real access permission.';
}
function thoughts(){const s=story();
  const host=$('thought-controls');host.replaceChildren();
  for(const id of Object.keys(HYPOTHESES)){
    button(host,'Consider: '+(id==='water_may_change_ground'?'Water and ground':'Old line continues'),
      {type:'consider',hypothesisId:id},
      s.previewComplete||!s.inspected.includes('disturbed_ground')||
        s.hypotheses.includes(id));
  }
  button(host,'Compare distant mark shape',{type:'compare-symbol'},
    s.previewComplete||s.position!=='overlook'||
    !s.inspected.includes('distant_symbol')||s.symbolCompared);
  $('symbol-status').textContent=s.symbolCompared?
    'The shape matches the E01 sketch. The place is still unknown.':
    'Look at the distant mark from the model overlook before comparing.';
}
function items(host,values){
  host.replaceChildren();
  for(const value of values){
    const li=document.createElement('li');li.textContent=value;host.append(li);
  }
}
function notebook(){const s=story();
  const p=projection();
  items($('seen'),p.cards.seen.map(x=>x.text));
  items($('think'),p.cards.think.length?p.cards.think:['No guesses recorded.']);
  items($('unknown'),p.cards.unknown);
  const host=$('finish-controls');host.replaceChildren();
  const ready=!!s.routeResult?.complete&&s.symbolCompared&&
    required.every(id=>s.inspected.includes(id));
  button(host,'Review field notes',{type:'review'},
    s.previewComplete||!ready||s.reviewed);
  button(host,'Finish model survey',{type:'finish-preview'},
    s.previewComplete||!s.reviewed);
  $('chronicle').textContent='PAPER NOTE — MODEL ONLY: '+p.cards.seen.length+' seen; '+
    p.cards.think.length+' thoughts; '+p.cards.unknown.length+' unknowns. '+
    'Canonical events: 0; unlocks: 0; historical claims: 0. E10 NOT UNLOCKED.';
  $('hook').hidden=!s.previewComplete;
  $('hook').textContent=s.previewComplete?
    'Model complete. E10 remains NOT UNLOCKED. What is the place beyond the mark? The old hill way stays closed.':'';
}
function survey(){const v=view(state),s=v.story,done=s.previewComplete;
 $('survey-compare').hidden=!done;
 $('blank-board').disabled=!can(state,nav('blank'));
 $('notes-board').disabled=!can(state,nav('notes'));
 $('blank-board').setAttribute('aria-pressed',String(done&&v.surveyLayer==='blank'));
 $('notes-board').setAttribute('aria-pressed',String(done&&v.surveyLayer==='notes'));
 $('survey-summary').textContent=!done?'':v.surveyLayer==='blank'?
  'BEFORE: A blank fictional sketch. No walked evidence is shown. The upper hill stays CLOSED.':
  'NOW: Milo walked '+v.surveyBoard.walkedEdges+' model edges, marked '+v.surveyBoard.markedEdges+
  ' on his sketch, and observed '+v.surveyBoard.inspectedClues+
  ' clues. The lower route is a PAPER model only. The upper hill stays CLOSED.';
}
function render(){
 const v=view(state),s=v.story;
 $('stage').textContent='E09 '+s.stage+' · '+v.screen+' · production LOCKED';
 $('dialogue').textContent=s.speaker+': '+s.line;
 $('lantern-revisit').hidden=v.screen!=='lantern';
 $('start').disabled=!can(state,wrap({type:'start'}));
 $('revisit').disabled=!can(state,nav('lantern'));
 $('back').disabled=!can(state,nav('hill'));
 const paper=linkedE08&&viewE08(linkedE08).story;
 $('lantern-context').textContent=paper?.comparison?
  'E08 PAPER clue carried forward: FROM HERE '+paper.firstView.spreadDegrees.toFixed(1)+
  '°, FROM THERE '+paper.secondView.spreadDegrees.toFixed(1)+
  '°. The SAME marks looked different. Milo must inspect the CLOSED hill from safe ground; neither view proves access.'+
  (linkedE04?' E04 memories: UNKNOWN dates; E05 station evidence: MOCK. Neither grants real history or access.':''):
  'No E08 PAPER viewpoint record linked. This direct authoring visit cannot claim E08 completion.';
 const returnLink=$('e08-return'),fragment=linkedE08&&(
  linkedE04?encodeMemoryHill(linkedE04,linkedE05,linkedE06,linkedE07,linkedE08,state):
  encodeHillTransfer(linkedE08,state,linkedE07,linkedE06));
 returnLink.hidden=!fragment;if(fragment)returnLink.href='../e08-scene/'+fragment;
 const e10Fragment=linkedE08&&(linkedE04?
  encodeMemoryCourtyard(linkedE04,linkedE05,linkedE06,linkedE07,linkedE08,state,linkedE10||freshE10()):
  encodeUnnamedTransfer(linkedE08,state,linkedE10||freshE10(),linkedE07,linkedE06));
 const e10Link=$('e10-paper');e10Link.hidden=!e10Fragment;
 if(e10Fragment)e10Link.href='../e10-scene/'+e10Fragment;
 if(linkedE04)e10Link.textContent='Visit independent E10 PAPER scene (E04 UNKNOWN memories and E05 MOCK sources travel as PAPER notes; no official unlock)';
 world();movement();inspect();sketch();thoughts();notebook();survey();
}
$('start').addEventListener('click',()=>act({type:'start'}));
$('revisit').addEventListener('click',()=>navigate('lantern'));
$('back').addEventListener('click',()=>navigate('hill'));
$('restart').addEventListener('click',()=>navigate('restart'));
$('blank-board').addEventListener('click',()=>navigate('blank'));
$('notes-board').addEventListener('click',()=>navigate('notes'));
window.addEventListener('resize',world);
render();
