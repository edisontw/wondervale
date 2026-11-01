import test from 'node:test';
import assert from 'node:assert/strict';
import * as E06 from '../e06-scene/scene-model.mjs';
import {gardenCareWorld} from '../e07-scene/garden-world.mjs';
const g=(type,value)=>({scene:'garden',action:value===undefined?{type}:{type,value}});
const c=(type,value)=>value===undefined?{scene:'care',type}:{scene:'care',type,value};
function completed(){
 let s=E06.fresh();
 for(const a of [g('start'),g('inspect','present-bed'),g('walk','slope'),g('inspect','slope'),
  g('walk','model-tray'),g('run'),g('weather','rain'),g('run'),g('channel','blocked'),
  g('run'),g('compare'),g('enter'),g('inspect','runoff-trace'),
  g('walk','public-path'),g('inspect','public-path'),g('walk','runoff-channel'),
  g('place','runoff-channel'),g('check'),g('walk','raised-pocket'),
  g('place','raised-pocket'),g('check'),g('think','keep-path'),g('finish'),
  c('choose','heavy'),c('test'),c('choose','gentle'),c('test'),c('compare')]){
  assert.equal(E06.can(s,a),true,JSON.stringify(a));s=E06.dispatch(s,a);
 }return s;
}
test('E07 visualizes the actually tested E06 unsafe marker and gentler PAPER retry',()=>{
 const s=completed(),p=gardenCareWorld(s);
 assert.ok(p);assert.equal(p.first.markerSite,'runoff-channel');
 assert.equal(p.first.risk,'water-route wet');
 assert.equal(p.first.water,'heavy');assert.equal(p.first.waterResult,'PAPER soggy seed');
 assert.equal(p.now.markerSite,'raised-pocket');
 assert.equal(p.now.water,'gentle');assert.match(p.now.waterResult,/hypothetical PAPER sprout/);
 assert.equal(p.first.tiles.length,3);assert.equal(p.now.tiles.length,3);
 assert.equal(p.first.tiles.filter(t=>t.marker).length,1);
 assert.equal(p.now.tiles.find(t=>t.marker).site,'raised-pocket');
 assert.equal(p.currentGardenHealthy,true);assert.equal(p.paperOnly,true);
 assert.equal(p.realGrowthObserved,false);assert.equal(p.plantingPermissionApproved,false);
 assert.equal(p.realDrainageVerified,false);assert.equal(p.northHillClosed,true);
 assert.equal(p.officialUnlock,false);
 assert.deepEqual(E06.view(s).canonicalEvents,[]);assert.deepEqual(E06.view(s).unlocks,[]);
 assert.deepEqual(gardenCareWorld(E06.replay(s.history)),p);
});
test('no partial, reset, invented rights or tampered actions can paint E06 as E07 world',()=>{
 const s=completed();
 assert.equal(gardenCareWorld(null),null);
 assert.equal(gardenCareWorld(E06.fresh()),null);
 assert.equal(gardenCareWorld(E06.replay(s.history.slice(0,-1))),null);
 assert.equal(gardenCareWorld(E06.dispatch(s,{scene:'nav',type:'restart'})),null);
 const rights=structuredClone(s);rights.rights.push('planting-approved');
 assert.equal(gardenCareWorld(rights),null);
 const forged=structuredClone(s);forged.history[1].action.value='north-hill';
 assert.equal(gardenCareWorld(forged),null);
 const fake=structuredClone(s);fake.care.compared=true;fake.care.trials[0].result='real-growth';
 assert.equal(gardenCareWorld(fake),null);
});
