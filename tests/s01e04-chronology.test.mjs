import test from 'node:test';
import {openE04Authoring,resetE04Authoring} from '../engine/s01e04-authoring-entry.mjs';
import {fresh as fresh02, dispatch as dispatch02, payload as payload02} from '../engine/s01e02.mjs';
import {fresh as fresh03, dispatch as dispatch03, payload as payload03, EVENTS as EVENTS03} from '../engine/s01e03.mjs';
import assert from 'node:assert/strict';
import {
  VERSION,DRAFT_KEY,MAX_ACTIONS,validateSourcePack,fresh,dispatch,timelineSupported,
  draftPayload,restoreDraft,chronicleProjection
} from '../engine/s01e04-chronology.mjs';

// SYNTHETIC TEST FIXTURE. Never use these cards as historical Wondervale sources.
export const testPack={
  id:'test-only-chronology',revision:'test-r1',
  cards:[
    {id:'archive-map',label:'Archive map',kind:'map'},
    {id:'annotated-map',label:'Later annotated copy',kind:'document'},
    {id:'undated-photo',label:'Undated photo',kind:'photo'}
  ],
  clues:[{id:'revision-mark',label:'Revision note',text:'The second source identifies an update after the first.'}],
  relativeOrder:{earlier:'archive-map',later:'annotated-map',basis:'revision-mark'}
};
const act=(s,a)=>dispatch(s,a,testPack);
function complete(mode='draft_preview'){
  let s=fresh(testPack,mode);
  for(const which of ['garden','station'])s=act(s,{type:'inspect-memory',which});
  for(const id of ['annotated-map','archive-map','undated-photo'])s=act(s,{type:'inspect-card',id});
  s=act(s,{type:'inspect-clue',id:'revision-mark'});
  for(const [id,slot] of [['archive-map','earlier'],['annotated-map','later'],['undated-photo','uncertain']])
    s=act(s,{type:'place',id,slot});
  s=act(s,{type:'explain',kind:'different_times',basis:'revision-mark'});
  s=act(s,{type:'chronicle'});
  return act(s,{type:'finish'});
}
test('source pack requires distinct, inspectable, bounded evidence',()=>{
  assert.deepEqual(validateSourcePack(testPack),testPack);
  for(const change of [
    p=>p.cards[1].id=p.cards[0].id,
    p=>p.relativeOrder.earlier=p.relativeOrder.later,
    p=>p.relativeOrder.basis='missing',
    p=>p.cards[0].kind='guess',
    p=>p.clues[0].text=''
  ]){const p=structuredClone(testPack);change(p);assert.throws(()=>validateSourcePack(p));}
});
test('cannot skip inspection or reasoning',()=>{
  let s=fresh(testPack);
  for(const a of [{type:'place',id:'archive-map',slot:'earlier'},
    {type:'explain',kind:'different_times',basis:'revision-mark'},{type:'finish'}])s=act(s,a);
  assert.equal(s.phase,'sources');assert.equal(s.history.length,0);
  for(const id of testPack.cards.map(c=>c.id))s=act(s,{type:'inspect-card',id});
  for(const [id,slot] of [['archive-map','later'],['annotated-map','earlier'],['undated-photo','uncertain']])
    s=act(s,{type:'place',id,slot});
  assert.equal(timelineSupported(s,testPack),false);
});
test('undated cards remain explicitly uncertain',()=>{
  let s=fresh(testPack);
  for(const id of testPack.cards.map(c=>c.id))s=act(s,{type:'inspect-card',id});
  s=act(s,{type:'place',id:'archive-map',slot:'earlier'});
  s=act(s,{type:'place',id:'annotated-map',slot:'later'});
  assert.equal(timelineSupported(s,testPack),false);
  s=act(s,{type:'place',id:'undated-photo',slot:'uncertain'});
  assert.equal(timelineSupported(s,testPack),true);
});
test('child must inspect both memories and the chronological clue',()=>{
  let s=fresh(testPack);
  for(const id of testPack.cards.map(c=>c.id))s=act(s,{type:'inspect-card',id});
  for(const [id,slot] of [['archive-map','earlier'],['annotated-map','later'],['undated-photo','uncertain']])
    s=act(s,{type:'place',id,slot});
  s=act(s,{type:'explain',kind:'different_times',basis:'revision-mark'});
  assert.equal(s.phase,'timeline');
  s=act(s,{type:'inspect-memory',which:'station'});
  s=act(s,{type:'inspect-clue',id:'revision-mark'});
  s=act(s,{type:'explain',kind:'different_times',basis:'revision-mark'});
  assert.equal(s.phase,'timeline');
  s=act(s,{type:'inspect-memory',which:'garden'});
  s=act(s,{type:'explain',kind:'different_times',basis:'revision-mark'});
  assert.equal(s.phase,'chronicle');
});
test('changing a card invalidates stale explanation before finish',()=>{
  let s=fresh(testPack);
  for(const which of ['station','garden'])s=act(s,{type:'inspect-memory',which});
  for(const id of testPack.cards.map(c=>c.id))s=act(s,{type:'inspect-card',id});
  s=act(s,{type:'inspect-clue',id:'revision-mark'});
  for(const [id,slot] of [['archive-map','earlier'],['annotated-map','later'],['undated-photo','uncertain']])
    s=act(s,{type:'place',id,slot});
  s=act(s,{type:'explain',kind:'different_times',basis:'revision-mark'});
  s=act(s,{type:'chronicle'});
  s=act(s,{type:'place',id:'archive-map',slot:'uncertain'});
  assert.equal(s.explanation,null);assert.equal(s.chronicleSeen,false);
  assert.equal(timelineSupported(s,testPack),false);
});
test('draft saves replay exactly, reject corruption and never write historical replay',()=>{
  const s=complete();
  assert.equal(s.version,VERSION);assert.equal(DRAFT_KEY,'wondervale-s01e04-authoring-preview-v1');
  assert.equal(s.phase,'completed');
  assert.deepEqual(restoreDraft(draftPayload(s),testPack),s);
  let partial=fresh(testPack);partial=act(partial,{type:'inspect-memory',which:'station'});
  assert.deepEqual(restoreDraft(draftPayload(partial),testPack),partial);
  assert.equal(draftPayload(complete('historical_replay')),null);
  for(const mutate of [
    x=>x.history.pop(),x=>x.slots['archive-map']='later',
    x=>x.history.push({type:'finish'}),x=>x.explanation={kind:'invented',basis:'revision-mark'}
  ]){const bad=structuredClone(s);mutate(bad);assert.equal(restoreDraft(bad,testPack).phase,'sources');}
  const newPack=structuredClone(testPack);newPack.revision='test-r2';
  assert.equal(restoreDraft(s,newPack).phase,'sources');
});
test('Chronicle preserves unverified witness attributions and emits no canonical event',()=>{
  const c=chronicleProjection(complete(),testPack);
  assert.deepEqual(c.relativeOrder,{earlier:'archive-map',later:'annotated-map'});
  assert.deepEqual(c.uncertain,['undated-photo']);
  assert.deepEqual(c.sourceAttribution.map(x=>x.verified),[false,false]);
  assert.deepEqual(c.canonicalEvents,[]);
  assert.equal(c.complete,true);
});


// Regression for the engineering-preview action cap; source cards remain synthetic.
test('250-action cap rejects further edits and preserves strict draft replay',()=>{
  let s=fresh(testPack);
  s=act(s,{type:'inspect-card',id:'archive-map'});
  for(let i=1;i<MAX_ACTIONS;i++)
    s=act(s,{type:'place',id:'archive-map',slot:i%2 ? 'earlier' : 'later'});
  assert.equal(s.history.length,MAX_ACTIONS);
  const atCap=structuredClone(s);
  s=act(s,{type:'place',id:'archive-map',slot:'uncertain'});
  assert.deepEqual(s,atCap,'A 251st change must not mutate the capped draft');
  assert.deepEqual(restoreDraft(draftPayload(s),testPack),atCap,
    'The last valid draft must survive reload at the cap');
  const overCap=structuredClone(atCap);
  overCap.history.push({type:'place',id:'archive-map',slot:'uncertain'});
  assert.equal(restoreDraft(overCap,testPack).phase,'sources',
    'An over-cap checkpoint must be rejected rather than partially replayed');
});

// The pack fingerprint is content-based, not just the declared revision.
test('source content changes invalidate stale drafts even with unchanged revision',()=>{
  const saved=complete();
  for(const change of [
    p=>{p.cards[0].label='Archive map (revised caption)';},
    p=>{p.clues[0].text='Updated source transcription';},
    p=>{p.relativeOrder.earlier='annotated-map';p.relativeOrder.later='archive-map';},
    p=>{p.cards.reverse();}
  ]) {
    const changed=structuredClone(testPack);
    change(changed);
    assert.equal(changed.revision,testPack.revision,'The revision deliberately stays the same');
    const clean=fresh(changed);
    assert.notEqual(clean.packFingerprint,saved.packFingerprint);
    assert.deepEqual(restoreDraft(draftPayload(saved),changed),clean,
      'Changed source content must not inherit prior timeline decisions');
  }
  assert.deepEqual(restoreDraft(draftPayload(saved),testPack),saved,
    'The unchanged source pack must still resume normally');
});

// E03→E04 canonical handoff integration, isolated to E04's non-deploy test scope.
const drain02 = s => {while(s.queue.length) s=dispatch02(s,{type:'next'}); return s;};
const drain03 = s => {while(s.queue.length) s=dispatch03(s,{type:'next'}); return s;};
const move03 = s => {while(s.travel.length) s=dispatch03(s,{type:'step',to:s.travel[0]}); return s;};

function realE02() {
  let s=fresh02();
  const a=x=>{s=drain02(dispatch02(s,x));};
  a({type:'begin'});
  a({type:'go',to:'oldStones'}); a({type:'inspect',what:'stones'}); a({type:'close-detail'});
  a({type:'go',to:'lookoutView'}); a({type:'inspect',what:'gap'}); a({type:'close-detail'});
  a({type:'notebook'}); a({type:'fact',choice:'gap'}); a({type:'revision',choice:'A'});
  a({type:'market'}); a({type:'chronicle'}); a({type:'finish'});
  assert.equal(s.phase,'completed','fixture must be a genuine completed E02');
  return s;
}
function realE03(order=['station','garden'], finish=true) {
  let s=drain03(dispatch03(fresh03(),{type:'begin',ready:true}));
  const deliver=state=>drain03(dispatch03(move03(dispatch03(state,{type:'take-route',route:'L'})),{type:'deliver'}));
  s=deliver(s);
  s=drain03(move03(dispatch03(s,{type:'return'})));
  s=deliver(s);
  s=dispatch03(s,{type:'inspect',what:'S'});
  s=drain03(dispatch03(s,{type:'compare',reason:'steps'}));
  s=drain03(move03(dispatch03(s,{type:'return'})));
  s=deliver(s);
  s=drain03(move03(dispatch03(s,{type:'return'})));
  for(const kind of ['WALK','CART'])s=drain03(dispatch03(s,{type:'sign',kind,to:'L'}));
  s=move03(dispatch03(s,{type:'go-glyph'}));
  s=drain03(dispatch03(s,{type:'glyph'}));
  for(const which of order)s=drain03(dispatch03(s,{type:'memory',which}));
  s=drain03(dispatch03(s,{type:'chronicle'}));
  if(finish)s=dispatch03(s,{type:'finish'});
  return s;
}


test('E03 witness-order variants keep E04 draft Chronicle attributed, reset-isolated and noncanonical',()=>{
  // SYNTHETIC E04 cards are QA fixtures, never approved historical evidence.
  const pack={
    id:'cross-episode-test-only',revision:'test-r1',
    cards:[
      {id:'old-map',label:'Old map',kind:'map'},
      {id:'new-map',label:'New map',kind:'map'},
      {id:'undated-photo',label:'Undated photo',kind:'photo'}
    ],
    clues:[{id:'revision-note',label:'Revision note',
      text:'This test-only record refers to a later map update.'}],
    relativeOrder:{earlier:'old-map',later:'new-map',basis:'revision-note'}
  };
  const e02=payload02(realE02()),before02=JSON.stringify(e02);
  for(const order of [['station','garden'],['garden','station']]) {
    const e03=payload03(realE03(order)),before03=JSON.stringify(e03);
    const gate=openE04Authoring(e02,e03,pack);
    assert.equal(gate.ready,true);
    assert.equal(gate.sources.station,EVENTS03.station);
    assert.equal(gate.sources.garden,EVENTS03.garden);
    assert.ok(e03.ledger.includes(gate.sources.station));
    assert.ok(e03.ledger.includes(gate.sources.garden));
    let draft=gate.session;
    for(const which of order)
      draft=dispatch(draft,{type:'inspect-memory',which},pack);
    for(const card of pack.cards)
      draft=dispatch(draft,{type:'inspect-card',id:card.id},pack);
    draft=dispatch(draft,{type:'inspect-clue',id:'revision-note'},pack);
    for(const [id,slot] of [
      ['old-map','earlier'],['new-map','later'],['undated-photo','uncertain']
    ])draft=dispatch(draft,{type:'place',id,slot},pack);
    draft=dispatch(draft,{type:'explain',
      kind:'different_times',basis:'revision-note'},pack);
    draft=dispatch(draft,{type:'chronicle'},pack);
    draft=dispatch(draft,{type:'finish'},pack);
    assert.equal(draft.phase,'completed');
    const projection=chronicleProjection(draft,pack);
    assert.deepEqual(projection.sourceAttribution,[
      {source:'Market coordinator',memory:'station',verified:false},
      {source:'Garden resident',memory:'garden',verified:false}
    ]);
    assert.deepEqual(projection.uncertain,['undated-photo']);
    assert.deepEqual(projection.relativeOrder,{earlier:'old-map',later:'new-map'});
    assert.deepEqual(projection.canonicalEvents,[],
      'Synthetic chronology cannot create canonical episode events');
    const saved=draftPayload(draft);
    assert.deepEqual(openE04Authoring(e02,e03,pack,saved).session,draft,
      'Returning draft replays exactly, regardless of witness order');
    assert.equal(openE04Authoring(e02,null,pack,saved).ready,false,
      'Resetting E03 must revoke entry even with a complete E04 draft');
    assert.equal(openE04Authoring(null,e03,pack,saved).ready,false,
      'Resetting E02 must revoke entry even with a complete E04 draft');
    const reset=resetE04Authoring(e02,e03,pack);
    assert.equal(reset.session.history.length,0);
    assert.equal(reset.session.phase,'sources');
    assert.equal(JSON.stringify(e03),before03,
      'E04 draft, restore and reset must not rewrite E03 witness ledger');
    assert.equal(JSON.stringify(e02),before02,
      'E04 draft, restore and reset must not rewrite E02');
  }
});


test('E04 handoff rejects unfinished or forged Market saves and preserves an interrupted draft',()=>{
  // Real E02/E03 canonical replay, but only synthetic E04 source cards.
  const e02=payload02(realE02());
  const complete03=payload03(realE03());
  const unfinished03=payload03(realE03(['garden','station'],false));
  assert.equal(unfinished03.phase,'chronicle');
  assert.equal(unfinished03.chronicleSeen,true);
  for(const id of [EVENTS03.station,EVENTS03.garden,EVENTS03.glyph])
    assert.ok(unfinished03.ledger.includes(id),'The memories and marker exist before finish');
  assert.ok(!unfinished03.ledger.includes(EVENTS03.finish),
    'The canonical episode-completed event must not exist before finish');

  const interrupted=dispatch(fresh(testPack),{type:'inspect-memory',which:'station'},testPack);
  const saved=draftPayload(interrupted),savedBytes=JSON.stringify(saved);
  const forgedFinish=structuredClone(unfinished03);
  forgedFinish.phase='completed';
  forgedFinish.achieved.push(EVENTS03.finish);
  forgedFinish.ledger.push(EVENTS03.finish);
  const alteredLedger=structuredClone(complete03);
  alteredLedger.ledger=alteredLedger.ledger.filter(id=>id!==EVENTS03.garden);
  const replayOnly=structuredClone(complete03);
  replayOnly.mode='historical_replay';
  const invalidHistory=structuredClone(complete03);
  invalidHistory.history.push({type:'invented-finish'});

  for(const [label,checkpoint] of [
    ['not finished',unfinished03],['forged finish',forgedFinish],
    ['missing witness ledger',alteredLedger],['replay-only',replayOnly],
    ['invalid history',invalidHistory]
  ]) {
    const denied=openE04Authoring(e02,checkpoint,testPack,saved);
    assert.equal(denied.ready,false,label+' must not unlock E04');
    assert.equal(denied.session,null,label+' must not consume or mutate the draft');
    assert.equal(JSON.stringify(saved),savedBytes,label+' must preserve saved E04 bytes');
  }
  const restored=openE04Authoring(e02,complete03,testPack,saved);
  assert.equal(restored.ready,true,'A genuine completed replay may resume');
  assert.deepEqual(restored.session,interrupted,'The interrupted draft resumes unchanged');
  assert.equal(JSON.stringify(e02),JSON.stringify(payload02(realE02())),
    'E04 gate must not modify Riverside');
  assert.deepEqual(complete03,payload03(realE03()),
    'E04 gate must not modify Market Lane');
});
