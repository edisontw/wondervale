// E10 -> E11 independent PAPER-only visit. A URL fragment is editable rehearsal state,
// not an authenticated claim of rights, history, a place name, or a production unlock.
import * as E10 from './unnamed-story-model.mjs';
import * as E11 from '../engine/s01e11-authoring-prototype.mjs';
import {encodeUnnamedTransfer,decodeUnnamedTransfer} from './e09-e10-scene-transfer.mjs';
import {encodeMemoryCourtyard,decodeMemoryCourtyard} from './e04-e10-scene-transfer.mjs';
import {questionSource,restoreTrial as restoreQuestion,replayTrial as replayQuestion,viewTrial as viewQuestion} from '../e10-scene/hill-question.mjs';
import {paperHillTraceRevisit,restoreFutureMarker,replayFutureMarker} from '../e11-scene/hill-trace-revisit.mjs';

const PREFIX='#paper-loop=',MAX_FRAGMENT=200000;
const keys=o=>Object.keys(o).sort().join(',');
const allowed=['e10,e11,v','e08,e09,e10,e11,v',
 'e07,e08,e09,e10,e11,v','e06,e07,e08,e09,e10,e11,v',
 'e04,e05,e06,e07,e08,e09,e10,e11,v',
 'e07,e08,e09,e10,e11,question,v','e06,e07,e08,e09,e10,e11,question,v',
 'e04,e05,e06,e07,e08,e09,e10,e11,question,v'];
function earned(e10){
 const v=E10.view(e10);
 return !!(v?.finishedPaper&&v.sourceChecked&&v.comparison&&
  v.testedOneSlot&&v.changedAfterTest&&v.actualName===null&&
  v.e11Unlocked===false&&v.realAccessApproved===false&&
  v.sourceApproved===false&&v.upperHillClosed===true&&
  e10.e10.fixtureEnabled===false&&e10.e10.nameRevealed===false);
}
function cleanUpstream(upstream,e10){
 if(upstream===null)return {};
 if(!upstream||!upstream.e08||!upstream.e09)return null;
 // Full E04/E05 provenance is only accepted as one replay-verified, child-earned chain.
 // A partial E04/E05 packet must not silently fall back to an E06-E09-only link.
 if(Object.hasOwn(upstream,'e04')||Object.hasOwn(upstream,'e05')){
  const names=['e04','e05','e06','e07','e08','e09'];
  if(!names.every(name=>upstream[name]))return null;
  const fragment=encodeMemoryCourtyard(...names.map(name=>upstream[name]),e10);
  const checked=fragment&&decodeMemoryCourtyard(fragment);
  return checked?Object.fromEntries(names.map(name=>[name,checked[name].history])):null;
 }
 const {e08,e09,e07=null,e06=null}=upstream;
 const fragment=encodeUnnamedTransfer(e08,e09,e10,e07,e06);
 if(!fragment)return null;
 const checked=decodeUnnamedTransfer(fragment);
 if(!checked)return null;
 const out={e08:checked.e08.history,e09:checked.e09.history};
 if(checked.e07)out.e07=checked.e07.history;
 if(checked.e06)out.e06=checked.e06.history;
 return out;
}
function allowedPacket(packet){
 const signature=keys(packet);
 if(allowed.includes(signature))return true;
 if(!Object.hasOwn(packet,'marker')||!Object.hasOwn(packet,'question'))return false;
 const without={...packet};delete without.marker;
 return allowed.includes(keys(without));
}
function safeE11(e11){
 const s=E11.restore(e11),p=s&&E11.projection(s);
 return !!(s&&p&&!p.finished&&p.canonicalEvents.length===0&&
  p.unlocks.length===0&&p.historicalClaims.length===0&&
  s.rights.length===0);
}
export function encodeLoopTransfer(e10,e11,upstream=null,questionTrial=null,markerTrial=null){
 if(!E10.restore(e10)||!earned(e10)||!safeE11(e11))return null;
 const extra=cleanUpstream(upstream,e10);
 if(!extra)return null;
 let question={};
 if(questionTrial!==null){
  const source=questionSource(upstream?.e07,upstream?.e08,upstream?.e09);
  const checked=source&&restoreQuestion(questionTrial,source,e10);
  if(!checked||!viewQuestion(checked,source,e10)?.compared)return null;
  question={question:checked.history};
 }
 let marker={};
 if(markerTrial!==null){
  const atlas=questionTrial&&paperHillTraceRevisit(e10,upstream,questionTrial);
  const checked=atlas&&restoreFutureMarker(markerTrial,atlas);
  if(!checked)return null;
  if(checked.history.length)marker={marker:checked.history};
 }
 const packet={v:1,...extra,e10:e10.history,e11:e11.history,...question,...marker};
 const fragment=PREFIX+encodeURIComponent(JSON.stringify(packet));
 return fragment.length<=MAX_FRAGMENT?fragment:null;
}
export function decodeLoopTransfer(fragment){
 if(typeof fragment!=='string'||!fragment.startsWith(PREFIX)||
  fragment.length>MAX_FRAGMENT)return null;
 try{
  const packet=JSON.parse(decodeURIComponent(fragment.slice(PREFIX.length)));
  if(!packet||typeof packet!=='object'||Array.isArray(packet)||
   packet.v!==1||!allowedPacket(packet)||
   !Array.isArray(packet.e10)||!Array.isArray(packet.e11))return null;
  const e10=E10.replay(packet.e10),e11=E11.replay(packet.e11);
  if(!e10||!e11||!earned(e10)||!safeE11(e11))return null;
  let upstream=null;
  if(Object.hasOwn(packet,'e04')){
   const names=['e04','e05','e06','e07','e08','e09','e10'];
   if(!names.every(name=>Array.isArray(packet[name])))return null;
   const original={v:1};
   for(const name of names)original[name]=packet[name];
   const checked=decodeMemoryCourtyard(
    '#paper-memory-station-garden-shortcut-steps-hill-courtyard=' +
    encodeURIComponent(JSON.stringify(original)));
   if(!checked)return null;
   upstream=Object.fromEntries(names.slice(0,-1).map(name=>[name,checked[name]]));
  }else if(Object.hasOwn(packet,'e08')){
   if(!Array.isArray(packet.e08)||!Array.isArray(packet.e09))return null;
   const original={v:1,e08:packet.e08,e09:packet.e09,e10:packet.e10};
   if(Object.hasOwn(packet,'e07')){
    if(!Array.isArray(packet.e07))return null;
    original.e07=packet.e07;
   }
   if(Object.hasOwn(packet,'e06')){
    if(!Array.isArray(packet.e06))return null;
    original.e06=packet.e06;
   }
   const checked=decodeUnnamedTransfer('#paper-unnamed='+encodeURIComponent(JSON.stringify(original)));
   if(!checked)return null;
   upstream={e08:checked.e08,e09:checked.e09,e07:checked.e07,e06:checked.e06};
  }
  let questionTrial=null;
  if(Object.hasOwn(packet,'question')){
   if(!Array.isArray(packet.question))return null;
   const source=questionSource(upstream?.e07,upstream?.e08,upstream?.e09);
   questionTrial=source&&replayQuestion(packet.question,source,e10);
   if(!questionTrial||!viewQuestion(questionTrial,source,e10)?.compared)return null;
  }
  let markerTrial=null;
  if(Object.hasOwn(packet,'marker')){
   if(!questionTrial||!Array.isArray(packet.marker))return null;
   const atlas=paperHillTraceRevisit(e10,upstream,questionTrial);
   markerTrial=atlas&&replayFutureMarker(packet.marker,atlas);
   if(!markerTrial)return null;
  }
  return {e10,e11,upstream,questionTrial,markerTrial};
 }catch{return null;}
}
