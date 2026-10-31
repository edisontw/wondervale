// Twelve release slots are NOT twelve approved episodes or a season-complete assertion.
// This inventory is paired with real Node/Chromium jobs in the dedicated workflow.
import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {SCENES,HANDOFFS,sceneAudit,handoffAudit} from '../authoring-labs/handoff-contract.mjs';
import {e05ProductionHandoff} from '../engine/s01e05-production-entry.mjs';

const file=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const exists=path=>existsSync(new URL('../'+path,import.meta.url));
const slots=[
 {number:1,id:'e01',episode:'s01e01',location:'Town Square',mode:'canonical-engine',entry:'index.html',browser:'tests/browser-acceptance.mjs'},
 {number:2,id:'e02',episode:'s01e02',location:'Riverside',mode:'canonical-engine',entry:'e02/index.html',browser:'tests/s01e02-browser.mjs'},
 {number:3,id:'e03',episode:'s01e03',location:'Market Lane',mode:'canonical-engine',entry:'e03/index.html',browser:'tests/s01e03-browser.mjs'},
 {number:4,id:'e04',episode:'s01e04',location:'Memories / chronology',mode:'blocked-design',entry:null,browser:null},
 {number:5,id:'e05',episode:'s01e05',location:'Station / Map Room',mode:'paper-only',entry:'e05-scene/index.html',browser:'tests/season1-e05-scene-shell-browser.mjs'},
 {number:6,id:'e06-current',episode:'s01e06',location:'Current Garden',mode:'paper-only',entry:'e06-scene/index.html',browser:'tests/season1-e06-scene-shell-browser.mjs'},
 {number:7,id:'e06-lower',episode:'s01e06',location:'Lower Garden',mode:'paper-only',entry:'e06-scene/index.html',browser:'tests/season1-e06-scene-shell-browser.mjs'},
 {number:8,id:'e07',episode:'s01e07',location:'Finn connector',mode:'paper-only',entry:'e07-scene/index.html',browser:'tests/season1-e07-scene-shell-browser.mjs'},
 {number:9,id:'e08',episode:'s01e08',location:'Lantern Steps',mode:'paper-only',entry:'e08-scene/index.html',browser:'tests/season1-e08-scene-shell-browser.mjs'},
 {number:10,id:'e09',episode:'s01e09',location:'Closed Hill',mode:'paper-only',entry:'e09-scene/index.html',browser:'tests/season1-e09-scene-shell-browser.mjs'},
 {number:11,id:'e10',episode:'s01e10',location:'Unnamed courtyard',mode:'paper-only',entry:'e10-scene/index.html',browser:'tests/season1-e10-scene-shell-browser.mjs'},
 {number:12,id:'e11',episode:'s01e11',location:'Reversible shared-space loop',mode:'paper-only',entry:'e11-scene/index.html',browser:'tests/season1-e11-scene-shell-browser.mjs'}
];

test('twelve planned locations are exactly eleven episodes, E06 has two real spaces',()=>{
 assert.equal(slots.length,12);
 assert.deepEqual(slots.map(s=>s.number),Array.from({length:12},(_,i)=>i+1));
 assert.equal(new Set(slots.map(s=>s.episode)).size,11);
 assert.deepEqual(slots.filter(s=>s.episode==='s01e06').map(s=>s.id),['e06-current','e06-lower']);
 assert.deepEqual(slots.slice(3).map(s=>s.id),SCENES.map(s=>s.id));
 assert.equal(HANDOFFS.length,8);
 assert.equal(slots.filter(s=>s.mode==='canonical-engine').length,3);
 assert.equal(slots.filter(s=>s.mode==='paper-only').length,8);
 assert.equal(slots.filter(s=>s.mode==='blocked-design').length,1);
});

test('every available location has an actual browser entry and a child-journey regression',()=>{
 for(const s of slots.filter(x=>x.entry)){
  assert.ok(exists(s.entry),s.id+' HTML missing');
  assert.ok(exists(s.browser),s.id+' browser journey missing');
 }
 assert.ok(exists('engine/s01e04-chronology.mjs'),'E04 authoring model must remain available for source decisions');
 assert.ok(exists('tests/s01e03-e04-handoff.test.mjs'),'canonical E02/E03 to draft E04 guard must be tested');
 assert.ok(exists('authoring-labs/arc1-hill-unnamed-loop-handoff.html'),'integrated E03-E11 paper rehearsal must exist');
 assert.ok(exists('tests/season1-arc1-hill-unnamed-loop-handoff-browser.mjs'),'integrated browser journey missing');
 const garden=file('e06-scene/index.html');
 assert.match(garden,/id="current-scene"/,'E06 upper garden needs a distinct visible location');
 assert.match(garden,/id="lower-scene"/,'E06 lower garden needs a distinct visible location');
 assert.notEqual(slots[5].location,slots[6].location);
});

test('E04 remains an explicit approval barrier; synthetic E05–E11 never mint release rights',()=>{
 assert.equal(SCENES[0].status,'blocked-design');
 assert.equal(SCENES[0].lab,null);
 assert.equal(e05ProductionHandoff(null,null,{ready:true,phase:'completed',mode:'canonical'}).ready,false);
 for(const s of sceneAudit()){
  assert.equal(s.productionEligible,false,s.id);
  assert.equal(s.canonicalEventIssued,false,s.id);
  assert.equal(s.unlockIssued,false,s.id);
 }
 for(const h of handoffAudit()){
  assert.equal(h.productionEligible,false,h.from+'->'+h.to);
  assert.equal(h.canonicalEventIssued,false);
  assert.equal(h.unlockIssued,false);
 }
 for(const path of ['scripts/package_static.py','scripts/package_e02.py','scripts/package_e03.py']){
  const source=file(path);
  for(const forbidden of ['e05-scene/','e06-scene/','e07-scene/','e08-scene/','e09-scene/','e10-scene/','e11-scene/','arc1-hill-unnamed-loop-handoff.html']){
   assert.equal(source.includes("'"+forbidden),false,path+' must not include '+forbidden);
  }
 }
});

test('write machine-readable scene inventory without falsely claiming browser, deployment or owner PASS',()=>{
 const report={
  kind:'SEASON_1_TWELVE_SCENE_EVIDENCE_INVENTORY',
  caveat:'This Node test checks the inventory and release boundary; browser tests run separately in CI. This is NOT twelve-scene production acceptance.',
  expectedScenes:12,expectedEpisodes:11,
  canonicalScenes:3,paperOnlyScenes:8,blockedScenes:1,
  scenes:slots.map(s=>({...s,productionAccepted:false,ownerAccepted:false})),
  paperHandoffs:handoffAudit(),
  productionEndToEnd:'NOT AVAILABLE — E04 canonical checkpoint and E05-E11 production transitions missing',
  chromium:'NOT RUN BY THIS NODE TEST — see workflow job conclusions',
  mn4Deployment:'NOT RUN',https:'NOT RUN',rollback:'NOT RUN',
  ownerGate:'OPEN',seasonComplete:false
 };
 assert.equal(report.scenes.every(s=>!s.productionAccepted),true);
 mkdirSync(new URL('../test-results/',import.meta.url),{recursive:true});
 writeFileSync(new URL('../test-results/season1-twelve-scene-evidence.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
});
