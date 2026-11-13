import assert from 'node:assert/strict';
import {test} from 'node:test';
import {replayLantern,lanternAction,lanternUndo} from '../e11-scene/paper-listening-lantern.mjs';
test('Milo tests, observes both friends, revises and undoes',()=>{
 let e=[];e=lanternAction(e,{type:'try'});
 assert.match(replayLantern(e).nia,/too loud/);
 e=lanternAction(e,{type:'choose',mode:'quiet'});
 assert.equal(replayLantern(e).tested,false);
 e=lanternAction(e,{type:'try'});
 assert.match(replayLantern(e).finn,/cannot see/);
 assert.match(replayLantern(e).chronicle,/quiet/);
 e=lanternUndo(e);
 assert.equal(replayLantern(e).chronicle,'');
 assert.equal(replayLantern([]).tested,false);
});
test('forged and malformed events rejected, Canon never unlocked',()=>{
 for(const e of [[{type:'openCommon'}],[{type:'try',rights:['open']}],[{type:'choose',mode:'safe'}],[{type:'choose',mode:'quiet',canonical:true}]])
 assert.throws(()=>replayLantern(e));
 const s=replayLantern([{type:'try'}]);
 assert.deepEqual(s.canonEvents,[]);assert.deepEqual(s.rights,[]);
 assert.equal(s.northHillClosed,true);assert.equal(s.commonRevealed,false);
});
