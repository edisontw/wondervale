// E11 child-driven PAPER story wrapper. Never a canonical season completion.
import * as E11 from '../engine/s01e11-authoring-prototype.mjs';
export const VERSION='s01e11-paper-story-v1',MAX_STEPS=150;
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function fresh(){return {version:VERSION,mode:'noncanonical_paper',started:false,
 e11:E11.fresh(),walked:0,firstFailed:false,revisedAfterFailure:false,finishedPaper:false,
 history:[],canonicalEvents:[],unlocks:[],historicalClaims:[],rights:[]};}
function clean(a){
 if(!a||typeof a!=='object'||Array.isArray(a))return null;
 if(['start','snapshot-trial','check-loop','review-preview','finish-paper'].includes(a.type))return {type:a.type};
 if(a.type==='move-milo')return {type:a.type,to:a.to};
 if(a.type==='place')return {type:a.type,tokenId:a.tokenId,cells:a.cells};
 if(a.type==='lift')return {type:a.type,tokenId:a.tokenId};
 if(a.type==='test-user')return {type:a.type,userId:a.userId};
 if(a.type==='compare-trials')return {type:a.type,first:a.first,second:a.second};
 if(a.type==='cite-earlier')return {type:a.type,discoveryId:a.discoveryId};
 if(['add-loop-edge','remove-loop-edge'].includes(a.type))return {type:a.type,edgeId:a.edgeId};
 return null; // No real source, access, finish, unlock, or rights command.
}
function apply(s,a){
 if(a.type==='start')return s.started?null:{...s,started:true};
 if(!s.started||s.finishedPaper)return null;
 if(a.type==='finish-paper'){
  return s.walked>0&&s.firstFailed&&s.revisedAfterFailure&&s.e11.reviewed&&
   s.e11.trials.length>=2?{...s,finishedPaper:true}:null;
 }
 const next=E11.dispatch(s.e11,a);
 if(eq(next,s.e11))return null;
 const failed=a.type==='test-user'&&next.tests[a.userId]?.passed===false;
 const revision=['place','lift'].includes(a.type)&&s.firstFailed&&next.revision>s.e11.revision;
 return {...s,e11:next,walked:s.walked+(a.type==='move-milo'&&next.position!==s.e11.position?1:0),
  firstFailed:s.firstFailed||failed,revisedAfterFailure:s.revisedAfterFailure||revision};
}
export function replay(history){
 if(!Array.isArray(history)||history.length>MAX_STEPS)return null;
 let s=fresh();
 for(const raw of history){
  const a=clean(raw);if(!a||!eq(a,raw))return null;
  const n=apply(s,a);if(!n)return null;
  s={...n,history:[...s.history,a]};
 }return s;
}
export function restore(snapshot){
 if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||snapshot.version!==VERSION||
 snapshot.mode!=='noncanonical_paper'||!Array.isArray(snapshot.history))return null;
 const s=replay(snapshot.history);return s&&eq(s,snapshot)?s:null;
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
 const p=E11.projection(s.e11),last=s.history.at(-1);
 let speaker='Milo',line='Two people need this place. Can I try a PAPER plan?';
 if(last?.type==='start'){speaker='Finn';line='I can draw a short line! But who will use it?';}
 if(last?.type==='move-milo'){speaker='Milo';line=s.e11.position===last.to?'I walk one step. I can look again.':'That way is blocked. I stop safely.';}
 if(last?.type==='place'||last?.type==='lift'){speaker='Nia';line='This is a movable model. We can change it.';}
 if(last?.type==='test-user'){speaker=last.userId==='quiet_reader'?'Nia':'Finn';
  line=s.e11.tests[last.userId]?.passed?'This model user can use the space. Test the other person too.':
   'It blocks a need. What can we move?';}
 if(last?.type==='snapshot-trial'){speaker='Milo';line='I will remember this PAPER trial.';}
 if(last?.type==='compare-trials'){speaker='Nia';line='FIRST and NOW are different. What still needs checking?';}
 if(last?.type==='cite-earlier'){speaker='Finn';line='Our earlier model question helps. It is not approved evidence.';}
 if(last?.type==='add-loop-edge'||last?.type==='remove-loop-edge'){speaker='Milo';line='I am drawing a new model line, not the old closed hill way.';}
 if(last?.type==='check-loop'){speaker='Nia';line=s.e11.loopChecked?'This PAPER loop joins up. Real access is still UNKNOWN.':'This map does not connect yet. Try again.';}
 if(last?.type==='review-preview'){speaker='Finn';line='We tested both needs. We did not build anything.';}
 if(last?.type==='finish-paper'){speaker='Milo';line='We changed it because both people matter. The real place is not open yet.';}
 return {stage:!s.started?'opening':s.finishedPaper?'paper-finished':s.e11.reviewed?'reviewed':
  s.e11.comparison?'map':s.firstFailed?'revise':'try',
  speaker,line,walked:s.walked,position:s.e11.position,layout:p.layout,tests:p.tests,
  trials:p.trials,comparison:p.comparison,citation:p.citation,loopEdges:p.loopEdges,
  loopChecked:p.loopChecked,reviewed:p.reviewed,feedback:p.feedback,
  firstFailed:s.firstFailed,revisedAfterFailure:s.revisedAfterFailure,finishedPaper:s.finishedPaper,
  parentCue:s.firstFailed&&!s.finishedPaper?'Who can use this path? Who might find it hard?':null,
  hook:s.finishedPaper?'PAPER NOTE ONLY: FIRST/NOW, both simulated needs and a model loop. Common CLOSED. North Hill CLOSED. No canonical Chronicle, unlock or Season completion.':
   'MODEL ONLY: source, access, resident consent, drainage and real links UNKNOWN.',
  commonOpen:false,northHillClosed:true,seasonFinished:false,canonicalEvents:[],
  unlocks:[],historicalClaims:[],rights:[]};
}
