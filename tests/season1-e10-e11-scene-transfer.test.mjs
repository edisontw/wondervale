import test from 'node:test';
import assert from 'node:assert/strict';
import * as E10 from '../authoring-labs/unnamed-story-model.mjs';
import * as E11 from '../engine/s01e11-authoring-prototype.mjs';
import {encodeLoopTransfer,decodeLoopTransfer} from '../authoring-labs/e10-e11-scene-transfer.mjs';
const act=(s,type,extra={})=>E10.dispatch(s,{type,...extra});
function courtyard(){
 let s=act(E10.fresh(),'start');
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
 ]){assert.equal(E10.can(s,{type,...extra}),true,type);s=act(s,type,extra);}
 return s;
}
test('E10 earned notes and E11 independent trial survive a reversible PAPER visit',()=>{
 const e10=courtyard();
 let e11=E11.fresh();
 e11=E11.dispatch(e11,{type:'place',tokenId:'access',cells:['1,1','1,2']});
 e11=E11.dispatch(e11,{type:'place',tokenId:'quiet',cells:['0,1']});
 const fragment=encodeLoopTransfer(e10,e11);
 assert.match(fragment,/^#paper-loop=/);
 const back=decodeLoopTransfer(fragment);
 assert.deepEqual(back.e10,e10);assert.deepEqual(back.e11,e11);
 assert.equal(back.upstream,null);
 assert.equal(E10.view(back.e10).finishedPaper,true);
 assert.equal(E10.view(back.e10).e11Unlocked,false);
 assert.deepEqual(E11.projection(back.e11).canonicalEvents,[]);
 assert.deepEqual(E11.projection(back.e11).unlocks,[]);
 assert.equal(E11.projection(back.e11).finished,false);
 const restarted=E11.dispatch(e11,{type:'reset'});
 const roundTrip=decodeLoopTransfer(encodeLoopTransfer(e10,restarted));
 assert.equal(roundTrip.e11.history.length,0);
 assert.equal(E10.view(roundTrip.e10).finishedPaper,true);
 assert.equal(encodeLoopTransfer(E10.fresh(),e11),null);
 assert.equal(encodeLoopTransfer(E10.dispatch(e10,{type:'reset'}),e11),null);
});
test('reject forged rights, source, Common, invalid upstream and tampered replay',()=>{
 const e10=courtyard(),e11=E11.fresh();
 for(const bad of [
  {...e10,unlocks:['E11']},{...e10,rights:['approved']},
  {...e10,e10:{...e10.e10,nameRevealed:true}}
 ])assert.equal(encodeLoopTransfer(bad,e11),null);
 assert.equal(encodeLoopTransfer(e10,{...e11,finished:true}),null);
 assert.equal(encodeLoopTransfer(e10,{...e11,rights:['approved']}),null);
 assert.equal(encodeLoopTransfer(e10,e11,{e08:{},e09:{}}),null);
 assert.equal(decodeLoopTransfer('#paper-loop=%bad'),null);
 assert.equal(decodeLoopTransfer('#paper-loop='+'x'.repeat(100001)),null);
 const base={v:1,e10:e10.history,e11:e11.history};
 for(const bad of [
  {...base,v:2},{...base,sourceYear:1920},{...base,permissionApproved:true},
  {...base,e10:[]},{...base,e11:[{type:'review-preview'}]},
  {...base,e11:[{type:'add-loop-edge',edgeId:'old_north_hill_direct'}]},
  {...base,e08:[]},{...base,e09:[]},
  {...base,e11:[{type:'grant-unlock'}]}
 ])assert.equal(decodeLoopTransfer('#paper-loop='+encodeURIComponent(JSON.stringify(bad))),null);
});
