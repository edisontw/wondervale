import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch} from '../engine/s01e11-authoring-prototype.mjs';
import {paperRoleWalk,dispatchRoleWalk} from '../e11-scene/role-walk.mjs';
function ready(){
 let s=fresh();
 const actions=[
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
 ];
 for(const a of actions)s=dispatch(s,a);
 return s;
}
test('child walks both simulated visitors on FIRST and NOW; provisional Chronicle only',()=>{
 const s=ready();let h=[];
 const act=a=>{h=dispatchRoleWalk(s,h,a);};
 assert.equal(paperRoleWalk(fresh(),[]),null);
 act({type:'choose',stage:'first',role:'quiet_reader'});
 act({type:'step',to:'0,0'});
 act({type:'step',to:'0,1'}); // occupied quiet seat: no teleport
 assert.equal(paperRoleWalk(s,h).position,'0,0');
 assert.equal(paperRoleWalk(s,h).blocked,1);
 act({type:'check'});
 assert.match(paperRoleWalk(s,h).feedback,/Walk closer/);
 act({type:'step',to:'1,0'});
 act({type:'step',to:'1,1'});
 act({type:'check'});
 assert.equal(paperRoleWalk(s,h).visits['first:quiet_reader'].passed,false);
 for(const [stage,role,steps] of [
  ['first','activity_group',['1,1','1,2']],
  ['now','quiet_reader',['1,1']],
  ['now','activity_group',['1,1']]
 ]){
  act({type:'choose',stage,role});
  for(const to of steps)act({type:'step',to});
  act({type:'check'});
 }
 const p=paperRoleWalk(s,h);
 assert.equal(p.complete,true);
 assert.match(p.chronicle,/FIRST quiet RETRY, group PASS → NOW quiet PASS, group PASS/);
 assert.match(p.chronicle,/UNKNOWN/);
 assert.deepEqual(p.canonicalEvents,[]);
 assert.deepEqual(p.unlocks,[]);
 assert.equal(p.realAccess,false);
 assert.equal(p.finished,false);
 assert.equal(paperRoleWalk({...s,rights:['approved']},h),null);
 assert.equal(paperRoleWalk(dispatch(s,{type:'place',tokenId:'activity',cells:['2,2']}),h),null);
 assert.equal(paperRoleWalk(dispatch(s,{type:'reset'}),h),null);
});
test('unknown commands, forged result, teleport, closed cell and overlong history fail closed',()=>{
 const s=ready();let h=[];
 const act=a=>{h=dispatchRoleWalk(s,h,a);};
 act({type:'choose',stage:'first',role:'quiet_reader'});
 const n=h.length;
 act({type:'step',to:'2,2'});act({type:'step',to:'0,3'});
 act({type:'check',passed:true});act({type:'choose',stage:'now',role:'unknown'});
 assert.equal(h.length,n);
 assert.equal(paperRoleWalk(s,[...h,{type:'check',passed:true}]),null);
 assert.equal(paperRoleWalk(s,Array(81).fill({type:'check'})),null);
 assert.equal(paperRoleWalk(s,[{type:'choose',stage:'first',role:'quiet_reader',rights:true}]),null);
});
