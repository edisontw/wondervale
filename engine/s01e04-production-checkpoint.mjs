import {MAX_ACTIONS,replayChronology} from './s01e04-chronology.mjs';

export const E04_CHECKPOINT_VERSION='s01e04-production-v1';
export const E04_COMPLETION_EVENT='episode_completed:s01e04';

// Replace only with the versioned content reviewed in the Owner source decision.
// Saves, URLs and authoring source packs cannot supply this value.
const APPROVED_SOURCE_PACK=null;
const checkpointFields=['schema','version','mode','packFingerprint','history'];
const actionFields={
  'inspect-memory':['which'],
  'inspect-card':['id'],
  'inspect-clue':['id'],
  place:['id','slot'],
  explain:['kind','basis'],
  chronicle:[],
  finish:[]
};
const hasFields=(value,fields)=>value && typeof value==='object' && !Array.isArray(value) &&
  Object.keys(value).length===fields.length && fields.every(key=>Object.hasOwn(value,key));

// This decoder can run against a test pack. Only verifyE04Checkpoint can check
// repository approval. The checkpoint stores actions, so derived flags cannot
// bypass inspection, revision, explanation or Chronicle.
export function replayE04Checkpoint(raw,pack) {
  if (!pack || !hasFields(raw,checkpointFields) ||
      raw.schema!==1 || raw.version!==E04_CHECKPOINT_VERSION || raw.mode!=='canonical' ||
      typeof raw.packFingerprint!=='string' ||
      !Array.isArray(raw.history) || raw.history.length>MAX_ACTIONS) return null;
  for (const action of raw.history) {
    if (typeof action?.type!=='string' || !Object.hasOwn(actionFields,action.type) ||
        !hasFields(action,['type',...actionFields[action.type]])) return null;
  }
  const replay=replayChronology(raw.history,pack);
  return replay && replay.packFingerprint===raw.packFingerprint ? replay : null;
}

export function verifyE04Checkpoint(raw) {
  if (!APPROVED_SOURCE_PACK) return 'e04-canonical-checkpoint-unavailable';
  if (raw==null) return 'e04-checkpoint-missing';
  const replay=replayE04Checkpoint(raw,APPROVED_SOURCE_PACK);
  if (!replay) return 'e04-checkpoint-invalid';
  return replay.phase==='completed' ? null : 'complete-e04-first';
}
