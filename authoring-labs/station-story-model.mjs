// Isolated E05 paper rehearsal: no approved foyer, records, source cards or canonical entry.
import {fresh as freshReplica,dispatch as replicaAction,previewProjection} from '../engine/s01e05-authoring-prototype.mjs';
export const VERSION='e05-paper-story-v1';
export const MAX_STEPS=48;
const FEATURES=['peg-pair','worn-edge'];
const WAYPOINTS=['door','board','table'];
const GUESSES=['route-board','notice-board','unsure'];
const ORIENTATIONS=['side-a','side-b'];
const POSITIONS=['near-wall','across-walkway'];
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const has=(xs,x)=>xs.includes(x);
export function fresh(){
 return {version:VERSION,mode:'authoring_preview',phase:'opening',milo:'door',inspected:[],
   guess:null,replica:freshReplica(),reflection:false,history:[],canonicalEvents:[],unlocks:[]};
}
function clean(a){
 if(!a||typeof a!=='object'||Array.isArray(a))return null;
 const types=['start','walk','inspect','guess','try-copy','check','qualify','place-table','confirm','reflect'];
 if(!has(types,a.type))return null;
 const one=['walk','inspect','guess','try-copy','place-table'].includes(a.type);
 const obj=one?{type:a.type,value:a.value}:{type:a.type};
 return same(obj,a)?obj:null;
}
function apply(s,a){
 if(s.phase==='finished')return null;
 const r=s.replica;
 switch(a.type){
 case 'start':return s.phase==='opening'?{...s,phase:'explore'}:null;
 case 'walk':
  if(s.phase==='opening'||!has(WAYPOINTS,a.value)||s.milo===a.value)return null;
  return {...s,milo:a.value};
 case 'inspect':
  if(s.milo!=='board'||!has(FEATURES,a.value)||s.inspected.includes(a.value)||
     ['layout','room'].includes(s.phase))return null;
  return {...s,inspected:[...s.inspected,a.value],replica:replicaAction(r,{type:'inspect-feature',id:a.value})};
 case 'guess':
  if(s.milo!=='board'||!s.inspected.length||!has(GUESSES,a.value)||
     ['layout','room'].includes(s.phase)||s.guess===a.value)return null;
  return {...s,guess:a.value};
 case 'try-copy':
  if(s.milo!=='board'||s.inspected.length!==2||!s.guess||
     !has(ORIENTATIONS,a.value)||['layout','room'].includes(s.phase))return null;
  {const next=replicaAction(r,{type:'place-replica',orientation:a.value});
   return same(next,r)?null:{...s,phase:'test',replica:next};}
 case 'check':
  if(s.milo!=='board'||s.phase!=='test'||!r.orientation||r.comparison)return null;
  {const next=replicaAction(r,{type:'compare-fit'});
   return same(next,r)?null:{...s,replica:next};}
 case 'qualify':
  if(s.milo!=='board'||s.phase!=='test'||!r.comparison?.matched)return null;
  {const next=replicaAction(r,{type:'note-limits'});
   return same(next,r)?null:{...s,phase:'layout',replica:next};}
 case 'place-table':
  if(s.milo!=='table'||s.phase!=='layout'||!has(POSITIONS,a.value))return null;
  {const next=replicaAction(r,{type:'place-table',position:a.value});
   return same(next,r)?null:{...s,replica:next};}
 case 'confirm':
  if(s.milo!=='table'||s.phase!=='layout')return null;
  {const next=replicaAction(r,{type:'confirm-room'});
   return same(next,r)?null:{...s,phase:'room',replica:next};}
 case 'reflect':
  return s.phase==='room'&&s.milo==='table'?{...s,phase:'finished',reflection:true}:null;
 default:return null;
 }
}
export function replay(history){
 if(!Array.isArray(history)||history.length>MAX_STEPS)return null;
 let s=fresh();
 for(const action of history){
  const a=clean(action);
  if(!a)return null;
  const next=apply(s,a);
  if(!next)return null;
  s={...next,history:[...s.history,a]};
 }
 return s;
}
export function restore(snapshot){
 if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot))return null;
 const s=replay(snapshot.history);
 return s&&same(s,snapshot)?s:null;
}
export function dispatch(snapshot,action){
 const s=restore(snapshot);
 if(!s)return fresh();
 if(s.history.length>=MAX_STEPS)return s;
 const a=clean(action);
 if(!a)return s;
 const next=apply(s,a);
 return next?{...next,history:[...s.history,a]}:s;
}
export function can(snapshot,action){
 const s=restore(snapshot),a=clean(action);
 return !!(s&&a&&s.history.length<MAX_STEPS&&apply(s,a));
}
export function view(snapshot){
 const s=restore(snapshot);
 if(!s)return null;
 const p=previewProjection(s.replica);
 const last=s.history.at(-1);
 let speaker='Nia',line='The old service is closed. We can test a PAPER copy, not the old board.';
 if(s.phase==='explore') {speaker='Milo';line='What can these marks tell us? I want to look.';}
 if(last?.type==='inspect'){speaker='Finn';line='I see a '+(last.value==='peg-pair'?'pair of marks.':'worn edge.')+' What else do you see?';}
 if(last?.type==='guess'){speaker='Milo';line='I think it may be '+(last.value==='unsure'?'something else. I am not sure.':last.value==='route-board'?'a route board.':'a notice board.')+' This is a guess.';}
 if(last?.type==='try-copy'){speaker='Nia';line='Let us check both marks on the removable copy.';}
 if(s.replica.comparison&&!s.replica.comparison.matched){speaker='Nia';line='The two marks do not fit. We can turn the copy and try again.';}
 if(s.replica.comparison?.matched){speaker='Nia';line='It fits on our paper copy. Does that prove the whole route story?';}
 if(s.phase==='layout'){speaker='Finn';line='We do not know the history yet. Can we make a small map table and keep the way clear?';}
 if(s.phase==='layout'&&s.replica.table==='across-walkway'){speaker='Milo';line='The table is in the way. I can move it.';}
 if(s.phase==='room'){speaker='Milo';line='The paper Map Room is ready. The old service is still closed.';}
 if(s.phase==='finished'){speaker='Milo';line='Our paper map shows a garden below, but the garden is up the hill now. Why?';}
 return {speaker,line,phase:s.phase,milo:s.milo,inspected:[...s.inspected],guess:s.guess,
   orientation:s.replica.orientation,fit:p.fit,table:s.replica.table,clear:p.corridorClear,
   mapRoom:s.replica.roomPreview,reflection:s.reflection,
   parentCue:s.inspected.length?'What can we try without changing the old board?':null,
   chroniclePreview:s.reflection?'PAPER NOTE: two marks align on a copy; a clear table can fit. Route history and garden cause remain UNKNOWN.':null,
   canonicalEvents:[],unlocks:[],historicalClaims:[]};
}
