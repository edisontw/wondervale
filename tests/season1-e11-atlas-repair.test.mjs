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
