import test from 'node:test';
import assert from 'node:assert/strict';
import * as E11 from '../engine/s01e11-authoring-prototype.mjs';
import * as E05 from '../e05-scene/scene-model.mjs';
import {sevenSceneUpstream} from './fixtures/season1-e04-e09-paper.mjs';
import {paperTableRetest,dispatchTableRetest} from '../e11-scene/map-room-retest.mjs';

function reviewed(){
 let s=E11.fresh();
 for(const a of [
  {type:'place',tokenId:'access',cells:['1,1','1,2']},
  {type:'place',tokenId:'quiet',cells:['0,1']},
  {type:'place',tokenId:'activity',cells:['0,2']},
  {type:'test-user',userId:'quiet_reader'},
  {type:'test-user',userId:'activity_group'},
  {type:'snapshot-trial'},
  {type:'place',tokenId:'activity',cells:['2,1']},
  {type:'test-user',userId:'quiet_reader'},
  {type:'test-user',userId:'activity_group'},
  {type:'snapshot-trial'},
  {type:'compare-trials',first:'trial-1',second:'trial-2'},
  {type:'cite-earlier',discoveryId:'e09_closure'},
  ...['square-market','market-common','common-square'].map(edgeId=>({type:'add-loop-edge',edgeId})),
  {type:'check-loop'},{type:'review-preview'}
 ])s=E11.dispatch(s,a);
 assert.equal(s.reviewed,true);
 return s;
}
test('Milo blocks PAPER path, revises table, retests and undoes the Chronicle',()=>{
 const s=reviewed(),upstream=sevenSceneUpstream();
 const steps=['garden','map_room'];
 const first=paperTableRetest(s,steps,upstream);
 assert.ok(first,'E05 strict replay earns the Map Room model');
 assert.equal(first.spot,'across-walkway');
 let h=dispatchTableRetest(s,steps,upstream,[],{type:'test'});
 assert.equal(paperTableRetest(s,steps,upstream,h).checked,false);
 h=dispatchTableRetest(s,steps,upstream,h,{type:'revise'});
 h=dispatchTableRetest(s,steps,upstream,h,{type:'place',spot:'near-wall'});
 h=dispatchTableRetest(s,steps,upstream,h,{type:'test'});
 const done=paperTableRetest(s,steps,upstream,h);
 assert.equal(done.checked,true);
 assert.match(done.feedback,/Nia/);
 assert.match(done.chronicle,/PAPER MODEL ONLY/);
 assert.deepEqual(done.canonicalEvents,[]);
 assert.equal(done.realAccessApproved,false);
 assert.equal(paperTableRetest(s,steps,upstream,h.slice(0,-1)).checked,false);
 assert.equal(paperTableRetest(s,['garden'],upstream,h),null);
 assert.equal(paperTableRetest(E11.dispatch(s,{type:'reset'}),steps,upstream,h),null);
 assert.equal(paperTableRetest(s,steps,{...upstream,e05:E05.fresh()},h),null);
 assert.equal(paperTableRetest(s,steps,{...upstream,e05:{...upstream.e05,rights:['approved']}},h),null);
 assert.equal(paperTableRetest(s,steps,upstream,[{type:'test',rights:['approved']}]),null);
 assert.equal(paperTableRetest(s,steps,upstream,[{type:'place',spot:'north_hill_closed'}]),null);
 assert.equal(paperTableRetest(s,steps,upstream,Array(13).fill({type:'test'})),null);
});
