import test from 'node:test';
import assert from 'node:assert/strict';
import * as E06 from '../e06-scene/scene-model.mjs';
import * as E07 from '../e07-scene/scene-model.mjs';
import * as E08 from '../e08-scene/scene-model.mjs';
import {encodeStepsTransfer,decodeStepsTransfer} from '../authoring-labs/e07-e08-scene-transfer.mjs';
const a=(type,value)=>({scene:'story',action:value===undefined?{type}:{type,value}});
const w=(type,value)=>({scene:'walkthrough',type,...(value===undefined?{}:{value})});
const l=(type,key,value)=>({scene:'story',action:key?{type,[key]:value}:{type}});
function checkedConnector(){
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
function finishedSteps(){
 let s=E08.fresh();
 for(const x of [l('start'),l('inspect','feature','brackets'),l('inspect','feature','boundary'),
 l('inspect','feature','lower-a'),l('toggle-lamp','lampId','lower-a'),
 l('walk','anchor','lower-landing'),l('inspect','feature','lower-b'),
 l('toggle-lamp','lampId','lower-b'),l('walk','anchor','base'),l('observe-view'),
 l('walk','anchor','lower-landing'),l('walk','anchor','side'),l('observe-view'),
 l('compare-views'),l('inspect','feature','service-plate'),l('confirm-preview')]){
  assert.equal(E08.can(s,x),true,JSON.stringify(x));s=E08.dispatch(s,x);
 }return s;
}
test('E07 child-checked PAPER route earns reversible E08 model link, never production rights',()=>{
 const e07=checkedConnector(),e08=finishedSteps();
 const fragment=encodeStepsTransfer(e07,e08);assert.match(fragment,/^#paper-steps=/);
 const recovered=decodeStepsTransfer(fragment);
 assert.deepEqual(recovered.e07,e07);assert.deepEqual(recovered.e08,e08);
 assert.equal(recovered.e06,null);
 assert.equal(E07.view(recovered.e07).walkthrough.reviewed,true);
 assert.equal(E08.view(recovered.e08).lowerLightsPaperOn,true);
 assert.equal(E07.view(recovered.e07).e08Unlocked,false);
 assert.equal(E08.view(recovered.e08).e09Unlocked,false);
 for(const s of [recovered.e07,recovered.e08]){
  assert.deepEqual(s.canonicalEvents,[]);assert.deepEqual(s.unlocks,[]);
  assert.deepEqual(s.rights,[]);assert.deepEqual(s.historicalClaims,[]);
 }
 const restartedE08=E08.dispatch(recovered.e08,{scene:'nav',type:'restart'});
 const back=decodeStepsTransfer(encodeStepsTransfer(recovered.e07,restartedE08));
 assert.equal(E07.view(back.e07).walkthrough.reviewed,true);
 assert.equal(E08.view(back.e08).story.stage,'opening');
 assert.equal(encodeStepsTransfer(E07.fresh(),back.e08),null);
});
test('unreviewed connector, forged history/rights, optional E06 bypass and malformed packets fail closed',()=>{
 const e07=checkedConnector(),e08=finishedSteps();
 assert.equal(encodeStepsTransfer(E07.fresh(),e08),null);
 assert.equal(decodeStepsTransfer(''),null);
 assert.equal(decodeStepsTransfer('#paper-steps=%no'),null);
 assert.equal(decodeStepsTransfer('#paper-steps='+'x'.repeat(26001)),null);
 const packet={v:1,e07:e07.history,e08:e08.history};
 for(const bad of [
  {...packet,rights:['lights-approved']},
  {...packet,e07:[]},
  {...packet,e07:[...e07.history,{scene:'nav',type:'grant-e08'}]},
  {...packet,e08:[{scene:'story',action:{type:'confirm-preview'}}]},
  {...packet,v:2}
 ])assert.equal(decodeStepsTransfer('#paper-steps='+encodeURIComponent(JSON.stringify(bad))),null);
 const badE07=structuredClone(e07);badE07.unlocks.push('e08');
 assert.equal(encodeStepsTransfer(badE07,e08),null);
 const badE08=structuredClone(e08);badE08.rights.push('real-wiring');
 assert.equal(encodeStepsTransfer(e07,badE08),null);
 assert.equal(encodeStepsTransfer(e07,e08,E06.fresh()),null);
});
