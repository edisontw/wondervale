import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch,can,view,replay,restore,MAX_ACTIONS} from '../authoring-labs/unnamed-loop-handoff-model.mjs';
const u=(s,type,x={})=>dispatch(s,{scene:'e10',action:{type,...x}});
const l=(s,type,x={})=>dispatch(s,{scene:'e11',action:{type,...x}});
const nav=(s,type)=>dispatch(s,{scene:'nav',type});
function e10Done(){
 let s=u(fresh(),'start');s=u(s,'compare-symbol');
 s=u(s,'walk',{to:'stone_edge'});s=u(s,'inspect',{traceId:'surface'});
 s=u(s,'suggest',{traceId:'surface',useTag:'passing'});
 s=u(s,'revise',{traceId:'surface',oldTag:'passing',newTag:'resting'});
 s=u(s,'walk',{to:'quiet_corner'});s=u(s,'hear',{needId:'quiet'});
 s=u(s,'place',{needId:'quiet',slot:'shared'});
 s=u(s,'walk',{to:'meeting_edge'});s=u(s,'hear',{needId:'activity'});
 s=u(s,'place',{needId:'activity',slot:'shared'});
 s=u(s,'test-one-slot');s=u(s,'place',{needId:'quiet',slot:'left'});
 s=u(s,'place',{needId:'activity',slot:'right'});
 s=u(s,'walk',{to:'notice_wall'});s=u(s,'inspect',{traceId:'holes'});
 s=u(s,'suggest',{traceId:'holes',useTag:'display'});
 s=u(s,'check-source');s=u(s,'review-tradeoff');s=u(s,'review');
 return u(s,'finish-paper');
}
function e11Done(s){
 s=nav(s,'to-e11');s=l(s,'start');
 s=l(s,'move-milo',{to:'1,1'});s=l(s,'move-milo',{to:'1,0'});
 s=l(s,'place',{tokenId:'access',cells:['1,1','1,2']});
 s=l(s,'place',{tokenId:'quiet',cells:['0,1']});
 s=l(s,'place',{tokenId:'activity',cells:['0,2']});
 s=l(s,'test-user',{userId:'quiet_reader'});s=l(s,'test-user',{userId:'activity_group'});
 s=l(s,'snapshot-trial');
 s=l(s,'place',{tokenId:'activity',cells:['2,1']});
 s=l(s,'test-user',{userId:'quiet_reader'});s=l(s,'test-user',{userId:'activity_group'});
 s=l(s,'snapshot-trial');
 s=l(s,'compare-trials',{first:'trial-1',second:'trial-2'});
 s=l(s,'cite-earlier',{discoveryId:'e10_needs'});
 for(const edgeId of ['square-market','market-common','common-square'])s=l(s,'add-loop-edge',{edgeId});
 s=l(s,'check-loop');s=l(s,'review-preview');
 return l(s,'finish-paper');
}
test('E11 PAPER cannot start without child-led E10 source-UNKNOWN review',()=>{
 const s=fresh(),v=view(s);
 assert.equal(v.stage,'e10');assert.equal(v.paperReady,false);
 assert.equal(can(s,{scene:'nav',type:'to-e11'}),false);
 assert.deepEqual(nav(s,'to-e11'),s);
 assert.deepEqual(l(s,'start'),s);
 assert.equal(v.actualName,null);assert.equal(v.e11Unlocked,false);
 assert.equal(v.northHillClosed,true);assert.equal(v.sharedSpaceOpen,false);
});
test('E10 evidence, two simulated needs, conflict and revision hand off only as PAPER',()=>{
 const s=e10Done(),v=view(s);
 assert.equal(v.paperReady,true);assert.equal(v.e10.finishedPaper,true);
 assert.equal(v.e10.sourceChecked,true);assert.equal(v.e10.sourceApproved,false);
 assert.equal(v.e10.e11Unlocked,false);
 const next=nav(s,'to-e11');
 assert.equal(next.stage,'e11');
 assert.deepEqual(next.handoff,{kind:'SIMULATED_PAPER_ONLY',source:'UNKNOWN',
  needs:{quiet:'left',activity:'right'}});
 assert.deepEqual(next.e11.history,[]);
 assert.deepEqual(next.canonicalEvents,[]);assert.deepEqual(next.unlocks,[]);
 assert.deepEqual(replay(next.history),next);
});
test('Milo revises E11 after failed simulated need; return preserves paper state',()=>{
 const done=e11Done(e10Done()),v=view(done);
 assert.equal(v.stage,'e11');assert.equal(v.e11PaperFinished,true);
 assert.equal(v.e11.firstFailed,true);assert.equal(v.e11.revisedAfterFailure,true);
 assert.equal(v.e11.trials.length,2);assert.equal(v.e11.loopChecked,true);
 assert.equal(v.seasonFinished,false);assert.equal(v.sharedSpaceOpen,false);
 assert.equal(v.e11Unlocked,false);assert.equal(v.actualName,null);
 assert.deepEqual(v.canonicalEvents,[]);assert.deepEqual(v.unlocks,[]);
 assert.deepEqual(v.historicalClaims,[]);assert.deepEqual(v.rights,[]);
 assert.deepEqual(replay(done.history),done);
 assert.deepEqual(restore(structuredClone(done)),done);
 const back=nav(done,'to-e10');assert.equal(back.stage,'e10');
 assert.equal(view(back).e10.finishedPaper,true);
 const again=nav(back,'to-e11');assert.equal(again.stage,'e11');
 assert.deepEqual(again.e11,done.e11);
});
test('restart upstream discards downstream E11 and requires fresh E10 child work',()=>{
 const done=e11Done(e10Done());
 const reset=nav(done,'restart-e10');
 assert.equal(reset.stage,'e10');assert.equal(reset.e10.finishedPaper,false);
 assert.equal(reset.e11.finishedPaper,false);assert.equal(reset.handoff,null);
 assert.equal(can(reset,{scene:'nav',type:'to-e11'}),false);
 assert.deepEqual(replay(reset.history),reset);
});
test('forged source, identity, permissions, unlocks, extra fields and closed-hill route rejected',()=>{
 const done=e11Done(e10Done());
 for(const a of [
  {scene:'nav',type:'to-e11',approved:true},
  {scene:'e10',action:{type:'enable-fixture'}},
  {scene:'e11',action:{type:'finish-season'}},
  {scene:'e11',action:{type:'add-loop-edge',edgeId:'old_north_hill_direct'}},
  {scene:'e11',action:{type:'finish-paper',realAccessApproved:true}},
  {scene:'nav',type:'reset-all',source:'approved'}
 ])assert.deepEqual(dispatch(done,a),done);
 for(const change of [
  x=>x.mode='canonical',x=>x.unlocks.push('s01e11'),
  x=>x.canonicalEvents.push('season.done'),x=>x.historicalClaims.push('1902'),
  x=>x.rights.push('approved'),x=>x.handoff.source='VERIFIED',
  x=>x.handoff.needs.quiet='fake',x=>x.e10.e10.nameRevealed=true,
  x=>x.e11.e11.finished=true,x=>x.history[0].action.approved=true
 ]){
  const bad=structuredClone(done);change(bad);
  assert.equal(restore(bad),null);
  assert.deepEqual(dispatch(bad,{scene:'nav',type:'to-e10'}),fresh());
 }
 assert.equal(replay(Array(MAX_ACTIONS+1).fill({scene:'nav',type:'to-e11'})),null);
});
