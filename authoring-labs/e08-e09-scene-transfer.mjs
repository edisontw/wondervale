// Independent E08 -> E09 PAPER handoff. Strict replay; never a canonical unlock.
import * as E06 from '../e06-scene/scene-model.mjs';
import * as E07 from '../e07-scene/scene-model.mjs';
import * as E08 from '../e08-scene/scene-model.mjs';
import * as E09 from '../e09-scene/scene-model.mjs';
const PREFIX='#paper-hill=',MAX_FRAGMENT=60000;
const keys=o=>Object.keys(o).sort().join(',');
export function encodeHillTransfer(e08,e09,e07=null,e06=null){
 if(!E08.restore(e08)||!E09.restore(e09)||!E08.view(e08).lowerLightsPaperOn)return null;
 if(e07!==null&&(!E07.restore(e07)||!E07.view(e07).walkthrough.reviewed))return null;
 if(e06!==null&&(!e07||!E06.restore(e06)||!E06.view(e06).lowerGrowthVisible))return null;
 const packet={v:1,e08:e08.history,e09:e09.history};
 if(e07!==null)packet.e07=e07.history;
 if(e06!==null)packet.e06=e06.history;
 const fragment=PREFIX+encodeURIComponent(JSON.stringify(packet));
 return fragment.length<=MAX_FRAGMENT?fragment:null;
}
export function decodeHillTransfer(fragment){
 if(typeof fragment!=='string'||!fragment.startsWith(PREFIX)||fragment.length>MAX_FRAGMENT)return null;
 try{
  const packet=JSON.parse(decodeURIComponent(fragment.slice(PREFIX.length)));
  if(!packet||typeof packet!=='object'||Array.isArray(packet)||packet.v!==1||
   !['e08,e09,v','e07,e08,e09,v','e06,e07,e08,e09,v'].includes(keys(packet))||
   !Array.isArray(packet.e08)||!Array.isArray(packet.e09))return null;
  const e08=E08.replay(packet.e08),e09=E09.replay(packet.e09);
  if(!e08||!e09||!E08.view(e08).lowerLightsPaperOn)return null;
  let e07=null,e06=null;
  if(Object.hasOwn(packet,'e07')){
   if(!Array.isArray(packet.e07))return null;
   e07=E07.replay(packet.e07);
   if(!e07||!E07.view(e07).walkthrough.reviewed)return null;
  }
  if(Object.hasOwn(packet,'e06')){
   if(!e07||!Array.isArray(packet.e06))return null;
   e06=E06.replay(packet.e06);
   if(!e06||!E06.view(e06).lowerGrowthVisible)return null;
  }
  return {e08,e09,e07,e06};
 }catch{return null;}
}
