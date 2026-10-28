import test from 'node:test';
import assert from 'node:assert/strict';
import {
  VERSION,MAX_ACTIONS,CURRENT_ANCHORS,LOWER_ANCHORS,SITES,
  fresh,dispatch,replay,restore,simulate,siteEffect,previewProjection
} from '../engine/s01e06-authoring-prototype.mjs';
const act=(s,type,props={})=>dispatch(s,{type,...props});
const walk=(s,target)=>act(s,'walk-to',{target});
const inspect=(s,id)=>act(walk(s,id),'inspect',{id});
function current(){
  let s=fresh();
  s=inspect(s,'slope');s=inspect(s,'shared-path');return walk(s,'model-tray');
}
function model(order='open-first'){
  let s=current();
  s=act(s,'run-model');
  if(order==='blocked-first'){
    s=act(s,'set-channel',{channel:'blocked'});
    s=act(s,'set-weather',{weather:'rain'});
    s=act(s,'run-model');
    s=act(s,'set-channel',{channel:'open'});
    s=act(s,'run-model');
  }else{
    s=act(s,'set-weather',{weather:'rain'});
    s=act(s,'run-model');
    s=act(s,'set-channel',{channel:'blocked'});
    s=act(s,'run-model');
  }
  return act(s,'compare-model');
}
function lower(){
  let s=act(model(),'visit-lower');
  s=act(s,'inspect',{id:'runoff-trace'});
  return inspect(s,'public-path');
}
function place(s,site){
  return act(walk(s,site),'move-marker',{site});
}
function previewDone(){
  let s=place(lower(),'raised-pocket');
  s=act(s,'inspect-result');
  return act(s,'confirm-small-trial');
}
test('Current and Lower are distinct scenes; the second cannot be entered from a fresh preview',()=>{
  let s=fresh();
  assert.equal(s.phase,'current');
  assert.equal(previewProjection(s).scene,'s01e06-current-garden');
  assert.deepEqual(act(s,'visit-lower'),s);
  assert.notDeepEqual(CURRENT_ANCHORS,LOWER_ANCHORS);
  assert.deepEqual(previewProjection(s).canonicalEvents,[]);
});
test('Milo must walk to inspect each real anchor; no automatic inspection or fake cause',()=>{
  let s=fresh();
  assert.deepEqual(act(s,'inspect',{id:'slope'}),s);
  s=inspect(s,'slope');s=inspect(s,'present-bed');
  assert.deepEqual(s.currentObserved,['slope','present-bed']);
  assert.equal(previewProjection(s).observedFacts.length,2);
  assert.match(previewProjection(s).remainingQuestion,/model cannot establish/);
});
test('one observation, wrong location or unobserved current garden cannot run the model',()=>{
  let s=inspect(fresh(),'slope');
  s=walk(s,'model-tray');
  assert.deepEqual(act(s,'run-model'),s);
  assert.deepEqual(act(s,'compare-model'),s);
  assert.deepEqual(act(s,'visit-lower'),s);
  s=current();
  s=walk(s,'slope');
  assert.deepEqual(act(s,'run-model'),s);
});
test('dry/rain and open/blocked model has visible numeric, labeled synthetic flow',()=>{
  assert.deepEqual(simulate('dry','open'),{weather:'dry',channel:'open',catchment:0,bypass:0,synthetic:true});
  assert.deepEqual(simulate('rain','open'),{weather:'rain',channel:'open',catchment:1,bypass:2,synthetic:true});
  assert.deepEqual(simulate('rain','blocked'),{weather:'rain',channel:'blocked',catchment:3,bypass:0,synthetic:true});
  assert.equal(simulate('flood','open'),null);
  assert.equal(simulate('rain','fake'),null);
});
test('no comparison without dry and both channel configurations under rain',()=>{
  let s=current();
  s=act(s,'run-model');
  s=act(s,'set-weather',{weather:'rain'});
  s=act(s,'run-model');
  assert.deepEqual(act(s,'compare-model'),s);
  assert.deepEqual(act(s,'visit-lower'),s);
  s=act(s,'set-channel',{channel:'blocked'});
  s=act(s,'run-model');
  assert.equal(act(s,'compare-model').modelCompared,true);
});
test('favorable-first and unfavorable-first both reach qualified conclusion without punishment',()=>{
  for(const order of ['open-first','blocked-first']){
    const s=model(order);
    assert.equal(s.modelCompared,true);
    assert.equal(s.modelRuns.length,3);
    assert.deepEqual(s.modelRuns.map(x=>x.catchment).sort(),[0,1,3]);
    assert.match(previewProjection(s).message,/MODEL/);
    assert.deepEqual(previewProjection(s).historicalClaims,[]);
    assert.equal(act(s,'visit-lower').phase,'lower');
  }
});
test('same configuration cannot be rerun to manufacture a second model observation',()=>{
  let s=current();s=act(s,'run-model');
  assert.deepEqual(act(s,'run-model'),s);
  s=act(s,'set-weather',{weather:'rain'});s=act(s,'run-model');
  assert.equal(s.modelRuns.length,2);
  assert.deepEqual(act(s,'run-model'),s);
});
test('Lower Garden requires two independently visited/inspected constraints',()=>{
  let s=act(model(),'visit-lower');
  assert.equal(s.location,'runoff-trace');
  assert.deepEqual(act(s,'move-marker',{site:'runoff-channel'}),s);
  s=act(s,'inspect',{id:'runoff-trace'});
  s=walk(s,'raised-pocket');
  assert.deepEqual(act(s,'move-marker',{site:'raised-pocket'}),s);
  s=inspect(s,'public-path');
  assert.deepEqual(s.lowerObserved,['runoff-trace','public-path']);
});
test('runoff and shared footpath are different physical placement conflicts',()=>{
  assert.deepEqual(siteEffect('runoff-channel'),{wet:true,blocksPath:false,provisional:false});
  assert.deepEqual(siteEffect('footpath'),{wet:false,blocksPath:true,provisional:false});
  assert.deepEqual(siteEffect('raised-pocket'),{wet:false,blocksPath:false,provisional:true});
  assert.equal(siteEffect('unknown'),null);
  assert.equal(SITES['runoff-channel'].x!==SITES['footpath'].x,true);
  let s=place(lower(),'runoff-channel');
  assert.match(previewProjection(s).message,/water route/);
  s=act(s,'inspect-result');
  assert.deepEqual(act(s,'confirm-small-trial'),s);
  s=place(s,'footpath');
  assert.equal(s.markerInspected,false,'old inspection cannot be reused for a moved marker');
  assert.match(previewProjection(s).message,/shared path/);
  s=act(s,'inspect-result');
  assert.deepEqual(act(s,'confirm-small-trial'),s);
  s=place(s,'raised-pocket');
  assert.match(previewProjection(s).message,/needs permission/);
  assert.deepEqual(act(s,'confirm-small-trial'),s,'must inspect final placement');
  s=act(s,'inspect-result');
  assert.equal(act(s,'confirm-small-trial').lowerPreviewStarted,true);
});
test('viable-first lower placement also works; small pocket never removes present garden',()=>{
  const s=previewDone();
  assert.equal(s.phase,'done');
  assert.equal(s.lowerPreviewStarted,true);
  const p=previewProjection(s);
  assert.equal(p.presentGardenHealthy,true);
  assert.equal(p.scene,'s01e06-lower-garden');
  assert.equal(p.placement.provisional,true);
  assert.deepEqual(p.canonicalEvents,[]);
  assert.deepEqual(p.unlocks,[]);
  assert.deepEqual(p.historicalClaims,[]);
});
test('completed preview freezes; cannot confirm twice or grant E07',()=>{
  const s=previewDone();
  for(const a of [{type:'confirm-small-trial'},{type:'walk-to',target:'footpath'},
    {type:'move-marker',site:'footpath'}])assert.deepEqual(dispatch(s,a),s);
  assert.equal(s.history.filter(a=>a.type==='confirm-small-trial').length,1);
  assert.equal('episodeCompleted' in s,false);
});
test('replay/restore is deterministic and rejects mutated phase, progress, forged model and history',()=>{
  const s=previewDone();
  assert.equal(s.version,VERSION);
  assert.deepEqual(replay(s.history),s);
  assert.deepEqual(restore(structuredClone(s)),s);
  for(const change of [
    x=>{x.phase='current';},x=>{x.mode='canonical';},
    x=>{x.canonicalEvents.push('episode_completed:s01e06');},
    x=>{x.unlocks.push('s01e07');},x=>{x.historicalClaims.push('flood caused move');},
    x=>{x.lowerPreviewStarted=false;},x=>{x.modelRuns[0].catchment=99;},
    x=>{x.history.push({type:'grant-canon'});},
    x=>{x.history[0].target='imaginary';},x=>{x.history[0].extra=true;},
    x=>{x.version='other';}
  ]){
    const bad=structuredClone(s);change(bad);
    assert.equal(restore(bad),null);
    assert.deepEqual(dispatch(bad,{type:'confirm-small-trial'}),fresh());
    assert.equal(previewProjection(bad),null);
  }
});
test('unknown actions, injected fields, invalid targets and forged results are inert',()=>{
  let s=current();
  const before=structuredClone(s);
  for(const a of [{type:'grant-canon'},{type:'set-weather',weather:'rain',admin:true},
    {type:'run-model',result:{catchment:0}},{type:'walk-to',target:'the Common'},
    {type:'move-marker',site:'fabricated'},null,{},'finish'])
    s=dispatch(s,a);
  assert.deepEqual(s,before);
  assert.equal('localStorage' in s,false);
  assert.equal('save' in s,false);
});
test('bounded history and reset cannot mutate any other episode or canonical ledger',()=>{
  let s=fresh();
  for(let i=0;i<MAX_ACTIONS;i++)s=walk(s,i%2===0?'slope':'present-bed');
  assert.equal(s.history.length,MAX_ACTIONS);
  assert.deepEqual(walk(s,'shared-path'),s);
  assert.equal(replay([...s.history,{type:'walk-to',target:'shared-path'}]),null);
  assert.deepEqual(fresh().history,[]);
  assert.deepEqual(previewProjection(s).unlocks,[]);
});
