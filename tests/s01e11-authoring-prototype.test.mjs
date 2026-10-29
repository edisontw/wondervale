import test from 'node:test';
import assert from 'node:assert/strict';
import {VERSION,MODE,MAX_ACTIONS,START,BOUNDARY,SAFE_LINKS,CLOSED_LINKS,
 fresh,dispatch,replay,restore,projection} from '../engine/s01e11-authoring-prototype.mjs';
const go=(s,type,x={})=>dispatch(s,{type,...x});
const put=(s,tokenId,cells)=>go(s,'place',{tokenId,cells});
const run=(s,userId)=>go(s,'test-user',{userId});
const add=(s,edgeId)=>go(s,'add-loop-edge',{edgeId});
function layout(s,quiet='0,1',activity='2,1'){
 s=put(s,'access',['1,1','1,2']);
 s=put(s,'quiet',[quiet]);return put(s,'activity',[activity]);
}
function trial(s){s=run(s,'quiet_reader');s=run(s,'activity_group');return go(s,'snapshot-trial');}
function ready(){
 let s=trial(layout(fresh(),'0,1','0,2'));
 s=put(s,'activity',['2,1']);s=trial(s);
 s=go(s,'compare-trials',{first:'trial-1',second:'trial-2'});
 s=go(s,'cite-earlier',{discoveryId:'e09_closure'});
 for(const id of ['square-market','market-common','common-square'])s=add(s,id);
 return go(s,'check-loop');
}
test('fictional initial state has no canonical effects',()=>{
 const s=fresh();assert.equal(s.version,VERSION);assert.equal(s.mode,MODE);
 assert.equal(s.position,START);assert.deepEqual(s.canonicalEvents,[]);
 assert.deepEqual(s.unlocks,[]);assert.deepEqual(s.historicalClaims,[]);
 assert.equal(projection(s).finished,false);
});
test('Milo can walk adjacent model cells but cannot teleport or enter boundary',()=>{
 let s=fresh();assert.ok(BOUNDARY.includes('0,3'));
 for(const to of ['north_hill_closed','0,3','2,3','bad','2,2','1,3'])
  assert.deepEqual(go(s,'move-milo',{to}),s);
 s=go(s,'move-milo',{to:'1,1'});assert.equal(s.position,'1,1');
 s=go(s,'move-milo',{to:START});assert.equal(s.position,START);
});
test('Milo stops at occupied cell and may retry',()=>{
 let s=put(fresh(),'activity',['1,1']);
 s=go(s,'move-milo',{to:'1,1'});
 assert.equal(s.position,START);assert.equal(s.blockedAttempts,1);
 s=go(s,'lift',{tokenId:'activity'});
 s=go(s,'move-milo',{to:'1,1'});assert.equal(s.position,'1,1');
});
test('invalid token, cells, duplicate cells and forged approval rejected',()=>{
 const s=fresh();
 for(const a of [
  {type:'place',tokenId:'tree',cells:['0,1']},
  {type:'place',tokenId:'quiet',cells:['9,9']},
  {type:'place',tokenId:'quiet',cells:['0,3']},
  {type:'place',tokenId:'quiet',cells:['1,0']},
  {type:'place',tokenId:'activity',cells:['2,1','2,2']},
  {type:'place',tokenId:'quiet',cells:['0,1'],approved:true},
  {type:'place',tokenId:'quiet',cells:['__proto__']},
  {type:'place',tokenId:'access',cells:['0,1','0,2']}
 ])assert.deepEqual(dispatch(s,a),s);
});
test('declared access strip refuses occupied cells',()=>{
 let s=put(fresh(),'quiet',['1,1']);
 assert.deepEqual(put(s,'access',['1,1','1,2']),s);
 s=go(s,'lift',{tokenId:'quiet'});
 s=put(s,'access',['1,2','1,1']);
 assert.deepEqual(s.layout.access,['1,1','1,2']);
 assert.deepEqual(put(s,'activity',['1,2']),s);
});
test('quiet and activity pieces cannot overlap; lifting preserves other need',()=>{
 let s=put(fresh(),'quiet',['0,1']);
 assert.deepEqual(put(s,'activity',['0,1']),s);
 s=put(s,'activity',['2,1']);
 s=go(s,'lift',{tokenId:'activity'});
 assert.deepEqual(s.layout.activity,[]);assert.deepEqual(s.layout.quiet,['0,1']);
});
test('tempting activity placement blocks model passage',()=>{
 let s=layout(fresh(),'0,1','1,2');
 s=run(s,'activity_group');assert.equal(s.tests.activity_group.passed,false);
 assert.match(s.tests.activity_group.reason,/blocked/);
});
test('quiet reader detects activity directly beside quiet seat',()=>{
 let s=layout(fresh(),'0,1','0,2');
 s=run(s,'quiet_reader');assert.equal(s.tests.quiet_reader.passed,false);
 assert.match(s.tests.quiet_reader.reason,/touches/);
});
test('two distinct simulated needs pass after spatial revision',()=>{
 let s=layout(fresh());s=run(s,'quiet_reader');s=run(s,'activity_group');
 assert.equal(s.tests.quiet_reader.passed,true);
 assert.equal(s.tests.activity_group.passed,true);
});
test('snapshot requires both users tested on same revision',()=>{
 let s=layout(fresh());s=run(s,'quiet_reader');
 assert.deepEqual(go(s,'snapshot-trial'),s);
 s=run(s,'activity_group');s=go(s,'snapshot-trial');
 assert.equal(s.trials.length,1);assert.equal(s.trials[0].id,'trial-1');
 assert.deepEqual(s.trials[0].layout,s.layout);
});
test('placement invalidates stale user tests, comparison and review',()=>{
 let s=go(ready(),'review-preview');assert.equal(s.reviewed,true);
 s=put(s,'quiet',['0,2']);
 assert.deepEqual(s.tests,{});assert.equal(s.comparison,null);
 assert.equal(s.reviewed,false);assert.equal(s.loopChecked,true);
});
test('cannot snapshot same revision twice',()=>{
 const s=trial(layout(fresh()));
 assert.deepEqual(go(s,'snapshot-trial'),s);
});
test('comparison requires distinct snapshots and passing revised layout',()=>{
 let s=trial(layout(fresh(),'0,1','0,2'));
 assert.deepEqual(go(s,'compare-trials',{first:'trial-1',second:'trial-1'}),s);
 s=put(s,'activity',['2,1']);s=trial(s);
 s=go(s,'compare-trials',{first:'trial-1',second:'trial-2'});
 assert.equal(s.comparison.second,'trial-2');
 assert.match(s.comparison.limitation,/not real access/);
});
test('cannot compare if revised layout still fails',()=>{
 let s=trial(layout(fresh(),'0,1','0,2'));
 s=put(s,'activity',['1,2']);s=trial(s);
 assert.deepEqual(go(s,'compare-trials',{first:'trial-1',second:'trial-2'}),s);
});
test('earlier-discovery citation is explicitly synthetic',()=>{
 let s=go(fresh(),'cite-earlier',{discoveryId:'e06_drainage'});
 assert.equal(projection(s).citation.kind,'SYNTHETIC_REFERENCE_ONLY');
 assert.deepEqual(go(s,'cite-earlier',{discoveryId:'1901'}),s);
 assert.deepEqual(go(s,'cite-earlier',{discoveryId:'e10_needs',approved:true}),s);
});
test('closed hill, old or unknown links cannot be added',()=>{
 const s=fresh();assert.ok(CLOSED_LINKS.includes('north_hill_closed'));
 for(const edgeId of ['north_hill_closed','old_north_hill_direct','square-north_hill_closed','fake','__proto__'])
  assert.deepEqual(add(s,edgeId),s);
 assert.equal(Object.hasOwn(SAFE_LINKS,'common-square'),true);
});
test('disconnected chain fails loop check',()=>{
 let s=add(fresh(),'square-market');s=add(s,'market-common');
 s=go(s,'check-loop');assert.equal(s.loopChecked,false);
});
test('connected loop includes Common and three locations',()=>{
 let s=fresh();for(const id of ['square-market','market-common','common-square'])s=add(s,id);
 s=go(s,'check-loop');assert.equal(s.loopChecked,true);
});
test('disconnected island invalidates a complete cycle',()=>{
 let s=fresh();for(const id of ['square-market','market-common','common-square','garden-map_room'])s=add(s,id);
 s=go(s,'check-loop');assert.equal(s.loopChecked,false);
});
test('removing edge invalidates check and allows retry',()=>{
 let s=ready();s=go(s,'remove-loop-edge',{edgeId:'market-common'});
 assert.equal(s.loopChecked,false);
 s=go(s,'check-loop');assert.equal(s.loopChecked,false);
 s=add(s,'market-common');s=go(s,'check-loop');assert.equal(s.loopChecked,true);
});
test('final review requires comparison, synthetic evidence and safe loop',()=>{
 const incomplete=trial(layout(fresh()));
 assert.deepEqual(go(incomplete,'review-preview'),incomplete);
 const s=go(ready(),'review-preview');
 assert.equal(s.reviewed,true);
 assert.equal(projection(s).oldMapStatus,'HISTORIC LINE NOT PROVEN SAFE');
 assert.deepEqual(s.canonicalEvents,[]);assert.deepEqual(s.unlocks,[]);
});
test('strict replay and restore reproduce snapshots; reset is local',()=>{
 const s=go(ready(),'review-preview');
 assert.deepEqual(replay(s.history),s);
 assert.deepEqual(restore(structuredClone(s)),s);
 assert.deepEqual(go(s,'reset'),fresh());
});
test('forged history, rights, dates, unlock and commands fail closed',()=>{
 const s=go(ready(),'review-preview');
 for(const edit of [
  x=>{x.mode='CANONICAL';},x=>{x.reviewed=false;},x=>{x.finished=true;},
  x=>{x.unlocks.push('s01e12');},x=>{x.canonicalEvents.push('s01e11.common_reopened');},
  x=>{x.historicalClaims.push('1901');},x=>{x.rights.push('approved');},
  x=>{x.layout.activity=['0,3'];},x=>{x.trials[0].tests.quiet_reader.passed=true;},
  x=>{x.history[0].approved=true;}
 ]){const bad=structuredClone(s);edit(bad);
  assert.equal(restore(bad),null);assert.equal(projection(bad),null);
  assert.deepEqual(go(bad,'review-preview'),fresh());
 }
 for(const a of [null,{},'review',{type:'finish'},{type:'review-preview',approved:true},
  {type:'place',tokenId:'quiet',cells:['0,1'],date:'1901'},
  {type:'add-loop-edge',edgeId:'common-square',permission:true}])
  assert.deepEqual(dispatch(s,a),s);
});
test('bounded action ledger refuses overflow; reset remains available',()=>{
 let s=fresh();
 while(s.history.length<MAX_ACTIONS)
  s=go(s,'move-milo',{to:s.position===START?'1,1':START});
 assert.equal(s.history.length,MAX_ACTIONS);
 assert.deepEqual(go(s,'cite-earlier',{discoveryId:'e09_closure'}),s);
 assert.equal(replay([...s.history,{type:'review-preview'}]),null);
 assert.deepEqual(go(s,'reset'),fresh());
});
