// Independent PAPER scene handoff; strict replay, no production unlock or real-world proof.
import * as E06 from '../e06-scene/scene-model.mjs';
import * as E07 from '../e07-scene/scene-model.mjs';
import * as E08 from '../e08-scene/scene-model.mjs';
const PREFIX='#paper-steps=',MAX_FRAGMENT=26000;
const keys=o=>Object.keys(o).sort().join(',');
export function encodeStepsTransfer(e07,e08,e06=null){
 if(!E07.restore(e07)||!E08.restore(e08)||!E07.view(e07).walkthrough.reviewed)return null;
 if(e06!==null&&(!E06.restore(e06)||!E06.view(e06).lowerGrowthVisible))return null;
 const packet={v:1,e07:e07.history,e08:e08.history};
 if(e06!==null)packet.e06=e06.history;
 const fragment=PREFIX+encodeURIComponent(JSON.stringify(packet));
 return fragment.length<=MAX_FRAGMENT?fragment:null;
}
export function decodeStepsTransfer(fragment){
 if(typeof fragment!=='string'||!fragment.startsWith(PREFIX)||fragment.length>MAX_FRAGMENT)return null;
 try{
  const packet=JSON.parse(decodeURIComponent(fragment.slice(PREFIX.length)));
  if(!packet||Array.isArray(packet)||packet.v!==1||
   !['e07,e08,v','e06,e07,e08,v'].includes(keys(packet))||
   !Array.isArray(packet.e07)||!Array.isArray(packet.e08))return null;
  const e07=E07.replay(packet.e07),e08=E08.replay(packet.e08);
  if(!e07||!e08||!E07.view(e07).walkthrough.reviewed)return null;
  let e06=null;
  if(Object.hasOwn(packet,'e06')){
   if(!Array.isArray(packet.e06))return null;
   e06=E06.replay(packet.e06);
   if(!e06||!E06.view(e06).lowerGrowthVisible)return null;
  }
  return {e07,e08,e06};
 }catch{return null;}
}
