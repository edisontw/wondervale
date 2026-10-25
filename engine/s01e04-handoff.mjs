// Read-only cross-episode unlock contract for E04; no E04 runtime is enabled here.
// Validate the source states through their actual event-replay restorers.
// Never trust copied ledger strings, a UI flag, or a preview/replay as progress.
import {e02Ready, restore as restoreE03, EVENTS as E03_EVENTS} from './s01e03.mjs';

export const E02_KEY = 'wondervale-s01e02-progress-v1';
export const E03_KEY = 'wondervale-s01e03-progress-v1';
export const E04_KEY = 'wondervale-s01e04-progress-v1';

// Stable, attributed evidence available to E04 after canonical E03 completion.
// These are source-event IDs, not claims that one witness was incorrect.
export const E04_SOURCE_EVENTS = Object.freeze({
  station: E03_EVENTS.station,
  garden: E03_EVENTS.garden,
  marker: E03_EVENTS.glyph
});

export function e04Handoff(e02Save, e03Save) {
  if (!e02Ready(e02Save)) return {ready:false, reason:'complete-riverside-first'};
  const e03 = restoreE03(e03Save);
  if (e03.mode !== 'canonical' || e03.phase !== 'completed' ||
      !e03.chronicleSeen || e03.queue.length || e03.travel.length ||
      e03.after !== null || e03.travelEnd !== null) {
    return {ready:false, reason:'complete-market-lane-first'};
  }

  // Restore replays every legal action and rejects corrupted checkpoints.
  // The extra event check documents the exact narrative handoff contract.
  const required = Object.values(E03_EVENTS);
  if (!required.every(id => e03.ledger.includes(id) && e03.achieved.includes(id)) ||
      new Set(e03.ledger).size !== e03.ledger.length) {
    return {ready:false, reason:'market-evidence-incomplete'};
  }

  return {
    ready:true,
    reason:null,
    sources:{
      station:E04_SOURCE_EVENTS.station,
      garden:E04_SOURCE_EVENTS.garden,
      marker:E04_SOURCE_EVENTS.marker
    }
  };
}

export const e04Ready = (e02Save, e03Save) => e04Handoff(e02Save, e03Save).ready;
