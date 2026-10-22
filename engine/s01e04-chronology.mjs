// E04 authoring-only chronology engine. Synthetic sources are never canonical.
export const VERSION = 's01e04-chronology-authoring-v1';
export const DRAFT_KEY = 'wondervale-s01e04-authoring-preview-v1';
const VALID_ID = /^[a-z][a-z0-9_-]{1,39}$/;
const SLOTS = new Set(['earlier','later','uncertain']);
const KINDS = new Set(['map','photo','document']);
const MAX_ACTIONS = 250;
const clone = x => structuredClone(x);
const owns = (o,k) => Object.prototype.hasOwnProperty.call(o,k);

export function validateSourcePack(pack) {
  if (!pack || typeof pack !== 'object' || !VALID_ID.test(pack.id ?? '') ||
      !VALID_ID.test(pack.revision ?? '') || !Array.isArray(pack.cards) ||
      pack.cards.length < 2 || pack.cards.length > 8 ||
      !Array.isArray(pack.clues) || pack.clues.length < 1 || pack.clues.length > 8)
    throw new TypeError('E04 requires a versioned, bounded evidence pack');
  const used = new Set();
  for (const entry of [...pack.cards,...pack.clues]) {
    if (!entry || !VALID_ID.test(entry.id ?? '') || used.has(entry.id) ||
        typeof entry.label !== 'string' || !entry.label.trim() || entry.label.length > 140)
      throw new TypeError('Invalid evidence label or duplicate ID');
    used.add(entry.id);
  }
  if (pack.cards.some(c => !KINDS.has(c.kind)) ||
      pack.clues.some(c => typeof c.text !== 'string' || !c.text.trim() || c.text.length > 320))
    throw new TypeError('Evidence must have supported kinds and inspectable clues');
  const order = pack.relativeOrder;
  if (!order || order.earlier === order.later ||
      !pack.cards.some(c => c.id === order.earlier) ||
      !pack.cards.some(c => c.id === order.later) ||
      !pack.clues.some(c => c.id === order.basis))
    throw new TypeError('Relative order requires two different cards and a visible clue');
  return clone(pack);
}
const fingerprint = pack => JSON.stringify(validateSourcePack(pack));
export function fresh(pack, mode='draft_preview') {
  if (!['draft_preview','historical_replay'].includes(mode))
    throw new TypeError('Canonical E04 progress is not enabled');
  return {schema:1,version:VERSION,mode,packFingerprint:fingerprint(pack),
    phase:'sources',memoryViewed:[],cardViewed:[],clueViewed:[],
    slots:{},explanation:null,chronicleSeen:false,history:[]};
}
const memories = s => ['station','garden'].every(m=>s.memoryViewed.includes(m));
export function timelineSupported(s,pack) {
  const p=validateSourcePack(pack), o=p.relativeOrder;
  return s.slots[o.earlier] === 'earlier' && s.slots[o.later] === 'later' &&
    p.cards.every(c => owns(s.slots,c.id) && SLOTS.has(s.slots[c.id]) &&
      ([o.earlier,o.later].includes(c.id) || s.slots[c.id] === 'uncertain'));
}
export function dispatch(before,action,pack) {
  const p=validateSourcePack(pack);
  if (!before || before.packFingerprint !== JSON.stringify(p) ||
      !Array.isArray(before.history) || before.history.length>=MAX_ACTIONS ||
      before.phase === 'completed' || !action || typeof action.type !== 'string')
    return clone(before);
  const s=clone(before), prior=JSON.stringify(s);
  const cards=new Set(p.cards.map(c=>c.id)), clues=new Set(p.clues.map(c=>c.id));
  switch (action.type) {
    case 'inspect-memory':
      if (['station','garden'].includes(action.which) && !s.memoryViewed.includes(action.which))
        s.memoryViewed.push(action.which);
      break;
    case 'inspect-card':
      if (cards.has(action.id) && !s.cardViewed.includes(action.id)) s.cardViewed.push(action.id);
      break;
    case 'inspect-clue':
      if (clues.has(action.id) && !s.clueViewed.includes(action.id)) s.clueViewed.push(action.id);
      break;
    case 'place':
      if (cards.has(action.id) && s.cardViewed.includes(action.id) &&
          SLOTS.has(action.slot) && s.slots[action.id] !== action.slot) {
        s.slots[action.id]=action.slot; s.phase='timeline';
        s.explanation=null; s.chronicleSeen=false;
      }
      break;
    case 'explain':
      if (timelineSupported(s,p) && memories(s) &&
          s.clueViewed.includes(p.relativeOrder.basis) &&
          action.kind==='different_times' && action.basis===p.relativeOrder.basis) {
        s.explanation={kind:action.kind,basis:action.basis}; s.phase='chronicle';
      }
      break;
    case 'chronicle':
      if (s.phase==='chronicle' && s.explanation) {
        s.chronicleSeen=true; s.phase='ready_to_finish';
      }
      break;
    case 'finish':
      if (s.phase==='ready_to_finish' && s.chronicleSeen &&
          timelineSupported(s,p) && memories(s)) s.phase='completed';
      break;
  }
  if (JSON.stringify(s)!==prior) s.history.push(clone(action));
  return s;
}
export function draftPayload(s) {
  return s?.mode==='draft_preview' && Array.isArray(s.history) && s.history.length>0 ? clone(s) : null;
}
export function restoreDraft(raw,pack,mode='draft_preview') {
  const clean=fresh(pack,mode);
  if (!raw || raw.schema!==1 || raw.version!==VERSION || raw.mode!==mode ||
      raw.packFingerprint!==clean.packFingerprint || !Array.isArray(raw.history) ||
      raw.history.length>MAX_ACTIONS) return clean;
  try {
    let s=clean;
    for (const action of raw.history) {
      if (!action || !['inspect-memory','inspect-card','inspect-clue','place','explain','chronicle','finish'].includes(action.type))
        return clean;
      const next=dispatch(s,action,pack);
      if (next.history.length!==s.history.length+1) return clean;
      s=next;
    }
    return JSON.stringify(s)===JSON.stringify(raw) ? s : clean;
  } catch {return clean;}
}
export function chronicleProjection(s,pack) {
  const p=validateSourcePack(pack);
  const ok=timelineSupported(s,p) && Boolean(s.explanation) && memories(s);
  return {sourceAttribution:[
    {source:'Market coordinator',memory:'station',verified:false},
    {source:'Garden resident',memory:'garden',verified:false}],
    relativeOrder:ok ? {earlier:p.relativeOrder.earlier,later:p.relativeOrder.later} : null,
    uncertain:p.cards.filter(c=>s.slots[c.id]==='uncertain').map(c=>c.id),
    explanation:ok ? 'different_times' : null,
    complete:s.phase==='completed',
    canonicalEvents:[]};
}
