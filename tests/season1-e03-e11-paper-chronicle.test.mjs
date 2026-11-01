// E03 verified sources never turn the eight later PAPER episodes into canon.
import test from 'node:test';
import assert from 'node:assert/strict';
import {paperChronicle} from '../authoring-labs/e03-e11-paper-chronicle.mjs';
import {canonicalCheckpoints} from './fixtures/season1-e03-canonical.mjs';
import {paperLoopFixture} from './fixtures/season1-e03-e11-paper.mjs';
test('genuine E02/E03 and replayed E04-E11 yield only child-earned PAPER Chronicle',()=>{
 const {e02,e03}=canonicalCheckpoints(),fragment=paperLoopFixture();
 const result=paperChronicle(e02,e03,fragment);
 assert.equal(result.status,'e03-verified-paper-chain');
 assert.equal(result.e03Ready,true);
 assert.equal(Object.keys(result.sourceIds).sort().join(','),'garden,marker,station');
 assert.deepEqual(result.entries.map(x=>x.scene),
  ['E04','E05','E06 Current','E06 Lower','E07','E08','E09','E10','E11']);
 assert.match(result.entries[0].text,/UNKNOWN/);
 assert.match(result.entries[1].text,/MOCK/);
 assert.match(result.entries[3].text,/No planting permission/);
 assert.match(result.entries[6].text,/CLOSED/);
 assert.match(result.entries[8].text,/placed: 0/);
 for(const field of ['canonicalEvents','unlocks','historicalClaims','rights'])
  assert.deepEqual(result[field],[]);
 assert.equal(result.officialChronicle,false);
 assert.equal(result.seasonComplete,false);
 const before=JSON.stringify([e02,e03,fragment]);
 paperChronicle(e02,e03,fragment);
 assert.equal(JSON.stringify([e02,e03,fragment]),before,'projection is read-only');
});
test('E02/E03 reset or forgery cannot be reported as verified sources',()=>{
 const {e02,e03}=canonicalCheckpoints(),fragment=paperLoopFixture();
 for(const [a,b] of [[null,e03],[e02,null],[e02,{...e03,ledger:[]}],
   [{...e02,version:'forged'},e03]]){
  const v=paperChronicle(a,b,fragment);
  assert.equal(v.e03Ready,false);
  assert.equal(v.sourceIds,null);
  assert.equal(v.status,'paper-only-e03-unverified');
  assert.equal(v.entries.length,9,'valid PAPER actions remain separate from canonical reset');
 }
});
test('tampered E04/E05/E11 or partial URL cannot mint Chronicle or rights',()=>{
 const {e02,e03}=canonicalCheckpoints(),fragment=paperLoopFixture();
 const raw=JSON.parse(decodeURIComponent(fragment.slice('#paper-loop='.length)));
 for(const packet of [{...raw,e04:[]},{...raw,e05:[]},
   {...raw,e11:[{type:'grant-unlock'}]},{...raw,sourceYear:1920}]){
  const bad='#paper-loop='+encodeURIComponent(JSON.stringify(packet));
  const v=paperChronicle(e02,e03,bad);
  assert.equal(v.status,'no-valid-paper-chain');
  assert.deepEqual(v.entries,[]);
  assert.deepEqual(v.canonicalEvents,[]);
 }
 assert.equal(paperChronicle(e02,e03,'#bad').status,'no-valid-paper-chain');
});
