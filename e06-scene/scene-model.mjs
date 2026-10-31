// Two distinct E06 authoring-only spaces. No production ledger, save or unlock.
import * as Garden from '../authoring-labs/lower-garden-story-model.mjs';
export const VERSION='e06-two-garden-isolated-paper-v1';
export const MAX_ACTIONS=90;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const verified=new WeakMap();
const mark=s=>(verified.set(s,JSON.stringify(s)),s);
export function fresh(){return mark({version:VERSION,mode:'noncanonical_paper',
  screen:'current',garden:Garden.fresh(),history:[],
  canonicalEvents:[],unlocks:[],historicalClaims:[],rights:[]});}
function clean(raw){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
  if(raw.scene==='nav'&&['to-current','to-lower','restart'].includes(raw.type))
    return {scene:'nav',type:raw.type};
  if(raw.scene==='garden'&&raw.action&&typeof raw.action==='object'&&!Array.isArray(raw.action))
    return {scene:'garden',action:raw.action};
  return null;
}
function apply(s,a){
  const g=Garden.view(s.garden);
  if(a.scene==='nav'){
    if(a.type==='restart')return {...fresh(),history:s.history};
    if(a.type==='to-current'&&s.screen==='lower')return {...s,screen:'current'};
    if(a.type==='to-lower'&&s.screen==='current'&&
      ['lower','finished'].includes(g.phase))return {...s,screen:'lower'};
    return null;
  }
  if(a.scene!=='garden'||s.screen==='current'&&
    !['opening','current'].includes(g.phase)||s.screen==='lower'&&
    g.phase!=='lower'||!Garden.can(s.garden,a.action))return null;
  const next=Garden.dispatch(s.garden,a.action);
  if(same(next,s.garden))return null;
  return {...s,garden:next,
    screen:a.action.type==='enter'?'lower':s.screen};
}
export function replay(history){
  if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
  let s=fresh();
  for(const raw of history){
    const a=clean(raw);if(!a||!same(a,raw))return null;
    const next=apply(s,a);if(!next)return null;
    s={...next,history:[...s.history,a]};
  }
  return mark(s);
}
export function restore(snapshot){
  if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||
    snapshot.version!==VERSION||snapshot.mode!=='noncanonical_paper')return null;
  if(verified.get(snapshot)===JSON.stringify(snapshot))return snapshot;
  const rebuilt=replay(snapshot.history);
  return rebuilt&&same(rebuilt,snapshot)?mark(snapshot):null;
}
export function can(snapshot,action){
  const s=restore(snapshot),a=clean(action);
  return !!(s&&a&&same(a,action)&&s.history.length<MAX_ACTIONS&&apply(s,a));
}
export function dispatch(snapshot,action){
  const s=restore(snapshot);if(!s)return fresh();
  const a=clean(action);
  if(!a||!same(a,action)||s.history.length>=MAX_ACTIONS)return s;
  const next=apply(s,a);
  return next?mark({...next,history:[...s.history,a]}):s;
}
export function view(snapshot){
  const s=restore(snapshot);if(!s)return null;
  const g=Garden.view(s.garden);
  return {screen:s.screen,garden:g,
    currentHealthy:true,lowerPaperStarted:g.phase==='finished',
    currentCompared:g.modelCompared,lowerVisited:g.lowerVisited,
    paperChronicle:g.paperNote||'PAPER ONLY: compare two garden places. History and permission UNKNOWN.',
    parentCue:g.parentCue||'What do you see? What would you test before deciding?',
    historicalCause:'UNKNOWN',realAccessApproved:false,plantingPermission:false,
    northHillClosed:true,commonRevealed:false,productionEntryReady:false,
    e07Unlocked:false,canonicalEvents:[],unlocks:[],historicalClaims:[],rights:[]};
}
