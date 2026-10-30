// E10 PAPER child-story reducer tests: no genuine history, name source or production unlock.
import test from 'node:test';
import assert from 'node:assert/strict';
import {VERSION,MAX_STEPS,fresh,dispatch,can,replay,restore,view} from '../authoring-labs/unnamed-story-model.mjs';
const act=(s,type,extra={})=>dispatch(s,{type,...extra});
function explored(){
 let s=act(fresh(),'start');
 s=act(s,'compare-symbol');
 s=act(s,'walk',{to:'stone_edge'});s=act(s,'inspect',{traceId:'surface'});
 s=act(s,'suggest',{traceId:'surface',useTag:'passing'});
 s=act(s,'revise',{traceId:'surface',oldTag:'passing',newTag:'resting'});
 s=act(s,'walk',{to:'quiet_corner'});s=act(s,'hear',{needId:'quiet'});
 s=act(s,'place',{needId:'quiet',slot:'shared'});
 s=act(s,'walk',{to:'meeting_edge'});s=act(s,'hear',{needId:'activity'});
 s=act(s,'place',{needId:'activity',slot:'shared'});
 s=act(s,'test-one-slot');
 s=act(s,'place',{needId:'quiet',slot:'left'});
 s=act(s,'place',{needId:'activity',slot:'right'});
 s=act(s,'walk',{to:'notice_wall'});s=act(s,'inspect',{traceId:'holes'});
 s=act(s,'suggest',{traceId:'holes',useTag:'display'});
 return s;
}
function complete(){
 let s=explored();
 s=act(s,'check-source');s=act(s,'review-tradeoff');
 s=act(s,'review');return act(s,'finish-paper');
}
test('fresh PAPER story cannot reveal a name, open the hill or award unlocks',()=>{
 const s=fresh(),v=view(s);
 assert.equal(s.version,VERSION);assert.equal(v.stage,'opening');
 assert.equal(v.actualName,null);assert.equal(v.e11Unlocked,false);
 assert.equal(v.upperHillClosed,true);assert.equal(v.sourceApproved,false);
 assert.deepEqual(v.canonicalEvents,[]);assert.deepEqual(v.unlocks,[]);
 assert.deepEqual(v.historicalClaims,[]);assert.deepEqual(v.rights,[]);
 assert.equal(s.e10.fixtureEnabled,false);assert.equal(s.e10.nameRevealed,false);
});
test('no autoplay, forged source token, unapproved date or extra command fields',()=>{
 const s=fresh();
 for(const a of [{type:'walk',to:'stone_edge'},{type:'enable-fixture'},
  {type:'finish-preview'},{type:'grant-unlock'},{type:'check-source',approved:true},
  {type:'start',source:'approved'},null]){
  assert.deepEqual(dispatch(s,a),s);
 }
 assert.equal(can(s,{type:'start'}),true);
});
test('Milo walks only adjacent fictional anchors; closed hill safely stops',()=>{
 let s=act(fresh(),'start');
 assert.equal(can(s,{type:'walk',to:'meeting_edge'}),false);
 s=act(s,'walk',{to:'stone_edge'});assert.equal(view(s).position,'stone_edge');
 s=act(s,'walk',{to:'closed_hill'});assert.equal(view(s).position,'stone_edge');
 assert.equal(s.e10.blockedAttempts,1);assert.match(view(s).feedback,/closed/i);
 s=act(s,'walk',{to:'entry'});assert.equal(view(s).position,'entry');
});
test('observations stay SEEN while MAYBE use tags can be revised',()=>{
 let s=act(fresh(),'start');
 s=act(s,'walk',{to:'stone_edge'});s=act(s,'inspect',{traceId:'surface'});
 const original=structuredClone(view(s).observations);
 s=act(s,'suggest',{traceId:'surface',useTag:'passing'});
 s=act(s,'revise',{traceId:'surface',oldTag:'passing',newTag:'meeting'});
 assert.deepEqual(view(s).observations,original);
 assert.deepEqual(view(s).hypotheses.map(x=>x.useTag),['meeting']);
 assert.equal(view(s).hypotheses[0].qualifier,'MAYBE');
 assert.equal(can(s,{type:'suggest',traceId:'surface',useTag:'1902'}),false);
});
test('parent prompts follow actual inspections and listening',()=>{
 let s=act(fresh(),'start');
 assert.equal(view(s).parentEvidenceCue,null);assert.equal(view(s).parentNeedsCue,null);
 s=act(s,'walk',{to:'stone_edge'});s=act(s,'inspect',{traceId:'surface'});
 assert.equal(view(s).parentEvidenceCue,null);
 s=act(s,'walk',{to:'entry'});s=act(s,'walk',{to:'notice_wall'});
 s=act(s,'inspect',{traceId:'holes'});
 assert.match(view(s).parentEvidenceCue,/more than one use/);
 s=act(s,'walk',{to:'meeting_edge'});s=act(s,'hear',{needId:'activity'});
 assert.equal(view(s).parentNeedsCue,null);
 s=act(s,'walk',{to:'quiet_corner'});s=act(s,'hear',{needId:'quiet'});
 assert.match(view(s).parentNeedsCue,/Whose need/);
});
test('two needs must be heard and tried together before a reversible comparison',()=>{
 let s=explored();
 assert.equal(s.testedOneSlot,true);assert.equal(s.changedAfterTest,true);
 assert.equal(view(s).board.quiet,'left');assert.equal(view(s).board.activity,'right');
 assert.equal(view(s).heard.length,2);
 assert.equal(can(s,{type:'review-tradeoff'}),true);
 const before=act(fresh(),'start');
 assert.equal(can(before,{type:'test-one-slot'}),false);
 assert.equal(can(before,{type:'review-tradeoff'}),false);
});
test('source check remains UNKNOWN; four-column PAPER review does not finish season',()=>{
 const s=complete(),v=view(s);
 assert.equal(v.stage,'finished');assert.equal(v.finishedPaper,true);
 assert.equal(s.e10.sourceChecked,true);assert.equal(s.e10.nameRevealed,false);
 assert.equal(s.e10.fixtureEnabled,false);assert.equal(s.e10.finished,false);
 assert.match(v.paperNote,/UNKNOWN/);assert.match(v.paperNote,/E11 NOT UNLOCKED/);
 assert.equal(v.seasonFinished,false);assert.equal(v.realAccessApproved,false);
 assert.equal(v.needs.length,2);assert.equal(v.observations.length,2);
 assert.deepEqual(v.canonicalEvents,[]);assert.deepEqual(v.unlocks,[]);
 assert.deepEqual(v.historicalClaims,[]);
 assert.deepEqual(replay(s.history),s);
 assert.deepEqual(restore(structuredClone(s)),s);
 assert.equal(can(s,{type:'walk',to:'entry'}),false);
});
test('strict replay rejects fake identity, source, rights, board and history',()=>{
 const s=complete();
 for(const change of [
  x=>x.unlocks.push('s01e11'),x=>x.canonicalEvents.push('s01e10.complete'),
  x=>x.historicalClaims.push('1902'),x=>x.rights.push('approved'),
  x=>x.e10.nameRevealed=true,x=>x.e10.fixtureEnabled=true,
  x=>x.e10.board.quiet='shared',x=>x.e10.position='closed_hill',
  x=>x.history[0].type='enable-fixture',x=>x.mode='canonical',
  x=>x.finishedPaper=false
 ]){
  const bad=structuredClone(s);change(bad);
  assert.equal(restore(bad),null);
  assert.deepEqual(dispatch(bad,{type:'finish-paper'}),fresh());
 }
 assert.equal(replay(Array(MAX_STEPS+1).fill({type:'start'})),null);
});
test('paper review can be restarted without persistence',()=>{
 const s=complete();assert.deepEqual(dispatch(s,{type:'reset'}),fresh());
 assert.equal(can(fresh(),{type:'finish-paper'}),false);
});
