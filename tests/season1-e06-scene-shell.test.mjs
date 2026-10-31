import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch,can,replay,restore,view,MAX_ACTIONS} from '../e06-scene/scene-model.mjs';
const g=(type,value)=>({scene:'garden',action:value===undefined?{type}:{type,value}});
const n=type=>({scene:'nav',type});
const c=(type,value)=>value===undefined?{scene:'care',type}:{scene:'care',type,value};
const doIt=(s,a)=>{assert.equal(can(s,a),true,JSON.stringify(a));return dispatch(s,a);};
function complete(){
 let s=fresh();
 for(const a of [g('start'),g('inspect','present-bed'),g('walk','slope'),g('inspect','slope'),
  g('walk','model-tray'),g('run'),g('weather','rain'),g('run'),
  g('channel','blocked'),g('run'),g('compare'),g('enter'),
  g('inspect','runoff-trace'),g('walk','public-path'),g('inspect','public-path'),
  g('walk','runoff-channel'),g('place','runoff-channel'),g('check'),
  g('walk','raised-pocket'),g('place','raised-pocket'),g('check'),
  g('think','keep-path'),g('finish')])s=doIt(s,a);
 return s;
}
test('two different spaces require upper observations, rain comparison and lower marker revision',()=>{
 let s=fresh();assert.equal(can(s,g('enter')),false);
 s=doIt(s,g('start'));assert.equal(can(s,g('enter')),false);
 s=complete();
 const v=view(s);
 assert.equal(v.screen,'lower');assert.equal(v.garden.phase,'finished');
 assert.equal(v.currentHealthy,true);assert.equal(v.currentCompared,true);
 assert.equal(v.lowerPaperStarted,true);assert.equal(v.e07Unlocked,false);
 assert.match(v.paperChronicle,/UNKNOWN/);
 assert.deepEqual(v.canonicalEvents,[]);assert.deepEqual(v.rights,[]);
 assert.deepEqual(replay(s.history),s);
 assert.deepEqual(restore(structuredClone(s)),s);
});
test('read-only upper revisit retains lower plan and does not mutate the rain model',()=>{
 let s=complete(),historyLength=s.history.length;
 s=doIt(s,n('to-current'));
 assert.equal(view(s).screen,'current');
 assert.equal(can(s,g('run')),false);
 assert.equal(can(s,g('enter')),false);
 s=doIt(s,n('to-lower'));
 assert.equal(view(s).lowerPaperStarted,true);
 assert.equal(s.history.length,historyLength+2);
 s=doIt(s,n('restart'));
 assert.equal(view(s).screen,'current');
 assert.equal(view(s).garden.phase,'opening');
 assert.equal(view(s).lowerPaperStarted,false);
 assert.equal(can(s,n('to-lower')),false);
});
test('forged rights, canonical history, bypass and modified nested state fail closed',()=>{
 const s=complete();
 for(const edit of [
  x=>x.unlocks.push('s01e07'),x=>x.rights.push('garden_access'),
  x=>x.historicalClaims.push('flood 1950'),x=>x.canonicalEvents.push('planted'),
  x=>x.garden.garden.markerSite='north-hill',
  x=>x.history[1].action.value='fake'
 ]){const bad=structuredClone(s);edit(bad);assert.equal(restore(bad),null);
  assert.deepEqual(dispatch(bad,n('to-current')),fresh());}
 for(const action of [g('grant-permission'),g('enter'),n('to-lower'),
  {scene:'nav',type:'to-current',approved:true}])
  assert.deepEqual(dispatch(fresh(),action),fresh());
 assert.equal(replay(Array(MAX_ACTIONS+1).fill(g('start'))),null);
});

test('child revises a soggy PAPER seed and sees hypothetical growth on both revisits',()=>{
 let s=fresh();
 assert.equal(can(s,c('choose','heavy')),false);
 s=complete();
 assert.equal(view(s).care.stage,'paper-marker');
 assert.equal(can(s,c('compare')),false);
 s=doIt(s,c('choose','heavy'));
 s=doIt(s,c('test'));
 assert.equal(view(s).care.stage,'paper-soggy');
 assert.equal(view(s).lowerGrowthVisible,false);
 assert.equal(can(s,c('compare')),false);
 s=doIt(s,c('choose','gentle'));
 s=doIt(s,c('test'));
 assert.equal(view(s).care.stage,'paper-seed');
 s=doIt(s,c('compare'));
 assert.equal(view(s).care.stage,'paper-sprout');
 assert.equal(view(s).lowerGrowthVisible,true);
 assert.match(view(s).paperChronicle,/BEFORE.*NOW/);
 assert.match(view(s).paperChronicle,/Actual growth.*UNKNOWN/);
 assert.deepEqual(view(s).canonicalEvents,[]);
 assert.deepEqual(view(s).unlocks,[]);
 s=doIt(s,n('to-current'));
 assert.equal(view(s).currentHealthy,true);
 assert.equal(view(s).lowerGrowthVisible,true);
 assert.equal(can(s,c('choose','heavy')),false);
 s=doIt(s,n('to-lower'));
 assert.equal(view(s).care.stage,'paper-sprout');
 assert.deepEqual(replay(s.history),s);
 assert.deepEqual(restore(structuredClone(s)),s);
 for(const edit of [
  x=>x.care.compared=false,
  x=>x.care.trials.push({choice:'heavy',result:'real-plant'}),
  x=>x.history.at(-1).type='to-common',
  x=>x.rights.push('planting-approved')
 ]){
  const forged=structuredClone(s);edit(forged);
  assert.equal(restore(forged),null);
 }
 s=doIt(s,n('restart'));
 assert.equal(view(s).care.stage,'paper-marker');
 assert.equal(view(s).lowerGrowthVisible,false);
});
