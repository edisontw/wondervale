import * as E07 from '../authoring-labs/shortcut-story-model.mjs';
export const VERSION='e07-isolated-paper-v1',MAX_ACTIONS=90;
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b),verified=new WeakMap();
const mark=s=>(verified.set(s,JSON.stringify(s)),s);
export function fresh(){return mark({version:VERSION,mode:'noncanonical_paper',screen:'connector',story:E07.fresh(),history:[],canonicalEvents:[],unlocks:[],rights:[],historicalClaims:[]});}
function clean(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
 if(raw.scene==='nav'&&['garden','connector','restart'].includes(raw.type)){const a={scene:'nav',type:raw.type};return eq(a,raw)?a:null;}
 if(raw.scene!=='story'||!raw.action||typeof raw.action!=='object')return null;
 const x=raw.action,has=['walk','inspect','trial','place'].includes(x.type),plain=['start','undo','compare','finish'].includes(x.type);
 const a=has?{scene:'story',action:{type:x.type,value:x.value}}:plain?{scene:'story',action:{type:x.type}}:null;
 return a&&eq(a,raw)?a:null;
}
function apply(s,a){
 if(a.scene==='nav'){
  if(a.type==='restart')return {...fresh(),history:s.history};
  if(a.type==='garden'&&s.screen==='connector'&&E07.view(s.story).stage==='finished')return {...s,screen:'garden'};
  if(a.type==='connector'&&s.screen==='garden')return {...s,screen:'connector'};
  return null;
 }
 if(s.screen!=='connector'||!E07.can(s.story,a.action))return null;
 return {...s,story:E07.dispatch(s.story,a.action)};
}
export function replay(history){
 if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
 let s=fresh();for(const raw of history){const a=clean(raw);if(!a)return null;const n=apply(s,a);if(!n)return null;s={...n,history:[...s.history,a]};}return mark(s);
}
export function restore(s){
 if(!s||typeof s!=='object'||Array.isArray(s)||s.version!==VERSION||s.mode!=='noncanonical_paper')return null;
 if(verified.get(s)===JSON.stringify(s))return s;
 const r=replay(s.history);return r&&eq(r,s)?mark(s):null;
}
export function can(snapshot,action){const s=restore(snapshot),a=clean(action);return !!(s&&a&&s.history.length<MAX_ACTIONS&&apply(s,a));}
export function dispatch(snapshot,action){const s=restore(snapshot);if(!s)return fresh();const a=clean(action);if(!a||s.history.length>=MAX_ACTIONS)return s;const n=apply(s,a);return n?mark({...n,history:[...s.history,a]}):s;}
export function view(snapshot){const s=restore(snapshot);if(!s)return null;const story=E07.view(s.story);return {screen:s.screen,story,connectorPaperRevised:story.previewComplete,currentGardenHealthy:true,lowerGardenUnbuilt:true,e06Verified:false,e08Unlocked:false,northHillClosed:true,lightsOff:true,realAccessApproved:false,productionEntryReady:false,canonicalEvents:[],unlocks:[],rights:[],historicalClaims:[]};}
