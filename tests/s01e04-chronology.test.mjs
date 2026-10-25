import test from 'node:test';
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
