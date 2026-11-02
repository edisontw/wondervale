import test from 'node:test';
import assert from 'node:assert/strict';
import * as E10 from '../authoring-labs/unnamed-story-model.mjs';
import * as E07 from '../e07-scene/scene-model.mjs';
import {sevenSceneUpstream} from './fixtures/season1-e04-e09-paper.mjs';
import {questionSource,freshTrial,dispatchTrial} from '../e10-scene/hill-question.mjs';
import {paperHillTraceRevisit,freshFutureMarker,dispatchFutureMarker,restoreFutureMarker} from '../e11-scene/hill-trace-revisit.mjs';
import {encodeLoopTransfer,decodeLoopTransfer} from '../authoring-labs/e10-e11-scene-transfer.mjs';
import {fresh as freshE11} from '../engine/s01e11-authoring-prototype.mjs';

function completedE10(){
 let s=E10.dispatch(E10.fresh(),{type:'start'});
 for(const a of [
  {type:'compare-symbol'},{type:'walk',to:'stone_edge'},
  {type:'inspect',traceId:'surface'},{type:'suggest',traceId:'surface',useTag:'passing'},
  {type:'revise',traceId:'surface',oldTag:'passing',newTag:'resting'},
  {type:'walk',to:'quiet_corner'},{type:'hear',needId:'quiet'},
  {type:'place',needId:'quiet',slot:'shared'},{type:'walk',to:'meeting_edge'},
  {type:'hear',needId:'activity'},{type:'place',needId:'activity',slot:'shared'},
  {type:'test-one-slot'},{type:'place',needId:'quiet',slot:'left'},
  {type:'place',needId:'activity',slot:'right'},{type:'walk',to:'notice_wall'},
  {type:'inspect',traceId:'holes'},{type:'suggest',traceId:'holes',useTag:'display'},
  {type:'check-source'},{type:'review-tradeoff'},{type:'review'},{type:'finish-paper'}
 ]){assert.equal(E10.can(s,a),true,JSON.stringify(a));s=E10.dispatch(s,a);}
 return s;
}
test('strict E10 question/trace travels to E11, with future check still NOT DONE',()=>{
 const u=sevenSceneUpstream(),e10=completedE10(),source=questionSource(u.e07,u.e08,u.e09);
 let q=freshTrial();
 for(const a of [{type:'choose',question:'identity'},
  {type:'place',anchor:'stone_edge'},{type:'compare',atE10:e10.history.length},
  {type:'place',anchor:'notice_wall'},{type:'compare',atE10:e10.history.length}])
  q=dispatchTrial(q,a,source,e10);
 const upstream={e04:u.e04,e05:u.e05,e06:u.e06,e07:u.e07,e08:u.e08,e09:u.e09};
 const frag=encodeLoopTransfer(e10,freshE11(),upstream,q);
 assert.ok(frag);
 const back=decodeLoopTransfer(frag);
 assert.deepEqual(back.questionTrial,q);
 const atlas=paperHillTraceRevisit(back.e10,back.upstream,back.questionTrial);
 assert.equal(atlas.futureStop,'source_desk');
 assert.equal(atlas.firstMarker,'notice_wall');
 assert.equal(atlas.realCheckDone,false);
 assert.deepEqual(atlas.canonicalEvents,[]);
 assert.equal(paperHillTraceRevisit(e10,null,q),null);
 assert.equal(paperHillTraceRevisit(E10.dispatch(e10,{type:'reset'}),upstream,q),null);
 assert.equal(paperHillTraceRevisit(e10,{...upstream,e07:E07.dispatch(u.e07,{scene:'nav',type:'restart'})},q),null);
 assert.equal(encodeLoopTransfer(e10,freshE11(),upstream,{...q,rights:['open']}),null);
 const forged=JSON.parse(decodeURIComponent(frag.slice('#paper-loop='.length)));
 forged.question=[{type:'choose',question:'identity',approved:true}];
 assert.equal(decodeLoopTransfer('#paper-loop='+encodeURIComponent(JSON.stringify(forged))),null);
 forged.question=q.history;forged.rights=['approved'];
 assert.equal(decodeLoopTransfer('#paper-loop='+encodeURIComponent(JSON.stringify(forged))),null);
 assert.equal(encodeLoopTransfer(e10,freshE11(),null,q),null);
});

test('E11 child marker replays across E10 round-trip, can be removed, and fails closed on upstream reset or forgery',()=>{
 const u=sevenSceneUpstream(),e10=completedE10();
 const upstream={e04:u.e04,e05:u.e05,e06:u.e06,e07:u.e07,e08:u.e08,e09:u.e09};
 const source=questionSource(u.e07,u.e08,u.e09);
 let q=freshTrial();
 for(const a of [{type:'choose',question:'identity'},{type:'place',anchor:'notice_wall'},
  {type:'compare',atE10:e10.history.length}])q=dispatchTrial(q,a,source,e10);
 const atlas=paperHillTraceRevisit(e10,upstream,q);
 assert.equal(atlas.futureStop,'source_desk');
 let marker=freshFutureMarker();
 marker=dispatchFutureMarker(marker,{type:'move',stop:'ask_caretaker'},atlas);
 marker=dispatchFutureMarker(marker,{type:'move',stop:'source_desk'},atlas);
 assert.equal(marker.stop,'source_desk');
 let fragment=encodeLoopTransfer(e10,freshE11(),upstream,q,marker);
 assert.ok(fragment);
 let restored=decodeLoopTransfer(fragment);
 assert.deepEqual(restored.markerTrial,marker);
 assert.equal(paperHillTraceRevisit(restored.e10,restored.upstream,restored.questionTrial).realCheckDone,false);
 marker=dispatchFutureMarker(restored.markerTrial,{type:'remove'},atlas);
 assert.equal(marker.stop,null);
 fragment=encodeLoopTransfer(e10,freshE11(),upstream,q,marker);
 assert.deepEqual(decodeLoopTransfer(fragment).markerTrial,marker);
 assert.equal(encodeLoopTransfer(e10,freshE11(),upstream,null,marker),null);
 assert.equal(encodeLoopTransfer(E10.dispatch(e10,{type:'reset'}),freshE11(),upstream,q,marker),null);
 assert.equal(encodeLoopTransfer(e10,freshE11(),
  {...upstream,e07:E07.dispatch(u.e07,{scene:'nav',type:'restart'})},q,marker),null);
 assert.equal(restoreFutureMarker({...marker,rights:['open']},atlas),null);
 assert.equal(dispatchFutureMarker(marker,{type:'move',stop:'real_hill'},atlas).stop,null);
 const forged=JSON.parse(decodeURIComponent(fragment.slice('#paper-loop='.length)));
 forged.marker=[{type:'move',stop:'source_desk',approved:true}];
 assert.equal(decodeLoopTransfer('#paper-loop='+encodeURIComponent(JSON.stringify(forged))),null);
 forged.marker=[{type:'move',stop:'real_hill'}];
 assert.equal(decodeLoopTransfer('#paper-loop='+encodeURIComponent(JSON.stringify(forged))),null);
 forged.marker=marker.history;delete forged.question;
 assert.equal(decodeLoopTransfer('#paper-loop='+encodeURIComponent(JSON.stringify(forged))),null);
});
