import test from 'node:test';
import assert from 'node:assert/strict';
import {earnedHistory} from './season1-e11-e05-earned-layout.test.mjs';
import {replayEarnedEvidence} from '../e11-scene/e05-earned-evidence-revision.mjs';

const inspect = {type:'inspect'};
const choose = option => ({type:'choose',option});
const trial = {type:'try'};

test('earned E05 replay enables reversible E11 PAPER evidence revision only', () => {
  const source=earnedHistory();
  const events=[inspect,choose('old-map'),trial,choose('both'),trial];
  const s=replayEarnedEvidence(source,events);
  assert.equal(s.source,'E05_REPLAY_VALIDATED_PAPER');
  assert.equal(s.model,'two-trace-model');
  assert.equal(s.chronicle.length,2);
  assert.equal(replayEarnedEvidence(source,events.slice(0,-1)).model,'old-only-model');
  assert.equal(replayEarnedEvidence(source,[]).model,'unmarked');
  assert.deepEqual(s.canonicalEvents,[]);
  assert.deepEqual(s.rights,[]);
  assert.deepEqual(s.unlocks,[]);
  assert.equal(s.northHillClosed,true);
  assert.equal(s.commonRevealed,false);
});
test('source reset, incomplete E05, forged events and skipped E11 inspection fail closed', () => {
  const source=earnedHistory();
  for (const invalid of [[],source.slice(0,-1),[...source,{scene:'nav',type:'to-review',admin:true}],[...source,{scene:'nav',type:'restart'}]])
    assert.equal(replayEarnedEvidence(invalid,[inspect]),null);
  for (const invalid of [[trial],[choose('both')],[inspect,{type:'unlock'}],[inspect,{type:'choose',option:'both',rights:['open']}],Array(31).fill(inspect)])
    assert.equal(replayEarnedEvidence(source,invalid),null);
});
