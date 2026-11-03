import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch} from '../engine/s01e06-authoring-prototype.mjs';
import {lowerGardenRevisit} from '../engine/s01e06-lower-revisit.mjs';
const act=(s,a)=>dispatch(s,a);
function completed() {
 let s=fresh();
 const actions=[
  {type:'inspect',id:'present-bed'},
  {type:'walk-to',target:'slope'},{type:'inspect',id:'slope'},
  {type:'walk-to',target:'model-tray'},{type:'run-model'},
  {type:'set-weather',weather:'rain'},{type:'run-model'},
  {type:'set-channel',channel:'blocked'},{type:'run-model'},
  {type:'compare-model'},{type:'visit-lower'},
  {type:'inspect',id:'runoff-trace'},
  {type:'walk-to',target:'public-path'},{type:'inspect',id:'public-path'},
  {type:'walk-to',target:'raised-pocket'},{type:'move-marker',site:'raised-pocket'},
  {type:'inspect-result'},{type:'confirm-small-trial'}
 ];
 for(const a of actions) s=act(s,a);
 assert.equal(s.lowerPreviewStarted,true);
 return s.history;
}
test('FIRST/NOW is a synthetic callback only after replay-earned planting',()=>{
 const h=completed();
 const first=lowerGardenRevisit(h,'first'), now=lowerGardenRevisit(h,'now');
 assert.equal(first.now.pocket,'empty');
 assert.equal(now.now.pocket,'model-sprout');
 assert.deepEqual(now.canonicalEvents,[]);
 assert.deepEqual(now.unlocks,[]);
 assert.deepEqual(now.historicalClaims,[]);
 assert.match(now.difference,/synthetic/);
});
test('no planting or forged history cannot create growth',()=>{
 assert.equal(lowerGardenRevisit([], 'now').now.pocket,'empty');
 assert.equal(lowerGardenRevisit([{type:'confirm-small-trial'}],'now'),null);
 assert.equal(lowerGardenRevisit(completed().concat({type:'unlock-e07'}),'now'),null);
 assert.equal(lowerGardenRevisit(completed(),'future'),null);
});
test('revisits are deterministic, do not mutate action history',()=>{
 const h=completed(), before=JSON.stringify(h);
 assert.deepEqual(lowerGardenRevisit(h,'now'),lowerGardenRevisit(h,'now'));
 assert.equal(JSON.stringify(h),before);
});
