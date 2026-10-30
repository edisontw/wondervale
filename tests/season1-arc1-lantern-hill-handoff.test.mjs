import test from 'node:test';
import assert from 'node:assert/strict';
import * as C from '../authoring-labs/arc1-garden-shortcut-handoff-model.mjs';
import * as New from '../authoring-labs/arc1-shortcut-lantern-handoff-model.mjs';
import * as Bridge from '../authoring-labs/arc1-lantern-hill-handoff-model.mjs';
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

const b=(s,scene,action)=>Bridge.dispatch(s,{scene,action});
const bn=(s,type)=>Bridge.dispatch(s,{scene:'nav',type});
function readyBridge(){
 let s=Bridge.fresh();
 for(const a of completeLantern().history)s=b(s,'upstream',a);
 return s;
}
function survey(){
 let s=bn(readyBridge(),'to-hill');
 const a=(type,key,value)=>{s=b(s,'hill',key?{type,[key]:value}:{type});};
 a('start');a('inspect','clueId','entry_note');
 a('walk','to','signpost');a('inspect','clueId','boundary_sign');
 a('walk','to','fence_view');a('inspect','clueId','disturbed_ground');
 a('walk','to','upper_closed');a('consider','hypothesisId','water_may_change_ground');
 a('mark','edgeId','fence_view:upper_closed');
 a('walk','to','signpost');a('walk','to','lower_bend');
 a('inspect','clueId','runoff_marks');
 a('walk','to','overlook');a('inspect','clueId','distant_symbol');
 a('mark','edgeId','steps_base:signpost');a('mark','edgeId','lower_bend:overlook');
 a('check-route');a('mark','edgeId','signpost:lower_bend');
 a('check-route');a('compare-symbol');a('review');a('finish-preview');
 return s;
}
test('E09 PAPER survey requires replayed E08 two-view completion and CLOSED boundary',()=>{
 const s=Bridge.fresh();
 assert.equal(Bridge.can(s,{scene:'nav',type:'to-hill'}),false);
 assert.equal(Bridge.can(s,{scene:'hill',action:{type:'start'}}),false);
 const ready=readyBridge(),v=Bridge.view(ready);
 assert.equal(v.lanternPaperFinished,true);
 assert.equal(v.sourceDates,'UNKNOWN');
 assert.equal(v.northHillClosed,true);
 assert.equal(Bridge.can(ready,{scene:'nav',type:'to-hill'}),true);
 assert.equal(Bridge.view(bn(ready,'to-hill')).hill.stage,'opening');
});
test('Milo surveys a lower route, safely stops at fence, fixes gap and carries E08 viewpoint evidence',()=>{
 const s=survey(),v=Bridge.view(s);
 assert.equal(v.stage,'hill');assert.equal(v.hillPaperFinished,true);
 assert.equal(v.hill.blockedAttempts,2);
 assert.equal(v.hill.routeResult.complete,true);
 assert.equal(v.hill.position,'overlook');
 assert.equal(v.hill.inspected.includes('boundary_sign'),true);
 assert.equal(v.hill.inspected.includes('distant_symbol'),true);
 assert.ok(v.upstream.lantern.comparison.spreadDifferenceDegrees>=5);
 assert.equal(v.upstream.lantern.comparison.markersUnchanged,true);
 assert.equal(v.stationMapRoomPaper,true);assert.equal(v.currentGardenHealthy,true);
 assert.equal(v.lowerPocketPaper,true);assert.equal(v.connectorPaperRevised,true);
 assert.equal(v.northHillClosed,true);assert.equal(v.realAccessApproved,false);
 assert.equal(v.closureDate,'UNKNOWN');assert.equal(v.distantPlaceIdentity,'UNKNOWN');
 assert.equal(v.e10Unlocked,false);assert.equal(v.commonRevealed,false);
 assert.deepEqual(v.canonicalEvents,[]);assert.deepEqual(v.unlocks,[]);
 assert.deepEqual(v.historicalClaims,[]);assert.deepEqual(v.rights,[]);
 assert.match(v.paperNote,/E10 NOT UNLOCKED/);
 assert.deepEqual(Bridge.replay(s.history),s);
 assert.deepEqual(Bridge.restore(structuredClone(s)),s);
});
test('E09 revisit persists, E09 restart keeps E08, E08 restart clears E09',()=>{
 let s=bn(survey(),'to-steps');
 assert.equal(Bridge.view(s).lanternPaperFinished,true);
 s=bn(s,'to-hill');assert.equal(Bridge.view(s).hillPaperFinished,true);
 s=bn(s,'restart-hill');
 assert.equal(Bridge.view(s).hill.stage,'opening');
 assert.equal(Bridge.view(s).lanternPaperFinished,true);
 s=bn(survey(),'to-steps');
 s=b(s,'upstream',{scene:'nav',type:'restart-lantern'});
 assert.equal(Bridge.view(s).lanternPaperFinished,false);
 assert.equal(Bridge.view(s).hillPaperFinished,false);
 assert.equal(Bridge.can(s,{scene:'nav',type:'to-hill'}),false);
 assert.equal(Bridge.view(s).connectorPaperRevised,true);
 s=bn(s,'restart-whole');
 assert.equal(Bridge.view(s).stationMapRoomPaper,false);
});
test('strict replay rejects forged dates, hill access, history and canonical release',()=>{
 const s=survey();
 for(const a of [
  {scene:'nav',type:'to-hill',approved:true},
  {scene:'hill',action:{type:'walk',to:'upper_closed',safe:true}},
  {scene:'hill',action:{type:'finish-preview',year:1920}},
  {scene:'nav',type:'unlock-e10'}
 ])assert.deepEqual(Bridge.dispatch(s,a),s);
 for(const mutate of [
  x=>x.unlocks.push('e10'),x=>x.historicalClaims.push('1920'),
  x=>x.hill.hill.position='upper_closed',x=>x.hill.hill.provisionalFinished=false,
  x=>x.upstream.lantern.steps.lights['lower-a']=false,
  x=>x.history[0].action.scene='fake',x=>x.rights.push('real-access'),
  x=>x.mode='canonical'
 ]){
  const bad=structuredClone(s);mutate(bad);
  assert.equal(Bridge.restore(bad),null);
  assert.deepEqual(Bridge.dispatch(bad,{scene:'nav',type:'to-steps'}),Bridge.fresh());
 }
 assert.equal(Bridge.replay(Array(Bridge.MAX_ACTIONS+1).fill({scene:'nav',type:'restart-whole'})),null);
});
