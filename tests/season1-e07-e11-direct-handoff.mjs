import assert from 'node:assert/strict';
import {encodeE07Handoff,decodeE07Handoff} from '../e11-scene/e07-direct-handoff.mjs';
assert.equal(encodeE07Handoff([]),'');
assert.equal(decodeE07Handoff(''),null);
assert.equal(decodeE07Handoff('#e07-paper=@@'),null);
assert.equal(decodeE07Handoff('#e07-paper='+('A'.repeat(24001))),null);
assert.equal(decodeE07Handoff('#e07-paper='+btoa(JSON.stringify([{scene:'nav',type:'restart'}]))),null);
console.log('E07-E11 invalid and unearned PAPER transfer rejection PASS');
