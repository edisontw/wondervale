// E11 child-operated shared-use follow-through, derived from two separately replayed
// E06 rain-tray and E07 connector PAPER models and four E11 visitor walks.
// No measured drainage, site permission, public access, canonical Chronicle or unlock.
import {paperRoleWalk} from './role-walk.mjs';
import {runoffChoice} from '../e07-scene/garden-connector-whatif.mjs';

const CHANNELS=['open','blocked'],PHASES=['first','now'],MAX=8;
const exact=(a,keys)=>a&&typeof a==='object'&&!Array.isArray(a)&&
 Object.keys(a).sort().join(',')===keys.slice().sort().join(',');
function evidence(e11,visitorHistory,upstream){
 const visitors=paperRoleWalk(e11,visitorHistory);
 if(!visitors?.complete||!upstream?.e06||!upstream?.e07)return null;
 const cases={};
 for(const phase of PHASES)for(const channel of CHANNELS){
  const result=runoffChoice(upstream.e06,upstream.e07,channel,phase);
  if(!result||!result.paperOnly||!result.modelsIndependent||
    result.realAccessApproved||result.officialUnlock||
    result.canonicalEvents.length||result.unlocks.length)return null;
  cases[phase+':'+channel]=result;
 }
 return {visitors,cases};
}
function snapshot(source,phase,channel){
 const trial=source.cases[phase+':'+channel];
 const visits=source.visitors.visits;
 return {phase,channel,catchment:trial.catchment,
  overlaps:trial.overlap.length,waterOverlaps:trial.waterOverlaps.length,
  otherUserOverlaps:trial.residentOverlaps.length,
  quietPass:visits[phase+':quiet_reader'].passed,
  groupPass:visits[phase+':activity_group'].passed,
  separateChecksClear:trial.bothPaperChecksClear};
}
export function paperSharedUse(e11,visitorHistory,upstream,history=[]){
 const source=evidence(e11,visitorHistory,upstream);
 if(!source||!Array.isArray(history)||history.length>MAX)return null;
 let phase='first',channel='blocked',first=null,now=null,compared=false;
 for(const action of history){
  if(exact(action,['type','phase','channel'])&&action.type==='choose'&&
   PHASES.includes(action.phase)&&CHANNELS.includes(action.channel)){
   phase=action.phase;channel=action.channel;compared=false;
  }else if(exact(action,['type'])&&action.type==='record'){
   if(phase==='first'){
    if(first||now)return null;
    first=snapshot(source,phase,channel);
   }else{
    if(!first||now)return null;
    now=snapshot(source,phase,channel);
   }
  }else if(exact(action,['type'])&&action.type==='revise-now'){
   // Keep the child-tested FIRST evidence; withdraw NOW and its derived comparison.
   if(!first||!now||!compared)return null;
   phase='now';now=null;compared=false;
  }else if(exact(action,['type'])&&action.type==='compare'){
   if(!first||!now||compared)return null;
   compared=true;
  }else return null;
 }
 const selected=source.cases[phase+':'+channel];
 const changed=!!(first&&now&&
  (first.channel!==now.channel||first.overlaps!==now.overlaps));
 const chronicle=compared?
  'PAPER WORLD NOTE: FIRST '+first.catchment+'/3 rain marks, '+
  first.overlaps+' connector overlap cells; NOW '+now.catchment+
  '/3 rain marks, '+now.overlaps+' overlaps. Milo walked quiet and group needs in both E11 layouts. '+
  'These are INDEPENDENT PAPER checks. Actual water flow, people, access and permission remain UNKNOWN.':
  'PAPER WORLD NOTE pending: test FIRST and NOW. No real change or official Chronicle.';
 return {phase,channel,selected,first,now,changed,compared,
  chronicle,history:JSON.parse(JSON.stringify(history)),
  visitors:source.visitors.visits,
  paperOnly:true,modelsIndependent:true,realDrainageVerified:false,
  realRouteOpen:false,realAccessApproved:false,commonRevealed:false,
  canonicalEvents:[],unlocks:[],persistentSave:false};
}
export function dispatchSharedUse(e11,visitorHistory,upstream,history,action){
 if(!Array.isArray(history)||history.length>=MAX)return history;
 return paperSharedUse(e11,visitorHistory,upstream,[...history,action])?
  [...history,action]:history;
}
