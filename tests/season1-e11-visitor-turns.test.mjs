import assert from 'node:assert/strict';
import {replayTurns,dispatchTurns} from '../e11-scene/visitor-turns.mjs';
let h=[];
assert.equal(replayTurns(h).note,null);
assert.throws(()=>dispatchTurns(h,{type:'test'}));
h=dispatchTurns(h,{type:'place',visitor:'quiet-reader',slot:'first'});
h=dispatchTurns(h,{type:'place',visitor:'active-builder',slot:'first'});
assert.equal(replayTurns(h).ready,false);
h=dispatchTurns(h,{type:'place',visitor:'quiet-reader',slot:'second'});
assert.equal(replayTurns(h).ready,true);
h=dispatchTurns(h,{type:'test'});
assert.match(replayTurns(h).note,/Active building first, quiet reading second/);
assert.match(replayTurns(h).feedback,/Finn: The active builder goes first/);
const json=JSON.parse(JSON.stringify(h));
assert.deepEqual(replayTurns(json),replayTurns(h));
h=h.slice(0,-1);assert.equal(replayTurns(h).note,null);
h=dispatchTurns(h,{type:'place',visitor:'quiet-reader',slot:'first'});
assert.equal(replayTurns(h).ready,false);
assert.equal(replayTurns([]).ready,false);
let revised=[];
revised=dispatchTurns(revised,{type:'place',visitor:'quiet-reader',slot:'first'});
revised=dispatchTurns(revised,{type:'place',visitor:'active-builder',slot:'second'});
revised=dispatchTurns(revised,{type:'test'});
assert.match(replayTurns(revised).note,/Quiet reading first, active building second/);
assert.match(replayTurns(revised).feedback,/Nia: The quiet reader goes first/);
revised=revised.slice(0,-1);
assert.equal(replayTurns(revised).note,null);
revised=dispatchTurns(revised,{type:'place',visitor:'active-builder',slot:'first'});
revised=dispatchTurns(revised,{type:'place',visitor:'quiet-reader',slot:'second'});
revised=dispatchTurns(revised,{type:'test'});
assert.match(replayTurns(revised).note,/Active building first, quiet reading second/);
for(const forged of [
 [{type:'test',rights:true}],
 [{type:'place',visitor:'real-resident',slot:'first'}],
 [{type:'place',visitor:'quiet-reader',slot:'first',canon:true}],
 [{type:'open-common'}],
 Array.from({length:33},()=>({type:'place',visitor:'quiet-reader',slot:'first'}))
])assert.throws(()=>replayTurns(forged));
console.log('E11 PAPER visitor turns replay/undo/reset/forgery PASS');
