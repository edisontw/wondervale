// Shared deterministic child-action fixture for E04-E09 browser PAPER transfer QA.
// No canonical completion, rights or historical dates are granted.
import assert from 'node:assert/strict';
import * as E04 from '../../authoring-labs/arc1-memory-station-handoff-model.mjs';
import * as E05 from '../../e05-scene/scene-model.mjs';
import * as E06 from '../../e06-scene/scene-model.mjs';
import * as E07 from '../../e07-scene/scene-model.mjs';
import * as E08 from '../../e08-scene/scene-model.mjs';
import * as E09 from '../../e09-scene/scene-model.mjs';
const a=(scene,type,extra={})=>({scene,action:{type,...extra}});
const nav=type=>({scene:'nav',type});
const g=(type,value)=>({scene:'garden',action:value===undefined?{type}:{type,value}});
const c=(type,value)=>value===undefined?{scene:'care',type}:{scene:'care',type,value};
function step(model,s,action){
 assert.equal(model.can(s,action),true,JSON.stringify(action));
 return model.dispatch(s,action);
}
function memories(){
 let s=E04.fresh();
 for(const action of [
  a('e04','inspect',{which:'station'}),a('e04','inspect',{which:'garden'}),
  a('e04','place',{which:'station',slot:'earlier'}),
  a('e04','place',{which:'garden',slot:'later'}),
  a('e04','place',{which:'station',slot:'unknown'}),
  a('e04','place',{which:'garden',slot:'unknown'}),
  a('e04','compare'),a('e04','finish-paper')
 ])s=step(E04,s,action);
 return s;
}
function station(){
 let s=E05.fresh();
 for(const action of [
  a('station','start'),a('station','walk',{value:'board'}),
  a('station','inspect',{value:'peg-pair'}),a('station','inspect',{value:'worn-edge'}),
  a('station','guess',{value:'unsure'}),a('station','try-copy',{value:'side-b'}),
  a('station','check'),a('station','try-copy',{value:'side-a'}),a('station','check'),
  a('station','qualify'),nav('to-records'),a('sources','start'),
  ...['a','b'].flatMap(card=>[
   a('sources','walk',{value:'desk-'+card}),a('sources','inspect',{card}),
   a('sources','source-check',{card})]),
  a('sources','walk',{value:'compare'}),
  a('sources','place',{card:'a',slot:'earlier'}),a('sources','test',{card:'a'}),
  ...['a','b'].flatMap(card=>[
   a('sources','place',{card,slot:'unknown'}),a('sources','test',{card})]),
  a('sources','compare'),a('sources','finish'),nav('to-layout'),
  a('station','walk',{value:'table'}),a('station','place-table',{value:'across-walkway'}),
  a('station','place-table',{value:'near-wall'}),a('station','confirm'),
  a('station','reflect'),nav('to-review'),
  a('garden','inspect',{value:'older'}),a('garden','inspect',{value:'present'}),
  a('garden','overlay'),a('garden','ask-why')
 ])s=step(E05,s,action);
 return s;
}

function completedGarden(){
 let s=E06.fresh();
 for(const a of [g('start'),g('inspect','present-bed'),g('walk','slope'),g('inspect','slope'),
  g('walk','model-tray'),g('run'),g('weather','rain'),g('run'),g('channel','blocked'),
  g('run'),g('compare'),g('enter'),g('inspect','runoff-trace'),
  g('walk','public-path'),g('inspect','public-path'),g('walk','runoff-channel'),
  g('place','runoff-channel'),g('check'),g('walk','raised-pocket'),
  g('place','raised-pocket'),g('check'),g('think','keep-path'),g('finish'),
  c('choose','heavy'),c('test'),c('choose','gentle'),c('test'),c('compare')]){
  assert.equal(E06.can(s,a),true,JSON.stringify(a));s=E06.dispatch(s,a);
 }
 return s;
}

export function sevenSceneUpstream(){
 const e04=memories(),e05=station(),e06=completedGarden();
 let e07=E07.fresh();
 const w=(type,value)=>({scene:'walkthrough',type,...(value===undefined?{}:{value})});
 for(const x of [a('story','start'),a('story','walk',{value:'shared-path'}),
  a('story','inspect',{value:'shared-path'}),a('story','walk',{value:'channel'}),
  a('story','inspect',{value:'channel'}),a('story','walk',{value:'workbench'}),
  ...['milo','resident','water'].map(value=>a('story','trial',{value})),
  a('story','place',{value:'path-clear-water-blocked'}),
  ...['milo','resident','water'].map(value=>a('story','trial',{value})),
  a('story','place',{value:'side-offset'}),
  ...['water','milo','resident'].map(value=>a('story','trial',{value})),
  a('story','compare'),a('story','finish'),
  w('start'),w('move','crossing'),w('inspect','crossing'),
  w('move','water-edge'),w('inspect','water-edge'),
  w('move','steps-base'),w('review')])e07=step(E07,e07,x);
 const l=(type,key,value)=>({scene:'story',action:key?{type,[key]:value}:{type}});
 let e08=E08.fresh();
 for(const x of [l('start'),l('inspect','feature','brackets'),l('inspect','feature','boundary'),
  l('inspect','feature','lower-a'),l('toggle-lamp','lampId','lower-a'),
  l('walk','anchor','lower-landing'),l('inspect','feature','lower-b'),
  l('toggle-lamp','lampId','lower-b'),l('walk','anchor','base'),l('observe-view'),
  l('walk','anchor','lower-landing'),l('walk','anchor','side'),l('observe-view'),
  l('compare-views'),l('inspect','feature','service-plate'),l('confirm-preview')])
   e08=step(E08,e08,x);
 let e09=E09.fresh();
 for(const x of [l('start'),l('inspect','clueId','entry_note'),
  l('walk','to','signpost'),l('inspect','clueId','boundary_sign'),
  l('walk','to','fence_view'),l('inspect','clueId','disturbed_ground'),
  l('walk','to','upper_closed'),l('walk','to','signpost'),
  l('walk','to','lower_bend'),l('inspect','clueId','runoff_marks'),
  l('walk','to','overlook'),l('inspect','clueId','distant_symbol'),
  l('mark','edgeId','steps_base:signpost'),l('mark','edgeId','signpost:lower_bend'),
  l('mark','edgeId','lower_bend:overlook'),l('check-route'),
  l('compare-symbol'),l('review'),l('finish-preview')])
   e09=step(E09,e09,x);
 return {e04,e05,e06,e07,e08,e09};
}
