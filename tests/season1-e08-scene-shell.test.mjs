import test from 'node:test';import assert from 'node:assert/strict';
import {fresh,dispatch,can,replay,restore,view,MAX_ACTIONS} from '../e08-scene/scene-model.mjs';
const a=(type,key,value)=>({scene:'story',action:key?{type,[key]:value}:{type}}),n=type=>({scene:'nav',type});
const go=(s,x)=>{assert.equal(can(s,x),true,JSON.stringify(x));return dispatch(s,x);};
function complete(){let s=fresh();for(const x of [
 a('start'),a('inspect','feature','brackets'),a('inspect','feature','boundary'),
 a('inspect','feature','lower-a'),a('toggle-lamp','lampId','lower-a'),
 a('walk','anchor','lower-landing'),a('inspect','feature','lower-b'),
 a('toggle-lamp','lampId','lower-b'),a('walk','anchor','base'),a('observe-view'),
 a('walk','anchor','lower-landing'),a('walk','anchor','side'),a('observe-view'),
 a('inspect','feature','service-plate'),a('compare-views'),a('confirm-preview')
])s=go(s,x);return s;}
test('Milo investigates two safe views; a single lamp and single view are insufficient',()=>{
 let s=fresh();assert.equal(can(s,a('walk','anchor','side')),false);
 assert.equal(can(s,n('connector')),false);
 s=go(s,a('start'));for(const feature of ['brackets','boundary','lower-a'])s=go(s,a('inspect','feature',feature));
 s=go(s,a('toggle-lamp','lampId','lower-a'));
 assert.equal(can(s,a('observe-view')),false);
 s=go(s,a('walk','anchor','lower-landing'));s=go(s,a('inspect','feature','lower-b'));
 s=go(s,a('toggle-lamp','lampId','lower-b'));s=go(s,a('walk','anchor','base'));
 s=go(s,a('observe-view'));assert.equal(can(s,a('compare-views')),false);
 assert.match(view(s).story.parentCue,/another safe place/);
 s=go(s,a('walk','anchor','lower-landing'));s=go(s,a('walk','anchor','side'));
 s=go(s,a('observe-view'));
 assert.ok(view(s).story.secondView.spreadDegrees-view(s).story.firstView.spreadDegrees>30);
 assert.equal(can(s,a('confirm-preview')),false);
 s=go(s,a('compare-views'));s=go(s,a('inspect','feature','service-plate'));
 s=go(s,a('confirm-preview'));assert.equal(view(s).story.stage,'finished');
});
test('completion is PAPER only, no rights, chronology, access or E09 unlock',()=>{
 const s=complete(),v=view(s);
 assert.equal(v.lowerLightsPaperOn,true);assert.equal(v.e07Verified,false);
 assert.equal(v.e09Unlocked,false);assert.equal(v.upperHillClosed,true);
 assert.equal(v.realLightingApproved,false);assert.equal(v.serviceDateApproved,false);
 assert.deepEqual(v.canonicalEvents,[]);assert.deepEqual(v.unlocks,[]);
 assert.deepEqual(v.rights,[]);assert.deepEqual(v.historicalClaims,[]);
 assert.match(v.story.paperNote,/UNKNOWN/);assert.match(v.story.paperNote,/NOT UNLOCKED/);
 assert.deepEqual(replay(s.history),s);assert.deepEqual(restore(structuredClone(s)),s);
});
test('child revisits both fixed-marker viewpoints without moving evidence or unlocking anything',()=>{
 let s=complete();
 assert.equal(view(s).reviewMode,'both');
 for(const mode of ['first','second','both']){
  s=go(s,n('trace-'+mode));
  assert.equal(view(s).reviewMode,mode);
  assert.equal(view(s).story.firstView.viewpoint,'base');
  assert.equal(view(s).story.secondView.viewpoint,'side');
  assert.equal(view(s).upperHillClosed,true);
  assert.deepEqual(view(s).canonicalEvents,[]);
 }
 assert.deepEqual(replay(s.history),s);
 assert.deepEqual(restore(structuredClone(s)),s);
 s=go(s,n('connector'));s=go(s,n('steps'));
 assert.equal(view(s).reviewMode,'both');
 assert.deepEqual(go(s,n('restart')),fresh());
 assert.equal(can(fresh(),n('trace-first')),false);
});
test('read-only connector callback and E08-only restart',()=>{
 let s=go(complete(),n('connector'));assert.equal(view(s).screen,'connector');
 assert.equal(can(s,a('walk','anchor','base')),false);
 s=go(s,n('steps'));assert.equal(view(s).lowerLightsPaperOn,true);
 s=go(s,n('restart'));assert.deepEqual(s,fresh());
 assert.equal(can(s,n('connector')),false);
});
test('closed hill, forged dates, rights, snapshots and injected action keys fail closed',()=>{
 const s=complete();
 for(const x of [a('walk','anchor','upper-closed'),a('walk','anchor','north-hill'),
  {scene:'story',action:{type:'confirm-preview',year:1901}},
  {scene:'nav',type:'connector',approved:true},
  {scene:'nav',type:'trace-first',approved:true}])
  assert.equal(can(fresh(),x),false);
 for(const edit of [x=>x.unlocks.push('e09'),x=>x.rights.push('wire'),
  x=>x.historicalClaims.push('1910'),x=>x.canonicalEvents.push('e08_complete'),
  x=>x.story.steps.observations[0].spreadDegrees=999,
  x=>x.story.steps.lights['lower-a']=false,
  x=>x.history[1].action.feature='service-plate',x=>x.screen='connector',
  x=>x.reviewMode='official']){
  const bad=structuredClone(s);edit(bad);assert.equal(restore(bad),null);
  assert.deepEqual(dispatch(bad,n('connector')),fresh());
 }
 assert.equal(replay(Array(MAX_ACTIONS+1).fill(a('start'))),null);
 assert.equal(replay([n('restart')]),null);
});
test('restart always works at history cap and resets action budget',()=>{
 let s=complete();
 while(s.history.length<MAX_ACTIONS)s=go(s,n(view(s).screen==='steps'?'connector':'steps'));
 assert.equal(s.history.length,MAX_ACTIONS);
 assert.equal(can(s,n('restart')),true);
 assert.equal(can(s,n(view(s).screen==='steps'?'connector':'steps')),false);
 s=go(s,n('restart'));assert.deepEqual(s,fresh());
 for(let i=0;i<3;i++)s=go(s,n('restart'));
 assert.deepEqual(s,fresh());
});