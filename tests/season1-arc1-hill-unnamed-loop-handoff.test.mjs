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

import * as Next from '../authoring-labs/arc1-hill-unnamed-handoff-model.mjs';
const nextAct=(s,scene,action)=>Next.dispatch(s,{scene,action});
const go=(s,type)=>Next.dispatch(s,{scene:'nav',type});
function ready(){let s=Next.fresh();for(const a of survey().history)s=nextAct(s,'upstream',a);return s;}
function completed(){
 let s=go(ready(),'to-e10');
 const a=(type,extra={})=>{s=nextAct(s,'e10',{type,...extra});};
 a('start');a('compare-symbol');a('walk',{to:'stone_edge'});a('inspect',{traceId:'surface'});
 a('suggest',{traceId:'surface',useTag:'passing'});
 a('revise',{traceId:'surface',oldTag:'passing',newTag:'resting'});
 a('walk',{to:'quiet_corner'});a('hear',{needId:'quiet'});a('place',{needId:'quiet',slot:'shared'});
 a('walk',{to:'meeting_edge'});a('hear',{needId:'activity'});a('place',{needId:'activity',slot:'shared'});
 a('test-one-slot');a('place',{needId:'quiet',slot:'left'});a('place',{needId:'activity',slot:'right'});
 a('walk',{to:'notice_wall'});a('inspect',{traceId:'holes'});
 a('suggest',{traceId:'holes',useTag:'display'});
 a('check-source');a('review-tradeoff');a('review');a('finish-paper');
 return s;
}

import * as Whole from '../authoring-labs/arc1-hill-unnamed-loop-handoff-model.mjs';
const wact=(s,scene,action)=>Whole.dispatch(s,{scene,action});
const wnav=(s,type)=>Whole.dispatch(s,{scene:'nav',type});
let cachedWhole=null;
function fullE10(){
 if(!cachedWhole){
  const actions=completed().history.map(action=>({scene:'upstream',action}));
  cachedWhole=Whole.replay(actions);
  assert.ok(cachedWhole,'strict upstream child history replays');
 }
 return cachedWhole;
}
function finishE11(){
 let s=wnav(fullE10(),'to-e11');
 const l=(type,x={})=>{
  const a={scene:'e11',action:{type,...x}};
  assert.equal(Whole.can(s,a),true,'E11 action '+type);
  s=Whole.dispatch(s,a);
 };
 l('start');l('move-milo',{to:'1,1'});l('move-milo',{to:'1,0'});
 l('place',{tokenId:'access',cells:['1,1','1,2']});
 l('place',{tokenId:'quiet',cells:['0,1']});
 l('place',{tokenId:'activity',cells:['0,2']});
 l('test-user',{userId:'quiet_reader'});l('test-user',{userId:'activity_group'});
 l('snapshot-trial');l('place',{tokenId:'activity',cells:['2,1']});
 l('test-user',{userId:'quiet_reader'});l('test-user',{userId:'activity_group'});
 l('snapshot-trial');l('compare-trials',{first:'trial-1',second:'trial-2'});
 l('cite-earlier',{discoveryId:'e10_needs'});
 for(const edgeId of ['square-market','market-common','common-square'])l('add-loop-edge',{edgeId});
 l('check-loop');l('review-preview');l('finish-paper');
 return s;
}
test('E11 PAPER is gated by full E03→E10 replay and never opens North Hill',()=>{
 const s=Whole.fresh();
 assert.equal(Whole.can(s,{scene:'nav',type:'to-e11'}),false);
 assert.equal(Whole.view(s).e11PaperFinished,false);
 const done=fullE10(),v=Whole.view(done);
 assert.equal(v.upstream.e10PaperFinished,true);
 assert.equal(v.upstream.upstream.hillPaperFinished,true);
 assert.equal(v.northHillClosed,true);
 assert.equal(v.e11PaperAvailable,true);
 assert.equal(Whole.can(done,{scene:'nav',type:'to-e11'}),true);
 const entered=wnav(done,'to-e11');
 assert.deepEqual(Whole.view(entered).handoff,{kind:'SIMULATED_PAPER_ONLY',
  source:'UNKNOWN',needs:{quiet:'left',activity:'right'}});
});
test('E11 child tests a conflict, revises and compares FIRST/NOW without canonical claims',()=>{
 const s=finishE11(),v=Whole.view(s);
 assert.equal(v.e11PaperFinished,true);
 assert.equal(v.e11.firstFailed,true);
 assert.equal(v.e11.revisedAfterFailure,true);
 assert.equal(v.e11.trials.length,2);
 assert.equal(v.e11.loopChecked,true);
 assert.equal(v.upstream.upstream.hillPaperFinished,true);
 assert.equal(v.upstream.upstream.lanternPaperFinished,true);
 assert.equal(v.northHillClosed,true);
 assert.equal(v.realAccessApproved,false);
 assert.equal(v.sharedSpaceOpen,false);
 assert.equal(v.commonRevealed,false);
 assert.equal(v.e11Unlocked,false);
 assert.equal(v.seasonFinished,false);
 assert.deepEqual(v.canonicalEvents,[]);assert.deepEqual(v.unlocks,[]);
 assert.deepEqual(v.historicalClaims,[]);assert.deepEqual(v.rights,[]);
 assert.deepEqual(Whole.replay(s.history),s);
 assert.deepEqual(Whole.restore(structuredClone(s)),s);
});
test('revisit retains E11; restart E11 retains E10; restarting E09 or E10 invalidates E11',()=>{
 const done=finishE11();
 let s=wnav(done,'to-e10-e11');
 assert.equal(Whole.view(s).e11PaperFinished,true);
 s=wnav(s,'to-e11');assert.equal(Whole.view(s).e11PaperFinished,true);
 s=wnav(s,'restart-e11');
 assert.equal(Whole.view(s).e11PaperFinished,false);
 assert.equal(Whole.view(s).upstream.e10PaperFinished,true);
 s=wnav(done,'to-e10-e11');
 s=wact(s,'upstream',{scene:'nav',type:'restart-e10'});
 assert.equal(Whole.view(s).e11PaperFinished,false);
 assert.equal(Whole.can(s,{scene:'nav',type:'to-e11'}),false);
 s=wnav(done,'to-e10-e11');
 s=wact(s,'upstream',{scene:'nav',type:'to-hill-e10'});
 s=wact(s,'upstream',{scene:'upstream',action:{scene:'nav',type:'restart-hill'}});
 assert.equal(Whole.view(s).e11PaperFinished,false);
 assert.equal(Whole.view(s).upstream.upstream.lanternPaperFinished,true);
 s=wnav(s,'restart-all-e11');
 assert.equal(Whole.view(s).upstream.upstream.stationMapRoomPaper,false);
});
test('tampering with history, rights, real identity or fake completion fails closed',()=>{
 const s=finishE11();
 for(const action of [{scene:'nav',type:'unlock-e11'},
  {scene:'e11',action:{type:'finish-season'}},
  {scene:'e11',action:{type:'finish-paper',year:1902}},
  {scene:'upstream',action:{scene:'e10',action:{type:'enable-fixture'}}}]){
  assert.deepEqual(Whole.dispatch(s,action),s);
 }
 for(const mutate of [x=>x.unlocks.push('e11'),x=>x.rights.push('site'),
  x=>x.handoff.source='VERIFIED',x=>x.upstream.e10.e10.nameRevealed=true,
  x=>x.e11.finishedPaper=false,x=>x.history[0].action.scene='forged']){
  const bad=structuredClone(s);mutate(bad);
  assert.equal(Whole.restore(bad),null);
  assert.deepEqual(Whole.dispatch(bad,{scene:'nav',type:'to-e10-e11'}),Whole.fresh());
 }
 assert.equal(Whole.replay(Array(Whole.MAX_ACTIONS+1).fill({scene:'nav',type:'restart-all-e11'})),null);
});
