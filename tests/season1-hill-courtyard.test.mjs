import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch,replay,restore,project,MAX_ACTIONS} from '../authoring-labs/hill-courtyard.mjs';
import {CLOSED_EDGE} from '../engine/s01e09-authoring-prototype.mjs';
const act=(s,scene,type,extra={})=>dispatch(s,{scene,type,...extra});
const hill=(s,type,extra={})=>act(s,'hill',type,extra);
const court=(s,type,extra={})=>act(s,'courtyard',type,extra);
const nav=(s,type)=>act(s,'nav',type);
function finishedHill(){
 let s=fresh();
 s=hill(s,'inspect',{clueId:'entry_note'});
 s=hill(s,'walk',{to:'signpost'});
 s=hill(s,'inspect',{clueId:'boundary_sign'});
 s=hill(s,'walk',{to:'fence_view'});
 s=hill(s,'inspect',{clueId:'disturbed_ground'});
 s=hill(s,'walk',{to:'upper_closed'});
 s=hill(s,'consider',{hypothesisId:'water_may_change_ground'});
 s=hill(s,'walk',{to:'signpost'});
 s=hill(s,'walk',{to:'lower_bend'});
 s=hill(s,'inspect',{clueId:'runoff_marks'});
 s=hill(s,'walk',{to:'overlook'});
 s=hill(s,'inspect',{clueId:'distant_symbol'});
 for(const edgeId of ['steps_base:signpost','lower_bend:overlook'])s=hill(s,'mark',{edgeId});
 s=hill(s,'check-route');
 assert.equal(s.hill.routeResult.complete,false);
 s=hill(s,'mark',{edgeId:'signpost:lower_bend'});
 s=hill(s,'check-route');
 s=hill(s,'compare-symbol');
 s=hill(s,'review');
 return hill(s,'finish-preview');
}
function reviewedCourtyard(){
 let s=nav(finishedHill(),'to-courtyard');
 s=court(s,'compare-symbol');
 s=court(s,'walk',{to:'stone_edge'});
 s=court(s,'inspect',{traceId:'surface'});
 s=court(s,'suggest',{traceId:'surface',useTag:'meeting'});
 s=court(s,'revise',{traceId:'surface',oldTag:'meeting',newTag:'resting'});
 s=court(s,'walk',{to:'quiet_corner'});
 s=court(s,'hear',{needId:'quiet'});
 s=court(s,'place',{needId:'quiet',slot:'left'});
 s=court(s,'walk',{to:'meeting_edge'});
 s=court(s,'hear',{needId:'activity'});
 s=court(s,'place',{needId:'activity',slot:'left'});
 s=court(s,'place',{needId:'activity',slot:'right'});
 s=court(s,'walk',{to:'notice_wall'});
 s=court(s,'inspect',{traceId:'holes'});
 s=court(s,'suggest',{traceId:'holes',useTag:'display'});
 s=court(s,'check-source');
 s=court(s,'review-tradeoff');
 return court(s,'review');
}
test('E10 paper stage is inaccessible until child completes E09 safe survey and revises a route gap',()=>{
 const s=fresh();
 assert.deepEqual(nav(s,'to-courtyard'),s);
 assert.deepEqual(court(s,'walk',{to:'stone_edge'}),s);
 const completed=finishedHill();
 assert.ok(completed.hill.blockedAttempts>0);
 assert.equal(completed.hill.provisionalFinished,true);
 assert.equal(completed.hill.routeResult.complete,true);
 assert.equal(nav(completed,'to-courtyard').stage,'courtyard');
});
test('two undated traces and two simulated needs can be compared without an approved name',()=>{
 const s=reviewedCourtyard(),p=project(s);
 assert.equal(s.courtyard.reviewed,true);
 assert.equal(s.courtyard.sourceChecked,true);
 assert.equal(s.courtyard.nameRevealed,false);
 assert.equal(s.courtyard.finished,false);
 assert.deepEqual(s.courtyard.hypotheses.surface,['resting']);
 assert.deepEqual(s.courtyard.hypotheses.holes,['display']);
 assert.deepEqual(s.courtyard.board,{quiet:'left',activity:'right'});
 assert.equal(p.unknownName,true);
 assert.equal(p.actualCourtyardName,null);
 assert.equal(p.actualAccessApproved,false);
 assert.equal(p.upperHillClosed,true);
 assert.equal(p.seasonFinished,false);
 assert.deepEqual(p.canonicalEvents,[]);
 assert.deepEqual(p.unlocks,[]);
 assert.deepEqual(p.historicalClaims,[]);
 assert.deepEqual(court(s,'enable-fixture'),s);
 assert.deepEqual(court(s,'finish-preview'),s);
});
test('revisit preserves the paper hill sketch and E10 board, never unlocks production',()=>{
 let s=reviewedCourtyard();
 s=nav(s,'to-hill');
 assert.equal(s.hill.provisionalFinished,true);
 assert.equal(s.hill.routeResult.complete,true);
 assert.deepEqual(hill(s,'mark',{edgeId:CLOSED_EDGE}),s);
 s=nav(s,'to-courtyard');
 assert.equal(s.courtyard.reviewed,true);
 assert.equal(project(s).sourceStatus,'UNKNOWN — SOURCE PENDING');
});
test('strict replay rejects synthetic fixture injection, fake historical dates and canonical unlocks',()=>{
 const s=reviewedCourtyard();
 assert.ok(s.history.length<MAX_ACTIONS);
 assert.deepEqual(replay(s.history),s);
 assert.deepEqual(restore(structuredClone(s)),s);
 for(const mutate of [
  x=>x.unlocks.push('s01e11'),x=>x.canonicalEvents.push('episode_completed'),
  x=>x.historicalClaims.push('1901'),x=>x.stage='production',
  x=>x.hill.position='upper_closed',x=>x.courtyard.fixtureEnabled=true,
  x=>x.courtyard.nameRevealed=true,x=>x.courtyard.board.quiet='unknown',
  x=>x.history[0].sourceDate=1901
 ]){
  const bad=structuredClone(s);mutate(bad);
  assert.equal(restore(bad),null);
  assert.deepEqual(nav(bad,'to-hill'),fresh());
 }
 for(const a of [
  {scene:'courtyard',type:'enable-fixture'},
  {scene:'nav',type:'to-e11'},
  {scene:'courtyard',type:'check-source',name:'Common'},
  {scene:'hill',type:'walk',to:'upper_closed',approved:true},
  {scene:'courtyard',type:'finish-preview',unlock:true}
 ])assert.deepEqual(dispatch(s,a),s);
 assert.equal(replay([...s.history,{scene:'nav',type:'to-e11'}]),null);
});
