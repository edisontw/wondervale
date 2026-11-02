import test from 'node:test';
import assert from 'node:assert/strict';
import * as E07 from '../e07-scene/scene-model.mjs';
import * as E08 from '../e08-scene/scene-model.mjs';
import * as E09 from '../e09-scene/scene-model.mjs';
import {fourFrameEvidence,placeQuestion} from '../e09-scene/field-question.mjs';

const act=(type,key,value)=>({scene:'story',action:key?{type,[key]:value}:{type}});
function steps(){
 let s=E08.fresh();
 for(const a of [act('start'),act('inspect','feature','brackets'),
  act('inspect','feature','boundary'),act('inspect','feature','lower-a'),
  act('toggle-lamp','lampId','lower-a'),act('walk','anchor','lower-landing'),
  act('inspect','feature','lower-b'),act('toggle-lamp','lampId','lower-b'),
  act('walk','anchor','base'),act('observe-view'),
  act('walk','anchor','lower-landing'),act('walk','anchor','side'),
  act('observe-view'),act('compare-views'),act('inspect','feature','service-plate'),
  act('confirm-preview')]){assert.equal(E08.can(s,a),true);s=E08.dispatch(s,a);}
 return s;
}
const e07a=(type,value)=>({scene:'story',action:value===undefined?{type}:{type,value}});
const e07w=(type,value)=>({scene:'walkthrough',type,...(value===undefined?{}:{value})});
function connector(){
 let s=E07.fresh();
 for(const a of [e07a('start'),e07a('walk','shared-path'),e07a('inspect','shared-path'),
  e07a('walk','channel'),e07a('inspect','channel'),e07a('walk','workbench'),
  e07a('trial','milo'),e07a('trial','resident'),e07a('trial','water'),
  e07a('place','path-clear-water-blocked'),e07a('trial','milo'),
  e07a('trial','resident'),e07a('trial','water'),e07a('place','side-offset'),
  e07a('trial','water'),e07a('trial','milo'),e07a('trial','resident'),
  e07a('compare'),e07a('finish'),e07w('start'),e07w('move','crossing'),
  e07w('inspect','crossing'),e07w('move','water-edge'),e07w('inspect','water-edge'),
  e07w('move','steps-base'),e07w('review')]){
  assert.equal(E07.can(s,a),true,JSON.stringify(a));s=E07.dispatch(s,a);
 }
 return s;
}
function hill(){
 let s=E09.fresh();
 for(const a of [act('start'),act('inspect','clueId','entry_note'),
  act('walk','to','signpost'),act('inspect','clueId','boundary_sign'),
  act('walk','to','fence_view'),act('inspect','clueId','disturbed_ground'),
  act('walk','to','signpost'),act('walk','to','lower_bend'),
  act('inspect','clueId','runoff_marks'),act('walk','to','overlook'),
  act('inspect','clueId','distant_symbol')]){
  assert.equal(E09.can(s,a),true,JSON.stringify(a));s=E09.dispatch(s,a);
 }
 return s;
}
test('four-frame comparison requires BOTH replay-earned E07 and E08, not E08 alone',()=>{
 const e08=steps();
 assert.equal(fourFrameEvidence(null,e08),null);
 assert.equal(fourFrameEvidence(E07.fresh(),e08),null);
 assert.equal(fourFrameEvidence(E07.dispatch(connector(),{scene:'nav',type:'restart'}),e08),null);
 assert.equal(fourFrameEvidence(E07.fresh(),E08.fresh()),null);
 const forged=structuredClone(e08);forged.rights.push('lights-approved');
 assert.equal(fourFrameEvidence(E07.fresh(),forged),null);
});
test('unlinked or unfinished E09 cannot mark a future check',()=>{
 assert.equal(placeQuestion(null,steps(),E09.fresh(),'access','fence_view'),null);
 assert.equal(placeQuestion(E07.fresh(),steps(),E09.fresh(),'access','fence_view'),null);
 assert.equal(placeQuestion(null,null,null,'identity','overlook'),null);
});

test('four replay-earned combinations distinguish connector conflict from apparent marker spacing',()=>{
 const e07=connector(),e08=steps(),g=fourFrameEvidence(e07,e08);
 assert.ok(g);assert.equal(g.cells.length,4);
 assert.equal(g.firstConflicts,2);assert.equal(g.nowConflicts,0);
 assert.equal(g.cells[0].spreadDegrees,g.cells[2].spreadDegrees);
 assert.equal(g.cells[1].spreadDegrees,g.cells[3].spreadDegrees);
 assert.notEqual(g.cells[0].spreadDegrees,g.cells[1].spreadDegrees);
 assert.deepEqual(g.fixedMarks,['A','B','C']);
 assert.equal(g.upperHillClosed,true);assert.equal(g.realAccessApproved,false);
 assert.deepEqual(g.canonicalEvents,[]);assert.deepEqual(g.unlocks,[]);
 assert.deepEqual(fourFrameEvidence(E07.replay(e07.history),E08.replay(e08.history)),g);
});
test('Milo attaches one reversible future question only at inspected safe evidence',()=>{
 const e07=connector(),e08=steps(),h=hill();
 const access=placeQuestion(e07,e08,h,'access','fence_view');
 assert.equal(access.ok,true);assert.equal(access.realCheckDone,false);
 assert.match(access.note,/NOT DONE/);
 const identity=placeQuestion(e07,e08,h,'identity','overlook');
 assert.equal(identity.ok,true);assert.match(identity.note,/reliable source/);
 assert.equal(placeQuestion(e07,e08,h,'access','overlook').ok,false);
 assert.equal(placeQuestion(e07,e08,h,'identity','fence_view').ok,false);
 assert.equal(placeQuestion(e07,e08,E09.fresh(),'access','fence_view').ok,false);
 assert.equal(placeQuestion(e07,e08,h,'access','upper_closed'),null);
 assert.equal(placeQuestion(e07,e08,h,'unknown','fence_view'),null);
 const bad=structuredClone(h);bad.rights.push('hill-open');
 assert.equal(placeQuestion(e07,e08,bad,'access','fence_view'),null);
 assert.equal(placeQuestion(e07,E08.dispatch(e08,{scene:'nav',type:'restart'}),h,'access','fence_view'),null);
});
