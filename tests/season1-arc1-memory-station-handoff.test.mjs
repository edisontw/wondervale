import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch,can,view,replay,restore,MEMORIES,MAX_ACTIONS} from '../authoring-labs/arc1-memory-station-handoff-model.mjs';
import {e05ProductionHandoff} from '../engine/s01e05-production-entry.mjs';
import {EVENTS as E03_EVENTS} from '../engine/s01e03.mjs';
const e04=(s,type,x={})=>dispatch(s,{scene:'e04',action:{type,...x}});
const e05=(s,type,value)=>dispatch(s,{scene:'e05',action:value===undefined?{type}:{type,value}});
const nav=(s,type)=>dispatch(s,{scene:'nav',type});
function timeline(){
 let s=fresh();
 s=e04(s,'inspect',{which:'station'});s=e04(s,'inspect',{which:'garden'});
 s=e04(s,'place',{which:'station',slot:'earlier'});
 s=e04(s,'place',{which:'garden',slot:'later'});
 s=e04(s,'place',{which:'station',slot:'unknown'});
 s=e04(s,'place',{which:'garden',slot:'unknown'});
 s=e04(s,'compare');s=e04(s,'finish-paper');
 return s;
}
function stationDone(){
 let s=nav(timeline(),'to-e05');
 for(const [type,value] of [
  ['start'],['walk','board'],['inspect','peg-pair'],['inspect','worn-edge'],
  ['guess','route-board'],['try-copy','side-b'],['check'],
  ['try-copy','side-a'],['check'],['qualify'],['walk','table'],
  ['place-table','across-walkway'],['place-table','near-wall'],['confirm'],['reflect']
 ])s=e05(s,type,value);
 return s;
}
test('exact attributed E03 memories are not invented chronology or source dates',()=>{
 const s=fresh(),v=view(s);
 assert.equal(v.stage,'e04');assert.equal(v.memoryCards.station.text,null);
 assert.equal(v.memoryCards.garden.text,null);
 assert.equal(MEMORIES.station.text,'I remember a way to the station.');
 assert.equal(MEMORIES.garden.text,'I remember a way to the garden.');
 assert.equal(MEMORIES.station.event,E03_EVENTS.station);
 assert.equal(MEMORIES.garden.event,E03_EVENTS.garden);
 assert.equal(v.sourceDates,'UNKNOWN');assert.equal(v.e04CanonicalComplete,false);
 assert.equal(can(s,{scene:'nav',type:'to-e05'}),false);
 assert.deepEqual(nav(s,'to-e05'),s);
});
test('child can try unsupported earlier/later, revise to UNKNOWN, then visit E05 PAPER',()=>{
 let s=fresh();s=e04(s,'inspect',{which:'station'});
 assert.equal(view(s).memoryCards.station.text,MEMORIES.station.text);
 assert.equal(view(s).memoryCards.garden.text,null);
 assert.deepEqual(e04(s,'place',{which:'station',slot:'earlier'}),s);
 s=e04(s,'inspect',{which:'garden'});
 s=e04(s,'place',{which:'station',slot:'earlier'});
 s=e04(s,'place',{which:'garden',slot:'later'});
 assert.deepEqual(e04(s,'compare'),s,'unverified chronology cannot be declared supported');
 assert.equal(can(s,{scene:'nav',type:'to-e05'}),false);
 s=e04(s,'place',{which:'station',slot:'unknown'});
 s=e04(s,'place',{which:'garden',slot:'unknown'});
 s=e04(s,'compare');s=e04(s,'finish-paper');
 assert.equal(view(s).paperReady,true);
 const next=nav(s,'to-e05');assert.equal(view(next).stage,'e05');
 assert.deepEqual(next.canonicalEvents,[]);assert.deepEqual(next.unlocks,[]);
 assert.deepEqual(replay(next.history),next);
});
test('Milo tests mismatch and revised copy, moves blocking table, keeps E06 question open',()=>{
 const done=stationDone(),v=view(done);
 assert.equal(v.stage,'e05');assert.equal(v.stationPaperFinished,true);
 assert.equal(v.station.fit,true);assert.equal(v.station.clear,true);
 assert.match(v.station.chroniclePreview,/PAPER NOTE/);
 assert.equal(v.oldTrainServiceOpen,false);assert.equal(v.northHillClosed,true);
 assert.equal(v.commonRevealed,false);assert.equal(v.stationAccessApproved,false);
 assert.equal(v.e05ProductionUnlocked,false);
 assert.deepEqual(v.canonicalEvents,[]);assert.deepEqual(v.unlocks,[]);
 assert.deepEqual(v.historicalClaims,[]);assert.deepEqual(v.rights,[]);
 assert.deepEqual(replay(done.history),done);
 assert.deepEqual(restore(structuredClone(done)),done);
 const back=nav(done,'to-e04');assert.equal(view(back).paperReady,true);
 assert.equal(view(back).stage,'e04');
 assert.equal(view(nav(back,'to-e05')).stationPaperFinished,true);
});
test('restarting E04 invalidates downstream E05 without touching production',()=>{
 const done=stationDone();
 const reset=nav(done,'restart-e04');
 assert.equal(view(reset).stage,'e04');
 assert.equal(view(reset).paperReady,false);
 assert.equal(view(reset).stationPaperFinished,false);
 assert.equal(can(reset,{scene:'nav',type:'to-e05'}),false);
 assert.deepEqual(replay(reset.history),reset);
 assert.deepEqual(e05ProductionHandoff(null,null,done).unlocks,[]);
 assert.equal(e05ProductionHandoff(null,null,done).ready,false);
});
test('forged approval, dates, completion, sources, extra actions and hidden production events fail closed',()=>{
 const done=stationDone();
 for(const a of [
  {scene:'nav',type:'to-e05',approved:true},
  {scene:'e04',action:{type:'place',which:'station',slot:'1902'}},
  {scene:'e04',action:{type:'finish-canonical'}},
  {scene:'e05',action:{type:'reflect',unlock:true}},
  {scene:'nav',type:'reset-all'}
 ])assert.deepEqual(dispatch(done,a),done);
 for(const change of [
  x=>x.mode='canonical',x=>x.unlocks.push('s01e05'),
  x=>x.canonicalEvents.push('e04.finish'),x=>x.historicalClaims.push('1902'),
  x=>x.rights.push('station-approved'),x=>x.timeline.slots.station='earlier',
  x=>x.timeline.finishedPaper=false,x=>x.station.reflection=false,
  x=>x.history[0].action.approved=true
 ]){
  const forged=structuredClone(done);change(forged);
  assert.equal(restore(forged),null);
  assert.deepEqual(dispatch(forged,{scene:'nav',type:'to-e04'}),fresh());
 }
 assert.equal(replay(Array(MAX_ACTIONS+1).fill({scene:'nav',type:'to-e05'})),null);
});
