import test from 'node:test';
import assert from 'node:assert/strict';
import {VERSION,MAX_ACTIONS,MARKERS,VIEWPOINTS,SAFE_EDGES,FIXTURES,
  angularSpreadDegrees,geometryAt,fresh,replay,restore,dispatch,previewProjection
} from '../engine/s01e08-authoring-prototype.mjs';

const act=(s,type,fields={})=>dispatch(s,{type,...fields});
function prepared(){
  let s=fresh();
  for(const feature of ['brackets','boundary','lower-a'])s=act(s,'inspect',{feature});
  s=act(s,'walk',{anchor:'lower-landing'});
  s=act(s,'inspect',{feature:'lower-b'});
  return s;
}
function lit(){
  let s=prepared();
  s=act(s,'toggle-lamp',{lampId:'lower-a'});
  s=act(s,'toggle-lamp',{lampId:'lower-b'});
  return s;
}
function twoViews(){
  let s=act(lit(),'walk',{anchor:'base'});
  s=act(s,'observe-view');
  s=act(s,'walk',{anchor:'lower-landing'});
  s=act(s,'walk',{anchor:'side'});
  s=act(s,'observe-view');
  return s;
}
function finished(){
  let s=twoViews();
  s=act(s,'inspect',{feature:'service-plate'});
  s=act(s,'compare-views');
  return act(s,'confirm-preview');
}
test('fresh state is in-memory, synthetic and has no production events',()=>{
  const s=fresh();
  assert.equal(s.version,VERSION);
  assert.equal(s.mode,'authoring_preview');
  assert.equal(s.miloPosition,'base');
  assert.deepEqual(s.canonicalEvents,[]);
  assert.deepEqual(s.unlocks,[]);
  assert.deepEqual(s.historicalClaims,[]);
  assert.equal('localStorage' in s,false);
});
test('marker fixture geometry is fixed and base is almost collinear',()=>{
  assert.equal(MARKERS.length,3);
  assert.deepEqual(geometryAt('base').markerIds,['mark-a','mark-b','mark-c']);
  assert.ok(geometryAt('base').spreadDegrees<0.001);
  assert.ok(geometryAt('side').spreadDegrees>30);
  assert.deepEqual(MARKERS.map(m=>[m.x,m.y]),[[3,2],[5,3],[7,4]]);
});
test('circular minimal arc correctly handles angles across minus/plus 180',()=>{
  const spread=angularSpreadDegrees([{x:-1,y:0.01},{x:-1,y:-0.01},{x:-2,y:0}],{x:0,y:0});
  assert.ok(spread>0&&spread<2,spread);
  assert.equal(angularSpreadDegrees([{x:1,y:0},{x:2,y:0}],{x:0,y:0}),0);
});
test('invalid geometry and viewpoint cannot produce evidence',()=>{
  assert.equal(geometryAt('upper-closed'),null);
  assert.equal(geometryAt('__proto__'),null);
  assert.equal(angularSpreadDegrees([],VIEWPOINTS.base),null);
  assert.equal(angularSpreadDegrees([{x:1,y:1},{x:2,y:2}],{x:1,y:1}),null);
  assert.equal(angularSpreadDegrees([{x:NaN,y:2},{x:2,y:3}],VIEWPOINTS.base),null);
});
test('walking requires one declared safe edge, never the closed upper hill',()=>{
  const s=fresh();
  for(const anchor of ['side','upper-closed','north-hill','__proto__',{},null,'base'])
    assert.deepEqual(act(s,'walk',{anchor}),s);
  const next=act(s,'walk',{anchor:'lower-landing'});
  assert.equal(next.miloPosition,'lower-landing');
  assert.deepEqual(act(next,'walk',{anchor:'base'}).miloPosition,'base');
  assert.deepEqual(SAFE_EDGES.length,2);
});
test('inspection is local and named; service plate cannot be read remotely',()=>{
  let s=fresh();
  for(const feature of ['service-plate','lower-b','imaginary','__proto__'])
    assert.deepEqual(act(s,'inspect',{feature}),s);
  s=act(s,'inspect',{feature:'brackets'});
  assert.deepEqual(act(s,'inspect',{feature:'brackets'}),s);
  assert.deepEqual(s.inspected,['brackets']);
});
test('cannot switch lamps before boundary/brackets and each fixture inspection',()=>{
  const s=fresh();
  for(const lampId of ['lower-a','lower-b','upper-lamp','__proto__'])
    assert.deepEqual(act(s,'toggle-lamp',{lampId}),s);
  let p=act(s,'inspect',{feature:'brackets'});
  p=act(p,'inspect',{feature:'boundary'});
  assert.deepEqual(act(p,'toggle-lamp',{lampId:'lower-a'}),p);
  assert.equal(FIXTURES.length,2);
});
test('one lower lamp is insufficient, two make all fixed markers observable',()=>{
  let s=prepared();
  s=act(s,'toggle-lamp',{lampId:'lower-a'});
  assert.deepEqual(act(s,'observe-view'),s);
  assert.match(previewProjection(s).message,/Not enough light/);
  s=act(s,'toggle-lamp',{lampId:'lower-b'});
  assert.equal(previewProjection(s).enoughLight,true);
  s=act(s,'observe-view');
  assert.equal(s.observations.length,1);
  assert.equal(s.observations[0].markerIds.length,3);
});
test('first view alone and repeated same view cannot satisfy comparison',()=>{
  let s=lit();
  s=act(s,'walk',{anchor:'base'});
  s=act(s,'observe-view');
  assert.deepEqual(act(s,'compare-views'),s);
  s=act(s,'observe-view');
  assert.equal(s.observations.length,2);
  assert.deepEqual(act(s,'compare-views'),s);
});
test('base and side show computed distinct spreads without moving markers',()=>{
  let s=twoViews();
  const [first,second]=s.observations;
  assert.equal(first.viewpoint,'base');
  assert.equal(second.viewpoint,'side');
  assert.equal(first.lampStateHash,second.lampStateHash);
  assert.deepEqual(first.markerIds,second.markerIds);
  assert.ok(second.spreadDegrees-first.spreadDegrees>30);
  s=act(s,'compare-views');
  assert.equal(s.compared,true);
  assert.equal(s.comparison.markersUnchanged,true);
  assert.ok(s.comparison.spreadDifferenceDegrees>30);
});
test('light toggle invalidates all prior observations and comparison',()=>{
  let s=act(twoViews(),'compare-views');
  s=act(s,'toggle-lamp',{lampId:'lower-b'});
  assert.equal(s.compared,false);
  assert.deepEqual(s.observations,[]);
  assert.equal(s.comparison,null);
  assert.deepEqual(act(s,'compare-views'),s);
});
test('revisiting an anchor and observing again is nonpunitive',()=>{
  let s=twoViews();
  s=act(s,'walk',{anchor:'lower-landing'});
  s=act(s,'walk',{anchor:'base'});
  s=act(s,'observe-view');
  assert.equal(s.observations.length,3);
  s=act(s,'compare-views');
  assert.equal(s.compared,true);
});
test('undated service plate required, and finish is provisional only',()=>{
  let s=act(twoViews(),'compare-views');
  assert.deepEqual(act(s,'confirm-preview'),s);
  s=act(s,'inspect',{feature:'service-plate'});
  s=act(s,'confirm-preview');
  assert.equal(s.previewComplete,true);
  assert.equal(s.phase,'preview-complete');
  const p=previewProjection(s);
  assert.equal(p.servicePlate,'undated_source_pending');
  assert.deepEqual(p.canonicalEvents,[]);
  assert.deepEqual(p.unlocks,[]);
  assert.deepEqual(p.historicalClaims,[]);
  assert.match(p.label,/NOT THE REAL STEPS/);
  assert.doesNotMatch(JSON.stringify(p),/Common revealed|historical year|hill opened/i);
});
test('completed preview rejects further changes, reset is lab-only',()=>{
  const s=finished();
  assert.deepEqual(act(s,'walk',{anchor:'lower-landing'}),s);
  assert.deepEqual(act(s,'toggle-lamp',{lampId:'lower-a'}),s);
  assert.deepEqual(act(s,'confirm-preview'),s);
  assert.deepEqual(act(s,'reset'),fresh());
});
test('strict action keys, types and injected completion are inert',()=>{
  const s=prepared();
  for(const a of [{type:'toggle-lamp',lampId:'lower-a',approved:true},
    {type:'observe-view',pass:true},{type:'confirm-preview',unlock:'s01e09'},
    {type:'walk',anchor:'side',teleport:true},{type:'grant-canon'},null,{},'finish']){
    assert.deepEqual(dispatch(s,a),s);
  }
  assert.equal(replay([{type:'reset'}]),null);
  assert.equal(replay([{type:'walk',anchor:'side'}]),null);
});
test('valid replay and restore exact; forged state/date/unlock fail closed',()=>{
  const s=finished();
  assert.deepEqual(replay(s.history),s);
  assert.deepEqual(restore(structuredClone(s)),s);
  for(const mutate of [
    x=>{x.previewComplete=false;},x=>{x.phase='canonical';},
    x=>{x.observations[0].spreadDegrees=0.123;},
    x=>{x.comparison.markersUnchanged=false;},
    x=>{x.lights['lower-a']=false;},
    x=>{x.canonicalEvents.push('episode_completed:s01e08');},
    x=>{x.unlocks.push('s01e09');},
    x=>{x.historicalClaims.push('1897');},
    x=>{x.history[0].feature='service-plate';},
    x=>{x.history[0].extra='injected';},
    x=>{x.mode='canonical';}
  ]){
    const bad=structuredClone(s);mutate(bad);
    assert.equal(restore(bad),null);
    assert.deepEqual(dispatch(bad,{type:'confirm-preview'}),fresh());
    assert.equal(previewProjection(bad),null);
  }
});
test('history bounded and invalid replay cannot promote synthetic state',()=>{
  let s=prepared();
  const remaining=MAX_ACTIONS-s.history.length;
  for(let i=0;i<remaining;i++)
    s=act(s,'walk',{anchor:i%2===0?'base':'lower-landing'});
  assert.equal(s.history.length,MAX_ACTIONS);
  assert.deepEqual(act(s,'toggle-lamp',{lampId:'lower-a'}),s);
  assert.equal(replay([...s.history,{type:'confirm-preview'}]),null);
  assert.deepEqual(act(s,'reset'),fresh());
});
