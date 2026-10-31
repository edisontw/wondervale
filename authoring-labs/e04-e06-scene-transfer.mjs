// E04 attributed-memory PAPER note -> independent E05 -> E06 PAPER visits.
// URL history is editable rehearsal data, never canonical evidence or access.
import * as E04 from './arc1-memory-station-handoff-model.mjs';
import * as E05 from '../e05-scene/scene-model.mjs';
import * as E06 from '../e06-scene/scene-model.mjs';
import {encodeStationGardenTransfer} from './e05-e06-scene-transfer.mjs';
const PREFIX='#paper-memory-station-garden=',MAX_FRAGMENT=50000;
const keys=o=>Object.keys(o).sort().join(',');
function memoryReady(raw){
 const s=E04.restore(raw),v=s&&E04.view(s);
 return !!(s&&v?.stage==='e04'&&v.paperReady&&v.timeline.finishedPaper&&
  v.timeline.slots.station==='unknown'&&v.timeline.slots.garden==='unknown'&&
  v.sourceDates==='UNKNOWN'&&!v.e04CanonicalComplete&&!v.sourceCardsApproved&&
  !v.stationAccessApproved&&!v.e05ProductionUnlocked&&v.northHillClosed&&
  !v.commonRevealed&&s.canonicalEvents.length===0&&s.unlocks.length===0&&
  s.historicalClaims.length===0&&s.rights.length===0);
}
function stationSafe(raw){
 const s=E05.restore(raw),v=s&&E05.view(s);
 return !!(s&&v&&!v.productionEntryReady&&!v.e04CanonicalComplete&&!v.e06Unlocked&&
  v.northHillClosed&&!v.commonRevealed&&s.canonicalEvents.length===0&&
  s.unlocks.length===0&&s.historicalClaims.length===0&&s.rights.length===0);
}
function gardenSafe(raw){
 const s=E06.restore(raw),v=s&&E06.view(s);
 return !!(s&&v&&!v.productionEntryReady&&!v.e07Unlocked&&v.northHillClosed&&
  !v.commonRevealed&&s.canonicalEvents.length===0&&s.unlocks.length===0&&
  s.historicalClaims.length===0&&s.rights.length===0);
}
function valid(e04,e05,e06){
 return memoryReady(e04)&&stationSafe(e05)&&gardenSafe(e06)&&
  (e06.history.length===0||encodeStationGardenTransfer(e05,e06)!==null);
}
export function encodeMemoryStationGardenTransfer(e04,e05,e06){
 if(!valid(e04,e05,e06))return null;
 const fragment=PREFIX+encodeURIComponent(JSON.stringify({
  v:1,e04:e04.history,e05:e05.history,e06:e06.history}));
 return fragment.length<=MAX_FRAGMENT?fragment:null;
}
export function decodeMemoryStationGardenTransfer(fragment){
 if(typeof fragment!=='string'||!fragment.startsWith(PREFIX)||fragment.length>MAX_FRAGMENT)return null;
 try{
  const packet=JSON.parse(decodeURIComponent(fragment.slice(PREFIX.length)));
  if(!packet||typeof packet!=='object'||Array.isArray(packet)||
    keys(packet)!=='e04,e05,e06,v'||packet.v!==1||
    !Array.isArray(packet.e04)||!Array.isArray(packet.e05)||!Array.isArray(packet.e06))return null;
  const e04=E04.replay(packet.e04),e05=E05.replay(packet.e05),e06=E06.replay(packet.e06);
  return valid(e04,e05,e06)?{e04,e05,e06}:null;
 }catch{return null;}
}
