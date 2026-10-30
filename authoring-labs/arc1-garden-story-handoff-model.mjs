// Arc 1 E03/E04/E05 paper story -> E06 Current/Lower Garden child story.
// Strictly noncanonical and in-memory. Reuses verified story reducers, not production saves.
import * as Arc1 from './arc1-memory-station-handoff-model.mjs';
import * as Garden from './lower-garden-story-model.mjs';
export const VERSION='arc1-e05-e06-paper-story-handoff-v1';
export const MAX_ACTIONS=240;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
// Replay verified external snapshots; only reuse locally produced, byte-identical states.
const verified=new WeakMap();
const mark=s=>(verified.set(s,JSON.stringify(s)),s);
export function fresh(){
 return mark({version:VERSION,mode:'noncanonical_paper',stage:'arc1',
  arc1:Arc1.fresh(),garden:Garden.fresh(),history:[],
  canonicalEvents:[],unlocks:[],historicalClaims:[],rights:[]});
}
function clean(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
 if(raw.scene==='nav'&&['to-garden','to-arc1','restart-garden','restart-arc1'].includes(raw.type))
  return {scene:'nav',type:raw.type};
 if(['arc1','garden'].includes(raw.scene)&&raw.action&&
   typeof raw.action==='object'&&!Array.isArray(raw.action))
  return {scene:raw.scene,action:raw.action};
 return null;
}
function apply(s,a){
 if(a.scene==='nav'){
  if(a.type==='to-garden'&&s.stage==='arc1'&&s.arc1.stage==='e05'&&
     Arc1.view(s.arc1).stationPaperFinished)return {...s,stage:'garden'};
  if(a.type==='to-arc1'&&s.stage==='garden')return {...s,stage:'arc1'};
  if(a.type==='restart-garden'&&s.stage==='garden')
   return {...s,garden:Garden.fresh()};
  if(a.type==='restart-arc1')
   return {...s,stage:'arc1',arc1:Arc1.fresh(),garden:Garden.fresh()};
  return null;
 }
 if(a.scene==='arc1'&&s.stage==='arc1'&&Arc1.can(s.arc1,a.action)){
  const next=Arc1.dispatch(s.arc1,a.action);
  if(same(next,s.arc1))return null;
  return {...s,arc1:next,
   // Restarting upstream E04 must invalidate every downstream paper garden attempt.
   garden:a.action.scene==='nav'&&a.action.type==='restart-e04'?Garden.fresh():s.garden};
 }
 if(a.scene==='garden'&&s.stage==='garden'&&
    s.arc1.stage==='e05'&&Arc1.view(s.arc1).stationPaperFinished&&
    Garden.can(s.garden,a.action)){
  const next=Garden.dispatch(s.garden,a.action);
  return same(next,s.garden)?null:{...s,garden:next};
 }
 return null;
}
export function replay(history){
 if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
 let s=fresh();
 for(const raw of history){
  const a=clean(raw);
  if(!a||!same(a,raw))return null;
  const next=apply(s,a);if(!next)return null;
  s={...next,history:[...s.history,a]};
 }
 return mark(s);
}
export function restore(snapshot){
 if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||
   snapshot.version!==VERSION||snapshot.mode!=='noncanonical_paper')return null;
 if(verified.get(snapshot)===JSON.stringify(snapshot))return snapshot;
 const r=replay(snapshot.history);
 return r&&same(r,snapshot)?mark(snapshot):null;
}
export function can(snapshot,action){
 const s=restore(snapshot),a=clean(action);
 return !!(s&&s.history.length<MAX_ACTIONS&&a&&same(a,action)&&apply(s,a));
}
export function dispatch(snapshot,action){
 const s=restore(snapshot);if(!s)return fresh();
 const a=clean(action);
 if(!a||!same(a,action)||s.history.length>=MAX_ACTIONS)return s;
 const next=apply(s,a);
 return next?mark({...next,history:[...s.history,a]}):s;
}
export function view(snapshot){
 const s=restore(snapshot);if(!s)return null;
 const a=Arc1.view(s.arc1),g=Garden.view(s.garden);
 return {stage:s.stage,arc1:a,garden:g,
  stationMapRoomPaper:a.station.mapRoom===true,
  currentGardenHealthy:true,lowerPocketPaper:g.phase==='finished',
  gardenAvailable:a.stationPaperFinished&&a.stage==='e05',
  currentGardenCompared:g.modelCompared,lowerGardenVisited:g.lowerVisited,
  sourceDates:'UNKNOWN',historicalCause:'UNKNOWN',plantingPermission:'UNKNOWN',
  stationAccessApproved:false,realGardenAccessApproved:false,
  northHillClosed:true,commonRevealed:false,seasonFinished:false,
  canonicalEvents:[],unlocks:[],historicalClaims:[],rights:[],
  paperNote:g.phase==='finished'?g.paperNote:
   'PAPER ONLY: E05 station model can lead to a two-garden trial. Real history, access and planting permission UNKNOWN.'};
}
