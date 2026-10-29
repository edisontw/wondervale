import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch,restore,replay,project,MAX_ACTIONS} from '../authoring-labs/world-change.mjs';
const doIt=(s,scene,type,props={})=>dispatch(s,{scene,type,...props});
const e5=(s,type,props={})=>doIt(s,'e05',type,props);
const e6=(s,type,props={})=>doIt(s,'e06',type,props);
const nav=(s,type)=>doIt(s,'nav',type);
function station(){
 let s=fresh();
 for(const id of ['peg-pair','worn-edge'])s=e5(s,'inspect-feature',{id});
 s=e5(s,'place-replica',{orientation:'side-b'});s=e5(s,'compare-fit');
 assert.equal(s.e05.comparison.matched,false);
 s=e5(s,'place-replica',{orientation:'side-a'});s=e5(s,'compare-fit');
 s=e5(s,'note-limits');
 s=e5(s,'place-table',{position:'across-walkway'});
 assert.equal(project(s).mapRoomVisible,false);
 s=e5(s,'place-table',{position:'near-wall'});s=e5(s,'confirm-room');
 return s;
}
function garden(){
 let s=nav(station(),'to-current');
 for(const id of ['slope','shared-path']){
  s=e6(s,'walk-to',{target:id});s=e6(s,'inspect',{id});
 }
 s=e6(s,'walk-to',{target:'model-tray'});s=e6(s,'run-model');
 s=e6(s,'set-weather',{weather:'rain'});s=e6(s,'run-model');
 s=e6(s,'set-channel',{channel:'blocked'});s=e6(s,'run-model');
 s=e6(s,'compare-model');return s;
}
function lower(){
 let s=e6(garden(),'visit-lower');
 s=e6(s,'inspect',{id:'runoff-trace'});
 s=e6(s,'walk-to',{target:'public-path'});s=e6(s,'inspect',{id:'public-path'});
 for(const site of ['runoff-channel','footpath','raised-pocket']){
  s=e6(s,'walk-to',{target:site});s=e6(s,'move-marker',{site});
  s=e6(s,'inspect-result');
  if(site!=='raised-pocket')assert.equal(e6(s,'confirm-small-trial').e06.lowerPreviewStarted,false);
 }
 return e6(s,'confirm-small-trial');
}
test('E05 must create a corridor-clear paper Map Room before E06 can be visited',()=>{
 const s=fresh();
 assert.deepEqual(nav(s,'to-current'),s);
 assert.deepEqual(e6(s,'run-model'),s);
 const ready=station();
 assert.equal(project(ready).mapRoomVisible,true);
 assert.equal(nav(ready,'to-current').stage,'current');
 assert.deepEqual(project(ready).canonicalEvents,[]);
});
test('E06 requires real in-model observation, three model trials, then separate lower-site constraints',()=>{
 const s=garden();
 assert.equal(project(s).rainCompared,true);
 assert.equal(project(s).upperGardenHealthy,true);
 assert.equal(project(s).lowerPocketVisible,false);
 assert.equal(e6(s,'confirm-small-trial').e06.phase,'current');
 assert.equal(e6(s,'visit-lower').stage,'lower');
});
test('visible paper world changes persist across visits without canonical state or storage',()=>{
 let s=lower();let p=project(s);
 assert.equal(p.mapRoomVisible,true);assert.equal(p.rainCompared,true);
 assert.equal(p.lowerPocketVisible,true);assert.equal(p.upperGardenHealthy,true);
 s=nav(s,'to-station');assert.equal(s.stage,'station');assert.equal(project(s).lowerPocketVisible,true);
 s=nav(s,'to-current');assert.equal(s.stage,'current');assert.equal(project(s).upperGardenHealthy,true);
 s=nav(s,'to-lower');assert.equal(s.stage,'lower');assert.equal(project(s).lowerPocketVisible,true);
 assert.deepEqual(s.canonicalEvents,[]);assert.deepEqual(s.unlocks,[]);
 assert.deepEqual(p.historicalClaims,[]);
 assert.equal('localStorage' in s,false);
});
test('strict deterministic replay rejects forged completion, unlock, history and unknown actions',()=>{
 const s=lower();
 assert.deepEqual(restore(structuredClone(s)),s);
 assert.deepEqual(replay(s.history),s);
 for(const mutate of [
  x=>x.unlocks.push('s01e07'),
  x=>x.canonicalEvents.push('s01e06:done'),
  x=>x.e06.lowerPreviewStarted=false,
  x=>x.e05.roomPreview=false,
  x=>x.history.push({scene:'nav',type:'to-common'}),
  x=>x.history[0].fake='history',
  x=>x.version='production'
 ]){
  const bad=structuredClone(s);mutate(bad);
  assert.equal(restore(bad),null);
  assert.deepEqual(doIt(bad,'nav','to-station'),fresh());
 }
 for(const a of [{scene:'nav',type:'to-common'},{scene:'e06',type:'visit-lower',canonical:true},
  {scene:'e05',type:'grant-unlock'},{scene:'e06',type:'inspect',id:'fake'},null]){
  assert.deepEqual(dispatch(s,a),s);
 }
 assert.ok(s.history.length<MAX_ACTIONS);
});
