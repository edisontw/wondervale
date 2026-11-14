// E10 -> E11 PAPER handoff. URL is untrusted; always replay the E10 history.
import {replay as replayE10} from '../authoring-labs/unnamed-story-model.mjs';
import {paperE10NeedsRevisit} from './e10-needs-revisit.mjs';
const PREFIX='#e10-paper=';
const MAX_BYTES=12000;
export function encodeE10Handoff(history) {
  const state=replayE10(history);
  if (!state || !paperE10NeedsRevisit(state)) return '';
  const json=JSON.stringify(history);
  if (json.length>MAX_BYTES || /[^\x00-\x7F]/.test(json)) return '';
  return PREFIX+btoa(json).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
export function decodeE10Handoff(fragment) {
  if (typeof fragment!=='string'||!fragment.startsWith(PREFIX)) return null;
  const value=fragment.slice(PREFIX.length);
  if (!/^[A-Za-z0-9_-]+$/.test(value)||value.length>MAX_BYTES*2) return null;
  try {
    const padded=value.replace(/-/g,'+').replace(/_/g,'/');
    const history=JSON.parse(atob(padded));
    if (!Array.isArray(history)||JSON.stringify(history).length>MAX_BYTES) return null;
    const state=replayE10(history);
    return state&&paperE10NeedsRevisit(state)?history:null;
  } catch { return null; }
}
