import assert from 'node:assert/strict';
import {test} from 'node:test';
import {encodeE10Handoff,decodeE10Handoff} from '../e11-scene/e10-direct-handoff.mjs';
test('E10 direct PAPER handoff fails closed on missing, forged, oversized and incomplete events',()=>{
 assert.equal(encodeE10Handoff([]),'');
 assert.equal(decodeE10Handoff(''),null);
 assert.equal(decodeE10Handoff('#e10-paper=@@'),null);
 assert.equal(decodeE10Handoff('#e10-paper='+('A'.repeat(25000))),null);
 assert.equal(decodeE10Handoff('#e10-paper='+btoa(JSON.stringify([{type:'start'}))),null);
 assert.equal(decodeE10Handoff('#e10-paper='+btoa(JSON.stringify([{type:'finish-paper',rights:['open']}]))),null);
});
