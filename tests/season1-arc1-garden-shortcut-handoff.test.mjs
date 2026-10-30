import test from 'node:test';
import assert from 'node:assert/strict';
import * as C from '../authoring-labs/arc1-garden-shortcut-handoff-model.mjs';
import * as Up from '../authoring-labs/arc1-garden-story-handoff-model.mjs';
const H=Up;
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

const act=(s,scene,action)=>C.dispatch(s,{scene,action});
const navC=(s,type)=>C.dispatch(s,{scene:'nav',type});
let cachedGarden=null,cachedShortcut=null;
function gardenReady(){
 if(cachedGarden)return cachedGarden;
 let s=C.fresh();
 for(const action of lowerDone().history)s=act(s,'upstream',action);
 cachedGarden=s;
 return s;
}
function shortcutDone(){
 if(cachedShortcut)return cachedShortcut;
 let s=navC(gardenReady(),'to-shortcut');
 for(const a of [{type:'start'},{type:'walk',value:'shared-path'},
  {type:'inspect',value:'shared-path'},{type:'walk',value:'channel'},
  {type:'inspect',value:'channel'},{type:'walk',value:'workbench'},
  ...['milo','resident','water'].map(value=>({type:'trial',value})),
  {type:'place',value:'path-clear-water-blocked'},
  ...['milo','resident','water'].map(value=>({type:'trial',value})),
  {type:'place',value:'side-offset'},
  ...['water','milo','resident'].map(value=>({type:'trial',value})),
  {type:'compare'},{type:'finish'}])s=act(s,'shortcut',a);
 cachedShortcut=s;
 return s;
}
test('E07 is inaccessible without completed E04 UNKNOWN, E05 and both E06 paper spaces',()=>{
 let s=C.fresh();
 assert.equal(C.can(s,{scene:'nav',type:'to-shortcut'}),false);
 s=act(s,'upstream',{scene:'arc1',action:{scene:'e04',action:{type:'inspect',which:'station'}}});
 assert.equal(C.can(s,{scene:'nav',type:'to-shortcut'}),false);
 s=gardenReady();
 assert.equal(C.view(s).lowerPocketPaper,true);
 assert.equal(C.can(s,{scene:'nav',type:'to-shortcut'}),true);
 s=navC(s,'to-shortcut');
 assert.equal(C.view(s).shortcut.stage,'opening');
 assert.equal(C.can(s,{scene:'shortcut',action:{type:'trial',value:'milo'}}),false);
});
test('Milo revises Finn FIRST to NOW for person and water without losing healthy garden',()=>{
 const s=shortcutDone(),v=C.view(s);
 assert.equal(v.stage,'shortcut');
 assert.equal(v.shortcut.previewComplete,true);
 assert.equal(v.shortcut.firstTrials.resident.pass,false);
 assert.equal(v.shortcut.firstTrials.water.pass,false);
 assert.equal(v.shortcut.revisedTrials.resident.pass,true);
 assert.equal(v.shortcut.revisedTrials.water.pass,true);
 assert.equal(v.currentGardenHealthy,true);
 assert.equal(v.lowerPocketPaper,true);
 assert.equal(v.connectorPaperRevised,true);
 assert.match(v.paperNote,/FIRST\/NOW/);
 assert.deepEqual(v.canonicalEvents,[]);assert.deepEqual(v.unlocks,[]);
 assert.equal(v.northHillClosed,true);assert.equal(v.lanternLightsOff,true);
 assert.equal(v.commonRevealed,false);
 assert.deepEqual(C.replay(s.history),s);
 assert.deepEqual(C.restore(structuredClone(s)),s);
});
test('revisit retains paper connector, E07 reset preserves E06, E06 reset invalidates E07',()=>{
 let s=navC(shortcutDone(),'to-upstream');
 assert.equal(C.view(s).connectorPaperRevised,true);
 assert.equal(C.view(s).lowerPocketPaper,true);
 s=navC(s,'to-shortcut');
 assert.equal(C.view(s).shortcut.stage,'finished');
 s=navC(s,'restart-shortcut');
 assert.equal(C.view(s).shortcut.stage,'opening');
 assert.equal(C.view(s).lowerPocketPaper,true);
 s=navC(s,'to-upstream');
 s=act(s,'upstream',{scene:'nav',type:'restart-garden'});
 assert.equal(C.view(s).lowerPocketPaper,false);
 assert.equal(C.view(s).shortcut.stage,'opening');
 assert.equal(C.can(s,{scene:'nav',type:'to-shortcut'}),false);
});
test('E04 upstream reset clears E05 E06 and E07; synthetic completion cannot unlock production',()=>{
 let s=navC(shortcutDone(),'to-upstream');
 s=act(s,'upstream',{scene:'nav',type:'to-arc1'});
 s=act(s,'upstream',{scene:'arc1',action:{scene:'nav',type:'to-e04'}});
 s=act(s,'upstream',{scene:'arc1',action:{scene:'nav',type:'restart-e04'}});
 const v=C.view(s);
 assert.equal(v.lowerPocketPaper,false);
 assert.equal(v.connectorPaperRevised,false);
 assert.equal(v.stationMapRoomPaper,false);
 assert.deepEqual(v.unlocks,[]);
 assert.deepEqual(navC(s,'to-shortcut'),s);
});
test('strict replay rejects tampered nested evidence, permissions and direct E07 bypass',()=>{
 const s=shortcutDone();
 for(const mutate of [
  x=>x.unlocks.push('e08'),x=>x.canonicalEvents.push('built-connector'),
  x=>x.historicalClaims.push('1902'),x=>x.rights.push('route-permission'),
  x=>x.shortcut.connector.previewComplete=false,
  x=>x.upstream.garden.phase='invented',x=>x.history[0].scene='shortcut',
  x=>x.mode='canonical'
 ]){
  const bad=structuredClone(s);mutate(bad);
  assert.equal(C.restore(bad),null);
  assert.deepEqual(C.dispatch(bad,{scene:'nav',type:'to-upstream'}),C.fresh());
 }
 for(const a of [
  {scene:'nav',type:'to-e08'},{scene:'nav',type:'to-shortcut',unlock:true},
  {scene:'shortcut',action:{type:'finish',permission:true}},
  {scene:'shortcut',action:{type:'place',value:'north-hill'}},
  {scene:'upstream',action:{scene:'garden',action:{type:'finish',canon:true}}}
 ])assert.deepEqual(C.dispatch(s,a),s);
 assert.equal(C.replay(Array(C.MAX_ACTIONS+1).fill({scene:'nav',type:'restart-all'})),null);
});
