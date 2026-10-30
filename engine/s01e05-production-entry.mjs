// Fail-closed Arc 1 production boundary: E03 completion is NOT E04 completion.
// E04 currently has an authoring-only chronology, not a canonical event ledger.
// Never infer E05 production eligibility from an E04 draft, a synthetic pack,
// a finished E05 paper model, a caller-supplied flag, or a copied event array.
import {e04Handoff} from './s01e04-handoff.mjs';

export const E05_ENTRY_GATE_VERSION = 's01e05-production-entry-pending-e04-v1';

/**
 * Read-only, non-authorizing production gate.
 * The third argument is intentionally ignored: no currently available E04
 * checkpoint has a canonical replay/restore contract. A future implementation
 * must replace this guard with a verified E04 event replay and dedicated tests
 * before it can ever return ready:true.
 */
export function e05ProductionHandoff(e02Save, e03Save, _e04Candidate = null) {
  const upstream = e04Handoff(e02Save, e03Save);
  if (!upstream.ready) {
    return {
      ready: false,
      reason: upstream.reason,
      e03CanonicalComplete: false,
      e04CanonicalComplete: false,
      canonicalEvents: [],
      unlocks: []
    };
  }
  return {
    ready: false,
    reason: 'e04-canonical-checkpoint-unavailable',
    e03CanonicalComplete: true,
    e04CanonicalComplete: false,
    canonicalEvents: [],
    unlocks: []
  };
}
