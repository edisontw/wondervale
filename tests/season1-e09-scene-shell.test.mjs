import test from 'node:test';import assert from 'node:assert/strict';
import {fresh,dispatch,can,replay,restore,view,MAX_ACTIONS} from '../e09-scene/scene-model.mjs';
const a=(type,key,value)=>({scene:'story',action:key?{type,[key]:value}:{type}}),n=type=>({scene:'nav',type});
const go=(s,x)=>{assert.equal(can(s,x),true,JSON.stringify(x));return dispatch(s,x);};
function complete(){
 let s=fresh();for(const x of [
  a('start'),a('inspect','clueId','entry_note'),a('walk','to','signpost'),
  a('inspect','clueId','boundary_sign'),a('walk','to','fence_view'),
  a('inspect','clueId','disturbed_ground'),a('walk','to','upper_closed'),
  a('consider','hypothesisId','water_may_change_ground'),a('walk','to','signpost'),
  a('walk','to','lower_bend'),a('inspect','clueId','runoff_marks'),
  a('walk','to','overlook'),a('inspect','clueId','distant_symbol'),
  a('mark','edgeId','steps_base:signpost'),a('mark','edgeId','lower_bend:overlook'),
  a('check-route'),a('mark','edgeId','signpost:lower_bend'),
  a('check-route'),a('compare-symbol'),a('review'),a('finish-preview')
 ])s=go(s,x);return s;
}
test('child starts, stops at CLOSED fence and cannot teleport or claim a route',()=>{
 let s=fresh();assert.equal(can(s,a('walk','to','signpost')),false);
 assert.equal(can(s,n('lantern')),false);s=go(s,a('start'));
 assert.equal(can(s,a('walk','to','overlook')),false);
 s=go(s,a('walk','to','signpost'));s=go(s,a('inspect','clueId','boundary_sign'));
 assert.match(view(s).story.parentCue,/without crossing/);
 s=go(s,a('walk','to','fence_view'));s=go(s,a('walk','to','upper_closed'));
 assert.equal(view(s).story.position,'fence_view');assert.equal(view(s).story.blockedAttempts,1);
 assert.equal(view(s).upperHillClosed,true);s=go(s,a('walk','to','signpost'));
});
test('sketch gap requires child revision; complete PAPER never grants E10',()=>{
 let s=complete(),v=view(s);
 assert.equal(v.story.previewComplete,true);assert.equal(v.story.routeResult.complete,true);
 assert.equal(v.story.blockedAttempts,1);
 assert.match(v.story.paperNote,/UNKNOWN/);assert.match(v.story.paperNote,/NOT UNLOCKED/);
 assert.equal(v.e08Verified,false);assert.equal(v.e10Unlocked,false);
 assert.equal(v.realAccessApproved,false);assert.equal(v.productionEntryReady,false);
 assert.deepEqual(v.canonicalEvents,[]);assert.deepEqual(v.unlocks,[]);
 assert.deepEqual(v.rights,[]);assert.deepEqual(v.historicalClaims,[]);
 assert.deepEqual(replay(s.history),s);assert.deepEqual(restore(structuredClone(s)),s);
});
test('read-only Lantern callback preserves PAPER result, scoped restart clears it',()=>{
 let s=go(complete(),n('lantern'));assert.equal(view(s).screen,'lantern');
 assert.equal(can(s,a('walk','to','signpost')),false);
 s=go(s,n('hill'));assert.equal(view(s).story.previewComplete,true);
 s=go(s,n('restart'));assert.deepEqual(s,fresh());
 assert.equal(can(s,n('lantern')),false);
});
test('child compares blank model and earned survey; replay and E08 callback preserve it',()=>{
 let s=complete();const first=view(s);
 assert.equal(first.surveyLayer,'notes');
 assert.equal(first.surveyBoard.kind,'fictional_model_only');
 assert.equal(first.surveyBoard.walkedEdges,4);
 assert.equal(first.surveyBoard.markedEdges,3);
 assert.equal(first.surveyBoard.inspectedClues,5);
 assert.equal(can(s,n('notes')),false);
 s=go(s,n('blank'));assert.equal(view(s).surveyLayer,'blank');
 s=go(s,n('lantern'));assert.equal(view(s).surveyLayer,'blank');
 assert.equal(can(s,n('notes')),false);
 s=go(s,n('hill'));s=go(s,n('notes'));
 assert.equal(view(s).surveyLayer,'notes');
 assert.deepEqual(replay(s.history),s);
 assert.deepEqual(restore(structuredClone(s)),s);
 assert.equal(view(s).upperHillClosed,true);
 assert.equal(view(s).e10Unlocked,false);
 assert.deepEqual(view(s).canonicalEvents,[]);
});
test('forged date, access, source, route and extra action keys fail closed',()=>{
 const s=complete();
 for(const x of [a('walk','to','secret_bridge'),
  {scene:'story',action:{type:'finish-preview',year:1901}},
  {scene:'nav',type:'lantern',approved:true},a('walk','to','upper_closed')])
  assert.equal(can(fresh(),x),false);
 for(const edit of [x=>x.unlocks.push('e10'),x=>x.rights.push('access'),
  x=>x.historicalClaims.push('1910'),x=>x.canonicalEvents.push('e09_complete'),
  x=>x.story.hill.position='upper_closed',x=>x.surveyLayer='blank',x=>x.story.hill.routeResult.complete=false,
  x=>x.story.hill.markedEdges.push('fence_view:upper_closed'),
  x=>x.history[1].action.clueId='distant_symbol',x=>x.screen='lantern']){
  const bad=structuredClone(s);edit(bad);assert.equal(restore(bad),null);
  assert.deepEqual(dispatch(bad,n('lantern')),fresh());
 }
 assert.equal(replay(Array(MAX_ACTIONS+1).fill(a('start'))),null);
 assert.equal(replay([n('restart')]),null);
 assert.equal(can(fresh(),n('blank')),false);
 assert.equal(can(complete(),{scene:'nav',type:'blank',sourceApproved:true}),false);
 assert.equal(replay([n('blank')]),null);
});
test('restart remains possible at action cap',()=>{
 let s=complete();
 while(s.history.length<MAX_ACTIONS)s=go(s,n(view(s).screen==='hill'?'lantern':'hill'));
 assert.equal(can(s,n('restart')),true);
 assert.equal(can(s,n(view(s).screen==='hill'?'lantern':'hill')),false);
 s=go(s,n('restart'));assert.deepEqual(s,fresh());
});
