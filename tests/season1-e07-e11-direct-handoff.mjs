import assert from 'node:assert/strict';
import {encodeE07Handoff,decodeE07Handoff} from '../e11-scene/e07-direct-handoff.mjs';
assert.equal(encodeE07Handoff([]),'');
assert.equal(decodeE07Handoff(''),null);
assert.equal(decodeE07Handoff('#e07-paper=@@'),null);
assert.equal(decodeE07Handoff('#e07-paper='+('A'.repeat(24001))),null);
assert.equal(decodeE07Handoff('#e07-paper='+btoa(JSON.stringify([{scene:'nav',type:'restart'}]))),null);
console.log('E07-E11 invalid and unearned PAPER transfer rejection PASS');

import * as E07 from '../e07-scene/scene-model.mjs';
const a=(type,value)=>({scene:'story',action:value===undefined?{type}:{type,value}});
const w=(type,value)=>({scene:'walkthrough',type,...(value===undefined?{}:{value})});
const route=[a('start'),a('walk','shared-path'),a('inspect','shared-path'),a('walk','channel'),a('inspect','channel'),a('walk','workbench'),a('trial','milo'),a('trial','resident'),a('trial','water'),a('place','path-clear-water-blocked'),a('trial','milo'),a('trial','resident'),a('trial','water'),a('place','side-offset'),a('trial','water'),a('trial','milo'),a('trial','resident'),a('compare'),a('finish'),w('start'),w('move','crossing'),w('inspect','crossing'),w('other-start'),w('other-step'),w('other-step'),w('move','water-edge'),w('inspect','water-edge'),w('move','steps-base'),w('review')];
let state=E07.fresh();
for(const event of route){assert.equal(E07.can(state,event),true,JSON.stringify(event));state=E07.dispatch(state,event);}
const valid=encodeE07Handoff(state.history);
assert.ok(valid.startsWith('#e07-paper='));
assert.deepEqual(decodeE07Handoff(valid),state.history);
assert.equal(encodeE07Handoff(state.history.slice(0,-1)),'');
assert.equal(decodeE07Handoff(valid+'!'),null);
assert.equal(decodeE07Handoff('#e07-paper='+btoa(JSON.stringify([...state.history,{scene:'nav',type:'grant-rights'}]))),null);
console.log('E07-E11 complete child replay, reset and forgery PASS');
