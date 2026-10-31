import test from 'node:test';
import assert from 'node:assert/strict';
import * as E08 from '../e08-scene/scene-model.mjs';
import * as E09 from '../e09-scene/scene-model.mjs';
import {encodeHillTransfer,decodeHillTransfer} from '../authoring-labs/e08-e09-scene-transfer.mjs';
const a=(type,key,value)=>({scene:'story',action:key?{type,[key]:value}:{type}});
const n=type=>({scene:'nav',type});
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
  a('inspect','clueId','distant_symbol'),
  a('mark','edgeId','steps_base:signpost'),a('mark','edgeId','signpost:lower_bend'),
  a('mark','edgeId','lower_bend:overlook'),a('check-route'),
  a('compare-symbol'),a('review'),a('finish-preview')]){
  assert.equal(E09.can(s,x),true,JSON.stringify(x));s=E09.dispatch(s,x);
 }return s;
}
test('child-earned two-view model carries E08 and E09 state round-trip, with no canonical rights',()=>{
 const e08=steps(),e09=hill(),fragment=encodeHillTransfer(e08,e09);
 assert.match(fragment,/^#paper-hill=/);
 const back=decodeHillTransfer(fragment);
 assert.deepEqual(back.e08,e08);assert.deepEqual(back.e09,e09);
 assert.equal(back.e07,null);assert.equal(back.e06,null);
 assert.ok(E08.view(back.e08).story.comparison.spreadDifferenceDegrees>0);
 assert.equal(E09.view(back.e09).story.previewComplete,true);
 assert.equal(E09.view(back.e09).upperHillClosed,true);
 assert.equal(E08.view(back.e08).e09Unlocked,false);
 assert.equal(E09.view(back.e09).e10Unlocked,false);
 for(const s of [back.e08,back.e09]){
  assert.deepEqual(s.canonicalEvents,[]);assert.deepEqual(s.unlocks,[]);
  assert.deepEqual(s.rights,[]);assert.deepEqual(s.historicalClaims,[]);
 }
 const resetHill=E09.dispatch(back.e09,n('restart'));
 const returnTrip=decodeHillTransfer(encodeHillTransfer(back.e08,resetHill));
 assert.equal(E08.view(returnTrip.e08).story.previewComplete,true);
 assert.equal(E09.view(returnTrip.e09).story.stage,'opening');
 assert.equal(encodeHillTransfer(E08.fresh(),e09),null);
});
test('forged dates, source/rights, incomplete views, unknown keys and malformed fragments fail closed',()=>{
 const e08=steps(),e09=hill(),packet={v:1,e08:e08.history,e09:e09.history};
 assert.equal(decodeHillTransfer(''),null);
 assert.equal(decodeHillTransfer('#paper-hill=%bad'),null);
 assert.equal(decodeHillTransfer('#paper-hill='+'x'.repeat(60001)),null);
 assert.equal(encodeHillTransfer(E08.fresh(),e09),null);
 assert.equal(encodeHillTransfer(e08,{...e09,rights:['hill-access']}),null);
 assert.equal(encodeHillTransfer(e08,e09,null,E09.fresh()),null);
 for(const bad of [
  {...packet,v:2},{...packet,sourceYear:1910},
  {...packet,e08:[]},{...packet,e09:[{scene:'story',action:{type:'finish-preview'}}]},
  {...packet,e08:[...e08.history,{scene:'nav',type:'grant-access'}]},
  {...packet,e07:[]},{...packet,e06:[]}
 ])assert.equal(decodeHillTransfer('#paper-hill='+encodeURIComponent(JSON.stringify(bad))),null);
 const forged=structuredClone(e08);forged.story.steps.lights['lower-a']=false;
 assert.equal(encodeHillTransfer(forged,e09),null);
 const restartE08=E08.dispatch(e08,n('restart'));
 assert.equal(encodeHillTransfer(restartE08,e09),null);
});
