import test from 'node:test';
import assert from 'node:assert/strict';
import * as E06 from '../e06-scene/scene-model.mjs';
import * as E07 from '../e07-scene/scene-model.mjs';
import {runoffChoice} from '../e07-scene/garden-connector-whatif.mjs';
const g=(type,value)=>({scene:'garden',action:value===undefined?{type}:{type,value}});
const care=(type,value)=>value===undefined?{scene:'care',type}:{scene:'care',type,value};
const story=(type,value)=>({scene:'story',action:value===undefined?{type}:{type,value}});
const walk=(type,value)=>({scene:'walkthrough',type,...(value===undefined?{}:{value})});
function e06(){
 let s=E06.fresh();
 for(const a of [g('start'),g('inspect','present-bed'),g('walk','slope'),g('inspect','slope'),
  g('walk','model-tray'),g('run'),g('weather','rain'),g('run'),g('channel','blocked'),
  g('run'),g('compare'),g('enter'),g('inspect','runoff-trace'),g('walk','public-path'),
  g('inspect','public-path'),g('walk','runoff-channel'),g('place','runoff-channel'),
  g('check'),g('walk','raised-pocket'),g('place','raised-pocket'),g('check'),
  g('think','keep-path'),g('finish'),care('choose','heavy'),care('test'),
  care('choose','gentle'),care('test'),care('compare')]){
  assert.equal(E06.can(s,a),true,JSON.stringify(a));s=E06.dispatch(s,a);
 }return s;
}
function e07(){
 let s=E07.fresh();
 for(const a of [story('start'),story('walk','shared-path'),story('inspect','shared-path'),
  story('walk','channel'),story('inspect','channel'),story('walk','workbench'),
  story('trial','milo'),story('trial','resident'),story('trial','water'),
  story('place','path-clear-water-blocked'),story('trial','milo'),
  story('trial','resident'),story('trial','water'),story('place','side-offset'),
  story('trial','water'),story('trial','milo'),story('trial','resident'),
  story('compare'),story('finish'),walk('start'),walk('move','crossing'),
  walk('inspect','crossing'),walk('other-start'),walk('other-step'),walk('other-step'),walk('move','water-edge'),walk('inspect','water-edge'),
  walk('move','steps-base'),walk('review')]){
  assert.equal(E07.can(s,a),true,JSON.stringify(a));s=E07.dispatch(s,a);
 }return s;
}
test('Milo can vary E06 rain tray and E07 geometry independently, with visible conflict consequence',()=>{
 const a=e06(),b=e07();
 const first=runoffChoice(a,b,'blocked','first');
 const open=runoffChoice(a,b,'open','first');
 const revised=runoffChoice(a,b,'open','now');
 assert.equal(first.catchment,3);assert.equal(open.catchment,1);
 assert.equal(first.waterOverlaps.length,1);assert.equal(first.residentOverlaps.length,1);
 assert.equal(revised.waterOverlaps.length,0);assert.equal(revised.residentOverlaps.length,0);
 assert.equal(first.overlap.length,2);assert.equal(revised.overlap.length,0);
 assert.equal(first.bothPaperChecksClear,false);assert.equal(revised.bothPaperChecksClear,true);
 assert.equal(revised.modelsIndependent,true);assert.equal(revised.realDrainageVerified,false);
 assert.equal(revised.actualGardenToConnectorLinkVerified,false);
 assert.equal(revised.officialUnlock,false);assert.deepEqual(revised.canonicalEvents,[]);
 assert.deepEqual(revised.unlocks,[]);
 assert.deepEqual(runoffChoice(E06.replay(a.history),E07.replay(b.history),'open','now'),revised);
});
test('direct E07, incomplete child checks, reset and forged rights cannot create cross-scene claims',()=>{
 const a=e06(),b=e07();
 for(const args of [[null,b,'open','now'],[E06.fresh(),b,'open','now'],
  [a,E07.fresh(),'open','now'],[a,b,'dry','now'],[a,b,'open','fake']])
  assert.equal(runoffChoice(...args),null);
 assert.equal(runoffChoice(E06.dispatch(a,{scene:'nav',type:'restart'}),b,'open','now'),null);
 assert.equal(runoffChoice(a,E07.dispatch(b,{scene:'nav',type:'restart'}),'open','now'),null);
 const partial=E07.replay(b.history.slice(0,-1));
 assert.equal(runoffChoice(a,partial,'open','now'),null);
 const fake=structuredClone(a);fake.rights.push('planting-approved');
 assert.equal(runoffChoice(fake,b,'open','now'),null);
 const fake7=structuredClone(b);fake7.unlocks.push('e08');
 assert.equal(runoffChoice(a,fake7,'open','now'),null);
 const forged=structuredClone(a);forged.garden.garden.modelRuns[1].catchment=99;
 assert.equal(runoffChoice(forged,b,'open','now'),null);
});
