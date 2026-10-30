// E07 Finn's PAPER connector -> E08 lower Lantern Steps PAPER viewpoint trial.
// No canonical unlock, historical claims, real wiring, route opening or persistence.
import * as Up from './arc1-garden-shortcut-handoff-model.mjs';
import * as Lantern from './lantern-story-model.mjs';
export const VERSION='arc1-e07-e08-paper-continuity-v1';
export const MAX_ACTIONS=480;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const verified=new WeakMap();
const mark=s=>{verified.set(s,JSON.stringify(s));return s;};
export function fresh(){return mark({version:VERSION,mode:'noncanonical_paper',stage:'upstream',
 upstream:Up.fresh(),lantern:Lantern.fresh(),history:[],canonicalEvents:[],unlocks:[],historicalClaims:[],rights:[]});}
function clean(a){
 if(!a||typeof a!=='object'||Array.isArray(a))return null;
 let out=null;
 if(a.scene==='nav'&&['to-lantern','to-upstream','restart-lantern','restart-all'].includes(a.type))
  out={scene:'nav',type:a.type};
 if(['upstream','lantern'].includes(a.scene)&&a.action&&typeof a.action==='object'&&!Array.isArray(a.action))
  out={scene:a.scene,action:a.action};
 return out&&same(out,a)?out:null;
}
function ready(upstream){const v=Up.view(upstream);return !!(v&&v.stage==='shortcut'&&v.connectorPaperRevised);}
function apply(s,a){
 if(a.scene==='nav'){
  if(a.type==='to-lantern'&&s.stage==='upstream'&&ready(s.upstream))return {...s,stage:'lantern'};
  if(a.type==='to-upstream'&&s.stage==='lantern')return {...s,stage:'upstream'};
  if(a.type==='restart-lantern'&&s.stage==='lantern')return {...s,lantern:Lantern.fresh()};
  if(a.type==='restart-all')return {...s,stage:'upstream',upstream:Up.fresh(),lantern:Lantern.fresh()};
  return null;
 }
 if(a.scene==='upstream'&&s.stage==='upstream'){
  if(!Up.can(s.upstream,a.action))return null;
  const next=Up.dispatch(s.upstream,a.action);
  if(same(next,s.upstream))return null;
  return {...s,upstream:next,lantern:ready(next)?s.lantern:Lantern.fresh()};
 }
 if(a.scene==='lantern'&&s.stage==='lantern'&&ready(s.upstream)){
  if(!Lantern.can(s.lantern,a.action))return null;
  const next=Lantern.dispatch(s.lantern,a.action);
  return same(next,s.lantern)?null:{...s,lantern:next};
 }
 return null;
}
export function replay(history){
 if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
 let s=fresh();
 for(const raw of history){const a=clean(raw);if(!a)return null;
  const next=apply(s,a);if(!next)return null;
  s={...next,history:[...s.history,a]};
 }
 return mark(s);
}
export function restore(snapshot){
 if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||snapshot.version!==VERSION||snapshot.mode!=='noncanonical_paper')return null;
 if(verified.get(snapshot)===JSON.stringify(snapshot))return snapshot;
 const r=replay(snapshot.history);return r&&same(r,snapshot)?mark(snapshot):null;
}
export function can(snapshot,action){
 const s=restore(snapshot),a=clean(action);
 if(!s||!a||s.history.length>=MAX_ACTIONS)return false;
 if(a.scene==='upstream')return s.stage==='upstream'&&Up.can(s.upstream,a.action);
 if(a.scene==='lantern')return s.stage==='lantern'&&ready(s.upstream)&&Lantern.can(s.lantern,a.action);
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
 const u=Up.view(s.upstream),l=Lantern.view(s.lantern);
 return {stage:s.stage,upstream:u,lantern:l,stationMapRoomPaper:u.stationMapRoomPaper,
  currentGardenHealthy:u.currentGardenHealthy,lowerPocketPaper:u.lowerPocketPaper,
  connectorPaperRevised:u.connectorPaperRevised,lanternPaperCompared:l.compared,
  lanternPaperFinished:l.previewComplete,lanternAvailable:ready(s.upstream),
  lowerModelLamps:{...l.lights},sourceDates:'UNKNOWN',servicePlateSource:'UNKNOWN',
  realLightingApproved:false,realConnectorApproved:false,northHillClosed:true,
  commonRevealed:false,seasonFinished:false,canonicalEvents:[],unlocks:[],historicalClaims:[],rights:[],
  paperNote:l.previewComplete?
   'PAPER FIRST/NOW: Finn revised a model route for people and water. Milo checked the same lower marks from two viewpoints under removable model lamps. Their apparent spacing changed, not the marks. Service plate date/source UNKNOWN. E09 NOT UNLOCKED.':
   'PAPER ONLY: E07 FIRST/NOW may lead to E08 lower Steps model; real route, lamps, history and access remain UNKNOWN. North Hill CLOSED. No production Chronicle or unlock.'};
}
