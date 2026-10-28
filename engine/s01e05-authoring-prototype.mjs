// E05 Gate-1 engineering sandbox ONLY. Synthetic peg/table geometry; not station history or art.
// No localStorage, upstream checkpoint, canonical event, unlock or production import.
export const VERSION='s01e05-authoring-prototype-v1';
export const MAX_ACTIONS=60;
export const FEATURES=Object.freeze(['peg-pair','worn-edge']);
export const ORIENTATIONS=Object.freeze(['side-a','side-b']);
export const TABLE_POSITIONS=Object.freeze(['near-wall','across-walkway']);
export const BOARD=Object.freeze({
  'peg-pair':Object.freeze({x:1,y:1}),
  'worn-edge':Object.freeze({x:3,y:2})
});
export const REPLICA=Object.freeze({
  'side-a':Object.freeze({'peg-pair':Object.freeze({x:1,y:1}),'worn-edge':Object.freeze({x:3,y:2})}),
  'side-b':Object.freeze({'peg-pair':Object.freeze({x:3,y:1}),'worn-edge':Object.freeze({x:1,y:2})})
});
export const WALKWAY=Object.freeze({x:3,y:0,w:2,h:4});
export const TABLES=Object.freeze({
  'near-wall':Object.freeze({x:0,y:1,w:2,h:2}),
  'across-walkway':Object.freeze({x:3,y:1,w:2,h:2})
});
const owns=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const has=(xs,x)=>xs.includes(x);
export function alignment(orientation) {
  if(!has(ORIENTATIONS,orientation))return null;
  const checks=FEATURES.map(id=>({id,board:BOARD[id],copy:REPLICA[orientation][id],
    fits:equal(BOARD[id],REPLICA[orientation][id])}));
  return {checks,matched:checks.every(x=>x.fits)};
}
export function corridorClear(position) {
  if(!has(TABLE_POSITIONS,position))return null;
  const t=TABLES[position],c=WALKWAY;
  return !(t.x<c.x+c.w && t.x+t.w>c.x && t.y<c.y+c.h && t.y+t.h>c.y);
}
export function fresh() {
  return {schema:1,version:VERSION,mode:'authoring_preview',phase:'inspect',
    inspected:[],orientation:null,comparison:null,limitedConclusion:false,
    table:null,roomPreview:false,history:[],canonicalEvents:[],unlocks:[]};
}
function apply(s,a) {
  if(!a || typeof a!=='object' || Array.isArray(a) ||
      Object.keys(a).some(k=>!['type','id','orientation','position'].includes(k)))return null;
  if(s.phase==='done')return null;
  switch(a.type) {
    case 'inspect-feature':
      if(!has(FEATURES,a.id)||s.inspected.includes(a.id)||s.phase==='layout')return null;
      return {...s,inspected:[...s.inspected,a.id]};
    case 'place-replica':
      if(!has(ORIENTATIONS,a.orientation)||!s.inspected.length||s.phase==='layout'||
          s.orientation===a.orientation)return null;
      return {...s,phase:'replica',orientation:a.orientation,comparison:null,limitedConclusion:false};
    case 'compare-fit':
      if(s.inspected.length!==FEATURES.length||!s.orientation||s.comparison)return null;
      return {...s,comparison:alignment(s.orientation)};
    case 'note-limits':
      if(!s.comparison?.matched||s.inspected.length!==FEATURES.length)return null;
      return {...s,phase:'layout',limitedConclusion:true};
    case 'place-table':
      if(s.phase!=='layout'||!has(TABLE_POSITIONS,a.position)||s.table===a.position)return null;
      return {...s,table:a.position};
    case 'confirm-room':
      if(s.phase!=='layout'||!s.limitedConclusion||corridorClear(s.table)!==true)return null;
      return {...s,phase:'done',roomPreview:true};
    default:return null;
  }
}
function canonicalAction(a) {
  switch(a.type) {
    case 'inspect-feature':return {type:a.type,id:a.id};
    case 'place-replica':return {type:a.type,orientation:a.orientation};
    case 'compare-fit':case 'note-limits':case 'confirm-room':return {type:a.type};
    case 'place-table':return {type:a.type,position:a.position};
    default:return null;
  }
}
export function replay(history) {
  if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
  let s=fresh();
  for(const a of history) {
    if(!a || typeof a!=='object'||Array.isArray(a)||!Object.isFrozen(a) && false)return null;
    const clean=canonicalAction(a);
    if(!clean||!equal(clean,a))return null;
    const next=apply(s,clean);
    if(!next)return null;
    s={...next,history:[...s.history,clean]};
  }
  return s;
}
export function restore(snapshot) {
  if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||
      snapshot.version!==VERSION||snapshot.mode!=='authoring_preview')return null;
  const rebuilt=replay(snapshot.history);
  return rebuilt && equal(rebuilt,snapshot)?rebuilt:null;
}
export function dispatch(state,action) {
  // A mutated or forged snapshot fails closed. The preview never writes canonical state.
  const valid=restore(state);
  if(!valid||valid.history.length>=MAX_ACTIONS)return valid??fresh();
  const clean=action && canonicalAction(action);
  if(!clean||!equal(clean,action))return valid;
  const next=apply(valid,clean);
  return next?{...next,history:[...valid.history,clean]}:valid;
}
export function previewProjection(state) {
  const s=restore(state);
  if(!s)return null;
  return {fit:s.comparison?.matched??null,comparison:s.comparison,
    corridorClear:corridorClear(s.table),mapRoomVisible:s.roomPreview,
    limitedInference:s.limitedConclusion,
    message:s.roomPreview?'A small map workspace can fit here. The old service stays closed.':
      s.table && corridorClear(s.table)===false?'The table covers the public walkway. Try another place.':
      s.comparison && !s.comparison.matched?'The copy marks do not line up. You can turn it.':
      s.comparison?.matched?'Both marks line up on the COPY. That does not prove the route history.':
      'Look at the marks and try the removable copy.',
    canonicalEvents:[],unlocks:[],historicalClaims:[]};
}
