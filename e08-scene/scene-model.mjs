import * as E08 from '../authoring-labs/lantern-story-model.mjs';

// Isolated, in-memory E08 PAPER scene. Never grants canonical events or real access.
export const VERSION='e08-isolated-paper-v1',MAX_ACTIONS=90;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),verified=new WeakMap();
const mark=s=>(verified.set(s,JSON.stringify(s)),s);
export function fresh(){return mark({version:VERSION,mode:'noncanonical_paper',screen:'steps',reviewMode:'both',story:E08.fresh(),history:[],canonicalEvents:[],unlocks:[],rights:[],historicalClaims:[]});}
function clean(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
 if(raw.scene==='nav'&&['connector','steps','restart','trace-first','trace-second','trace-both'].includes(raw.type)){
  const a={scene:'nav',type:raw.type};return same(a,raw)?a:null;
 }
 if(raw.scene!=='story'||!raw.action||typeof raw.action!=='object'||Array.isArray(raw.action))return null;
 const x=raw.action;
 const a=x.type==='walk'?{scene:'story',action:{type:'walk',anchor:x.anchor}}:
  x.type==='inspect'?{scene:'story',action:{type:'inspect',feature:x.feature}}:
  x.type==='toggle-lamp'?{scene:'story',action:{type:'toggle-lamp',lampId:x.lampId}}:
  ['start','observe-view','compare-views','confirm-preview'].includes(x.type)?{scene:'story',action:{type:x.type}}:null;
 return a&&same(a,raw)?a:null;
}
function apply(s,a){
 if(a.scene==='nav'){
  if(a.type==='restart')return fresh();
  if(a.type==='connector'&&s.screen==='steps'&&E08.view(s.story).previewComplete)return {...s,screen:'connector'};
  if(a.type==='steps'&&s.screen==='connector')return {...s,screen:'steps'};
  if(a.type.startsWith('trace-')&&s.screen==='steps'&&E08.view(s.story).previewComplete)
   return {...s,reviewMode:a.type.slice('trace-'.length)};
  return null;
 }
 if(s.screen!=='steps'||!E08.can(s.story,a.action))return null;
 return {...s,story:E08.dispatch(s.story,a.action)};
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
 const story=E08.view(s.story);
 return {screen:s.screen,story,reviewMode:story.previewComplete?s.reviewMode:null,
  lowerLightsPaperOn:story.previewComplete,
  e07Verified:false,e09Unlocked:false,upperHillClosed:true,realLightingApproved:false,
  serviceDateApproved:false,productionEntryReady:false,
  canonicalEvents:[],unlocks:[],rights:[],historicalClaims:[]};
}
