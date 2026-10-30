// E11 child-driven noncanonical PAPER story: strict replay, actual revision, no release.
import test from 'node:test';
import assert from 'node:assert/strict';
import {VERSION,MAX_STEPS,fresh,dispatch,can,replay,restore,view} from '../authoring-labs/loop-story-model.mjs';
const go=(s,type,x={})=>dispatch(s,{type,...x});
function done(){
 let s=go(fresh(),'start');
 s=go(s,'move-milo',{to:'1,1'});s=go(s,'move-milo',{to:'1,0'});
 s=go(s,'place',{tokenId:'access',cells:['1,1','1,2']});
 s=go(s,'place',{tokenId:'quiet',cells:['0,1']});
 s=go(s,'place',{tokenId:'activity',cells:['0,2']});
 s=go(s,'test-user',{userId:'quiet_reader'});
 s=go(s,'test-user',{userId:'activity_group'});
 s=go(s,'snapshot-trial');
 s=go(s,'place',{tokenId:'activity',cells:['2,1']});
 s=go(s,'test-user',{userId:'quiet_reader'});
 s=go(s,'test-user',{userId:'activity_group'});
 s=go(s,'snapshot-trial');
 s=go(s,'compare-trials',{first:'trial-1',second:'trial-2'});
 s=go(s,'cite-earlier',{discoveryId:'e09_closure'});
 for(const edgeId of ['square-market','market-common','common-square'])s=go(s,'add-loop-edge',{edgeId});
 s=go(s,'check-loop');s=go(s,'review-preview');
 return go(s,'finish-paper');
}
test('fresh E11 is explicitly noncanonical and requires child start',()=>{
 const s=fresh(),v=view(s);
 assert.equal(s.version,VERSION);assert.equal(v.stage,'opening');
 assert.equal(v.commonOpen,false);assert.equal(v.northHillClosed,true);
 assert.equal(v.seasonFinished,false);assert.deepEqual(v.canonicalEvents,[]);
 assert.deepEqual(v.unlocks,[]);assert.deepEqual(v.rights,[]);
 assert.equal(can(s,{type:'finish-paper'}),false);
 assert.deepEqual(go(s,'place',{tokenId:'quiet',cells:['0,1']}),s);
});
test('Milo walks a real model step and safely stops at blocked paper cells',()=>{
 let s=go(fresh(),'start');s=go(s,'move-milo',{to:'1,1'});
 assert.equal(view(s).walked,1);
 s=go(s,'move-milo',{to:'1,0'});
 s=go(s,'place',{tokenId:'activity',cells:['1,1']});
 s=go(s,'move-milo',{to:'1,1'});
 assert.equal(view(s).position,'1,0');
 assert.match(view(s).line,/stop safely/);
 assert.equal(view(s).walked,2);
 assert.equal(can(s,{type:'move-milo',to:'0,3'}),false);
});
test('first conflict and actual revision precede final paper note',()=>{
 const s=done(),v=view(s);
 assert.equal(v.stage,'paper-finished');assert.equal(v.finishedPaper,true);
 assert.equal(v.firstFailed,true);assert.equal(v.revisedAfterFailure,true);
 assert.equal(v.trials.length,2);assert.equal(v.tests.quiet_reader.passed,true);
 assert.equal(v.tests.activity_group.passed,true);
 assert.equal(v.loopChecked,true);assert.match(v.hook,/Common CLOSED/);
 assert.match(v.hook,/Season completion/);
 assert.equal(v.commonOpen,false);assert.equal(v.seasonFinished,false);
 assert.deepEqual(v.canonicalEvents,[]);assert.deepEqual(v.unlocks,[]);
 assert.deepEqual(v.historicalClaims,[]);assert.deepEqual(v.rights,[]);
 assert.deepEqual(replay(s.history),s);assert.deepEqual(restore(structuredClone(s)),s);
 assert.equal(can(s,{type:'add-loop-edge',edgeId:'square-garden'}),false);
});
test('parent cue appears only after child sees a failed user test',()=>{
 let s=go(fresh(),'start');
 assert.equal(view(s).parentCue,null);
 s=go(s,'place',{tokenId:'access',cells:['1,1','1,2']});
 s=go(s,'place',{tokenId:'quiet',cells:['0,1']});
 s=go(s,'place',{tokenId:'activity',cells:['0,2']});
 s=go(s,'test-user',{userId:'quiet_reader'});
 assert.match(view(s).parentCue,/Who can use this path/);
 assert.equal(can(s,{type:'finish-paper'}),false);
});
test('reject fake access, source, rights, old closed hill and injected events',()=>{
 const s=done();
 for(const a of [{type:'grant-unlock'},{type:'finish-season'},
  {type:'start',approved:true},{type:'cite-earlier',discoveryId:'real_1902'},
  {type:'add-loop-edge',edgeId:'old_north_hill_direct'},
  {type:'finish-paper',sourceApproved:true},null]){
  assert.deepEqual(dispatch(s,a),s);
 }
 for(const change of [x=>x.mode='canonical',x=>x.finishedPaper=false,
  x=>x.e11.reviewed=false,x=>x.e11.rights.push('approved'),
  x=>x.canonicalEvents.push('season_done'),x=>x.unlocks.push('e12'),
  x=>x.historicalClaims.push('1902'),x=>x.rights.push('permission'),
  x=>x.history[0].approved=true]){
  const bad=structuredClone(s);change(bad);
  assert.equal(restore(bad),null);
  assert.deepEqual(dispatch(bad,{type:'finish-paper'}),fresh());
 }
});
test('bounded replay and restart do not persist or complete the season',()=>{
 const s=done();assert.deepEqual(dispatch(s,{type:'reset'}),fresh());
 assert.equal(replay(Array(MAX_STEPS+1).fill({type:'start'})),null);
 assert.equal(view(fresh()).seasonFinished,false);
});
