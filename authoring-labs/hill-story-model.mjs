// E09 child-driven PAPER survey story. Reuses strict synthetic E09 graph only.
// No real access, safety approval, historical claims, Chronicle or canonical unlock.
import * as E09 from '../engine/s01e09-authoring-prototype.mjs';
export const VERSION='s01e09-hill-story-paper-v1';
export const MAX_STEPS=120;
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function fresh(){return {version:VERSION,mode:'authoring_preview',started:false,hill:E09.fresh(),history:[],canonicalEvents:[],unlocks:[],historicalClaims:[]};}
function clean(a){
 if(!a||typeof a!=='object'||Array.isArray(a))return null;
 if(a.type==='start')return {type:'start'};
 if(a.type==='walk')return {type:'walk',to:a.to};
 if(a.type==='inspect')return {type:'inspect',clueId:a.clueId};
 if(a.type==='consider')return {type:'consider',hypothesisId:a.hypothesisId};
 if(a.type==='mark'||a.type==='unmark')return {type:a.type,edgeId:a.edgeId};
 if(['check-route','compare-symbol','review','finish-preview'].includes(a.type))return {type:a.type};
 return null;
}
function apply(s,a){
 if(a.type==='start')return s.started?null:{...s,started:true};
 if(!s.started||s.hill.provisionalFinished)return null;
 const n=E09.dispatch(s.hill,a);
 return eq(n,s.hill)?null:{...s,hill:n};
}
export function replay(history){
 if(!Array.isArray(history)||history.length>MAX_STEPS)return null;
 let s=fresh();
 for(const raw of history){
  const a=clean(raw);
  if(!a||!eq(a,raw))return null;
  const n=apply(s,a);if(!n)return null;
  s={...n,history:[...s.history,a]};
 }
 return s;
}
export function restore(snapshot){
 if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||snapshot.version!==VERSION||snapshot.mode!=='authoring_preview')return null;
 const s=replay(snapshot.history);
 return s&&eq(s,snapshot)?s:null;
}
export function can(snapshot,action){
 const s=restore(snapshot),a=clean(action);
 return !!(s&&s.history.length<MAX_STEPS&&a&&eq(a,action)&&apply(s,a));
}
export function dispatch(snapshot,action){
 const s=restore(snapshot);if(!s)return fresh();
 if(action?.type==='reset'&&eq(action,{type:'reset'}))return fresh();
 if(!can(s,action))return s;
 const a=clean(action),n=apply(s,a);
 return {...n,history:[...s.history,a]};
}
export function view(snapshot){
 const s=restore(snapshot);if(!s)return null;
 const h=s.hill,p=E09.previewProjection(h),last=s.history.at(-1);
 let speaker='Finn',line='The old line points uphill. Can we find out more without crossing?';
 if(last?.type==='start'){speaker='Nia';line='The old way is CLOSED. Milo, look from safe ground.';}
 if(last?.type==='walk'){
  speaker='Milo';line=last.to==='upper_closed'?'I stop here. This way is closed. We can go back.':'I walk to the '+last.to.replaceAll('_',' ')+'.';
 }
 if(last?.type==='inspect'){
  speaker='Nia';line=last.clueId==='boundary_sign'?'The sign says CLOSED. We can look from here.':
   last.clueId==='disturbed_ground'?'I see uneven ground. We do not know when it changed.':
   last.clueId==='runoff_marks'?'I see water marks. That is a clue, not a cause.':
   last.clueId==='distant_symbol'?'I see a familiar shape, but what place is it?':
   'Our old paper sketch points uphill. It cannot grant access.';
 }
 if(last?.type==='consider'){speaker='Milo';line='I think this might be true. We do not know yet.';}
 if(last?.type==='mark'||last?.type==='unmark'){speaker='Finn';line=h.feedback;}
 if(last?.type==='check-route'){speaker='Finn';line=h.routeResult?.complete?'The PAPER route connects. Did we walk every edge?':'There is a gap. We can fix the sketch.';}
 if(last?.type==='compare-symbol'){speaker='Nia';line='The shape matches, but we cannot name the distant place.';}
 if(last?.type==='review'){speaker='Nia';line='We saw clues, made guesses and kept questions open.';}
 if(last?.type==='finish-preview'){speaker='Finn';line='Our PAPER survey is done. The real hill stays CLOSED.';}
 const stage=!s.started?'opening':h.provisionalFinished?'finished':h.reviewed?'reviewed':
  h.routeResult?.complete&&h.symbolCompared?'notes':h.inspected.includes('boundary_sign')?'survey':'look';
 return {stage,speaker,line,position:h.position,inspected:[...h.inspected],
  surveyedEdges:[...h.surveyedEdges],markedEdges:[...h.markedEdges],
  routeResult:h.routeResult,blockedAttempts:h.blockedAttempts,feedback:h.feedback,
  observations:[...h.observations],hypotheses:[...h.hypotheses],
  symbolCompared:h.symbolCompared,reviewed:h.reviewed,previewComplete:h.provisionalFinished,
  parentCue:h.inspected.includes('boundary_sign')&&!h.provisionalFinished?
   'What can Milo still learn without crossing the closed way?':null,
  paperNote:h.provisionalFinished?
   'PAPER NOTE: CLOSED old hill way. A surveyed model route to a lower overlook; a matching distant mark, identity UNKNOWN. E10 NOT UNLOCKED.':
   'AUTHORING MODEL ONLY: Real trail access, terrain, closure date and cause UNKNOWN. Upper North Hill CLOSED.',
  upperHillClosed:true,realAccessApproved:false,historicalDate:null,historicalCause:null,
  distantPlaceName:null,e10Unlocked:false,canonicalEvents:[],unlocks:[],historicalClaims:[]};
}
