import test from 'node:test';import assert from 'node:assert/strict';
import {fresh,dispatch,can,replay,restore,view,MAX_ACTIONS} from '../e07-scene/scene-model.mjs';
const a=(type,value)=>({scene:'story',action:value===undefined?{type}:{type,value}}),n=type=>({scene:'nav',type});
const w=(type,value)=>({scene:'walkthrough',type,...(value===undefined?{}:{value})});
const go=(s,x)=>{assert.equal(can(s,x),true,JSON.stringify(x));return dispatch(s,x);};
function complete(){let s=fresh();for(const x of [
 a('start'),a('walk','shared-path'),a('inspect','shared-path'),a('walk','channel'),a('inspect','channel'),a('walk','workbench'),
 a('trial','milo'),a('trial','resident'),a('trial','water'),
 a('place','path-clear-water-blocked'),a('trial','milo'),a('trial','resident'),a('trial','water'),
 a('place','side-offset'),a('trial','water'),a('trial','milo'),a('trial','resident'),a('compare'),a('finish')
])s=go(s,x);return s;}
test('Milo tests three uses, revises twice and leaves no production rights',()=>{
 let s=fresh();assert.equal(can(s,n('garden')),false);assert.equal(can(s,a('trial','milo')),false);
 s=complete();const v=view(s);
 assert.equal(v.story.stage,'finished');assert.equal(v.story.firstTrials.milo.pass,true);
 assert.equal(v.story.firstTrials.resident.pass,false);assert.equal(v.story.firstTrials.water.pass,false);
 for(const k of ['milo','resident','water'])assert.equal(v.story.revisedTrials[k].pass,true);
 assert.equal(v.connectorPaperRevised,true);assert.equal(v.currentGardenHealthy,true);
 assert.equal(v.lowerGardenUnbuilt,true);assert.equal(v.e06Verified,false);assert.equal(v.e08Unlocked,false);
 assert.equal(v.northHillClosed,true);assert.deepEqual(v.canonicalEvents,[]);
 assert.deepEqual(replay(s.history),s);assert.deepEqual(restore(structuredClone(s)),s);
});
test('garden revisit is read-only and restart clears only E07',()=>{
 let s=go(complete(),n('garden'));assert.equal(view(s).screen,'garden');
 assert.equal(can(s,a('place','lower-offset')),false);
 s=go(s,n('connector'));assert.equal(view(s).connectorPaperRevised,true);
 s=go(s,n('restart'));assert.equal(view(s).story.stage,'opening');assert.equal(can(s,n('garden')),false);
});
test('forged rights, history and nested state fail closed',()=>{
 const s=complete();
 for(const edit of [x=>x.unlocks.push('e08'),x=>x.rights.push('build'),
 x=>x.historicalClaims.push('flood 1900'),x=>x.canonicalEvents.push('e06_done'),
 x=>x.story.connector.previewComplete=false,x=>x.history[1].action.value='north-hill',x=>x.screen='garden']){
  const bad=structuredClone(s);edit(bad);assert.equal(restore(bad),null);assert.deepEqual(dispatch(bad,n('garden')),fresh());
 }
 for(const x of [n('garden'),a('finish'),a('walk','north-hill'),{scene:'nav',type:'garden',approved:true}])
  assert.deepEqual(dispatch(fresh(),x),fresh());
 assert.equal(replay(Array(MAX_ACTIONS+1).fill(a('start'))),null);
});

test('restart always resets action budget, including at the cap and after repeated play',()=>{
 let s=complete();
 while(s.history.length+2<=MAX_ACTIONS){s=go(s,n('garden'));s=go(s,n('connector'));}
 if(s.history.length<MAX_ACTIONS)s=go(s,n('garden'));
 assert.equal(s.history.length,MAX_ACTIONS);
 assert.equal(can(s,n('restart')),true);
 assert.equal(can(s,n(s.screen==='garden'?'connector':'garden')),false);
 s=go(s,n('restart'));
 assert.deepEqual(s,fresh());assert.equal(s.history.length,0);
 assert.deepEqual(replay(s.history),s);
 for(let i=0;i<5;i++)s=go(s,n('restart'));
 assert.deepEqual(s,fresh());
 s=complete();assert.equal(view(s).story.stage,'finished');
 assert.equal(replay([n('restart')]),null);
 const bad=structuredClone(s);bad.history.push(n('restart'));
 assert.equal(restore(bad),null);
});

test('Milo checks both uses on revised PAPER route and safely stops at CLOSED boundary',()=>{
 let s=complete();assert.equal(can(s,w('move','crossing')),false);
 assert.equal(can(s,w('review')),false);
 s=go(s,w('start'));s=go(s,w('move','crossing'));
 assert.equal(can(s,w('move','water-edge')),false);
 assert.equal(can(s,w('move','steps-base')),false);
 s=go(s,w('try-closed'));
 assert.equal(view(s).walkthrough.position,'crossing');
 assert.equal(view(s).walkthrough.stopped,true);
 assert.equal(can(s,w('try-closed')),false);
 s=go(s,w('inspect','crossing'));s=go(s,w('other-start'));s=go(s,w('other-step'));s=go(s,w('other-step'));s=go(s,w('move','water-edge'));
 assert.match(view(s).walkthrough.feedback,/Water needs a way/);
 assert.equal(can(s,w('move','steps-base')),false);
 s=go(s,w('inspect','water-edge'));s=go(s,w('move','steps-base'));
 assert.match(view(s).walkthrough.feedback,/Steps BASE/);
 s=go(s,w('review'));
 const v=view(s);
 assert.equal(v.walkthrough.reviewed,true);assert.equal(v.walkthrough.otherPassed,true);
 assert.deepEqual(v.walkthrough.checked,['crossing','water-edge']);
 assert.equal(v.walkthrough.position,'steps-base');
 assert.equal(v.lightsOff,true);assert.equal(v.e08Unlocked,false);
 assert.equal(v.northHillClosed,true);assert.deepEqual(v.rights,[]);
 assert.deepEqual(replay(s.history),s);assert.deepEqual(restore(structuredClone(s)),s);
 let clone=structuredClone(s);clone.walkthrough.position='north-hill';assert.equal(restore(clone),null);
 clone=structuredClone(s);clone.walkthrough.checked.push('approved');assert.equal(restore(clone),null);
 clone=structuredClone(s);clone.unlocks.push('e08');assert.equal(restore(clone),null);
 s=go(s,n('garden'));assert.equal(view(s).walkthrough.reviewed,true);
 assert.equal(can(s,w('start')),false);
 s=go(s,n('connector'));assert.equal(view(s).walkthrough.reviewed,true);
 s=go(s,n('restart'));assert.equal(view(s).walkthrough.phase,'idle');
 assert.equal(can(s,w('start')),false);
});


test('Milo steps an unnamed second traveler across the revised PAPER shared path without inventing access',()=>{
 let s=complete();
 assert.equal(can(s,w('other-start')),false);
 s=go(s,w('start'));s=go(s,w('move','crossing'));
 assert.equal(can(s,w('other-start')),false);
 s=go(s,w('inspect','crossing'));
 s=go(s,w('other-start'));
 assert.equal(view(s).walkthrough.otherPosition,'approach');
 s=go(s,w('other-step'));
 assert.equal(view(s).walkthrough.otherPosition,'crossing');
 s=go(s,w('other-step'));
 assert.equal(view(s).walkthrough.otherPosition,'clear');
 assert.match(view(s).walkthrough.otherFeedback,/Real access and clearance remain UNKNOWN/);
 assert.equal(can(s,w('other-step')),false);
 s=go(s,w('other-reset'));
 assert.equal(view(s).walkthrough.otherPosition,'waiting');
 assert.equal(can(s,w('other-step')),false);
 assert.deepEqual(replay(s.history),s);
 assert.deepEqual(restore(structuredClone(s)),s);
 const forged=structuredClone(s);forged.walkthrough.otherPosition='clear';
 assert.equal(restore(forged),null);
 assert.deepEqual(view(s).canonicalEvents,[]);
 assert.equal(view(s).e08Unlocked,false);
 s=go(s,n('restart'));
 assert.equal(view(s).walkthrough.otherPosition,'waiting');
});


test('route review requires observed second-user passage, not just two Milo inspections',()=>{
 let s=complete();for(const x of [w('start'),w('move','crossing'),w('inspect','crossing'),w('move','water-edge'),w('inspect','water-edge'),w('move','steps-base')])s=go(s,x);
 assert.equal(can(s,w('review')),false);
 assert.equal(view(s).walkthrough.otherPassed,false);
 assert.deepEqual(replay(s.history),s);
 // The traveler must be walked while Milo is at the shared crossing; no remote completion.
 assert.equal(can(s,w('other-start')),false);
 assert.deepEqual(view(s).canonicalEvents,[]);
});

test('Finn response follows earned model, traveler and water review; forged progress is rejected',()=>{
 let s=fresh();assert.equal(view(s).earnedFinnResponse,null);
 s=complete();assert.match(view(s).earnedFinnResponse,/first shortcut worked for Milo/);
 for(const x of [w('start'),w('move','crossing'),w('inspect','crossing'),w('other-start'),w('other-step'),w('other-step')])s=go(s,x);
 assert.match(view(s).earnedFinnResponse,/traveler got through.*check the water/);
 for(const edit of [x=>x.walkthrough.phase='reviewed',x=>x.walkthrough.checked.push('water-edge'),x=>x.walkthrough.otherPassed=false]){
  const bad=structuredClone(s);edit(bad);assert.equal(restore(bad),null);assert.equal(view(bad),null);
 }
 for(const x of [w('move','water-edge'),w('inspect','water-edge'),w('move','steps-base')])s=go(s,x);
 assert.match(view(s).earnedFinnResponse,/check the water/);
 s=go(s,w('review'));assert.match(view(s).earnedFinnResponse,/traveler AND the water.*room for everyone/);
 assert.deepEqual(replay(s.history),s);assert.equal(view(restore(structuredClone(s))).earnedFinnResponse,view(s).earnedFinnResponse);
 assert.deepEqual(view(s).canonicalEvents,[]);assert.deepEqual(view(s).rights,[]);assert.equal(view(s).northHillClosed,true);
 s=go(s,n('restart'));assert.equal(view(s).earnedFinnResponse,null);
});
