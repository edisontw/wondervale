import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch,replay,restore,view,can,MAX_STEPS} from '../authoring-labs/station-story-model.mjs';
const a=(s,type,value)=>dispatch(s,value?{type,value}:{type});
function beforeCopy(){
 let s=fresh();s=a(s,'start');s=a(s,'walk','board');
 s=a(s,'inspect','peg-pair');s=a(s,'inspect','worn-edge');
 s=a(s,'guess','unsure');return s;
}
function finish(wrongFirst){
 let s=beforeCopy();
 if(wrongFirst){s=a(s,'try-copy','side-b');s=a(s,'check');
  assert.equal(view(s).fit,false);assert.match(view(s).line,/do not fit/);}
 s=a(s,'try-copy','side-a');s=a(s,'check');
 assert.equal(view(s).fit,true);
 s=a(s,'qualify');s=a(s,'walk','table');
 s=a(s,'place-table','across-walkway');
 assert.equal(view(s).clear,false);
 assert.equal(can(s,{type:'confirm'}),false);
 s=a(s,'place-table','near-wall');s=a(s,'confirm');s=a(s,'reflect');
 return s;
}
test('story trigger, child marker, EFL hypothesis and parent cue only after observation',()=>{
 let s=fresh();
 assert.equal(view(s).parentCue,null);
 assert.equal(can(s,{type:'inspect',value:'peg-pair'}),false);
 s=a(s,'start');s=a(s,'walk','board');
 s=a(s,'inspect','peg-pair');
 assert.match(view(s).line,/I see/);
 assert.match(view(s).parentCue,/without changing/);
 s=a(s,'guess','route-board');
 assert.match(view(s).line,/I think/);
 assert.equal(view(s).guess,'route-board');
});
test('mismatch-first and fit-first each produce a paper Map Room and garden question',()=>{
 for(const wrong of [true,false]){
  const s=finish(wrong),v=view(s);
  assert.equal(v.phase,'finished');assert.equal(v.mapRoom,true);
  assert.match(v.line,/garden/);assert.match(v.chroniclePreview,/UNKNOWN/);
  assert.deepEqual(v.canonicalEvents,[]);assert.deepEqual(v.unlocks,[]);
  assert.deepEqual(s.canonicalEvents,[]);assert.deepEqual(s.unlocks,[]);
  assert.deepEqual(replay(s.history),s);
  assert.deepEqual(restore(structuredClone(s)),s);
 }
});
test('cannot jump from E04 or fake a production unlock or overclaim historical source',()=>{
 let s=fresh();for(const action of [
  {type:'reflect'},{type:'confirm'},{type:'walk',value:'secret-hill'},
  {type:'grant-canon'},{type:'inspect',value:'made-up'},
  {type:'start',extra:true}
 ])assert.deepEqual(dispatch(s,action),s);
 s=beforeCopy();s=a(s,'try-copy','side-b');s=a(s,'check');
 assert.equal(can(s,{type:'qualify'}),false);
 assert.deepEqual(view(s).historicalClaims,[]);
 const forged=structuredClone(finish(true));forged.unlocks.push('s01e06');
 assert.equal(restore(forged),null);
 assert.deepEqual(dispatch(forged,{type:'reflect'}),fresh());
 const forged2=structuredClone(finish(false));forged2.history.push({type:'grant-canon'});
 assert.equal(restore(forged2),null);
 assert.equal(replay(Array(MAX_STEPS+1).fill({type:'start'})),null);
});
test('revisit, hypothesis revision and finished preview remain noncanonical',()=>{
 let s=beforeCopy();s=a(s,'guess','notice-board');
 assert.equal(view(s).guess,'notice-board');
 s=a(s,'try-copy','side-a');s=a(s,'check');s=a(s,'qualify');
 s=a(s,'walk','door');s=a(s,'walk','board');
 assert.equal(view(s).fit,true);
 s=a(s,'walk','table');s=a(s,'place-table','near-wall');s=a(s,'confirm');s=a(s,'reflect');
 assert.deepEqual(a(s,'start'),s);
 assert.deepEqual(a(s,'walk','board'),s);
 assert.deepEqual(view(s).unlocks,[]);
});
