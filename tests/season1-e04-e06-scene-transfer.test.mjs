import test from 'node:test';
import assert from 'node:assert/strict';
import * as E04 from '../authoring-labs/arc1-memory-station-handoff-model.mjs';
import * as E05 from '../e05-scene/scene-model.mjs';
import * as E06 from '../e06-scene/scene-model.mjs';
import {encodeMemoryStationGardenTransfer as encode,decodeMemoryStationGardenTransfer as decode}
 from '../authoring-labs/e04-e06-scene-transfer.mjs';
import {e05ProductionHandoff} from '../engine/s01e05-production-entry.mjs';
const a=(scene,type,extra={})=>({scene,action:{type,...extra}});
const nav=type=>({scene:'nav',type});
function step(model,s,action){
 assert.equal(model.can(s,action),true,JSON.stringify(action));
 return model.dispatch(s,action);
}
function memories(){
 let s=E04.fresh();
 for(const action of [
  a('e04','inspect',{which:'station'}),a('e04','inspect',{which:'garden'}),
  a('e04','place',{which:'station',slot:'earlier'}),
  a('e04','place',{which:'garden',slot:'later'}),
  a('e04','place',{which:'station',slot:'unknown'}),
  a('e04','place',{which:'garden',slot:'unknown'}),
  a('e04','compare'),a('e04','finish-paper')
 ])s=step(E04,s,action);
 return s;
}
function station(){
 let s=E05.fresh();
 for(const action of [
  a('station','start'),a('station','walk',{value:'board'}),
  a('station','inspect',{value:'peg-pair'}),a('station','inspect',{value:'worn-edge'}),
  a('station','guess',{value:'unsure'}),a('station','try-copy',{value:'side-b'}),
  a('station','check'),a('station','try-copy',{value:'side-a'}),a('station','check'),
  a('station','qualify'),nav('to-records'),a('sources','start'),
  ...['a','b'].flatMap(card=>[
   a('sources','walk',{value:'desk-'+card}),a('sources','inspect',{card}),
   a('sources','source-check',{card})]),
  a('sources','walk',{value:'compare'}),
  a('sources','place',{card:'a',slot:'earlier'}),a('sources','test',{card:'a'}),
  ...['a','b'].flatMap(card=>[
   a('sources','place',{card,slot:'unknown'}),a('sources','test',{card})]),
  a('sources','compare'),a('sources','finish'),nav('to-layout'),
  a('station','walk',{value:'table'}),a('station','place-table',{value:'across-walkway'}),
  a('station','place-table',{value:'near-wall'}),a('station','confirm'),
  a('station','reflect'),nav('to-review'),
  a('garden','inspect',{value:'older'}),a('garden','inspect',{value:'present'}),
  a('garden','overlay'),a('garden','ask-why')
 ])s=step(E05,s,action);
 return s;
}
test('E04 two undated sincere memories earn independent E05 PAPER visit, not production',()=>{
 const e04=memories(),e05=E05.fresh(),e06=E06.fresh();
 assert.equal(encode(E04.fresh(),e05,e06),null);
 assert.equal(encode(E04.replay(e04.history.slice(0,-1)),e05,e06),null);
 const packet=decode(encode(e04,e05,e06));
 assert.deepEqual(packet,{e04,e05,e06});
 assert.equal(E04.view(packet.e04).e04CanonicalComplete,false);
 assert.equal(e05ProductionHandoff(null,null,e04).ready,false);
 assert.deepEqual(e05ProductionHandoff(null,null,e04).unlocks,[]);
});
test('E04 -> E05 -> both E06 spaces, reversible returns and upstream reset',()=>{
 const e04=memories(),e05=station();
 let e06=E06.fresh();
 assert.equal(decode(encode(e04,e05,e06)).e05.history.length,e05.history.length);
 for(const action of [
  a('garden','start'),a('garden','inspect',{value:'present-bed'}),
  a('garden','walk',{value:'slope'}),a('garden','inspect',{value:'slope'}),
  a('garden','walk',{value:'model-tray'}),a('garden','run'),
  a('garden','weather',{value:'rain'}),a('garden','run'),
  a('garden','channel',{value:'blocked'}),a('garden','run'),
  a('garden','compare'),a('garden','enter')
 ])e06=step(E06,e06,action);
 const roundtrip=decode(encode(e04,e05,e06));
 assert.deepEqual(roundtrip,{e04,e05,e06});
 assert.equal(E06.view(roundtrip.e06).screen,'lower');
 assert.equal(E06.view(roundtrip.e06).currentHealthy,true);
 assert.equal(E05.view(roundtrip.e05).e06Unlocked,false);
 assert.equal(E04.view(roundtrip.e04).sourceDates,'UNKNOWN');
 assert.deepEqual(roundtrip.e04.canonicalEvents,[]);
 assert.deepEqual(roundtrip.e05.unlocks,[]);
 assert.deepEqual(roundtrip.e06.rights,[]);
 const e06Restart=E06.dispatch(e06,nav('restart'));
 assert.deepEqual(decode(encode(e04,e05,e06Restart)).e06,E06.fresh());
 const e05Restart=E05.dispatch(e05,nav('restart'));
 assert.equal(encode(e04,e05Restart,e06),null,'E05 reset withdraws linked E06 history');
 assert.deepEqual(decode(encode(e04,e05Restart,E06.fresh())).e04,e04);
 assert.equal(encode(E04.dispatch(e04,nav('restart-e04')),e05,e06),null);
});
test('unearned E06, invented chronology, forged rights and extra packet keys fail closed',()=>{
 const e04=memories(),e05=station(),e06=E06.fresh();
 const started=step(E06,e06,a('garden','start'));
 assert.equal(encode(e04,E05.fresh(),started),null);
 for(const forged of [
  {...e04,rights:['station']},{...e04,unlocks:['E05']},
  {...e04,timeline:{...e04.timeline,slots:{station:'earlier',garden:'later'}}},
  {...e04,history:[...e04.history,{scene:'nav',type:'grant-access'}]}
 ])assert.equal(encode(forged,e05,e06),null);
 for(const forged of [{...e05,rights:['station']},{...e05,unlocks:['E06']}])
  assert.equal(encode(e04,forged,e06),null);
 for(const forged of [{...e06,rights:['garden']},{...e06,unlocks:['E07']}])
  assert.equal(encode(e04,e05,forged),null);
 const packet={v:1,e04:e04.history,e05:e05.history,e06:e06.history};
 const fragment=p=>'#paper-memory-station-garden='+encodeURIComponent(JSON.stringify(p));
 for(const bad of [
  {...packet,v:2},{...packet,year:1900},{...packet,accessApproved:true},
  {...packet,e04:[]},{...packet,e05:[{scene:'nav',type:'to-review'}]},
  {...packet,e06:[{scene:'garden',action:{type:'enter'}}]}
 ])assert.equal(decode(fragment(bad)),null);
 assert.equal(decode(''),null);
 assert.equal(decode('#paper-memory-station-garden=%bad'),null);
 assert.equal(decode('#paper-memory-station-garden='+'x'.repeat(50001)),null);
});
