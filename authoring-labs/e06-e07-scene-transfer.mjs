// URL-fragment-only handoff between the two isolated PAPER scene reducers.
// No localStorage, server save, official unlock or real-world evidence.
import * as E06 from '../e06-scene/scene-model.mjs';
import * as E07 from '../e07-scene/scene-model.mjs';
const PREFIX='#paper=',MAX_FRAGMENT=18000;
const keys=o=>Object.keys(o).sort().join(',');
export function encodeTransfer(e06,e07){
 if(!E06.restore(e06)||!E07.restore(e07)||!E06.view(e06).lowerGrowthVisible)return null;
 const packet={v:1,e06:e06.history,e07:e07.history};
 const fragment=PREFIX+encodeURIComponent(JSON.stringify(packet));
 return fragment.length<=MAX_FRAGMENT?fragment:null;
}
export function decodeTransfer(fragment){
 if(typeof fragment!=='string'||!fragment.startsWith(PREFIX)||
   fragment.length>MAX_FRAGMENT)return null;
 try{
  const packet=JSON.parse(decodeURIComponent(fragment.slice(PREFIX.length)));
  if(!packet||Array.isArray(packet)||keys(packet)!=='e06,e07,v'||packet.v!==1||
    !Array.isArray(packet.e06)||!Array.isArray(packet.e07))return null;
  const e06=E06.replay(packet.e06),e07=E07.replay(packet.e07);
  if(!e06||!e07||!E06.view(e06).lowerGrowthVisible)return null;
  return {e06,e07};
 }catch{return null;}
}
