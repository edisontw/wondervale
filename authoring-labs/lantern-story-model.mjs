// E08 child-driven PAPER rehearsal; only the existing strict synthetic lower-Steps reducer.
import * as E08 from '../engine/s01e08-authoring-prototype.mjs';
export const VERSION='s01e08-lantern-story-paper-v1';
export const MAX_STEPS=90;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function fresh(){return {version:VERSION,mode:'authoring_preview',started:false,steps:E08.fresh(),history:[],canonicalEvents:[],unlocks:[],historicalClaims:[]};}
function clean(a){
 if(!a||typeof a!=='object'||Array.isArray(a))return null;
 if(a.type==='start')return {type:'start'};
 if(a.type==='walk')return {type:'walk',anchor:a.anchor};
 if(a.type==='inspect')return {type:'inspect',feature:a.feature};
 if(a.type==='toggle-lamp')return {type:'toggle-lamp',lampId:a.lampId};
 if(['observe-view','compare-views','confirm-preview'].includes(a.type))return {type:a.type};
 return null;
}
function apply(s,a){
 if(a.type==='start')return s.started?null:{...s,started:true};
 if(!s.started||s.steps.previewComplete)return null;
 const n=E08.dispatch(s.steps,a);
 return same(n,s.steps)?null:{...s,steps:n};
}
export function replay(history){
 if(!Array.isArray(history)||history.length>MAX_STEPS)return null;
 let s=fresh();
 for(const raw of history){
  const a=clean(raw);if(!a||!same(a,raw))return null;
  const n=apply(s,a);if(!n)return null;
  s={...n,history:[...s.history,a]};
 }
 return s;
}
export function restore(snapshot){
 if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||snapshot.version!==VERSION||snapshot.mode!=='authoring_preview')return null;
 const s=replay(snapshot.history);return s&&same(s,snapshot)?s:null;
}
export function can(snapshot,action){
 const s=restore(snapshot),a=clean(action);
 return !!(s&&s.history.length<MAX_STEPS&&a&&same(a,action)&&apply(s,a));
}
export function dispatch(snapshot,action){
 const s=restore(snapshot);if(!s)return fresh();
 if(action?.type==='reset'&&same(action,{type:'reset'}))return fresh();
 if(!can(s,action))return s;
 const a=clean(action),n=apply(s,a);
 return {...n,history:[...s.history,a]};
}
export function view(snapshot){
 const s=restore(snapshot);if(!s)return null;
 const p=E08.previewProjection(s.steps),last=s.history.at(-1);
 let speaker='Finn',line='The lower steps are dark. Can we try a small PAPER light test?';
 if(last?.type==='start'){speaker='Nia';line='First, look at the marks and the CLOSED upper path.';}
 if(last?.type==='walk'){speaker='Milo';line='I walk to the '+last.anchor.replaceAll('-',' ')+'.';}
 if(last?.type==='inspect'){
  speaker='Nia';
  line=last.feature==='boundary'?'The upper hill is CLOSED. We stay below.':
   last.feature==='brackets'?'I see three fixed marks. What do they look like from here?':
   last.feature==='service-plate'?'A plate! Its date and source are UNKNOWN.':
   'This lower lamp is in our PAPER model.';
 }
 if(last?.type==='toggle-lamp'){speaker='Finn';line=p.enoughLight?'Now we can see all three marks. Look from here.':'One lamp is not enough to compare. We can try again.';}
 if(last?.type==='observe-view'){
  speaker='Milo';
  const o=s.steps.observations.at(-1);
  line=o.spreadDegrees<5?'From here, the marks line up. Is that proof?':'From here, I see a gap. Let me check another place.';
 }
 if(last?.type==='compare-views'){speaker='Nia';line='The marks stayed still. Our view changed. What can we really say?';}
 if(last?.type==='confirm-preview'){speaker='Finn';line='The lower lights are on in our model. The hill is still CLOSED.';}
 const stage=!s.started?'opening':s.steps.previewComplete?'finished':
  s.steps.compared?'source-check':s.steps.observations.length?'viewpoints':
  p.enoughLight?'observe':'inspect-and-light';
 const first=s.steps.observations[0],second=s.steps.observations.find(o=>first&&o.viewpoint!==first.viewpoint);
 return {stage,speaker,line,milo:s.steps.miloPosition,inspected:[...s.steps.inspected],
  lights:{...s.steps.lights},observations:[...s.steps.observations],
  compared:s.steps.compared,comparison:s.steps.comparison,previewComplete:s.steps.previewComplete,
  parentCue:first&&!s.steps.compared?'What could Milo do to check from another safe place?':null,
  firstView:first||null,secondView:second||null,servicePlate:p.servicePlate,
  paperNote:s.steps.previewComplete?
   'PAPER NOTE: Same marks, two viewpoints; apparent spacing changed. Lower model lamps ON. Service plate date/source UNKNOWN. E09 is NOT UNLOCKED; upper North Hill CLOSED.':
   'PAPER MODEL ONLY. Real access, electrical safety, lamp positions and history UNKNOWN. North Hill CLOSED.',
  canonicalEvents:[],unlocks:[],historicalClaims:[],upperHillClosed:true,realLightingApproved:false,
  historicalDate:null,e09Unlocked:false};
}
