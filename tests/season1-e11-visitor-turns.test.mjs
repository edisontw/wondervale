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
assert.match(replayTurns(h).note,/PAPER Chronicle/);
const json=JSON.parse(JSON.stringify(h));
assert.deepEqual(replayTurns(json),replayTurns(h));
h=h.slice(0,-1);assert.equal(replayTurns(h).note,null);
h=dispatchTurns(h,{type:'place',visitor:'quiet-reader',slot:'first'});
assert.equal(replayTurns(h).ready,false);
assert.equal(replayTurns([]).ready,false);
for(const forged of [
 [{type:'test',rights:true}],
 [{type:'place',visitor:'real-resident',slot:'first'}],
 [{type:'place',visitor:'quiet-reader',slot:'first',canon:true}],
 [{type:'open-common'}],
 Array.from({length:33},()=>({type:'place',visitor:'quiet-reader',slot:'first'}))
])assert.throws(()=>replayTurns(forged));
console.log('E11 PAPER visitor turns replay/undo/reset/forgery PASS');
