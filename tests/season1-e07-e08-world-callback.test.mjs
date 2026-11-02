import test from 'node:test';
import assert from 'node:assert/strict';
import * as E07 from '../e07-scene/scene-model.mjs';
import {connectorWorld} from '../e08-scene/connector-world.mjs';
import * as E08 from '../e08-scene/scene-model.mjs';
import {approachFrame} from '../e08-scene/approach-experiment.mjs';
const a=(type,value)=>({scene:'story',action:value===undefined?{type}:{type,value}});
const w=(type,value)=>({scene:'walkthrough',type,...(value===undefined?{}:{value})});
function checked(){
 let s=E07.fresh();
 for(const x of [a('start'),a('walk','shared-path'),a('inspect','shared-path'),
 a('walk','channel'),a('inspect','channel'),a('walk','workbench'),
 a('trial','milo'),a('trial','resident'),a('trial','water'),
 a('place','path-clear-water-blocked'),a('trial','milo'),a('trial','resident'),a('trial','water'),
 a('place','side-offset'),a('trial','water'),a('trial','milo'),a('trial','resident'),
 a('compare'),a('finish'),w('start'),w('move','crossing'),w('inspect','crossing'),
 w('move','water-edge'),w('inspect','water-edge'),w('move','steps-base'),w('review')]){
  assert.equal(E07.can(s,x),true,JSON.stringify(x));s=E07.dispatch(s,x);
 }return s;
}
test('child-earned E07 PAPER detour is visibly different at E08 without real-world claims',()=>{
 const s=checked(),p=connectorWorld(s);
 assert.ok(p);assert.equal(p.first.layout,'short-crossing');
 assert.equal(p.now.layout,'side-offset');
 assert.equal(p.first.cells.length,56);assert.equal(p.now.cells.length,56);
 assert.equal(p.first.conflicts,2);assert.equal(p.now.conflicts,0);
 assert.equal(p.first.miloPass,true);assert.equal(p.now.miloPass,true);
 assert.equal(p.first.peoplePass,false);assert.equal(p.first.waterPass,false);
 assert.equal(p.now.peoplePass,true);assert.equal(p.now.waterPass,true);
 assert.equal(p.paperOnly,true);assert.equal(p.realRouteBuilt,false);
 assert.equal(p.realDrainageVerified,false);assert.equal(p.upperHillClosed,true);
 assert.equal(p.stepsLightsOff,true);
 assert.deepEqual(E07.view(s).canonicalEvents,[]);
 assert.deepEqual(E07.view(s).unlocks,[]);assert.deepEqual(E07.view(s).rights,[]);
});
test('unfinished, forged and restarted E07 histories never show an earned E08 world change',()=>{
 const s=checked();
 assert.equal(connectorWorld(null),null);
 assert.equal(connectorWorld(E07.fresh()),null);
 assert.equal(connectorWorld(E07.replay(s.history.slice(0,-1))),null);
 const forged=structuredClone(s);forged.rights.push('route-approved');
 assert.equal(connectorWorld(forged),null);
 const tampered=structuredClone(s);tampered.history[1].action.value='north-hill';
 assert.equal(connectorWorld(tampered),null);
 assert.equal(connectorWorld(E07.dispatch(s,{scene:'nav',type:'restart'})),null);
 assert.equal(connectorWorld(E07.replay(s.history))?.now.conflicts,0);
});

const lamp=(type,key,value)=>({scene:'story',action:key?{type,[key]:value}:{type}});
function twoViews(){
 let s=E08.fresh();
 for(const x of [lamp('start'),lamp('inspect','feature','brackets'),
  lamp('inspect','feature','boundary'),lamp('inspect','feature','lower-a'),
  lamp('toggle-lamp','lampId','lower-a'),lamp('walk','anchor','lower-landing'),
  lamp('inspect','feature','lower-b'),lamp('toggle-lamp','lampId','lower-b'),
  lamp('walk','anchor','base'),lamp('observe-view'),
  lamp('walk','anchor','lower-landing'),lamp('walk','anchor','side'),
  lamp('observe-view'),lamp('compare-views')]){
  assert.equal(E08.can(s,x),true,JSON.stringify(x));s=E08.dispatch(s,x);
 }
 return s;
}
test('E07 child-tested route changes overlap, E08 viewpoint changes apparent spacing, not fixed marks',()=>{
 const e07=checked(),e08=twoViews();
 const frames=['first','now'].flatMap(layout=>['first','second'].map(viewpoint=>approachFrame(e07,e08,layout,viewpoint)));
 assert.equal(frames.length,4);assert.ok(frames.every(Boolean));
 assert.equal(frames[0].conflicts,2);assert.equal(frames[1].conflicts,2);
 assert.equal(frames[2].conflicts,0);assert.equal(frames[3].conflicts,0);
 assert.equal(frames[0].spreadDegrees,frames[2].spreadDegrees);
 assert.equal(frames[1].spreadDegrees,frames[3].spreadDegrees);
 assert.notEqual(frames[0].spreadDegrees,frames[1].spreadDegrees);
 for(const f of frames){
  assert.deepEqual(f.fixedMarks,['A','B','C']);assert.equal(f.paperOnly,true);
  assert.equal(f.realRouteBuilt,false);assert.equal(f.realLightingApproved,false);
  assert.equal(f.upperHillClosed,true);
 }
 assert.equal(approachFrame(e07,E08.fresh(),'first','first'),null);
 assert.equal(approachFrame(E07.fresh(),e08,'now','second'),null);
 assert.equal(approachFrame(e07,e08,'third','first'),null);
 assert.equal(approachFrame(e07,e08,'now','upper-closed'),null);
 const forged=structuredClone(e07);forged.unlocks.push('e08');
 assert.equal(approachFrame(forged,e08,'now','first'),null);
 assert.equal(approachFrame(e07,E08.dispatch(e08,{scene:'nav',type:'restart'}),'now','first'),null);
});
