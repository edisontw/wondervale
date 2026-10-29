import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch,replay,restore,project,MAX_ACTIONS} from '../authoring-labs/lantern-hill.mjs';
import {CLOSED_EDGE} from '../engine/s01e09-authoring-prototype.mjs';
const act=(s,scene,type,extra={})=>dispatch(s,{scene,type,...extra});
const l=(s,type,extra={})=>act(s,'steps',type,extra);
const h=(s,type,extra={})=>act(s,'hill',type,extra);
const nav=(s,type)=>act(s,'nav',type);
function completedSteps(){
  let s=fresh();
  for(const feature of ['brackets','boundary','lower-a'])s=l(s,'inspect',{feature});
  s=l(s,'walk',{anchor:'lower-landing'});
  s=l(s,'inspect',{feature:'lower-b'});
  s=l(s,'toggle-lamp',{lampId:'lower-a'});
  s=l(s,'toggle-lamp',{lampId:'lower-b'});
  s=l(s,'walk',{anchor:'base'});
  s=l(s,'observe-view');
  s=l(s,'walk',{anchor:'lower-landing'});
  s=l(s,'walk',{anchor:'side'});
  s=l(s,'observe-view');
  s=l(s,'inspect',{feature:'service-plate'});
  s=l(s,'compare-views');
  return l(s,'confirm-preview');
}
function completedHill(){
  let s=nav(completedSteps(),'to-hill');
  s=h(s,'inspect',{clueId:'entry_note'});
  s=h(s,'walk',{to:'signpost'});
  s=h(s,'inspect',{clueId:'boundary_sign'});
  s=h(s,'walk',{to:'fence_view'});
  s=h(s,'inspect',{clueId:'disturbed_ground'});
  s=h(s,'walk',{to:'upper_closed'});
  s=h(s,'consider',{hypothesisId:'water_may_change_ground'});
  s=h(s,'walk',{to:'signpost'});
  s=h(s,'walk',{to:'lower_bend'});
  s=h(s,'inspect',{clueId:'runoff_marks'});
  s=h(s,'walk',{to:'overlook'});
  s=h(s,'inspect',{clueId:'distant_symbol'});
  for(const edgeId of ['steps_base:signpost','lower_bend:overlook'])
    s=h(s,'mark',{edgeId});
  s=h(s,'check-route');
  assert.equal(s.hill.routeResult.complete,false);
  s=h(s,'mark',{edgeId:'signpost:lower_bend'});
  s=h(s,'check-route');
  s=h(s,'compare-symbol');
  s=h(s,'review');
  return h(s,'finish-preview');
}
test('E09 is inaccessible until two lower viewpoints, both lamps and undated plate are checked',()=>{
  let s=fresh();
  assert.deepEqual(nav(s,'to-hill'),s);
  assert.deepEqual(h(s,'walk',{to:'signpost'}),s);
  assert.deepEqual(l(s,'observe-view'),s);
  s=completedSteps();
  assert.equal(s.steps.previewComplete,true);
  assert.equal(project(s).servicePlate,'undated_source_pending');
  assert.equal(project(s).historicalDate,null);
  assert.equal(project(s).lowerLampsLit,true);
  assert.equal(nav(s,'to-hill').stage,'hill');
});
test('safe E09 survey records a stopped closed-edge attempt and an editable gap',()=>{
  const s=completedHill();
  assert.equal(s.hill.provisionalFinished,true);
  assert.ok(s.hill.blockedAttempts>=1);
  assert.equal(s.hill.routeResult.complete,true);
  assert.equal(s.hill.position,'overlook');
  assert.equal(s.hill.inspected.includes('disturbed_ground'),true);
  assert.equal(s.hill.inspected.includes('runoff_marks'),true);
  assert.equal(s.hill.symbolCompared,true);
  assert.equal(project(s).upperHillClosed,true);
  assert.equal(project(s).distantPlaceIdentity,null);
  assert.equal(project(s).hillSurveyComplete,true);
});
test('revisits preserve lower lights and unknown source without canonical progression',()=>{
  let s=completedHill();
  s=nav(s,'to-steps');
  assert.equal(s.steps.previewComplete,true);
  assert.deepEqual(s.steps.lights,{'lower-a':true,'lower-b':true});
  s=nav(s,'to-hill');
  assert.equal(s.hill.provisionalFinished,true);
  const p=project(s);
  assert.equal(p.actualAccessApproved,false);
  assert.equal(p.historicalDate,null);
  assert.equal(p.actualClosureCause,null);
  assert.deepEqual(p.canonicalEvents,[]);
  assert.deepEqual(p.unlocks,[]);
  assert.deepEqual(p.historicalClaims,[]);
  assert.doesNotMatch(JSON.stringify(p),/Common|episode_completed|hill reopened|1897/i);
});
test('replay and strict restoration reject injected history, route, date, or E10 unlock',()=>{
  const s=completedHill();
  assert.ok(s.history.length<MAX_ACTIONS);
  assert.deepEqual(replay(s.history),s);
  assert.deepEqual(restore(structuredClone(s)),s);
  for(const mutate of [
    x=>x.unlocks.push('s01e10'),
    x=>x.canonicalEvents.push('episode_completed:s01e09'),
    x=>x.historicalClaims.push('1904'),
    x=>x.hill.markedEdges.push(CLOSED_EDGE),
    x=>x.hill.position='upper_closed',
    x=>x.steps.inspected.push('date-1904'),
    x=>x.history[0].sourceDate=1904,
    x=>x.stage='production'
  ]){
    const bad=structuredClone(s);mutate(bad);
    assert.equal(restore(bad),null);
    assert.deepEqual(nav(bad,'to-steps'),fresh());
  }
  for(const a of [
    {scene:'nav',type:'to-e10'},
    {scene:'hill',type:'mark',edgeId:CLOSED_EDGE,approved:true},
    {scene:'hill',type:'finish-preview',unlock:true},
    {scene:'steps',type:'inspect',feature:'service-plate',date:1904},
    null
  ])assert.deepEqual(dispatch(s,a),s);
  assert.equal(replay([...s.history,{scene:'nav',type:'to-e10'}]),null);
});
