import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch,can,view,replay,restore,MAX_STEPS} from '../authoring-labs/shortcut-story-model.mjs';
const act=(s,type,value)=>dispatch(s,value?{type,value}:{type});
function observed(){
 let s=act(fresh(),'start');
 s=act(s,'walk','shared-path');s=act(s,'inspect','shared-path');
 s=act(s,'walk','channel');s=act(s,'inspect','channel');
 return act(s,'walk','workbench');
}
function first(){
 let s=observed();
 for(const kind of ['milo','resident','water'])s=act(s,'trial',kind);
 return s;
}
function revised(snap='side-offset'){
 let s=act(first(),'place',snap);
 for(const kind of ['milo','resident','water'])s=act(s,'trial',kind);
 return s;
}
test('opening requires Milo to walk, inspect shared use and water before testing',()=>{
 let s=fresh();
 assert.equal(view(s).stage,'opening');
 assert.equal(can(s,{type:'trial',value:'milo'}),false);
 s=act(s,'start');
 assert.equal(can(s,{type:'walk',value:'workbench'}),false,'no teleport');
 s=act(s,'walk','shared-path');s=act(s,'inspect','shared-path');
 assert.equal(can(s,{type:'trial',value:'milo'}),false);
 s=observed();
 assert.equal(can(s,{type:'trial',value:'milo'}),true);
 assert.equal(can(s,{type:'trial',value:'resident'}),false);
 assert.equal(view(s).milo,'workbench');
});
test('first success is partial; real model overlap is visible and Finn revises without blame',()=>{
 let s=act(observed(),'trial','milo');
 assert.equal(view(s).firstTrials.milo.pass,true);
 assert.match(view(s).parentCue,/Who else/);
 assert.equal(can(s,{type:'finish'}),false);
 s=act(s,'trial','resident');
 assert.equal(view(s).firstTrials.resident.pass,false);
 s=act(s,'trial','water');
 assert.equal(view(s).stage,'revise');
 assert.equal(view(s).firstTrials.water.pass,false);
 assert.equal(view(s).layout.layout,'short-crossing');
 assert.equal(view(s).upperHillClosed,true);
 assert.equal(view(s).lightsOff,true);
});
test('wrong model revision has specific observable side effect and nonpunitive retry',()=>{
 let s=act(first(),'place','path-clear-water-blocked');
 for(const kind of ['milo','resident','water'])s=act(s,'trial',kind);
 assert.equal(view(s).revisedTrials.resident.pass,true);
 assert.equal(view(s).revisedTrials.water.pass,false);
 assert.equal(can(s,{type:'compare'}),false);
 s=act(s,'place','side-offset');
 assert.deepEqual(view(s).revisedTrials,{milo:null,resident:null,water:null});
 for(const kind of ['water','milo','resident'])s=act(s,'trial',kind);
 assert.equal(can(s,{type:'compare'}),true);
 s=act(s,'compare');
 assert.equal(view(s).stage,'compare');
 assert.equal(view(s).firstNow.first.traces.water.pass,false);
 assert.equal(view(s).firstNow.now.traces.water.pass,true);
 s=act(s,'finish');
 assert.equal(view(s).stage,'finished');
 assert.match(view(s).line,/who else/);
 assert.match(view(s).paperNote,/UNKNOWN/);
 assert.match(view(s).paperNote,/OFF/);
 assert.deepEqual(view(s).canonicalEvents,[]);
 assert.deepEqual(view(s).unlocks,[]);
 assert.deepEqual(view(s).historicalClaims,[]);
 assert.deepEqual(replay(s.history),s);
 assert.deepEqual(restore(structuredClone(s)),s);
});
test('two offset strategies work, undo invalidates stale trial, and no finish without comparison',()=>{
 for(const snap of ['side-offset','lower-offset']){
  let s=revised(snap);
  assert.equal(view(s).revisedTrials.milo.pass,true);
  assert.equal(view(s).revisedTrials.resident.pass,true);
  assert.equal(view(s).revisedTrials.water.pass,true);
  assert.equal(can(s,{type:'finish'}),false);
  s=act(s,'compare');s=act(s,'finish');
  assert.equal(view(s).previewComplete,true);
  assert.deepEqual(act(s,'walk','entry'),s);
 }
 let s=act(first(),'place','side-offset');
 s=act(s,'trial','milo');
 s=act(s,'undo');
 assert.equal(view(s).layout.layout,'short-crossing');
 assert.deepEqual(view(s).revisedTrials,{milo:null,resident:null,water:null});
 assert.equal(can(s,{type:'compare'}),false);
});
test('strict replay rejects forged approval, false history, fake snap and canonical unlock',()=>{
 const s=act(revised(),'compare');
 for(const action of [{type:'finish',permission:true},{type:'place',value:'north-hill'},
  {type:'grant-canon'},{type:'trial',value:'historical-proof'},{type:'walk',value:'north-hill'}]){
  assert.deepEqual(dispatch(s,action),s);
 }
 for(const mutate of [
  x=>x.unlocks.push('e08'),x=>x.canonicalEvents.push('connector-built'),
  x=>x.historicalClaims.push('dated flood'),x=>x.connector.previewComplete=true,
  x=>x.connector.revisedTrials.water.pass=false,x=>x.history[0].type='finish'
 ]){
  const bad=structuredClone(s);mutate(bad);
  assert.equal(restore(bad),null);
  assert.deepEqual(dispatch(bad,{type:'finish'}),fresh());
 }
 assert.equal(replay(Array(MAX_STEPS+1).fill({type:'start'})),null);
});
