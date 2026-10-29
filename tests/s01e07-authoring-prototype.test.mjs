import test from 'node:test';
import assert from 'node:assert/strict';
import {
  VERSION,MAX_ACTIONS,BOARD,ANCHORS,ANCHOR_EDGES,SNAPS,BASELINE,
  RESIDENT_PATH,WATER_PATH,evaluateLayout,fresh,dispatch,replay,restore,previewProjection
} from '../engine/s01e07-authoring-prototype.mjs';
const act=(s,type,props={})=>dispatch(s,{type,...props});
const walk=(s,anchor)=>act(s,'walk',{anchor});
const inspect=(s,anchor)=>act(s,'inspect',{anchor});
function observed(){
  let s=fresh();
  s=walk(s,'shared-path');s=inspect(s,'shared-path');
  s=walk(s,'channel');s=inspect(s,'channel');
  return walk(s,'workbench');
}
function first(){
  let s=observed();
  for(const name of ['milo','resident','water'])s=act(s,'test-'+name);
  return s;
}
function revised(snap='side-offset',order=['milo','resident','water']){
  let s=act(first(),'place-piece',{pieceId:'connector',snapId:snap});
  for(const name of order)s=act(s,'test-'+name);
  return s;
}
const complete=s=>act(act(s,'compare-layouts'),'confirm-preview');

test('model grid and five snap footprints are bounded, synthetic and inspectable',()=>{
  assert.deepEqual(BOARD,{width:8,height:7,start:'0,3',finish:'7,3'});
  assert.equal(ANCHORS.length,4);
  assert.equal(ANCHOR_EDGES.length,3);
  assert.equal(Object.keys(SNAPS).length,5);
  for(const snap of Object.keys(SNAPS)){
    const result=evaluateLayout(snap);
    assert.equal(result.source,'synthetic-model-only');
    assert.equal(result.layout,snap);
    assert.ok(result.footprint.length>=4);
    assert.equal(result.footprint.length,new Set(result.footprint).size);
  }
  assert.equal(evaluateLayout('unknown'),null);
  assert.equal(evaluateLayout('__proto__'),null);
  assert.equal(evaluateLayout({x:0,y:0}),null);
});
test('Finn baseline is computed: Milo walks but resident and water overlap footprint',()=>{
  const result=evaluateLayout(BASELINE);
  assert.equal(result.traces.milo.pass,true);
  assert.equal(result.traces.milo.steps,7);
  assert.deepEqual(result.traces.resident.overlaps,['3,2']);
  assert.deepEqual(result.traces.water.overlaps,['4,4']);
  assert.equal(result.traces.resident.pass,false);
  assert.equal(result.traces.water.pass,false);
  assert.deepEqual(RESIDENT_PATH,['3,2','4,2']);
  assert.deepEqual(WATER_PATH,['3,4','4,4']);
});
test('a side detour is longer; two distinct offset layouts pass all geometric tests',()=>{
  const first=evaluateLayout(BASELINE);
  for(const snap of ['side-offset','lower-offset']){
    const e=evaluateLayout(snap);
    assert.equal(e.traces.milo.pass,true);
    assert.equal(e.traces.resident.pass,true);
    assert.equal(e.traces.water.pass,true);
    assert.ok(e.traces.milo.steps>first.traces.milo.steps);
    assert.notEqual(e.layoutHash,first.layoutHash);
  }
});
test('path-clear and channel-clear model snaps fail different tests; not a hard-coded answer',()=>{
  const path=evaluateLayout('path-clear-water-blocked').traces;
  const channel=evaluateLayout('channel-clear-path-blocked').traces;
  assert.equal(path.milo.pass,true);assert.equal(path.resident.pass,true);assert.equal(path.water.pass,false);
  assert.equal(channel.milo.pass,true);assert.equal(channel.resident.pass,false);assert.equal(channel.water.pass,true);
});
test('Milo must walk adjacent anchors and inspect two different visible constraints',()=>{
  let s=fresh();
  assert.equal(s.mode,'authoring_preview');
  assert.deepEqual(walk(s,'workbench'),s,'no teleport across unconnected anchors');
  assert.deepEqual(inspect(s,'channel'),s,'cannot inspect a distant feature');
  s=walk(s,'shared-path');s=inspect(s,'shared-path');
  assert.deepEqual(act(s,'test-milo'),s,'only one constraint is not enough');
  s=walk(s,'channel');s=inspect(s,'channel');
  assert.deepEqual(act(s,'test-milo'),s,'must walk to model bench');
  s=walk(s,'workbench');
  assert.equal(act(s,'test-milo').phase,'first-trial');
  assert.deepEqual(act(s,'inspect',{anchor:'shared-path'}),s,'cannot inspect twice');
});
test('first Milo success is partial; side effects must be tested in either order',()=>{
  let s=observed();
  assert.deepEqual(act(s,'test-water'),s,'must first test Milo');
  s=act(s,'test-milo');
  assert.equal(s.phase,'first-trial');
  assert.equal(s.firstTrials.milo.pass,true);
  assert.deepEqual(act(s,'confirm-preview'),s);
  assert.deepEqual(act(s,'place-piece',{pieceId:'connector',snapId:'side-offset'}),s);
  for(const order of [['resident','water'],['water','resident']]){
    let a=s;
    for(const kind of order)a=act(a,'test-'+kind);
    assert.equal(a.phase,'revise');
    assert.equal(a.firstTrials.resident.pass,false);
    assert.equal(a.firstTrials.water.pass,false);
    assert.equal(a.firstTrials.milo.pass,true);
    assert.deepEqual(act(a,'test-milo'),a,'baseline cannot be reused as revised test');
    assert.deepEqual(act(a,'compare-layouts'),a);
    assert.equal(a.previewComplete,false);
  }
});
test('valid-first revision needs all three tests tied to one layout, then explicit comparison',()=>{
  let s=act(first(),'place-piece',{pieceId:'connector',snapId:'side-offset'});
  assert.deepEqual(act(s,'confirm-preview'),s);
  s=act(s,'test-water');s=act(s,'test-resident');
  assert.deepEqual(act(s,'compare-layouts'),s,'Milo test still missing');
  s=act(s,'test-milo');
  assert.equal(s.revisedTrials.milo.pass,true);
  assert.equal(s.revisedTrials.resident.pass,true);
  assert.equal(s.revisedTrials.water.pass,true);
  assert.equal(new Set(Object.values(s.revisedTrials).map(x=>x.layoutHash)).size,1);
  assert.deepEqual(act(s,'confirm-preview'),s,'must see FIRST and NOW');
  s=act(s,'compare-layouts');
  assert.equal(s.phase,'compare');
  const p=previewProjection(s);
  assert.ok(p.firstNow);
  assert.equal(p.firstNow.first.traces.resident.pass,false);
  assert.equal(p.firstNow.now.traces.resident.pass,true);
  s=act(s,'confirm-preview');
  assert.equal(s.phase,'preview-complete');
  assert.equal(s.previewComplete,true);
  assert.match(previewProjection(s).stepsHook,/base only/);
  assert.deepEqual(s.canonicalEvents,[]);
  assert.deepEqual(s.unlocks,[]);
  assert.deepEqual(s.historicalClaims,[]);
});
test('run-all-traces computes three independent results; cannot substitute baseline',()=>{
  let s=first();
  assert.deepEqual(act(s,'run-all-traces'),s);
  s=act(s,'place-piece',{pieceId:'connector',snapId:'lower-offset'});
  s=act(s,'run-all-traces');
  assert.equal(Object.values(s.revisedTrials).filter(Boolean).length,3);
  assert.equal(complete(s).previewComplete,true);
  assert.deepEqual(act(s,'run-all-traces'),s);
});
test('a water-blocking revision fails despite Milo and resident PASS; retry without penalty',()=>{
  let s=revised('path-clear-water-blocked');
  assert.equal(s.revisedTrials.milo.pass,true);
  assert.equal(s.revisedTrials.resident.pass,true);
  assert.equal(s.revisedTrials.water.pass,false);
  assert.match(previewProjection(s).message,/Water needs a way/);
  assert.deepEqual(act(s,'compare-layouts'),s);
  s=act(s,'place-piece',{pieceId:'connector',snapId:'side-offset'});
  assert.deepEqual(s.revisedTrials,{milo:null,resident:null,water:null});
  assert.equal(s.compared,false);
  s=act(s,'run-all-traces');
  assert.equal(complete(s).previewComplete,true);
});
test('a resident-blocking revision fails independently and can be corrected',()=>{
  let s=revised('channel-clear-path-blocked');
  assert.equal(s.revisedTrials.resident.pass,false);
  assert.equal(s.revisedTrials.water.pass,true);
  assert.match(previewProjection(s).message,/shared path is blocked/);
  s=act(s,'place-piece',{pieceId:'connector',snapId:'lower-offset'});
  s=act(s,'test-water');s=act(s,'test-milo');s=act(s,'test-resident');
  assert.equal(complete(s).previewComplete,true);
});
test('changing layout invalidates all previous results and prevents mixing layout hashes',()=>{
  let s=revised('side-offset');
  const prior=s.revisedTrials.milo.layoutHash;
  s=act(s,'place-piece',{pieceId:'connector',snapId:'lower-offset'});
  assert.notEqual(evaluateLayout(s.currentSnap).layoutHash,prior);
  assert.deepEqual(s.revisedTrials,{milo:null,resident:null,water:null});
  assert.deepEqual(act(s,'compare-layouts'),s);
  s=act(s,'test-milo');
  assert.deepEqual(act(s,'compare-layouts'),s);
  s=act(s,'test-water');s=act(s,'test-resident');
  assert.equal(complete(s).previewComplete,true);
});
test('undo-piece restores previous layout and requires fresh tests; reset clears only lab',()=>{
  let s=revised('side-offset');
  s=act(s,'place-piece',{pieceId:'connector',snapId:'path-clear-water-blocked'});
  s=act(s,'undo-piece');
  assert.equal(s.currentSnap,'side-offset');
  assert.deepEqual(s.revisedTrials,{milo:null,resident:null,water:null});
  assert.deepEqual(act(s,'compare-layouts'),s);
  s=act(s,'run-all-traces');
  assert.equal(complete(s).previewComplete,true);
  assert.deepEqual(act(s,'reset'),fresh());
});
test('invalid piece ID, snap, injected geometry, duplicate placement and unknown action are inert',()=>{
  let s=first();
  for(const a of [
    {type:'place-piece',pieceId:'connector',snapId:'imaginary'},
    {type:'place-piece',pieceId:'connector',snapId:'__proto__'},
    {type:'place-piece',pieceId:'connector',snapId:{x:99,y:99}},
    {type:'place-piece',pieceId:'extra',snapId:'side-offset'},
    {type:'place-piece',pieceId:'connector',snapId:'side-offset',x:NaN},
    {type:'test-milo',result:{pass:true}},
    {type:'grant-canon'},null,{},'finish'
  ])s=dispatch(s,a);
  assert.deepEqual(s,first());
  s=act(s,'place-piece',{pieceId:'connector',snapId:'side-offset'});
  assert.deepEqual(act(s,'place-piece',{pieceId:'connector',snapId:'side-offset'}),s);
});
test('valid replay/restore exact; forged phase, result, unlock, history and completion fail closed',()=>{
  const s=complete(revised('side-offset'));
  assert.equal(s.version,VERSION);
  assert.deepEqual(replay(s.history),s);
  assert.deepEqual(restore(structuredClone(s)),s);
  for(const mutate of [
    x=>{x.phase='inspect';},x=>{x.previewComplete=false;},
    x=>{x.firstTrials.milo.pass=false;},
    x=>{x.revisedTrials.resident.pass=false;},
    x=>{x.revisedTrials.water.layoutHash='other';},
    x=>{x.canonicalEvents.push('s01e07_connector_revised');},
    x=>{x.unlocks.push('s01e08');},
    x=>{x.historicalClaims.push('real water clearance proven');},
    x=>{x.history.push({type:'grant-canon'});},
    x=>{x.history[0].anchor='imaginary';},
    x=>{x.history[0].extra='bad';},
    x=>{x.mode='canonical';},x=>{x.version='other';}
  ]){
    const bad=structuredClone(s);mutate(bad);
    assert.equal(restore(bad),null);
    assert.deepEqual(dispatch(bad,{type:'confirm-preview'}),fresh());
    assert.equal(previewProjection(bad),null);
  }
});
test('completion is idempotent and authoring never opens production or reveals Common',()=>{
  const s=complete(revised('lower-offset'));
  assert.equal(s.history.filter(x=>x.type==='confirm-preview').length,1);
  assert.deepEqual(act(s,'confirm-preview'),s);
  assert.deepEqual(act(s,'place-piece',{pieceId:'connector',snapId:'side-offset'}),s);
  const p=previewProjection(s);
  assert.equal(p.scene,'s01e07-connector-passage');
  assert.match(p.label,/NOT THE REAL SITE/);
  assert.doesNotMatch(JSON.stringify(p),/Common|hill opened|lights on/i);
  assert.deepEqual(p.canonicalEvents,[]);
  assert.deepEqual(p.unlocks,[]);
  assert.deepEqual(p.historicalClaims,[]);
  assert.equal('localStorage' in s,false);
});
test('bounded history and reset reject extra actions; no forged completion',()=>{
  let s=first();
  const remaining=MAX_ACTIONS-s.history.length;
  for(let i=0;i<remaining;i++){
    const snap=i%2===0?'side-offset':'lower-offset';
    s=act(s,'place-piece',{pieceId:'connector',snapId:snap});
  }
  assert.equal(s.history.length,MAX_ACTIONS);
  assert.deepEqual(act(s,'test-milo'),s);
  assert.equal(replay([...s.history,{type:'confirm-preview'}]),null);
  assert.deepEqual(act(s,'reset'),fresh());
  assert.equal(replay([{type:'confirm-preview'}]),null);
});
