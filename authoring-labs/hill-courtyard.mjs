// E09 safe survey -> E10 unnamed courtyard, synthetic authoring bridge only.
// No source approval, real-world access, canonical progress or production import.
import * as E09 from '../engine/s01e09-authoring-prototype.mjs';
import * as E10 from '../engine/s01e10-authoring-prototype.mjs';
export const VERSION='season1-hill-courtyard-paper-v1',MAX_ACTIONS=180;
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function fresh(){return {version:VERSION,mode:'authoring_preview',stage:'hill',
  hill:E09.fresh(),courtyard:E10.fresh(),history:[],canonicalEvents:[],unlocks:[],historicalClaims:[]};}
function clean(a){
  if(!a||typeof a!=='object'||Array.isArray(a))return null;
  if(a.scene==='nav'&&['to-hill','to-courtyard'].includes(a.type))return {scene:'nav',type:a.type};
  if(a.scene==='hill'){
    if(a.type==='walk')return {scene:'hill',type:a.type,to:a.to};
    if(a.type==='inspect')return {scene:'hill',type:a.type,clueId:a.clueId};
    if(a.type==='consider')return {scene:'hill',type:a.type,hypothesisId:a.hypothesisId};
    if(['mark','unmark'].includes(a.type))return {scene:'hill',type:a.type,edgeId:a.edgeId};
    if(['check-route','compare-symbol','review','finish-preview'].includes(a.type))
      return {scene:'hill',type:a.type};
  }
  if(a.scene==='courtyard'){
    if(a.type==='walk')return {scene:'courtyard',type:a.type,to:a.to};
    if(a.type==='inspect')return {scene:'courtyard',type:a.type,traceId:a.traceId};
    if(a.type==='suggest'||a.type==='remove')return {scene:'courtyard',type:a.type,traceId:a.traceId,useTag:a.useTag};
    if(a.type==='revise')return {scene:'courtyard',type:a.type,traceId:a.traceId,oldTag:a.oldTag,newTag:a.newTag};
    if(a.type==='hear')return {scene:'courtyard',type:a.type,needId:a.needId};
    if(a.type==='place')return {scene:'courtyard',type:a.type,needId:a.needId,slot:a.slot};
    if(['compare-symbol','check-source','review-tradeoff','review'].includes(a.type))
      return {scene:'courtyard',type:a.type};
  }
  return null;
}
function apply(s,a){
  if(a.scene==='nav'){
    if(a.type==='to-courtyard'&&s.stage==='hill'&&s.hill.provisionalFinished)
      return {...s,stage:'courtyard'};
    if(a.type==='to-hill'&&s.stage==='courtyard')return {...s,stage:'hill'};
    return null;
  }
  if(a.scene==='hill'&&s.stage==='hill'){
    const {scene,...command}=a,after=E09.dispatch(s.hill,command);
    return eq(after,s.hill)?null:{...s,hill:after};
  }
  if(a.scene==='courtyard'&&s.stage==='courtyard'&&s.hill.provisionalFinished){
    const {scene,...command}=a,after=E10.dispatch(s.courtyard,command);
    return eq(after,s.courtyard)?null:{...s,courtyard:after};
  }
  return null;
}
export function replay(history){
  if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
  let s=fresh();
  for(const action of history){
    const a=clean(action);if(!a||!eq(a,action))return null;
    const next=apply(s,a);if(!next)return null;
    s={...next,history:[...s.history,a]};
  }
  return s;
}
export function restore(snapshot){
  if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||
    snapshot.version!==VERSION||snapshot.mode!=='authoring_preview')return null;
  const s=replay(snapshot.history);return s&&eq(s,snapshot)?s:null;
}
export function dispatch(snapshot,action){
  const s=restore(snapshot);if(!s)return fresh();
  if(s.history.length>=MAX_ACTIONS)return s;
  const a=clean(action);if(!a||!eq(a,action))return s;
  const next=apply(s,a);return next?{...next,history:[...s.history,a]}:s;
}
export function project(snapshot){
  const s=restore(snapshot);if(!s)return null;
  const hill=E09.previewProjection(s.hill),courtyard=E10.previewProjection(s.courtyard);
  return {stage:s.stage,hill,courtyard,
    paperOverlook:s.hill.provisionalFinished,
    seenHill:s.hill.observations.map(o=>o.text),
    safeSketch:s.hill.routeResult?.complete===true,
    courtyardTraces:s.courtyard.observations.length,
    currentNeeds:s.courtyard.heard.length,
    unknownName:true,sourceStatus:'UNKNOWN — SOURCE PENDING',
    actualAccessApproved:false,upperHillClosed:true,historicalDate:null,
    historicalCause:null,actualCourtyardName:null,seasonFinished:false,
    canonicalEvents:[],unlocks:[],historicalClaims:[],
    note:'Paper overlook carries a QUESTION into a fictional courtyard, never proof of a name, historical use, safe entry or E11 unlock.'};
}
