// E08 -> E10 child-operated PAPER tracing. E08/E09 are replay-verified;
 // these model coordinates and clues never establish real lighting, access or history.
import * as E08 from '../e08-scene/scene-model.mjs';
import * as E09 from '../e09-scene/scene-model.mjs';
import {MARKERS,VIEWPOINTS,geometryAt} from '../engine/s01e08-authoring-prototype.mjs';

export const VERSION='e08-e10-paper-tracing-v1',MAX_ACTIONS=32;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const IDS=MARKERS.map(x=>x.id);
export function clueSource(e08,e09){
 const a=E08.restore(e08),b=E09.restore(e09);
 if(!a||!b)return null;
 const av=E08.view(a),bv=E09.view(b),s=av?.story,h=bv?.story;
 if(!s?.previewComplete||!s.compared||!s.comparison?.markersUnchanged||
    !s.firstView||!s.secondView||s.firstView.viewpoint===s.secondView.viewpoint||
    !s.lights['lower-a']||!s.lights['lower-b']||
    !h?.previewComplete||!h.reviewed||!h.symbolCompared||
    !h.inspected.includes('distant_symbol')||!bv.upperHillClosed||
    av.e09Unlocked!==false||bv.e10Unlocked!==false)return null;
 const first=geometryAt(s.firstView.viewpoint),second=geometryAt(s.secondView.viewpoint);
 if(!first||!second||!Object.hasOwn(VIEWPOINTS,first.viewpoint)||
    !Object.hasOwn(VIEWPOINTS,second.viewpoint)||
    first.spreadDegrees!==s.firstView.spreadDegrees||
    second.spreadDegrees!==s.secondView.spreadDegrees)return null;
 return {kind:'noncanonical_paper_clue_transfer',
  first,second,markers:MARKERS.map(x=>({...x})),
  upperHillClosed:true,realLightsOn:false,realAccessApproved:false,
  historicalDate:null,placeName:null,canonicalEvents:[],unlocks:[],rights:[]};
}
export function freshTrial(){
 return {version:VERSION,viewMode:'first',pins:{first:[],second:[]},
  compared:false,feedback:'Trace A, B and C from both PAPER viewpoints.',history:[]};
}
function clean(x){
 if(!x||typeof x!=='object'||Array.isArray(x))return null;
 if(x.type==='switch'&&['first','second'].includes(x.to))return {type:'switch',to:x.to};
 if(['pin','unpin'].includes(x.type)&&IDS.includes(x.markerId))
  return {type:x.type,markerId:x.markerId};
 if(x.type==='compare'||x.type==='reset')return {type:x.type};
 return null;
}
function apply(s,a){
 if(a.type==='switch'){
  if(a.to===s.viewMode)return null;
  return {...s,viewMode:a.to};
 }
 if(a.type==='pin'||a.type==='unpin'){
  const here=s.pins[s.viewMode],exists=here.includes(a.markerId);
  if((a.type==='pin'&&exists)||(a.type==='unpin'&&!exists))return null;
  const updated=a.type==='pin'?[...here,a.markerId]:here.filter(x=>x!==a.markerId);
  return {...s,pins:{...s.pins,[s.viewMode]:updated},compared:false,
   feedback:'Model mark '+a.markerId.slice(-1).toUpperCase()+
    (a.type==='pin'?' traced.':' removed. You can try again.')};
 }
 if(a.type==='compare'){
  const total=s.pins.first.length+s.pins.second.length,done=total===IDS.length*2;
  return {...s,compared:done,
   feedback:done?
    'Same three fixed marks. Milo changed viewpoint, not the marks. E09 hill stays CLOSED.':
    'Not yet: trace the missing marks from BOTH views, then compare. No penalty.'};
 }
 return null;
}
export function replayTrial(history){
 if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
 let s=freshTrial();
 for(const raw of history){
  const a=clean(raw);if(!a||!same(a,raw)||a.type==='reset')return null;
  const next=apply(s,a);if(!next)return null;
  s={...next,history:[...s.history,a]};
 }
 return s;
}
export function restoreTrial(s){
 if(!s||typeof s!=='object'||Array.isArray(s)||s.version!==VERSION)return null;
 const derived=replayTrial(s.history);
 return derived&&same(derived,s)?derived:null;
}
export function canTrial(s,raw){
 const state=restoreTrial(s),a=clean(raw);
 return !!(state&&a&&same(a,raw)&&
  (a.type==='reset'||state.history.length<MAX_ACTIONS&&apply(state,a)));
}
export function dispatchTrial(s,raw){
 const state=restoreTrial(s);if(!state)return freshTrial();
 const a=clean(raw);if(!a||!same(a,raw))return state;
 if(a.type==='reset')return freshTrial();
 if(state.history.length>=MAX_ACTIONS)return state;
 const next=apply(state,a);
 return next?{...next,history:[...state.history,a]}:state;
}
export function viewTrial(s){
 const state=restoreTrial(s);if(!state)return null;
 return {viewMode:state.viewMode,pins:[...state.pins[state.viewMode]],
  firstCount:state.pins.first.length,secondCount:state.pins.second.length,
  compared:state.compared,feedback:state.feedback,
  parentCue:'What stayed the same when Milo moved? What changed in his view?',
  paperNote:state.compared?
   'PAPER Chronicle: A/B/C stayed fixed across two viewpoints; their apparent spacing changed. No real date, lights or route was verified.':
   'The tracing is a removable PAPER experiment, not a historical claim.'};
}
