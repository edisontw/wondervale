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

const g=(type,value)=>({scene:'garden',action:value===undefined?{type}:{type,value}});
const n=type=>({scene:'nav',type});
const c=(type,value)=>value===undefined?{scene:'care',type}:{scene:'care',type,value});
const take=(s,a)=>{assert.equal(can(s,a),true,JSON.stringify(a));return dispatch(s,a);};
let s=fresh();
for(const a of [g('start'),g('inspect','present-bed'),g('walk','slope'),g('inspect','slope'),
  g('walk','model-tray'),g('run'),g('weather','rain'),g('run'),
  g('channel','blocked'),g('run'),g('compare'),g('enter'),
  g('inspect','runoff-trace'),g('walk','public-path'),g('inspect','public-path'),
  g('walk','runoff-channel'),g('place','runoff-channel'),g('check'),
  g('walk','raised-pocket'),g('place','raised-pocket'),g('check'),
  g('think','keep-path'),g('finish'),
  c('choose','heavy'),c('test'),c('choose','gentle'),c('test'),c('compare')])s=take(s,a);
assert.equal(can(s,compare),false,'upper revisit must follow care comparison');
s=take(s,n('to-current'));
assert.equal(can(s,compare),false,'comparison cannot run from upper scene');
s=take(s,n('to-lower'));
assert.equal(can(s,compare),true);
s=take(s,compare);
assert.equal(view(s).revisitCompared,true);
assert.match(view(s).paperChronicle,/NOW is observed; POSSIBLE is a model/);
assert.equal(view(s).currentHealthy,true);
assert.equal(view(s).care.stage,'paper-sprout');
assert.equal(view(s).e07Unlocked,false);
assert.deepEqual(view(s).canonicalEvents,[]);
assert.deepEqual(replay(s.history),s);
assert.equal(can(s,compare),false,'repeated comparison cannot forge a second result');
const tampered=structuredClone(s);
tampered.history.splice(-3,1);
assert.equal(view(tampered),null,'removing the upper visit invalidates replay');
s=take(s,n('restart'));
assert.equal(view(s).revisitCompared,false);
assert.equal(view(s).care.stage,'paper-marker');

console.log('E06 revisit comparison positive path and guard: PASS');
