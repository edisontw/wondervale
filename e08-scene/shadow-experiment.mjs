import {MARKERS} from '../engine/s01e08-authoring-prototype.mjs';

// Isolated synthetic PAPER screen: projected shadows are not real lighting, dates or access.
export const SHADOW_VERSION='e08-paper-shadow-screen-v1',MAX_SHADOW_ACTIONS=32;
const LAMPS={a:{x:1,y:0},b:{x:7,y:0}},SCREENS={near:5,far:7};
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function projectShadows(lamp,screen){
 if(!Object.hasOwn(LAMPS,lamp)||!Object.hasOwn(SCREENS,screen))return null;
 const source=LAMPS[lamp],y=SCREENS[screen];
 return MARKERS.map((mark,i)=>({mark:'ABC'[i],
  x:Math.round((source.x+(mark.x-source.x)*(y-source.y)/(mark.y-source.y))*10)/10}));
}
export function freshShadow(){return {version:SHADOW_VERSION,screen:'near',lamp:'a',notes:[],compared:false,history:[]};}
function clean(action){
 if(!action||typeof action!=='object'||Array.isArray(action))return null;
 let a=null;
 if(action.type==='move-screen')a={type:'move-screen',screen:action.screen};
 if(action.type==='choose-lamp')a={type:'choose-lamp',lamp:action.lamp};
 if(['record','compare','clear','reset'].includes(action.type))a={type:action.type};
 return a&&equal(a,action)?a:null;
}
function pair(notes){
 for(let i=0;i<notes.length;i++)for(let j=i+1;j<notes.length;j++)
  if(notes[i].lamp===notes[j].lamp&&notes[i].screen!==notes[j].screen)
   return [notes[i],notes[j]];
 return null;
}
function apply(s,a){
 if(a.type==='move-screen'&&Object.hasOwn(SCREENS,a.screen))
  return {...s,screen:a.screen};
 if(a.type==='choose-lamp'&&Object.hasOwn(LAMPS,a.lamp))
  return {...s,lamp:a.lamp};
 if(a.type==='record'){
  const id=s.lamp+':'+s.screen;
  if(s.notes.length===4||s.notes.some(n=>n.id===id))return null;
  return {...s,notes:[...s.notes,{id,lamp:s.lamp,screen:s.screen,shadows:projectShadows(s.lamp,s.screen)}],compared:false};
 }
 if(a.type==='compare'&&pair(s.notes))return {...s,compared:true};
 if(a.type==='clear'&&s.notes.length)return {...s,notes:[],compared:false};
 return null;
}
export function replayShadow(history){
 if(!Array.isArray(history)||history.length>MAX_SHADOW_ACTIONS)return null;
 let s=freshShadow();
 for(const raw of history){
  const a=clean(raw);if(!a||a.type==='reset')return null;
  const next=apply(s,a);if(!next)return null;
  s={...next,history:[...s.history,a]};
 }
 return s;
}
export function restoreShadow(snapshot){
 if(!snapshot||snapshot.version!==SHADOW_VERSION)return null;
 const actual=replayShadow(snapshot.history);
 return actual&&equal(actual,snapshot)?actual:null;
}
export function canShadow(snapshot,action){
 const s=restoreShadow(snapshot),a=clean(action);
 return !!(s&&a&&(a.type==='reset'||s.history.length<MAX_SHADOW_ACTIONS&&apply(s,a)));
}
export function dispatchShadow(snapshot,action){
 const s=restoreShadow(snapshot);if(!s)return freshShadow();
 const a=clean(action);if(!a)return s;
 if(a.type==='reset')return freshShadow();
 if(s.history.length>=MAX_SHADOW_ACTIONS)return s;
 const next=apply(s,a);
 return next?{...next,history:[...s.history,a]}:s;
}
export function viewShadow(snapshot){
 const s=restoreShadow(snapshot);if(!s)return null;
 const evidence=pair(s.notes);
 const shifts=evidence?evidence[0].shadows.map((p,i)=>({
  mark:p.mark,delta:Math.round(Math.abs(p.x-evidence[1].shadows[i].x)*10)/10})):[];
 return {screen:s.screen,lamp:s.lamp,shadows:projectShadows(s.lamp,s.screen),
  notes:s.notes,comparable:!!evidence,compared:s.compared,shifts,
  paperOnly:true,canonicalEvents:[],unlocks:[],realLightsApproved:false,upperHillClosed:true};
}
