import test from 'node:test';
import assert from 'node:assert/strict';
import {VERSION,MAX_ACTIONS,NODES,CLOSED_NODE,SAFE_EDGES,CLOSED_EDGE,CLUES,
  fresh,dispatch,replay,restore,routeCheck,previewProjection
} from '../engine/s01e09-authoring-prototype.mjs';
const act=(s,type,fields={})=>dispatch(s,{type,...fields});
const walk=(s,to)=>act(s,'walk',{to});
const inspect=(s,clueId)=>act(s,'inspect',{clueId});
const mark=(s,edgeId)=>act(s,'mark',{edgeId});
function surveyed(){
  let s=fresh();
  s=walk(s,'signpost');s=inspect(s,'boundary_sign');
  s=walk(s,'fence_view');s=inspect(s,'disturbed_ground');
  s=walk(s,'signpost');s=walk(s,'lower_bend');s=inspect(s,'runoff_marks');
  s=walk(s,'overlook');s=inspect(s,'distant_symbol');
  return s;
}
function marked(){
  let s=surveyed();
  for(const edgeId of ['steps_base:signpost','signpost:lower_bend','lower_bend:overlook'])s=mark(s,edgeId);
  return s;
}
function finished(){
  let s=marked();s=act(s,'check-route');s=act(s,'compare-symbol');
  s=act(s,'review');return act(s,'finish-preview');
}
test('fresh model is isolated, noncanonical and closed by default',()=>{
  const s=fresh();assert.equal(s.version,VERSION);assert.equal(s.mode,'authoring_preview');
  assert.equal(s.position,'steps_base');assert.deepEqual(s.canonicalEvents,[]);
  assert.deepEqual(s.unlocks,[]);assert.deepEqual(s.historicalClaims,[]);
  assert.equal('localStorage' in s,false);assert.equal(NODES.includes(CLOSED_NODE),false);
  assert.equal(SAFE_EDGES.length,4);assert.ok(!SAFE_EDGES.some(e=>e.id===CLOSED_EDGE));
});
test('all declared safe edges are undirected, with no secret bypass',()=>{
  const s=walk(fresh(),'signpost');assert.equal(s.position,'signpost');
  assert.equal(walk(s,'steps_base').position,'steps_base');
  assert.deepEqual(walk(fresh(),'overlook'),fresh());
  assert.deepEqual(walk(fresh(),'fence_view'),fresh());
  assert.deepEqual(walk(s,'overlook'),s);
});
test('closed hill walk is visible stop, without position change or punishment',()=>{
  let s=walk(walk(fresh(),'signpost'),'fence_view');
  s=walk(s,CLOSED_NODE);assert.equal(s.position,'fence_view');
  assert.equal(s.blockedAttempts,1);assert.match(s.feedback,/closed/i);
  assert.equal(s.surveyedEdges.includes(CLOSED_EDGE),false);
  assert.equal(walk(s,'signpost').position,'signpost');
});
test('unknown nodes, teleport and malformed commands cannot change state',()=>{
  const s=fresh();for(const to of ['__proto__','secret_bridge','upper_closed','steps_base',null,{},'overlook'])
    assert.deepEqual(walk(s,to),s);
  for(const a of [{type:'walk',to:'signpost',safe:true},{type:'open-fence'},
    {type:'walk',to:'signpost',permit:'yes'},null,'walk',{}])assert.deepEqual(dispatch(s,a),s);
});
test('inspection requires the exact safe viewing anchor',()=>{
  let s=fresh();for(const clueId of ['boundary_sign','disturbed_ground','runoff_marks','distant_symbol','__proto__'])
    assert.deepEqual(inspect(s,clueId),s);
  s=inspect(s,'entry_note');assert.equal(s.inspected[0],'entry_note');
  assert.deepEqual(inspect(s,'entry_note'),s);
  assert.equal(Object.keys(CLUES).length,5);
});
test('observations are seen, not dates or closure causes',()=>{
  const s=surveyed();assert.equal(s.observations.length,4);
  assert.ok(s.observations.every(o=>o.kind==='seen'));
  assert.ok(!JSON.stringify(s.observations).includes('189'));
  assert.ok(!JSON.stringify(s.observations).includes('because erosion'));
});
test('a hypothesis stays a hypothesis and cannot be supplied as arbitrary history',()=>{
  const s=surveyed();let p=act(s,'consider',{hypothesisId:'water_may_change_ground'});
  assert.deepEqual(p.hypotheses,['water_may_change_ground']);
  assert.deepEqual(act(p,'consider',{hypothesisId:'1898'}),p);
  assert.deepEqual(act(p,'consider',{hypothesisId:'water_may_change_ground'}),p);
  assert.deepEqual(act(p,'consider',{hypothesisId:'water_may_change_ground',verified:true}),p);
  assert.match(previewProjection(p).cards.think[0],/not proved/i);
});
test('walking records surveyed edges, not marks or an approval',()=>{
  const s=surveyed();assert.equal(s.surveyedEdges.length,4);
  assert.deepEqual(s.markedEdges,[]);assert.equal(s.routeResult,null);
  assert.deepEqual(s.canonicalEvents,[]);
});
test('unsurveyed mark is refused with feedback and retry is possible',()=>{
  let s=fresh();s=mark(s,'lower_bend:overlook');
  assert.deepEqual(s.markedEdges,[]);assert.equal(s.blockedAttempts,1);
  assert.match(s.feedback,/walk/i);
  s=walk(s,'signpost');s=mark(s,'steps_base:signpost');
  assert.deepEqual(s.markedEdges,['steps_base:signpost']);
});
test('closed edge cannot be marked even after standing at fence',()=>{
  let s=walk(walk(fresh(),'signpost'),'fence_view');
  s=mark(s,CLOSED_EDGE);assert.equal(s.blockedAttempts,1);
  assert.deepEqual(s.markedEdges,[]);assert.match(s.feedback,/closed/i);
  assert.deepEqual(mark(s,'fence_view:secret'),s);
});
test('computed continuity rejects partial and disconnected route',()=>{
  const partial=routeCheck(['steps_base:signpost','lower_bend:overlook'],SAFE_EDGES.map(e=>e.id));
  assert.equal(partial.complete,false);assert.deepEqual(partial.reachable,['steps_base','signpost']);
  assert.equal(partial.nextGap,'signpost:lower_bend');
  assert.equal(routeCheck([CLOSED_EDGE],[]),null);
  assert.equal(routeCheck([],['fake']),null);
});
test('walking all edges is not enough: marks must form the route',()=>{
  let s=surveyed();s=act(s,'check-route');
  assert.equal(s.routeResult.complete,false);
  s=mark(s,'steps_base:signpost');s=mark(s,'lower_bend:overlook');
  s=act(s,'check-route');assert.equal(s.routeResult.complete,false);
  assert.equal(s.routeResult.nextGap,'signpost:lower_bend');
  s=mark(s,'signpost:lower_bend');s=act(s,'check-route');
  assert.equal(s.routeResult.complete,true);
  assert.ok(s.routeResult.reachable.includes('overlook'));
});
test('unmark invalidates route and permits safe revision',()=>{
  let s=act(marked(),'check-route');assert.equal(s.routeResult.complete,true);
  s=act(s,'unmark',{edgeId:'signpost:lower_bend'});assert.equal(s.routeResult,null);
  s=act(s,'check-route');assert.equal(s.routeResult.complete,false);
  s=mark(s,'signpost:lower_bend');s=act(s,'check-route');assert.equal(s.routeResult.complete,true);
});
test('symbol cannot be compared remotely or before direct observation',()=>{
  let s=walk(fresh(),'signpost');assert.deepEqual(act(s,'compare-symbol'),s);
  s=walk(s,'lower_bend');s=walk(s,'overlook');
  assert.deepEqual(act(s,'compare-symbol'),s);
  s=inspect(s,'distant_symbol');s=act(s,'compare-symbol');
  assert.equal(s.symbolCompared,true);assert.match(s.feedback,/do not know/i);
});
test('review requires boundary, terrain, route and distant mark evidence',()=>{
  let s=marked();s=act(s,'check-route');
  assert.deepEqual(act(s,'review'),s);
  s=act(s,'compare-symbol');s=act(s,'review');
  assert.equal(s.reviewed,true);
  const p=previewProjection(s);assert.equal(p.cards.seen.length,4);
  assert.equal(p.cards.unknown.length,3);
  assert.ok(!JSON.stringify(p).includes('Common'));
});
test('finish is provisional, immutable and does not unlock E10',()=>{
  const s=finished();assert.equal(s.provisionalFinished,true);
  const p=previewProjection(s);assert.equal(p.provisionalFinished,true);
  assert.match(p.label,/NOT A REAL ROUTE/);
  assert.deepEqual(p.canonicalEvents,[]);assert.deepEqual(p.unlocks,[]);
  assert.deepEqual(p.historicalClaims,[]);
  assert.deepEqual(walk(s,'lower_bend'),s);
  assert.deepEqual(act(s,'finish-preview'),s);
});
test('strict replay and restore reconstruct the exact snapshot',()=>{
  const s=finished();assert.deepEqual(replay(s.history),s);
  assert.deepEqual(restore(structuredClone(s)),s);
  assert.deepEqual(act(s,'reset'),fresh());
  assert.equal(replay([{type:'reset'}]),null);
  assert.equal(replay([{type:'walk',to:'overlook'}]),null);
});
test('forged completion, dates, graph, unlock and route checks fail closed',()=>{
  const s=finished();for(const change of [
    x=>{x.provisionalFinished=false;},x=>{x.position='upper_closed';},
    x=>{x.routeResult.complete=false;},x=>{x.routeResult.reachable.push('upper_closed');},
    x=>{x.markedEdges.push(CLOSED_EDGE);},x=>{x.historicalClaims.push('1897');},
    x=>{x.canonicalEvents.push('s01e09.complete');},x=>{x.unlocks.push('s01e10');},
    x=>{x.observations[0].text='officially safe';},
    x=>{x.history[0].to='upper_closed';},x=>{x.history[0].safe=true;},
    x=>{x.mode='canonical';},x=>{x.graph={upper_closed:true};}
  ]){
    const bad=structuredClone(s);change(bad);
    assert.equal(restore(bad),null);
    assert.deepEqual(dispatch(bad,{type:'finish-preview'}),fresh());
    assert.equal(previewProjection(bad),null);
  }
});
test('bounded history cannot be extended or used to forge progress',()=>{
  let s=walk(fresh(),'signpost');
  while(s.history.length<MAX_ACTIONS){
    s=walk(s,s.position==='signpost'?'steps_base':'signpost');
  }
  assert.equal(s.history.length,MAX_ACTIONS);
  assert.deepEqual(act(s,'check-route'),s);
  assert.equal(replay([...s.history,{type:'finish-preview'}]),null);
  assert.deepEqual(act(s,'reset'),fresh());
});
