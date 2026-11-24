import test from 'node:test';
import assert from 'node:assert/strict';
import {simulate} from '../engine/s01e06-authoring-prototype.mjs';
import {waterModelEvidence} from '../e06-scene/water-model-view.mjs';

test('map flow and low basin project only the exact completed reducer snapshot',()=>{
 assert.deepEqual(waterModelEvidence([]),{last:null,history:[],comparison:null});
 const dry=waterModelEvidence([simulate('dry','open')]);
 assert.deepEqual(dry.last,{index:1,weather:'dry',channel:'open',catchment:0,bypass:0,visualState:'dry'});
 const open=waterModelEvidence([simulate('rain','open')]);
 assert.deepEqual(open.last,{index:1,weather:'rain',channel:'open',catchment:1,bypass:2,visualState:'rain-open'});
 const blocked=waterModelEvidence([simulate('rain','blocked')]);
 assert.deepEqual(blocked.last,{index:1,weather:'rain',channel:'blocked',catchment:3,bypass:0,visualState:'rain-blocked'});
});

test('next-run setup cannot change visual evidence until another reducer snapshot exists',()=>{
 const completed=[simulate('dry','open'),simulate('rain','open')];
 const before=waterModelEvidence(completed);
 const nextSetup={weather:'rain',channel:'blocked'};
 assert.deepEqual(nextSetup,{weather:'rain',channel:'blocked'});
 assert.deepEqual(waterModelEvidence(completed),before);
 assert.equal(before.last.visualState,'rain-open');
 assert.equal(before.last.catchment,1);
 assert.equal(before.comparison,null);
});

test('same-rain before/after pair preserves real completion order and isolates channel',()=>{
 const runs=[simulate('dry','open'),simulate('rain','open'),simulate('rain','blocked')];
 const evidence=waterModelEvidence(runs);
 assert.deepEqual(evidence.comparison,{weather:'rain',variable:'channel',
  before:{index:2,weather:'rain',channel:'open',catchment:1,bypass:2,visualState:'rain-open'},
  after:{index:3,weather:'rain',channel:'blocked',catchment:3,bypass:0,visualState:'rain-blocked'}});
 const reverse=waterModelEvidence([runs[2],runs[0],runs[1]]);
 assert.equal(reverse.comparison.before.channel,'blocked');
 assert.equal(reverse.comparison.after.channel,'open');
 assert.equal(reverse.comparison.before.index,1);
 assert.equal(reverse.comparison.after.index,3);
});

test('forged or extra run values do not produce a visual result',()=>{
 assert.equal(waterModelEvidence([{...simulate('rain','open'),catchment:3}]),null);
 assert.equal(waterModelEvidence([{...simulate('rain','blocked'),historicalCause:'flood'}]),null);
 assert.equal(waterModelEvidence([{weather:'sunny',channel:'open',catchment:0,bypass:0,synthetic:true}]),null);
});
