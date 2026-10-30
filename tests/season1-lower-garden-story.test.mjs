import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch,replay,restore,can,view,MAX_STEPS} from '../authoring-labs/lower-garden-story-model.mjs';
const a=(s,type,value)=>dispatch(s,value?{type,value}:{type});
function upper(){
 let s=a(fresh(),'start');
 s=a(s,'inspect','present-bed');s=a(s,'walk','slope');s=a(s,'inspect','slope');
 s=a(s,'walk','model-tray');s=a(s,'run');s=a(s,'weather','rain');s=a(s,'run');
 s=a(s,'channel','blocked');s=a(s,'run');s=a(s,'compare');return s;
}
function lower(){
 let s=a(upper(),'enter');
 s=a(s,'inspect','runoff-trace');s=a(s,'walk','public-path');s=a(s,'inspect','public-path');
 return s;
}
function site(s,id){
 s=a(s,'walk',id);s=a(s,'place',id);return a(s,'check');
}
test('opening and actual upper observations/model gate the distinct Lower Garden',()=>{
 let s=fresh();
 assert.equal(view(s).phase,'opening');
 assert.equal(can(s,{type:'enter'}),false);
 s=a(s,'start');s=a(s,'inspect','present-bed');
 assert.equal(can(s,{type:'enter'}),false);
 s=upper();
 assert.equal(view(s).modelCompared,true);
 assert.equal(can(s,{type:'enter'}),true);
 s=a(s,'enter');
 assert.equal(view(s).phase,'lower');
 assert.equal(view(s).lowerVisited,true);
 assert.equal(can(s,{type:'place',value:'raised-pocket'}),false);
});
test('child moves Milo, inspects two lower anchors, tests unsafe and safe markers',()=>{
 let s=lower();
 assert.equal(can(s,{type:'finish'}),false);
 s=site(s,'runoff-channel');
 assert.match(view(s).line,/wet/);
 assert.equal(view(s).attempts[0].wet,true);
 assert.equal(can(s,{type:'think',value:'keep-path'}),false);
 s=site(s,'footpath');
 assert.equal(view(s).attempts[1].blocksPath,true);
 s=site(s,'raised-pocket');
 assert.equal(view(s).attempts[2].provisional,true);
 assert.match(view(s).parentCue,/What changed/);
 assert.equal(can(s,{type:'think',value:'keep-path'}),true);
 s=a(s,'think','keep-path');
 assert.equal(can(s,{type:'finish'}),true);
 s=a(s,'finish');
 const v=view(s);
 assert.equal(v.phase,'finished');
 assert.equal(v.presentGardenHealthy,true);
 assert.match(v.paperNote,/UNKNOWN/);
 assert.match(v.paperNote,/permission/);
 assert.deepEqual(v.canonicalEvents,[]);
 assert.deepEqual(v.unlocks,[]);
 assert.deepEqual(v.historicalClaims,[]);
 assert.deepEqual(replay(s.history),s);
 assert.deepEqual(restore(structuredClone(s)),s);
 assert.deepEqual(a(s,'enter'),s);
});
test('safe placement before comparison cannot finish; revised placement invalidates thought',()=>{
 let s=site(lower(),'raised-pocket');
 assert.equal(can(s,{type:'think',value:'need-more'}),false);
 s=site(s,'footpath');
 s=a(s,'think','need-more');
 assert.equal(can(s,{type:'finish'}),false);
 s=site(s,'raised-pocket');
 assert.equal(view(s).thought,null);
 s=a(s,'think','need-more');
 assert.equal(can(s,{type:'finish'}),true);
});
test('forged evidence, permission, history and unlocks fail closed',()=>{
 const s=site(lower(),'runoff-channel');
 for(const bad of [{type:'finish'},{type:'grant-permission'},
  {type:'place',value:'north-hill'},{type:'think',value:'real-flood'},
  {type:'check',ownerApproved:true},{type:'enter'}]){
  assert.deepEqual(dispatch(s,bad),s);
 }
 const finished=a(a(site(s,'raised-pocket'),'think','keep-path'),'finish');
 for(const edit of [
  x=>x.unlocks.push('s01e07'),x=>x.canonicalEvents.push('planted'),
  x=>x.historicalClaims.push('dated flood'),x=>x.garden.lowerPreviewStarted=false,
  x=>x.attempts[0].wet=false,x=>x.history[1].value='fake'
 ]){
  const bad=structuredClone(finished);edit(bad);
  assert.equal(restore(bad),null);
  assert.deepEqual(dispatch(bad,{type:'start'}),fresh());
 }
 assert.equal(replay(Array(MAX_STEPS+1).fill({type:'start'})),null);
});
