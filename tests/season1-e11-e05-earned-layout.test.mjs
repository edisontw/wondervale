import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh} from '../e05-scene/scene-model.mjs';
import {earnedE05,replayLayout,dispatchLayout} from '../e11-scene/e05-earned-layout-trial.mjs';
test('E05 PAPER proof must be complete, never fabricated',()=>{
 assert.equal(earnedE05([]),false);
 assert.equal(earnedE05([{scene:'nav',type:'to-review'}]),false);
 assert.equal(earnedE05([{scene:'nav',type:'restart'}]),false);
 assert.equal(earnedE05([{scene:'nav',type:'to-review',rights:['open']}]),false);
 assert.throws(()=>replayLayout([],[]),/E05 PAPER source required/);
 assert.throws(()=>dispatchLayout([],[],{type:'test'}),/E05 PAPER source required/);
 assert.deepEqual(fresh().canonicalEvents,[]);
});
