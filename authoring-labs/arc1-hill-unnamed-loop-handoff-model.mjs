// E03 memories through E11 reversible PAPER story, never a production unlock.
// Compose the existing guarded E09->E10 chain and E11 child-story reducer.
import * as Up from './arc1-hill-unnamed-handoff-model.mjs';
import * as E11 from './loop-story-model.mjs';
export const VERSION='arc1-e09-e10-e11-paper-continuity-v1',MAX_ACTIONS=950;
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const verified=new WeakMap(),mark=s=>(verified.set(s,JSON.stringify(s)),s);
export function fresh(){return mark({version:VERSION,mode:'noncanonical_paper',stage:'upstream',
 upstream:Up.fresh(),e11:E11.fresh(),handoff:null,history:[],
 canonicalEvents:[],unlocks:[],historicalClaims:[],rights:[]});}
function clean(a){
 if(!a||typeof a!=='object'||Array.isArray(a))return null;
 let out=null;
 if(a.scene==='nav'&&['to-e11','to-e10-e11','restart-e11','restart-all-e11'].includes(a.type))
   out={scene:'nav',type:a.type};
 if(['upstream','e11'].includes(a.scene)&&a.action&&typeof a.action==='object'&&!Array.isArray(a.action))
   out={scene:a.scene,action:a.action};
 return out&&eq(out,a)?out:null;
}
function eligible(upstream){
 // Most Arc 1 actions precede E10; skip expensive nested projections until E10 finishes.
 if(!upstream?.e10?.finishedPaper)return false;
 const v=Up.view(upstream);
 return !!(v?.e10PaperFinished&&v.e10?.finishedPaper&&v.e10.sourceChecked&&
  v.e10.sourceApproved===false&&v.e10.actualName===null&&
  v.northHillClosed&&v.distantPlaceIdentity==='UNKNOWN'&&
  v.sourceDates==='UNKNOWN'&&v.realAccessApproved===false&&
  v.e10Unlocked===false&&v.e11Unlocked===false&&v.commonRevealed===false&&
  v.upstream?.hillPaperFinished&&v.upstream.hill?.routeResult?.complete&&
  v.upstream.hill.symbolCompared&&v.upstream.e10Unlocked===false);
}
function apply(s,a){
 if(a.scene==='nav'){
  if(a.type==='to-e11'&&s.stage==='upstream'&&Up.view(s.upstream)?.stage==='e10'&&eligible(s.upstream)){
   const needs={...Up.view(s.upstream).e10.board};
   return {...s,stage:'e11',handoff:{kind:'SIMULATED_PAPER_ONLY',source:'UNKNOWN',needs}};
  }
  if(a.type==='to-e10-e11'&&s.stage==='e11')return {...s,stage:'upstream'};
  if(a.type==='restart-e11'&&s.stage==='e11')return {...s,e11:E11.fresh()};
  if(a.type==='restart-all-e11')return {...fresh(),history:s.history};
  return null;
 }
 if(a.scene==='upstream'&&s.stage==='upstream'){
  // The strict upstream reducer already rejects invalid actions; do not replay its guard twice.
  const n=Up.dispatch(s.upstream,a.action);if(eq(n,s.upstream))return null;
  const keep=eligible(n)&&eq(n.e10,s.upstream.e10);
  return {...s,upstream:n,e11:keep?s.e11:E11.fresh(),handoff:keep?s.handoff:null};
 }
 if(a.scene==='e11'&&s.stage==='e11'&&eligible(s.upstream)){
  const n=E11.dispatch(s.e11,a.action);
  return eq(n,s.e11)?null:{...s,e11:n};
 }
 return null;
}
export function replay(history){
 if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
 let s=fresh();
 for(const raw of history){
  const a=clean(raw);if(!a)return null;
  const n=apply(s,a);if(!n)return null;
  s={...n,history:[...s.history,a]};
 }
 return mark(s);
}
export function restore(s){
 if(!s||typeof s!=='object'||Array.isArray(s)||s.version!==VERSION||s.mode!=='noncanonical_paper')return null;
 if(verified.get(s)===JSON.stringify(s))return s;
 const r=replay(s.history);return r&&eq(r,s)?mark(s):null;
}
export function can(s,a){
 s=restore(s);a=clean(a);
 if(!s||!a||s.history.length>=MAX_ACTIONS)return false;
 if(a.scene==='upstream')return s.stage==='upstream'&&Up.can(s.upstream,a.action);
 if(a.scene==='e11')return s.stage==='e11'&&eligible(s.upstream)&&E11.can(s.e11,a.action);
 return !!apply(s,a);
}
export function dispatch(s,a){
 s=restore(s);if(!s)return fresh();a=clean(a);
 if(!a||s.history.length>=MAX_ACTIONS)return s;
 const n=apply(s,a);
 return n?mark({...n,history:[...s.history,a]}):s;
}
export function view(s){
 s=restore(s);if(!s)return null;
 const u=Up.view(s.upstream),e=E11.view(s.e11);
 return {stage:s.stage,upstream:u,e11:e,handoff:s.handoff,
  e11PaperAvailable:eligible(s.upstream),e11PaperFinished:e.finishedPaper,
  northHillClosed:true,distantPlaceIdentity:'UNKNOWN',sourceDates:'UNKNOWN',
  realAccessApproved:false,sharedSpaceOpen:false,commonRevealed:false,
  e11Unlocked:false,seasonFinished:false,canonicalEvents:[],unlocks:[],
  historicalClaims:[],rights:[],
  paperNote:e.finishedPaper?
   'E11 PAPER layout: both SIMULATED needs tested, revised FIRST/NOW and a FICTIONAL loop. Shared space CLOSED; no Season completion.':
   'E09 hill CLOSED; E10 source/name UNKNOWN. E11 PAPER layout is not a production unlock.'};
}
