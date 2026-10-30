import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch,can,view,replay,restore,MAX_STEPS} from '../authoring-labs/hill-story-model.mjs';
const act=(s,type,key,value)=>dispatch(s,key?{type,[key]:value}:{type});
function survey(){
 let s=act(fresh(),'start');
 s=act(s,'inspect','clueId','entry_note');
 s=act(s,'walk','to','signpost');s=act(s,'inspect','clueId','boundary_sign');
 s=act(s,'walk','to','fence_view');s=act(s,'inspect','clueId','disturbed_ground');
 s=act(s,'walk','to','upper_closed');s=act(s,'consider','hypothesisId','water_may_change_ground');
 s=act(s,'walk','to','signpost');s=act(s,'walk','to','lower_bend');
 s=act(s,'inspect','clueId','runoff_marks');
 s=act(s,'walk','to','overlook');s=act(s,'inspect','clueId','distant_symbol');
 return s;
}
function complete(){
 let s=survey();
 for(const e of ['steps_base:signpost','lower_bend:overlook'])s=act(s,'mark','edgeId',e);
 s=act(s,'check-route');s=act(s,'mark','edgeId','signpost:lower_bend');
 s=act(s,'check-route');s=act(s,'compare-symbol');s=act(s,'review');
 return act(s,'finish-preview');
}
test('opening requires Milo start, no teleport or premature E10',()=>{
 const s=fresh();assert.equal(can(s,{type:'walk',to:'signpost'}),false);
 assert.equal(can(s,{type:'finish-preview'}),false);
 assert.equal(view(s).e10Unlocked,false);
 let a=act(s,'start');assert.equal(can(a,{type:'walk',to:'overlook'}),false);
 assert.equal(can(a,{type:'walk',to:'upper_closed'}),false);
 assert.equal(view(a).upperHillClosed,true);
});
test('closed route stops safely and parent cue appears after inspection, not before',()=>{
 let s=act(fresh(),'start');
 assert.equal(view(s).parentCue,null);
 s=act(s,'walk','to','signpost');s=act(s,'inspect','clueId','boundary_sign');
 assert.match(view(s).parentCue,/without crossing/);
 s=act(s,'walk','to','fence_view');s=act(s,'walk','to','upper_closed');
 assert.equal(view(s).position,'fence_view');assert.equal(view(s).blockedAttempts,1);
 assert.match(view(s).line,/closed/);
 s=act(s,'walk','to','signpost');assert.equal(view(s).position,'signpost');
});
test('wrong mark and gap are nonpunitive; child revises an actually walked route',()=>{
 let s=survey();assert.equal(s.hill.blockedAttempts,1);
 s=act(s,'mark','edgeId','fence_view:upper_closed');
 assert.equal(s.hill.blockedAttempts,2);
 s=act(s,'mark','edgeId','steps_base:signpost');
 s=act(s,'mark','edgeId','lower_bend:overlook');
 s=act(s,'check-route');assert.equal(view(s).routeResult.complete,false);
 assert.equal(view(s).routeResult.nextGap,'signpost:lower_bend');
 assert.equal(can(s,{type:'review'}),false);
 s=act(s,'mark','edgeId','signpost:lower_bend');s=act(s,'check-route');
 assert.equal(view(s).routeResult.complete,true);
 s=act(s,'unmark','edgeId','signpost:lower_bend');
 assert.equal(view(s).routeResult,null);
 s=act(s,'mark','edgeId','signpost:lower_bend');s=act(s,'check-route');
 assert.equal(view(s).routeResult.complete,true);
});
test('paper ending is uncertain, source-free, noncanonical, replayable and resettable',()=>{
 const s=complete(),v=view(s);
 assert.equal(v.stage,'finished');assert.equal(v.position,'overlook');
 assert.match(v.paperNote,/UNKNOWN/);assert.match(v.paperNote,/NOT UNLOCKED/);
 assert.equal(v.upperHillClosed,true);assert.equal(v.realAccessApproved,false);
 assert.equal(v.historicalDate,null);assert.equal(v.historicalCause,null);
 assert.equal(v.distantPlaceName,null);assert.equal(v.e10Unlocked,false);
 assert.deepEqual(v.canonicalEvents,[]);assert.deepEqual(v.unlocks,[]);
 assert.deepEqual(v.historicalClaims,[]);
 assert.deepEqual(replay(s.history),s);assert.deepEqual(restore(structuredClone(s)),s);
 assert.deepEqual(act(s,'walk','to','lower_bend'),s);
 assert.equal(view(dispatch(s,{type:'reset'})).stage,'opening');
});
test('strict replay rejects fake safety, year, canonical unlock, graph and injected history',()=>{
 const s=complete();
 for(const a of [{type:'walk',to:'upper_closed',safe:true},{type:'grant-unlock'},
  {type:'finish-preview',year:1920},{type:'walk',to:'hidden_bridge'}]){
  assert.deepEqual(dispatch(s,a),s);
 }
 for(const change of [x=>x.unlocks.push('e10'),x=>x.historicalClaims.push('1890'),
  x=>x.hill.position='upper_closed',x=>x.hill.provisionalFinished=false,
  x=>x.hill.markedEdges.push('fence_view:upper_closed'),
  x=>x.hill.routeResult.complete=false,x=>x.history[0].type='finish-preview',
  x=>x.canonicalEvents.push('e09.complete'),x=>x.mode='canonical']){
  const bad=structuredClone(s);change(bad);
  assert.equal(restore(bad),null);
  assert.deepEqual(dispatch(bad,{type:'finish-preview'}),fresh());
 }
 assert.equal(replay(Array(MAX_STEPS+1).fill({type:'start'})),null);
});
