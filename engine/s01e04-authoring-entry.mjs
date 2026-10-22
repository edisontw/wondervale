// E04 authoring preview only: source validation and canonical progression are distinct.
// Do not use a caller-supplied ready flag, copied ledger IDs or draft save as an unlock.
import {e04Handoff} from './s01e04-handoff.mjs';
import {fresh,restoreDraft} from './s01e04-chronology.mjs';

export function openE04Authoring(e02Save,e03Save,pack,raw=null,mode='draft_preview') {
  const entry=e04Handoff(e02Save,e03Save);
  if (!entry.ready) return {ready:false,reason:entry.reason,sources:null,session:null};
  const session=raw===null ? fresh(pack,mode) : restoreDraft(raw,pack,mode);
  return {ready:true,reason:null,sources:entry.sources,session};
}
export function resetE04Authoring(e02Save,e03Save,pack) {
  // Reset just the E04 preview checkpoint; this module never mutates E02/E03.
  return openE04Authoring(e02Save,e03Save,pack);
}
