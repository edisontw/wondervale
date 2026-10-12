import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fresh,restore,payload,dispatch,route,places,edges,e01Ready,EVENTS,speech} from '../engine/s01e02.mjs';
const drain=s=>{let i=0;while(s.queue.length){s=dispatch(s,{type:'next'});assert.ok(++i<90);}return s;};
const begin=()=>drain(dispatch(fresh(),{type:'begin'}));
const walk=(s,to)=>drain(dispatch(s,{type:'go',to}));
const inspect=(s,to,what)=>drain(dispatch(walk(s,to),{type:'inspect',what}));
const both=(order=['stones','gap'])=>{let s=begin();for(const x of order)s=inspect(s,x==='stones'?'oldStones':'lookoutView',x);return s;};
const revise=(order=['stones','gap'],choice='A')=>{
 let s=drain(dispatch(both(order),{type:'notebook'}));
 s=drain(dispatch(s,{type:'fact',choice:'gap'}));
 return drain(dispatch(s,{type:'revision',choice}));
};
test('E02-01: real E01 event prerequisites, no imaginary unlock',()=>{
 assert.equal(e01Ready({ledger:['episode_completed:s01e01']}),false);
 assert.equal(e01Ready({ledger:['s01e01_town_square_old_marker_revealed']}),false);
 assert.equal(e01Ready({ledger:['episode_completed:s01e01','s01e01_town_square_old_marker_revealed']}),true);
 assert.equal(e01Ready(null),false);
});
test('E02-02: exact 81 E02 lines, no E01 voice text mutation',()=>{
 const json=JSON.parse(readFileSync('public/s01e02.json'));
 assert.equal(json.count,81);assert.equal(Object.keys(json.lines).length,81);
 for(const arr of Object.values(speech))for(const id of arr)assert.ok(json.lines[id],id);
 const source=readFileSync('content/season-01/s01e02/DETAILED_SCRIPT.md','utf8');
 for(const [id,row]of Object.entries(json.lines))assert.ok(source.includes('['+id+'] “'+row.text+'”'),id);
});
test('E02-03: approved route graph connected, no walking into river or far bank',()=>{
 const geo=JSON.parse(readFileSync('assets/reference-candidates/s01e02/riverside-r0-geography-blockout-v1.json'));
 assert.deepEqual(places,geo.pathWaypoints);assert.deepEqual(edges,geo.graphEdges);
 for(const [id,p]of Object.entries(places))assert.ok(p[1]>610,'Near-bank only: '+id);
 assert.deepEqual(route('spawn','oldStones'),['spawn','plaza','oldSpurFork','oldStones']);
 assert.ok(route('oldStones','lookoutView').includes('publicSideFork'));
 assert.equal(route('lookoutView','farBank').length,0);
});
test('E02-04: opening hypothesis must complete before exploring',()=>{
 let s=dispatch(fresh(),{type:'begin'});
 assert.equal(s.phase,'intro');assert.equal(dispatch(s,{type:'go',to:'lookoutView'}).position,'spawn');
 s=drain(s);assert.equal(s.phase,'explore');
});
test('E02-05: lookout arrival persists once; passing through never counts as observing',()=>{
 let s=begin();s=walk(s,'lookoutView');
 assert.equal(s.ledger.filter(x=>x===EVENTS.lookout).length,1);
 assert.equal(s.observed.length,0);
 s=walk(s,'oldStones');s=walk(s,'lookoutView');assert.equal(s.ledger.filter(x=>x===EVENTS.lookout).length,1);
 assert.equal(dispatch(s,{type:'notebook'}).phase,'explore');
});
test('E02-06: order independence and station-specific intentional inspection',()=>{
 for(const order of [['stones','gap'],['gap','stones']]){
  const s=both(order);assert.deepEqual(new Set(s.observed),new Set(['stones','gap']));
  assert.equal(s.revised,false);assert.equal(s.market,false);
 }
 let s=begin();s=dispatch(s,{type:'inspect',what:'gap'});assert.equal(s.observed.length,0);
 s=walk(s,'oldStones');s=dispatch(s,{type:'inspect',what:'gap'});assert.equal(s.observed.length,0);
 s=drain(dispatch(s,{type:'inspect',what:'stones'}));assert.deepEqual(s.observed,['stones']);
});
test('E02-07: old-stones recovery and unsure never grant revision',()=>{
 let s=drain(dispatch(both(),{type:'notebook'}));assert.equal(s.offeredCue,true);
 s=drain(dispatch(s,{type:'fact',choice:'stones'}));assert.equal(s.phase,'notebook');
 s=dispatch(s,{type:'unsure'});assert.equal(s.linked,false);
 assert.equal(s.ledger.includes(EVENTS.revision),false);
 s=drain(dispatch(s,{type:'fact',choice:'gap'}));assert.equal(s.linked,true);assert.equal(s.phase,'revision');
});
test('E02-08: both reasonable qualified revisions converge once',()=>{
 for(const choice of ['A','B']){let s=revise(['gap','stones'],choice);
  assert.equal(s.phase,'market');assert.equal(s.ledger.filter(x=>x===EVENTS.revision).length,1);
  assert.equal(s.market,false);assert.equal(s.ledger.includes(EVENTS.finish),false);}
});
test('E02-09: Market Lane gated by accepted revision and intentional protected view',()=>{
 let s=both();
 assert.equal(dispatch(s,{type:'market'}).market,false);
 s=revise();assert.equal(s.phase,'market');assert.equal(s.market,false);
 s=dispatch(s,{type:'market'});assert.equal(s.market,false,'cannot inspect from old stones');
 s=walk(s,'lookoutView');s=drain(dispatch(s,{type:'market'}));assert.equal(s.market,true);assert.equal(s.phase,'chronicle');
 assert.equal(s.ledger.filter(x=>x===EVENTS.market).length,1);
 s=dispatch(s,{type:'finish'});assert.equal(s.phase,'chronicle','Chronicle reading is required');
 s=drain(dispatch(s,{type:'chronicle'}));s=dispatch(s,{type:'finish'});
 assert.equal(s.phase,'completed');assert.equal(s.ledger.filter(x=>x===EVENTS.finish).length,1);
 s=dispatch(s,{type:'finish'});assert.equal(s.ledger.filter(x=>x===EVENTS.finish).length,1);
});
test('E02-10: persistence isolated and corrupted input resets safely',()=>{
 const src=walk(begin(),'lookoutView');
 assert.equal(src.ledger.includes(EVENTS.lookout),true);
 const copy=restore(JSON.parse(JSON.stringify(payload(src))));
 assert.equal(copy.ledger.includes(EVENTS.lookout),true);
 assert.equal(restore({version:'other'}).phase,'preview');
 assert.equal(restore({schema:1,version:src.version,ledger:[],observed:[],position:'farBank'}).phase,'preview');
});
test('E02-11: closed old spur never crosses the fence or creates evidence',()=>{
 let s=begin();s=drain(dispatch(s,{type:'closed'}));
 assert.equal(s.position,'oldStones');assert.deepEqual(s.observed,[]);assert.deepEqual(s.ledger,[]);
});
