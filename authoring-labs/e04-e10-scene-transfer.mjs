// E04 undated memories -> E05 MOCK sources -> E06/E07/E08 -> E09 CLOSED hill -> E10 fictional courtyard.
// Authoring-only URL histories are user-editable; replay validates actions, NOT identity, rights or access.
import * as E04 from './arc1-memory-station-handoff-model.mjs';
import * as E05 from '../e05-scene/scene-model.mjs';
import * as E06 from '../e06-scene/scene-model.mjs';
import * as E07 from '../e07-scene/scene-model.mjs';
import * as E08 from '../e08-scene/scene-model.mjs';
import * as E09 from '../e09-scene/scene-model.mjs';
import * as E10 from './unnamed-story-model.mjs';
import {encodeMemoryHill} from './e04-e09-scene-transfer.mjs';
import {encodeUnnamedTransfer} from './e09-e10-scene-transfer.mjs';

const PREFIX='#paper-memory-station-garden-shortcut-steps-hill-courtyard=';
const MAX_FRAGMENT=180000;
const names=['e04','e05','e06','e07','e08','e09','e10'];
const keys=o=>Object.keys(o).sort().join(',');
function valid(e04,e05,e06,e07,e08,e09,e10){
  if(!encodeMemoryHill(e04,e05,e06,e07,e08,e09)||
     !encodeUnnamedTransfer(e08,e09,e10,e07,e06))return false;
  const v=E10.view(e10);
  return !!(v&&!v.e11Unlocked&&!v.commonRevealed&&!v.actualName&&
    !v.realAccessApproved&&
    names.every((key,i)=>{
      const s=[e04,e05,e06,e07,e08,e09,e10][i];
      return s&&['canonicalEvents','unlocks','rights','historicalClaims']
        .every(field=>Array.isArray(s[field])&&s[field].length===0);
    }));
}
export function encodeMemoryCourtyard(e04,e05,e06,e07,e08,e09,e10){
  if(!valid(e04,e05,e06,e07,e08,e09,e10))return null;
  const states={e04,e05,e06,e07,e08,e09,e10};
  const packet={v:1};
  for(const name of names)packet[name]=states[name].history;
  const fragment=PREFIX+encodeURIComponent(JSON.stringify(packet));
  return fragment.length<=MAX_FRAGMENT?fragment:null;
}
export function decodeMemoryCourtyard(fragment){
  if(typeof fragment!=='string'||!fragment.startsWith(PREFIX)||
     fragment.length>MAX_FRAGMENT)return null;
  try{
    const p=JSON.parse(decodeURIComponent(fragment.slice(PREFIX.length)));
    if(!p||typeof p!=='object'||Array.isArray(p)||p.v!==1||
       keys(p)!=='e04,e05,e06,e07,e08,e09,e10,v'||
       !names.every(name=>Array.isArray(p[name])))return null;
    const states={
      e04:E04.replay(p.e04),e05:E05.replay(p.e05),e06:E06.replay(p.e06),
      e07:E07.replay(p.e07),e08:E08.replay(p.e08),e09:E09.replay(p.e09),
      e10:E10.replay(p.e10)
    };
    return valid(...names.map(name=>states[name]))?states:null;
  }catch{return null;}
}
