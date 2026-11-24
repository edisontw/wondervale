import test from 'node:test';
import assert from 'node:assert/strict';
import * as E10 from '../authoring-labs/unnamed-story-model.mjs';
import * as E11 from '../engine/s01e11-authoring-prototype.mjs';
import {source,check} from '../e10-scene/e11-need-recheck.mjs';
import {encodeLoopTransfer,decodeLoopTransfer} from '../authoring-labs/e10-e11-scene-transfer.mjs';
function courtyard(){
 let s=E10.dispatch(E10.fresh(),{type:'start'});
 for(const a of [
  {type:'compare-symbol'},{type:'walk',to:'stone_edge'},{type:'inspect',traceId:'surface'},
  {type:'suggest',traceId:'surface',useTag:'passing'},
  {type:'revise',traceId:'surface',oldTag:'passing',newTag:'resting'},
  {type:'walk',to:'quiet_corner'},{type:'hear',needId:'quiet'},
  {type:'place',needId:'quiet',slot:'shared'},{type:'walk',to:'meeting_edge'},
  {type:'hear',needId:'activity'},{type:'place',needId:'activity',slot:'shared'},
  {type:'test-one-slot'},{type:'place',needId:'quiet',slot:'left'},
  {type:'place',needId:'activity',slot:'right'},{type:'walk',to:'notice_wall'},
  {type:'inspect',traceId:'holes'},{type:'suggest',traceId:'holes',useTag:'display'},
  {type:'check-source'},{type:'review-tradeoff'},{type:'review'},{type:'finish-paper'}
 ])s=E10.dispatch(s,a);
 assert.equal(E10.view(s).finishedPaper,true);return s;
}
function visitors(){
 let s=E11.fresh();
 for(const a of [
  {type:'place',tokenId:'access',cells:['1,1','1,2']},
  {type:'place',tokenId:'quiet',cells:['0,1']},
  {type:'place',tokenId:'activity',cells:['2,1']},
  {type:'test-user',userId:'quiet_reader'},
  {type:'test-user',userId:'activity_group'}
 ])s=E11.dispatch(s,a);
 return s;
}
test('strictly earned E11 visitor test changes Milo E10 PAPER slot recheck',()=>{
 const e10=courtyard(),e11=visitors();
 const packet=decodeLoopTransfer(encodeLoopTransfer(e10,e11));
 assert.ok(packet);assert.ok(source(packet.e10,packet.e11));
 assert.equal(check(e10,e11,'quiet_reader','shared').matched,false);
 assert.equal(check(e10,e11,'quiet_reader','left').matched,true);
 assert.equal(check(e10,e11,'activity_group','right').matched,true);
 assert.deepEqual(check(e10,e11,'activity_group','right').canonicalEvents,[]);
 assert.equal(check(e10,e11,'activity_group','right').realAccessApproved,false);
});
test('missing visitor action, reset, forged evidence and unsafe slots fail closed',()=>{
 const e10=courtyard(),e11=visitors();
 assert.equal(source(e10,E11.fresh()),null);
 assert.equal(source(e10,E11.dispatch(e11,{type:'reset'})),null);
 assert.equal(source(E10.fresh(),e11),null);
 assert.equal(source(e10,{...e11,rights:['approved']}),null);
 assert.equal(source(e10,{...e11,tests:{quiet_reader:{passed:true},activity_group:{passed:true}}}),null);
 assert.equal(check(e10,e11,'quiet_reader','north_hill_closed'),null);
 assert.equal(check(e10,e11,'fake_role','left'),null);
 const fail=E11.dispatch(E11.dispatch(E11.fresh(),{type:'test-user',userId:'quiet_reader'}),{type:'test-user',userId:'activity_group'});
 assert.equal(check(e10,fail,'quiet_reader','left').matched,false);
 assert.match(check(e10,fail,'quiet_reader','left').message,/another PAPER trial/);
});
