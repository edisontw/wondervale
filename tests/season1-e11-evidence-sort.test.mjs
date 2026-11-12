import test from 'node:test';
import assert from 'node:assert/strict';
import {replayEvidence,dispatchEvidence} from '../e11-scene/evidence-sort.mjs';
test('child tries a wrong idea, revises and earns reversible PAPER consequence',()=>{
 let h=[];
 const act=a=>{h=dispatchEvidence(h,a);};
 act({type:'pick',card:'paper-mark'});act({type:'model',target:'rest'});act({type:'test'});
 assert.equal(replayEvidence(h).fits,false);
 assert.match(replayEvidence(h).feedback,/change your model/);
 act({type:'model',target:'path'});act({type:'test'});
 const view=replayEvidence(h);
 assert.equal(view.fits,true);assert.match(view.chronicle,/PAPER NOTE/);
 assert.deepEqual(view.canonicalEvents,[]);assert.deepEqual(view.unlocks,[]);
 assert.equal(view.realAccessApproved,false);
 assert.deepEqual(replayEvidence(JSON.parse(JSON.stringify(h))),view);
 h=h.slice(0,-1);assert.equal(replayEvidence(h).chronicle,null);
 assert.equal(replayEvidence([]).visibleModel,null);
});
test('forged cards, extra fields, skipped tests and invalid histories fail closed',()=>{
 const h=[{type:'pick',card:'paper-seat'}];
 for(const a of [{type:'pick',card:'north-hill'}, {type:'model',target:'open'},
  {type:'test',unlock:true},{type:'pick',card:'paper-mark',approved:true}])
  assert.deepEqual(dispatchEvidence(h,a),h);
 assert.equal(replayEvidence([{type:'test'}]),null);
 assert.equal(replayEvidence([{type:'pick',card:'paper-seat'},{type:'test'}]),null);
 assert.equal(replayEvidence(new Array(17).fill({type:'pick',card:'paper-mark'})),null);
 assert.equal(replayEvidence({history:[]}),null);
});

test('changing the paper clue invalidates a previously selected model and test',()=>{
 let h=[];const act=a=>{h=dispatchEvidence(h,a);};
 act({type:'pick',card:'paper-mark'});act({type:'model',target:'path'});act({type:'test'});
 assert.equal(replayEvidence(h).fits,true);
 act({type:'pick',card:'paper-seat'});
 assert.equal(replayEvidence(h).model,null);
 assert.equal(replayEvidence(h).chronicle,null);
 assert.deepEqual(dispatchEvidence(h,{type:'test'}),h);
 act({type:'model',target:'rest'});act({type:'test'});
 assert.equal(replayEvidence(h).fits,true);
 assert.deepEqual(replayEvidence(JSON.parse(JSON.stringify(h))),replayEvidence(h));
 h=h.slice(0,-1);assert.equal(replayEvidence(h).chronicle,null);
});
