import test from 'node:test';
import assert from 'node:assert/strict';
import * as E08 from '../e08-scene/scene-model.mjs';
import * as E09 from '../e09-scene/scene-model.mjs';
import {clueSource,freshTrial,replayTrial,restoreTrial,canTrial,dispatchTrial,viewTrial} from '../e10-scene/clue-transfer.mjs';
const a=(type,key,value)=>({scene:'story',action:key?{type,[key]:value}:{type}});
function earnedSteps(){
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
function earnedHill(){
 let s=E09.fresh();
 for(const x of [a('start'),a('inspect','clueId','entry_note'),
  a('walk','to','signpost'),a('inspect','clueId','boundary_sign'),
  a('walk','to','fence_view'),a('inspect','clueId','disturbed_ground'),
  a('walk','to','upper_closed'),a('walk','to','signpost'),
  a('walk','to','lower_bend'),a('inspect','clueId','runoff_marks'),
  a('walk','to','overlook'),a('inspect','clueId','distant_symbol'),
  a('mark','edgeId','steps_base:signpost'),
  a('mark','edgeId','signpost:lower_bend'),
  a('mark','edgeId','lower_bend:overlook'),a('check-route'),
  a('compare-symbol'),a('review'),a('finish-preview')]){
  assert.equal(E09.can(s,x),true,JSON.stringify(x));s=E09.dispatch(s,x);
 }return s;
}
test('E08 two-view marks transfer into E10 only with strict E09 CLOSED survey',()=>{
 const e08=earnedSteps(),e09=earnedHill(),source=clueSource(e08,e09);
 assert.ok(source);
 assert.deepEqual(source.markers.map(x=>x.id),['mark-a','mark-b','mark-c']);
 assert.notEqual(source.first.viewpoint,source.second.viewpoint);
 assert.notEqual(source.first.spreadDegrees,source.second.spreadDegrees);
 assert.equal(source.upperHillClosed,true);
 assert.equal(source.realLightsOn,false);
 assert.equal(source.realAccessApproved,false);
 assert.equal(source.historicalDate,null);
 assert.equal(source.placeName,null);
 assert.deepEqual(source.canonicalEvents,[]);
 assert.deepEqual(source.unlocks,[]);
 assert.deepEqual(source.rights,[]);
 assert.deepEqual(clueSource(E08.replay(e08.history),E09.replay(e09.history)),source);
 assert.equal(clueSource(null,e09),null);
 assert.equal(clueSource(E08.fresh(),e09),null);
 assert.equal(clueSource(e08,E09.fresh()),null);
 assert.equal(clueSource(E08.dispatch(e08,{scene:'nav',type:'restart'}),e09),null);
 assert.equal(clueSource(e08,E09.dispatch(e09,{scene:'nav',type:'restart'})),null);
 const forged=structuredClone(e08);forged.rights.push('real-lights');
 assert.equal(clueSource(forged,e09),null);
 const fakeHill=structuredClone(e09);fakeHill.story.hill.inspected.push('invented-date');
 assert.equal(clueSource(e08,fakeHill),null);
});
test('Milo traces both views, tries too soon, revises without penalty and earns PAPER note',()=>{
 let s=freshTrial();
 assert.equal(viewTrial(s).compared,false);
 s=dispatchTrial(s,{type:'compare'});
 assert.match(viewTrial(s).feedback,/Not yet/);
 for(const id of ['mark-a','mark-b','mark-c']){
  assert.equal(canTrial(s,{type:'pin',markerId:id}),true);
  s=dispatchTrial(s,{type:'pin',markerId:id});
 }
 assert.equal(viewTrial(s).firstCount,3);
 s=dispatchTrial(s,{type:'switch',to:'second'});
 s=dispatchTrial(s,{type:'pin',markerId:'mark-a'});
 s=dispatchTrial(s,{type:'compare'});
 assert.equal(viewTrial(s).compared,false);
 for(const id of ['mark-b','mark-c'])s=dispatchTrial(s,{type:'pin',markerId:id});
 s=dispatchTrial(s,{type:'compare'});
 assert.equal(viewTrial(s).compared,true);
 assert.match(viewTrial(s).paperNote,/PAPER Chronicle/);
 assert.deepEqual(replayTrial(s.history),s);
 assert.deepEqual(restoreTrial(s),s);
 s=dispatchTrial(s,{type:'unpin',markerId:'mark-c'});
 assert.equal(viewTrial(s).compared,false);
 s=dispatchTrial(s,{type:'pin',markerId:'mark-c'});
 s=dispatchTrial(s,{type:'compare'});
 assert.equal(viewTrial(s).compared,true);
 assert.deepEqual(dispatchTrial(s,{type:'reset'}),freshTrial());
});
test('forged child trials and invalid marks fail closed without external unlock',()=>{
 const s=freshTrial();
 assert.equal(replayTrial([{type:'grant-access'}]),null);
 assert.equal(replayTrial([{type:'pin',markerId:'mark-z'}]),null);
 assert.equal(replayTrial([{type:'reset'}]),null);
 assert.equal(canTrial(s,{type:'pin',markerId:'mark-z'}),false);
 assert.equal(canTrial(s,{type:'pin',markerId:'mark-a',historicalDate:1920}),false);
 assert.equal(canTrial(s,{type:'switch',to:'upper-hill'}),false);
 assert.equal(restoreTrial({...s,compared:true}),null);
 assert.deepEqual(dispatchTrial(s,{type:'pin',markerId:'mark-z'}),s);
 assert.deepEqual(dispatchTrial(s,{type:'pin',markerId:'mark-a',rights:['hill']}),s);
});
