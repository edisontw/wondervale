import assert from 'node:assert/strict';
import {traceFrames,stepTrace} from '../engine/s01e07-trace-frames.mjs';
for(const snap of ['short-crossing','side-offset','lower-offset']){
  for(const kind of ['milo','resident','water']){
    const frames=traceFrames(snap,kind);
    assert.ok(frames.length>0);
    assert.deepEqual(frames.map(f=>f.index),frames.map((_,i)=>i));
    assert.ok(frames.every(f=>f.source==='synthetic-model-only'));
    assert.equal(stepTrace(frames,-1),null);
    assert.equal(stepTrace(frames,frames.length),null);
  }
}
assert.equal(traceFrames('fake','water'),null);
assert.equal(traceFrames('side-offset','unknown'),null);
assert.ok(traceFrames('short-crossing','resident').some(f=>f.blocked));
assert.ok(traceFrames('short-crossing','water').some(f=>f.blocked));
assert.ok(traceFrames('side-offset','resident').every(f=>!f.blocked));
assert.ok(traceFrames('side-offset','water').every(f=>!f.blocked));
console.log('E07 trace frames PASS (synthetic model only)');
