// Independent E11 PAPER rehearsal. Synthetic visitors; no Canon, rights, access or Common opening.
export const VISITORS = Object.freeze(['quiet-reader','active-builder']);
export const SLOTS = Object.freeze(['first','second']);
const MAX_EVENTS = 32;
const valid = e => e && typeof e === 'object' && !Array.isArray(e) &&
  Object.keys(e).every(k => ['type','visitor','slot'].includes(k)) &&
  (e.type === 'place' ? Object.keys(e).length === 3 && VISITORS.includes(e.visitor) && SLOTS.includes(e.slot)
    : e.type === 'test' && Object.keys(e).length === 1);
export function replayTurns(events) {
  if (!Array.isArray(events) || events.length > MAX_EVENTS || !events.every(valid)) throw Error('Invalid PAPER events');
  const places = {first:null,second:null};
  let checked = false;
  for (const e of events) {
    if (e.type === 'place') {
      // A visitor cannot occupy two times; choosing again moves that visitor.
      for (const slot of SLOTS) if (places[slot] === e.visitor) places[slot] = null;
      places[e.slot] = e.visitor;
      checked = false;
    } else {
      if (!places.first || !places.second || places.first === places.second) throw Error('Test requires two distinct visitors');
      checked = true;
    }
  }
  const conflict = places.first && places.second && places.first === places.second;
  return {
    places, checked, ready:!!places.first && !!places.second && !conflict,
    feedback: checked ? (places.first === 'quiet-reader' ?
      'Nia: The quiet reader goes first. Finn: I will set up after the reading turn.' :
      'Finn: The active builder goes first. Nia: We will leave a quiet turn afterward.') :
      'Nia: Who goes first? Finn: Try a different order.',
    note: checked ? (places.first === 'quiet-reader' ?
      'PAPER Chronicle: Quiet reading first, active building second. No real place or permission changed.' :
      'PAPER Chronicle: Active building first, quiet reading second. No real place or permission changed.') : null
  };
}
export function dispatchTurns(events, event) {
  if (!valid(event)) throw Error('Invalid PAPER action');
  const next = [...events,event];
  replayTurns(next);
  return next;
}
