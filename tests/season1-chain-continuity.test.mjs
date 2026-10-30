import test from 'node:test';
import assert from 'node:assert/strict';
import * as StationGarden from '../authoring-labs/world-change.mjs';
import * as GardenConnector from '../authoring-labs/garden-connector.mjs';
import * as ConnectorLantern from '../authoring-labs/connector-lantern.mjs';
import * as LanternHill from '../authoring-labs/lantern-hill.mjs';
import * as HillCourtyard from '../authoring-labs/hill-courtyard.mjs';
import * as NeedsLayout from '../authoring-labs/needs-layout.mjs';
import {SCENES,HANDOFFS,handoffAudit} from '../authoring-labs/handoff-contract.mjs';

// Same child actions replayed in overlapping independent PAPER labs.
// Equality does not transfer snapshots, authorize history, or unlock production.
const a=(type,props={})=>[type,props];
const STATION=[
 a('inspect-feature',{id:'peg-pair'}),a('inspect-feature',{id:'worn-edge'}),
 a('place-replica',{orientation:'side-b'}),a('compare-fit'),
 a('place-replica',{orientation:'side-a'}),a('compare-fit'),a('note-limits'),
 a('place-table',{position:'across-walkway'}),a('place-table',{position:'near-wall'}),a('confirm-room')
];
const GARDEN=[
 a('walk-to',{target:'slope'}),a('inspect',{id:'slope'}),
 a('walk-to',{target:'shared-path'}),a('inspect',{id:'shared-path'}),
 a('walk-to',{target:'model-tray'}),a('run-model'),
 a('set-weather',{weather:'rain'}),a('run-model'),
 a('set-channel',{channel:'blocked'}),a('run-model'),a('compare-model'),a('visit-lower'),
 a('inspect',{id:'runoff-trace'}),a('walk-to',{target:'public-path'}),a('inspect',{id:'public-path'}),
 ...['runoff-channel','footpath','raised-pocket'].flatMap(site=>[
  a('walk-to',{target:site}),a('move-marker',{site}),a('inspect-result')
 ]),a('confirm-small-trial')
];
const CONNECTOR=[
 a('walk',{anchor:'shared-path'}),a('inspect',{anchor:'shared-path'}),
 a('walk',{anchor:'channel'}),a('inspect',{anchor:'channel'}),a('walk',{anchor:'workbench'}),
 a('test-milo'),a('test-resident'),a('test-water'),
 a('place-piece',{pieceId:'connector',snapId:'path-clear-water-blocked'}),a('run-all-traces'),
 a('place-piece',{pieceId:'connector',snapId:'side-offset'}),a('run-all-traces'),
 a('compare-layouts'),a('confirm-preview')
];
const STEPS=[
 ...['brackets','boundary','lower-a'].map(feature=>a('inspect',{feature})),
 a('walk',{anchor:'lower-landing'}),a('inspect',{feature:'lower-b'}),
 a('toggle-lamp',{lampId:'lower-a'}),a('toggle-lamp',{lampId:'lower-b'}),
 a('walk',{anchor:'base'}),a('observe-view'),
 a('walk',{anchor:'lower-landing'}),a('walk',{anchor:'side'}),a('observe-view'),
 a('inspect',{feature:'service-plate'}),a('compare-views'),a('confirm-preview')
];
const HILL=[
 a('inspect',{clueId:'entry_note'}),a('walk',{to:'signpost'}),
 a('inspect',{clueId:'boundary_sign'}),a('walk',{to:'fence_view'}),
 a('inspect',{clueId:'disturbed_ground'}),a('walk',{to:'upper_closed'}),
 a('consider',{hypothesisId:'water_may_change_ground'}),a('walk',{to:'signpost'}),
 a('walk',{to:'lower_bend'}),a('inspect',{clueId:'runoff_marks'}),
 a('walk',{to:'overlook'}),a('inspect',{clueId:'distant_symbol'}),
 a('mark',{edgeId:'steps_base:signpost'}),a('mark',{edgeId:'lower_bend:overlook'}),
 a('check-route'),a('mark',{edgeId:'signpost:lower_bend'}),a('check-route'),
 a('compare-symbol'),a('review'),a('finish-preview')
];
const NEEDS=[
 a('compare-symbol'),a('walk',{to:'stone_edge'}),a('inspect',{traceId:'surface'}),
 a('suggest',{traceId:'surface',useTag:'meeting'}),
 a('revise',{traceId:'surface',oldTag:'meeting',newTag:'resting'}),
 a('walk',{to:'quiet_corner'}),a('hear',{needId:'quiet'}),
 a('place',{needId:'quiet',slot:'left'}),a('walk',{to:'meeting_edge'}),
 a('hear',{needId:'activity'}),a('place',{needId:'activity',slot:'left'}),
 a('place',{needId:'activity',slot:'right'}),a('walk',{to:'notice_wall'}),
 a('inspect',{traceId:'holes'}),a('suggest',{traceId:'holes',useTag:'display'}),
 a('check-source'),a('review-tradeoff'),a('review')
];
const LAYOUT=[
 a('place',{tokenId:'access',cells:['1,1','1,2']}),
 a('place',{tokenId:'quiet',cells:['0,1']}),
 a('place',{tokenId:'activity',cells:['0,2']}),
 a('test-user',{userId:'quiet_reader'}),a('test-user',{userId:'activity_group'}),
 a('snapshot-trial'),a('place',{tokenId:'activity',cells:['2,1']}),
 a('test-user',{userId:'quiet_reader'}),a('test-user',{userId:'activity_group'}),
 a('snapshot-trial'),a('compare-trials',{first:'trial-1',second:'trial-2'}),
 a('cite-earlier',{discoveryId:'e10_needs'}),
 ...['square-market','market-common','common-square'].map(edgeId=>a('add-loop-edge',{edgeId})),
 a('check-loop'),a('review-preview')
];
function perform(mod,s,scene,actions){
 for(const [type,props] of actions){
  const next=mod.dispatch(s,{scene,type,...props});
  assert.equal(next.history.length,s.history.length+1,scene+'/'+type+' must be a real child action');
  s=next;
 }
 return s;
}
const go=(mod,s,type)=>perform(mod,s,'nav',[a(type)]);
function guarded(mod,s){
 assert.deepEqual(mod.replay(s.history),s);
 assert.deepEqual(mod.restore(structuredClone(s)),s);
 assert.ok(s.history.length<mod.MAX_ACTIONS);
 assert.equal(s.mode,'authoring_preview');
 assert.deepEqual(s.canonicalEvents,[]);assert.deepEqual(s.unlocks,[]);
 const p=mod.project(s);
 assert.deepEqual(p.canonicalEvents,[]);assert.deepEqual(p.unlocks,[]);
 assert.deepEqual(p.historicalClaims,[]);
 assert.equal('localStorage' in s,false);
 const bad=structuredClone(s);bad.unlocks.push('s01e11');
 assert.equal(mod.restore(bad),null);
 return p;
}
test('E05–E11 overlapping paper journeys preserve reducer outcomes without invented unlocks',()=>{
 assert.equal(SCENES.length,9); // E04 plus E05–E11, E06 has two scenes
 assert.equal(HANDOFFS.length,8);
 assert.equal(SCENES.find(x=>x.id==='e04').status,'blocked-design');
 assert.ok(handoffAudit().every(x=>!x.productionEligible&&!x.canonicalEventIssued&&!x.unlockIssued));

 let sg=perform(StationGarden,StationGarden.fresh(),'e05',STATION);
 assert.equal(sg.e05.roomPreview,true);
 sg=go(StationGarden,sg,'to-current');
 sg=perform(StationGarden,sg,'e06',GARDEN);
 assert.equal(sg.e06.lowerPreviewStarted,true);
 const stationModel=structuredClone(sg.e05),gardenModel=structuredClone(sg.e06);
 let gc=perform(GardenConnector,GardenConnector.fresh(),'garden',GARDEN);
 assert.deepEqual(gc.garden,gardenModel,'E06 Current/Lower must not drift');
 gc=go(GardenConnector,gc,'to-connector');
 gc=perform(GardenConnector,gc,'connector',CONNECTOR);
 assert.equal(gc.connector.previewComplete,true);
 const connectorModel=structuredClone(gc.connector);
 let cl=perform(ConnectorLantern,ConnectorLantern.fresh(),'connector',CONNECTOR);
 assert.deepEqual(cl.connector,connectorModel,'E07 connector must not drift');
 cl=go(ConnectorLantern,cl,'to-steps');
 assert.deepEqual(cl.steps.lights,{'lower-a':false,'lower-b':false});
 cl=perform(ConnectorLantern,cl,'steps',STEPS);
 assert.equal(cl.steps.previewComplete,true);
 const stepsModel=structuredClone(cl.steps);
 let lh=perform(LanternHill,LanternHill.fresh(),'steps',STEPS);
 assert.deepEqual(lh.steps,stepsModel,'E08 lower lamps/views must not drift');
 lh=go(LanternHill,lh,'to-hill');
 lh=perform(LanternHill,lh,'hill',HILL);
 assert.equal(lh.hill.provisionalFinished,true);
 assert.ok(lh.hill.blockedAttempts>0);
 const hillModel=structuredClone(lh.hill);
 let hc=perform(HillCourtyard,HillCourtyard.fresh(),'hill',HILL);
 assert.deepEqual(hc.hill,hillModel,'E09 lower survey must not drift');
 hc=go(HillCourtyard,hc,'to-courtyard');
 hc=perform(HillCourtyard,hc,'courtyard',NEEDS);
 assert.equal(hc.courtyard.nameRevealed,false);
 const needsModel=structuredClone(hc.courtyard);
 let nl=perform(NeedsLayout,NeedsLayout.fresh(),'needs',NEEDS);
 assert.deepEqual(nl.needs,needsModel,'E10 needs/source must not drift');
 nl=go(NeedsLayout,nl,'to-layout');
 nl=perform(NeedsLayout,nl,'layout',LAYOUT);
 assert.equal(nl.layout.reviewed,true);
 assert.equal(nl.layout.trials[0].tests.quiet_reader.passed,false);
 assert.equal(nl.layout.trials[1].tests.quiet_reader.passed,true);
 assert.equal(nl.layout.trials[1].tests.activity_group.passed,true);

 // Actual revisits within each bridge preserve paper models; no cross-lab snapshot transfer.
 sg=go(StationGarden,sg,'to-station');assert.deepEqual(sg.e05,stationModel);
 assert.deepEqual(sg.e06,gardenModel);
 sg=go(StationGarden,sg,'to-lower');assert.deepEqual(sg.e06,gardenModel);
 gc=go(GardenConnector,gc,'to-garden');assert.deepEqual(gc.connector,connectorModel);
 gc=go(GardenConnector,gc,'to-connector');assert.deepEqual(gc.connector,connectorModel);
 cl=go(ConnectorLantern,cl,'to-connector');assert.deepEqual(cl.steps,stepsModel);
 cl=go(ConnectorLantern,cl,'to-steps');assert.deepEqual(cl.steps,stepsModel);
 lh=go(LanternHill,lh,'to-steps');assert.deepEqual(lh.hill,hillModel);
 lh=go(LanternHill,lh,'to-hill');assert.deepEqual(lh.hill,hillModel);
 hc=go(HillCourtyard,hc,'to-hill');assert.deepEqual(hc.courtyard,needsModel);
 hc=go(HillCourtyard,hc,'to-courtyard');assert.deepEqual(hc.courtyard,needsModel);
 nl=go(NeedsLayout,nl,'to-needs');assert.equal(nl.layout.reviewed,true);
 nl=go(NeedsLayout,nl,'to-layout');assert.equal(nl.layout.reviewed,true);

 const p=[guarded(StationGarden,sg),guarded(GardenConnector,gc),
  guarded(ConnectorLantern,cl),guarded(LanternHill,lh),
  guarded(HillCourtyard,hc),guarded(NeedsLayout,nl)];
 assert.equal(p[0].mapRoomVisible,true);assert.equal(p[0].upperGardenHealthy,true);
 assert.equal(p[0].lowerPocketVisible,true);
 assert.equal(p[1].pocketStage,'paper-leaves');
 assert.equal(p[2].lowerLampsLit,true);assert.equal(p[2].historicalDate,null);
 assert.equal(p[3].upperHillClosed,true);assert.equal(p[3].distantPlaceIdentity,null);
 assert.equal(p[4].unknownName,true);assert.equal(p[4].actualCourtyardName,null);
 assert.equal(p[5].upperHillClosed,true);assert.equal(p[5].actualName,null);
 assert.equal(p[5].seasonFinished,false);
});
test('no E04 bypass, unsafe hill edge, false history or synthetic season completion',()=>{
 for(const mod of [StationGarden,GardenConnector,ConnectorLantern,LanternHill,HillCourtyard,NeedsLayout]){
  const s=mod.fresh();
  for(const action of [
   {scene:'nav',type:'to-e04',sourceApproved:true},
   {scene:'nav',type:'to-common',unlock:true},
   {scene:'hill',type:'walk',to:'upper_closed',approved:true},
   {scene:'layout',type:'review-preview',canonical:true},
   {scene:'nav',type:'finish-season'}
  ])assert.deepEqual(mod.dispatch(s,action),s);
  assert.deepEqual(mod.project(s).canonicalEvents,[]);
 }
});
