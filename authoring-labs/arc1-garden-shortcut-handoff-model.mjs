// E06 Lower Garden PAPER outcome -> E07 Finn's Shortcut PAPER story.
// Replay-only composition: no real garden growth, constructed connector, save or unlock.
import * as Up from './arc1-garden-story-handoff-model.mjs';
import * as Short from './shortcut-story-model.mjs';
export const VERSION='arc1-e06-e07-paper-continuity-v1';
export const MAX_ACTIONS=360;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
// Identity cache is safe only while exact serialized bytes match; mutated nested snapshots
// are replayed and rejected, never trusted from an old object identity.
const verified=new WeakMap();
const mark=s=>{verified.set(s,JSON.stringify(s));return s;};
export function fresh(){
 return mark({version:VERSION,mode:'noncanonical_paper',stage:'upstream',
  upstream:Up.fresh(),shortcut:Short.fresh(),history:[],
  canonicalEvents:[],unlocks:[],historicalClaims:[],rights:[]});
}
function clean(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
 let a=null;
 if(raw.scene==='nav'&&['to-shortcut','to-upstream','restart-shortcut','restart-all'].includes(raw.type))
  a={scene:'nav',type:raw.type};
 if(['upstream','shortcut'].includes(raw.scene)&&raw.action&&
    typeof raw.action==='object'&&!Array.isArray(raw.action))
  a={scene:raw.scene,action:raw.action};
 return a&&same(a,raw)?a:null;
}
function apply(s,a){
 if(a.scene==='nav'){
  if(a.type==='to-shortcut'&&s.stage==='upstream'&&
     s.upstream.stage==='garden'&&s.upstream.garden.phase==='finished')
   return {...s,stage:'shortcut'};
  if(a.type==='to-upstream'&&s.stage==='shortcut')return {...s,stage:'upstream'};
  if(a.type==='restart-shortcut'&&s.stage==='shortcut')return {...s,shortcut:Short.fresh()};
  if(a.type==='restart-all')return {...s,stage:'upstream',
    upstream:Up.fresh(),shortcut:Short.fresh()};
  return null;
 }
 if(a.scene==='upstream'&&s.stage==='upstream'){
  const next=Up.dispatch(s.upstream,a.action);
  if(same(next,s.upstream))return null;
  const reset=a.action.scene==='nav'&&['restart-garden','restart-arc1'].includes(a.action.type)||
   a.action.scene==='arc1'&&a.action.action?.scene==='nav'&&a.action.action.type==='restart-e04';
  const lostPocket=s.upstream.garden.phase==='finished'&&next.garden.phase!=='finished';
  return {...s,upstream:next,shortcut:reset||lostPocket?Short.fresh():s.shortcut};
 }
 if(a.scene==='shortcut'&&s.stage==='shortcut'&&s.upstream.garden.phase==='finished'){
  const next=Short.dispatch(s.shortcut,a.action);
  return same(next,s.shortcut)?null:{...s,shortcut:next};
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
 const s=replay(snapshot.history);
 return s&&same(s,snapshot)?mark(snapshot):null;
}
export function can(snapshot,action){
 const s=restore(snapshot),a=clean(action);
 return !!(s&&a&&s.history.length<MAX_ACTIONS&&apply(s,a));
}
export function dispatch(snapshot,action){
 const s=restore(snapshot);if(!s)return fresh();
 const a=clean(action);
 if(!a||s.history.length>=MAX_ACTIONS)return s;
 const next=apply(s,a);
 return next?mark({...next,history:[...s.history,a]}):s;
}
export function view(snapshot){
 const s=restore(snapshot);if(!s)return null;
 const u=Up.view(s.upstream),t=Short.view(s.shortcut);
 return {stage:s.stage,upstream:u,shortcut:t,
  stationMapRoomPaper:u.stationMapRoomPaper,currentGardenHealthy:true,
  currentGardenCompared:u.currentGardenCompared,lowerGardenVisited:u.lowerGardenVisited,
  lowerPocketPaper:u.lowerPocketPaper,connectorPaperRevised:t.previewComplete,
  shortcutAvailable:u.stage==='garden'&&u.lowerPocketPaper,
  paperNote:t.previewComplete?
   'PAPER FIRST/NOW: Finn revised a removable connector for Milo, another traveler and water. The upper garden remains healthy; the lower pocket is only a model. Real route, planting, land rights, history and construction UNKNOWN.':
   'PAPER ONLY: E06 Lower Garden may lead to Finn’s E07 model test. No actual planting, construction, Chronicle or unlock.',
  sourceDates:'UNKNOWN',historicalCause:'UNKNOWN',plantingPermission:'UNKNOWN',
  connectorPermission:'UNKNOWN',northHillClosed:true,lanternLightsOff:true,
  commonRevealed:false,seasonFinished:false,canonicalEvents:[],unlocks:[],
  historicalClaims:[],rights:[]};
}
