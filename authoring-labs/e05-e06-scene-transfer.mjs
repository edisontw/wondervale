// Reversible E05 station -> E06 Current/Lower Garden PAPER visit only.
// An editable URL fragment is rehearsal history, never proof of access or canon.
import * as E05 from '../e05-scene/scene-model.mjs';
import * as E06 from '../e06-scene/scene-model.mjs';
const PREFIX='#paper-station-garden=',MAX_FRAGMENT=35000;
const keys=o=>Object.keys(o).sort().join(',');
function earned(e05){
 const s=E05.restore(e05),v=s&&E05.view(s);
 return !!(s&&v?.stage==='review'&&v.mapRoomPaperVisible&&
   v.gardenMap.overlay&&v.gardenMap.question&&v.gardenMap.inspected.length===2&&
   v.productionEntryReady===false&&v.e06Unlocked===false&&
   v.canonicalEvents.length===0&&v.unlocks.length===0&&
   s.rights.length===0&&s.historicalClaims.length===0);
}
function safe(e06){
 const s=E06.restore(e06),v=s&&E06.view(s);
 return !!(s&&v&&v.e07Unlocked===false&&v.productionEntryReady===false&&
   v.northHillClosed===true&&v.commonRevealed===false&&
   s.canonicalEvents.length===0&&s.unlocks.length===0&&
   s.historicalClaims.length===0&&s.rights.length===0);
}
export function encodeStationGardenTransfer(e05,e06){
 if(!earned(e05)||!safe(e06))return null;
 const fragment=PREFIX+encodeURIComponent(JSON.stringify({v:1,e05:e05.history,e06:e06.history}));
 return fragment.length<=MAX_FRAGMENT?fragment:null;
}
export function decodeStationGardenTransfer(fragment){
 if(typeof fragment!=='string'||!fragment.startsWith(PREFIX)||fragment.length>MAX_FRAGMENT)return null;
 try{
  const packet=JSON.parse(decodeURIComponent(fragment.slice(PREFIX.length)));
  if(!packet||typeof packet!=='object'||Array.isArray(packet)||keys(packet)!=='e05,e06,v'||
    packet.v!==1||!Array.isArray(packet.e05)||!Array.isArray(packet.e06))return null;
  const e05=E05.replay(packet.e05),e06=E06.replay(packet.e06);
  return earned(e05)&&safe(e06)?{e05,e06}:null;
 }catch{return null;}
}
