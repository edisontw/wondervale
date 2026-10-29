import test from 'node:test';
import assert from 'node:assert/strict';
import {VERSION,MAX_ACTIONS,NODES,CLOSED_NODE,EDGES,TRACES,NEEDS,USE_TAGS,SLOTS,
 fresh,dispatch,replay,restore,previewProjection} from '../engine/s01e10-authoring-prototype.mjs';
const act=(s,type,extra={})=>dispatch(s,{type,...extra});
const walk=(s,to)=>act(s,'walk',{to}), inspect=(s,traceId)=>act(s,'inspect',{traceId});
const suggest=(s,traceId,useTag)=>act(s,'suggest',{traceId,useTag});
const hear=(s,needId)=>act(s,'hear',{needId}),place=(s,needId,slot)=>act(s,'place',{needId,slot});
function explored(){
 let s=act(fresh(),'compare-symbol');
 s=walk(s,'stone_edge');s=inspect(s,'surface');s=suggest(s,'surface','passing');
 s=walk(s,'quiet_corner');s=hear(s,'quiet');s=place(s,'quiet','left');
 s=walk(s,'meeting_edge');s=hear(s,'activity');s=place(s,'activity','right');
 s=walk(s,'notice_wall');s=inspect(s,'holes');s=suggest(s,'holes','display');
 return s;
}
function reviewed(fixture=true){
 let s=explored();if(fixture)s=act(s,'enable-fixture');
 s=act(s,'check-source');s=act(s,'review-tradeoff');return act(s,'review');
}
test('fresh model is synthetic, not canonical',()=>{
 const s=fresh();assert.equal(s.version,VERSION);assert.equal(s.mode,'SYNTHETIC_AUTHORING_ONLY');
 assert.equal(s.position,'entry');assert.equal(s.fixtureEnabled,false);
 assert.deepEqual(s.canonicalEvents,[]);assert.deepEqual(s.unlocks,[]);
 assert.deepEqual(s.historicalClaims,[]);assert.equal(NODES.includes(CLOSED_NODE),false);
 assert.equal(EDGES.length,5);assert.equal(Object.keys(TRACES).length,2);
 assert.equal(Object.keys(NEEDS).length,2);
});
test('declared paths are reversible and teleporting is refused',()=>{
 let s=walk(fresh(),'stone_edge');assert.equal(s.position,'stone_edge');
 assert.equal(walk(s,'entry').position,'entry');
 for(const to of ['meeting_edge','unknown',null,{},'stone_edge'])
   assert.deepEqual(walk(s,to),s);
});
test('closed hill cannot be entered or marked as safe',()=>{
 let s=walk(fresh(),CLOSED_NODE);
 assert.equal(s.position,'entry');assert.equal(s.blockedAttempts,1);
 assert.match(s.feedback,/closed/);assert.deepEqual(s.unlocks,[]);
});
test('malformed commands and extra keys do not change state',()=>{
 const s=fresh();
 for(const a of [null,{},'walk',{type:'open-hill'},
   {type:'walk',to:'stone_edge',approved:true},
   {type:'check-source',sourceId:'fake'},
   {type:'suggest',traceId:'__proto__',useTag:'passing'}])
   assert.deepEqual(dispatch(s,a),s);
});
test('trace inspection is local and stores only undated seen form',()=>{
 let s=fresh();assert.deepEqual(inspect(s,'surface'),s);
 s=walk(s,'stone_edge');s=inspect(s,'surface');
 assert.equal(s.observations[0].kind,'SEEN');
 assert.match(s.observations[0].text,/unknown/);
 assert.deepEqual(inspect(s,'surface'),s);
 assert.deepEqual(inspect(s,'holes'),s);
});
test('symbol comparison does not prove a name',()=>{
 let s=act(fresh(),'compare-symbol');
 assert.equal(s.symbolCompared,true);assert.equal(s.nameRevealed,false);
 assert.equal(previewProjection(s).testName,null);
 assert.deepEqual(act(s,'compare-symbol'),s);
});
test('hypotheses require inspected evidence and bounded vocabulary',()=>{
 let s=fresh();assert.deepEqual(suggest(s,'surface','passing'),s);
 s=walk(s,'stone_edge');s=inspect(s,'surface');
 assert.deepEqual(suggest(s,'surface','official historical station'),s);
 s=suggest(s,'surface','passing');assert.deepEqual(s.hypotheses.surface,['passing']);
 assert.equal(previewProjection(s).cards.maybe[0].qualifier,'MAYBE');
 assert.deepEqual(suggest(s,'surface','passing'),s);
});
test('multiple plausible uses may coexist without right-answer scoring',()=>{
 let s=walk(fresh(),'stone_edge');s=inspect(s,'surface');
 s=suggest(s,'surface','passing');s=suggest(s,'surface','meeting');
 assert.deepEqual(s.hypotheses.surface,['passing','meeting']);
});
test('revise and remove hypotheses without changing observations',()=>{
 let s=explored();const observations=structuredClone(s.observations);
 s=act(s,'revise',{traceId:'surface',oldTag:'passing',newTag:'resting'});
 assert.deepEqual(s.hypotheses.surface,['resting']);
 s=act(s,'remove',{traceId:'surface',useTag:'resting'});
 assert.deepEqual(s.hypotheses.surface,[]);
 s=suggest(s,'surface','meeting');assert.deepEqual(s.hypotheses.surface,['meeting']);
 assert.deepEqual(s.observations,observations);
});
test('invalid hypothesis revision and invented dates are rejected',()=>{
 const s=explored();
 for(const a of [
  {type:'revise',traceId:'surface',oldTag:'not_real',newTag:'resting'},
  {type:'revise',traceId:'surface',oldTag:'passing',newTag:'1901'},
  {type:'remove',traceId:'surface',useTag:'1901'}])
  assert.deepEqual(dispatch(s,a),s);
});
test('needs require listening at exact location',()=>{
 let s=fresh();assert.deepEqual(hear(s,'quiet'),s);
 s=walk(s,'stone_edge');s=walk(s,'quiet_corner');s=hear(s,'quiet');
 assert.deepEqual(s.heard,['quiet']);assert.deepEqual(hear(s,'quiet'),s);
 assert.match(previewProjection(s).cards.needs[0].kind,/PRESENT/);
});
test('paper need cards are revisable and retain both voices',()=>{
 let s=explored();assert.deepEqual(place(s,'fake','left'),s);
 assert.deepEqual(place(s,'quiet','bad'),s);
 s=place(s,'quiet','shared');
 assert.deepEqual(s.board,{quiet:'shared',activity:'right'});
 assert.deepEqual(s.heard,['quiet','activity']);
});
test('source absent returns unknown; review may occur but finish stays blocked',()=>{
 let s=reviewed(false);assert.equal(s.sourceChecked,true);
 assert.equal(s.nameRevealed,false);assert.equal(s.reviewed,true);
 assert.match(previewProjection(s).sourceStatus,/UNKNOWN/);
 assert.deepEqual(act(s,'finish-preview'),s);
});
test('fixture name cannot appear without symbol, two traces and explicit opt-in',()=>{
 let s=act(fresh(),'enable-fixture');assert.deepEqual(act(s,'check-source'),s);
 s=explored();s=act(s,'check-source');
 assert.equal(s.nameRevealed,false);
 s=act(explored(),'enable-fixture');s=act(s,'check-source');
 assert.equal(s.nameRevealed,true);
 assert.match(s.feedback,/SYNTHETIC TEST TOKEN/);
 assert.equal(previewProjection(s).testName,'Common');
});
test('tradeoff needs both heard and placed and two trace hypotheses',()=>{
 let s=act(fresh(),'review-tradeoff');assert.equal(s.tradeoffReviewed,false);
 s=explored();s=act(s,'review-tradeoff');
 assert.equal(s.tradeoffReviewed,true);assert.equal(s.heard.length,2);
 assert.match(s.feedback,/No permanent layout/);
});
test('review separates SEEN MAYBE NEEDS UNKNOWN',()=>{
 let s=explored();assert.deepEqual(act(s,'review'),s);
 s=act(s,'enable-fixture');s=act(s,'check-source');
 assert.deepEqual(act(s,'review'),s);
 s=act(s,'review-tradeoff');s=act(s,'review');
 assert.equal(s.reviewed,true);
 const p=previewProjection(s);
 assert.equal(p.cards.seen.length,2);assert.equal(p.cards.maybe.length,2);
 assert.equal(p.cards.needs.length,2);assert.equal(p.cards.unknown.length,3);
});
test('moving a paper card invalidates tradeoff and review',()=>{
 let s=reviewed();assert.equal(s.reviewed,true);
 s=place(s,'activity','shared');assert.equal(s.tradeoffReviewed,false);
 assert.equal(s.reviewed,false);assert.deepEqual(act(s,'finish-preview'),s);
 s=act(s,'review-tradeoff');s=act(s,'review');assert.equal(s.reviewed,true);
});
test('synthetic completion never unlocks E11 or writes Chronicle',()=>{
 const s=act(reviewed(),'finish-preview');
 assert.equal(s.finished,true);assert.deepEqual(s.unlocks,[]);
 assert.deepEqual(s.canonicalEvents,[]);assert.deepEqual(s.historicalClaims,[]);
 assert.deepEqual(walk(s,'entry'),s);
});
test('strict replay reconstructs history; reset is local',()=>{
 const s=act(reviewed(),'finish-preview');
 assert.deepEqual(replay(s.history),s);assert.deepEqual(restore(structuredClone(s)),s);
 assert.deepEqual(act(s,'reset'),fresh());
 assert.equal(replay([{type:'reset'}]),null);
 assert.equal(replay([{type:'walk',to:'meeting_edge'}]),null);
});
test('forged source, unlock, chronology, mode and history fail closed',()=>{
 const s=act(reviewed(),'finish-preview');
 for(const edit of [
  x=>{x.nameRevealed=false;},x=>{x.mode='canonical';},
  x=>{x.position='closed_hill';},x=>{x.unlockedE11=true;},
  x=>{x.unlocks.push('s01e11');},x=>{x.canonicalEvents.push('s01e10.complete');},
  x=>{x.historicalClaims.push('1901');},x=>{x.observations[0].text='proven history';},
  x=>{x.board.quiet='deleted';},x=>{x.history[0].type='unlock';},
  x=>{x.history[0].source='archive';}]){
  const bad=structuredClone(s);edit(bad);
  assert.equal(restore(bad),null);assert.equal(previewProjection(bad),null);
  assert.deepEqual(dispatch(bad,{type:'finish-preview'}),fresh());
 }
});
test('bounded action history rejects progress injection',()=>{
 let s=fresh();
 while(s.history.length<MAX_ACTIONS)s=walk(s,s.position==='entry'?'stone_edge':'entry');
 assert.equal(s.history.length,MAX_ACTIONS);
 assert.deepEqual(act(s,'compare-symbol'),s);
 assert.equal(replay([...s.history,{type:'compare-symbol'}]),null);
 assert.deepEqual(act(s,'reset'),fresh());
});
