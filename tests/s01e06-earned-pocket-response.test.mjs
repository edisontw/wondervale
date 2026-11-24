import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch,replay} from '../engine/s01e06-authoring-prototype.mjs';
import {lowerGardenRevisit} from '../engine/s01e06-lower-revisit.mjs';
const a=(s,type,extra={})=>dispatch(s,{type,...extra});
const walk=(s,target)=>a(s,'walk-to',{target});
const inspect=(s,id)=>a(walk(s,id),'inspect',{id});
function lower(){
 let s=inspect(inspect(fresh(),'slope'),'shared-path');
 s=walk(s,'model-tray');
 s=a(s,'run-model');
 s=a(s,'set-weather',{weather:'rain'});s=a(s,'run-model');
 s=a(s,'set-channel',{channel:'blocked'});s=a(s,'run-model');
 s=a(s,'compare-model');s=a(s,'visit-lower');
 s=a(s,'inspect',{id:'runoff-trace'});
 return inspect(s,'public-path');
}
function mark(s,site){return a(walk(s,site),'move-marker',{site});}
function done(revise){
 let s=lower();
 if(revise){s=mark(s,'runoff-channel');s=a(s,'inspect-result');}
 s=mark(s,'raised-pocket');s=a(s,'inspect-result');
 return a(s,'confirm-small-trial');
}
test('E06 clean-first and revised PAPER trials earn different Nia/Finn responses',()=>{
 const clean=done(false),revised=done(true);
 const first=lowerGardenRevisit(clean.history,'now');
 const second=lowerGardenRevisit(revised.history,'now');
 assert.equal(first.revised,false);
 assert.equal(second.revised,true);
 assert.match(first.response,/checked the water and path first/);
 assert.match(second.response,/moved the pocket away/);
 assert.equal(first.now.pocket,'model-sprout');
 assert.equal(second.now.pocket,'model-sprout');
 for(const v of [first,second]){
  assert.deepEqual(v.canonicalEvents,[]);
  assert.deepEqual(v.unlocks,[]);
  assert.deepEqual(v.historicalClaims,[]);
  assert.deepEqual(v,replay(v===first?clean.history:revised.history) && lowerGardenRevisit(v===first?clean.history:revised.history,'now'));
 }
});
test('E06 water/path attempts are nonpunitive; forged history cannot earn a response',()=>{
 let s=mark(lower(),'runoff-channel');
 assert.match(lowerGardenRevisit(s.history).response,/Water passes here/);
 s=mark(s,'footpath');
 assert.match(lowerGardenRevisit(s.history).response,/People need this path/);
 assert.equal(lowerGardenRevisit([...s.history,{type:'grant-canon'}]),null);
 assert.equal(lowerGardenRevisit([...s.history,{type:'confirm-small-trial'}]),null);
 assert.equal(lowerGardenRevisit(fresh().history).revised,false);
});
