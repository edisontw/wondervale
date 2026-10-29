// E05 -> E06 in-memory world-change callback. Authoring only, never canonical.
import * as E05 from '../engine/s01e05-authoring-prototype.mjs';
import * as E06 from '../engine/s01e06-authoring-prototype.mjs';
export const VERSION='season1-paper-world-change-v1';
export const MAX_ACTIONS=150;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function fresh(){return {version:VERSION,mode:'authoring_preview',stage:'station',e05:E05.fresh(),e06:E06.fresh(),history:[],canonicalEvents:[],unlocks:[]};}
function clean(a){
 if(!a||typeof a!=='object'||Array.isArray(a))return null;
 if(a.scene==='nav'&&['to-station','to-current','to-lower'].includes(a.type))return {scene:'nav',type:a.type};
 if(a.scene==='e05'){
  if(a.type==='inspect-feature')return {scene:'e05',type:a.type,id:a.id};
  if(a.type==='place-replica')return {scene:'e05',type:a.type,orientation:a.orientation};
  if(a.type==='place-table')return {scene:'e05',type:a.type,position:a.position};
  if(['compare-fit','note-limits','confirm-room'].includes(a.type))return {scene:'e05',type:a.type};
 }
 if(a.scene==='e06'){
  if(a.type==='walk-to')return {scene:'e06',type:a.type,target:a.target};
  if(a.type==='inspect')return {scene:'e06',type:a.type,id:a.id};
  if(a.type==='set-weather')return {scene:'e06',type:a.type,weather:a.weather};
  if(a.type==='set-channel')return {scene:'e06',type:a.type,channel:a.channel};
  if(a.type==='move-marker')return {scene:'e06',type:a.type,site:a.site};
  if(['run-model','compare-model','visit-lower','inspect-result','confirm-small-trial'].includes(a.type))return {scene:'e06',type:a.type};
 }
 return null;
}
function apply(s,a){
 if(a.scene==='nav'){
  if(a.type==='to-station')return s.stage==='station'?null:{...s,stage:'station'};
  if(a.type==='to-current'&&s.e05.roomPreview)return s.stage==='current'?null:{...s,stage:'current'};
  if(a.type==='to-lower'&&s.e06.phase!=='current')return s.stage==='lower'?null:{...s,stage:'lower'};
  return null;
 }
 if(a.scene==='e05'){
  if(s.stage!=='station')return null;
  const {scene,...action}=a;
  const next=E05.dispatch(s.e05,action);
  return same(next,s.e05)?null:{...s,e05:next};
 }
 if(a.scene==='e06'){
  if(s.stage==='current'&&s.e06.phase!=='current')return null;
  if(s.stage==='lower'&&s.e06.phase==='current')return null;
  if(!['current','lower'].includes(s.stage))return null;
  const {scene,...action}=a;
  const next=E06.dispatch(s.e06,action);
  return same(next,s.e06)?null:{...s,e06:next,stage:next.phase==='lower'||next.phase==='done'?'lower':s.stage};
 }
 return null;
}
export function replay(history){
 if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
 let s=fresh();
 for(const action of history){
  const a=clean(action);
  if(!a||!same(a,action))return null;
  const next=apply(s,a);
  if(!next)return null;
  s={...next,history:[...s.history,a]};
 }
 return s;
}
export function restore(s){
 if(!s||typeof s!=='object'||Array.isArray(s)||s.version!==VERSION||s.mode!=='authoring_preview')return null;
 const rebuilt=replay(s.history);
 return rebuilt&&same(rebuilt,s)?rebuilt:null;
}
export function dispatch(state,action){
 const s=restore(state);
 if(!s)return fresh();
 if(s.history.length>=MAX_ACTIONS)return s;
 const a=clean(action);
 if(!a||!same(a,action))return s;
 const next=apply(s,a);
 return next?{...next,history:[...s.history,a]}:s;
}
export function project(state){
 const s=restore(state);if(!s)return null;
 const station=E05.previewProjection(s.e05),garden=E06.previewProjection(s.e06);
 return {stage:s.stage,station, garden,
  mapRoomVisible:s.e05.roomPreview,upperGardenHealthy:garden.presentGardenHealthy,
  rainCompared:s.e06.modelCompared,lowerPocketVisible:s.e06.lowerPreviewStarted,
  lowerSite:s.e06.markerSite,historyLength:s.history.length,
  canonicalEvents:[],unlocks:[],historicalClaims:[],
  note:'Paper models only: no actual history, garden permission, production Chronicle or episode unlock.'};
}
