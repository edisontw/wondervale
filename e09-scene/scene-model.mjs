import * as E09 from '../authoring-labs/hill-story-model.mjs';

// Isolated E09 PAPER state: no canonical E08 prerequisite, rights, history or unlock.
export const VERSION='e09-isolated-paper-v1',MAX_ACTIONS=110;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),verified=new WeakMap();
const mark=s=>(verified.set(s,JSON.stringify(s)),s);
export function fresh(){return mark({version:VERSION,mode:'noncanonical_paper',screen:'hill',surveyLayer:'notes',
 story:E09.fresh(),history:[],canonicalEvents:[],unlocks:[],rights:[],historicalClaims:[]});}
function clean(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
 if(raw.scene==='nav'&&['hill','lantern','restart','blank','notes'].includes(raw.type)){
  const a={scene:'nav',type:raw.type};return same(a,raw)?a:null;
 }
 if(raw.scene!=='story'||!raw.action||typeof raw.action!=='object'||Array.isArray(raw.action))return null;
 const x=raw.action;
 const a=x.type==='walk'?{scene:'story',action:{type:'walk',to:x.to}}:
  x.type==='inspect'?{scene:'story',action:{type:'inspect',clueId:x.clueId}}:
  ['mark','unmark'].includes(x.type)?{scene:'story',action:{type:x.type,edgeId:x.edgeId}}:
  x.type==='consider'?{scene:'story',action:{type:'consider',hypothesisId:x.hypothesisId}}:
  ['start','check-route','compare-symbol','review','finish-preview'].includes(x.type)?
   {scene:'story',action:{type:x.type}}:null;
 return a&&same(a,raw)?a:null;
}
function apply(s,a){
 if(a.scene==='nav'){
  if(a.type==='restart')return fresh();
  if(['blank','notes'].includes(a.type)&&s.screen==='hill'&&E09.view(s.story).previewComplete&&s.surveyLayer!==a.type)return {...s,surveyLayer:a.type};
  if(a.type==='lantern'&&s.screen==='hill'&&E09.view(s.story).previewComplete)return {...s,screen:'lantern'};
  if(a.type==='hill'&&s.screen==='lantern')return {...s,screen:'hill'};
  return null;
 }
 if(s.screen!=='hill'||!E09.can(s.story,a.action))return null;
 return {...s,story:E09.dispatch(s.story,a.action)};
}
export function replay(history){
 if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
 let s=fresh();
 for(const raw of history){
  const a=clean(raw);if(!a||a.scene==='nav'&&a.type==='restart')return null;
  const next=apply(s,a);if(!next)return null;
  s={...next,history:[...s.history,a]};
 }
 return mark(s);
}
export function restore(s){
 if(!s||typeof s!=='object'||Array.isArray(s)||s.version!==VERSION||s.mode!=='noncanonical_paper')return null;
 if(verified.get(s)===JSON.stringify(s))return s;
 const r=replay(s.history);return r&&same(r,s)?mark(s):null;
}
export function can(snapshot,action){
 const s=restore(snapshot),a=clean(action);
 return !!(s&&a&&(a.scene==='nav'&&a.type==='restart'||s.history.length<MAX_ACTIONS&&apply(s,a)));
}
export function dispatch(snapshot,action){
 const s=restore(snapshot);if(!s)return fresh();
 const a=clean(action);if(!a)return s;
 if(a.scene==='nav'&&a.type==='restart')return fresh();
 if(s.history.length>=MAX_ACTIONS)return s;
 const n=apply(s,a);return n?mark({...n,history:[...s.history,a]}):s;
}
export function view(snapshot){
 const s=restore(snapshot);if(!s)return null;
 const story=E09.view(s.story);
 return {screen:s.screen,surveyLayer:s.surveyLayer,
  surveyBoard:{kind:'fictional_model_only',walkedEdges:story.surveyedEdges.length,
   markedEdges:story.markedEdges.length,inspectedClues:story.inspected.length,
   closedBoundary:true,realAccessApproved:false},
  upperHillClosed:true,e08Verified:false,
  e10Unlocked:false,realAccessApproved:false,productionEntryReady:false,
  canonicalEvents:[],unlocks:[],rights:[],historicalClaims:[]};
}
