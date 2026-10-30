import test from 'node:test';
import assert from 'node:assert/strict';
import * as C from '../authoring-labs/arc1-garden-shortcut-handoff-model.mjs';
import * as New from '../authoring-labs/arc1-shortcut-lantern-handoff-model.mjs';
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

const outer=(s,scene,action)=>New.dispatch(s,{scene,action});
const move=(s,type)=>New.dispatch(s,{scene:'nav',type});
let cachedBridge=null;
function shortcutReady(){
 if(cachedBridge)return cachedBridge;
 let s=New.fresh();
 for(const a of shortcutDone().history)s=outer(s,'upstream',a);
 cachedBridge=s;return s;
}
function light(s,type,key,value){return outer(s,'lantern',key?{type,[key]:value}:{type});}
function completeLantern(){
 let s=move(shortcutReady(),'to-lantern');
 s=light(s,'start');
 for(const x of ['brackets','boundary','lower-a'])s=light(s,'inspect','feature',x);
 s=light(s,'toggle-lamp','lampId','lower-a');
 s=light(s,'walk','anchor','lower-landing');
 s=light(s,'inspect','feature','lower-b');
 s=light(s,'toggle-lamp','lampId','lower-b');
 s=light(s,'walk','anchor','base');s=light(s,'observe-view');
 s=light(s,'walk','anchor','lower-landing');s=light(s,'walk','anchor','side');
 s=light(s,'observe-view');s=light(s,'compare-views');
 s=light(s,'inspect','feature','service-plate');return light(s,'confirm-preview');
}
test('E08 cannot start until E04 UNKNOWN, E05 station, E06 both gardens and E07 FIRST/NOW',()=>{
 const s=New.fresh();
 assert.equal(New.can(s,{scene:'nav',type:'to-lantern'}),false);
 assert.equal(New.can(s,{scene:'lantern',action:{type:'start'}}),false);
 const r=shortcutReady();
 assert.equal(New.view(r).connectorPaperRevised,true);
 assert.equal(New.can(r,{scene:'nav',type:'to-lantern'}),true);
 assert.equal(New.view(move(r,'to-lantern')).lantern.stage,'opening');
});
test('E08 child controls two lower viewpoints, keeps FIRST/NOW and the healthy garden visible',()=>{
 const s=completeLantern(),v=New.view(s);
 assert.equal(v.stage,'lantern');assert.equal(v.lanternPaperFinished,true);
 assert.ok(v.lantern.comparison.spreadDifferenceDegrees>=5);
 assert.equal(v.lantern.comparison.markersUnchanged,true);
 assert.equal(v.stationMapRoomPaper,true);assert.equal(v.currentGardenHealthy,true);
 assert.equal(v.lowerPocketPaper,true);assert.equal(v.connectorPaperRevised,true);
 assert.equal(v.northHillClosed,true);assert.equal(v.realLightingApproved,false);
 assert.equal(v.sourceDates,'UNKNOWN');assert.equal(v.servicePlateSource,'UNKNOWN');
 assert.deepEqual(v.canonicalEvents,[]);assert.deepEqual(v.unlocks,[]);
 assert.deepEqual(v.historicalClaims,[]);assert.deepEqual(v.rights,[]);
 assert.match(v.paperNote,/E09 NOT UNLOCKED/);
 assert.deepEqual(New.replay(s.history),s);
 assert.deepEqual(New.restore(structuredClone(s)),s);
});
test('Revisit retains E08; E08 restart retains E07; E07 restart clears E08 but not E06',()=>{
 let s=move(completeLantern(),'to-upstream');
 assert.equal(New.view(s).connectorPaperRevised,true);
 s=move(s,'to-lantern');assert.equal(New.view(s).lanternPaperFinished,true);
 s=move(s,'restart-lantern');assert.equal(New.view(s).lantern.stage,'opening');
 assert.equal(New.view(s).connectorPaperRevised,true);
 s=move(completeLantern(),'to-upstream');
 s=outer(s,'upstream',{scene:'nav',type:'restart-shortcut'});
 assert.equal(New.view(s).lanternPaperFinished,false);
 assert.equal(New.view(s).lowerPocketPaper,true);
 assert.equal(New.can(s,{scene:'nav',type:'to-lantern'}),false);
 s=move(s,'restart-all');assert.equal(New.view(s).stationMapRoomPaper,false);
});
test('Strict replay rejects invented history, unsafe access, permissions and snapshot tampering',()=>{
 const s=completeLantern();
 for(const a of [{scene:'lantern',action:{type:'walk',anchor:'upper-closed'}},
  {scene:'nav',type:'grant-unlock'},{scene:'lantern',action:{type:'confirm-preview',year:1920}},
  {scene:'nav',type:'to-lantern',approved:true}])
  assert.deepEqual(New.dispatch(s,a),s);
 for(const mutate of [x=>x.unlocks.push('e09'),x=>x.historicalClaims.push('date'),
  x=>x.lantern.steps.lights['lower-a']=false,x=>x.upstream.shortcut.stage='opening',
  x=>x.history[0].action.action.scene='fake']){
  const bad=structuredClone(s);mutate(bad);
  assert.equal(New.restore(bad),null);
  assert.deepEqual(New.dispatch(bad,{scene:'nav',type:'to-upstream'}),New.fresh());
 }
 assert.equal(New.replay(Array(New.MAX_ACTIONS+1).fill({scene:'nav',type:'restart-all'})),null);
});
