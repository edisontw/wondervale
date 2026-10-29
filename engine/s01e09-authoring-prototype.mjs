// E09 isolated authoring model: fictional hill topology, NOT real access/safety evidence.
// Never import into canonical episode runtime, release packaging or unlock logic.
export const VERSION = 's01e09-authoring-prototype-v1';
export const MAX_ACTIONS = 96;
export const NODES = Object.freeze(['steps_base','signpost','fence_view','lower_bend','overlook']);
export const CLOSED_NODE = 'upper_closed';
export const SAFE_EDGES = Object.freeze([
  Object.freeze({id:'steps_base:signpost',a:'steps_base',b:'signpost'}),
  Object.freeze({id:'signpost:fence_view',a:'signpost',b:'fence_view'}),
  Object.freeze({id:'signpost:lower_bend',a:'signpost',b:'lower_bend'}),
  Object.freeze({id:'lower_bend:overlook',a:'lower_bend',b:'overlook'})
]);
export const CLOSED_EDGE = 'fence_view:upper_closed';
export const CLUES = Object.freeze({
  entry_note:Object.freeze({at:'steps_base',seen:'The old line on our sketch points uphill.'}),
  boundary_sign:Object.freeze({at:'signpost',seen:'A sign says the old hill way is closed.'}),
  disturbed_ground:Object.freeze({at:'fence_view',seen:'The ground looks uneven beyond the fence.'}),
  runoff_marks:Object.freeze({at:'lower_bend',seen:'There are visible water marks near the lower bend.'}),
  distant_symbol:Object.freeze({at:'overlook',seen:'A distant mark has the same shape as our E01 sketch.'})
});
export const HYPOTHESES = Object.freeze({
  water_may_change_ground:'Water might change the ground. We have not proved the cause.',
  old_line_may_continue:'The old line might continue beyond the fence. We cannot test it.'
});
const own=(o,k)=>Object.hasOwn(o,k);
const copy=x=>JSON.parse(JSON.stringify(x));
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const edge=id=>SAFE_EDGES.find(e=>e.id===id);
const required=['boundary_sign','disturbed_ground','runoff_marks','distant_symbol'];
const routeIds=['steps_base:signpost','signpost:lower_bend','lower_bend:overlook'];

export function routeCheck(markedEdges,surveyedEdges){
  if(!Array.isArray(markedEdges)||!Array.isArray(surveyedEdges)||
     markedEdges.some(id=>!edge(id))||surveyedEdges.some(id=>!edge(id)))return null;
  const selected=SAFE_EDGES.filter(e=>markedEdges.includes(e.id)&&surveyedEdges.includes(e.id));
  const queue=['steps_base'],visited=new Set(queue);
  for(let i=0;i<queue.length;i++){
    const at=queue[i];
    for(const e of selected){
      const to=e.a===at?e.b:e.b===at?e.a:null;
      if(to&&!visited.has(to)){visited.add(to);queue.push(to);}
    }
  }
  const complete=visited.has('overlook');
  const nextGap=complete?null:routeIds.find(id=>!selected.some(e=>e.id===id))??null;
  return {complete,reachable:queue,nextGap,checkedEdgeIds:selected.map(e=>e.id)};
}
export function fresh(){
  return {version:VERSION,mode:'authoring_preview',position:'steps_base',
    inspected:[],observations:[],hypotheses:[],surveyedEdges:[],markedEdges:[],
    blockedAttempts:0,routeResult:null,symbolCompared:false,reviewed:false,
    provisionalFinished:false,feedback:'This is a fictional survey model, not a real route.',
    history:[],canonicalEvents:[],unlocks:[],historicalClaims:[]};
}
function cleanAction(a){
  if(!a||typeof a!=='object'||Array.isArray(a))return null;
  switch(a.type){
    case 'walk':return {type:'walk',to:a.to};
    case 'inspect':return {type:'inspect',clueId:a.clueId};
    case 'mark':case 'unmark':return {type:a.type,edgeId:a.edgeId};
    case 'consider':return {type:'consider',hypothesisId:a.hypothesisId};
    case 'check-route':case 'compare-symbol':case 'review':case 'finish-preview':case 'reset':
      return {type:a.type};
    default:return null;
  }
}
function apply(s,a){
  if(s.provisionalFinished)return null;
  switch(a.type){
    case 'walk':{
      if(typeof a.to!=='string')return null;
      if(a.to===CLOSED_NODE&&s.position==='fence_view')return {...s,blockedAttempts:s.blockedAttempts+1,
        feedback:'This way is closed. We can look from here.'};
      if(!NODES.includes(a.to)||a.to===s.position)return null;
      const e=SAFE_EDGES.find(e=>(e.a===s.position&&e.b===a.to)||(e.b===s.position&&e.a===a.to));
      if(!e)return null;
      return {...s,position:a.to,
        surveyedEdges:s.surveyedEdges.includes(e.id)?s.surveyedEdges:[...s.surveyedEdges,e.id],
        feedback:'Milo walked one declared model edge.'};
    }
    case 'inspect':{
      if(typeof a.clueId!=='string'||!own(CLUES,a.clueId)||
         CLUES[a.clueId].at!==s.position||s.inspected.includes(a.clueId))return null;
      return {...s,inspected:[...s.inspected,a.clueId],
        observations:[...s.observations,{kind:'seen',clueId:a.clueId,text:CLUES[a.clueId].seen}],
        feedback:CLUES[a.clueId].seen};
    }
    case 'consider':{
      if(typeof a.hypothesisId!=='string'||!own(HYPOTHESES,a.hypothesisId)||
         !s.inspected.includes('disturbed_ground')||s.hypotheses.includes(a.hypothesisId))return null;
      return {...s,hypotheses:[...s.hypotheses,a.hypothesisId],
        feedback:'This is a thought, not a verified history.'};
    }
    case 'mark':{
      if(typeof a.edgeId!=='string')return null;
      if(a.edgeId===CLOSED_EDGE)return {...s,blockedAttempts:s.blockedAttempts+1,
        feedback:'The closed edge cannot be marked.'};
      if(!edge(a.edgeId))return null;
      if(!s.surveyedEdges.includes(a.edgeId))return {...s,blockedAttempts:s.blockedAttempts+1,
        feedback:'Walk this model edge before marking it.'};
      if(s.markedEdges.includes(a.edgeId))return null;
      return {...s,markedEdges:[...s.markedEdges,a.edgeId],routeResult:null,reviewed:false,
        provisionalFinished:false,feedback:'Surveyed edge added to the model sketch.'};
    }
    case 'unmark':{
      if(typeof a.edgeId!=='string'||!edge(a.edgeId)||!s.markedEdges.includes(a.edgeId))return null;
      return {...s,markedEdges:s.markedEdges.filter(id=>id!==a.edgeId),routeResult:null,
        reviewed:false,feedback:'Mark removed. You can revise the sketch.'};
    }
    case 'check-route':{
      const result=routeCheck(s.markedEdges,s.surveyedEdges);
      if(!result)return null;
      return {...s,routeResult:result,reviewed:false,
        feedback:result.complete?'A continuous model route reaches the overlook.':
          `The model sketch has a gap: ${result.nextGap??'no path'}.`};
    }
    case 'compare-symbol':{
      if(s.position!=='overlook'||!s.inspected.includes('distant_symbol')||s.symbolCompared)return null;
      return {...s,symbolCompared:true,
        feedback:'The mark shape matches our sketch. We do not know this place yet.'};
    }
    case 'review':{
      if(!s.routeResult?.complete||!s.symbolCompared||!required.every(id=>s.inspected.includes(id)))return null;
      return {...s,reviewed:true,feedback:'We can separate what we saw, thought and still do not know.'};
    }
    case 'finish-preview':{
      if(!s.reviewed||!s.routeResult?.complete||!s.symbolCompared)return null;
      return {...s,provisionalFinished:true,feedback:'Model survey complete. No real route is approved or unlocked.'};
    }
    default:return null;
  }
}
export function replay(history){
  if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
  let s=fresh();
  for(const a of history){
    const clean=cleanAction(a);
    if(!clean||!equal(clean,a)||a.type==='reset')return null;
    const next=apply(s,clean);
    if(!next)return null;
    s={...next,history:[...s.history,copy(clean)]};
  }
  return s;
}
export function restore(snapshot){
  if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||!Array.isArray(snapshot.history))return null;
  const derived=replay(snapshot.history);
  return derived&&equal(derived,snapshot)?derived:null;
}
export function dispatch(snapshot,action){
  const s=restore(snapshot);
  if(!s)return fresh();
  const a=cleanAction(action);
  if(!a||!equal(a,action))return s;
  if(a.type==='reset')return fresh();
  if(s.history.length>=MAX_ACTIONS)return s;
  const next=apply(s,a);
  return next?{...next,history:[...s.history,copy(a)]}:s;
}
export function previewProjection(snapshot){
  const s=restore(snapshot);
  if(!s)return null;
  return {scene:'s01e09-safe-hill-survey-model',label:'AUTHORING MODEL — NOT A REAL ROUTE',
    position:s.position,closedNode:CLOSED_NODE,closedEdge:CLOSED_EDGE,
    surveyedEdges:[...s.surveyedEdges],markedEdges:[...s.markedEdges],
    blockedAttempts:s.blockedAttempts,routeResult:copy(s.routeResult),
    cards:{seen:copy(s.observations),think:s.hypotheses.map(id=>HYPOTHESES[id]),
      unknown:['Actual closure cause and date','Actual public access and terrain safety',
        'Identity of the distant place']},
    symbolCompared:s.symbolCompared,reviewed:s.reviewed,
    provisionalFinished:s.provisionalFinished,feedback:s.feedback,
    next:'E10 question only — production NOT unlocked',
    canonicalEvents:[],unlocks:[],historicalClaims:[]};
}
