import test from 'node:test';
import assert from 'node:assert/strict';
import * as E07 from '../e07-scene/scene-model.mjs';
import {connectorWorld} from '../e08-scene/connector-world.mjs';
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
