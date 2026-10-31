import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fresh,dispatch,restore,projection} from '../engine/s01e11-authoring-prototype.mjs';
import {paperRevisit} from '../e11-scene/revisit-model.mjs';
import {inspectPaperRole} from '../e11-scene/role-inspection.mjs';
import {PAPER_QUESTIONS,PAPER_CHECKS,draftPaperVerification} from '../e11-scene/verification-plan.mjs';

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

test('FIRST/NOW world boards require strictly replayed child trials, and never promote rights',()=>{
 let s=fresh();
 const act=a=>{s=dispatch(s,a);};
 assert.equal(paperRevisit(s),null);
 act({type:'place',tokenId:'access',cells:['1,1','1,2']});
 act({type:'place',tokenId:'quiet',cells:['0,1']});
 act({type:'place',tokenId:'activity',cells:['0,2']});
 act({type:'test-user',userId:'quiet_reader'});
 act({type:'test-user',userId:'activity_group'});
 act({type:'snapshot-trial'});
 act({type:'place',tokenId:'activity',cells:['2,1']});
 act({type:'test-user',userId:'quiet_reader'});
 act({type:'test-user',userId:'activity_group'});
 act({type:'snapshot-trial'});
 assert.equal(paperRevisit(s),null,'no comparison before the child compares');
 act({type:'compare-trials',first:'trial-1',second:'trial-2'});
 const quiet=paperRevisit(s);
 const wrong=inspectPaperRole(s,'quiet_reader','0,0');
 assert.equal(wrong.found,false,'wrong FIRST cell is a safe retry');
 assert.match(wrong.response,/look again/);
 const reader=inspectPaperRole(s,'quiet_reader','0,1');
 assert.equal(reader.found,true);
 assert.match(reader.response,/FIRST quiet reader: RETRY/);
 assert.match(reader.response,/NOW: PASS/);
 assert.match(reader.nia,/Real people have not told us/);
 assert.equal(reader.permissionApproved,false);
 assert.deepEqual(reader.canonicalEvents,[]);
 const activity=inspectPaperRole(s,'activity_group','0,2');
 assert.equal(activity.found,true);
 assert.match(activity.response,/FIRST activity group: PASS/);
 assert.equal(inspectPaperRole(s,'quiet_reader','9,9'),null);
 assert.equal(inspectPaperRole({...s,rights:['approved']},'quiet_reader','0,1'),null);
 assert.equal(quiet.firstPass,false);
 assert.equal(quiet.nowPass,true);
 assert.deepEqual(quiet.first.layout.activity,['0,2']);
 assert.deepEqual(quiet.now.layout.activity,['2,1']);
 assert.equal(quiet.reviewed,false);
 assert.deepEqual(quiet.links,[]);
 assert.equal(quiet.placeOpen,false);
 assert.equal(quiet.seasonComplete,false);
 const group=paperRevisit(s,'activity_group');
 assert.equal(group.firstPass,true);
 assert.equal(group.nowPass,true);
 assert.equal(paperRevisit(s,'forged_need'),null);
 assert.equal(paperRevisit({...s,rights:['approved']}),null);
 act({type:'cite-earlier',discoveryId:'e09_closure'});
 for(const edgeId of ['square-market','market-common','common-square'])
  act({type:'add-loop-edge',edgeId});
 act({type:'check-loop'});
 act({type:'review-preview'});
 const reviewed=paperRevisit(s);
 assert.equal(reviewed.reviewed,true);
 assert.equal(reviewed.recalled,'e09_closure');
 assert.equal(reviewed.links.length,3);
 assert.match(reviewed.links.join(' '),/unnamed place/);
 assert.doesNotMatch(reviewed.links.join(' '),/\bcommon\b/i);
 assert.equal(reviewed.realAccess,false);
 assert.equal(reviewed.historyApproved,false);
 act({type:'place',tokenId:'activity',cells:['2,2']});
 assert.equal(paperRevisit(s),null,'upstream layout change withdraws stale comparison');
 assert.equal(inspectPaperRole(s,'quiet_reader','0,1'),null,'stale role talk is withdrawn');
 act({type:'reset'});
 assert.equal(paperRevisit(s),null);
});

test('child drafts future checks only after earned role inspection; no plan becomes real proof',()=>{
 let s=fresh();const act=a=>{s=dispatch(s,a);};
 assert.equal(draftPaperVerification(s,'quiet_reader','0,1','people','ask'),null);
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
 ])act(a);
 assert.equal(PAPER_QUESTIONS.length,3);
 assert.equal(PAPER_CHECKS.length,3);
 assert.equal(draftPaperVerification(s,'quiet_reader','0,0','people','ask'),null);
 assert.equal(draftPaperVerification(s,'quiet_reader','0,1','made_up','ask'),null);
 assert.equal(draftPaperVerification(s,'quiet_reader','0,1','people','made_up'),null);
 const retry=draftPaperVerification(s,'quiet_reader','0,1','people','survey');
 assert.equal(retry.matched,false);
 assert.equal(retry.draft,null);
 assert.match(retry.feedback,/try a different station/);
 for(const q of PAPER_QUESTIONS){
  const draft=draftPaperVerification(s,'quiet_reader','0,1',q.id,q.check);
  assert.equal(draft.matched,true);
  assert.match(draft.draft,/NOT CHECKED/);
  assert.equal(draft.actualEvidence,false);
  assert.equal(draft.permissionApproved,false);
  assert.deepEqual(draft.canonicalEvents,[]);
  assert.deepEqual(draft.unlocks,[]);
  assert.equal(draft.seasonComplete,false);
 }
 assert.equal(draftPaperVerification({...s,rights:['approved']},'quiet_reader','0,1','rights','permission'),null);
 assert.equal(draftPaperVerification(s,'activity_group','0,2','access','survey').matched,true);
 act({type:'place',tokenId:'activity',cells:['2,2']});
 assert.equal(draftPaperVerification(s,'quiet_reader','0,1','people','ask'),null);
});
