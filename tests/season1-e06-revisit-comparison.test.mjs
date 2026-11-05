import assert from 'node:assert/strict';
import {fresh,can,dispatch,view,replay} from '../e06-scene/scene-model.mjs';
const compare={scene:'nav',type:'compare-gardens'};
assert.equal(can(fresh(),compare),false);
assert.equal(view(fresh()).revisitCompared,false);
assert.equal(replay([compare]),null);
// Strict replay must never accept a forged revisit without both places and the care trial.
const forged={...fresh(),history:[compare]};
assert.equal(view(forged),null);
assert.equal(view(dispatch(fresh(),compare)).revisitCompared,false);
console.log('E06 revisit comparison guard: PASS');
