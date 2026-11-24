import test from 'node:test';
import assert from 'node:assert/strict';
import * as E11 from '../engine/s01e11-authoring-prototype.mjs';
import * as E05 from '../e05-scene/scene-model.mjs';
import {sevenSceneUpstream} from './fixtures/season1-e04-e09-paper.mjs';
import {paperCrossingRetest,dispatchCrossingRetest} from '../e11-scene/crossing-retest.mjs';

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
test('Milo tests another traveler, revises crossing, and undoes PAPER Chronicle',()=>{
 const state=reviewed(),upstream=sevenSceneUpstream(),steps=['connector'];
 const initial=paperCrossingRetest(state,steps,upstream);
 assert.ok(initial,'strict E07 replay must earn shared crossing');
 let h=dispatchCrossingRetest(state,steps,upstream,[],{type:'test'});
 assert.equal(paperCrossingRetest(state,steps,upstream,h).passed,false);
 assert.match(paperCrossingRetest(state,steps,upstream,h).feedback,/Finn/);
 h=dispatchCrossingRetest(state,steps,upstream,h,{type:'revise'});
 h=dispatchCrossingRetest(state,steps,upstream,h,{type:'place',width:'shared'});
 h=dispatchCrossingRetest(state,steps,upstream,h,{type:'test'});
 const done=paperCrossingRetest(state,steps,upstream,h);
 assert.equal(done.passed,true);
 assert.match(done.chronicle,/PAPER CHRONICLE/);
 assert.deepEqual(done.canonicalEvents,[]);
 assert.equal(done.realAccessApproved,false);
 assert.equal(done.northHillClosed,true);
 assert.equal(paperCrossingRetest(state,steps,upstream,h.slice(0,-1)).passed,false);
 assert.equal(paperCrossingRetest(state,[],upstream,h),null);
 assert.equal(paperCrossingRetest(E11.dispatch(state,{type:'reset'}),steps,upstream,h),null);
 assert.equal(paperCrossingRetest(state,steps,{...upstream,e07:null},h),null);
 assert.equal(paperCrossingRetest(state,steps,{...upstream,e07:{...upstream.e07,rights:['approved']}},h),null);
 assert.equal(paperCrossingRetest(state,steps,upstream,[{type:'test',rights:['approved']}]),null);
 assert.equal(paperCrossingRetest(state,steps,upstream,[{type:'place',width:'north_hill'}]),null);
 assert.equal(paperCrossingRetest(state,steps,upstream,Array(13).fill({type:'test'})),null);
});
