import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh as fresh02,dispatch as dispatch02,payload as payload02} from '../engine/s01e02.mjs';
import {fresh as fresh03,dispatch as dispatch03,payload as payload03} from '../engine/s01e03.mjs';
import {DRAFT_KEY,fresh as freshChronology,dispatch as dispatchChronology} from '../engine/s01e04-chronology.mjs';
import * as E11 from '../engine/s01e11-authoring-prototype.mjs';
import {E02_KEY,E03_KEY} from '../engine/s01e04-handoff.mjs';
import {E04_ALPHA_PACK} from '../season-alpha/e04-script-model.mjs';
import {
  ALPHA_HANDOFF_KEY,publishE04AlphaHandoff,validateE04AlphaHandoff
} from '../season-alpha/e04-e05-handoff.mjs';
import {ALPHA_E05_E06_KEY,buildAlphaChronicle} from '../season-alpha/alpha-chronicle.mjs';
import {encodeStationGardenTransfer} from '../authoring-labs/e05-e06-scene-transfer.mjs';
import {decodeLoopTransfer,encodeLoopTransfer} from '../authoring-labs/e10-e11-scene-transfer.mjs';
import {sevenSceneUpstream} from './fixtures/season1-e04-e09-paper.mjs';
import {paperLoopFixture} from './fixtures/season1-e03-e11-paper.mjs';

const drain02=s=>{while(s.queue.length)s=dispatch02(s,{type:'next'});return s;};
const drain03=s=>{while(s.queue.length)s=dispatch03(s,{type:'next'});return s;};
const move03=s=>{while(s.travel.length)s=dispatch03(s,{type:'step',to:s.travel[0]});return s;};
function readyE02(){
  let s=fresh02();
  const act=a=>{s=drain02(dispatch02(s,a));};
  act({type:'begin'});act({type:'go',to:'oldStones'});act({type:'inspect',what:'stones'});act({type:'close-detail'});
  act({type:'go',to:'lookoutView'});act({type:'inspect',what:'gap'});act({type:'close-detail'});
  act({type:'notebook'});act({type:'fact',choice:'gap'});act({type:'revision',choice:'A'});
  act({type:'market'});act({type:'chronicle'});act({type:'finish'});return s;
}
function readyE03(){
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
  data=new Map();
  getItem(key){return this.data.get(key)??null;}
  setItem(key,value){this.data.set(key,String(value));}
  removeItem(key){this.data.delete(key);}
}
function completeE04({wrongAttempts=true}={}){
  let s=freshChronology(E04_ALPHA_PACK);
  const act=a=>{s=dispatchChronology(s,a,E04_ALPHA_PACK);};
  for(const which of ['station','garden'])act({type:'inspect-memory',which});
  for(const id of ['station-route-copy','garden-route-update','undated-way-photo'])act({type:'inspect-card',id});
  act({type:'inspect-clue',id:'version-mark'});
  if(wrongAttempts){
    act({type:'place',id:'station-route-copy',slot:'later'});
    act({type:'place',id:'garden-route-update',slot:'earlier'});
  }
  act({type:'place',id:'station-route-copy',slot:'earlier'});
  act({type:'place',id:'garden-route-update',slot:'later'});
  act({type:'place',id:'undated-way-photo',slot:'uncertain'});
  act({type:'explain',kind:'different_times',basis:'version-mark'});
  act({type:'chronicle'});act({type:'finish'});return s;
}
function validInputs(){
  const storage=new MemoryStorage();
  storage.setItem(E02_KEY,JSON.stringify(payload02(readyE02())));
  storage.setItem(E03_KEY,JSON.stringify(payload03(readyE03())));
  storage.setItem(DRAFT_KEY,JSON.stringify(completeE04()));
  const e04=publishE04AlphaHandoff(JSON.parse(storage.getItem(DRAFT_KEY)),storage);
  assert.ok(e04);
  const upstream=sevenSceneUpstream();
  const stationHash=encodeStationGardenTransfer(upstream.e05,upstream.e06);
  assert.ok(stationHash);
  const handoff=validateE04AlphaHandoff(null,storage);
  storage.setItem(ALPHA_E05_E06_KEY,JSON.stringify({v:1,e04:handoff.record,hash:stationHash}));
  const loop=decodeLoopTransfer(paperLoopFixture());
  assert.ok(loop);
  return {storage,upstream,station:storage.getItem(ALPHA_E05_E06_KEY),loop};
}
function reviewedE11(){
  let s=E11.fresh();
  const act=(type,extra={})=>{s=E11.dispatch(s,{type,...extra});};
  act('place',{tokenId:'access',cells:['1,1','1,2']});
  act('place',{tokenId:'quiet',cells:['0,1']});
  act('place',{tokenId:'activity',cells:['0,2']});
  act('test-user',{userId:'quiet_reader'});act('test-user',{userId:'activity_group'});act('snapshot-trial');
  act('place',{tokenId:'activity',cells:['2,1']});
  act('test-user',{userId:'quiet_reader'});act('test-user',{userId:'activity_group'});act('snapshot-trial');
  act('compare-trials',{first:'trial-1',second:'trial-2'});
  act('cite-earlier',{discoveryId:'e10_needs'});
  for(const edgeId of ['square-market','market-common','common-square'])act('add-loop-edge',{edgeId});
  act('check-loop');act('review-preview');
  assert.equal(E11.projection(s)?.reviewed,true);
  return s;
}
function currentLoop(inputs,e11=reviewedE11()){
  return encodeLoopTransfer(inputs.loop.e10,e11,inputs.upstream);
}

test('Alpha Chronicle gets E11 review and placed cells only from the replayed reducer projection',()=>{
  const inputs=validInputs();
  const ledger=buildAlphaChronicle(inputs.storage,inputs.station,currentLoop(inputs));
  assert.ok(ledger);
  assert.match(ledger.entries.at(-1).text,/layout cells placed: 4; model review: recorded/);
  assert.equal(ledger.officialChronicle,false);
  assert.deepEqual(ledger.canonicalEvents,[]);
  assert.deepEqual(ledger.unlocks,[]);
});

test('undo, reset and incomplete E11 review withdraw the Alpha Chronicle',()=>{
  const inputs=validInputs(),reviewed=reviewedE11();
  const undone=E11.replay(reviewed.history.slice(0,-1));
  assert.equal(E11.projection(undone).reviewed,false);
  assert.equal(buildAlphaChronicle(inputs.storage,inputs.station,currentLoop(inputs,undone)),null);
  assert.equal(buildAlphaChronicle(inputs.storage,inputs.station,currentLoop(inputs,E11.fresh())),null);
  assert.equal(buildAlphaChronicle(inputs.storage,inputs.station,'#paper-loop=%bad'),null);
  assert.equal(buildAlphaChronicle(inputs.storage,inputs.station,null),null);
});

test('reload and revisit replay the E11 return fragment and derive the same Chronicle',()=>{
  const inputs=validInputs(),fragment=currentLoop(inputs);
  const reloaded=decodeLoopTransfer(fragment);
  assert.ok(reloaded);
  const ledger=buildAlphaChronicle(inputs.storage,inputs.station,fragment);
  assert.match(ledger.entries.at(-1).text,/layout cells placed: 4; model review: recorded/);
  assert.deepEqual(buildAlphaChronicle(inputs.storage,inputs.station,fragment),ledger);
});

test('a different legal E04 replay cannot be mixed with its earlier E05–E10 records',()=>{
  const inputs=validInputs();
  const ledger=buildAlphaChronicle(inputs.storage,inputs.station,currentLoop(inputs));
  assert.ok(ledger);
  const alternative=completeE04({wrongAttempts:false});
  inputs.storage.setItem(DRAFT_KEY,JSON.stringify(alternative));
  assert.ok(publishE04AlphaHandoff(alternative,inputs.storage));
  assert.ok(validateE04AlphaHandoff(null,inputs.storage));
  assert.equal(buildAlphaChronicle(inputs.storage,inputs.station,currentLoop(inputs)),null);
});
