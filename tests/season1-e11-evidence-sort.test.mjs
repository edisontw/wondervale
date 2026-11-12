import test from 'node:test';
import assert from 'node:assert/strict';
import {replayEvidence,dispatchEvidence} from '../e11-scene/evidence-sort.mjs';
test('child tries a wrong idea, revises and earns reversible PAPER consequence',()=>{
 let h=[];
 const act=a=>{h=dispatchEvidence(h,a);};
 act({type:'pick',card:'paper-mark'});act({type:'model',target:'rest'});act({type:'test'});
 assert.equal(replayEvidence(h).fits,false);
 assert.match(replayEvidence(h).feedback,/change your model/);
 act({type:'model',target:'path'});act({type:'test'});
 const view=replayEvidence(h);
 assert.equal(view.fits,true);assert.match(view.chronicle,/PAPER NOTE/);
 assert.deepEqual(view.canonicalEvents,[]);assert.deepEqual(view.unlocks,[]);
 assert.equal(view.realAccessApproved,false);
 assert.deepEqual(replayEvidence(JSON.parse(JSON.stringify(h))),view);
 h=h.slice(0,-1);assert.equal(replayEvidence(h).chronicle,null);
 assert.equal(replayEvidence([]).visibleModel,null);
});
test('forged cards, extra fields, skipped tests and invalid histories fail closed',()=>{
 const h=[{type:'pick',card:'paper-seat'}];
 for(const a of [{type:'pick',card:'north-hill'}, {type:'model',target:'open'},
  {type:'test',unlock:true},{type:'pick',card:'paper-mark',approved:true}])
  assert.deepEqual(dispatchEvidence(h,a),h);
 assert.equal(replayEvidence([{type:'test'}]),null);
 assert.equal(replayEvidence([{type:'pick',card:'paper-seat'},{type:'test'}]),null);
 assert.equal(replayEvidence(new Array(17).fill({type:'pick',card:'paper-mark'})),null);
 assert.equal(replayEvidence({history:[]}),null);
});

test('changing the paper clue invalidates a previously selected model and test',()=>{
 let h=[];const act=a=>{h=dispatchEvidence(h,a);};
 act({type:'pick',card:'paper-mark'});act({type:'model',target:'path'});act({type:'test'});
 assert.equal(replayEvidence(h).fits,true);
 act({type:'pick',card:'paper-seat'});
 assert.equal(replayEvidence(h).model,null);
 assert.equal(replayEvidence(h).chronicle,null);
 assert.deepEqual(dispatchEvidence(h,{type:'test'}),h);
 act({type:'model',target:'rest'});act({type:'test'});
 assert.equal(replayEvidence(h).fits,true);
 assert.deepEqual(replayEvidence(JSON.parse(JSON.stringify(h))),replayEvidence(h));
 h=h.slice(0,-1);assert.equal(replayEvidence(h).chronicle,null);
});


test('E05 child event history gates E11 PAPER evidence without granting real rights',async()=>{
 const {fresh,dispatch}=await import('../e05-scene/scene-model.mjs');
 const {replayEarnedEvidence}=await import('../e11-scene/evidence-sort.mjs');
 let s=fresh();
 const act=(scene,type,props={})=>{s=dispatch(s,scene==='nav'?{scene,type}:{scene,action:{type,...props}});};
 const e11=[{type:'pick',card:'paper-mark'},{type:'model',target:'path'},{type:'test'}];
 assert.equal(await replayEarnedEvidence(s.history,e11),null);
 act('station','start');act('station','walk',{value:'board'});
 act('station','inspect',{value:'peg-pair'});act('station','inspect',{value:'worn-edge'});
 act('station','guess',{value:'unsure'});act('station','try-copy',{value:'side-a'});
 act('station','check');act('station','qualify');act('nav','to-records');
 act('sources','start');
 for(const card of ['a','b']){
  act('sources','walk',{value:'desk-'+card});
  act('sources','inspect',{card});act('sources','source-check',{card});
 }
 act('sources','walk',{value:'compare'});
 for(const card of ['a','b']){
  act('sources','place',{card,slot:'unknown'});act('sources','test',{card});
 }
 act('sources','compare');act('sources','finish');act('nav','to-layout');
 act('station','walk',{value:'table'});
 act('station','place-table',{value:'across-walkway'});
 act('station','place-table',{value:'near-wall'});
 act('station','confirm');act('station','reflect');act('nav','to-review');
 const result=await replayEarnedEvidence(JSON.parse(JSON.stringify(s.history)),e11);
 assert.equal(result?.fits,true);
 assert.equal(result?.e05PaperReplayed,true);
 assert.match(result.chronicle,/MOCK records remain UNKNOWN/);
 assert.equal(result.sourceApproved,false);
 assert.equal(result.realAccessApproved,false);
 assert.deepEqual(result.canonicalEvents,[]);
 assert.equal(await replayEarnedEvidence([...s.history,{scene:'nav',type:'to-review',admin:true}],e11),null);
 assert.equal(await replayEarnedEvidence([{scene:'nav',type:'restart'}],e11),null);
 assert.equal(await replayEarnedEvidence(s.history,[...e11,{type:'grant-rights'}]),null);
 assert.equal(await replayEarnedEvidence([],e11),null);
});
