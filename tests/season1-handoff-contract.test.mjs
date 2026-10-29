import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {SCENES,HANDOFFS,handoffAudit,sceneAudit} from '../authoring-labs/handoff-contract.mjs';
import * as e05 from '../engine/s01e05-authoring-prototype.mjs';
import * as e06 from '../engine/s01e06-authoring-prototype.mjs';
import * as e07 from '../engine/s01e07-authoring-prototype.mjs';
import * as e08 from '../engine/s01e08-authoring-prototype.mjs';
import * as e09 from '../engine/s01e09-authoring-prototype.mjs';
import * as e10 from '../engine/s01e10-authoring-prototype.mjs';
import * as e11 from '../engine/s01e11-authoring-prototype.mjs';

const models={s01e05:e05,s01e06:e06,s01e07:e07,s01e08:e08,
 s01e09:e09,s01e10:e10,s01e11:e11};
const projection=m=>typeof m.previewProjection==='function'?m.previewProjection:m.projection;

test('exactly 12 planned scene slots: E01–E03 accepted plus E04–E11 (E06 twice)',()=>{
 assert.equal(SCENES.length,9);
 assert.deepEqual(SCENES.map(s=>s.scene),['04','05','06','07','08','09','10','11','12']);
 assert.equal(new Set(SCENES.map(s=>s.episode)).size,8);
 assert.equal(SCENES.filter(s=>s.episode==='s01e06').length,2);
 assert.equal(SCENES[0].status,'blocked-design');
 assert.equal(SCENES[0].lab,null,'no synthetic E04 source shortcut');
 assert.equal(SCENES.filter(s=>s.lab!==null).length,8);
});

test('handoff graph is ordered, connected and never auto-grants production progress',()=>{
 assert.equal(HANDOFFS.length,8);
 for(let i=0;i<HANDOFFS.length;i++){
  assert.equal(HANDOFFS[i].from,SCENES[i].id);
  assert.equal(HANDOFFS[i].to,SCENES[i+1].id);
 }
 const audits=handoffAudit();
 assert.equal(audits.length,8);
 for(const a of audits){
  assert.equal(a.productionEligible,false);
  assert.equal(a.canonicalEventIssued,false);
  assert.equal(a.unlockIssued,false);
  assert.ok(a.blockedBy.length>25);
  assert.ok(a.prerequisite.length>30);
 }
 assert.equal(audits.filter(a=>a.kind==='same-lab').length,1);
 assert.deepEqual([audits[2].from,audits[2].to],['e06-current','e06-lower']);
 assert.match(audits[2].prerequisite,/inside E06/);
 assert.match(audits[2].verdict,/NOT A PRODUCTION UNLOCK/);
});

test('real engine initial states and projections expose no canon, history claims or unlocks',()=>{
 for(const [id,m] of Object.entries(models)){
  const s=m.fresh();
  const p=projection(m)(s);
  assert.ok(p,id+' has a projection');
  assert.ok(s.mode==='authoring_preview'||s.mode==='SYNTHETIC_AUTHORING_ONLY',
   id+' must be an isolated synthetic mode');
  for(const v of [s,p]){
   for(const k of ['canonicalEvents','unlocks','historicalClaims']){
    assert.deepEqual(v[k]??[],[],id+' '+k+' must not be present as an awarded fact');
   }
  }
  assert.ok(Array.isArray(s.history),id+' uses an in-memory replay history');
 }
});

test('E06 lower scene is not reached by opening a fresh lab; E09 does not reveal E10 identity',()=>{
 assert.equal(e06.previewProjection(e06.fresh()).scene,'s01e06-current-garden');
 assert.equal(e06.fresh().lowerPreviewStarted,false);
 assert.doesNotMatch(JSON.stringify(e09.previewProjection(e09.fresh())),/Common/i);
 assert.equal(e10.fresh().nameRevealed,false);
 assert.equal(e11.fresh().finished,false);
});

test('produce machine-readable checklist without claiming an executed production acceptance',async()=>{
 const report={scope:'NONCANONICAL AUTHORING AUDIT — NOT AN END-TO-END TEST',
  sceneCount:12,scenes:sceneAudit(),handoffs:handoffAudit(),
  executedEngineChecks:Object.keys(models),productionTests:'NOT RUN',
  deployment:'NOT RUN',ownerGate:'OPEN'};
 assert.equal(report.scenes.every(s=>s.productionEligible===false),true);
 await mkdir('test-results',{recursive:true});
 await writeFile('test-results/season1-handoff-audit.json',JSON.stringify(report,null,2)+'\n');
});
