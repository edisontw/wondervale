import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch,replay,restore,view,can,MAX_STEPS,CARDS} from '../authoring-labs/station-sources-model.mjs';
const act=(s,type,extra={})=>dispatch(s,{type,...extra});
function atTimeline(){
 let s=fresh();s=act(s,'start');
 for(const card of ['a','b']){
   s=act(s,'walk',{value:'desk-'+card});
   s=act(s,'inspect',{card});s=act(s,'source-check',{card});
 }
 return act(s,'walk',{value:'compare'});
}
function finish(wrongFirst){
 let s=atTimeline();
 for(const card of ['a','b']){
   if(wrongFirst){
     s=act(s,'place',{card,slot:card==='a'?'earlier':'later'});
     s=act(s,'test',{card});
     assert.equal(view(s).tested[card],'needs-source');
     assert.match(view(s).line,/dated source/);
   }
   s=act(s,'place',{card,slot:'unknown'});
   s=act(s,'test',{card});
   assert.equal(view(s).tested[card],'bounded');
 }
 s=act(s,'compare');s=act(s,'finish');
 return s;
}
test('two distinct MOCK cards are never treated as verified station evidence',()=>{
 assert.match(CARDS.a.drawing,/drawn garden/);
 assert.match(CARDS.b.drawing,/drawn slope/);
 let s=fresh();
 assert.equal(can(s,{type:'source-check',card:'a'}),false);
 s=act(s,'start');s=act(s,'walk',{value:'desk-a'});
 assert.equal(can(s,{type:'source-check',card:'a'}),false);
 s=act(s,'inspect',{card:'a'});s=act(s,'source-check',{card:'a'});
 assert.deepEqual(view(s).sourceMetadata.a,{maker:'UNKNOWN',date:'UNKNOWN',original:'UNKNOWN'});
 assert.match(view(s).parentCue,/which drawing came first/);
 assert.deepEqual(view(s).historicalClaims,[]);
});
test('wrong-first and direct-UNKNOWN journeys both finish a paper source request',()=>{
 for(const wrongFirst of [true,false]){
   const s=finish(wrongFirst),v=view(s);
   assert.equal(v.phase,'finished');assert.equal(v.compared,true);
   assert.match(v.paperNote,/attributable original records/);
   assert.match(v.line,/garden question is still open/);
   assert.deepEqual(v.canonicalEvents,[]);assert.deepEqual(v.unlocks,[]);
   assert.deepEqual(s.canonicalEvents,[]);assert.deepEqual(s.unlocks,[]);
   assert.deepEqual(replay(s.history),s);
   assert.deepEqual(restore(structuredClone(s)),s);
 }
});
test('cannot claim relative chronology, skip source checks or inject a production gate',()=>{
 let s=fresh();
 for(const action of [
   {type:'finish'},{type:'compare'},{type:'walk',value:'north-hill'},
   {type:'grant-canon'},{type:'start',extra:true},{type:'place',card:'a',slot:'before-1900'}
 ])assert.deepEqual(dispatch(s,action),s);
 s=act(s,'start');s=act(s,'walk',{value:'compare'});
 assert.equal(can(s,{type:'place',card:'a',slot:'unknown'}),false);
 assert.equal(can(s,{type:'compare'}),false);
 const good=finish(true),forged=structuredClone(good);
 forged.unlocks.push('s01e06');
 assert.equal(restore(forged),null);
 assert.deepEqual(dispatch(forged,{type:'finish'}),fresh());
 const bad=structuredClone(good);bad.history.push({type:'grant-canon'});
 assert.equal(restore(bad),null);
 assert.equal(replay(Array(MAX_STEPS+1).fill({type:'start'})),null);
});
test('revising a tested card invalidates the old result and requires another comparison',()=>{
 let s=atTimeline();
 for(const card of ['a','b']){
   s=act(s,'place',{card,slot:'unknown'});s=act(s,'test',{card});
 }
 s=act(s,'compare');
 assert.equal(view(s).compared,true);
 s=act(s,'place',{card:'a',slot:'earlier'});
 assert.equal(view(s).compared,false);
 assert.equal(view(s).tested.a,null);
 assert.equal(can(s,{type:'finish'}),false);
 s=act(s,'test',{card:'a'});
 assert.equal(can(s,{type:'compare'}),false);
 s=act(s,'place',{card:'a',slot:'unknown'});
 s=act(s,'test',{card:'a'});s=act(s,'compare');s=act(s,'finish');
 assert.equal(view(s).phase,'finished');
});
