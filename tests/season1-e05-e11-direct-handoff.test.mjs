import test from 'node:test';
import assert from 'node:assert/strict';
import {earnedHistory} from './season1-e11-e05-earned-layout.test.mjs';
import {encodeE05Handoff,decodeE05Handoff} from '../e11-scene/e05-direct-handoff.mjs';
import {paperWorldAtlasSources} from '../e11-scene/world-atlas.mjs';
test('E05 child-earned history transfers only after actual PAPER Map Room review',()=>{
 const source=earnedHistory(),hash=encodeE05Handoff(source);
 assert.match(hash,/^#e05-paper=/);
 assert.deepEqual(decodeE05Handoff(hash),source);
 assert.equal(encodeE05Handoff(source.slice(0,-1)),'');
 assert.equal(decodeE05Handoff('#e05-paper=invalid'),null);
 assert.equal(decodeE05Handoff('#e05-paper='+btoa(JSON.stringify([...source,{scene:'nav',type:'unlock'}]))),null);
 assert.equal(decodeE05Handoff('#e05-paper='+btoa(JSON.stringify([...source,{scene:'nav',type:'to-review',rights:['open']}]))),null);
 assert.equal(decodeE05Handoff('#e05-paper='+('a'.repeat(48001))),null);
});

test('direct E05 replay yields verified partial PAPER source but no E11 completion',()=>{
 const history=earnedHistory(),status=h=>
  paperWorldAtlasSources(null,[],null,[],null,null,h,null);
 const valid=status(history);
 assert.deepEqual(valid.sources.map(s=>s.status),['verified','missing','missing','missing']);
 assert.equal(valid.atlas,null);assert.deepEqual(valid.unlocks,[]);
 assert.equal(status(history.slice(0,-1)).sources[0].status,'missing');
 assert.equal(status([...history,{scene:'nav',type:'grant-rights'}]).sources[0].status,'missing');
});
