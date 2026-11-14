import assert from 'node:assert/strict';
import {test} from 'node:test';
import {replayTurns,turnAction,turnUndo} from '../e11-scene/paper-turn-taking.mjs';
test('Milo advances both visible turns and can undo each step',()=>{
 let h=[{type:'choose',choice:'share'},{type:'try'}];
 assert.equal(replayTurns(h).canSwitch,true);
 h=turnAction(h,{type:'switch'});
 assert.match(replayTurns(h).world,/Nia reads/);
 assert.match(replayTurns(h).chronicle,/Nia reads first/);
 h=turnAction(h,{type:'switch'});
 assert.match(replayTurns(h).world,/Finn builds/);
 assert.match(replayTurns(h).finn,/Now I can build/);
 assert.equal(replayTurns(h).canSwitch,false);
 assert.throws(()=>turnAction(h,{type:'switch'}));
 h=turnUndo(h);assert.equal(replayTurns(h).turn,1);
 h=turnUndo(h);assert.equal(replayTurns(h).turn,0);
 assert.equal(replayTurns([]).chronicle,'');
});
test('switch cannot be forged before Try or after a different plan',()=>{
 for(const h of [[{type:'switch'}],[{type:'choose',choice:'share'},{type:'switch'}],[{type:'choose',choice:'read'},{type:'try'},{type:'switch'}],[{type:'choose',choice:'share'},{type:'try'},{type:'switch',canon:true}]]) assert.throws(()=>replayTurns(h));
 const s=replayTurns([{type:'choose',choice:'share'},{type:'try'},{type:'switch'}]);
 assert.deepEqual(s.canonEvents,[]);assert.deepEqual(s.rights,[]);assert.deepEqual(s.unlocks,[]);
 assert.equal(s.northHillClosed,true);assert.equal(s.commonRevealed,false);
});
