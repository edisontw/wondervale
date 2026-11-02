import test from 'node:test';
import assert from 'node:assert/strict';
import * as E07 from '../e07-scene/scene-model.mjs';
import * as E08 from '../e08-scene/scene-model.mjs';
import * as E09 from '../e09-scene/scene-model.mjs';
import {fourFrameEvidence,placeQuestion} from '../e09-scene/field-question.mjs';

const act=(type,key,value)=>({scene:'story',action:key?{type,[key]:value}:{type}});
function steps(){
 let s=E08.fresh();
 for(const a of [act('start'),act('inspect','feature','brackets'),
  act('inspect','feature','boundary'),act('inspect','feature','lower-a'),
  act('toggle-lamp','lampId','lower-a'),act('walk','anchor','lower-landing'),
  act('inspect','feature','lower-b'),act('toggle-lamp','lampId','lower-b'),
  act('walk','anchor','base'),act('observe-view'),
  act('walk','anchor','lower-landing'),act('walk','anchor','side'),
  act('observe-view'),act('compare-views'),act('inspect','feature','service-plate'),
  act('confirm-preview')]){assert.equal(E08.can(s,a),true);s=E08.dispatch(s,a);}
 return s;
}
function connector(){
 let s=E07.fresh();
 for(const a of [act('start'),act('walk','anchor','shared-path'),
  act('inspect','anchor','shared-path'),act('walk','anchor','channel'),
  act('inspect','anchor','channel'),act('walk','anchor','workbench'),
  act('test-milo'),act('test-resident'),act('test-water'),
  act('place-piece','snapId','path-clear-water-blocked')]){
  // Use only the real E07 scene action contract in the tests below.
  if(!E07.can(s,a))break;
  s=E07.dispatch(s,a);
 }
 return s;
}
test('four-frame comparison requires BOTH replay-earned E07 and E08, not E08 alone',()=>{
 const e08=steps();
 assert.equal(fourFrameEvidence(null,e08),null);
 assert.equal(fourFrameEvidence(E07.fresh(),e08),null);
 assert.equal(fourFrameEvidence(connector(),e08),null);
 assert.equal(fourFrameEvidence(E07.fresh(),E08.fresh()),null);
 const forged=structuredClone(e08);forged.rights.push('lights-approved');
 assert.equal(fourFrameEvidence(E07.fresh(),forged),null);
});
test('unlinked or unfinished E09 cannot mark a future check',()=>{
 assert.equal(placeQuestion(null,steps(),E09.fresh(),'access','fence_view'),null);
 assert.equal(placeQuestion(E07.fresh(),steps(),E09.fresh(),'access','fence_view'),null);
 assert.equal(placeQuestion(null,null,null,'identity','overlook'),null);
});
