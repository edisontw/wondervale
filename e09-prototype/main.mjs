// E09 fictional safe-survey browser lab. No production imports, storage, telemetry or real route claims.
import {NODES,SAFE_EDGES,CLOSED_NODE,CLOSED_EDGE,CLUES,HYPOTHESES,
  fresh,dispatch,previewProjection} from '../engine/s01e09-authoring-prototype.mjs';

const $=id=>document.getElementById(id);
const names={steps_base:'Steps base',signpost:'Signpost',fence_view:'Fence lookout',
  lower_bend:'Lower bend',overlook:'Overlook'};
const clueNames={entry_note:'Old sketch',boundary_sign:'Closed sign',
  disturbed_ground:'Uneven ground',runoff_marks:'Water marks',distant_symbol:'Distant mark'};
const edgeNames={'steps_base:signpost':'Steps–Signpost','signpost:fence_view':'Signpost–Fence',
  'signpost:lower_bend':'Signpost–Bend','lower_bend:overlook':'Bend–Overlook'};
const coords={steps_base:[13,56],signpost:[36,46],fence_view:[64,32],
  lower_bend:[57,76],overlook:[86,70],upper_closed:[80,16]};
let state=fresh();
const actor=document.createElement('div');
actor.className='milo';actor.textContent='Milo';actor.setAttribute('aria-hidden','true');
const adjacent=(a,b)=>SAFE_EDGES.some(e=>(e.a===a&&e.b===b)||(e.b===a&&e.a===b));
const required=['boundary_sign','disturbed_ground','runoff_marks','distant_symbol'];
function act(action){state=dispatch(state,action);render();}
function button(host,label,action,disabled=false,pressed=false){
  const b=document.createElement('button');b.type='button';b.textContent=label;
  b.disabled=disabled;if(pressed)b.setAttribute('aria-pressed','true');
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
function world(){
  const host=$('scene');host.replaceChildren();
  const label=document.createElement('span');label.className='world-label';
  label.textContent='SYNTHETIC SURVEY';host.append(label);
  const closed=document.createElement('span');closed.className='closed-label';
  closed.textContent='UPPER HILL CLOSED — NO ENTRY';host.append(closed);
  for(const e of SAFE_EDGES){
    edgeLine(host,e.a,e.b,(state.surveyedEdges.includes(e.id)?'surveyed ':'')+
      (state.markedEdges.includes(e.id)?'marked':''));
  }
  edgeLine(host,'fence_view',CLOSED_NODE,'closed');
  const closedNode=document.createElement('span');closedNode.className='closed-node';
  closedNode.textContent='CLOSED';host.append(closedNode);
  for(const id of NODES){
    const b=document.createElement('button');b.type='button';
    b.className='anchor'+(state.position===id?' active':'');
    b.textContent=names[id];b.setAttribute('aria-label','Walk Milo to '+names[id]);
    b.disabled=state.provisionalFinished||!adjacent(state.position,id);
    b.style.left=coords[id][0]+'%';b.style.top=coords[id][1]+'%';
    b.addEventListener('click',()=>act({type:'walk',to:id}));host.append(b);
  }
  host.append(actor);
  actor.style.left=coords[state.position][0]+'%';
  actor.style.top=Math.min(91,coords[state.position][1]+16)+'%';
  host.dataset.phase=state.provisionalFinished?'complete':'survey';
}
function movement(){
  const host=$('walk-controls');host.replaceChildren();
  for(const id of NODES){
    button(host,'Go to '+names[id],{type:'walk',to:id},
      state.provisionalFinished||!adjacent(state.position,id));
  }
}
function inspect(){
  const host=$('inspect-controls');host.replaceChildren();
  for(const [id,clue] of Object.entries(CLUES)){
    button(host,'Look: '+clueNames[id],{type:'inspect',clueId:id},
      state.provisionalFinished||state.position!==clue.at||state.inspected.includes(id));
  }
  const boundary=$('boundary-controls');boundary.replaceChildren();
  button(boundary,'Try closed way (stop safely)',{type:'walk',to:CLOSED_NODE},
    state.provisionalFinished||state.position!=='fence_view');
  $('feedback').textContent=state.feedback;
  $('inspections').textContent='Milo: '+names[state.position]+'. Inspected: '+
    (state.inspected.map(id=>clueNames[id]).join(', ')||'nothing yet')+
    '. Closed attempts: '+state.blockedAttempts+'. No crossing.';
  $('parent-cue').hidden=!state.inspected.includes('boundary_sign')||state.provisionalFinished;
}
function sketch(){
  const host=$('mark-controls');host.replaceChildren();
  for(const e of SAFE_EDGES){
    const marked=state.markedEdges.includes(e.id);
    button(host,(marked?'Remove: ':'Mark: ')+edgeNames[e.id],
      {type:marked?'unmark':'mark',edgeId:e.id},state.provisionalFinished,marked);
  }
  button(host,'Try marking closed edge',{type:'mark',edgeId:CLOSED_EDGE},
    state.provisionalFinished);
  const controls=$('route-controls');controls.replaceChildren();
  button(controls,'Check my sketch',{type:'check-route'},state.provisionalFinished);
  const r=state.routeResult;
  $('route-status').textContent='Walked '+state.surveyedEdges.length+'/4 model edges; marked '+
    state.markedEdges.length+'. '+(!r?'Check your marked route.':
      r.complete?'Continuous model route to overlook.':
      'Sketch has a gap at '+edgeNames[r.nextGap]+'. Walk and revise.')+
    ' A model route is not real access permission.';
}
function thoughts(){
  const host=$('thought-controls');host.replaceChildren();
  for(const id of Object.keys(HYPOTHESES)){
    button(host,'Consider: '+(id==='water_may_change_ground'?'Water and ground':'Old line continues'),
      {type:'consider',hypothesisId:id},
      state.provisionalFinished||!state.inspected.includes('disturbed_ground')||
        state.hypotheses.includes(id));
  }
  button(host,'Compare distant mark shape',{type:'compare-symbol'},
    state.provisionalFinished||state.position!=='overlook'||
    !state.inspected.includes('distant_symbol')||state.symbolCompared);
  $('symbol-status').textContent=state.symbolCompared?
    'The shape matches the E01 sketch. The place is still unknown.':
    'Look at the distant mark from the model overlook before comparing.';
}
function items(host,values){
  host.replaceChildren();
  for(const value of values){
    const li=document.createElement('li');li.textContent=value;host.append(li);
  }
}
function notebook(){
  const p=previewProjection(state);
  items($('seen'),p.cards.seen.map(x=>x.text));
  items($('think'),p.cards.think.length?p.cards.think:['No guesses recorded.']);
  items($('unknown'),p.cards.unknown);
  const host=$('finish-controls');host.replaceChildren();
  const ready=!!state.routeResult?.complete&&state.symbolCompared&&
    required.every(id=>state.inspected.includes(id));
  button(host,'Review field notes',{type:'review'},
    state.provisionalFinished||!ready||state.reviewed);
  button(host,'Finish model survey',{type:'finish-preview'},
    state.provisionalFinished||!state.reviewed);
  $('chronicle').textContent='MODEL ONLY: '+p.cards.seen.length+' seen; '+
    p.cards.think.length+' thoughts; '+p.cards.unknown.length+' unknowns. '+
    'Canonical events: 0; unlocks: 0; historical claims: 0.';
  $('hook').hidden=!state.provisionalFinished;
  $('hook').textContent=state.provisionalFinished?
    'Model complete. E10 remains NOT UNLOCKED. What is the place beyond the mark? The old hill way stays closed.':'';
}
function render(){world();movement();inspect();sketch();thoughts();notebook();}
$('restart').addEventListener('click',()=>act({type:'reset'}));
window.addEventListener('resize',world);
render();
