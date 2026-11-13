// Independent E11 PAPER notice repair. Fictional text, not a historical source or Common identity.
export const PIECES = Object.freeze(['we','can','listen']);
const valid = e => e && typeof e === 'object' && !Array.isArray(e) &&
  (e.type === 'place' && Object.keys(e).length === 3 && PIECES.includes(e.piece) &&
   Number.isInteger(e.slot) && e.slot >= 0 && e.slot < 3 ||
   e.type === 'read' && Object.keys(e).length === 1);
export function replayNotice(events) {
  if (!Array.isArray(events) || events.length > 32 || !events.every(valid))
    throw Error('Invalid PAPER notice history');
  const slots = [null,null,null];
  let read = false;
  for (const event of events) {
    if (event.type === 'place') {
      for (let i=0;i<3;i++) if (slots[i]===event.piece) slots[i]=null;
      slots[event.slot]=event.piece;
      read=false;
    } else {
      if (slots.some(x=>x===null)) throw Error('Place three pieces before reading');
      read=true;
    }
  }
  const restored = read && slots.every((p,i)=>p===PIECES[i]);
  return {
    slots,read,restored,
    response: !read ? 'Nia: Put the pieces together. Then read.' :
      restored ? 'Nia: Now I can read it! Finn: We can listen to each other.' :
      'Nia: These words sound mixed up. Finn: Let us move a piece and try again.',
    visibleNotice: restored ? 'WE CAN LISTEN' : null,
    chronicle: restored ? 'PAPER Chronicle: Milo repaired an imaginary message. It is not a source about the Common.' : null,
    canonicalEvents:[],rights:[],unlocks:[],northHillClosed:true,commonRevealed:false
  };
}
export function dispatchNotice(events,event) {
  if (!valid(event)) throw Error('Invalid PAPER action');
  const next=[...events,event];
  replayNotice(next);
  return next;
}
export function undoNotice(events) {
  if (!Array.isArray(events)) throw Error('Invalid PAPER history');
  replayNotice(events);
  return events.slice(0,-1);
}
