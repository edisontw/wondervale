import test from 'node:test';
import assert from 'node:assert/strict';
import {freshShadow,projectShadows,dispatchShadow,canShadow,replayShadow,restoreShadow,viewShadow,MAX_SHADOW_ACTIONS} from '../e08-scene/shadow-experiment.mjs';
const act=(type,key,value)=>key?{type,[key]:value}:{type};
const move=screen=>act('move-screen','screen',screen),lamp=id=>act('choose-lamp','lamp',id);
const step=(s,a)=>{assert.equal(canShadow(s,a),true,JSON.stringify(a));return dispatchShadow(s,a);};
test('Milo moves a PAPER screen and sees computed fixed-mark shadows shift',()=>{
 let s=freshShadow();
 const near=projectShadows('a','near'),far=projectShadows('a','far');
 assert.deepEqual(near.map(x=>x.mark),['A','B','C']);
 assert.deepEqual(far.map(x=>x.mark),['A','B','C']);
 assert.notDeepEqual(near.map(x=>x.x),far.map(x=>x.x));
 s=step(s,act('record'));assert.equal(canShadow(s,act('compare')),false);
 s=step(s,move('far'));s=step(s,act('record'));
 assert.equal(viewShadow(s).comparable,true);
 s=step(s,act('compare'));
 assert.equal(viewShadow(s).compared,true);
 assert.ok(viewShadow(s).shifts.some(x=>x.delta>0));
 assert.deepEqual(viewShadow(s).canonicalEvents,[]);
 assert.deepEqual(viewShadow(s).unlocks,[]);
 assert.equal(viewShadow(s).realLightsApproved,false);
 assert.equal(viewShadow(s).upperHillClosed,true);
 assert.deepEqual(replayShadow(s.history),s);
 assert.deepEqual(restoreShadow(structuredClone(s)),s);
});
test('changing both lamp and screen is not a controlled comparison until a matching lamp is tested',()=>{
 let s=freshShadow();s=step(s,act('record'));s=step(s,lamp('b'));
 s=step(s,move('far'));s=step(s,act('record'));
 assert.equal(viewShadow(s).comparable,false);
 assert.equal(canShadow(s,act('compare')),false);
 s=step(s,move('near'));s=step(s,act('record'));
 assert.equal(viewShadow(s).comparable,true);
 s=step(s,act('compare'));s=step(s,act('clear'));
 assert.equal(viewShadow(s).notes.length,0);
 assert.equal(viewShadow(s).compared,false);
 assert.deepEqual(step(s,act('reset')),freshShadow());
});
test('rejects forged shadow measurements, extra action keys, fake completion and invalid IDs',()=>{
 let s=freshShadow();s=step(s,act('record'));s=step(s,move('far'));s=step(s,act('record'));
 for(const a of [move('upper-closed'),lamp('upper'),{type:'record',passed:true},{type:'compare',year:1912},
  {type:'move-screen',screen:'far',rights:['wire']}]){
  assert.equal(canShadow(s,a),false);
  assert.deepEqual(dispatchShadow(s,a),s);
 }
 for(const mutate of [x=>x.notes[0].shadows[0].x=999,x=>x.compared=true,
  x=>x.canonicalEvents=['e08'],x=>x.history[0].approved=true,x=>x.screen='upper-closed']){
  const forged=structuredClone(s);mutate(forged);assert.equal(restoreShadow(forged),null);
  assert.deepEqual(dispatchShadow(forged,act('compare')),freshShadow());
 }
 assert.equal(replayShadow(Array(MAX_SHADOW_ACTIONS+1).fill(act('record'))),null);
 assert.equal(replayShadow([act('reset')]),null);
});
