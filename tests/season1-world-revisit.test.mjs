import test from 'node:test';
import assert from 'node:assert/strict';
import * as World from '../authoring-labs/world-revisit.mjs';
const cmd=(type,value)=>value===undefined?{type}:{type,value};
function doAction(state,type,value){
 const next=World.dispatch(state,cmd(type,value));
 assert.equal(next.history.length,state.history.length+1,'child action must be accepted: '+type+'/'+value);
 return next;
}
function done(state,id){assert.equal(state.models[id].done,true,id+' must show a tested paper change');}
function journey(){
 let s=World.fresh();
 assert.deepEqual(World.project(s).canonicalEvents,[]);
 assert.equal(World.project(s).progress.filter(x=>x.available).length,1);
 s=doAction(s,'try-fit');
 assert.match(s.feedback,/Not yet/);
 s=doAction(s,'rotate','side-a');s=doAction(s,'shift-table','near-wall');
 s=doAction(s,'try-fit');done(s,'station');
 s=doAction(s,'visit','current');s=doAction(s,'run-tray');
 assert.match(s.feedback,/Revise and retry/);
 s=doAction(s,'rain','rain');s=doAction(s,'channel','open');
 s=doAction(s,'run-tray');done(s,'current');
 s=doAction(s,'visit','lower');s=doAction(s,'test-pocket');
 s=doAction(s,'move-pocket','raised');s=doAction(s,'test-pocket');done(s,'lower');
 s=doAction(s,'visit','connector');s=doAction(s,'test-passage');
 s=doAction(s,'move-bridge','clear');s=doAction(s,'test-passage');done(s,'connector');
 s=doAction(s,'visit','steps');s=doAction(s,'compare-views');
 s=doAction(s,'lights','on');s=doAction(s,'look-from','base');
 s=doAction(s,'look-from','side');s=doAction(s,'compare-views');done(s,'steps');
 s=doAction(s,'visit','hill');s=doAction(s,'review-hill');
 s=doAction(s,'inspect-sign');s=doAction(s,'try-closed');
 s=doAction(s,'mark-lower');s=doAction(s,'review-hill');done(s,'hill');
 s=doAction(s,'visit','needs');s=doAction(s,'review-needs');
 s=doAction(s,'hear','quiet');s=doAction(s,'hear','activity');
 s=doAction(s,'separate-needs','separate');s=doAction(s,'review-needs');done(s,'needs');
 s=doAction(s,'visit','layout');s=doAction(s,'test-layout');
 s=doAction(s,'move-layout','clear');s=doAction(s,'test-layout');done(s,'layout');
 return s;
}
test('Milo revisits eight PAPER places with nonpunitive wrong trials and accumulated visible changes',()=>{
 let s=journey(),p=World.project(s);
 assert.equal(p.completed,8);
 assert.equal(p.paperNotes.length,8);
 assert.equal(p.seasonFinished,false);
 assert.equal(p.upperHillClosed,true);
 assert.equal(p.actualHistoricalDate,null);
 assert.equal(p.actualName,null);
 assert.equal(s.models.steps.lights,'on');
 assert.equal(s.models.hill.closedAttempt,true);
 assert.equal(s.models.current.done,true);
 assert.deepEqual(s.canonicalEvents,[]);assert.deepEqual(s.unlocks,[]);
 assert.deepEqual(s.historicalClaims,[]);assert.deepEqual(s.rights,[]);
 s=doAction(s,'visit','station');
 s=doAction(s,'look','before');
 assert.match(World.project(s).current.before,/walkway/);
 s=doAction(s,'look','now');
 assert.match(World.project(s).current.now,/Map Room/);
 s=doAction(s,'visit','lower');
 assert.match(World.project(s).current.now,/seed marker/);
 assert.equal(World.project(s).completed,8);
 assert.deepEqual(World.replay(s.history),s);
 assert.deepEqual(World.restore(structuredClone(s)),s);
});
test('paper recap cannot bypass E04, closed hill, history, canon or late-arc locations',()=>{
 const s=World.fresh();
 for(const a of [
  cmd('visit','layout'),cmd('visit','needs'),cmd('visit','e04'),
  {type:'visit',value:'layout',canonical:true},
  {type:'try-fit',sourceApproved:true},
  {type:'unlock',value:'e11'},cmd('visit','common'),
  {type:'review-hill',opened:true},
  {type:'look',value:'now',canonicalEvents:['e11']},
  {type:'__proto__',value:'hack'}
 ])assert.deepEqual(World.dispatch(s,a),s);
 assert.equal(World.replay([{type:'visit',value:'layout'}]),null);
 assert.equal(World.replay([{type:'try-fit',sourceApproved:true}]),null);
 assert.equal(World.replay(Array(181).fill({type:'try-fit'})),null);
 assert.equal(World.project(s).progress.find(x=>x.id==='needs').available,false);
});
test('upstream revision invalidates downstream paper trials; strict replay detects tampering',()=>{
 let s=journey();
 s=doAction(s,'visit','station');
 s=doAction(s,'rotate','side-b');
 assert.equal(World.project(s).completed,0);
 assert.equal(s.models.current.done,false);
 assert.equal(s.models.layout.done,false);
 assert.equal(World.project(s).progress.find(x=>x.id==='layout').available,false);
 assert.deepEqual(World.dispatch(s,cmd('visit','layout')),s);
 assert.equal(World.restore({...s,unlocks:['e11']}),null);
 assert.equal(World.restore({...s,canonicalEvents:['finish']}),null);
 assert.equal(World.restore({...s,historicalClaims:['1792']}),null);
 assert.equal(World.restore({...s,rights:['real access']}),null);
 assert.equal(World.restore({...s,models:{...s.models,hill:{...s.models.hill,done:true}}}),null);
 assert.deepEqual(World.replay(s.history),s);
});
