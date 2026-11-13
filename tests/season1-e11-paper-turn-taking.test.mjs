import assert from 'node:assert/strict';
import {test} from 'node:test';
import {replayTurns,turnAction,turnUndo} from '../e11-scene/paper-turn-taking.mjs';
test('wrong first, revise, undo and reset',()=>{
 let h=[];h=turnAction(h,{type:'try'});assert.match(replayTurns(h).nia,/need time/);
 h=turnAction(h,{type:'choose',choice:'share'});h=turnAction(h,{type:'try'});
 assert.match(replayTurns(h).chronicle,/Both friends get a turn/);
 assert.match(replayTurns(h).world,/alternates/);
 h=turnUndo(h);assert.equal(replayTurns(h).tested,false);
 h=turnUndo(h);assert.match(replayTurns(h).nia,/need time/);
 assert.equal(replayTurns([]).chronicle,'');
});
test('strict forgery and Canon isolation',()=>{
 for(const e of [{type:'try',success:true},{type:'choose',choice:'open'},{type:'choose',choice:'share',canon:true},{type:'unlock'},{type:'try',__proto__:null,other:1},null])
  assert.throws(()=>replayTurns([e]));
 const s=replayTurns([{type:'choose',choice:'share'},{type:'try'}]);
 assert.deepEqual(s.canonEvents,[]);assert.deepEqual(s.rights,[]);
 assert.deepEqual(s.unlocks,[]);assert.equal(s.northHillClosed,true);assert.equal(s.commonRevealed,false);
 assert.throws(()=>replayTurns(Array(49).fill({type:'try'})));
});
