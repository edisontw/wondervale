import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,dispatch,project} from '../authoring-labs/world-revisit.mjs';
import {visualTiles,PAPER_PIECES} from '../authoring-labs/paper-world-visual.mjs';
const doIt=(s,type,value)=>dispatch(s,value===undefined?{type}:{type,value});
const tile=(s,id)=>visualTiles(project(s)).find(x=>x.id===id);
test('paper atlas has eight distinct visual before/after models without historical or access claims',()=>{
 assert.equal(Object.keys(PAPER_PIECES).length,8);
 for(const [id,stages] of Object.entries(PAPER_PIECES)){
  assert.notDeepEqual(stages.before,stages.after,id);
  for(const pieces of Object.values(stages)){
   for(const [kind,label,col,row,span] of pieces){
    assert.match(kind,/^[a-z-]+$/);assert.ok(label.length>0);
    assert.ok(col>=1&&row>=1&&col+span<=5&&row<=3);
   }
  }
 }
 const s=fresh(),tiles=visualTiles(project(s));
 assert.equal(tiles.length,8);
 assert.equal(tiles.filter(x=>x.visible).length,1);
 assert.equal(tile(s,'needs').stage,'locked');
 assert.deepEqual(tile(s,'needs').pieces,[]);
 assert.equal(tile(s,'station').stage,'before');
 assert.equal(JSON.stringify(tiles).includes('Common'),false);
});
test('child station and garden actions change atlas; BEFORE, revisit and upstream revision remain truthful',()=>{
 let s=fresh();
 s=doIt(s,'rotate','side-a');s=doIt(s,'shift-table','near-wall');s=doIt(s,'try-fit');
 assert.equal(tile(s,'station').stage,'after');
 assert.ok(tile(s,'station').pieces.some(x=>x.label==='Clear way'));
 s=doIt(s,'visit','current');
 assert.equal(tile(s,'current').stage,'before');
 s=doIt(s,'rain','rain');s=doIt(s,'channel','open');s=doIt(s,'run-tray');
 assert.equal(tile(s,'current').stage,'after');
 assert.ok(tile(s,'current').pieces.some(x=>x.label==='Rain tray'));
 s=doIt(s,'look','before');
 assert.equal(tile(s,'station').stage,'before');
 assert.equal(tile(s,'current').stage,'before');
 s=doIt(s,'look','now');
 assert.equal(tile(s,'current').stage,'after');
 s=doIt(s,'visit','station');
 assert.equal(tile(s,'current').stage,'after');
 s=doIt(s,'rotate','side-b');
 assert.equal(tile(s,'station').stage,'before');
 assert.equal(tile(s,'current').stage,'locked');
 assert.deepEqual(tile(s,'current').pieces,[]);
 assert.deepEqual(project(s).canonicalEvents,[]);
 assert.deepEqual(project(s).unlocks,[]);
 assert.equal(project(s).upperHillClosed,true);
 assert.equal(project(s).seasonFinished,false);
});
test('the atlas rejects invented locations and malformed projections',()=>{
 assert.throws(()=>visualTiles({view:'now',progress:[{id:'common',available:true,done:true}]}),/Unknown/);
 assert.throws(()=>visualTiles({view:'maybe',progress:[]}),/validated/);
});
