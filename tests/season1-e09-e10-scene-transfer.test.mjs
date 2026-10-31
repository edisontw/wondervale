import test from 'node:test';
import assert from 'node:assert/strict';
import * as E08 from '../e08-scene/scene-model.mjs';
import * as E09 from '../e09-scene/scene-model.mjs';
import * as E10 from '../authoring-labs/unnamed-story-model.mjs';
import {encodeUnnamedTransfer,decodeUnnamedTransfer} from '../authoring-labs/e09-e10-scene-transfer.mjs';
const a=(type,key,value)=>({scene:'story',action:key?{type,[key]:value}:{type}});
const act=(s,type,extra={})=>E10.dispatch(s,{type,...extra});
function steps(){
 let s=E08.fresh();
 for(const x of [a('start'),a('inspect','feature','brackets'),a('inspect','feature','boundary'),
  a('inspect','feature','lower-a'),a('toggle-lamp','lampId','lower-a'),
  a('walk','anchor','lower-landing'),a('inspect','feature','lower-b'),
  a('toggle-lamp','lampId','lower-b'),a('walk','anchor','base'),a('observe-view'),
  a('walk','anchor','lower-landing'),a('walk','anchor','side'),a('observe-view'),
  a('compare-views'),a('inspect','feature','service-plate'),a('confirm-preview')]){
  assert.equal(E08.can(s,x),true,JSON.stringify(x));s=E08.dispatch(s,x);
 }return s;
}
function hill(){
 let s=E09.fresh();
 for(const x of [a('start'),a('inspect','clueId','entry_note'),a('walk','to','signpost'),
  a('inspect','clueId','boundary_sign'),a('walk','to','fence_view'),
  a('inspect','clueId','disturbed_ground'),a('walk','to','upper_closed'),
  a('walk','to','signpost'),a('walk','to','lower_bend'),
  a('inspect','clueId','runoff_marks'),a('walk','to','overlook'),
  a('inspect','clueId','distant_symbol'),a('mark','edgeId','steps_base:signpost'),
  a('mark','edgeId','signpost:lower_bend'),a('mark','edgeId','lower_bend:overlook'),
  a('check-route'),a('compare-symbol'),a('review'),a('finish-preview')]){
  assert.equal(E09.can(s,x),true,JSON.stringify(x));s=E09.dispatch(s,x);
 }return s;
}
function courtyard(){
 let s=act(E10.fresh(),'start');
 for(const [type,extra] of [
  ['compare-symbol',{}],['walk',{to:'stone_edge'}],['inspect',{traceId:'surface'}],
  ['suggest',{traceId:'surface',useTag:'passing'}],['revise',{traceId:'surface',oldTag:'passing',newTag:'resting'}],
  ['walk',{to:'quiet_corner'}],['hear',{needId:'quiet'}],['place',{needId:'quiet',slot:'shared'}],
  ['walk',{to:'meeting_edge'}],['hear',{needId:'activity'}],['place',{needId:'activity',slot:'shared'}],
  ['test-one-slot',{}],['place',{needId:'quiet',slot:'left'}],['place',{needId:'activity',slot:'right'}],
  ['walk',{to:'notice_wall'}],['inspect',{traceId:'holes'}],
  ['suggest',{traceId:'holes',useTag:'display'}],['check-source',{}],
  ['review-tradeoff',{}],['review',{}],['finish-paper',{}]
 ]){assert.equal(E10.can(s,{type,...extra}),true,type);s=act(s,type,extra)}
 return s;
}
test('earned E08 + CLOSED E09 leads to independent E10 PAPER scene and back without unlock',()=>{
 const e08=steps(),e09=hill(),e10=courtyard();
 const fragment=encodeUnnamedTransfer(e08,e09,e10);
 assert.match(fragment,/^#paper-unnamed=/);
 const back=decodeUnnamedTransfer(fragment);
 assert.deepEqual(back.e08,e08);assert.deepEqual(back.e09,e09);assert.deepEqual(back.e10,e10);
 assert.equal(back.e07,null);assert.equal(back.e06,null);
 assert.equal(E09.view(back.e09).upperHillClosed,true);
 assert.equal(E10.view(back.e10).finishedPaper,true);
 assert.equal(E10.view(back.e10).actualName,null);
 assert.equal(E09.view(back.e09).e10Unlocked,false);
 assert.equal(E10.view(back.e10).e11Unlocked,false);
 for(const s of [back.e08,back.e09,back.e10]){
  assert.deepEqual(s.canonicalEvents,[]);assert.deepEqual(s.unlocks,[]);
  assert.deepEqual(s.historicalClaims,[]);assert.deepEqual(s.rights,[]);
 }
 const resetE10=E10.dispatch(e10,{type:'reset'});
 const returned=decodeUnnamedTransfer(encodeUnnamedTransfer(e08,e09,resetE10));
 assert.equal(E09.view(returned.e09).story.previewComplete,true);
 assert.equal(E10.view(returned.e10).stage,'opening');
 assert.equal(encodeUnnamedTransfer(e08,E09.dispatch(e09,{scene:'nav',type:'restart'}),e10),null);
});
test('unearned scenes, tampered histories, source claims and synthetic unlocks fail closed',()=>{
 const e08=steps(),e09=hill(),e10=courtyard();
 assert.equal(encodeUnnamedTransfer(E08.fresh(),e09,e10),null);
 assert.equal(encodeUnnamedTransfer(e08,E09.fresh(),e10),null);
 assert.equal(encodeUnnamedTransfer(e08,e09,{...e10,unlocks:['E11']}),null);
 assert.equal(encodeUnnamedTransfer(e08,e09,{...e10,e10:{...e10.e10,nameRevealed:true}}),null);
 assert.equal(encodeUnnamedTransfer(e08,e09,e10,null,E08.fresh()),null);
 assert.equal(decodeUnnamedTransfer('#paper-unnamed=%bad'),null);
 assert.equal(decodeUnnamedTransfer('#paper-unnamed='+'x'.repeat(100001)),null);
 const base={v:1,e08:e08.history,e09:e09.history,e10:e10.history};
 for(const bad of [
  {...base,v:2},{...base,sourceYear:1920},{...base,accessApproved:true},
  {...base,e09:[]},{...base,e08:[]},
  {...base,e10:[{type:'enable-fixture'}]},
  {...base,e10:[...e10.history,{type:'grant-unlock'}]},
  {...base,e07:[]},{...base,e06:[]}
 ])assert.equal(decodeUnnamedTransfer('#paper-unnamed='+encodeURIComponent(JSON.stringify(bad))),null);
});
