// Fully child-earned E04-E11 PAPER fixture; never canonical or production-ready.
import assert from 'node:assert/strict';
import * as E10 from '../../authoring-labs/unnamed-story-model.mjs';
import * as E11 from '../../engine/s01e11-authoring-prototype.mjs';
import {sevenSceneUpstream} from './season1-e04-e09-paper.mjs';
import {encodeLoopTransfer} from '../../authoring-labs/e10-e11-scene-transfer.mjs';
export function paperLoopFixture(){
 let s=E10.dispatch(E10.fresh(),{type:'start'});
 for(const [type,extra] of [
  ['compare-symbol',{}],['walk',{to:'stone_edge'}],['inspect',{traceId:'surface'}],
  ['suggest',{traceId:'surface',useTag:'passing'}],
  ['revise',{traceId:'surface',oldTag:'passing',newTag:'resting'}],
  ['walk',{to:'quiet_corner'}],['hear',{needId:'quiet'}],
  ['place',{needId:'quiet',slot:'shared'}],['walk',{to:'meeting_edge'}],
  ['hear',{needId:'activity'}],['place',{needId:'activity',slot:'shared'}],
  ['test-one-slot',{}],['place',{needId:'quiet',slot:'left'}],
  ['place',{needId:'activity',slot:'right'}],['walk',{to:'notice_wall'}],
  ['inspect',{traceId:'holes'}],['suggest',{traceId:'holes',useTag:'display'}],
  ['check-source',{}],['review-tradeoff',{}],['review',{}],['finish-paper',{}]
 ]){
  const action={type,...extra};
  assert.equal(E10.can(s,action),true,JSON.stringify(action));
  s=E10.dispatch(s,action);
 }
 const fragment=encodeLoopTransfer(s,E11.fresh(),sevenSceneUpstream());
 assert.ok(fragment);
 return fragment;
}
