// E10 fictional PAPER prop staging. Child moves cutouts; no historical-use inference or unlock.
import {view as viewE10} from '../authoring-labs/unnamed-story-model.mjs';

export const VERSION='s01e10-use-stage-paper-v1',MAX_ACTIONS=32;
export const PROPS=Object.freeze(['seat','notice']);
export const ANCHORS=Object.freeze(['stone_edge','notice_wall']);
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const own=(o,k)=>Object.hasOwn(o,k);

export function source(state){
 const v=viewE10(state);
 if(!v||!v.inspected.includes('surface')||!v.inspected.includes('holes')||
  !state.e10.hypotheses.surface.length||!state.e10.hypotheses.holes.length)return null;
 // A change to a child-observed trace or a MAYBE idea invalidates the old paper comparison.
 return JSON.stringify({inspected:v.inspected,hypotheses:state.e10.hypotheses});
}
export function freshTrial(){return {version:VERSION,sourceKey:null,history:[]};}
function clean(a){
 if(!a||typeof a!=='object'||Array.isArray(a))return null;
 if(a.type==='place')return {type:'place',prop:a.prop,anchor:a.anchor};
 if(a.type==='remove')return {type:'remove',prop:a.prop};
 if(a.type==='compare')return {type:'compare'};
 return null;
}
function replay(history){
 if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
 let now={seat:null,notice:null},first=null,firstConflict=null,compared=false;
 let feedback='Move two paper cutouts. What could fit here?';
 for(const raw of history){
  const a=clean(raw);if(!a||!eq(a,raw))return null;
  if(a.type==='place'){
   if(!PROPS.includes(a.prop)||!ANCHORS.includes(a.anchor)||now[a.prop]===a.anchor)return null;
   now={...now,[a.prop]:a.anchor};compared=false;
   feedback='Milo moved a PAPER cutout. We can still change it.';
  }else if(a.type==='remove'){
   if(!PROPS.includes(a.prop)||!now[a.prop])return null;
   now={...now,[a.prop]:null};compared=false;
   feedback='Cutout removed. The observed traces stay the same.';
  }else{
   if(!now.seat||!now.notice||compared)return null;
   if(!first)first={...now};
   compared=true;
   if(now.seat===now.notice&&!firstConflict)firstConflict={...now};
   feedback=now.seat===now.notice?
    'Both cutouts overlap on this PAPER station. Try moving one.':
    'The cutouts now use different PAPER stations. That does not prove past use.';
  }
 }
 const conflict=compared&&now.seat===now.notice;
 const revised=compared&&!!firstConflict&&!conflict;
 return {now,first,firstConflict,compared,conflict,revised,feedback,
  paperNote:revised?
   'PAPER CHRONICLE — FIRST: overlapping cutouts. NOW: a revised possible fit. SEEN traces unchanged; old use, dates and name UNKNOWN.':
   'PAPER MAYBE — no approved evidence for a seat, notice, date, name or actual site access.',
  canonicalEvents:[],unlocks:[],rights:[],historicalClaims:[]};
}
export function viewTrial(trial,state){
 const key=source(state);
 if(!key||!trial||typeof trial!=='object'||Array.isArray(trial)||
  !eq(Object.keys(trial).sort(),['history','sourceKey','version'])||
  trial.version!==VERSION||!Array.isArray(trial.history)||
  (trial.sourceKey!==null&&trial.sourceKey!==key)||
  (trial.sourceKey===null&&trial.history.length))return null;
 const v=replay(trial.history);
 return v?{...v,sourceKey:key}:null;
}
export function dispatchTrial(trial,action,state){
 const key=source(state);
 if(!key)return freshTrial();
 if(action?.type==='reset'&&eq(action,{type:'reset'}))return freshTrial();
 const v=viewTrial(trial,state);
 if(!v)return freshTrial();
 const a=clean(action);
 if(!a||!eq(a,action)||trial.history.length>=MAX_ACTIONS)return trial;
 const history=[...trial.history,a],next=replay(history);
 return next?{version:VERSION,sourceKey:key,history}:trial;
}

/** Decode an untrusted URL history by executing each action, never importing claimed state. */
export function replayTransferredTrial(history,state){
 if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
 let trial=freshTrial();
 for(const raw of history){
  const next=dispatchTrial(trial,raw,state);
  if(next.history.length!==trial.history.length+1)return null;
  trial=next;
 }
 return viewTrial(trial,state)?.revised?trial:null;
}
