// Read-only, authoring-only source check before the E04 PAPER memory worktable.
// A verified E02/E03 source handoff is NOT an E04 canonical unlock or evidence approval.
import {e04Handoff,E02_KEY,E03_KEY} from '../engine/s01e04-handoff.mjs';
import {MEMORIES} from './arc1-memory-station-handoff-model.mjs';

export const PAPER_WORKTABLE='./arc1-memory-station-handoff.html';

export function paperSourceGate(e02Save,e03Save) {
  const gate=e04Handoff(e02Save,e03Save);
  const sources=gate.ready?['station','garden'].map(which=>({
    which,
    eventId:gate.sources[which],
    sourceId:MEMORIES[which].sourceId,
    speaker:MEMORIES[which].speaker,
    words:MEMORIES[which].text,
    date:'UNKNOWN'
  })):[];
  return {
    ready:gate.ready,
    reason:gate.reason,
    sources,
    sourceEligible:gate.ready,
    canonicalE04Unlocked:false,
    officialChronicle:false,
    canonicalEvents:[],
    unlocks:[],
    historicalClaims:[],
    rights:[]
  };
}

export function readPaperSourceGate(storage) {
  if(!storage||typeof storage.getItem!=='function')
    return {...paperSourceGate(null,null),reason:'storage-unavailable'};
  let e02,e03;
  try {
    const raw02=storage.getItem(E02_KEY),raw03=storage.getItem(E03_KEY);
    e02=raw02===null?null:JSON.parse(raw02);
    e03=raw03===null?null:JSON.parse(raw03);
  } catch {
    return {...paperSourceGate(null,null),reason:'checkpoint-unreadable'};
  }
  return paperSourceGate(e02,e03);
}
