// E10 child-story -> E11 child-story PAPER handoff. No production unlock or approved source.
import * as E10 from './unnamed-story-model.mjs';
import * as E11 from './loop-story-model.mjs';
export const VERSION='s01e10-e11-story-handoff-paper-v1',MAX_ACTIONS=250;
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function fresh(){return {version:VERSION,mode:'noncanonical_paper',stage:'e10',
 e10:E10.fresh(),e11:E11.fresh(),handoff:null,history:[],
 canonicalEvents:[],unlocks:[],historicalClaims:[],rights:[]};}
function clean(a){
 if(!a||typeof a!=='object'||Array.isArray(a))return null;
 if(a.scene==='nav'&&['to-e11','to-e10','restart-e10'].includes(a.type))
   return {scene:'nav',type:a.type};
 if(['e10','e11'].includes(a.scene)&&a.action&&typeof a.action==='object'&&!Array.isArray(a.action))
   return {scene:a.scene,action:a.action};
 return null;
}
function eligible(s){
 const v=E10.view(s.e10);
 return !!(v?.finishedPaper&&v.sourceChecked&&v.actualName===null&&
   v.e11Unlocked===false&&v.sourceApproved===false&&v.realAccessApproved===false&&
   s.e10.e10.fixtureEnabled===false&&s.e10.e10.nameRevealed===false);
}
function apply(s,a){
 if(a.scene==='nav'){
  if(a.type==='to-e11'&&s.stage==='e10'&&eligible(s)){
   const needs=Object.fromEntries(Object.entries(s.e10.e10.board).map(([id,slot])=>[id,slot]));
   return {...s,stage:'e11',handoff:{kind:'SIMULATED_PAPER_ONLY',source:'UNKNOWN',needs}};
  }
  if(a.type==='to-e10'&&s.stage==='e11')return {...s,stage:'e10'};
  if(a.type==='restart-e10')return {...fresh(),history:s.history};
  return null;
 }
 if(a.scene==='e10'&&s.stage==='e10'&&!s.handoff&&E10.can(s.e10,a.action)){
  const next=E10.dispatch(s.e10,a.action);
  return eq(next,s.e10)?null:{...s,e10:next,e11:E11.fresh()};
 }
 if(a.scene==='e11'&&s.stage==='e11'&&eligible(s)&&E11.can(s.e11,a.action)){
  const next=E11.dispatch(s.e11,a.action);
  return eq(next,s.e11)?null:{...s,e11:next};
 }
 return null;
}
export function replay(history){
 if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
 let s=fresh();
 for(const raw of history){
  const a=clean(raw);if(!a||!eq(a,raw))return null;
  const n=apply(s,a);if(!n)return null;
  s={...n,history:[...s.history,a]};
 }
 return s;
}
export function restore(snapshot){
 if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||
   snapshot.version!==VERSION||snapshot.mode!=='noncanonical_paper')return null;
 const s=replay(snapshot.history);
 return s&&eq(s,snapshot)?s:null;
}
export function can(snapshot,action){
 const s=restore(snapshot),a=clean(action);
 return !!(s&&s.history.length<MAX_ACTIONS&&a&&eq(a,action)&&apply(s,a));
}
export function dispatch(snapshot,action){
 const s=restore(snapshot);if(!s)return fresh();
 if(action?.scene==='nav'&&action.type==='reset-all'&&eq(action,{scene:'nav',type:'reset-all'}))return fresh();
 if(!can(s,action))return s;
 const a=clean(action),n=apply(s,a);
 return {...n,history:[...s.history,a]};
}
export function view(snapshot){
 const s=restore(snapshot);if(!s)return null;
 const u=E10.view(s.e10),l=E11.view(s.e11);
 return {stage:s.stage,e10:u,e11:l,handoff:s.handoff,
  paperReady:eligible(s),e11PaperFinished:l.finishedPaper,
  sourceStatus:'UNKNOWN',actualName:null,realAccessApproved:false,
  approvedNeeds:false,northHillClosed:true,sharedSpaceOpen:false,
  e11Unlocked:false,seasonFinished:false,canonicalEvents:[],unlocks:[],
  historicalClaims:[],rights:[],
  note:s.stage==='e10'?'Look, listen, revise. A PAPER handoff is not an E11 unlock.':
   'The E10 notes remain SOURCE UNKNOWN. Try a reversible layout; no real opening or Season completion.'};
}
