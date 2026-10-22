import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh as fresh02, dispatch as dispatch02, payload as payload02, EVENTS as EVENTS02} from '../engine/s01e02.mjs';
import {fresh as fresh03, dispatch as dispatch03, restore as restore03, payload as payload03, EVENTS as EVENTS03} from '../engine/s01e03.mjs';
import {e04Handoff, e04Ready, E04_SOURCE_EVENTS} from '../engine/s01e04-handoff.mjs';

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

test('E03→E04 accepts restored canonical E02 + complete E03 in either witness order',()=>{
  const e02=payload02(realE02()), beforeE02=JSON.stringify(e02);
  for(const order of [['station','garden'],['garden','station']]){
    const e03=payload03(realE03(order));
    assert.equal(restore03(e03).phase,'completed');
    assert.equal(e04Ready(e02,e03),true);
    assert.deepEqual(e04Handoff(e02,e03),{
      ready:true,reason:null,
      sources:{station:EVENTS03.station,garden:EVENTS03.garden,marker:EVENTS03.glyph}
    });
    assert.deepEqual(E04_SOURCE_EVENTS,{station:EVENTS03.station,garden:EVENTS03.garden,marker:EVENTS03.glyph});
  }
  assert.equal(JSON.stringify(e02),beforeE02,'entry check must be read-only');
});

test('E03→E04 rejects false/incomplete E02 checkpoints even with completed E03',()=>{
  const e03=payload03(realE03());
  for(const e02 of [null,fresh02(),{ledger:[EVENTS02.finish,EVENTS02.market]},
    {...realE02(),phase:'chronicle'},
    {...realE02(),version:'fake-version'}]){
    assert.deepEqual(e04Handoff(e02,e03),{ready:false,reason:'complete-riverside-first'});
  }
});

test('E03→E04 refuses incomplete, fabricated, corrupted and replay E03 progress',()=>{
  const e02=payload02(realE02()), good=payload03(realE03());
  const tampered=structuredClone(good); tampered.ledger=[EVENTS03.finish,EVENTS03.station,EVENTS03.garden];
  const missingMemory=structuredClone(good); missingMemory.achieved=missingMemory.achieved.filter(x=>x!==EVENTS03.garden);
  for(const e03 of [null,fresh03(),{ledger:Object.values(EVENTS03)},
    payload03(realE03(['station','garden'],false)),tampered,missingMemory,
    {...good,version:'wrong'}, {...good,phase:'chronicle'}, {...good,mode:'historical_replay'}]){
    assert.equal(e04Ready(e02,e03),false);
  }
});

test('E03 replay/reset and an E02 reset never manufacture E04 eligibility',()=>{
  const e02=payload02(realE02()), e03=payload03(realE03());
  assert.equal(e04Ready(e02,e03),true);
  assert.equal(e04Ready(null,e03),false,'E02 reset removes the prerequisite');
  assert.equal(e04Ready(e02,null),false,'E03 reset removes the prerequisite');
  assert.equal(payload03(fresh03('historical_replay')),null,'historical replay cannot persist');
  assert.equal(e04Ready(e02,realE03()),true,'read-only guard may inspect a canonical checkpoint without changing it');
  assert.equal(e04Ready(e02,dispatch03(fresh03(),{type:'begin',ready:true})),false);
});
