import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch,restore,replay,project,MAX_ACTIONS} from '../authoring-labs/connector-lantern.mjs';
const act=(s,scene,type,extra={})=>dispatch(s,{scene,type,...extra});
const c=(s,type,extra={})=>act(s,'connector',type,extra);
const l=(s,type,extra={})=>act(s,'steps',type,extra);
const nav=(s,type)=>act(s,'nav',type);

function revised(){
  let s=fresh();
  for(const anchor of ['shared-path','channel']){
    s=c(s,'walk',{anchor});s=c(s,'inspect',{anchor});
  }
  s=c(s,'walk',{anchor:'workbench'});
  for(const type of ['test-milo','test-resident','test-water'])s=c(s,type);
  assert.equal(s.connector.firstTrials.milo.pass,true);
  assert.equal(s.connector.firstTrials.resident.pass,false);
  assert.equal(s.connector.firstTrials.water.pass,false);
  s=c(s,'place-piece',{pieceId:'connector',snapId:'path-clear-water-blocked'});
  s=c(s,'run-all-traces');
  assert.equal(s.connector.revisedTrials.water.pass,false);
  assert.deepEqual(c(s,'compare-layouts'),s);
  s=c(s,'place-piece',{pieceId:'connector',snapId:'side-offset'});
  s=c(s,'run-all-traces');
  s=c(s,'compare-layouts');s=c(s,'confirm-preview');
  return s;
}
function atSteps(){return nav(revised(),'to-steps');}
function completed(){
  let s=atSteps();
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

test('E08 cannot be entered or operated before a child-revised E07 trial',()=>{
  const s=fresh();
  assert.deepEqual(nav(s,'to-steps'),s);
  assert.deepEqual(l(s,'toggle-lamp',{lampId:'lower-a'}),s);
  assert.deepEqual(l(s,'walk',{anchor:'lower-landing'}),s);
  assert.deepEqual(c(s,'confirm-preview'),s);
  assert.equal(project(s).upperHillClosed,true);
});
test('E07 failing shortcut must be revised for Milo, person and water',()=>{
  const s=revised();
  assert.equal(s.connector.previewComplete,true);
  assert.equal(s.connector.currentSnap,'side-offset');
  assert.ok(Object.values(s.connector.revisedTrials).every(x=>x.pass));
  assert.equal(project(s).connectorStillVisible,true);
  assert.equal(project(s).lowerLampsLit,false);
});
test('E08 starts dark, requires inspection, lower lights and two distinct views',()=>{
  let s=atSteps();
  assert.equal(s.steps.miloPosition,'base');
  assert.deepEqual(s.steps.lights,{'lower-a':false,'lower-b':false});
  assert.deepEqual(l(s,'observe-view'),s);
  assert.deepEqual(l(s,'walk',{anchor:'upper-closed'}),s);
  assert.deepEqual(l(s,'inspect',{feature:'service-plate'}),s);
  for(const feature of ['brackets','boundary','lower-a'])s=l(s,'inspect',{feature});
  s=l(s,'walk',{anchor:'lower-landing'});
  s=l(s,'inspect',{feature:'lower-b'});
  s=l(s,'toggle-lamp',{lampId:'lower-a'});
  assert.deepEqual(l(s,'observe-view'),s);
  s=l(s,'toggle-lamp',{lampId:'lower-b'});
  s=l(s,'walk',{anchor:'base'});
  s=l(s,'observe-view');
  assert.deepEqual(l(s,'compare-views'),s);
  s=l(s,'walk',{anchor:'lower-landing'});
  s=l(s,'walk',{anchor:'side'});
  s=l(s,'observe-view');
  assert.ok(s.steps.observations[1].spreadDegrees>s.steps.observations[0].spreadDegrees+30);
  s=l(s,'compare-views');
  assert.equal(s.steps.compared,true);
  assert.deepEqual(l(s,'confirm-preview'),s);
  s=l(s,'inspect',{feature:'service-plate'});
  s=l(s,'confirm-preview');
  assert.equal(s.steps.previewComplete,true);
  assert.equal(project(s).servicePlate,'undated_source_pending');
});
test('revisit keeps revised connector and lower light model visible, never canonical',()=>{
  let s=completed();
  assert.equal(s.steps.previewComplete,true);
  assert.equal(project(s).connectorStillVisible,true);
  assert.equal(project(s).lowerLampsLit,true);
  s=nav(s,'to-connector');
  assert.equal(s.connector.previewComplete,true);
  s=nav(s,'to-steps');
  assert.equal(s.steps.previewComplete,true);
  const p=project(s);
  assert.equal(p.historicalDate,null);
  assert.deepEqual(p.canonicalEvents,[]);
  assert.deepEqual(p.unlocks,[]);
  assert.deepEqual(p.historicalClaims,[]);
  assert.equal(p.upperHillClosed,true);
  assert.doesNotMatch(JSON.stringify(p),/episode_completed|1897|hill reopened|real electricity/i);
});
test('strict replay blocks forged dates, unlocks, source and bypass commands',()=>{
  const s=completed();
  assert.ok(s.history.length<MAX_ACTIONS);
  assert.deepEqual(restore(structuredClone(s)),s);
  assert.deepEqual(replay(s.history),s);
  for(const mutate of [
    x=>x.unlocks.push('s01e09'),
    x=>x.canonicalEvents.push('episode_completed:s01e08'),
    x=>x.historicalClaims.push('1904'),
    x=>x.connector.previewComplete=false,
    x=>x.steps.lights['lower-a']=false,
    x=>x.steps.observations[0].spreadDegrees=500,
    x=>x.history[0].fake='yes',
    x=>x.stage='production',
    x=>x.mode='canonical'
  ]){
    const bad=structuredClone(s);mutate(bad);
    assert.equal(restore(bad),null);
    assert.deepEqual(nav(bad,'to-connector'),fresh());
  }
  for(const a of [
    {scene:'nav',type:'to-hill'},
    {scene:'steps',type:'inspect',feature:'service-plate',date:1904},
    {scene:'steps',type:'walk',anchor:'upper-closed'},
    {scene:'nav',type:'to-steps',unlock:true},
    {scene:'steps',type:'confirm-preview',canonical:true},
    null
  ])assert.deepEqual(dispatch(s,a),s);
  assert.equal(replay([...s.history,{scene:'nav',type:'to-hill'}]),null);
});
