import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch,replay,restore,can,view,MAX_STEPS} from '../authoring-labs/current-garden-story-model.mjs';
const a=(s,type,value)=>dispatch(s,value?{type,value}:{type});
function observed(){
 let s=a(fresh(),'start');
 s=a(s,'inspect','present-bed');
 s=a(s,'walk','slope');s=a(s,'inspect','slope');
 return s;
}
function complete(guess='put-back',revision='small-test'){
 let s=observed();
 s=a(s,'guess',guess);s=a(s,'walk','model-tray');
 s=a(s,'run');s=a(s,'weather','rain');s=a(s,'run');
 s=a(s,'channel','blocked');s=a(s,'run');
 s=a(s,'compare');s=a(s,'revise',revision);
 return s;
}
test('opening is a real trigger; Milo must move and inspect before predicting',()=>{
 let s=fresh();
 assert.equal(view(s).phase,'opening');
 assert.equal(can(s,{type:'inspect',value:'present-bed'}),false);
 assert.equal(can(s,{type:'guess',value:'put-back'}),false);
 s=a(s,'start');s=a(s,'inspect','present-bed');
 assert.equal(can(s,{type:'guess',value:'put-back'}),false);
 s=a(s,'walk','slope');s=a(s,'inspect','slope');
 assert.match(view(s).line,/higher now/);
 assert.equal(can(s,{type:'guess',value:'put-back'}),true);
 assert.equal(view(s).parentCue,null);
});
test('rain, dry, open and blocked are observed, not merely answered',()=>{
 let s=observed();s=a(s,'guess','not-sure');s=a(s,'walk','model-tray');
 assert.equal(can(s,{type:'compare'}),false);
 s=a(s,'run');assert.equal(view(s).lastRun.catchment,0);
 s=a(s,'weather','rain');s=a(s,'run');assert.equal(view(s).lastRun.catchment,1);
 assert.equal(can(s,{type:'compare'}),false);
 s=a(s,'channel','blocked');s=a(s,'run');assert.equal(view(s).lastRun.catchment,3);
 s=a(s,'compare');
 assert.equal(view(s).phase,'review');
 assert.match(view(s).parentCue,/What might happen/);
 assert.match(view(s).line,/prove why the real garden moved/);
 assert.equal(can(s,{type:'revise',value:'small-test'}),true);
});
test('two different revisions finish without inventing history or unlocking Lower Garden',()=>{
 for(const guess of ['put-back','not-sure'])for(const revision of ['small-test','need-evidence']){
  const s=complete(guess,revision),v=view(s);
  assert.equal(v.phase,'finished');assert.equal(v.currentGardenHealthy,true);
  assert.equal(v.runs.length,3);
  assert.match(v.paperNote,/UNKNOWN/);
  assert.deepEqual(v.canonicalEvents,[]);
  assert.deepEqual(v.unlocks,[]);
  assert.deepEqual(v.historicalClaims,[]);
  assert.deepEqual(replay(s.history),s);
  assert.deepEqual(restore(structuredClone(s)),s);
  assert.deepEqual(a(s,'start'),s);
 }
});
test('wrong early guesses, forged sources, unapproved history and tampered state fail closed',()=>{
 let s=observed();
 for(const bad of [{type:'visit-lower'},{type:'grant-canon'},
  {type:'guess',value:'historical-flood'},{type:'guess',value:'put-back',admin:true},
  {type:'weather',value:'flood'},{type:'revise',value:'common-open'}]){
  assert.deepEqual(dispatch(s,bad),s);
 }
 const good=complete();
 for(const change of [
  x=>x.unlocks.push('s01e07'),x=>x.historicalClaims.push('real flood'),
  x=>x.garden.modelRuns[0].catchment=100,x=>x.phase='canonical',
  x=>x.history.push({type:'grant-canon'}),x=>x.history[1].value='fake'
 ]){
  const bad=structuredClone(good);change(bad);
  assert.equal(restore(bad),null);
  assert.deepEqual(dispatch(bad,{type:'start'}),fresh());
 }
 assert.equal(replay(Array(MAX_STEPS+1).fill({type:'start'})),null);
});
