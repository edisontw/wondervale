// E10 child-revised possible-use PAPER cutouts carried into E11 as read-only evidence.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as E10 from '../authoring-labs/unnamed-story-model.mjs';
import * as E11 from '../engine/s01e11-authoring-prototype.mjs';
import {freshTrial,dispatchTrial,viewTrial} from '../e10-scene/use-staging.mjs';
import {paperE10UseRevisit} from '../e11-scene/e10-use-revisit.mjs';
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
function revisedTrial(s){
 let t=freshTrial();
 for(const action of [
  {type:'place',prop:'seat',anchor:'stone_edge'},
  {type:'place',prop:'notice',anchor:'stone_edge'},
  {type:'compare'},
  {type:'place',prop:'notice',anchor:'notice_wall'},
  {type:'compare'}
 ])t=dispatchTrial(t,action,s);
 assert.equal(viewTrial(t,s).revised,true);
 return t;
}
const pack=(o)=>'#paper-loop='+encodeURIComponent(JSON.stringify(o));
test('child-earned FIRST overlap / NOW revision survives E10-E11-E10 PAPER return',()=>{
 const e10=courtyard(),t=revisedTrial(e10),e11=E11.fresh();
 const atlas=paperE10UseRevisit(e10,t);
 assert.equal(atlas.first[0].anchor,atlas.first[1].anchor);
 assert.notEqual(atlas.now[0].anchor,atlas.now[1].anchor);
 assert.match(atlas.paperNote,/UNKNOWN/);
 assert.deepEqual(atlas.canonicalEvents,[]);assert.deepEqual(atlas.unlocks,[]);
 assert.deepEqual(atlas.historicalClaims,[]);
 const fragment=encodeLoopTransfer(e10,e11,null,null,null,t);
 assert.ok(fragment?.startsWith('#paper-loop='));
 const back=decodeLoopTransfer(fragment);
 assert.deepEqual(back.useTrial,t);
 assert.deepEqual(back.e10,e10);
 assert.equal(back.e11.history.length,0);
 assert.equal(E10.view(back.e10).e11Unlocked,false);
 assert.deepEqual(paperE10UseRevisit(back.e10,back.useTrial),atlas);
 assert.deepEqual(decodeLoopTransfer(encodeLoopTransfer(back.e10,back.e11,null,null,null,back.useTrial)).useTrial,t);
 const resetE11=E11.dispatch(e11,{type:'reset'});
 assert.ok(decodeLoopTransfer(encodeLoopTransfer(e10,resetE11,null,null,null,t)).useTrial);
 assert.equal(encodeLoopTransfer(act(e10,'reset'),e11,null,null,null,t),null);
 assert.equal(paperE10UseRevisit(E10.fresh(),t),null);
});
test('incomplete, removed, stale and forged cutout histories never import an E11 fact',()=>{
 const e10=courtyard(),e11=E11.fresh(),t=revisedTrial(e10);
 let unfinished=freshTrial();
 unfinished=dispatchTrial(unfinished,{type:'place',prop:'seat',anchor:'stone_edge'},e10);
 assert.equal(encodeLoopTransfer(e10,e11,null,null,null,unfinished),null);
 const forged={...t,rights:['approved']};
 assert.equal(encodeLoopTransfer(e10,e11,null,null,null,forged),null);
 assert.equal(encodeLoopTransfer(e10,e11,null,null,null,{...t,sourceKey:'fake'}),null);
 const packet=JSON.parse(decodeURIComponent(encodeLoopTransfer(e10,e11,null,null,null,t).slice('#paper-loop='.length)));
 for(const history of [
  [{type:'place',prop:'seat',anchor:'closed_hill'}],
  [{type:'place',prop:'seat',anchor:'stone_edge',permissionApproved:true}],
  [...packet.useStage,{type:'grant-unlock'}],
  [{type:'compare'}],
  [],
  'not an array'
 ])assert.equal(decodeLoopTransfer(pack({...packet,useStage:history})),null);
 assert.equal(decodeLoopTransfer(pack({...packet,useStage:packet.useStage,approved:true})),null);
 assert.equal(decodeLoopTransfer(pack({...packet,e10:[]})),null);
 assert.equal(decodeLoopTransfer(pack({...packet,useStage:undefined})).useTrial,null);
 const removed=dispatchTrial(t,{type:'remove',prop:'seat'},e10);
 assert.equal(paperE10UseRevisit(e10,removed),null);
});
