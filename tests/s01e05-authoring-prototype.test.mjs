import test from 'node:test';
import assert from 'node:assert/strict';
import {
  VERSION,MAX_ACTIONS,BOARD,REPLICA,WALKWAY,TABLES,
  fresh,dispatch,replay,restore,alignment,corridorClear,previewProjection
} from '../engine/s01e05-authoring-prototype.mjs';

const act=(s,type,rest={})=>dispatch(s,{type,...rest});
const inspect=s=>act(act(s,'inspect-feature',{id:'peg-pair'}),'inspect-feature',{id:'worn-edge'});
const place=(s,orientation)=>act(s,'place-replica',{orientation});
const compare=s=>act(s,'compare-fit');
const toLayout=(orientation='side-a')=>act(compare(place(inspect(fresh()),orientation)),'note-limits');
const toDone=()=>act(act(toLayout(),'place-table',{position:'near-wall'}),'confirm-room');

test('synthetic replica exposes two independent visible coordinate checks, not a hidden grade',()=>{
  assert.deepEqual(Object.keys(BOARD),['peg-pair','worn-edge']);
  assert.deepEqual(Object.keys(REPLICA['side-a']),Object.keys(BOARD));
  assert.deepEqual(alignment('side-a').checks.map(x=>x.fits),[true,true]);
  assert.deepEqual(alignment('side-b').checks.map(x=>x.fits),[false,false]);
  assert.equal(alignment('invalid'),null);
});
test('inspect at least two marks before comparing; fit alone never advances layout',()=>{
  let s=fresh();
  s=act(s,'place-replica',{orientation:'side-a'});
  assert.equal(s.orientation,null);
  s=act(s,'inspect-feature',{id:'peg-pair'});
  s=place(s,'side-a');
  s=compare(s);
  assert.equal(s.comparison,null);
  s=act(s,'note-limits');
  assert.equal(s.phase,'replica');
  s=act(s,'inspect-feature',{id:'worn-edge'});
  s=compare(s);
  assert.equal(s.comparison.matched,true);
  assert.equal(s.phase,'replica');
  assert.equal(s.roomPreview,false);
  assert.deepEqual(previewProjection(s).canonicalEvents,[]);
});
test('mismatch-first child can turn the copy and observe a match without penalty',()=>{
  let s=compare(place(inspect(fresh()),'side-b'));
  assert.equal(s.comparison.matched,false);
  assert.match(previewProjection(s).message,/do not line up/);
  s=place(s,'side-a');
  assert.equal(s.comparison,null,'old mismatch cannot be reused as evidence');
  s=compare(s);
  assert.equal(s.comparison.matched,true);
  s=act(s,'note-limits');
  assert.equal(s.phase,'layout');
  assert.equal(s.limitedConclusion,true);
  assert.equal(s.history.filter(x=>x.type==='place-replica').length,2);
});
test('fit-first child reaches the same limited inference without being forced to fail',()=>{
  const s=toLayout();
  assert.equal(s.phase,'layout');
  assert.equal(s.comparison.matched,true);
  assert.equal(s.limitedConclusion,true);
  assert.deepEqual(previewProjection(s).historicalClaims,[]);
});
test('board and replica geometry is inspectable, original board stays immutable',()=>{
  const board=JSON.stringify(BOARD),copy=JSON.stringify(REPLICA);
  let s=inspect(fresh());
  s=compare(place(s,'side-b'));
  s=compare(place(s,'side-a'));
  assert.equal(JSON.stringify(BOARD),board);
  assert.equal(JSON.stringify(REPLICA),copy);
  assert.equal(s.comparison.matched,true);
});
test('table footprint collision is geometric, not an arbitrary correct-option flag',()=>{
  assert.deepEqual(WALKWAY,{x:3,y:0,w:2,h:4});
  assert.deepEqual(TABLES['near-wall'],{x:0,y:1,w:2,h:2});
  assert.equal(corridorClear('near-wall'),true);
  assert.equal(corridorClear('across-walkway'),false);
  assert.equal(corridorClear('unknown'),null);
});
test('blocked placement cannot confirm; child can reposition and see local Map Room',()=>{
  let s=act(toLayout(),'place-table',{position:'across-walkway'});
  assert.equal(previewProjection(s).corridorClear,false);
  assert.match(previewProjection(s).message,/covers the public walkway/);
  s=act(s,'confirm-room');
  assert.equal(s.roomPreview,false);
  s=act(s,'place-table',{position:'near-wall'});
  assert.equal(previewProjection(s).corridorClear,true);
  s=act(s,'confirm-room');
  assert.equal(s.phase,'done');
  assert.equal(previewProjection(s).mapRoomVisible,true);
  assert.deepEqual(s.canonicalEvents,[]);
  assert.deepEqual(s.unlocks,[]);
});
test('no table, invalid table or uninspected replica cannot create a room',()=>{
  let s=fresh();
  for(const a of [{type:'confirm-room'},{type:'place-table',position:'near-wall'},
    {type:'note-limits'},{type:'compare-fit'}])s=dispatch(s,a);
  assert.deepEqual(s,fresh());
  s=toLayout();
  s=act(s,'place-table',{position:'imaginary'});
  s=act(s,'confirm-room');
  assert.equal(s.roomPreview,false);
});
test('completed preview stays frozen; repeated actions cannot award canonical events',()=>{
  const done=toDone();
  assert.equal(done.phase,'done');
  assert.deepEqual(act(done,'confirm-room'),done);
  assert.deepEqual(act(done,'place-table',{position:'across-walkway'}),done);
  assert.equal(previewProjection(done).unlocks.length,0);
  assert.equal(done.history.filter(x=>x.type==='confirm-room').length,1);
});
test('valid snapshots replay exactly; tampered flags and actions fail closed',()=>{
  const done=toDone();
  assert.equal(done.version,VERSION);
  assert.deepEqual(replay(done.history),done);
  assert.deepEqual(restore(structuredClone(done)),done);
  for(const mutate of [
    s=>{s.roomPreview=false;s.phase='layout';},
    s=>{s.canonicalEvents.push('episode_completed:s01e05');},
    s=>{s.unlocks.push('s01e06');},
    s=>{s.history.push({type:'grant-canon'});},
    s=>{s.history.unshift({type:'confirm-room'});},
    s=>{s.history[0]={type:'inspect-feature',id:'fabricated'};},
    s=>{s.history[0].extra='unexpected';},
    s=>{s.mode='canonical';},
    s=>{s.version='other';}
  ]) {
    const bad=structuredClone(done);mutate(bad);
    assert.equal(restore(bad),null);
    assert.deepEqual(dispatch(bad,{type:'confirm-room'}),fresh());
    assert.equal(previewProjection(bad),null);
  }
});
test('unknown and extraneous actions are inert, no preview storage API exists',()=>{
  let s=inspect(fresh());
  const before=structuredClone(s);
  for(const action of [{type:'grant-canon'},{type:'place-table',position:'near-wall',admin:true},
    {type:'place-replica',orientation:'side-a',script:'x'},null,{},'finish'])
    s=dispatch(s,action);
  assert.deepEqual(s,before);
  assert.equal('save' in s,false);
  assert.equal('localStorage' in s,false);
});
test('history cap and impossible replay fail closed without a production unlock',()=>{
  let s=inspect(fresh());
  for(let i=0;i<MAX_ACTIONS-2;i++) {
    s=place(s,i%2===0?'side-a':'side-b');
  }
  assert.equal(s.history.length,MAX_ACTIONS);
  assert.deepEqual(place(s,'side-a'),s);
  assert.equal(replay([...s.history,{type:'place-replica',orientation:'side-a'}]),null);
  assert.deepEqual(s.canonicalEvents,[]);
  assert.deepEqual(s.unlocks,[]);
});
