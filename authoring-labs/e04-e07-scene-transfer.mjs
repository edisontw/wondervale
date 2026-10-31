// Child-earned E04 -> E05 -> E06 -> E07 PAPER-only rehearsal, never production progress.
// Every URL visit replays all four independent reducers; a forged source, right or unlock fails closed.
import * as E04 from './arc1-memory-station-handoff-model.mjs';
import * as E05 from '../e05-scene/scene-model.mjs';
import * as E06 from '../e06-scene/scene-model.mjs';
import * as E07 from '../e07-scene/scene-model.mjs';
import {encodeMemoryStationGardenTransfer} from './e04-e06-scene-transfer.mjs';
import {encodeTransfer as encodeGardenShortcut} from './e06-e07-scene-transfer.mjs';
const PREFIX='#paper-memory-station-garden-shortcut=',MAX_FRAGMENT=85000;
const keys=o=>Object.keys(o).sort().join(',');
function valid(e04,e05,e06,e07){
 const memory=encodeMemoryStationGardenTransfer(e04,e05,e06);
 const s=E07.restore(e07),v=s&&E07.view(s);
 if(!memory||!s||!v||v.productionEntryReady||v.e08Unlocked||
  !v.northHillClosed||!v.lightsOff||v.realAccessApproved||
  s.canonicalEvents.length||s.unlocks.length||s.rights.length||
  s.historicalClaims.length)return false;
 // E07 is only earned after Milo's E06 hypothetical care comparison.
 // An untouched E07 can travel upstream before that, but never an E07 action.
 return s.history.length===0||encodeGardenShortcut(e06,s)!==null;
}
export function encodeMemoryGardenShortcut(e04,e05,e06,e07){
 if(!valid(e04,e05,e06,e07))return null;
 const fragment=PREFIX+encodeURIComponent(JSON.stringify({
  v:1,e04:e04.history,e05:e05.history,e06:e06.history,e07:e07.history}));
 return fragment.length<=MAX_FRAGMENT?fragment:null;
}
export function decodeMemoryGardenShortcut(fragment){
 if(typeof fragment!=='string'||!fragment.startsWith(PREFIX)||
  fragment.length>MAX_FRAGMENT)return null;
 try{
  const p=JSON.parse(decodeURIComponent(fragment.slice(PREFIX.length)));
  if(!p||typeof p!=='object'||Array.isArray(p)||p.v!==1||
   keys(p)!=='e04,e05,e06,e07,v'||!['e04','e05','e06','e07'].every(k=>Array.isArray(p[k])))return null;
  const e04=E04.replay(p.e04),e05=E05.replay(p.e05),
   e06=E06.replay(p.e06),e07=E07.replay(p.e07);
  return valid(e04,e05,e06,e07)?{e04,e05,e06,e07}:null;
 }catch{return null;}
}
