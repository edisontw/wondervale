import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fresh,dispatch,can,replay,view} from '../e05-scene/scene-model.mjs';

const nav=type=>({scene:'nav',type});
const station=(type,value)=>({scene:'station',action:value===undefined?{type}:{type,value}});
const sources=(type,extra={})=>({scene:'sources',action:{type,...extra}});
function step(s,a){
  assert.equal(can(s,a),true,'expected legal action: '+JSON.stringify(a));
  return dispatch(s,a);
}
function completed(){
  let s=fresh();
  for(const a of [
    station('start'),station('walk','board'),
    station('inspect','peg-pair'),station('inspect','worn-edge'),
    station('guess','unsure'),station('try-copy','side-a'),
    station('check'),station('qualify'),nav('to-records'),
    sources('start'),sources('walk',{value:'desk-a'}),
    sources('inspect',{card:'a'}),sources('source-check',{card:'a'}),
    sources('walk',{value:'desk-b'}),sources('inspect',{card:'b'}),
    sources('source-check',{card:'b'}),sources('walk',{value:'compare'}),
    sources('place',{card:'a',slot:'unknown'}),sources('test',{card:'a'}),
    sources('place',{card:'b',slot:'unknown'}),sources('test',{card:'b'}),
    sources('compare'),sources('finish'),nav('to-layout'),
    station('walk','table'),station('place-table','near-wall'),
    station('confirm'),station('reflect'),nav('to-review')
  ])s=step(s,a);
  return s;
}
test('E05 review -> records -> layout -> review preserves PAPER evidence and Chronicle',()=>{
  let s=completed();
  const before=view(s),stationHistory=s.station.history,sourcesHistory=s.sources.history;
  assert.equal(before.stage,'review');
  assert.match(before.paperChronicle,/PAPER ONLY/);
  s=step(s,nav('back-to-records'));
  assert.equal(view(s).stage,'records');
  assert.equal(can(s,sources('place',{card:'a',slot:'earlier'})),false,
    'finished source desk remains read-only on revisit');
  s=step(s,nav('to-layout'));
  s=step(s,nav('to-review'));
  assert.equal(view(s).paperChronicle,before.paperChronicle);
  assert.deepEqual(s.station.history,stationHistory);
  assert.deepEqual(s.sources.history,sourcesHistory);
  assert.deepEqual(replay(s.history),s);
  assert.deepEqual(view(s).canonicalEvents,[]);
  assert.deepEqual(view(s).unlocks,[]);
  assert.equal(view(s).e06Unlocked,false);
});
test('E05 review navigation is exposed as a visible button and invalid jumps fail closed',()=>{
  const html=readFileSync(new URL('../e05-scene/index.html',import.meta.url),'utf8');
  const review=html.split('<section class="panel" id="review" hidden>')[1]?.split('<section class="panel" id="garden-return"')[0];
  assert.match(review||'',/<button data-scene="nav" data-type="back-to-records">Review source limits<\/button>/);
  const initial=fresh();
  assert.equal(can(initial,nav('back-to-records')),false);
  assert.equal(can(initial,nav('to-review')),false);
  const done=completed();
  assert.equal(can(done,{scene:'nav',type:'back-to-records',canonical:true}),false);
  assert.deepEqual(dispatch(done,{scene:'nav',type:'back-to-records',canonical:true}),done);
});
