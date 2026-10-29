// E08 lower viewpoint -> E09 safe hill survey; independent authoring paper model only.
// Neither a genuine source nor access/safety evidence; never import into production.
import * as E08 from '../engine/s01e08-authoring-prototype.mjs';
import * as E09 from '../engine/s01e09-authoring-prototype.mjs';
export const VERSION='season1-lantern-hill-paper-v1';
export const MAX_ACTIONS=180;
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function fresh(){
  return {version:VERSION,mode:'authoring_preview',stage:'steps',
    steps:E08.fresh(),hill:E09.fresh(),history:[],
    canonicalEvents:[],unlocks:[],historicalClaims:[]};
}
function clean(a){
  if(!a||typeof a!=='object'||Array.isArray(a))return null;
  if(a.scene==='nav'&&['to-hill','to-steps'].includes(a.type))
    return {scene:'nav',type:a.type};
  if(a.scene==='steps'){
    if(a.type==='walk')return {scene:'steps',type:a.type,anchor:a.anchor};
    if(a.type==='inspect')return {scene:'steps',type:a.type,feature:a.feature};
    if(a.type==='toggle-lamp')return {scene:'steps',type:a.type,lampId:a.lampId};
    if(['observe-view','compare-views','confirm-preview'].includes(a.type))
      return {scene:'steps',type:a.type};
  }
  if(a.scene==='hill'){
    if(a.type==='walk')return {scene:'hill',type:a.type,to:a.to};
    if(a.type==='inspect')return {scene:'hill',type:a.type,clueId:a.clueId};
    if(['mark','unmark'].includes(a.type))return {scene:'hill',type:a.type,edgeId:a.edgeId};
    if(a.type==='consider')return {scene:'hill',type:a.type,hypothesisId:a.hypothesisId};
    if(['check-route','compare-symbol','review','finish-preview'].includes(a.type))
      return {scene:'hill',type:a.type};
  }
  return null;
}
function apply(s,a){
  if(a.scene==='nav'){
    if(a.type==='to-hill'&&s.stage==='steps'&&s.steps.previewComplete)
      return {...s,stage:'hill'};
    if(a.type==='to-steps'&&s.stage==='hill')
      return {...s,stage:'steps'};
    return null;
  }
  if(a.scene==='steps'&&s.stage==='steps'){
    const {scene,...action}=a;
    const next=E08.dispatch(s.steps,action);
    return equal(next,s.steps)?null:{...s,steps:next};
  }
  if(a.scene==='hill'&&s.stage==='hill'&&s.steps.previewComplete){
    const {scene,...action}=a;
    const next=E09.dispatch(s.hill,action);
    return equal(next,s.hill)?null:{...s,hill:next};
  }
  return null;
}
export function replay(history){
  if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
  let s=fresh();
  for(const action of history){
    const a=clean(action);
    if(!a||!equal(a,action))return null;
    const next=apply(s,a);
    if(!next)return null;
    s={...next,history:[...s.history,a]};
  }
  return s;
}
export function restore(snapshot){
  if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||
    snapshot.version!==VERSION||snapshot.mode!=='authoring_preview')return null;
  const rebuilt=replay(snapshot.history);
  return rebuilt&&equal(rebuilt,snapshot)?rebuilt:null;
}
export function dispatch(snapshot,action){
  const s=restore(snapshot);
  if(!s)return fresh();
  if(s.history.length>=MAX_ACTIONS)return s;
  const a=clean(action);
  if(!a||!equal(a,action))return s;
  const next=apply(s,a);
  return next?{...next,history:[...s.history,a]}:s;
}
export function project(snapshot){
  const s=restore(snapshot);
  if(!s)return null;
  const steps=E08.previewProjection(s.steps),hill=E09.previewProjection(s.hill);
  return {stage:s.stage,steps,hill,
    lowerLampsLit:steps.enoughLight,
    twoViewsCompared:s.steps.compared,
    servicePlate:steps.servicePlate,
    hillSurveyComplete:s.hill.provisionalFinished,
    upperHillClosed:true,actualAccessApproved:false,
    historicalDate:null,actualClosureCause:null,distantPlaceIdentity:null,
    canonicalEvents:[],unlocks:[],historicalClaims:[],
    note:'Two synthetic lower viewpoints carry a question, not an approved date or route. The old North Hill is closed; E10 is not unlocked.'};
}
