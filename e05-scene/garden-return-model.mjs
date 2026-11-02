// E05 Map Room return after child-earned E06 observations. Authoring PAPER only.
// Neither model implies a real path, garden relocation cause, rights or unlock.
import * as E05 from './scene-model.mjs';
import * as E06 from '../e06-scene/scene-model.mjs';

export const MAX_RETURN_ACTIONS=20;
const TYPES=new Set(['inspect-current','inspect-lower','try-solid','mark-question','compare','erase']);
function evidence(e05,e06){
  const station=E05.restore(e05),garden=E06.restore(e06);
  if(!station||!garden)return null;
  const a=E05.view(station),b=E06.view(garden);
  if(a?.stage!=='review'||!a.mapRoomPaperVisible||!a.gardenMap.question||
     a.e06Unlocked!==false||b?.productionEntryReady!==false||
     !b.currentCompared||!b.lowerPaperStarted||
     !b.garden.observedLower.includes('runoff-trace')||
     !b.garden.observedLower.includes('public-path')||
     b.e07Unlocked!==false||b.northHillClosed!==true||
     station.canonicalEvents.length||station.unlocks.length||station.rights.length||
     garden.canonicalEvents.length||garden.unlocks.length||garden.rights.length)return null;
  return {currentObservation:'MODEL rain/channel compared in Current Garden',
    lowerObservation:'PAPER runoff trace and public path inspected in Lower Garden',
    growth:b.lowerGrowthVisible?'PAPER seed-care comparison recorded':'No PAPER growth trial confirmed'};
}
export function replay(history,e05,e06){
  if(!evidence(e05,e06)||!Array.isArray(history)||history.length>MAX_RETURN_ACTIONS)return null;
  const s={current:false,lower:false,annotation:'none',compared:false,attemptedSolid:false};
  for(const type of history){
    if(typeof type!=='string'||!TYPES.has(type))return null;
    if(type==='inspect-current'){
      if(s.current)return null;s.current=true;
    }else if(type==='inspect-lower'){
      if(s.lower)return null;s.lower=true;
    }else if(type==='try-solid'){
      if(!s.current||!s.lower||s.annotation==='unsupported')return null;
      s.annotation='unsupported';s.attemptedSolid=true;s.compared=false;
    }else if(type==='mark-question'){
      if(!s.current||!s.lower||s.annotation==='question')return null;
      s.annotation='question';s.compared=false;
    }else if(type==='erase'){
      if(s.annotation==='none')return null;s.annotation='none';s.compared=false;
    }else if(type==='compare'){
      if(s.annotation!=='question'||s.compared)return null;s.compared=true;
    }
  }
  return s;
}
export function can(history,type,e05,e06){
  return typeof type==='string'&&TYPES.has(type)&&Array.isArray(history)&&
    replay([...history,type],e05,e06)!==null;
}
export function dispatch(history,type,e05,e06){
  return can(history,type,e05,e06)?[...history,type]:history;
}
export function view(history,e05,e06){
  const source=evidence(e05,e06);
  if(!source)return {eligible:false,reason:'Return after E05 PAPER Map Room and E06 child-inspected Current/Lower Garden models.'};
  const s=replay(history,e05,e06);
  if(!s)return {eligible:false,reason:'The PAPER return history no longer matches the two source models.'};
  const feedback=s.compared?
    'Milo: I can keep a QUESTION on our PAPER map. We have not found a real road or the reason for the garden change.':
    s.annotation==='unsupported'?
      'Nia: A solid road needs real ground and access evidence. We have not checked that. Try a question mark.':
    s.annotation==='question'?
      'Finn: The dotted question is not a path. Compare what we saw and what we still do not know.':
      'Milo: These are two separate PAPER observations. What can our map honestly show?';
  return {eligible:true,...s,...source,feedback,
    first:'BEFORE: two separate PAPER garden marks; no verified link',
    now:s.annotation==='question'?'NOW: dotted QUESTION only · NO ROAD':
      s.annotation==='unsupported'?'TRIAL: solid road NOT SUPPORTED':'NOW: no link marked',
    paperChronicle:s.compared?
      'PAPER MAP ROOM: Milo compared Current Garden model water with Lower Garden observed-model path and runoff, then marked an UNKNOWN connection as a question, not a road. Date, actual access, route, garden-move cause and permission remain UNKNOWN.':null,
    canonicalEvents:[],unlocks:[],rights:[],historicalClaims:[]};
}
