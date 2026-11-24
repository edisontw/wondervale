import {e04Handoff,E02_KEY,E03_KEY,E04_KEY} from './s01e04-handoff.mjs';
import {E04_COMPLETION_EVENT,verifyE04Checkpoint} from './s01e04-production-checkpoint.mjs';

export const E05_ENTRY_GATE_VERSION = 's01e05-production-entry-v2';

// A separately reviewed, repository-owned approval for the E05 public foyer.
const PUBLIC_FOYER_APPROVAL=null;

/** Read-only projection. Each check is repeated against the current saves on entry. */
export function e05ProductionHandoff(e02Save, e03Save, e04Save = null) {
  const upstream = e04Handoff(e02Save, e03Save);
  const e04Reason = upstream.ready ? verifyE04Checkpoint(e04Save) : upstream.reason;
  const e04Complete = e04Reason===null;
  const foyerApproved = PUBLIC_FOYER_APPROVAL?.scope==='public-foyer';
  const reason = e04Reason ?? (foyerApproved ? null : 'e05-foyer-access-unapproved');
  return {
    ready: reason===null,
    reason,
    e03CanonicalComplete: upstream.ready,
    e04CanonicalComplete: e04Complete,
    canonicalEvents: e04Complete ? [E04_COMPLETION_EVENT] : [],
    unlocks: reason===null ? ['s01e05'] : []
  };
}

/**
 * Recheck all three canonical saves at the moment of attempted E05 entry.
 * Drafts and URL-fragment PAPER histories are never eligible. This adapter
 * reads only; it does not persist, grant foyer access or mint episode events.
 */
export function readE05ProductionGate(storage) {
  const blocked = reason => ({
    ready:false,reason,e03CanonicalComplete:false,e04CanonicalComplete:false,
    canonicalEvents:[],unlocks:[]
  });
  try {
    if (typeof storage?.getItem !== 'function') return blocked('storage-unavailable');
    const read = key => {
      const raw=storage.getItem(key);
      return raw===null ? null : JSON.parse(raw);
    };
    return e05ProductionHandoff(read(E02_KEY),read(E03_KEY),read(E04_KEY));
  } catch {
    return blocked('checkpoint-unreadable');
  }
}
