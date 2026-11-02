import test from 'node:test';
import assert from 'node:assert/strict';
import * as E11 from '../engine/s01e11-authoring-prototype.mjs';
import * as E05 from '../e05-scene/scene-model.mjs';
import * as E06 from '../e06-scene/scene-model.mjs';
import {paperReturnRoute,PAPER_WALK} from '../e11-scene/return-route.mjs';
import {paperReturnReflection} from '../e11-scene/return-reflection.mjs';
import {paperReflectionWorld} from '../e11-scene/reflection-world.mjs';
import {paperReflectionFollowUp} from '../e11-scene/reflection-follow-up.mjs';
import {paperFollowUpMap,PAPER_CHECK_STOPS} from '../e11-scene/follow-up-map.mjs';

function reviewed(){
 let s=E11.fresh();
 const actions=[
  {type:'place',tokenId:'access',cells:['1,1','1,2']},
  {type:'place',tokenId:'quiet',cells:['0,1']},
  {type:'place',tokenId:'activity',cells:['0,2']},
  {type:'test-user',userId:'quiet_reader'},
  {type:'test-user',userId:'activity_group'},
  {type:'snapshot-trial'},
  {type:'place',tokenId:'activity',cells:['2,1']},
  {type:'test-user',userId:'quiet_reader'},
  {type:'test-user',userId:'activity_group'},
  {type:'snapshot-trial'},
  {type:'compare-trials',first:'trial-1',second:'trial-2'},
  {type:'cite-earlier',discoveryId:'e09_closure'},
  ...['square-market','market-common','common-square'].map(edgeId=>({type:'add-loop-edge',edgeId})),
  {type:'check-loop'},{type:'review-preview'}
 ];
 for(const a of actions){const n=E11.dispatch(s,a);assert.notDeepEqual(n,s,JSON.stringify(a));s=n;}
 assert.equal(s.reviewed,true);
 return s;
}
test('Milo safely tries a wrong PAPER turn, retraces, visits both model stops and returns',()=>{
 const s=reviewed();
 assert.deepEqual(PAPER_WALK.market,['square']);
 assert.equal(paperReturnRoute(E11.fresh()),null);
 const first=paperReturnRoute(s);
 assert.deepEqual(first.choices,['market','garden']);
 assert.equal(first.complete,false);
 const steps=['market','square','garden','map_room','garden','square'];
 const walk=paperReturnRoute(s,steps);
 assert.equal(walk.at,'square');
 assert.equal(walk.detours,1);
 assert.equal(walk.complete,true);
 assert.deepEqual(walk.visited,['garden','map_room']);
 assert.match(walk.feedback,/real way is still UNKNOWN/);
 assert.match(walk.gardenNote,/NOT VERIFIED/);
 assert.match(walk.stationNote,/NOT VERIFIED/);
 assert.equal(walk.realRouteOpen,false);
 assert.equal(walk.historicHillClosed,true);
 assert.deepEqual(walk.canonicalEvents,[]);
 assert.deepEqual(walk.unlocks,[]);
 assert.equal(walk.seasonComplete,false);
 const undone=paperReturnRoute(s,steps.slice(0,-1));
 assert.equal(undone.complete,false,'undo withdraws the claimed model return');
 assert.equal(paperReturnRoute(s,['market']).complete,false);
 assert.match(paperReturnRoute(s,['market']).feedback,/walk back/);
 assert.equal(paperReturnRoute(s,['square','market']),null,'no teleport from Square to Square');
 assert.equal(paperReturnRoute(s,['garden','common']),null,'unnamed place is not walkable');
 assert.equal(paperReturnRoute(s,['north_hill_closed']),null);
 assert.equal(paperReturnRoute(s,Array(25).fill('garden')),null);
 assert.equal(paperReturnRoute({...s,rights:['approved']},steps),null);
 assert.equal(paperReturnRoute({...s,reviewed:false},steps),null);
 assert.equal(paperReturnRoute(E11.replay(s.history.slice(0,-1)),steps),null);
 assert.equal(paperReturnRoute(E11.dispatch(s,{type:'reset'}),steps),null);
});
test('upstream incomplete or forged E05/E06 histories cannot paint a visit as earned',()=>{
 const s=reviewed(),steps=['garden','map_room','garden','square'];
 const p=paperReturnRoute(s,steps,{e05:E05.fresh(),e06:E06.fresh()});
 assert.equal(p.complete,true);
 assert.equal(p.gardenEarned,false);
 assert.equal(p.stationEarned,false);
 assert.match(p.gardenNote,/NOT VERIFIED/);
 assert.match(p.stationNote,/NOT VERIFIED/);
 const forged=structuredClone(E06.fresh());forged.rights=['planting'];
 assert.equal(paperReturnRoute(s,steps,{e06:forged}).gardenEarned,false);
});
test('strict E06 child-tested lower PAPER sprout appears at Garden stop, not as real growth',()=>{
 const g=(type,value)=>({scene:'garden',action:value===undefined?{type}:{type,value}});
 const c=(type,value)=>value===undefined?{scene:'care',type}:{scene:'care',type,value};
 let e06=E06.fresh();
 for(const a of [g('start'),g('inspect','present-bed'),g('walk','slope'),g('inspect','slope'),
  g('walk','model-tray'),g('run'),g('weather','rain'),g('run'),g('channel','blocked'),
  g('run'),g('compare'),g('enter'),g('inspect','runoff-trace'),
  g('walk','public-path'),g('inspect','public-path'),g('walk','runoff-channel'),
  g('place','runoff-channel'),g('check'),g('walk','raised-pocket'),
  g('place','raised-pocket'),g('check'),g('think','keep-path'),g('finish'),
  c('choose','heavy'),c('test'),c('choose','gentle'),c('test'),c('compare')]){
  assert.equal(E06.can(e06,a),true,JSON.stringify(a));e06=E06.dispatch(e06,a);
 }
 const s=reviewed();
 const atGarden=paperReturnRoute(s,['garden'],{e06});
 assert.equal(atGarden.gardenEarned,true);
 assert.match(atGarden.gardenNote,/possible PAPER sprout/);
 assert.equal(atGarden.stationNote,null,'no fabricated Map Room visit');
 assert.equal(atGarden.siteAccessApproved,false);
 const completed=['garden','map_room','garden','square'];
 const reflection=paperReturnReflection(s,completed,{e06},{
  station:'check',garden:'paper',planting:'check',route:'check'
 });
 assert.equal(reflection.complete,true);
 assert.equal(reflection.observedPaperCount,1);
 assert.equal(reflection.cards.find(c=>c.id==='garden').correct,true);
 assert.equal(reflection.realWorldFactsVerified,0);
 const diary=paperReflectionWorld(s,completed,{e06},{
  station:'check',garden:'paper',planting:'check',route:'check'
 });
 assert.equal(diary.paperCount,1);
 assert.equal(diary.checkCount,3);
 assert.equal(diary.now.find(c=>c.id==='garden').shelf,'paper');
 assert.equal(diary.now.find(c=>c.id==='station').shelf,'check');
 assert.deepEqual(diary.canonicalEvents,[]);
 assert.equal(paperReflectionWorld(s,completed,{e06:E06.dispatch(e06,{scene:'nav',type:'restart'})},{
  station:'check',garden:'paper',planting:'check',route:'check'
 }),null,'upstream restart withdraws the PAPER diary');
 assert.equal(paperReturnRoute(s,['garden'],{e06:E06.dispatch(e06,{scene:'nav',type:'restart'})}).gardenEarned,false);
});

test('child sorts PAPER evidence only after return; incorrect shelf can be revised',()=>{
 const s=reviewed(),steps=['market','square','garden','map_room','garden','square'];
 assert.equal(paperReturnReflection(s,steps.slice(0,-1)),null);
 const first=paperReturnReflection(s,steps);
 assert.equal(first.complete,false);
 assert.equal(first.observedPaperCount,0,'direct authoring must not invent E05/E06');
 assert.equal(first.cards.length,4);
 const mistaken=paperReturnReflection(s,steps,null,{station:'paper'});
 assert.equal(mistaken.cards[0].correct,false);
 assert.match(mistaken.cards[0].explanation,/No verified E05/);
 const corrected=paperReturnReflection(s,steps,null,{
  station:'check',garden:'check',planting:'check',route:'check'
 });
 assert.equal(corrected.complete,true);
 assert.equal(corrected.sortedCount,4);
 assert.equal(corrected.realWorldFactsVerified,0);
 assert.deepEqual(corrected.canonicalEvents,[]);
 assert.deepEqual(corrected.unlocks,[]);
 assert.equal(corrected.realRouteOpen,false);
 assert.equal(paperReturnReflection(s,steps,null,{station:'real'}),null);
 assert.equal(paperReturnReflection(s,steps,null,{secret:'paper'}),null);
 assert.equal(paperReturnReflection({...s,rights:['approved']},steps),null);
 assert.equal(paperReturnReflection(E11.dispatch(s,{type:'reset'}),steps),null);
});

test('FIRST/NOW diary appears only after correctly sorted child return, and undo revokes it',()=>{
 const s=reviewed(),steps=['market','square','garden','map_room','garden','square'];
 const correct={station:'check',garden:'check',planting:'check',route:'check'};
 assert.equal(paperReflectionWorld(s,steps.slice(0,-1),null,correct),null);
 assert.equal(paperReflectionWorld(s,steps,null,{...correct,station:'paper'}),null);
 assert.equal(paperReflectionWorld(s,steps,null,{}),null);
 const diary=paperReflectionWorld(s,steps,null,correct);
 assert.equal(diary.first.length,4);
 assert.ok(diary.first.every(c=>c.shelf==='unsorted'));
 assert.equal(diary.now.length,4);
 assert.equal(diary.paperCount,0,'direct E11 must not invent upstream changes');
 assert.equal(diary.checkCount,4);
 assert.match(diary.chroniclePreview,/PAPER DIARY ONLY/);
 assert.match(diary.chroniclePreview,/No place was opened/);
 assert.equal(diary.realWorldFactsVerified,0);
 assert.equal(diary.realRouteOpen,false);
 assert.equal(diary.seasonComplete,false);
 assert.deepEqual(diary.canonicalEvents,[]);
 assert.deepEqual(diary.unlocks,[]);
 assert.equal(paperReflectionWorld({...s,rights:['approved']},steps,null,correct),null);
 assert.equal(paperReflectionWorld(E11.dispatch(s,{type:'reset'}),steps,null,correct),null);
 assert.equal(paperReflectionWorld(s,['garden','map_room','garden'],null,correct),null);
});

test('Milo chooses one unverified PAPER question and safe future action, without claiming a check',()=>{
 const s=reviewed(),steps=['garden','map_room','garden','square'];
 const sorted={station:'check',garden:'check',planting:'check',route:'check'};
 assert.equal(paperReflectionFollowUp(s,steps.slice(0,-1),null,sorted),null);
 assert.equal(paperReflectionFollowUp(s,steps,null,{...sorted,route:'paper'}),null);
 const start=paperReflectionFollowUp(s,steps,null,sorted);
 assert.deepEqual(start.unknowns.map(q=>q.id),['station','garden','planting','route']);
 assert.equal(start.diaryLine,null);
 assert.equal(start.realWorldFactsVerified,0);
 assert.deepEqual(start.canonicalEvents,[]);
 assert.deepEqual(start.unlocks,[]);
 const mismatch=paperReflectionFollowUp(s,steps,null,sorted,'route','permission');
 assert.equal(mismatch.matched,false);
 assert.equal(mismatch.diaryLine,null);
 assert.match(mismatch.feedback,/Try a check/);
 for(const [id,action] of [['station','ask'],['garden','ask'],['planting','permission'],['route','survey']]){
  const plan=paperReflectionFollowUp(s,steps,null,sorted,id,action);
  assert.equal(plan.matched,true);
  assert.match(plan.diaryLine,/PAPER NEXT STEP — NOT DONE/);
  assert.equal(plan.actualCheckPerformed,false);
  assert.equal(plan.permissionApproved,false);
  assert.equal(plan.realRouteOpen,false);
  assert.equal(plan.seasonComplete,false);
  assert.deepEqual(plan.canonicalEvents,[]);
  assert.deepEqual(plan.unlocks,[]);
 }
 assert.equal(paperReflectionFollowUp(s,steps,null,sorted,'unknown','survey'),null);
 assert.equal(paperReflectionFollowUp(s,steps,null,sorted,'route','unknown'),null);
 assert.equal(paperReflectionFollowUp(s,steps,null,sorted,null,'survey'),null);
 assert.equal(paperReflectionFollowUp({...s,rights:['approved']},steps,null,sorted,'route','survey'),null);
 assert.equal(paperReflectionFollowUp(E11.dispatch(s,{type:'reset'}),steps,null,sorted,'route','survey'),null);
 assert.equal(paperReflectionFollowUp(s,steps.slice(0,-1),null,sorted,'route','survey'),null);
});

test('Milo moves a PAPER future-check marker; wrong stop, removal and reset cannot verify reality',()=>{
 const s=reviewed(),steps=['garden','map_room','garden','square'];
 const sorted={station:'check',garden:'check',planting:'check',route:'check'};
 assert.deepEqual(PAPER_CHECK_STOPS.map(x=>x.id),['square','garden','map_room']);
 assert.equal(paperFollowUpMap(s,steps,null,sorted,'route','permission','square'),null,
  'wrong verification action cannot place a question mark');
 const first=paperFollowUpMap(s,steps,null,sorted,'route','survey');
 assert.equal(first.markerPlaced,false);
 assert.equal(first.chroniclePreview,null);
 assert.equal(first.first.every(x=>!x.marker),true);
 const wrong=paperFollowUpMap(s,steps,null,sorted,'route','survey','garden');
 assert.equal(wrong.markerPlaced,true);
 assert.equal(wrong.markerMatches,false);
 assert.match(wrong.feedback,/Move it/);
 assert.equal(wrong.chroniclePreview,null);
 const moved=paperFollowUpMap(s,steps,null,sorted,'route','survey','square');
 assert.equal(moved.markerMatches,true);
 assert.equal(moved.now.find(x=>x.id==='square').marker,true);
 assert.equal(moved.now.filter(x=>x.marker).length,1);
 assert.match(moved.chroniclePreview,/PAPER MAP PLAN — NOT DONE/);
 assert.equal(moved.actualCheckPerformed,false);
 assert.equal(moved.realWorldFactsVerified,0);
 assert.equal(moved.permissionApproved,false);
 assert.equal(moved.realRouteOpen,false);
 assert.deepEqual(moved.canonicalEvents,[]);
 assert.deepEqual(moved.unlocks,[]);
 assert.equal(moved.seasonComplete,false);
 assert.equal(moved.persistentSave,false);
 assert.equal(paperFollowUpMap(s,steps,null,sorted,'route','survey','north_hill_closed'),null);
 assert.equal(paperFollowUpMap(s,steps,null,sorted,'route','survey','common'),null);
 assert.equal(paperFollowUpMap(s,steps,null,sorted,'station','ask','garden').markerMatches,false);
 assert.equal(paperFollowUpMap(s,steps,null,sorted,'station','ask','map_room').markerMatches,true);
 assert.equal(paperFollowUpMap(s,steps,null,sorted,'planting','permission','garden').markerMatches,true);
 assert.equal(paperFollowUpMap(s,steps.slice(0,-1),null,sorted,'route','survey','square'),null);
 assert.equal(paperFollowUpMap(s,steps,null,{...sorted,route:'paper'},'route','survey','square'),null);
 assert.equal(paperFollowUpMap({...s,rights:['approved']},steps,null,sorted,'route','survey','square'),null);
 assert.equal(paperFollowUpMap(E11.dispatch(s,{type:'reset'}),steps,null,sorted,'route','survey','square'),null);
});
