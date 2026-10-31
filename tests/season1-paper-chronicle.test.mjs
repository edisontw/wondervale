import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch,project} from '../authoring-labs/world-revisit.mjs';
import {paperChronicle,PAPER_REFLECTIONS} from '../authoring-labs/paper-chronicle.mjs';

const run=(s,type,value)=>dispatch(s,value===undefined?{type}:{type,value});
test('PAPER Chronicle cards require child-tested world changes, with provenance and unknowns',()=>{
  let s=fresh();
  assert.deepEqual(paperChronicle(s),[]);
  s=run(s,'try-fit'); // Safe wrong-first trial earns no record.
  assert.deepEqual(paperChronicle(s),[]);
  s=run(s,'rotate','side-a');s=run(s,'shift-table','near-wall');s=run(s,'try-fit');
  let cards=paperChronicle(s);
  assert.equal(cards.length,1);
  assert.equal(cards[0].place,'station');
  assert.equal(cards[0].proofAction,'try-fit');
  assert.ok(cards[0].proofStep>0);
  assert.match(cards[0].tested,/walkway/);
  assert.match(cards[0].unknown,/unverified/);
  assert.match(cards[0].kind,/NOT CHRONICLE/);
  s=run(s,'visit','current');
  s=run(s,'run-tray'); // Wrong-first is not a new Chronicle card.
  assert.equal(paperChronicle(s).length,1);
  s=run(s,'rain','rain');s=run(s,'channel','open');s=run(s,'run-tray');
  cards=paperChronicle(s);
  assert.deepEqual(cards.map(x=>x.place),['station','current']);
  assert.ok(cards.every(x=>x.canonical===false&&x.unlock===false&&x.rights===false&&x.seasonFinished===false));
  assert.ok(cards.every(x=>x.canRevisit&&x.proofStep<=s.history.length));
  assert.deepEqual(project(s).canonicalEvents,[]);
  assert.deepEqual(project(s).unlocks,[]);
  assert.doesNotMatch(JSON.stringify(cards),/Common|1792|episode_completed/);
});
test('BEFORE/NOW and visits preserve PAPER evidence; upstream revision retracts downstream cards',()=>{
  let s=fresh();
  for(const [type,value] of [['rotate','side-a'],['shift-table','near-wall'],['try-fit'],['visit','current'],['rain','rain'],['channel','open'],['run-tray']])
    s=run(s,type,value);
  const before=paperChronicle(s);
  s=run(s,'look','before');
  assert.deepEqual(paperChronicle(s).map(x=>x.place),before.map(x=>x.place));
  s=run(s,'visit','station');
  assert.deepEqual(paperChronicle(s).map(x=>x.place),['station','current']);
  s=run(s,'rotate','side-b');
  assert.deepEqual(paperChronicle(s),[]);
  assert.equal(project(s).progress.find(x=>x.id==='current').available,false);
  assert.equal(project(s).upperHillClosed,true);
});
test('Forged state, later paper locations and synthetic release claims cannot mint reflections',()=>{
  const s=fresh();
  assert.equal(Object.keys(PAPER_REFLECTIONS).length,8);
  assert.equal(paperChronicle({...s,canonicalEvents:['season_complete']}),null);
  assert.equal(paperChronicle({...s,models:{...s.models,layout:{...s.models.layout,done:true}}}),null);
  assert.equal(paperChronicle({...s,rights:['real entry']}),null);
  assert.equal(paperChronicle(null),null);
  assert.deepEqual(paperChronicle(s),[]);
});
