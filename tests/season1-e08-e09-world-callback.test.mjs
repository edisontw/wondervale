import test from 'node:test';
import assert from 'node:assert/strict';
import * as E08 from '../e08-scene/scene-model.mjs';
import {lanternWorld} from '../e09-scene/lantern-world.mjs';
const a=(type,key,value)=>({scene:'story',action:key?{type,[key]:value}:{type}});
function completeSteps(){
 let s=E08.fresh();
 for(const action of [a('start'),a('inspect','feature','brackets'),
  a('inspect','feature','boundary'),a('inspect','feature','lower-a'),
  a('toggle-lamp','lampId','lower-a'),a('walk','anchor','lower-landing'),
  a('inspect','feature','lower-b'),a('toggle-lamp','lampId','lower-b'),
  a('walk','anchor','base'),a('observe-view'),
  a('walk','anchor','lower-landing'),a('walk','anchor','side'),
  a('observe-view'),a('compare-views'),a('inspect','feature','service-plate'),
  a('confirm-preview')]){
  assert.equal(E08.can(s,action),true,JSON.stringify(action));
  s=E08.dispatch(s,action);
 }
 return s;
}
test('E08 child-tested lamps and two viewpoints make visible E09 PAPER FIRST/NOW model',()=>{
 const s=completeSteps(),p=lanternWorld(s);
 assert.ok(p);
 assert.equal(p.first.lampsOn,false);assert.equal(p.first.rays.length,0);
 assert.equal(p.now.lampsOn,true);assert.equal(p.now.rays.length,6);
 assert.equal(p.markers.length,3);assert.equal(p.viewpoints.length,2);
 assert.notEqual(p.viewpoints[0].anchor,p.viewpoints[1].anchor);
 assert.ok(p.differenceDegrees>=5);
 assert.equal(p.upperHillClosed,true);assert.equal(p.realLightingApproved,false);
 assert.equal(p.realHillAccessApproved,false);assert.equal(p.historicalDate,null);
 assert.deepEqual(p.canonicalEvents,[]);assert.deepEqual(p.unlocks,[]);
 assert.deepEqual(lanternWorld(E08.replay(s.history)),p);
});
test('unearned, forged, or reset E08 cannot claim lit E09 PAPER world',()=>{
 const s=completeSteps();
 assert.equal(lanternWorld(null),null);
 assert.equal(lanternWorld(E08.fresh()),null);
 assert.equal(lanternWorld(E08.replay(s.history.slice(0,-1))),null);
 const forged=structuredClone(s);forged.rights.push('lighting-permit');
 assert.equal(lanternWorld(forged),null);
 const tampered=structuredClone(s);tampered.story.steps.lights['lower-a']=false;
 assert.equal(lanternWorld(tampered),null);
 assert.equal(lanternWorld(E08.dispatch(s,{scene:'nav',type:'restart'})),null);
});
