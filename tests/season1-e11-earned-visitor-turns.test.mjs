import assert from 'node:assert/strict';
import * as E10 from '../authoring-labs/unnamed-story-model.mjs';
import {replayEarnedVisitorTurns as view,dispatchEarnedVisitorTurns as dispatch} from '../e11-scene/earned-visitor-turns.mjs';
const steps=[
 ['start',{}],['compare-symbol',{}],['walk',{to:'stone_edge'}],['inspect',{traceId:'surface'}],
 ['suggest',{traceId:'surface',useTag:'passing'}],['revise',{traceId:'surface',oldTag:'passing',newTag:'resting'}],
 ['walk',{to:'quiet_corner'}],['hear',{needId:'quiet'}],['place',{needId:'quiet',slot:'shared'}],
 ['walk',{to:'meeting_edge'}],['hear',{needId:'activity'}],['place',{needId:'activity',slot:'shared'}],
 ['test-one-slot',{}],['place',{needId:'quiet',slot:'left'}],['place',{needId:'activity',slot:'right'}],
 ['walk',{to:'notice_wall'}],['inspect',{traceId:'holes'}],['suggest',{traceId:'holes',useTag:'display'}],
 ['check-source',{}],['review-tradeoff',{}],['review',{}],['finish-paper',{}]
];
let s=E10.fresh();
for(const [type,extra] of steps){assert.equal(E10.can(s,{type,...extra}),true,type);s=E10.dispatch(s,{type,...extra});}
const source=JSON.parse(JSON.stringify(s.history));
assert.equal(view([],[]),null);
assert.equal(view(source.slice(0,-1),[]),null);
assert.equal(view([...source,{type:'grant-rights'}],[]),null);
assert.equal(view([{type:'finish-paper'}],[]),null);
assert.equal(view(source,[{type:'test'}]),null);
let h=[];
h=dispatch(source,h,{type:'place',visitor:'quiet-reader',slot:'first'});
h=dispatch(source,h,{type:'place',visitor:'active-builder',slot:'second'});
h=dispatch(source,h,{type:'test'});
assert.match(view(source,h).note,/Quiet reading first/);
assert.deepEqual(view(source,h).canonicalEvents,[]);
assert.deepEqual(view(source,h).rights,[]);
assert.equal(view(source,h).realAccessApproved,false);
assert.equal(view(source,h).commonRevealed,false);
assert.equal(view(source,h).northHillClosed,true);
assert.deepEqual(view(JSON.parse(JSON.stringify(source)),JSON.parse(JSON.stringify(h))),view(source,h));
assert.equal(view(source,h.slice(0,-1)).note,null);
assert.equal(view(source,[]).note,null);
assert.equal(view(source,[...h,{type:'open-common'}]),null);
assert.equal(dispatch(source,h,{type:'grant-rights'}),null);
assert.equal(view([],h),null); // upstream reset invalidates downstream
console.log('E10-earned E11 visitor turns strict source/replay/reset/forgery PASS');
