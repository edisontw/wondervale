import test from 'node:test';
import assert from 'node:assert/strict';
import {replayEvidence} from '../e11-scene/paper-evidence-revision.mjs';
const inspect={type:'inspect'}, choose=option=>({type:'choose',option}), trial={type:'try'};
test('child inspects, tries one clue, revises to both and undoes',()=>{
 const history=[inspect,choose('old-map'),trial,choose('both'),trial];
 const s=replayEvidence(history);
 assert.equal(s.model,'two-trace-model');
 assert.equal(s.chronicle.length,2);
 assert.match(s.nia,/both clues/);
 assert.equal(replayEvidence(history.slice(0,-1)).model,'old-only-model');
 assert.equal(replayEvidence([]).model,'unmarked');
 assert.equal(s.canonicalEvents.length,0);
 assert.equal(s.commonRevealed,false);
});
test('fail closed on forgery, out-of-order and malformed histories',()=>{
 for(const h of [[trial],[choose('both')],[inspect,inspect],[inspect,{type:'choose',option:'real-rights'}],
 [inspect,choose('both'),{type:'try',rights:['approved']}],
 [inspect,choose('both'),trial,{type:'unlock'}],null,{},Array(31).fill(inspect)]) assert.equal(replayEvidence(h),null);
});
