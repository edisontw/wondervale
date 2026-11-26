import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh as fresh02,dispatch as dispatch02,payload as payload02} from '../engine/s01e02.mjs';
import {fresh as fresh03,dispatch as dispatch03,payload as payload03} from '../engine/s01e03.mjs';
import {DRAFT_KEY,fresh as freshChronology,dispatch as dispatchChronology} from '../engine/s01e04-chronology.mjs';
import {E02_KEY,E03_KEY} from '../engine/s01e04-handoff.mjs';
import {E04_ALPHA_PACK} from '../season-alpha/e04-script-model.mjs';
import {
  ALPHA_HANDOFF_KEY,publishE04AlphaHandoff,validateE04AlphaHandoff
} from '../season-alpha/e04-e05-handoff.mjs';

const drain02=s=>{while(s.queue.length)s=dispatch02(s,{type:'next'});return s;};
const drain03=s=>{while(s.queue.length)s=dispatch03(s,{type:'next'});return s;};
const move03=s=>{while(s.travel.length)s=dispatch03(s,{type:'step',to:s.travel[0]});return s;};
function realE02(){
  let s=fresh02();
  const a=x=>{s=drain02(dispatch02(s,x));};
  a({type:'begin'});a({type:'go',to:'oldStones'});a({type:'inspect',what:'stones'});a({type:'close-detail'});
  a({type:'go',to:'lookoutView'});a({type:'inspect',what:'gap'});a({type:'close-detail'});
  a({type:'notebook'});a({type:'fact',choice:'gap'});a({type:'revision',choice:'A'});
  a({type:'market'});a({type:'chronicle'});a({type:'finish'});return s;
}
function realE03(){
  let s=drain03(dispatch03(fresh03(),{type:'begin',ready:true}));
  const deliver=state=>drain03(dispatch03(move03(dispatch03(state,{type:'take-route',route:'L'})),{type:'deliver'}));
  s=deliver(s);s=drain03(move03(dispatch03(s,{type:'return'})));
  s=deliver(s);s=dispatch03(s,{type:'inspect',what:'S'});s=drain03(dispatch03(s,{type:'compare',reason:'steps'}));
  s=drain03(move03(dispatch03(s,{type:'return'})));s=deliver(s);s=drain03(move03(dispatch03(s,{type:'return'})));
  for(const kind of ['WALK','CART'])s=drain03(dispatch03(s,{type:'sign',kind,to:'L'}));
  s=move03(dispatch03(s,{type:'go-glyph'}));s=drain03(dispatch03(s,{type:'glyph'}));
  for(const which of ['station','garden'])s=drain03(dispatch03(s,{type:'memory',which}));
  s=drain03(dispatch03(s,{type:'chronicle'}));return dispatch03(s,{type:'finish'});
}
class MemoryStorage{
  #data=new Map();
  getItem(key){return this.#data.get(key)??null;}
  setItem(key,value){this.#data.set(key,String(value));}
  removeItem(key){this.#data.delete(key);}
}
function completeChronology({tryWrong=true}={}){
  let s=freshChronology(E04_ALPHA_PACK);
  const a=action=>{s=dispatchChronology(s,action,E04_ALPHA_PACK);};
  for(const which of ['station','garden'])a({type:'inspect-memory',which});
  for(const id of ['station-route-copy','garden-route-update','undated-way-photo'])a({type:'inspect-card',id});
  a({type:'inspect-clue',id:'version-mark'});
  if(tryWrong){
    a({type:'place',id:'station-route-copy',slot:'later'});
    a({type:'place',id:'garden-route-update',slot:'earlier'});
  }
  a({type:'place',id:'station-route-copy',slot:'earlier'});
  a({type:'place',id:'garden-route-update',slot:'later'});
  a({type:'place',id:'undated-way-photo',slot:'uncertain'});
  a({type:'explain',kind:'different_times',basis:'version-mark'});
  a({type:'chronicle'});a({type:'finish'});
  return s;
}
function readyStorage(){
  const storage=new MemoryStorage();
  storage.setItem(E02_KEY,JSON.stringify(payload02(realE02())));
  storage.setItem(E03_KEY,JSON.stringify(payload03(realE03())));
  const state=completeChronology();
  storage.setItem(DRAFT_KEY,JSON.stringify(state));
  return {storage,state};
}

test('Alpha handoff requires current replayed E02, E03 and a complete E04 draft history',()=>{
  const {storage,state}=readyStorage();
  const href=publishE04AlphaHandoff(state,storage);
  assert.match(href,/^\.\.\/e05-scene\/#alpha-e04-e05=/);
  const handoff=validateE04AlphaHandoff(href.slice(href.indexOf('#')),storage);
  assert.equal(handoff?.mode,'noncanonical_alpha_paper');
  assert.deepEqual(handoff?.chronicle.sourceAttribution,[
    {source:'Market coordinator',memory:'station',verified:false},
    {source:'Garden resident',memory:'garden',verified:false}
  ]);
  assert.deepEqual(handoff?.chronicle.uncertain,['undated-way-photo']);
  assert.deepEqual(handoff?.chronicle.canonicalEvents,[]);
  assert.equal(Object.hasOwn(handoff.record,'completed'),false);
  assert.equal(Object.hasOwn(handoff.record,'unlocks'),false);

  storage.removeItem(E02_KEY);
  assert.equal(validateE04AlphaHandoff(href.slice(href.indexOf('#')),storage),null,
    'the old PAPER record is invalid when its E02 prerequisite resets');
  storage.setItem(E02_KEY,JSON.stringify(payload02(realE02())));
  storage.removeItem(E03_KEY);
  assert.equal(validateE04AlphaHandoff(href.slice(href.indexOf('#')),storage),null,
    'the old PAPER record is invalid when its E03 prerequisite resets');
});

test('incomplete, forged, malformed and stale handoff records fail closed',()=>{
  const {storage,state}=readyStorage();
  const href=publishE04AlphaHandoff(state,storage),hash=href.slice(href.indexOf('#'));
  const good=validateE04AlphaHandoff(hash,storage);
  assert.ok(good);

  const incomplete=freshChronology(E04_ALPHA_PACK);
  storage.setItem(DRAFT_KEY,JSON.stringify(incomplete));
  assert.equal(publishE04AlphaHandoff(incomplete,storage),null);
  assert.equal(validateE04AlphaHandoff(hash,storage),null);

  storage.setItem(DRAFT_KEY,JSON.stringify(state));
  const forged={...good.record,history:[{type:'finish'}]};
  storage.setItem(ALPHA_HANDOFF_KEY,JSON.stringify(forged));
  assert.equal(validateE04AlphaHandoff('#alpha-e04-e05=eyJmb3JnZWQiOnRydWV9',storage),null);
  storage.setItem(ALPHA_HANDOFF_KEY,JSON.stringify(good.record));
  assert.equal(validateE04AlphaHandoff('#alpha-e04-e05=not-a-record',storage),null);

  const laterDraft=completeChronology({tryWrong:false});
  storage.setItem(DRAFT_KEY,JSON.stringify(laterDraft));
  assert.equal(validateE04AlphaHandoff(hash,storage),null,
    'a complete but different current chronology cannot reuse a stale URL record');

  storage.removeItem(DRAFT_KEY);
  storage.removeItem(ALPHA_HANDOFF_KEY);
  assert.equal(validateE04AlphaHandoff(hash,storage),null,
    'restarting E04 removes the earned record and invalidates its prior URL');
});
