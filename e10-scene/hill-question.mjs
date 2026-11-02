// Child-controlled E09 unanswered-question callback in E10's independent PAPER courtyard.
// Strict upstream action replay; no historical identification, access, rights or official unlock.
import * as E09 from '../e09-scene/scene-model.mjs';
import * as E10 from '../authoring-labs/unnamed-story-model.mjs';
import {fourFrameEvidence} from '../e09-scene/field-question.mjs';

export const VERSION='e09-e10-paper-question-v1',MAX_ACTIONS=24;
const RULES=Object.freeze({
 access:{hill:'fence_view',anchor:'stone_edge',trace:'surface',
  note:'The courtyard surface cannot grant access to the CLOSED hill. Ask the responsible person later.'},
 identity:{hill:'overlook',anchor:'notice_wall',trace:'holes',
  note:'Two shapes cannot name a place or date a memory. Find an attributed source later.'}
});
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function questionSource(e07,e08,e09){
 if(!fourFrameEvidence(e07,e08))return null;
 const s=E09.restore(e09),v=s&&E09.view(s),h=v?.story;
 if(!h?.previewComplete||!h.reviewed||!h.routeResult?.complete||
  !h.symbolCompared||!v.upperHillClosed||v.e10Unlocked!==false||
  !['boundary_sign','disturbed_ground','distant_symbol'].every(id=>h.inspected.includes(id)))
  return null;
 return {kind:'paper_unanswered_hill_questions',
  questions:structuredClone(RULES),upperHillClosed:true,realAccessApproved:false,
  realCheckDone:false,placeName:null,historicalDate:null,
  canonicalEvents:[],unlocks:[],rights:[]};
}
export function freshTrial(){
 return {version:VERSION,question:null,anchor:null,compared:false,
  feedback:'Choose an unanswered hill question, then move its ? to a courtyard PAPER trace.',history:[]};
}
function clean(a){
 if(!a||typeof a!=='object'||Array.isArray(a))return null;
 if(a.type==='choose'&&Object.hasOwn(RULES,a.question))return {type:'choose',question:a.question};
 if(a.type==='place'&&['stone_edge','notice_wall'].includes(a.anchor))return {type:'place',anchor:a.anchor};
 if(['remove','compare'].includes(a.type))return {type:a.type};
 return null;
}
function apply(s,a,source,e10){
 if(a.type==='choose'){
  if(s.question===a.question)return null;
  return {...s,question:a.question,anchor:null,compared:false,
   feedback:'Milo asks a question. Move ? onto a PAPER trace to test what it can tell us.'};
 }
 if(a.type==='place'){
  if(!s.question||s.anchor===a.anchor)return null;
  return {...s,anchor:a.anchor,compared:false,
   feedback:'PAPER ? moved. Inspect this courtyard trace with Milo, then compare.'};
 }
 if(a.type==='remove'){
  return s.anchor?{...s,anchor:null,compared:false,
   feedback:'PAPER ? removed. The hill question is still open.'}:null;
 }
 if(a.type==='compare'){
  if(!s.question||!s.anchor)return null;
  const rule=source.questions[s.question],seen=E10.view(e10)?.inspected||[];
  const valid=s.anchor===rule.anchor&&seen.includes(rule.trace);
  return {...s,compared:valid,feedback:valid?
   'PAPER QUESTION — STILL UNKNOWN. '+rule.note+' NOT DONE.':
   'Not yet. Move ? to the matching PAPER trace and inspect it with Milo. Try again.'};
 }
 return null;
}
export function replayTrial(history,source,e10){
 if(!source||source.kind!=='paper_unanswered_hill_questions'||
  !E10.restore(e10)||!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
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
 const s=restoreTrial(snapshot,source,e10);if(!s)return freshTrial();
 if(same(action,{type:'reset'}))return freshTrial();
 const a=clean(action);if(!a||!same(a,action)||s.history.length>=MAX_ACTIONS)return s;
 const n=apply(s,a,source,e10);
 return n?{...n,history:[...s.history,a]}:s;
}
export function viewTrial(snapshot,source,e10){
 const s=restoreTrial(snapshot,source,e10);
 if(!s)return null;
 return {question:s.question,anchor:s.anchor,compared:s.compared,
  feedback:s.feedback,first:null,now:s.anchor,
  paperOnly:true,upperHillClosed:true,realCheckDone:false,
  canonicalEvents:[],unlocks:[],rights:[]};
}
