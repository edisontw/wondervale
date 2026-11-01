import test from 'node:test';
import assert from 'node:assert/strict';
import {canonicalCheckpoints} from './fixtures/season1-e03-canonical.mjs';
import {paperSourceGate,readPaperSourceGate,PAPER_WORKTABLE}
  from '../authoring-labs/e03-e04-paper-source-entry.mjs';
import {E02_KEY,E03_KEY,E04_SOURCE_EVENTS}
  from '../engine/s01e04-handoff.mjs';

const {e02,e03}=canonicalCheckpoints();
const saved=new Map([[E02_KEY,JSON.stringify(e02)],[E03_KEY,JSON.stringify(e03)]]);
const storage=map=>({getItem:key=>map.get(key)??null});

test('read-only E03 source entry accepts only real replayed E02/E03 and shows both attributed undated memories',()=>{
 const before=JSON.stringify([...saved]);
 const result=readPaperSourceGate(storage(saved));
 assert.equal(result.ready,true);
 assert.equal(result.sourceEligible,true);
 assert.equal(result.reason,null);
 assert.equal(result.sources.length,2);
 assert.deepEqual(result.sources.map(s=>s.eventId),[
   E04_SOURCE_EVENTS.station,E04_SOURCE_EVENTS.garden
 ]);
 assert.deepEqual(result.sources.map(s=>s.sourceId),[
   'S01E03-COORDINATOR-009','S01E03-RESIDENT-001'
 ]);
 assert.deepEqual(result.sources.map(s=>s.date),['UNKNOWN','UNKNOWN']);
 assert.deepEqual(result.sources.map(s=>s.words),[
   'I remember a way to the station.','I remember a way to the garden.'
 ]);
 for(const key of ['canonicalEvents','unlocks','historicalClaims','rights'])
   assert.deepEqual(result[key],[]);
 assert.equal(result.canonicalE04Unlocked,false);
 assert.equal(result.officialChronicle,false);
 assert.equal(PAPER_WORKTABLE,'./arc1-memory-station-handoff.html');
 assert.equal(JSON.stringify([...saved]),before,'source inspection never writes progress');
});

test('missing, reset, replay, forged or unreadable upstream saves fail closed',()=>{
 const candidates=[
   new Map(),
   new Map([[E03_KEY,JSON.stringify(e03)]]),
   new Map([[E02_KEY,JSON.stringify(e02)]]),
   new Map([[E02_KEY,JSON.stringify({...e02,version:'fake'})],[E03_KEY,JSON.stringify(e03)]]),
   new Map([[E02_KEY,JSON.stringify(e02)],[E03_KEY,JSON.stringify({...e03,ledger:[]})]]),
   new Map([[E02_KEY,JSON.stringify(e02)],[E03_KEY,JSON.stringify({...e03,mode:'historical_replay'})]]),
   new Map([[E02_KEY,JSON.stringify(e02)],[E03_KEY,'{broken-json']])
 ];
 for(const map of candidates){
   const before=JSON.stringify([...map]);
   const result=readPaperSourceGate(storage(map));
   assert.equal(result.ready,false);
   assert.equal(result.sourceEligible,false);
   assert.deepEqual(result.sources,[]);
   assert.deepEqual(result.unlocks,[]);
   assert.equal(result.canonicalE04Unlocked,false);
   assert.equal(JSON.stringify([...map]),before);
 }
 const denied=readPaperSourceGate({getItem(){throw Error('denied');}});
 assert.equal(denied.ready,false);
 assert.equal(denied.reason,'checkpoint-unreadable');
 assert.equal(readPaperSourceGate(null).reason,'storage-unavailable');
});

test('caller-supplied ready flags cannot replace canonical event replay',()=>{
 const forged=paperSourceGate({ready:true,phase:'completed',ledger:['e02.finish']},
   {ready:true,phase:'completed',ledger:['e03.finish']});
 assert.equal(forged.ready,false);
 assert.deepEqual(forged.sources,[]);
 assert.equal(forged.officialChronicle,false);
});
