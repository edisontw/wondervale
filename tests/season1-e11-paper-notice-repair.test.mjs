import test from 'node:test';
import assert from 'node:assert/strict';
import {replayNotice,dispatchNotice,undoNotice} from '../e11-scene/paper-notice-repair.mjs';
const actions=[
 {type:'place',piece:'can',slot:0},
 {type:'place',piece:'we',slot:1},
 {type:'place',piece:'listen',slot:2},
 {type:'read'},
 {type:'place',piece:'we',slot:0},
 {type:'place',piece:'can',slot:1},
 {type:'read'}
];
test('child repairs fictional notice after wrong-first reading',()=>{
 let events=[];
 for(const a of actions) events=dispatchNotice(events,a);
 const state=replayNotice(events);
 assert.equal(state.restored,true);
 assert.equal(state.visibleNotice,'WE CAN LISTEN');
 assert.match(state.response,/Nia/);
 assert.match(state.chronicle,/PAPER/);
 assert.deepEqual(state.canonicalEvents,[]);
 assert.deepEqual(state.rights,[]);
 assert.equal(state.commonRevealed,false);
 assert.equal(state.northHillClosed,true);
 assert.equal(replayNotice(actions.slice(0,4)).restored,false);
 assert.equal(replayNotice(undoNotice(events)).restored,false);
 assert.deepEqual(replayNotice([]).slots,[null,null,null]);
});
test('reject forged and incomplete actions',()=>{
 for(const bad of [[{type:'read'}],[{type:'place',piece:'invented',slot:0}],
  [{type:'place',piece:'we',slot:0,approved:true}],[{type:'place',piece:'we',slot:9}],
  Array(33).fill({type:'place',piece:'we',slot:0})])
   assert.throws(()=>replayNotice(bad));
});
