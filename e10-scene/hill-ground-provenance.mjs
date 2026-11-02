// E09 inspected ground observations -> E10 child-sorted PAPER provenance.
// Separate places are not a proven shared cause, date, route, or historical source.
import * as E09 from '../e09-scene/scene-model.mjs';
import * as E10 from '../authoring-labs/unnamed-story-model.mjs';

export const VERSION='e09-e10-ground-provenance-paper-v1',MAX_ACTIONS=36;
export const CARDS=Object.freeze({
 'hill-ground':{seen:'Loose ground at the safe fence',origin:'hill'},
 'hill-water':{seen:'Water marks at the lower bend',origin:'hill'},
 'yard-surface':{seen:'Worn surface in the fictional courtyard',origin:'courtyard',trace:'surface'},
 'yard-holes':{seen:'Mounting holes in the fictional courtyard',origin:'courtyard',trace:'holes'}
});
export const SLOTS=Object.freeze(['hill','courtyard','unknown']);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const blank=()=>Object.fromEntries(Object.keys(CARDS).map(id=>[id,null]));
export function groundSource(e09){
 const s=E09.restore(e09),v=s&&E09.view(s),g=v?.groundBoard;
 if(!v?.story?.previewComplete||!g?.compared||!v.upperHillClosed||
  g.placements.disturbed_ground!=='fence_view'||
  g.placements.runoff_marks!=='lower_bend'||
  !['disturbed_ground','runoff_marks'].every(id=>v.story.inspected.includes(id))||
  v.e10Unlocked!==false||v.realAccessApproved)return null;
 return {kind:'replayed_e09_paper_ground',key:JSON.stringify(s.history),
  observed:Object.keys(CARDS).slice(0,2),realCauseKnown:false,
  hillClosed:true,actualCourtyardAccess:false,canonicalEvents:[],unlocks:[]};
}
export function freshTrial(){return {version:VERSION,sourceKey:null,placements:blank(),
 compared:false,feedback:'Milo has two hill observations. Walk and inspect courtyard traces before sorting four cards.',history:[]};}
function clean(a){
 if(!a||typeof a!=='object'||Array.isArray(a))return null;
 if(a.type==='place'&&Object.hasOwn(CARDS,a.card)&&SLOTS.includes(a.slot)&&
  Number.isInteger(a.atE10)&&a.atE10>=0&&a.atE10<=E10.MAX_STEPS)
  return {type:'place',card:a.card,slot:a.slot,atE10:a.atE10};
 if(a.type==='remove'&&Object.hasOwn(CARDS,a.card))return {type:'remove',card:a.card};
 if(a.type==='compare'&&Number.isInteger(a.atE10)&&a.atE10>=0&&a.atE10<=E10.MAX_STEPS)
  return {type:'compare',atE10:a.atE10};
 return null;
}
function seenAt(e10,n){
 if(n>e10.history.length)return null;
 const prior=E10.replay(e10.history.slice(0,n));
 return prior?E10.view(prior)?.inspected:null;
}
function apply(s,a,source,e10){
 if(s.sourceKey!==null&&s.sourceKey!==source.key)return null;
 if(a.type==='place'){
  const seen=seenAt(e10,a.atE10),card=CARDS[a.card];
  if(!seen||card.trace&&!seen.includes(card.trace)||s.placements[a.card]===a.slot)return null;
  return {...s,sourceKey:source.key,placements:{...s.placements,[a.card]:a.slot},
   compared:false,feedback:'Card moved. SEEN is not the same as a cause. Compare or revise.'};
 }
 if(a.type==='remove'){
  if(!s.placements[a.card])return null;
  return {...s,placements:{...s.placements,[a.card]:null},compared:false,
   feedback:'Card removed. Try another place.'};
 }
 if(a.type==='compare'){
  const seen=seenAt(e10,a.atE10);
  if(!seen)return null;
  const all=Object.entries(CARDS).every(([id,c])=>s.placements[id]===c.origin);
  const inspected=['surface','holes'].every(id=>seen.includes(id));
  const success=all&&inspected;
  return {...s,compared:success,feedback:success?
   'PAPER NOW: two observations THERE and two HERE. Their cause, age and connection are STILL UNKNOWN. NOT DONE.':
   'Not yet. Which place did Milo actually inspect? Move a card and try again.'};
 }
 return null;
}
export function replayTrial(history,source,e10){
 if(!source||source.kind!=='replayed_e09_paper_ground'||!E10.restore(e10)||
  !Array.isArray(history)||history.length>MAX_ACTIONS)return null;
 let s=freshTrial();
 for(const raw of history){
  const a=clean(raw);if(!a||!same(a,raw))return null;
  const n=apply(s,a,source,e10);if(!n)return null;
  s={...n,history:[...s.history,a]};
 }
 return s;
}
export function restoreTrial(snapshot,source,e10){
 if(!snapshot||snapshot.version!==VERSION)return null;
 const s=replayTrial(snapshot.history,source,e10);
 return s&&same(s,snapshot)?s:null;
}
export function dispatchTrial(snapshot,action,source,e10){
 if(same(action,{type:'reset'}))return freshTrial();
 const s=restoreTrial(snapshot,source,e10);
 if(!s)return freshTrial();
 const a=clean(action);
 if(!a||!same(a,action)||s.history.length>=MAX_ACTIONS)return s;
 const n=apply(s,a,source,e10);
 return n?{...n,history:[...s.history,a]}:s;
}
export function viewTrial(snapshot,source,e10){
 const s=restoreTrial(snapshot,source,e10);
 if(!s)return null;
 return {first:blank(),now:{...s.placements},compared:s.compared,
  feedback:s.feedback,placed:Object.values(s.placements).filter(Boolean).length,
  seen:E10.view(e10)?.inspected||[],hillClosed:true,causeKnown:false,
  historicalDate:null,actualName:null,realAccessApproved:false,
  canonicalEvents:[],unlocks:[],rights:[],historicalClaims:[]};
}
