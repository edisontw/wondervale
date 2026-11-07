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
test('E08-inspired future question pins are replayed, revisable and never grant access',()=>{
 const q=(type,question,at)=>type==='compare'?{scene:'sightline',type}:
  type==='remove'?{scene:'sightline',type,question}:{scene:'sightline',type,question,at};
 let s=go(fresh(),a('start'));
 assert.equal(can(s,q('place','light','fence_view')),false);
 s=go(s,a('walk','to','signpost'));
 s=go(s,a('inspect','clueId','boundary_sign'));
 s=go(s,a('walk','to','fence_view'));
 s=go(s,a('inspect','clueId','disturbed_ground'));
 s=go(s,q('place','light','overlook'));
 assert.equal(view(s).sightlineBoard.placements.light,'overlook');
 s=go(s,a('walk','to','signpost'));s=go(s,a('walk','to','lower_bend'));
 s=go(s,a('walk','to','overlook'));s=go(s,a('inspect','clueId','distant_symbol'));
 s=go(s,q('place','view','fence_view'));
 s=go(s,q('compare'));
 assert.equal(view(s).sightlineBoard.compared,false);
 s=go(s,q('place','light','fence_view'));
 s=go(s,q('place','view','overlook'));
 s=go(s,q('compare'));
 assert.equal(view(s).sightlineBoard.compared,true);
 assert.match(view(s).sightlineBoard.feedback,/NOT DONE/);
 assert.equal(view(s).sightlineBoard.realCheckDone,false);
 assert.equal(view(s).upperHillClosed,true);
 assert.deepEqual(view(s).canonicalEvents,[]);assert.deepEqual(view(s).unlocks,[]);
 assert.deepEqual(replay(s.history),s);
 const bad=structuredClone(s);bad.sightlineBoard.compared=false;
 assert.equal(restore(bad),null);
 assert.equal(can(s,q('place','light','upper_closed')),false);
 assert.equal(can(s,{scene:'sightline',type:'compare',approved:true}),false);
 s=go(s,q('remove','view'));
 assert.equal(view(s).sightlineBoard.compared,false);
 assert.deepEqual(go(s,n('restart')).sightlineBoard,fresh().sightlineBoard);
});
test('restart remains possible at action cap',()=>{
 let s=complete();
 while(s.history.length<MAX_ACTIONS)s=go(s,n(view(s).screen==='hill'?'lantern':'hill'));
 assert.equal(can(s,n('restart')),true);
 assert.equal(can(s,n(view(s).screen==='hill'?'lantern':'hill')),false);
 s=go(s,n('restart'));assert.deepEqual(s,fresh());
});

test('E09 child moves two inspected ground pins, corrects mistakes, and cannot invent a closure cause',()=>{
 const g=(type,clue,at)=>type==='compare'?{scene:'ground',type}:
  type==='remove'?{scene:'ground',type,clue}:{scene:'ground',type,clue,at};
 let s=go(fresh(),a('start'));
 assert.equal(can(s,g('place','disturbed_ground','fence_view')),false);
 s=go(s,a('walk','to','signpost'));
 s=go(s,a('walk','to','fence_view'));
 s=go(s,a('inspect','clueId','disturbed_ground'));
 s=go(s,g('place','disturbed_ground','lower_bend'));
 assert.equal(view(s).groundBoard.placements.disturbed_ground,'lower_bend');
 assert.equal(can(s,g('compare')),false,'need both firsthand inspections');
 s=go(s,a('walk','to','signpost'));s=go(s,a('walk','to','lower_bend'));
 s=go(s,a('inspect','clueId','runoff_marks'));
 s=go(s,g('place','runoff_marks','fence_view'));
 s=go(s,g('compare'));
 assert.equal(view(s).groundBoard.compared,false,'two incorrect pins do not compare');
 s=go(s,g('place','disturbed_ground','fence_view'));
 s=go(s,g('place','runoff_marks','lower_bend'));
 s=go(s,g('compare'));
 assert.equal(view(s).groundBoard.compared,true);
 assert.equal(view(s).groundBoard.realCauseKnown,false);
 assert.match(view(s).groundBoard.feedback,/UNKNOWN/);
 assert.deepEqual(replay(s.history),s);
 const forged=structuredClone(s);forged.groundBoard.compared=false;
 assert.equal(restore(forged),null,'tampered result cannot be replayed');
 assert.equal(can(s,{scene:'ground',type:'place',clue:'runoff_marks',at:'upper_closed'}),false);
 s=go(s,g('remove','runoff_marks'));
 assert.equal(view(s).groundBoard.compared,false,'moving a pin revokes comparison');
 s=go(s,n('restart'));
 assert.deepEqual(s.groundBoard,fresh().groundBoard);
});

import {paperReaction} from '../e09-scene/paper-reaction.mjs';

test('E09 PAPER dialogue and Chronicle follow child ground revision, replay and restart',()=>{
 const ground=(type,clue,at)=>({scene:'ground',type,clue,at});
 let s=go(fresh(),a('start'));
 assert.equal(paperReaction(s).chronicle.includes('Milo moved a misplaced pin'),false);
 for(const x of [a('walk','to','signpost'),a('inspect','clueId','boundary_sign'),
  a('walk','to','fence_view'),a('inspect','clueId','disturbed_ground'),
  a('walk','to','upper_closed'),a('walk','to','signpost'),
  a('walk','to','lower_bend'),a('inspect','clueId','runoff_marks')])s=go(s,x);
 s=go(s,ground('place','disturbed_ground','lower_bend'));
 assert.match(paperReaction(s).line,/I can move this PAPER pin/);
 assert.doesNotMatch(paperReaction(s).chronicle,/moved a misplaced pin/);
 s=go(s,ground('place','disturbed_ground','fence_view'));
 assert.match(paperReaction(s).line,/where I looked/);
 s=go(s,ground('place','runoff_marks','lower_bend'));
 s=go(s,{scene:'ground',type:'compare'});
 assert.match(paperReaction(s).line,/still do not know the cause/);
 assert.match(paperReaction(s).chronicle,/moved a misplaced pin/);
 assert.match(paperReaction(s).chronicle,/cause and date remain UNKNOWN/);
 assert.match(paperReaction(s).chronicle,/stopped at the fence/);
 for(const x of [a('walk','to','overlook'),a('inspect','clueId','distant_symbol'),
  a('mark','edgeId','steps_base:signpost'),a('mark','edgeId','signpost:lower_bend'),
  a('mark','edgeId','lower_bend:overlook'),a('check-route'),
  a('compare-symbol'),a('review'),a('finish-preview')])s=go(s,x);
 const earned=paperReaction(s);
 assert.match(earned.chronicle,/connected lower MODEL route/);
 assert.match(earned.chronicle,/place name is UNKNOWN/);
 assert.match(earned.chronicle,/E10 NOT UNLOCKED/);
 assert.deepEqual(paperReaction(replay(s.history)),earned);
 assert.deepEqual(paperReaction(restore(structuredClone(s))),earned);
 s=go(s,n('lantern'));assert.equal(paperReaction(s).chronicle,earned.chronicle);
 assert.equal(paperReaction(go(s,n('restart'))).chronicle.includes('moved a misplaced pin'),false);
 const forged=structuredClone(s);forged.rights.push('hill-access');
 assert.equal(paperReaction(forged),null);
});

test('E09 future check dialogue requires child-pinned questions and remains NOT DONE',()=>{
 const q=(type,question,at)=>({scene:'sightline',type,question,at});
 let s=go(fresh(),a('start'));
 for(const x of [a('walk','to','signpost'),a('inspect','clueId','boundary_sign'),
  a('walk','to','fence_view'),a('inspect','clueId','disturbed_ground')])s=go(s,x);
 s=go(s,q('place','light','overlook'));
 assert.match(paperReaction(s).line,/question needs another place/);
 s=go(s,q('place','light','fence_view'));
 for(const x of [a('walk','to','signpost'),a('walk','to','lower_bend'),
  a('walk','to','overlook'),a('inspect','clueId','distant_symbol')])s=go(s,x);
 s=go(s,q('place','view','overlook'));
 s=go(s,{scene:'sightline',type:'compare'});
 assert.match(paperReaction(s).line,/Both checks are NOT DONE/);
 assert.match(paperReaction(s).chronicle,/future PAPER questions — NOT DONE/);
 assert.deepEqual(paperReaction(replay(s.history)),paperReaction(s));
 s=go(s,{scene:'sightline',type:'remove',question:'view'});
 assert.doesNotMatch(paperReaction(s).chronicle,/future PAPER questions — NOT DONE/);
});

test('E09 route gap earns distinct Finn/Nia feedback and replayed PAPER Chronicle',()=>{
 let s=go(fresh(),a('start'));
 for(const x of [a('walk','to','signpost'),a('walk','to','lower_bend'),
  a('walk','to','overlook'),a('mark','edgeId','steps_base:signpost'),
  a('mark','edgeId','lower_bend:overlook'),a('check-route')])s=go(s,x);
 assert.equal(paperReaction(s).speaker,'Finn');
 assert.match(paperReaction(s).line,/gap in our PAPER sketch/);
 s=go(s,a('mark','edgeId','signpost:lower_bend'));
 s=go(s,a('check-route'));
 assert.equal(paperReaction(s).speaker,'Nia');
 assert.match(paperReaction(s).line,/missing link/);
 assert.match(paperReaction(s).chronicle,/found a gap, revised his PAPER sketch/);
 assert.deepEqual(paperReaction(replay(s.history)),paperReaction(s));
 assert.deepEqual(paperReaction(restore(structuredClone(s))),paperReaction(s));
 assert.deepEqual(view(s).canonicalEvents,[]);
 assert.equal(view(s).e10Unlocked,false);
 s=go(s,n('restart'));
 assert.doesNotMatch(paperReaction(s).chronicle,/revised his PAPER sketch/);
});
