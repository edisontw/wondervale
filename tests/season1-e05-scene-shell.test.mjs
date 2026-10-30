import test from 'node:test';
import assert from 'node:assert/strict';
import {VERSION,MAX_ACTIONS,fresh,dispatch,restore,replay,view,can} from '../e05-scene/scene-model.mjs';
const n=(s,type)=>dispatch(s,{scene:'nav',type});
const a=(s,scene,type,props={})=>dispatch(s,{scene,action:{type,...props}});
function toRecords(wrongFirst=false){
 let s=fresh();s=a(s,'station','start');s=a(s,'station','walk',{value:'board'});
 s=a(s,'station','inspect',{value:'peg-pair'});s=a(s,'station','inspect',{value:'worn-edge'});
 s=a(s,'station','guess',{value:'unsure'});
 if(wrongFirst){s=a(s,'station','try-copy',{value:'side-b'});s=a(s,'station','check');
   assert.equal(view(s).station.fit,false);}
 s=a(s,'station','try-copy',{value:'side-a'});s=a(s,'station','check');
 s=a(s,'station','qualify');return n(s,'to-records');
}
function toLayout(wrongFirst=false){
 let s=toRecords(wrongFirst);s=a(s,'sources','start');
 for(const card of ['a','b']){
  s=a(s,'sources','walk',{value:'desk-'+card});
  s=a(s,'sources','inspect',{card});s=a(s,'sources','source-check',{card});
 }
 s=a(s,'sources','walk',{value:'compare'});
 if(wrongFirst){s=a(s,'sources','place',{card:'a',slot:'earlier'});
   s=a(s,'sources','test',{card:'a'});assert.equal(view(s).sources.tested.a,'needs-source');}
 for(const card of ['a','b']){
  s=a(s,'sources','place',{card,slot:'unknown'});
  s=a(s,'sources','test',{card});
 }
 s=a(s,'sources','compare');s=a(s,'sources','finish');return n(s,'to-layout');
}
function finish(wrongFirst=false){
 let s=toLayout(wrongFirst);s=a(s,'station','walk',{value:'table'});
 s=a(s,'station','place-table',{value:'across-walkway'});
 assert.equal(can(s,{scene:'station',action:{type:'confirm'}}),false);
 s=a(s,'station','place-table',{value:'near-wall'});
 s=a(s,'station','confirm');s=a(s,'station','reflect');return n(s,'to-review');
}
test('E05 scene shell reuses board test and MOCK source checks before room placement',()=>{
 let s=fresh();assert.equal(view(s).productionEntryReady,false);
 assert.equal(can(s,{scene:'nav',type:'to-records'}),false);
 assert.equal(can(s,{scene:'station',action:{type:'confirm'}}),false);
 s=toRecords(true);assert.equal(view(s).stage,'records');
 assert.equal(can(s,{scene:'nav',type:'to-layout'}),false);
 assert.equal(can(s,{scene:'station',action:{type:'place-table',value:'near-wall'}}),false);
 assert.deepEqual(view(s).canonicalEvents,[]);
});
test('mismatch-first and fit-first child journeys finish noncanonical scene and garden hook',()=>{
 for(const wrongFirst of [true,false]){
  const s=finish(wrongFirst),v=view(s);
  assert.equal(s.version,VERSION);assert.equal(v.stage,'review');
  assert.equal(v.mapRoomPaperVisible,true);
  assert.match(v.paperChronicle,/MOCK records.*UNKNOWN/);
  assert.match(v.stageText,/garden/);
  assert.equal(v.northHillClosed,true);assert.equal(v.commonRevealed,false);
  assert.equal(v.productionEntryReady,false);assert.equal(v.e06Unlocked,false);
  assert.deepEqual(v.canonicalEvents,[]);assert.deepEqual(v.unlocks,[]);
  assert.deepEqual(s.canonicalEvents,[]);assert.deepEqual(s.unlocks,[]);
  assert.deepEqual(replay(s.history),s);
  assert.deepEqual(restore(structuredClone(s)),s);
 }
});
test('record provenance remains unknown and cannot be skipped by a fit or fabricated completion',()=>{
 let s=toRecords();s=a(s,'sources','start');s=a(s,'sources','walk',{value:'desk-a'});
 s=a(s,'sources','inspect',{card:'a'});s=a(s,'sources','source-check',{card:'a'});
 assert.deepEqual(view(s).sources.sourceMetadata.a,{maker:'UNKNOWN',date:'UNKNOWN',original:'UNKNOWN'});
 assert.equal(can(s,{scene:'nav',type:'to-layout'}),false);
 for(const bad of [
  {scene:'nav',type:'to-review'},
  {scene:'station',action:{type:'confirm'}},
  {scene:'sources',action:{type:'place',card:'a',slot:'1900'}},
  {scene:'nav',type:'to-layout',admin:true},
  {scene:'grant-canon',action:{type:'complete'}}
 ])assert.deepEqual(dispatch(s,bad),s);
});
test('strict replay rejects nested flags, forged rights, unapproved history and unknown actions',()=>{
 const good=finish(true);
 for(const mutate of [
  s=>{s.stage='review';s.station.reflection=false;},
  s=>{s.sources.sourceChecked=[];},
  s=>{s.canonicalEvents.push('episode_completed:s01e05');},
  s=>{s.unlocks.push('s01e06');},
  s=>{s.rights.push('station-access');},
  s=>{s.history.push({scene:'nav',type:'to-review',admin:true});},
  s=>{s.history[0]={scene:'nav',type:'to-review'};},
  s=>{s.mode='canonical';}
 ]){
  const bad=structuredClone(good);mutate(bad);
  assert.equal(restore(bad),null);
  assert.deepEqual(dispatch(bad,{scene:'nav',type:'to-review'}),fresh());
 }
 assert.equal(replay(Array(MAX_ACTIONS+1).fill({scene:'nav',type:'restart'})),null);
});
test('review is read-only, restart clears only isolated PAPER rehearsal',()=>{
 let s=finish();
 assert.equal(can(s,{scene:'station',action:{type:'walk',value:'door'}}),false);
 s=n(s,'restart');assert.equal(view(s).stage,'foyer');
 assert.equal(view(s).station.mapRoom,false);
 assert.equal(view(s).sources.phase,'opening');
 assert.deepEqual(s.canonicalEvents,[]);
 assert.deepEqual(s.unlocks,[]);
 assert.deepEqual(replay(s.history),s);
});
