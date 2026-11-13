import test from 'node:test';
import assert from 'node:assert/strict';
import * as E05 from '../e05-scene/scene-model.mjs';
import {earnedE05,replayLayout,dispatchLayout} from '../e11-scene/e05-earned-layout-trial.mjs';
const a=(scene,type,props={})=>({scene,action:{type,...props}});
const nav=type=>({scene:'nav',type});
export function earnedHistory(){
 let s=E05.fresh();
 const actions=[
 a('station','start'),a('station','walk',{value:'board'}),a('station','inspect',{value:'peg-pair'}),a('station','inspect',{value:'worn-edge'}),a('station','guess',{value:'unsure'}),a('station','try-copy',{value:'side-a'}),a('station','check'),a('station','qualify'),nav('to-records'),
 a('sources','start'),
 ...['a','b'].flatMap(card=>[a('sources','walk',{value:'desk-'+card}),a('sources','inspect',{card}),a('sources','source-check',{card})]),
 a('sources','walk',{value:'compare'}),
 ...['a','b'].flatMap(card=>[a('sources','place',{card,slot:'unknown'}),a('sources','test',{card})]),
 a('sources','compare'),a('sources','finish'),nav('to-layout'),
 a('station','walk',{value:'table'}),a('station','place-table',{value:'across-walkway'}),a('station','place-table',{value:'near-wall'}),a('station','confirm'),a('station','reflect'),nav('to-review')];
 for(const action of actions){assert.equal(E05.can(s,action),true,JSON.stringify(action));s=E05.dispatch(s,action);}
 assert.equal(E05.view(s).stage,'review');return s.history;
}
test('strict earned E05 replay, blocked-first correction, undo and restart',()=>{
 const source=earnedHistory();assert.equal(earnedE05(source),true);
 let history=[];history=dispatchLayout(source,history,{type:'place',position:'center'});
 history=dispatchLayout(source,history,{type:'test'});
 assert.equal(replayLayout(source,history).world,'PAPER walkway blocked');
 history=dispatchLayout(source,history,{type:'place',position:'side'});
 history=dispatchLayout(source,history,{type:'test'});
 const result=replayLayout(source,history);
 assert.equal(result.clear,true);assert.equal(result.attemptedBlocked,true);
 assert.match(result.chronicle,/PAPER Chronicle/);
 assert.deepEqual(result.canonicalEvents,[]);assert.deepEqual(result.rights,[]);
 assert.equal(result.northHillClosed,true);assert.equal(result.commonRevealed,false);
 assert.equal(replayLayout(source,history.slice(0,-1)).chronicle,null);
 assert.equal(replayLayout(source,[]).chronicle,null);
 assert.throws(()=>dispatchLayout(source,history,{type:'test'}),/Invalid event/);
});
test('no forged E05 rights, skipped review, injected layout state or fake unlock',()=>{
 const source=earnedHistory();
 for(const bad of [[],[{scene:'nav',type:'to-review'}],source.slice(0,-1),[...source,{scene:'nav',type:'to-review',admin:true}],[...source,{scene:'nav',type:'restart'}]])
  assert.equal(earnedE05(bad),false);
 for(const event of [{type:'test',rights:['open']},{type:'place',position:'side',canon:true},{type:'place',position:'invented'},{type:'unlock'},null])
  assert.throws(()=>dispatchLayout(source,[],event));
 assert.throws(()=>replayLayout(source,Array(25).fill({type:'test'})));
});
