import test from 'node:test';
import assert from 'node:assert/strict';
import {WORKSHOPS,TYPES,getWorkshop,fresh,selectCard,placeCard,review} from '../authoring-labs/evidence-workshop.mjs';
test('seven independent E05–E11 scenes, including two E06 spaces',()=>{
 assert.deepEqual(WORKSHOPS.map(s=>s.id),['e05','e06-current','e06-lower','e07','e08','e09','e10','e11'].filter(id=>id!=='e06-current'||true));
 assert.equal(WORKSHOPS.length,8);
 assert.equal(WORKSHOPS.every(s=>s.cards.length===3),true);
 for(const s of WORKSHOPS)assert.deepEqual(s.cards.map(c=>c.type),TYPES);
 assert.equal(getWorkshop('e04'),null,'no E04 synthetic evidence');
});
test('no premature Common reveal before E10',()=>{
 assert.doesNotMatch(JSON.stringify(WORKSHOPS.slice(0,6)),/Common/i);
 assert.match(JSON.stringify(WORKSHOPS[6]),/Common/);
});
test('fresh scenes are uncompleted and no production progress is emitted',()=>{
 for(const s of WORKSHOPS){
  const state=fresh(s.id);
  assert.equal(review(state).complete,false);
  for(const k of ['canonicalEvents','unlocks','historicalClaims','productionEligible','chronicle']){
   assert.equal(Object.hasOwn(state,k),false,k);
  }
  assert.equal(state.selected,null);
 }
 assert.throws(()=>fresh('e04'),/Unknown workshop/);
});
test('wrong classification is nonpunitive and allows retry',()=>{
 let s=fresh('e05');
 s=selectCard(s,'e05-a');
 s=placeCard(s,'MAYBE');
 assert.deepEqual(s.placements,{});
 assert.equal(s.selected,'e05-a');
 assert.match(s.feedback,/Try another group/);
 s=placeCard(s,'MODEL');
 assert.equal(s.placements['e05-a'],'MODEL');
 assert.equal(s.selected,null);
});
test('a placed card can be reselected and corrected without losing other cards',()=>{
 let s=fresh('e09');
 for(const c of getWorkshop('e09').cards){
  s=placeCard(selectCard(s,c.id),c.type);
 }
 assert.equal(review(s).complete,true);
 assert.match(review(s).message,/NOT a real source, Chronicle event or episode unlock/);
 s=selectCard(s,'e09-b');
 s=placeCard(s,'UNKNOWN');
 assert.equal(review(s).complete,true,'wrong revision does not destroy earlier valid grouping');
 s=placeCard(s,'MAYBE');
 assert.equal(review(s).complete,true);
});
test('invalid scene, card or type cannot forge progress',()=>{
 const s=fresh('e05');
 assert.equal(selectCard(s,'e10-a'),s);
 assert.equal(placeCard(s,'MODEL'),s);
 const chosen=selectCard(s,'e05-a');
 assert.equal(placeCard(chosen,'CANONICAL_UNLOCK'),chosen);
});
test('every card is an explicit model/hypothesis/unresolved claim, not a dated historical source',()=>{
 for(const s of WORKSHOPS){
  assert.ok(s.hook.length>15);
  for(const c of s.cards){
   assert.ok(c.why.length>20);
   assert.doesNotMatch(c.text,/\b(?:18|19|20)\d\d\b/);
   assert.doesNotMatch(c.why,/\b(?:18|19|20)\d\d\b/);
  }
 }
});
