import test from 'node:test';
import assert from 'node:assert/strict';
import * as H from '../authoring-labs/arc1-garden-story-handoff-model.mjs';
import {e05ProductionHandoff} from '../engine/s01e05-production-entry.mjs';
const arc=(s,scene,type,x={})=>H.dispatch(s,{scene:'arc1',action:
 scene==='nav'?{scene:'nav',type}:{scene,action:{type,...x}}});
const station=(s,type,value)=>H.dispatch(s,{scene:'arc1',action:
 {scene:'e05',action:value===undefined?{type}:{type,value}}});
const garden=(s,type,value)=>H.dispatch(s,{scene:'garden',action:
 value===undefined?{type}:{type,value}});
const nav=(s,type)=>H.dispatch(s,{scene:'nav',type});
function arcReady(){
 let s=H.fresh();
 for(const which of ['station','garden'])s=arc(s,'e04','inspect',{which});
 for(const [which,slot] of [['station','earlier'],['garden','later'],
  ['station','unknown'],['garden','unknown']])s=arc(s,'e04','place',{which,slot});
 s=arc(s,'e04','compare');s=arc(s,'e04','finish-paper');s=arc(s,'nav','to-e05');
 for(const [type,value] of [
  ['start'],['walk','board'],['inspect','peg-pair'],['inspect','worn-edge'],
  ['guess','route-board'],['try-copy','side-b'],['check'],
  ['try-copy','side-a'],['check'],['qualify'],['walk','table'],
  ['place-table','across-walkway'],['place-table','near-wall'],['confirm'],['reflect']
 ])s=station(s,type,value);
 return s;
}
function lowerDone(){
 let s=nav(arcReady(),'to-garden');
 s=garden(s,'start');
 for(const id of ['slope','shared-path']){
  s=garden(s,'walk',id);s=garden(s,'inspect',id);
 }
 s=garden(s,'walk','model-tray');
 s=garden(s,'run');s=garden(s,'weather','rain');s=garden(s,'run');
 s=garden(s,'channel','blocked');s=garden(s,'run');s=garden(s,'compare');
 s=garden(s,'enter');
 s=garden(s,'inspect','runoff-trace');
 s=garden(s,'walk','public-path');s=garden(s,'inspect','public-path');
 s=garden(s,'walk','runoff-channel');s=garden(s,'place','runoff-channel');s=garden(s,'check');
 s=garden(s,'walk','raised-pocket');s=garden(s,'place','raised-pocket');s=garden(s,'check');
 s=garden(s,'think','keep-path');s=garden(s,'finish');
 return s;
}
test('E05 requires two undated memories, uncertainty revision and completed station paper story',()=>{
 let s=H.fresh();assert.deepEqual(nav(s,'to-garden'),s);
 s=arc(s,'e04','inspect',{which:'station'});assert.deepEqual(nav(s,'to-garden'),s);
 s=arc(s,'e04','inspect',{which:'garden'});
 s=arc(s,'e04','place',{which:'station',slot:'earlier'});
 s=arc(s,'e04','place',{which:'garden',slot:'later'});
 assert.deepEqual(nav(s,'to-garden'),s);
 assert.deepEqual(arc(s,'e04','compare'),s);
 s=arcReady();assert.equal(H.view(s).gardenAvailable,true);
 assert.equal(H.view(s).stationMapRoomPaper,true);
 assert.equal(nav(s,'to-garden').stage,'garden');
 assert.deepEqual(e05ProductionHandoff(null,null,s).unlocks,[]);
});
test('E06 two places require Milo observation, dry/rain comparison and reversible marker',()=>{
 const s=lowerDone(),v=H.view(s);
 assert.equal(v.stage,'garden');assert.equal(v.garden.phase,'finished');
 assert.equal(v.currentGardenCompared,true);
 assert.equal(v.lowerGardenVisited,true);assert.equal(v.lowerPocketPaper,true);
 assert.equal(v.currentGardenHealthy,true);
 assert.match(v.garden.paperNote,/UNKNOWN/);
 assert.deepEqual(v.canonicalEvents,[]);assert.deepEqual(v.unlocks,[]);
 assert.equal(v.historicalCause,'UNKNOWN');
 assert.equal(v.northHillClosed,true);assert.equal(v.commonRevealed,false);
});
test('E05 paper Map Room and E06 pocket survive revisit; local garden reset only resets garden',()=>{
 let s=lowerDone();s=nav(s,'to-arc1');
 assert.equal(H.view(s).stationMapRoomPaper,true);
 assert.equal(H.view(s).lowerPocketPaper,true);
 s=nav(s,'to-garden');assert.equal(H.view(s).garden.phase,'finished');
 s=nav(s,'restart-garden');
 assert.equal(H.view(s).garden.phase,'opening');
 assert.equal(H.view(s).stationMapRoomPaper,true);
 assert.equal(H.view(s).lowerPocketPaper,false);
 assert.equal(H.view(s).gardenAvailable,true);
});
test('upstream E04 restart invalidates downstream garden and station without production effects',()=>{
 let s=nav(lowerDone(),'to-arc1');
 s=arc(s,'nav','to-e04');s=arc(s,'nav','restart-e04');
 assert.equal(H.view(s).gardenAvailable,false);
 assert.equal(H.view(s).lowerPocketPaper,false);
 assert.equal(H.view(s).stationMapRoomPaper,false);
 assert.deepEqual(nav(s,'to-garden'),s);
 assert.deepEqual(H.replay(s.history),s);
});
test('strict replay rejects forged sources, permissions, unlock, garden or action history',()=>{
 const s=lowerDone();assert.ok(s.history.length<H.MAX_ACTIONS);
 assert.deepEqual(H.replay(s.history),s);
 assert.deepEqual(H.restore(structuredClone(s)),s);
 for(const mutate of [
  x=>x.canonicalEvents.push('s01e06:done'),x=>x.unlocks.push('s01e07'),
  x=>x.historicalClaims.push('dated station record'),x=>x.rights.push('garden-permission'),
  x=>x.garden.phase='finished-not-real',x=>x.arc1.timeline.slots.station='earlier',
  x=>x.history[0].action.action.which='fake',x=>x.mode='canonical'
 ]){
  const bad=structuredClone(s);mutate(bad);
  assert.equal(H.restore(bad),null);
  assert.deepEqual(nav(bad,'to-arc1'),H.fresh());
 }
 for(const action of [
  {scene:'nav',type:'to-common'},
  {scene:'nav',type:'to-arc1',canonical:true},
  {scene:'garden',action:{type:'finish',permission:true}},
  {scene:'arc1',action:{scene:'e04',action:{type:'place',which:'station',slot:'1902'}}}
 ])assert.deepEqual(H.dispatch(s,action),s);
});
