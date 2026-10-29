import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch,restore,replay,project,MAX_ACTIONS} from '../authoring-labs/garden-connector.mjs';
const act=(s,scene,type,more={})=>dispatch(s,{scene,type,...more});
const g=(s,type,more={})=>act(s,'garden',type,more);
const c=(s,type,more={})=>act(s,'connector',type,more);
const nav=(s,type)=>act(s,'nav',type);
function planted(){
 let s=fresh();
 for(const id of ['slope','shared-path']){s=g(s,'walk-to',{target:id});s=g(s,'inspect',{id});}
 s=g(s,'walk-to',{target:'model-tray'});s=g(s,'run-model');
 s=g(s,'set-weather',{weather:'rain'});s=g(s,'run-model');
 s=g(s,'set-channel',{channel:'blocked'});s=g(s,'run-model');
 s=g(s,'compare-model');s=g(s,'visit-lower');
 s=g(s,'inspect',{id:'runoff-trace'});
 s=g(s,'walk-to',{target:'public-path'});s=g(s,'inspect',{id:'public-path'});
 for(const site of ['runoff-channel','footpath','raised-pocket']){
  s=g(s,'walk-to',{target:site});s=g(s,'move-marker',{site});s=g(s,'inspect-result');
  if(site!=='raised-pocket')assert.equal(g(s,'confirm-small-trial').garden.lowerPreviewStarted,false);
 }
 return g(s,'confirm-small-trial');
}
function first(){
 let s=nav(planted(),'to-connector');
 s=c(s,'walk',{anchor:'shared-path'});s=c(s,'inspect',{anchor:'shared-path'});
 s=c(s,'walk',{anchor:'channel'});s=c(s,'inspect',{anchor:'channel'});
 s=c(s,'walk',{anchor:'workbench'});
 for(const type of ['test-milo','test-resident','test-water'])s=c(s,type);
 return s;
}
function complete(){
 let s=first();
 s=c(s,'place-piece',{pieceId:'connector',snapId:'path-clear-water-blocked'});
 s=c(s,'run-all-traces');assert.equal(s.connector.revisedTrials.water.pass,false);
 assert.deepEqual(c(s,'compare-layouts'),s);
 s=c(s,'place-piece',{pieceId:'connector',snapId:'side-offset'});
 s=c(s,'run-all-traces');s=c(s,'compare-layouts');s=c(s,'confirm-preview');
 return s;
}
test('garden trial is required; no fake E07 unlock or direct connector shortcut',()=>{
 const s=fresh();assert.deepEqual(nav(s,'to-connector'),s);
 assert.deepEqual(c(s,'test-milo'),s);
 assert.equal(project(planted()).pocketStage,'paper-seed');
 assert.equal(nav(planted(),'to-connector').stage,'connector');
});
test('paper growth changes visibly only after child tests and revision',()=>{
 const s=first(),p=project(s);
 assert.equal(p.pocketStage,'paper-sprout');
 assert.equal(s.connector.firstTrials.milo.pass,true);
 assert.equal(s.connector.firstTrials.resident.pass,false);
 assert.equal(s.connector.firstTrials.water.pass,false);
 const done=complete();
 assert.equal(project(done).pocketStage,'paper-leaves');
 assert.equal(done.connector.previewComplete,true);
 assert.deepEqual(project(done).canonicalEvents,[]);
 assert.deepEqual(project(done).unlocks,[]);
});
test('garden revisit retains the pocket and connector result without storage',()=>{
 let s=complete();s=nav(s,'to-garden');
 assert.equal(project(s).pocketStage,'paper-leaves');
 assert.equal(project(s).upperGardenHealthy,true);
 s=nav(s,'to-connector');assert.equal(s.connector.previewComplete,true);
 assert.deepEqual(s.canonicalEvents,[]);assert.deepEqual(s.historicalClaims,[]);
 assert.equal('localStorage' in s,false);
});
test('strict replay rejects forged claims, history, state and unknown commands',()=>{
 const s=complete();assert.ok(s.history.length<MAX_ACTIONS);
 assert.deepEqual(restore(structuredClone(s)),s);
 assert.deepEqual(replay(s.history),s);
 for(const change of [
  x=>x.unlocks.push('s01e08'),x=>x.canonicalEvents.push('garden:done'),
  x=>x.garden.lowerPreviewStarted=false,x=>x.connector.previewComplete=false,
  x=>x.history[0].fake='true',x=>x.history.push({scene:'nav',type:'to-common'}),
  x=>x.mode='production'
 ]){
  const bad=structuredClone(s);change(bad);
  assert.equal(restore(bad),null);
  assert.deepEqual(nav(bad,'to-garden'),fresh());
 }
 for(const a of [{scene:'nav',type:'to-common'},
  {scene:'connector',type:'confirm-preview',unlock:true},
  {scene:'garden',type:'move-marker',site:'real-hill'},null]){
  assert.deepEqual(dispatch(s,a),s);
 }
});
