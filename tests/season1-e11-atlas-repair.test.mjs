import test from 'node:test';
import assert from 'node:assert/strict';
import {paperAtlasRepair,dispatchAtlasRepair} from '../e11-scene/atlas-repair.mjs';
test('atlas repair cannot be forged without strict three-source child replay',()=>{
 const missing=paperAtlasRepair(null,[],null,[],null,null,[]);
 assert.equal(missing,null);
 assert.deepEqual(dispatchAtlasRepair(null,[],null,[],null,null,[],
  {type:'place',place:'garden',phase:'now'}),[]);
 assert.deepEqual(dispatchAtlasRepair(null,[],null,[],null,null,[],
  {type:'test'}),[]);
 assert.equal(paperAtlasRepair({},[],{},[],{},null,
  [{type:'place',place:'common',phase:'now'}]),null);
 assert.equal(paperAtlasRepair({},[],{},[],{},null,
  Array.from({length:25},()=>({type:'test'}))),null);
});

test('atlas repair rejects malformed or forged PAPER histories before any source grant',()=>{
 const source=[null,[],null,[],null,null];
 for(const actions of [
  [{type:'place',place:'common',phase:'now'}],
  [{type:'place',place:'north_hill',phase:'now'}],
  [{type:'place',place:'garden',phase:'future'}],
  [{type:'place',place:'garden',phase:'now',rights:['approved']}],
  [{type:'test'}],
  [{type:'test',realRouteOpen:true}],
  [{type:'place',place:'garden',phase:'now'},{type:'test'},{type:'test'}],
  Array.from({length:25},()=>({type:'test'}))
 ])assert.equal(paperAtlasRepair(...source,actions),null);
 const h=[];
 for(const action of [null,[],{type:'grant-unlock'},{type:'test'},
  {type:'place',place:'common',phase:'now'}])
  assert.deepEqual(dispatchAtlasRepair(...source,h,action),h);
});


test('atlas dispatch fails closed for malformed histories and bounded event limits',()=>{
 const source=[null,[],null,[],null,null];
 for(const history of [null,{},'invalid',24])
  assert.equal(dispatchAtlasRepair(...source,history,{type:'test'}),history);
 const full=Array.from({length:24},()=>({type:'test'}));
 assert.equal(dispatchAtlasRepair(...source,full,{type:'test'}),full);
 assert.deepEqual(dispatchAtlasRepair(...source,[],[{type:'test'}]),[]);
});
