import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fresh,dispatch,restore,projection} from '../engine/s01e11-authoring-prototype.mjs';

test('independent E11 scene imports only fictional reducer and has an honest closed gate',()=>{
 const html=readFileSync(new URL('../e11-scene/index.html',import.meta.url),'utf8');
 const js=readFileSync(new URL('../e11-scene/main.mjs',import.meta.url),'utf8');
 assert.match(html,/FICTIONAL PAPER MODEL/);
 assert.match(html,/E10 PAPER needs/);
 assert.match(html,/North Hill/);
 assert.match(html,/id="e11-work" hidden/);
 assert.match(js,/s01e11-authoring-prototype\.mjs/);
 assert.doesNotMatch(js,/localStorage|sessionStorage|fetch\(|common_reopened|season_completed|production-entry/);
 assert.doesNotMatch(html,/href="\/e11\/"/);
});
test('forged production rights never survive the strict E11 replay',()=>{
 const s=fresh();
 const forged={...s,reviewed:true,finished:true,canonicalEvents:['s01e11.season_completed'],unlocks:['common'],rights:['approved']};
 assert.equal(restore(forged),null);
 const safe=dispatch(s,{type:'add-loop-edge',edgeId:'old_north_hill_direct'});
 assert.deepEqual(safe,s);
 const view=projection(safe);
 assert.deepEqual(view.canonicalEvents,[]);
 assert.deepEqual(view.unlocks,[]);
 assert.equal(view.finished,false);
});
