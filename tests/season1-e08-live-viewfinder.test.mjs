import test from 'node:test';
import assert from 'node:assert/strict';
import {viewfinderFrame} from '../e08-scene/live-viewfinder.mjs';
import {MARKERS} from '../engine/s01e08-authoring-prototype.mjs';
const off={'lower-a':false,'lower-b':false};
const on={'lower-a':true,'lower-b':true};
test('no sightline evidence until both PAPER lamps are on',()=>{
 assert.equal(viewfinderFrame('base',off).marks.length,0);
 assert.equal(viewfinderFrame('base',{'lower-a':true,'lower-b':false}).lit,false);
 assert.equal(viewfinderFrame('base',on).lit,true);
 assert.equal(viewfinderFrame('upper-closed',on),null);
 assert.equal(viewfinderFrame('base',{'lower-a':true,'lower-b':true,upper:true}),null);
});
test('Milo moves: fixed marks align at base and separate at side',()=>{
 const before=structuredClone(MARKERS);
 const base=viewfinderFrame('base',on),landing=viewfinderFrame('lower-landing',on),
  side=viewfinderFrame('side',on);
 assert.deepEqual(base.marks.map(m=>m.mark),['A','B','C']);
 assert.ok(base.marks.every(m=>m.x===base.marks[0].x));
 assert.ok(landing.spreadDegrees>base.spreadDegrees);
 assert.ok(side.spreadDegrees>landing.spreadDegrees);
 assert.ok(Math.max(...side.marks.map(m=>m.x))-Math.min(...side.marks.map(m=>m.x))>100);
 assert.deepEqual(viewfinderFrame('base',on),base);
 assert.deepEqual(MARKERS,before);
 assert.match(side.label,/Synthetic sightlines/);
 assert.doesNotMatch(side.label,/approved|restored|unlocked/i);
});
