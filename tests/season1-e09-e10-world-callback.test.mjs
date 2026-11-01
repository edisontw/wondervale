import test from 'node:test';
import assert from 'node:assert/strict';
import * as E09 from '../e09-scene/scene-model.mjs';
import {hillWorld} from '../e10-scene/hill-world.mjs';
const a=(type,key,value)=>({scene:'story',action:key?{type,[key]:value}:{type}});
function completedHill(){
 let s=E09.fresh();
 for(const x of [a('start'),a('inspect','clueId','entry_note'),
  a('walk','to','signpost'),a('inspect','clueId','boundary_sign'),
  a('walk','to','fence_view'),a('inspect','clueId','disturbed_ground'),
  a('walk','to','upper_closed'),a('walk','to','signpost'),
  a('walk','to','lower_bend'),a('inspect','clueId','runoff_marks'),
  a('walk','to','overlook'),a('inspect','clueId','distant_symbol'),
  a('mark','edgeId','steps_base:signpost'),
  a('mark','edgeId','signpost:lower_bend'),
  a('mark','edgeId','lower_bend:overlook'),a('check-route'),
  a('compare-symbol'),a('review'),a('finish-preview')]){
  assert.equal(E09.can(s,x),true,JSON.stringify(x));
  s=E09.dispatch(s,x);
 }return s;
}
test('E09 inspected and walked PAPER route visibly changes E10 FIRST/NOW sketch',()=>{
 const s=completedHill(),p=hillWorld(s);
 assert.ok(p);
 assert.deepEqual(p.first,{markedEdgeIds:[],clueIds:[]});
 assert.deepEqual(p.now.markedEdgeIds,[
  'steps_base:signpost','signpost:lower_bend','lower_bend:overlook']);
 assert.equal(p.now.clueIds.length,5);
 assert.equal(p.walkedEdgeIds.length,4);
 assert.equal(p.closedEdgeId,'fence_view:upper_closed');
 assert.equal(p.now.markedEdgeIds.includes(p.closedEdgeId),false);
 assert.equal(p.upperHillClosed,true);
 assert.equal(p.realAccessApproved,false);
 assert.equal(p.realTerrainVerified,false);
 assert.equal(p.historicalDate,null);assert.equal(p.placeName,null);
 assert.deepEqual(p.canonicalEvents,[]);assert.deepEqual(p.unlocks,[]);
 assert.deepEqual(p.rights,[]);
 assert.deepEqual(hillWorld(E09.replay(s.history)),p);
});
test('unearned, reset, forged, or partial E09 never draws E10 route outcome',()=>{
 const s=completedHill();
 assert.equal(hillWorld(null),null);
 assert.equal(hillWorld(E09.fresh()),null);
 assert.equal(hillWorld(E09.replay(s.history.slice(0,-1))),null);
 assert.equal(hillWorld(E09.dispatch(s,{scene:'nav',type:'restart'})),null);
 const forged=structuredClone(s);forged.rights.push('hill-access');
 assert.equal(hillWorld(forged),null);
 const tampered=structuredClone(s);tampered.story.hill.markedEdges.push('fence_view:upper_closed');
 assert.equal(hillWorld(tampered),null);
 const invented=structuredClone(s);invented.unlocks.push('E10');
 assert.equal(hillWorld(invented),null);
});
