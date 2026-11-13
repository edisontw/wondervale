import assert from 'node:assert/strict';
import * as E10 from '../authoring-labs/unnamed-story-model.mjs';
import {replayEarnedZones as view,dispatchEarnedZones as dispatch} from '../e11-scene/e10-earned-two-needs.mjs';
const steps=[['start',{}],['compare-symbol',{}],['walk',{to:'stone_edge'}],['inspect',{traceId:'surface'}],['suggest',{traceId:'surface',useTag:'passing'}],['revise',{traceId:'surface',oldTag:'passing',newTag:'resting'}],['walk',{to:'quiet_corner'}],['hear',{needId:'quiet'}],['place',{needId:'quiet',slot:'shared'}],['walk',{to:'meeting_edge'}],['hear',{needId:'activity'}],['place',{needId:'activity',slot:'shared'}],['test-one-slot',{}],['place',{needId:'quiet',slot:'left'}],['place',{needId:'activity',slot:'right'}],['walk',{to:'notice_wall'}],['inspect',{traceId:'holes'}],['suggest',{traceId:'holes',useTag:'display'}],['check-source',{}],['review-tradeoff',{}],['review',{}],['finish-paper',{}]];
let s=E10.fresh();for(const [type,extra] of steps){assert.equal(E10.can(s,{type,...extra}),true,type);s=E10.dispatch(s,{type,...extra});}
const source=JSON.parse(JSON.stringify(s.history));
assert.equal(view([],[]),null);assert.equal(view(source.slice(0,-1),[]),null);assert.equal(view([{type:'finish-paper'}],[]),null);assert.equal(view([...source,{type:'grant-rights'}],[]),null);
let h=[];h=dispatch(source,h,{type:'place',need:'quiet',zone:'near'});h=dispatch(source,h,{type:'place',need:'making',zone:'far'});h=dispatch(source,h,{type:'try'});assert.equal(view(source,h).fits,false);
h=dispatch(source,h,{type:'place',need:'quiet',zone:'far'});h=dispatch(source,h,{type:'place',need:'making',zone:'near'});h=dispatch(source,h,{type:'try'});assert.equal(view(source,h).fits,true);
assert.match(view(source,h).chronicle,/PAPER Chronicle/);assert.equal(view(source,h.slice(0,-1)).chronicle,null);assert.equal(view([],h),null);assert.equal(view(source,[...h,{type:'open-common'}]),null);assert.equal(dispatch(source,h,{type:'grant-rights'}),null);assert.deepEqual(view(source,h).rights,[]);assert.equal(view(source,h).northHillClosed,true);
console.log('E10-earned E11 zones provenance/replay/undo/forgery PASS');
