import test from 'node:test';
import assert from 'node:assert/strict';
import * as E09 from '../e09-scene/scene-model.mjs';
import * as E10 from '../authoring-labs/unnamed-story-model.mjs';
import {sevenSceneUpstream} from './fixtures/season1-e04-e09-paper.mjs';
import {CARDS,groundSource,freshTrial,dispatchTrial,replayTrial,restoreTrial,viewTrial} from '../e10-scene/hill-ground-provenance.mjs';

const g=(type,clue,at)=>({scene:'ground',type,clue,at});
function earned(){
 const {e09}=sevenSceneUpstream();
 const history=[...e09.history.slice(0,-1),
  g('place','disturbed_ground','lower_bend'),
  g('place','disturbed_ground','fence_view'),
  g('place','runoff_marks','lower_bend'),
  {scene:'ground',type:'compare'},e09.history.at(-1)];
 const result=E09.replay(history);
 assert.ok(result,'actual child E09 ground placement history must replay');
 assert.equal(E09.view(result).groundBoard.compared,true);
 return result;
}
function courtyard(){
 let s=E10.dispatch(E10.fresh(),{type:'start'});
 s=E10.dispatch(s,{type:'walk',to:'stone_edge'});
 s=E10.dispatch(s,{type:'inspect',traceId:'surface'});
 s=E10.dispatch(s,{type:'walk',to:'entry'});
 s=E10.dispatch(s,{type:'walk',to:'notice_wall'});
 s=E10.dispatch(s,{type:'inspect',traceId:'holes'});
 return s;
}
const place=(s,source,e10,card,slot)=>dispatchTrial(s,{type:'place',card,slot,atE10:e10.history.length},source,e10);
test('E09 child-pinned ground is required; direct or forged snapshots cannot earn source',()=>{
 const {e09}=sevenSceneUpstream();
 assert.equal(groundSource(e09),null,'original survey did not compare child pins');
 assert.equal(groundSource(E09.dispatch(earned(),{scene:'nav',type:'restart'})),null);
 const fake=structuredClone(earned());fake.groundBoard.compared=false;
 assert.equal(groundSource(fake),null);
 const source=groundSource(earned());assert.ok(source);
 assert.equal(source.realCauseKnown,false);assert.equal(source.hillClosed,true);
 assert.deepEqual(source.canonicalEvents,[]);assert.deepEqual(source.unlocks,[]);
});
test('Milo sorts four SEEN cards by place, retries a mistaken location and leaves cause UNKNOWN',()=>{
 const source=groundSource(earned()),e10=courtyard();
 let trial=freshTrial();
 trial=place(trial,source,e10,'hill-ground','courtyard');
 trial=place(trial,source,e10,'hill-water','hill');
 trial=place(trial,source,e10,'yard-surface','courtyard');
 trial=place(trial,source,e10,'yard-holes','courtyard');
 trial=dispatchTrial(trial,{type:'compare',atE10:e10.history.length},source,e10);
 assert.equal(viewTrial(trial,source,e10).compared,false);
 assert.match(viewTrial(trial,source,e10).feedback,/Not yet/);
 trial=place(trial,source,e10,'hill-ground','hill');
 trial=dispatchTrial(trial,{type:'compare',atE10:e10.history.length},source,e10);
 const v=viewTrial(trial,source,e10);
 assert.equal(v.compared,true);assert.equal(v.placed,4);
 assert.match(v.feedback,/STILL UNKNOWN.*NOT DONE/);
 assert.equal(v.causeKnown,false);assert.equal(v.actualName,null);
 assert.deepEqual(v.canonicalEvents,[]);assert.deepEqual(v.unlocks,[]);
 assert.deepEqual(replayTrial(trial.history,source,e10),trial);
 trial=dispatchTrial(trial,{type:'remove',card:'hill-water'},source,e10);
 assert.equal(viewTrial(trial,source,e10).compared,false);
 assert.equal(viewTrial(dispatchTrial(trial,{type:'reset'},source,e10),source,e10).placed,0);
});
test('E10 trace must be inspected BEFORE a card is placed; later inspection cannot rewrite an early attempt',()=>{
 const source=groundSource(earned());
 let e10=E10.dispatch(E10.fresh(),{type:'start'}),trial=freshTrial();
 const early={type:'place',card:'yard-holes',slot:'courtyard',atE10:e10.history.length};
 assert.deepEqual(dispatchTrial(trial,early,source,e10),trial);
 e10=courtyard();
 assert.equal(replayTrial([early],source,e10),null,'strict prefix denies retroactive inspection');
 trial=place(trial,source,e10,'yard-holes','courtyard');
 assert.equal(viewTrial(trial,source,e10).now['yard-holes'],'courtyard');
 assert.equal(viewTrial(trial,source,E10.fresh()),null,'upstream E10 restart invalidates prefix');
});
test('tampered history, fake date, fake permissions and changed E09 upstream fail closed',()=>{
 const source=groundSource(earned()),e10=courtyard();
 let trial=place(freshTrial(),source,e10,'hill-ground','hill');
 for(const badAction of [
  {type:'place',card:'hill-ground',slot:'hill',atE10:e10.history.length,approved:true},
  {type:'place',card:'hill-ground',slot:'closed_hill',atE10:e10.history.length},
  {type:'place',card:'fake-source',slot:'hill',atE10:e10.history.length},
  {type:'compare',atE10:e10.history.length,year:1901}
 ])assert.deepEqual(dispatchTrial(trial,badAction,source,e10),trial);
 for(const change of [
  x=>x.compared=true,x=>x.placements['yard-holes']='courtyard',
  x=>x.history[0].slot='unknown',x=>x.sourceKey='approved-history'
 ]){
  const bad=structuredClone(trial);change(bad);
  assert.equal(restoreTrial(bad,source,e10),null);
 }
 const altered={...source,key:source.key+'other'};
 assert.equal(restoreTrial(trial,altered,e10),null);
 assert.deepEqual(dispatchTrial(trial,{type:'reset'},altered,e10),freshTrial());
 assert.equal(replayTrial(Array(37).fill({type:'remove',card:'hill-water'}),source,e10),null);
 assert.deepEqual(Object.keys(CARDS),['hill-ground','hill-water','yard-surface','yard-holes']);
});
