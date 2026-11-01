// E04 -> E05 -> E06 Current/Lower Garden -> E07 -> E08 PAPER-only five-scene journey.
// URL histories are editable rehearsal data, never authentication, history, access or production unlock.
import * as E04 from './arc1-memory-station-handoff-model.mjs';
import * as E05 from '../e05-scene/scene-model.mjs';
import * as E06 from '../e06-scene/scene-model.mjs';
import * as E07 from '../e07-scene/scene-model.mjs';
import * as E08 from '../e08-scene/scene-model.mjs';
import {encodeMemoryGardenShortcut} from './e04-e07-scene-transfer.mjs';
import {encodeStepsTransfer} from './e07-e08-scene-transfer.mjs';
const PREFIX='#paper-memory-station-garden-shortcut-steps=',MAX_FRAGMENT=110000;
const keys=o=>Object.keys(o).sort().join(',');
function valid(e04,e05,e06,e07,e08){
 const upstream=encodeMemoryGardenShortcut(e04,e05,e06,e07);
 const downstream=encodeStepsTransfer(e07,e08,e06);
 const s=E08.restore(e08),v=s&&E08.view(s);
 return !!(upstream&&downstream&&s&&v&&!v.e07Verified&&!v.e09Unlocked&&
  v.upperHillClosed&&!v.realLightingApproved&&!v.serviceDateApproved&&
  !v.productionEntryReady&&s.canonicalEvents.length===0&&s.unlocks.length===0&&
  s.rights.length===0&&s.historicalClaims.length===0);
}
export function encodeMemoryLantern(e04,e05,e06,e07,e08){
 if(!valid(e04,e05,e06,e07,e08))return null;
 const fragment=PREFIX+encodeURIComponent(JSON.stringify({
  v:1,e04:e04.history,e05:e05.history,e06:e06.history,e07:e07.history,e08:e08.history}));
 return fragment.length<=MAX_FRAGMENT?fragment:null;
}
export function decodeMemoryLantern(fragment){
 if(typeof fragment!=='string'||!fragment.startsWith(PREFIX)||fragment.length>MAX_FRAGMENT)return null;
 try{
  const p=JSON.parse(decodeURIComponent(fragment.slice(PREFIX.length)));
  if(!p||typeof p!=='object'||Array.isArray(p)||p.v!==1||
   keys(p)!=='e04,e05,e06,e07,e08,v'||
   !['e04','e05','e06','e07','e08'].every(k=>Array.isArray(p[k])))return null;
  const e04=E04.replay(p.e04),e05=E05.replay(p.e05),e06=E06.replay(p.e06),
   e07=E07.replay(p.e07),e08=E08.replay(p.e08);
  return valid(e04,e05,e06,e07,e08)?{e04,e05,e06,e07,e08}:null;
 }catch{return null;}
}
