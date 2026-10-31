// E09 -> E10 independent PAPER scenes. No canonical unlock, historical source or access claim.
// Every fragment is replayed from child actions; no snapshot or caller-provided completion flag.
import * as E06 from '../e06-scene/scene-model.mjs';
import * as E07 from '../e07-scene/scene-model.mjs';
import * as E08 from '../e08-scene/scene-model.mjs';
import * as E09 from '../e09-scene/scene-model.mjs';
import * as E10 from './unnamed-story-model.mjs';

const PREFIX='#paper-unnamed=',MAX_FRAGMENT=100000;
const keys=o=>Object.keys(o).sort().join(',');
const earned=(e08,e09)=>{
 const a=E08.view(e08),b=E09.view(e09);
 return !!(a?.lowerLightsPaperOn&&b?.story?.previewComplete&&
  b.story.routeResult?.complete&&b.story.symbolCompared&&
  b.upperHillClosed&&b.e10Unlocked===false);
};
export function encodeUnnamedTransfer(e08,e09,e10,e07=null,e06=null){
 if(!E08.restore(e08)||!E09.restore(e09)||!E10.restore(e10)||!earned(e08,e09))return null;
 if(e07!==null&&(!E07.restore(e07)||!E07.view(e07).walkthrough.reviewed))return null;
 if(e06!==null&&(!e07||!E06.restore(e06)||!E06.view(e06).lowerGrowthVisible))return null;
 const packet={v:1,e08:e08.history,e09:e09.history,e10:e10.history};
 if(e07!==null)packet.e07=e07.history;
 if(e06!==null)packet.e06=e06.history;
 const fragment=PREFIX+encodeURIComponent(JSON.stringify(packet));
 return fragment.length<=MAX_FRAGMENT?fragment:null;
}
export function decodeUnnamedTransfer(fragment){
 if(typeof fragment!=='string'||!fragment.startsWith(PREFIX)||fragment.length>MAX_FRAGMENT)return null;
 try{
  const packet=JSON.parse(decodeURIComponent(fragment.slice(PREFIX.length)));
  if(!packet||typeof packet!=='object'||Array.isArray(packet)||packet.v!==1||
   !['e08,e09,e10,v','e07,e08,e09,e10,v','e06,e07,e08,e09,e10,v'].includes(keys(packet))||
   !Array.isArray(packet.e08)||!Array.isArray(packet.e09)||!Array.isArray(packet.e10))return null;
  const e08=E08.replay(packet.e08),e09=E09.replay(packet.e09),e10=E10.replay(packet.e10);
  if(!e08||!e09||!e10||!earned(e08,e09))return null;
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
  return {e08,e09,e10,e07,e06};
 }catch{return null;}
}
