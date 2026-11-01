// E04 undated memories -> E05 MOCK station -> E06 two PAPER gardens -> E07 checked
// connector -> E08 two-view model -> E09 CLOSED hill survey. AUTHORING ONLY.
// Histories in URL fragments are user-editable; strict replay is not authentication.
import * as E04 from './arc1-memory-station-handoff-model.mjs';
import * as E05 from '../e05-scene/scene-model.mjs';
import * as E06 from '../e06-scene/scene-model.mjs';
import * as E07 from '../e07-scene/scene-model.mjs';
import * as E08 from '../e08-scene/scene-model.mjs';
import * as E09 from '../e09-scene/scene-model.mjs';
import {encodeMemoryLantern} from './e04-e08-scene-transfer.mjs';
import {encodeHillTransfer} from './e08-e09-scene-transfer.mjs';

const PREFIX='#paper-memory-station-garden-shortcut-steps-hill=';
const MAX_FRAGMENT=150000;
const keys=o=>Object.keys(o).sort().join(',');
function valid(e04,e05,e06,e07,e08,e09){
 const memory=encodeMemoryLantern(e04,e05,e06,e07,e08);
 const hill=encodeHillTransfer(e08,e09,e07,e06);
 const s=E09.restore(e09),v=s&&E09.view(s);
 return !!(memory&&hill&&s&&v&&v.upperHillClosed&&!v.e10Unlocked&&
  !v.realAccessApproved&&!v.productionEntryReady&&
  s.canonicalEvents.length===0&&s.unlocks.length===0&&
  s.rights.length===0&&s.historicalClaims.length===0);
}
export function encodeMemoryHill(e04,e05,e06,e07,e08,e09){
 if(!valid(e04,e05,e06,e07,e08,e09))return null;
 const fragment=PREFIX+encodeURIComponent(JSON.stringify({
  v:1,e04:e04.history,e05:e05.history,e06:e06.history,
  e07:e07.history,e08:e08.history,e09:e09.history}));
 return fragment.length<=MAX_FRAGMENT?fragment:null;
}
export function decodeMemoryHill(fragment){
 if(typeof fragment!=='string'||!fragment.startsWith(PREFIX)||
  fragment.length>MAX_FRAGMENT)return null;
 try{
  const p=JSON.parse(decodeURIComponent(fragment.slice(PREFIX.length)));
  if(!p||typeof p!=='object'||Array.isArray(p)||p.v!==1||
   keys(p)!=='e04,e05,e06,e07,e08,e09,v'||
   !['e04','e05','e06','e07','e08','e09'].every(k=>Array.isArray(p[k])))return null;
  const e04=E04.replay(p.e04),e05=E05.replay(p.e05),
   e06=E06.replay(p.e06),e07=E07.replay(p.e07),
   e08=E08.replay(p.e08),e09=E09.replay(p.e09);
  return valid(e04,e05,e06,e07,e08,e09)?{e04,e05,e06,e07,e08,e09}:null;
 }catch{return null;}
}
