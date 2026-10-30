// E09 CLOSED Hill -> E10 unnamed FICTIONAL PAPER courtyard. Never a production unlock.
import * as Up from './arc1-lantern-hill-handoff-model.mjs';
import * as E10 from './unnamed-story-model.mjs';
export const VERSION='arc1-e09-e10-paper-continuity-v1',MAX_ACTIONS=800;
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const verified=new WeakMap(),mark=s=>(verified.set(s,JSON.stringify(s)),s);
export function fresh(){return mark({version:VERSION,mode:'noncanonical_paper',stage:'upstream',
 upstream:Up.fresh(),e10:E10.fresh(),history:[],canonicalEvents:[],unlocks:[],historicalClaims:[],rights:[]});}
function clean(a){
 if(!a||typeof a!=='object'||Array.isArray(a))return null;
 let out=null;
 if(a.scene==='nav'&&['to-e10','to-hill-e10','restart-e10','restart-all-e10'].includes(a.type))out={scene:'nav',type:a.type};
 if(['upstream','e10'].includes(a.scene)&&a.action&&typeof a.action==='object'&&!Array.isArray(a.action))out={scene:a.scene,action:a.action};
 return out&&eq(out,a)?out:null;
}
function eligible(upstream){
 const v=Up.view(upstream);
 return !!(v?.hillPaperFinished&&v.hill?.routeResult?.complete&&v.hill.symbolCompared&&
  v.northHillClosed&&v.distantPlaceIdentity==='UNKNOWN'&&v.sourceDates==='UNKNOWN'&&
  v.closureDate==='UNKNOWN'&&v.closureCause==='UNKNOWN'&&v.e10Unlocked===false&&v.commonRevealed===false);
}
function apply(s,a){
 if(a.scene==='nav'){
  if(a.type==='to-e10'&&s.stage==='upstream'&&Up.view(s.upstream)?.stage==='hill'&&eligible(s.upstream))return {...s,stage:'e10'};
  if(a.type==='to-hill-e10'&&s.stage==='e10')return {...s,stage:'upstream'};
  if(a.type==='restart-e10'&&s.stage==='e10')return {...s,e10:E10.fresh()};
  if(a.type==='restart-all-e10')return {...s,stage:'upstream',upstream:Up.fresh(),e10:E10.fresh()};
  return null;
 }
 if(a.scene==='upstream'&&s.stage==='upstream'){
  if(!Up.can(s.upstream,a.action))return null;
  const n=Up.dispatch(s.upstream,a.action);if(eq(n,s.upstream))return null;
  return {...s,upstream:n,e10:eligible(n)?s.e10:E10.fresh()};
 }
 if(a.scene==='e10'&&s.stage==='e10'&&eligible(s.upstream)){
  if(!E10.can(s.e10,a.action))return null;
  const n=E10.dispatch(s.e10,a.action);return eq(n,s.e10)?null:{...s,e10:n};
 }
 return null;
}
export function replay(history){
 if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
 let s=fresh();
 for(const raw of history){const a=clean(raw);if(!a)return null;const n=apply(s,a);if(!n)return null;s={...n,history:[...s.history,a]};}
 return mark(s);
}
export function restore(s){
 if(!s||typeof s!=='object'||Array.isArray(s)||s.version!==VERSION||s.mode!=='noncanonical_paper')return null;
 if(verified.get(s)===JSON.stringify(s))return s;
 const r=replay(s.history);return r&&eq(r,s)?mark(s):null;
}
export function can(s,a){
 s=restore(s);a=clean(a);if(!s||!a||s.history.length>=MAX_ACTIONS)return false;
 if(a.scene==='upstream')return s.stage==='upstream'&&Up.can(s.upstream,a.action);
 if(a.scene==='e10')return s.stage==='e10'&&eligible(s.upstream)&&E10.can(s.e10,a.action);
 return !!apply(s,a);
}
export function dispatch(s,a){
 s=restore(s);if(!s)return fresh();a=clean(a);
 if(!a||s.history.length>=MAX_ACTIONS)return s;
 const n=apply(s,a);return n?mark({...n,history:[...s.history,a]}):s;
}
export function view(s){
 s=restore(s);if(!s)return null;
 const u=Up.view(s.upstream),e=E10.view(s.e10);
 return {stage:s.stage,upstream:u,e10:e,e10PaperAvailable:eligible(s.upstream),e10PaperFinished:e.finishedPaper,
  northHillClosed:true,distantPlaceIdentity:'UNKNOWN',sourceDates:'UNKNOWN',closureDate:'UNKNOWN',closureCause:'UNKNOWN',
  realAccessApproved:false,e10Unlocked:false,e11Unlocked:false,commonRevealed:false,seasonFinished:false,
  canonicalEvents:[],unlocks:[],historicalClaims:[],rights:[],
  paperNote:e.finishedPaper?
   'E09 PAPER CLOSED hill and unnamed distant mark. E10 FICTIONAL courtyard: SEEN / MAYBE / SIMULATED NEEDS / UNKNOWN. E11 NOT UNLOCKED; no real entry, approved name or Chronicle.':
   'E09 lower overlook shows an UNKNOWN distant mark, not an E10 entrance. E10 is a separate FICTIONAL PAPER model only; North Hill CLOSED.'};
}
