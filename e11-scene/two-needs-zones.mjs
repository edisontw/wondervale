// Independent reversible E11 PAPER model: imaginary needs, no access or safety claims.
export const NEEDS = Object.freeze(['quiet','making']);
export const ZONES = Object.freeze(['near','far']);
const allowed = e => e && typeof e === 'object' && !Array.isArray(e) &&
  (e.type === 'place' && Object.keys(e).length === 3 && NEEDS.includes(e.need) && ZONES.includes(e.zone) ||
   e.type === 'try' && Object.keys(e).length === 1);
export function replayZones(events) {
  if (!Array.isArray(events) || events.length > 32 || !events.every(allowed)) throw Error('Invalid PAPER history');
  const zones = {near:null,far:null};
  let tried = false;
  for (const e of events) {
    if (e.type === 'place') {
      for (const zone of ZONES) if (zones[zone] === e.need) zones[zone] = null;
      zones[e.zone] = e.need;
      tried = false;
    } else {
      if (!zones.near || !zones.far || zones.near === zones.far) throw Error('Place both needs before testing');
      tried = true;
    }
  }
  const ready = !!zones.near && !!zones.far && zones.near !== zones.far;
  const fits = tried && zones.near === 'making' && zones.far === 'quiet';
  return {
    zones, ready, tried, fits,
    response: !tried ? 'Nia: Place both ideas, then try.' :
      fits ? 'Nia: I can read away from the making sounds. Finn: I can build nearby!' :
      'Nia: The sounds reach my reading spot. Finn: Can we swap the spaces?',
    chronicle: fits ? 'PAPER Chronicle: Milo moved the quiet spot farther from the making spot. This is only an imaginary trial.' : null
  };
}
export function addZoneEvent(events, event) {
  if (!allowed(event)) throw Error('Invalid PAPER action');
  const next = [...events,event];
  replayZones(next);
  return next;
}
