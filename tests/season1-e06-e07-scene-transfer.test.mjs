import test from 'node:test';
import assert from 'node:assert/strict';
import * as E06 from '../e06-scene/scene-model.mjs';
import * as E07 from '../e07-scene/scene-model.mjs';
import {encodeTransfer,decodeTransfer} from '../authoring-labs/e06-e07-scene-transfer.mjs';
const g=(type,value)=>({scene:'garden',action:value===undefined?{type}:{type,value}});
const c=(type,value)=>value===undefined?{scene:'care',type}:{scene:'care',type,value};
function completedGarden(){
 let s=E06.fresh();
 for(const a of [g('start'),g('inspect','present-bed'),g('walk','slope'),g('inspect','slope'),
  g('walk','model-tray'),g('run'),g('weather','rain'),g('run'),g('channel','blocked'),
  g('run'),g('compare'),g('enter'),g('inspect','runoff-trace'),
  g('walk','public-path'),g('inspect','public-path'),g('walk','runoff-channel'),
  g('place','runoff-channel'),g('check'),g('walk','raised-pocket'),
  g('place','raised-pocket'),g('check'),g('think','keep-path'),g('finish'),
  c('choose','heavy'),c('test'),c('choose','gentle'),c('test'),c('compare')]){
  assert.equal(E06.can(s,a),true,JSON.stringify(a));s=E06.dispatch(s,a);
 }
 return s;
}
test('child-tested E06 PAPER care moves to independent E07 and back without a production unlock',()=>{
 const e06=completedGarden();
 const e07=E07.dispatch(E07.fresh(),{scene:'story',action:{type:'start'}});
 const fragment=encodeTransfer(e06,e07);
 assert.match(fragment,/^#paper=/);
 const first=decodeTransfer(fragment);
 assert.deepEqual(first.e06,e06);assert.deepEqual(first.e07,e07);
 assert.equal(E06.view(first.e06).lowerGrowthVisible,true);
 assert.equal(E07.view(first.e07).story.stage,'explore');
 const e07Next=E07.dispatch(first.e07,{scene:'story',action:{type:'walk',value:'shared-path'}});
 const returned=decodeTransfer(encodeTransfer(first.e06,e07Next));
 assert.deepEqual(returned.e06,e06);assert.deepEqual(returned.e07,e07Next);
 for(const s of [returned.e06,returned.e07]){
  assert.deepEqual(s.canonicalEvents,[]);assert.deepEqual(s.unlocks,[]);
  assert.deepEqual(s.rights,[]);
 }
});
test('no untested garden, malformed packet, forged rights or bypass can cross scenes',()=>{
 assert.equal(encodeTransfer(E06.fresh(),E07.fresh()),null);
 assert.equal(decodeTransfer(''),null);
 assert.equal(decodeTransfer('#paper=%not-encoded'),null);
 assert.equal(decodeTransfer('#paper='+'x'.repeat(18001)),null);
 const e06=completedGarden(),e07=E07.fresh();
 const valid=decodeTransfer(encodeTransfer(e06,e07));
 assert.ok(valid);
 const p={v:1,e06:e06.history,e07:e07.history};
 for(const bad of [
  {...p,rights:['approved']},
  {...p,e06:[...p.e06,{scene:'nav',type:'grant-access'}]},
  {...p,e07:[{scene:'story',action:{type:'finish'}}]},
  {...p,e06:[]},
  {...p,v:2}
 ]){
  assert.equal(decodeTransfer('#paper='+encodeURIComponent(JSON.stringify(bad))),null);
 }
 const tampered=structuredClone(e06);tampered.rights.push('planting-approved');
 assert.equal(encodeTransfer(tampered,e07),null);
});
