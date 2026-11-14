// E05->E11 fictional evidence handoff. Replays the original E05 child events;
// no E04 approval, real station evidence, rights, or canonical unlock is inferred.
import {earnedE05} from './e05-earned-layout-trial.mjs';
import {replayEvidence} from './paper-evidence-revision.mjs';

export function replayEarnedEvidence(e05History, e11Events = []) {
  if (!earnedE05(e05History)) return null;
  const state = replayEvidence(e11Events);
  if (!state) return null;
  return Object.freeze({
    ...state,
    source: 'E05_REPLAY_VALIDATED_PAPER',
    canonicalEvents: [],
    rights: [],
    unlocks: [],
    northHillClosed: true,
    commonRevealed: false,
    realAccessApproved: false,
  });
}
