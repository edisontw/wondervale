import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch,replay,restore,project,MAX_ACTIONS} from '../authoring-labs/needs-layout.mjs';
const act=(s,scene,type,extra={})=>dispatch(s,{scene,type,...extra});
const needs=(s,type,extra={})=>act(s,'needs',type,extra);
const layout=(s,type,extra={})=>act(s,'layout',type,extra);
const nav=(s,type)=>act(s,'nav',type);
function reviewedNeeds(){
 let s=fresh();s=needs(s,'compare-symbol');
 s=needs(s,'walk',{to:'stone_edge'});
 s=needs(s,'inspect',{traceId:'surface'});
 s=needs(s,'suggest',{traceId:'surface',useTag:'meeting'});
 s=needs(s,'revise',{traceId:'surface',oldTag:'meeting',newTag:'resting'});
 s=needs(s,'walk',{to:'quiet_corner'});
 s=needs(s,'hear',{needId:'quiet'});
 s=needs(s,'place',{needId:'quiet',slot:'left'});
 s=needs(s,'walk',{to:'meeting_edge'});
 s=needs(s,'hear',{needId:'activity'});
 s=needs(s,'place',{needId:'activity',slot:'left'});
 s=needs(s,'place',{needId:'activity',slot:'right'});
 s=needs(s,'walk',{to:'notice_wall'});
 s=needs(s,'inspect',{traceId:'holes'});
 s=needs(s,'suggest',{traceId:'holes',useTag:'display'});
 s=needs(s,'check-source');
 s=needs(s,'review-tradeoff');
 return needs(s,'review');
}
function revisedLayout(){
 let s=nav(reviewedNeeds(),'to-layout');
 s=layout(s,'place',{tokenId:'access',cells:['1,1','1,2']});
 s=layout(s,'place',{tokenId:'quiet',cells:['0,1']});
 s=layout(s,'place',{tokenId:'activity',cells:['0,2']});
 s=layout(s,'test-user',{userId:'quiet_reader'});
 s=layout(s,'test-user',{userId:'activity_group'});
 s=layout(s,'snapshot-trial');
 s=layout(s,'place',{tokenId:'activity',cells:['2,1']});
 s=layout(s,'test-user',{userId:'quiet_reader'});
 s=layout(s,'test-user',{userId:'activity_group'});
 s=layout(s,'snapshot-trial');
 s=layout(s,'compare-trials',{first:'trial-1',second:'trial-2'});
 s=layout(s,'cite-earlier',{discoveryId:'e10_needs'});
 for(const edgeId of ['square-market','market-common','common-square'])
  s=layout(s,'add-loop-edge',{edgeId});
 s=layout(s,'check-loop');
 return layout(s,'review-preview');
}
test('E11 paper layout blocked until E10 two needs, sources and reversible review',()=>{
 const s=fresh();
 assert.deepEqual(nav(s,'to-layout'),s);
 assert.deepEqual(layout(s,'place',{tokenId:'quiet',cells:['0,1']}),s);
 const r=reviewedNeeds();
 assert.equal(r.needs.reviewed,true);
 assert.equal(r.needs.nameRevealed,false);
 assert.equal(r.needs.sourceChecked,true);
 assert.deepEqual(r.needs.board,{quiet:'left',activity:'right'});
 assert.equal(nav(r,'to-layout').stage,'layout');
});
test('child tests failing conflict, revises both needs and draws only fictional safe loop',()=>{
 const s=revisedLayout(),p=project(s);
 assert.equal(s.layout.trials[0].tests.quiet_reader.passed,false);
 assert.equal(s.layout.trials[1].tests.quiet_reader.passed,true);
 assert.equal(s.layout.trials[1].tests.activity_group.passed,true);
 assert.equal(s.layout.reviewed,true);
 assert.equal(p.loopChecked,true);
 assert.equal(p.actualName,null);
 assert.equal(p.actualAccessApproved,false);
 assert.equal(p.seasonFinished,false);
 assert.deepEqual(p.canonicalEvents,[]);
 assert.deepEqual(p.unlocks,[]);
 assert.deepEqual(p.historicalClaims,[]);
 assert.deepEqual(layout(s,'add-loop-edge',{edgeId:'north_hill_closed'}),s);
 assert.deepEqual(layout(s,'review-preview'),s);
});
test('revisit retains paper board; changing needs invalidates the E11 trial',()=>{
 let s=revisedLayout();
 s=nav(s,'to-needs');
 assert.equal(s.needs.reviewed,true);
 assert.equal(s.layout.reviewed,true);
 s=nav(s,'to-layout');
 assert.equal(s.layout.trials.length,2);
 s=nav(s,'to-needs');
 s=needs(s,'place',{needId:'activity',slot:'shared'});
 assert.equal(s.needs.reviewed,false);
 assert.equal(s.layout.trials.length,0);
 assert.deepEqual(nav(s,'to-layout'),s);
});
test('strict replay rejects forged source, historical date, unlock and malformed action',()=>{
 const s=revisedLayout();
 assert.ok(s.history.length<MAX_ACTIONS);
 assert.deepEqual(replay(s.history),s);
 assert.deepEqual(restore(structuredClone(s)),s);
 for(const change of [
  x=>x.unlocks.push('s01e11'),x=>x.canonicalEvents.push('season_finished'),
  x=>x.historicalClaims.push('1900'),x=>x.rights.push('real_access'),
  x=>x.needs.fixtureEnabled=true,x=>x.needs.nameRevealed=true,
  x=>x.layout.finished=true,x=>x.layout.loopEdges.push('north_hill_closed'),
  x=>x.history[0].sourceDate='1900'
 ]){
  const bad=structuredClone(s);change(bad);
  assert.equal(restore(bad),null);
  assert.deepEqual(nav(bad,'to-needs'),fresh());
 }
 for(const a of [
  {scene:'needs',type:'enable-fixture'},
  {scene:'needs',type:'finish-preview'},
  {scene:'layout',type:'reset'},
  {scene:'nav',type:'to-production'},
  {scene:'layout',type:'add-loop-edge',edgeId:'old_north_hill_direct'},
  {scene:'layout',type:'review-preview',canonical:true}
 ])assert.deepEqual(dispatch(s,a),s);
});
