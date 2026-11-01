// E04→E11 eight-episode / nine-space PAPER provenance: actions, not historical proof.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as E04 from '../authoring-labs/arc1-memory-station-handoff-model.mjs';
import * as E05 from '../e05-scene/scene-model.mjs';
import * as E10 from '../authoring-labs/unnamed-story-model.mjs';
import * as E11 from '../engine/s01e11-authoring-prototype.mjs';
import {sevenSceneUpstream} from './fixtures/season1-e04-e09-paper.mjs';
import {encodeLoopTransfer,decodeLoopTransfer} from '../authoring-labs/e10-e11-scene-transfer.mjs';

function courtyard(){
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
 return s;
}

test('E04 UNKNOWN and E05 MOCK provenance survives E10↔E11 and E11-only restart',()=>{
 const upstream=sevenSceneUpstream(),e10=courtyard();
 let e11=E11.fresh();
 e11=E11.dispatch(e11,{type:'place',tokenId:'access',cells:['1,1','1,2']});
 e11=E11.dispatch(e11,{type:'place',tokenId:'quiet',cells:['0,1']});
 const fragment=encodeLoopTransfer(e10,e11,upstream);
 assert.match(fragment,/^#paper-loop=/);
 const decoded=decodeLoopTransfer(fragment);
 for(const name of Object.keys(upstream))assert.deepEqual(decoded.upstream[name],upstream[name],name);
 assert.deepEqual(decoded.e10,e10);
 assert.deepEqual(decoded.e11,e11);
 for(const s of [...Object.values(decoded.upstream),decoded.e10,decoded.e11]){
  for(const field of ['canonicalEvents','unlocks','rights','historicalClaims'])
   assert.deepEqual(s[field],[],field);
 }
 assert.equal(E10.view(decoded.e10).actualName,null);
 assert.equal(E10.view(decoded.e10).e11Unlocked,false);
 assert.equal(E11.projection(decoded.e11).finished,false);
 const resetE11=E11.dispatch(e11,{type:'reset'});
 const after=decodeLoopTransfer(encodeLoopTransfer(e10,resetE11,decoded.upstream));
 assert.equal(after.e11.history.length,0);
 assert.deepEqual(after.upstream.e04,upstream.e04);
 assert.deepEqual(after.upstream.e05,upstream.e05);
 assert.deepEqual(after.e10,e10);
 assert.equal(encodeLoopTransfer(E10.dispatch(e10,{type:'reset'}),e11,upstream),null);
});

test('no partial memory chain, fake dates, permissions, upstream resets or false E11 unlocks',()=>{
 const upstream=sevenSceneUpstream(),e10=courtyard(),e11=E11.fresh();
 assert.equal(encodeLoopTransfer(e10,e11,{...upstream,e05:null}),null);
 assert.equal(encodeLoopTransfer(e10,e11,{...upstream,e04:E04.fresh()}),null);
 assert.equal(encodeLoopTransfer(e10,e11,{...upstream,e05:E05.fresh()}),null);
 assert.equal(encodeLoopTransfer(e10,e11,{...upstream,e04:{...upstream.e04,rights:['yes']}}),null);
 assert.equal(encodeLoopTransfer(e10,e11,{...upstream,e05:{...upstream.e05,historicalClaims:['1920']}}),null);
 const fragment=encodeLoopTransfer(e10,e11,upstream);
 const raw=JSON.parse(decodeURIComponent(fragment.slice('#paper-loop='.length)));
 const invalid=[
  {...raw,e04:[]},{...raw,e05:[]},{...raw,e09:[]},
  {...raw,e10:[]},{...raw,e11:[{type:'grant-unlock'}]},
  {...raw,sourceYear:1920},{...raw,permissionApproved:true},
  {...raw,e04:[...raw.e04,{type:'set-real-date',year:1920}]},
  {...raw,e05:[...raw.e05,{type:'approve-source'}]},
  {...raw,e11:[{type:'add-loop-edge',edgeId:'old_north_hill_direct'}]}
 ];
 for(const packet of invalid)
  assert.equal(decodeLoopTransfer('#paper-loop='+encodeURIComponent(JSON.stringify(packet))),null);
 assert.equal(decodeLoopTransfer('#paper-loop='+'x'.repeat(200001)),null);
});
