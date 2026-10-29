// E07 revised connector -> E08 lower Lantern Steps, isolated authoring model.
// No E04 evidence, production episode completion, Chronicle, access or historical date.
import * as E07 from '../engine/s01e07-authoring-prototype.mjs';
import * as E08 from '../engine/s01e08-authoring-prototype.mjs';

export const VERSION='season1-connector-lantern-paper-v1';
export const MAX_ACTIONS=160;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

export function fresh(){
  return {version:VERSION,mode:'authoring_preview',stage:'connector',
    connector:E07.fresh(),steps:E08.fresh(),history:[],
    canonicalEvents:[],unlocks:[],historicalClaims:[]};
}
function clean(a){
  if(!a||typeof a!=='object'||Array.isArray(a))return null;
  if(a.scene==='nav'&&['to-steps','to-connector'].includes(a.type))
    return {scene:'nav',type:a.type};
  if(a.scene==='connector'){
    if(['walk','inspect'].includes(a.type))
      return {scene:'connector',type:a.type,anchor:a.anchor};
    if(a.type==='place-piece')
      return {scene:'connector',type:a.type,pieceId:a.pieceId,snapId:a.snapId};
    if(['test-milo','test-resident','test-water','run-all-traces','undo-piece',
      'compare-layouts','confirm-preview'].includes(a.type))
      return {scene:'connector',type:a.type};
  }
  if(a.scene==='steps'){
    if(a.type==='walk')return {scene:'steps',type:a.type,anchor:a.anchor};
    if(a.type==='inspect')return {scene:'steps',type:a.type,feature:a.feature};
    if(a.type==='toggle-lamp')return {scene:'steps',type:a.type,lampId:a.lampId};
    if(['observe-view','compare-views','confirm-preview'].includes(a.type))
      return {scene:'steps',type:a.type};
  }
  return null;
}
function apply(s,a){
  if(a.scene==='nav'){
    if(a.type==='to-steps'&&s.stage==='connector'&&s.connector.previewComplete)
      return {...s,stage:'steps'};
    if(a.type==='to-connector'&&s.stage==='steps')
      return {...s,stage:'connector'};
    return null;
  }
  if(a.scene==='connector'&&s.stage==='connector'){
    const {scene,...action}=a;
    const next=E07.dispatch(s.connector,action);
    return same(next,s.connector)?null:{...s,connector:next};
  }
  if(a.scene==='steps'&&s.stage==='steps'&&s.connector.previewComplete){
    const {scene,...action}=a;
    const next=E08.dispatch(s.steps,action);
    return same(next,s.steps)?null:{...s,steps:next};
  }
  return null;
}
export function replay(history){
  if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
  let s=fresh();
  for(const a of history){
    const c=clean(a);
    if(!c||!same(c,a))return null;
    const next=apply(s,c);
    if(!next)return null;
    s={...next,history:[...s.history,c]};
  }
  return s;
}
export function restore(snapshot){
  if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||
    snapshot.version!==VERSION||snapshot.mode!=='authoring_preview')return null;
  const rebuilt=replay(snapshot.history);
  return rebuilt&&same(rebuilt,snapshot)?rebuilt:null;
}
export function dispatch(snapshot,action){
  const s=restore(snapshot);
  if(!s)return fresh();
  if(s.history.length>=MAX_ACTIONS)return s;
  const c=clean(action);
  if(!c||!same(c,action))return s;
  const next=apply(s,c);
  return next?{...next,history:[...s.history,c]}:s;
}
export function project(snapshot){
  const s=restore(snapshot);
  if(!s)return null;
  const connector=E07.previewProjection(s.connector);
  const steps=E08.previewProjection(s.steps);
  return {stage:s.stage,connector,steps,
    connectorStillVisible:s.connector.previewComplete,
    lowerLampsLit:steps.enoughLight,
    upperHillClosed:true,servicePlate:steps.servicePlate,
    historicalDate:null,canonicalEvents:[],unlocks:[],historicalClaims:[],
    note:'Paper connector persists; lower lamps begin OFF. Synthetic viewpoints are not real safe access, electrical work, historical evidence or episode unlock.'};
}
