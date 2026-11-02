// E10 reversible fictional-use staging, distinct from E10's present-needs board.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch} from '../authoring-labs/unnamed-story-model.mjs';
import {source,freshTrial,dispatchTrial,viewTrial,MAX_ACTIONS} from '../e10-scene/use-staging.mjs';
const act=(s,type,extra={})=>dispatch(s,{type,...extra});
function inspected(){
 let s=act(fresh(),'start');
 s=act(s,'walk',{to:'stone_edge'});s=act(s,'inspect',{traceId:'surface'});
 s=act(s,'suggest',{traceId:'surface',useTag:'resting'});
 s=act(s,'walk',{to:'entry'});s=act(s,'walk',{to:'notice_wall'});
 s=act(s,'inspect',{traceId:'holes'});s=act(s,'suggest',{traceId:'holes',useTag:'display'});
 return s;
}
test('two child inspections and tentative ideas are required, never a guessed history',()=>{
 const s=act(fresh(),'start');
 assert.equal(source(s),null);
 assert.equal(viewTrial(freshTrial(),s),null);
 assert.deepEqual(dispatchTrial(freshTrial(),{type:'place',prop:'seat',anchor:'stone_edge'},s),freshTrial());
 const ready=inspected(),v=viewTrial(freshTrial(),ready);
 assert.ok(source(ready));assert.ok(v);
 assert.deepEqual(v.canonicalEvents,[]);assert.deepEqual(v.unlocks,[]);
 assert.deepEqual(v.historicalClaims,[]);assert.deepEqual(v.rights,[]);
});
test('Milo moves cutouts, observes overlap, revises and leaves history UNKNOWN',()=>{
 const s=inspected();let t=freshTrial();
 t=dispatchTrial(t,{type:'place',prop:'seat',anchor:'stone_edge'},s);
 t=dispatchTrial(t,{type:'place',prop:'notice',anchor:'stone_edge'},s);
 t=dispatchTrial(t,{type:'compare'},s);
 let v=viewTrial(t,s);
 assert.equal(v.conflict,true);assert.equal(v.revised,false);
 assert.deepEqual(v.first,{seat:'stone_edge',notice:'stone_edge'});
 t=dispatchTrial(t,{type:'place',prop:'notice',anchor:'notice_wall'},s);
 assert.equal(viewTrial(t,s).compared,false);
 t=dispatchTrial(t,{type:'compare'},s);v=viewTrial(t,s);
 assert.equal(v.conflict,false);assert.equal(v.revised,true);
 assert.match(v.paperNote,/UNKNOWN/);assert.match(v.paperNote,/SEEN traces unchanged/);
 assert.deepEqual(v.now,{seat:'stone_edge',notice:'notice_wall'});
 t=dispatchTrial(t,{type:'remove',prop:'seat'},s);
 assert.equal(viewTrial(t,s).compared,false);
 t=dispatchTrial(t,{type:'place',prop:'seat',anchor:'stone_edge'},s);
 assert.equal(viewTrial(t,s).revised,false);
 t=dispatchTrial(t,{type:'compare'},s);
 assert.equal(viewTrial(t,s).revised,true);
});
test('invalid moves, forged actions, altered source and reset fail closed',()=>{
 const s=inspected();let t=freshTrial();
 for(const a of [{type:'place',prop:'seat',anchor:'closed_hill'},
  {type:'place',prop:'seat',anchor:'stone_edge',approved:true},
  {type:'compare'},{type:'unlock'},{type:'remove',prop:'seat'}]){
  assert.deepEqual(dispatchTrial(t,a,s),t);
 }
 t=dispatchTrial(t,{type:'place',prop:'seat',anchor:'stone_edge'},s);
 const forged=structuredClone(t);forged.history[0].anchor='closed_hill';
 assert.equal(viewTrial(forged,s),null);
 const fake=structuredClone(t);fake.unlocks=['e11'];assert.equal(viewTrial(fake,s),null);
 const revised=act(s,'revise',{traceId:'holes',oldTag:'display',newTag:'meeting'});
 assert.equal(viewTrial(t,revised),null);
 assert.deepEqual(dispatchTrial(t,{type:'compare'},revised),freshTrial());
 assert.deepEqual(dispatchTrial(t,{type:'reset'},s),freshTrial());
 const reset=act(s,'reset');assert.equal(viewTrial(t,reset),null);
 const tooLong={...t,history:Array(MAX_ACTIONS+1).fill({type:'compare'})};
 assert.equal(viewTrial(tooLong,s),null);
});
