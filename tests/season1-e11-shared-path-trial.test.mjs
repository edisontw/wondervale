import test from 'node:test';import assert from 'node:assert/strict';
import {replayPath,dispatchPath} from '../e11-scene/shared-path-trial.mjs';
test('Milo sees narrow conflict, revises, earns reversible PAPER consequence',()=>{
 let h=dispatchPath([],{type:'test'});assert.equal(replayPath(h).passed,false);
 h=dispatchPath(h,{type:'place',width:'shared'});assert.equal(replayPath(h).tested,false);
 h=dispatchPath(h,{type:'test'});assert.equal(replayPath(h).passed,true);
 assert.match(replayPath(h).chronicle,/PAPER Chronicle/);
 h=h.slice(0,-1);assert.equal(replayPath(h).chronicle,null);
 assert.equal(replayPath([]).world,'Not tested');
});
test('strict replay rejects forged events and claims',()=>{
 for(const bad of [[{type:'grant-access'}],[{type:'test',rights:['open']}],[{type:'place',width:'real'}],Array(25).fill({type:'test'})])
 assert.throws(()=>replayPath(bad));
 const s=replayPath([{type:'place',width:'shared'},{type:'test'}]);
 assert.deepEqual(s.canonicalEvents,[]);assert.deepEqual(s.unlocks,[]);assert.equal(s.realAccessApproved,false);
});
