import test from 'node:test';
import assert from 'node:assert/strict';
import {canonicalCheckpoints} from './fixtures/season1-e03-canonical.mjs';
import {E02_KEY,E03_KEY,E04_KEY} from '../engine/s01e04-handoff.mjs';
import {e05ProductionHandoff,readE05ProductionGate}
  from '../engine/s01e05-production-entry.mjs';

test('E05 entry verifies current E02/E03 checkpoints read-only and never treats a draft as an unlock',()=>{
  const {e02,e03}=canonicalCheckpoints();
  const forged={ready:true,mode:'canonical',phase:'completed',unlocks:['s01e05']};
  const data=new Map([
    [E02_KEY,JSON.stringify(e02)],[E03_KEY,JSON.stringify(e03)],
    [E04_KEY,JSON.stringify(forged)]
  ]);
  const storage={
    getItem:key=>data.get(key)??null,
    setItem(){throw Error('entry must not write');},
    removeItem(){throw Error('entry must not delete');}
  };
  const before=JSON.stringify([...data]);
  const gate=readE05ProductionGate(storage);
  assert.deepEqual(gate,e05ProductionHandoff(e02,e03,forged));
  assert.equal(gate.ready,false);
  assert.equal(gate.reason,'e04-canonical-checkpoint-unavailable');
  assert.equal(gate.e03CanonicalComplete,true);
  assert.deepEqual(gate.canonicalEvents,[]);
  assert.deepEqual(gate.unlocks,[]);
  assert.equal(JSON.stringify([...data]),before);
  data.delete(E02_KEY);
  assert.equal(readE05ProductionGate(storage).reason,'complete-riverside-first');
  data.set(E02_KEY,JSON.stringify(e02));
  data.delete(E03_KEY);
  assert.equal(readE05ProductionGate(storage).reason,'complete-market-lane-first');
  data.set(E03_KEY,JSON.stringify(e03));
  data.delete(E04_KEY);
  assert.equal(readE05ProductionGate(storage).reason,'e04-canonical-checkpoint-unavailable');
});

test('E05 entry fails closed on unreadable, corrupted, inaccessible and forged saved progress',()=>{
  const {e02,e03}=canonicalCheckpoints();
  const data=new Map([[E02_KEY,JSON.stringify(e02)],[E03_KEY,JSON.stringify(e03)]]);
  const storage={getItem:key=>data.get(key)??null};
  for(const key of [E02_KEY,E03_KEY,E04_KEY]){
    data.set(key,'{invalid-json');
    const gate=readE05ProductionGate(storage);
    assert.deepEqual(gate,{
      ready:false,reason:'checkpoint-unreadable',
      e03CanonicalComplete:false,e04CanonicalComplete:false,
      canonicalEvents:[],unlocks:[]
    });
    if(key===E04_KEY)data.delete(key);
    else data.set(key,JSON.stringify(key===E02_KEY?e02:e03));
  }
  data.set(E03_KEY,JSON.stringify({...e03,mode:'historical_replay'}));
  assert.equal(readE05ProductionGate(storage).reason,'complete-market-lane-first');
  for(const unavailable of [
    null,undefined,{}, {get getItem(){throw Error('denied');}},
    {getItem(){throw Error('denied');}}
  ]){
    const gate=readE05ProductionGate(unavailable);
    assert.equal(gate.ready,false);
    assert.deepEqual(gate.unlocks,[]);
    assert.ok(['storage-unavailable','checkpoint-unreadable'].includes(gate.reason));
  }
});
