import test from 'node:test';
import assert from 'node:assert/strict';
import * as E06 from '../e06-scene/scene-model.mjs';
import * as E07 from '../e07-scene/scene-model.mjs';
import * as E11 from '../engine/s01e11-authoring-prototype.mjs';
import {dispatchRoleWalk,paperRoleWalk} from '../e11-scene/role-walk.mjs';
import {paperSharedUse,dispatchSharedUse} from '../e11-scene/shared-use-followthrough.mjs';
import {paperWorldAtlas} from '../e11-scene/world-atlas.mjs';
import * as E10 from '../authoring-labs/unnamed-story-model.mjs';

const g=(type,value)=>({scene:'garden',action:value===undefined?{type}:{type,value}});
const care=(type,value)=>value===undefined?{scene:'care',type}:{scene:'care',type,value};
const story=(type,value)=>({scene:'story',action:value===undefined?{type}:{type,value}});
const walk=(type,value)=>({scene:'walkthrough',type,...(value===undefined?{}:{value})});
function gardens(){
 let s=E06.fresh();
 for(const a of [g('start'),g('inspect','present-bed'),g('walk','slope'),g('inspect','slope'),
  g('walk','model-tray'),g('run'),g('weather','rain'),g('run'),g('channel','blocked'),
  g('run'),g('compare'),g('enter'),g('inspect','runoff-trace'),g('walk','public-path'),
  g('inspect','public-path'),g('walk','runoff-channel'),g('place','runoff-channel'),
  g('check'),g('walk','raised-pocket'),g('place','raised-pocket'),g('check'),
  g('think','keep-path'),g('finish'),care('choose','heavy'),care('test'),
  care('choose','gentle'),care('test'),care('compare')]){
  assert.equal(E06.can(s,a),true,JSON.stringify(a));s=E06.dispatch(s,a);
 }return s;
}
function connector(){
 let s=E07.fresh();
 for(const a of [story('start'),story('walk','shared-path'),story('inspect','shared-path'),
  story('walk','channel'),story('inspect','channel'),story('walk','workbench'),
  story('trial','milo'),story('trial','resident'),story('trial','water'),
  story('place','path-clear-water-blocked'),story('trial','milo'),
  story('trial','resident'),story('trial','water'),story('place','side-offset'),
  story('trial','water'),story('trial','milo'),story('trial','resident'),
  story('compare'),story('finish'),walk('start'),walk('move','crossing'),
  walk('inspect','crossing'),walk('other-start'),walk('other-step'),
  walk('other-step'),walk('move','water-edge'),walk('inspect','water-edge'),
  walk('move','steps-base'),walk('review')]){
  assert.equal(E07.can(s,a),true,JSON.stringify(a));s=E07.dispatch(s,a);
 }return s;
}
function layout(){
 let s=E11.fresh();
 for(const a of [
  {type:'place',tokenId:'access',cells:['1,1','1,2']},
  {type:'place',tokenId:'quiet',cells:['0,1']},
  {type:'place',tokenId:'activity',cells:['0,2']},
  {type:'test-user',userId:'quiet_reader'},
  {type:'test-user',userId:'activity_group'},
  {type:'snapshot-trial'},
  {type:'place',tokenId:'activity',cells:['2,1']},
  {type:'test-user',userId:'quiet_reader'},
  {type:'test-user',userId:'activity_group'},
  {type:'snapshot-trial'},
  {type:'compare-trials',first:'trial-1',second:'trial-2'}
 ])s=E11.dispatch(s,a);
 return s;
}
function walked(s){
 let h=[];
 for(const [phase,role,cells] of [
  ['first','quiet_reader',['1,1']],
  ['first','activity_group',['1,1','1,2']],
  ['now','quiet_reader',['1,1']],
  ['now','activity_group',['1,1']]
 ]){
  h=dispatchRoleWalk(s,h,{type:'choose',stage:phase,role});
  for(const to of cells)h=dispatchRoleWalk(s,h,{type:'step',to});
  h=dispatchRoleWalk(s,h,{type:'check'});
 }
 assert.equal(paperRoleWalk(s,h).complete,true);
 return h;
}
test('E11 child compares FIRST blocked and NOW open with two replay-verified earlier models',()=>{
 const e11=layout(),h=walked(e11),upstream={e06:gardens(),e07:connector()};
 let actions=[];
 const act=a=>{actions=dispatchSharedUse(e11,h,upstream,actions,a);};
 const initial=paperSharedUse(e11,h,upstream,actions);
 assert.equal(initial.selected.catchment,3);
 assert.equal(initial.selected.overlap.length,2);
 act({type:'record'});
 act({type:'choose',phase:'now',channel:'open'});
 let view=paperSharedUse(e11,h,upstream,actions);
 assert.equal(view.selected.catchment,1);
 assert.equal(view.selected.overlap.length,0);
 assert.equal(view.compared,false);
 act({type:'record'});act({type:'compare'});
 view=paperSharedUse(e11,h,upstream,actions);
 assert.equal(view.first.quietPass,false);
 assert.equal(view.first.groupPass,true);
 assert.equal(view.now.quietPass,true);
 assert.equal(view.now.groupPass,true);
 assert.equal(view.first.overlaps,2);
 assert.equal(view.now.overlaps,0);
 assert.equal(view.changed,true);
 assert.equal(view.compared,true);
 assert.match(view.chronicle,/FIRST 3\/3 rain marks, 2 connector overlap cells; NOW 1\/3 rain marks, 0 overlaps/);
 assert.match(view.chronicle,/INDEPENDENT PAPER checks/);
 assert.match(view.chronicle,/UNKNOWN/);
 assert.deepEqual(view.canonicalEvents,[]);
 assert.deepEqual(view.unlocks,[]);
 assert.equal(view.realDrainageVerified,false);
 assert.equal(view.realAccessApproved,false);
 assert.equal(view.persistentSave,false);
 assert.deepEqual(paperSharedUse(e11,h,{
  e06:E06.replay(upstream.e06.history),e07:E07.replay(upstream.e07.history)
 },actions),view);
});
test('missing or forged upstream and visitor evidence fail closed, retries do not grant rights',()=>{
 const e11=layout(),h=walked(e11),upstream={e06:gardens(),e07:connector()};
 assert.equal(paperSharedUse(e11,[],upstream),null);
 assert.equal(paperSharedUse(e11,h,null),null);
 assert.equal(paperSharedUse(e11,h,{e06:E06.fresh(),e07:upstream.e07}),null);
 assert.equal(paperSharedUse(e11,h,{e06:upstream.e06,e07:E07.fresh()}),null);
 assert.equal(paperSharedUse({...e11,rights:['approved']},h,upstream),null);
 assert.equal(paperSharedUse(e11,[...h,{type:'check',passed:true}],upstream),null);
 assert.equal(paperSharedUse(e11,h,{...upstream,e06:{...upstream.e06,rights:['approved']}}),null);
 assert.equal(paperSharedUse(e11,h,{...upstream,e07:{...upstream.e07,unlocks:['opened']}}),null);
 assert.equal(paperSharedUse(E11.dispatch(e11,{type:'reset'}),h,upstream),null);
 const initial=paperSharedUse(e11,h,upstream);
 assert.equal(initial.compared,false);
 assert.equal(paperSharedUse(e11,h,upstream,[{type:'record',rights:true}]),null);
 assert.equal(paperSharedUse(e11,h,upstream,[{type:'choose',phase:'now',channel:'fake'}]),null);
 assert.equal(paperSharedUse(e11,h,upstream,[{type:'choose',phase:'now',channel:'open'},{type:'record'}]),null);
 assert.equal(paperSharedUse(e11,h,upstream,[{type:'compare'}]),null);
 assert.equal(paperSharedUse(e11,h,upstream,Array(9).fill({type:'record'})),null);
 let actions=dispatchSharedUse(e11,h,upstream,[],{type:'record'});
 assert.equal(actions.length,1);
 assert.deepEqual(dispatchSharedUse(e11,h,upstream,actions,{type:'record'}),actions);
 assert.deepEqual(dispatchSharedUse(e11,h,upstream,actions,{type:'open-real-route'}),actions);
});

function courtyard(){
 let s=E10.dispatch(E10.fresh(),{type:'start'});
 for(const a of [
  {type:'compare-symbol'},{type:'walk',to:'stone_edge'},
  {type:'inspect',traceId:'surface'},{type:'suggest',traceId:'surface',useTag:'passing'},
  {type:'revise',traceId:'surface',oldTag:'passing',newTag:'resting'},
  {type:'walk',to:'quiet_corner'},{type:'hear',needId:'quiet'},
  {type:'place',needId:'quiet',slot:'shared'},
  {type:'walk',to:'meeting_edge'},{type:'hear',needId:'activity'},
  {type:'place',needId:'activity',slot:'shared'},
  {type:'test-one-slot'},{type:'place',needId:'quiet',slot:'left'},
  {type:'place',needId:'activity',slot:'right'},
  {type:'walk',to:'notice_wall'},{type:'inspect',traceId:'holes'},
  {type:'suggest',traceId:'holes',useTag:'display'},
  {type:'check-source'},{type:'review-tradeoff'},
  {type:'review'},{type:'finish-paper'}
 ]){assert.equal(E10.can(s,a),true,JSON.stringify(a));s=E10.dispatch(s,a);}
 return s;
}

test('E11 three-place FIRST/NOW PAPER atlas is child-earned and source-bound',()=>{
 const e11=layout(),h=walked(e11),u={e06:gardens(),e07:connector()},e10=courtyard();
 let actions=[];
 assert.equal(paperWorldAtlas(e11,h,u,actions,e10),null,'no atlas before child comparison');
 for(const a of [
  {type:'record'},{type:'choose',phase:'now',channel:'open'},
  {type:'record'},{type:'compare'}
 ])actions=dispatchSharedUse(e11,h,u,actions,a);
 const atlas=paperWorldAtlas(e11,h,u,actions,e10);
 assert.ok(atlas);
 assert.deepEqual(atlas.boards.first.map(p=>p.id),['garden','connector','courtyard']);
 assert.deepEqual(atlas.boards.now.map(p=>p.id),['garden','connector','courtyard']);
 assert.equal(atlas.boards.first[0].mark,'paper-marker');
 assert.equal(atlas.boards.now[0].mark,'paper-sprout');
 assert.match(atlas.boards.first[1].title,/2 connector overlap/);
 assert.match(atlas.boards.now[1].title,/0 connector overlap/);
 assert.match(atlas.boards.first[2].title,/overlap/);
 assert.match(atlas.boards.now[2].title,/separated/);
 assert.match(atlas.chronicle,/INDEPENDENT/);
 assert.match(atlas.chronicle,/UNKNOWN/);
 assert.doesNotMatch(atlas.chronicle,/\bCommon\b/);
 assert.deepEqual(atlas.canonicalEvents,[]);
 assert.deepEqual(atlas.unlocks,[]);
 assert.equal(atlas.realRouteOpen,false);
 assert.equal(atlas.persistentSave,false);
 assert.deepEqual(paperWorldAtlas(e11,h,{
  e06:E06.replay(u.e06.history),e07:E07.replay(u.e07.history)
 },actions,E10.replay(e10.history)),atlas);
 assert.equal(paperWorldAtlas(e11,h,u,actions,null),null);
 assert.equal(paperWorldAtlas(e11,h,u,actions,E10.fresh()),null);
 assert.equal(paperWorldAtlas(e11,[],u,actions,e10),null);
 assert.equal(paperWorldAtlas(e11,h,{...u,e06:E06.fresh()},actions,e10),null);
 assert.equal(paperWorldAtlas(e11,h,{...u,e07:E07.fresh()},actions,e10),null);
 assert.equal(paperWorldAtlas(e11,h,u,[{type:'compare'}],e10),null);
 assert.equal(paperWorldAtlas(E11.dispatch(e11,{type:'reset'}),h,u,actions,e10),null);
 assert.equal(paperWorldAtlas(e11,h,u,actions,{...e10,rights:['open']}),null);
 assert.equal(paperWorldAtlas(e11,h,u,actions,e10,{rights:['open']}),null);
});
