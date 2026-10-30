// E08 lower Lantern Steps -> E09 CLOSED Hill PAPER survey.
// Composes previously tested story reducers. Never a production unlock or a real trail.
import * as Up from './arc1-shortcut-lantern-handoff-model.mjs';
import * as Hill from './hill-story-model.mjs';
export const VERSION='arc1-e08-e09-paper-continuity-v1';
export const MAX_ACTIONS=640;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const verified=new WeakMap();
const mark=s=>{verified.set(s,JSON.stringify(s));return s;};
export function fresh(){return mark({version:VERSION,mode:'noncanonical_paper',stage:'upstream',
 upstream:Up.fresh(),hill:Hill.fresh(),history:[],canonicalEvents:[],unlocks:[],
 historicalClaims:[],rights:[]});}
function clean(a){
 if(!a||typeof a!=='object'||Array.isArray(a))return null;
 let out=null;
 if(a.scene==='nav'&&['to-hill','to-steps','restart-hill','restart-whole'].includes(a.type))
  out={scene:'nav',type:a.type};
 if(['upstream','hill'].includes(a.scene)&&a.action&&typeof a.action==='object'&&!Array.isArray(a.action))
  out={scene:a.scene,action:a.action};
 return out&&same(out,a)?out:null;
}
function ready(upstream){
 const v=Up.view(upstream);
 return !!(v&&v.stage==='lantern'&&v.lanternPaperFinished&&
  v.lantern.comparison?.markersUnchanged&&v.sourceDates==='UNKNOWN'&&
  v.servicePlateSource==='UNKNOWN'&&v.northHillClosed);
}
function apply(s,a){
 if(a.scene==='nav'){
  if(a.type==='to-hill'&&s.stage==='upstream'&&ready(s.upstream))return {...s,stage:'hill'};
  if(a.type==='to-steps'&&s.stage==='hill')return {...s,stage:'upstream'};
  if(a.type==='restart-hill'&&s.stage==='hill')return {...s,hill:Hill.fresh()};
  if(a.type==='restart-whole')return {...s,stage:'upstream',upstream:Up.fresh(),hill:Hill.fresh()};
  return null;
 }
 if(a.scene==='upstream'&&s.stage==='upstream'){
  if(!Up.can(s.upstream,a.action))return null;
  const next=Up.dispatch(s.upstream,a.action);
  if(same(next,s.upstream))return null;
  return {...s,upstream:next,hill:ready(next)?s.hill:Hill.fresh()};
 }
 if(a.scene==='hill'&&s.stage==='hill'&&ready(s.upstream)){
  if(!Hill.can(s.hill,a.action))return null;
  const next=Hill.dispatch(s.hill,a.action);
  return same(next,s.hill)?null:{...s,hill:next};
 }
 return null;
}
export function replay(history){
 if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
 let s=fresh();
 for(const raw of history){
  const a=clean(raw);if(!a)return null;
  const next=apply(s,a);if(!next)return null;
  s={...next,history:[...s.history,a]};
 }
 return mark(s);
}
export function restore(snapshot){
 if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||
  snapshot.version!==VERSION||snapshot.mode!=='noncanonical_paper')return null;
 if(verified.get(snapshot)===JSON.stringify(snapshot))return snapshot;
 const r=replay(snapshot.history);return r&&same(r,snapshot)?mark(snapshot):null;
}
export function can(snapshot,action){
 const s=restore(snapshot),a=clean(action);
 if(!s||!a||s.history.length>=MAX_ACTIONS)return false;
 if(a.scene==='upstream')return s.stage==='upstream'&&Up.can(s.upstream,a.action);
 if(a.scene==='hill')return s.stage==='hill'&&ready(s.upstream)&&Hill.can(s.hill,a.action);
 return !!apply(s,a);
}
export function dispatch(snapshot,action){
 const s=restore(snapshot);if(!s)return fresh();
 const a=clean(action);if(!a||s.history.length>=MAX_ACTIONS)return s;
 const next=apply(s,a);
 return next?mark({...next,history:[...s.history,a]}):s;
}
export function view(snapshot){
 const s=restore(snapshot);if(!s)return null;
 const u=Up.view(s.upstream),h=Hill.view(s.hill);
 return {stage:s.stage,upstream:u,hill:h,stationMapRoomPaper:u.stationMapRoomPaper,
  currentGardenHealthy:u.currentGardenHealthy,currentGardenCompared:u.currentGardenCompared,
  lowerGardenVisited:u.lowerGardenVisited,lowerPocketPaper:u.lowerPocketPaper,
  connectorPaperRevised:u.connectorPaperRevised,lanternPaperCompared:u.lanternPaperCompared,
  lanternPaperFinished:u.lanternPaperFinished,hillPaperFinished:h.previewComplete,
  hillAvailable:ready(s.upstream),northHillClosed:true,realAccessApproved:false,
  realLightingApproved:false,servicePlateSource:'UNKNOWN',sourceDates:'UNKNOWN',
  closureDate:'UNKNOWN',closureCause:'UNKNOWN',distantPlaceIdentity:'UNKNOWN',
  e10Unlocked:false,commonRevealed:false,seasonFinished:false,
  canonicalEvents:[],unlocks:[],historicalClaims:[],rights:[],
  paperNote:h.previewComplete?
   'E08 PAPER: same marks from two viewpoints, service plate UNKNOWN. E09 PAPER: Milo stopped at CLOSED fence, surveyed a lower model route and revised a sketch gap. The distant mark is not a place name. E10 NOT UNLOCKED; no real access or Chronicle.':
   'E08 PAPER observation carries a question into E09 PAPER survey, NOT an official E09 unlock. North Hill CLOSED; closure date/cause, safe access and distant identity UNKNOWN. No production Chronicle.'};
}
