import * as E07 from '../authoring-labs/shortcut-story-model.mjs';
export const VERSION='e07-isolated-paper-v1',MAX_ACTIONS=90;
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b),verified=new WeakMap();
const mark=s=>(verified.set(s,JSON.stringify(s)),s);
export function fresh(){return mark({version:VERSION,mode:'noncanonical_paper',screen:'connector',story:E07.fresh(),walkthrough:{phase:'idle',position:'bench',checked:[],stopped:false},history:[],canonicalEvents:[],unlocks:[],rights:[],historicalClaims:[]});}
function clean(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
 if(raw.scene==='nav'&&['garden','connector','restart'].includes(raw.type)){const a={scene:'nav',type:raw.type};return eq(a,raw)?a:null;}
 if(raw.scene==='walkthrough'){
  const withValue=['move','inspect'].includes(raw.type);
  const plain=['start','try-closed','review'].includes(raw.type);
  const a=withValue?{scene:'walkthrough',type:raw.type,value:raw.value}:
   plain?{scene:'walkthrough',type:raw.type}:null;
  return a&&eq(a,raw)?a:null;
 }
 if(raw.scene!=='story'||!raw.action||typeof raw.action!=='object')return null;
 const x=raw.action,has=['walk','inspect','trial','place'].includes(x.type),plain=['start','undo','compare','finish'].includes(x.type);
 const a=has?{scene:'story',action:{type:x.type,value:x.value}}:plain?{scene:'story',action:{type:x.type}}:null;
 return a&&eq(a,raw)?a:null;
}
function apply(s,a){
 if(a.scene==='nav'){
  if(a.type==='restart')return fresh();
  if(a.type==='garden'&&s.screen==='connector'&&E07.view(s.story).stage==='finished')return {...s,screen:'garden'};
  if(a.type==='connector'&&s.screen==='garden')return {...s,screen:'connector'};
  return null;
 }
 if(a.scene==='walkthrough'){
  if(s.screen!=='connector'||E07.view(s.story).stage!=='finished')return null;
  const w=s.walkthrough;
  if(a.type==='start'&&w.phase==='idle')
   return {...s,walkthrough:{...w,phase:'walking'}};
  if(w.phase!=='walking')return null;
  if(a.type==='try-closed'&&w.position==='crossing'&&!w.stopped)
   return {...s,walkthrough:{...w,stopped:true}};
  if(a.type==='move'){
   const edges={bench:'crossing',crossing:'water-edge','water-edge':'steps-base'};
   if(edges[w.position]!==a.value)return null;
   if(w.position==='crossing'&&!w.checked.includes('crossing')||
      w.position==='water-edge'&&!w.checked.includes('water-edge'))return null;
   return {...s,walkthrough:{...w,position:a.value}};
  }
  if(a.type==='inspect'&&a.value===w.position&&
    ['crossing','water-edge'].includes(a.value)&&!w.checked.includes(a.value))
   return {...s,walkthrough:{...w,checked:[...w.checked,a.value]}};
  if(a.type==='review'&&w.position==='steps-base'&&w.checked.length===2)
   return {...s,walkthrough:{...w,phase:'reviewed'}};
  return null;
 }
 if(s.screen!=='connector'||!E07.can(s.story,a.action))return null;
 return {...s,story:E07.dispatch(s.story,a.action)};
}
export function replay(history){
 if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
 let s=fresh();for(const raw of history){const a=clean(raw);if(!a||a.scene==='nav'&&a.type==='restart')return null;const n=apply(s,a);if(!n)return null;s={...n,history:[...s.history,a]};}return mark(s);
}
export function restore(s){
 if(!s||typeof s!=='object'||Array.isArray(s)||s.version!==VERSION||s.mode!=='noncanonical_paper')return null;
 if(verified.get(s)===JSON.stringify(s))return s;
 const r=replay(s.history);return r&&eq(r,s)?mark(s):null;
}
export function can(snapshot,action){const s=restore(snapshot),a=clean(action);return !!(s&&a&&(a.scene==='nav'&&a.type==='restart'||s.history.length<MAX_ACTIONS&&apply(s,a)));}
export function dispatch(snapshot,action){const s=restore(snapshot);if(!s)return fresh();const a=clean(action);if(!a)return s;if(a.scene==='nav'&&a.type==='restart')return fresh();if(s.history.length>=MAX_ACTIONS)return s;const n=apply(s,a);return n?mark({...n,history:[...s.history,a]}):s;}
export function view(snapshot){const s=restore(snapshot);if(!s)return null;const story=E07.view(s.story),w=s.walkthrough;
 const positionNames={bench:'model bench',crossing:'shared crossing','water-edge':'water edge','steps-base':'Lantern Steps BASE'};
 const walkFeedback=w.phase==='idle'?'First test and revise the connector for all three uses.':
  w.phase==='reviewed'?'PAPER route walk reviewed: people can pass, water stays open, Steps lights OFF.':
  w.stopped?'CLOSED North Hill route: Milo stops at the boundary and stays on the model crossing.':
  w.position==='crossing'?'Can the other traveler pass? Look before moving.':
  w.position==='water-edge'?'Water needs a way. Look before moving.':
  w.position==='steps-base'?'At the MODEL Steps BASE. The lights are OFF. Review what you checked.':
  'Walk the PAPER route and check who else uses it.';
 return {screen:s.screen,story,walkthrough:{phase:w.phase,position:w.position,
   positionLabel:positionNames[w.position],checked:[...w.checked],stopped:w.stopped,
   feedback:walkFeedback,reviewed:w.phase==='reviewed'},
  connectorPaperRevised:story.previewComplete,currentGardenHealthy:true,lowerGardenUnbuilt:true,e06Verified:false,e08Unlocked:false,northHillClosed:true,lightsOff:true,realAccessApproved:false,productionEntryReady:false,canonicalEvents:[],unlocks:[],rights:[],historicalClaims:[]};}
