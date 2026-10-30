import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch,can,view,replay,restore,MAX_STEPS} from '../authoring-labs/lantern-story-model.mjs';
const act=(s,type,key,value)=>dispatch(s,key?{type,[key]:value}:{type});
function prepared(){
 let s=act(fresh(),'start');
 for(const feature of ['brackets','boundary','lower-a'])s=act(s,'inspect','feature',feature);
 s=act(s,'toggle-lamp','lampId','lower-a');
 s=act(s,'walk','anchor','lower-landing');
 s=act(s,'inspect','feature','lower-b');
 return s;
}
function complete(){
 let s=act(prepared(),'toggle-lamp','lampId','lower-b');
 s=act(s,'walk','anchor','base');s=act(s,'observe-view');
 s=act(s,'walk','anchor','lower-landing');s=act(s,'walk','anchor','side');
 s=act(s,'observe-view');s=act(s,'compare-views');
 s=act(s,'inspect','feature','service-plate');return act(s,'confirm-preview');
}
test('Milo must start, inspect closed boundary and both lower lamps; upper hill never becomes walkable',()=>{
 let s=fresh();
 assert.equal(can(s,{type:'walk',anchor:'side'}),false);
 s=act(s,'start');
 assert.equal(can(s,{type:'walk',anchor:'side'}),false);
 assert.equal(can(s,{type:'toggle-lamp',lampId:'lower-a'}),false);
 s=prepared();
 assert.equal(view(s).lights['lower-a'],true);
 assert.equal(can(s,{type:'observe-view'}),false);
 assert.equal(can(s,{type:'walk',anchor:'upper-closed'}),false);
 assert.equal(view(s).upperHillClosed,true);
});
test('a partial lamp trial is reversible and two different actual viewpoints are needed',()=>{
 let s=prepared();
 assert.match(view(s).line,/PAPER/);
 s=act(s,'toggle-lamp','lampId','lower-b');
 s=act(s,'walk','anchor','base');
 s=act(s,'observe-view');
 assert.match(view(s).parentCue,/another safe place/);
 assert.equal(can(s,{type:'compare-views'}),false);
 s=act(s,'observe-view');
 assert.equal(can(s,{type:'compare-views'}),false);
 s=act(s,'walk','anchor','lower-landing');s=act(s,'walk','anchor','side');
 s=act(s,'observe-view');s=act(s,'compare-views');
 assert.equal(view(s).compared,true);
 assert.ok(view(s).comparison.spreadDifferenceDegrees>=5);
 assert.equal(can(s,{type:'confirm-preview'}),false,'plate source check still required');
 s=act(s,'toggle-lamp','lampId','lower-a');
 assert.equal(view(s).compared,false,'light change invalidates stale observations');
 assert.equal(view(s).observations.length,0);
});
test('paper ending keeps unknown date, closed hill, no canonical Chronicle or E09 unlock',()=>{
 const s=complete(),v=view(s);
 assert.equal(v.stage,'finished');
 assert.match(v.paperNote,/UNKNOWN/);
 assert.match(v.paperNote,/NOT UNLOCKED/);
 assert.deepEqual(v.canonicalEvents,[]);assert.deepEqual(v.unlocks,[]);
 assert.deepEqual(v.historicalClaims,[]);assert.equal(v.historicalDate,null);
 assert.equal(v.realLightingApproved,false);assert.equal(v.upperHillClosed,true);
 assert.deepEqual(replay(s.history),s);assert.deepEqual(restore(structuredClone(s)),s);
 assert.deepEqual(act(s,'walk','anchor','base'),s);
 assert.equal(view(dispatch(s,{type:'reset'})).stage,'opening');
});
test('strict replay rejects forged actions, completion, source years and snapshot tampering',()=>{
 const s=complete();
 for(const a of [{type:'walk',anchor:'upper-closed'},{type:'confirm-preview',year:1920},
  {type:'grant-unlock'},{type:'walk',anchor:'side',permission:true}]){
  assert.deepEqual(dispatch(s,a),s);
 }
 for(const change of [x=>x.unlocks.push('e09'),x=>x.steps.previewComplete=false,
  x=>x.historicalClaims.push('date'),x=>x.steps.lights['lower-a']=false,
  x=>x.history[0].type='confirm-preview']){
  const bad=structuredClone(s);change(bad);
  assert.equal(restore(bad),null);
  assert.deepEqual(dispatch(bad,{type:'confirm-preview'}),fresh());
 }
 assert.equal(replay(Array(MAX_STEPS+1).fill({type:'start'})),null);
});
