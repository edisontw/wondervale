import assert from 'node:assert/strict';
import {freshFutureMarker,dispatchFutureMarker,restoreFutureMarker,paperFutureMarkerChronicle} from '../e11-scene/hill-trace-revisit.mjs';

// Synthetic PAPER-only atlas. No real site, history, permission or canonical unlock.
const atlas={futureStop:'source_desk',upperHillClosed:true,realCheckDone:false,canonicalEvents:[],unlocks:[]};
const fresh=freshFutureMarker();
assert.match(paperFutureMarkerChronicle(fresh,atlas),/FIRST.*UNKNOWN.*No real check/);
const wrong=dispatchFutureMarker(fresh,{type:'move',stop:'ask_caretaker'},atlas);
assert.match(paperFutureMarkerChronicle(wrong,atlas),/cannot answer.*revise/);
const revised=dispatchFutureMarker(wrong,{type:'move',stop:'source_desk'},atlas);
assert.match(paperFutureMarkerChronicle(revised,atlas),/moved the \?.*NOW: request an attributed source/s);
assert.match(paperFutureMarkerChronicle(revised,atlas),/NOT DONE.*CLOSED.*No real check.*Canon/);
const direct=dispatchFutureMarker(fresh,{type:'move',stop:'source_desk'},atlas);
assert.match(paperFutureMarkerChronicle(direct,atlas),/placed a future \?/);
assert.doesNotMatch(paperFutureMarkerChronicle(direct,atlas),/moved the \?/);
const removed=dispatchFutureMarker(revised,{type:'remove'},atlas);
assert.match(paperFutureMarkerChronicle(removed,atlas),/removed the \?.*UNKNOWN/);
assert.equal(paperFutureMarkerChronicle(fresh,atlas),paperFutureMarkerChronicle(freshFutureMarker(),atlas));
assert.equal(paperFutureMarkerChronicle({...revised,stop:'ask_caretaker'},atlas),null);
assert.equal(paperFutureMarkerChronicle({history:[{type:'move',stop:'real_hill'}],stop:'real_hill'},atlas),null);
assert.equal(restoreFutureMarker(revised,atlas)?.stop,'source_desk');
console.log('E11 replay-derived PAPER question Chronicle: PASS');
