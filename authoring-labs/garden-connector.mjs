// E06 lower pocket -> E07 connector callback, isolated paper authoring only.
import * as E06 from '../engine/s01e06-authoring-prototype.mjs';
import * as E07 from '../engine/s01e07-authoring-prototype.mjs';
export const VERSION='season1-garden-connector-paper-v1';
export const MAX_ACTIONS=160;
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function fresh(){
 return {version:VERSION,mode:'authoring_preview',stage:'garden',
  garden:E06.fresh(),connector:E07.fresh(),history:[],
  canonicalEvents:[],unlocks:[],historicalClaims:[]};
}
function clean(a){
 if(!a||typeof a!=='object'||Array.isArray(a))return null;
 if(a.scene==='nav'&&['to-garden','to-connector'].includes(a.type))return {scene:'nav',type:a.type};
 if(a.scene==='garden'){
  if(a.type==='walk-to')return {scene:'garden',type:a.type,target:a.target};
  if(a.type==='inspect')return {scene:'garden',type:a.type,id:a.id};
  if(a.type==='set-weather')return {scene:'garden',type:a.type,weather:a.weather};
  if(a.type==='set-channel')return {scene:'garden',type:a.type,channel:a.channel};
  if(a.type==='move-marker')return {scene:'garden',type:a.type,site:a.site};
  if(['run-model','compare-model','visit-lower','inspect-result','confirm-small-trial'].includes(a.type))return {scene:'garden',type:a.type};
 }
 if(a.scene==='connector'){
  if(['walk','inspect'].includes(a.type))return {scene:'connector',type:a.type,anchor:a.anchor};
  if(a.type==='place-piece')return {scene:'connector',type:a.type,pieceId:a.pieceId,snapId:a.snapId};
  if(['test-milo','test-resident','test-water','run-all-traces','undo-piece','compare-layouts','confirm-preview'].includes(a.type))return {scene:'connector',type:a.type};
 }
 return null;
}
function apply(s,a){
 if(a.scene==='nav'){
  if(a.type==='to-connector'&&s.garden.lowerPreviewStarted&&s.stage!=='connector')return {...s,stage:'connector'};
  if(a.type==='to-garden'&&s.stage==='connector')return {...s,stage:'garden'};
  return null;
 }
 if(a.scene==='garden'&&s.stage==='garden'){
  const {scene,...action}=a;
  const next=E06.dispatch(s.garden,action);
  return equal(next,s.garden)?null:{...s,garden:next};
 }
 if(a.scene==='connector'&&s.stage==='connector'&&s.garden.lowerPreviewStarted){
  const {scene,...action}=a;
  const next=E07.dispatch(s.connector,action);
  return equal(next,s.connector)?null:{...s,connector:next};
 }
 return null;
}
export function replay(history){
 if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
 let s=fresh();
 for(const a of history){
  const c=clean(a);if(!c||!equal(c,a))return null;
  const n=apply(s,c);if(!n)return null;
  s={...n,history:[...s.history,c]};
 }
 return s;
}
export function restore(snapshot){
 if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||
  snapshot.version!==VERSION||snapshot.mode!=='authoring_preview')return null;
 const s=replay(snapshot.history);
 return s&&equal(s,snapshot)?s:null;
}
export function dispatch(state,action){
 const s=restore(state);if(!s)return fresh();
 if(s.history.length>=MAX_ACTIONS)return s;
 const c=clean(action);if(!c||!equal(c,action))return s;
 const n=apply(s,c);return n?{...n,history:[...s.history,c]}:s;
}
export function project(state){
 const s=restore(state);if(!s)return null;
 const garden=E06.previewProjection(s.garden),connector=E07.previewProjection(s.connector);
 const firstComplete=Object.values(s.connector.firstTrials).every(Boolean);
 const pocketStage=!s.garden.lowerPreviewStarted?'not-planted':
  s.connector.previewComplete?'paper-leaves':firstComplete?'paper-sprout':'paper-seed';
 return {stage:s.stage,garden,connector,pocketStage,
  upperGardenHealthy:true,lowerPocketVisible:s.garden.lowerPreviewStarted,
  firstConnectorTested:firstComplete,connectorPreviewComplete:s.connector.previewComplete,
  stepsBaseHook:s.connector.previewComplete?'Lantern Steps base is the next paper question; the lights are still off.':null,
  canonicalEvents:[],unlocks:[],historicalClaims:[],
  note:'Paper time markers, not measured plant growth, approved paths, history, permission or production Chronicle.'};
}
