import {fresh,dispatch,can,view} from './scene-model.mjs';
import {MARKERS,VIEWPOINTS} from '../engine/s01e08-authoring-prototype.mjs';
import {view as viewE07} from '../e07-scene/scene-model.mjs';
import {decodeStepsTransfer,encodeStepsTransfer} from '../authoring-labs/e07-e08-scene-transfer.mjs';
import {decodeHillTransfer,encodeHillTransfer} from '../authoring-labs/e08-e09-scene-transfer.mjs';
import {fresh as freshE09} from '../e09-scene/scene-model.mjs';
const hillIncoming=decodeHillTransfer(location.hash);
const incoming=hillIncoming||decodeStepsTransfer(location.hash);
let state=incoming?.e08||fresh(),linkedE07=incoming?.e07||null,linkedE06=incoming?.e06||null;
let linkedE09=hillIncoming?.e09||null;const $=id=>document.getElementById(id);
const a=(type,key,value)=>({scene:'story',action:key?{type,[key]:value}:{type}});
const n=type=>({scene:'nav',type});
const rows=[
 ['start','Begin lower Steps PAPER model',a('start')],
 ['walk-base','Walk Milo to Base',a('walk','anchor','base')],
 ['walk-landing','Walk Milo to Lower Landing',a('walk','anchor','lower-landing')],
 ['walk-side','Walk Milo to Side Viewpoint',a('walk','anchor','side')],
 ['inspect-brackets','Inspect fixed brackets',a('inspect','feature','brackets')],
 ['inspect-boundary','Inspect CLOSED boundary',a('inspect','feature','boundary')],
 ['inspect-a','Inspect lower lamp A',a('inspect','feature','lower-a')],
 ['inspect-b','Inspect lower lamp B',a('inspect','feature','lower-b')],
 ['inspect-plate','Inspect undated service plate',a('inspect','feature','service-plate')],
 ['lamp-a','Toggle lower lamp A',a('toggle-lamp','lampId','lower-a')],
 ['lamp-b','Toggle lower lamp B',a('toggle-lamp','lampId','lower-b')],
 ['observe','Observe from here',a('observe-view')],
 ['compare','Compare two viewpoints',a('compare-views')],
 ['finish','Keep PAPER observation',a('confirm-preview')],
 ['trace-first','Trace FROM HERE',n('trace-first')],
 ['trace-second','Trace FROM THERE',n('trace-second')],
 ['trace-both','Overlay both PAPER views',n('trace-both')],
 ['connector','Review Finn\'s PAPER connector',n('connector')],
 ['steps','Return to lower Steps',n('steps')],
 ['restart','Restart E08 PAPER model',n('restart')]
];
const groups={'walk-controls':rows.slice(0,4),'inspect-controls':rows.slice(4,9),
 'lamp-controls':rows.slice(9,11),'observe-controls':rows.slice(11,14),
 'trace-controls':rows.slice(14,17),'nav-controls':rows.slice(17)};
for(const [host,items] of Object.entries(groups))for(const [key,label,action] of items){
 const b=document.createElement('button');b.type='button';b.dataset.key=key;b.textContent=label;
 b.addEventListener('click',()=>{if(action.scene==='nav'&&action.type==='restart')linkedE09=null;state=dispatch(state,action);render();});$(host).append(b);
}
const spread=o=>o?o.viewpoint.replaceAll('-',' ')+' · fixed marks A/B/C · apparent spread '+o.spreadDegrees.toFixed(1)+'°':'Not observed yet';
function draw(v){
 const root=$('map');root.replaceChildren();const p=VIEWPOINTS[v.milo],marks=new Map(MARKERS.map((m,i)=>[m.x+','+m.y,'ABC'[i]]));
 for(let y=0;y<6;y++)for(let x=0;x<9;x++){
  const id=x+','+y,m=marks.get(id),here=p.x===x&&p.y===y,el=document.createElement('div');
  el.className='cell';el.dataset.here=String(here);el.dataset.marker=String(!!m);
  el.dataset.dark=String(!!m&&!(v.lights['lower-a']&&v.lights['lower-b']));
  el.textContent=here?'M':m||'·';root.append(el);
 }
 root.setAttribute('aria-label','Synthetic fixed markers A B C, Milo at '+v.milo.replaceAll('-',' ')+
  ', lower lamp A '+(v.lights['lower-a']?'on':'off')+', lower lamp B '+(v.lights['lower-b']?'on':'off'));
}

function drawTrace(s,mode){
 const root=$('trace-map');root.replaceChildren();root.dataset.mode=mode;
 const ns='http://www.w3.org/2000/svg',point=p=>({x:28+p.x*34,y:20+p.y*34});
 const make=(tag,attrs,text)=>{const el=document.createElementNS(ns,tag);
  for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));
  if(text!==undefined)el.textContent=text;root.append(el);return el;};
 const sources=mode==='both'?[['first',s.firstView],['second',s.secondView]]:
  [[mode,mode==='first'?s.firstView:s.secondView]];
 for(const [kind,observation] of sources){
  const start=point(VIEWPOINTS[observation.viewpoint]);
  for(const mark of MARKERS){const end=point(mark);
   make('line',{class:'ray','data-view':kind,x1:start.x,y1:start.y,x2:end.x,y2:end.y,
    stroke:kind==='first'?'#4b7290':'#9a5e38','stroke-width':2,'stroke-dasharray':kind==='second'?'5 3':'none'});
  }
 }
 for(const [i,mark] of MARKERS.entries()){
  const p=point(mark);make('circle',{'data-fixed-marker':'ABC'[i],cx:p.x,cy:p.y,r:9,fill:'#b5d3db',stroke:'#314c58'});
  make('text',{x:p.x,y:p.y+4,'text-anchor':'middle','font-size':12,fill:'#203b45'},'ABC'[i]);
 }
 for(const [kind,observation] of sources){
  const p=point(VIEWPOINTS[observation.viewpoint]);
  make('circle',{'data-viewpoint':kind,cx:p.x,cy:p.y,r:10,fill:kind==='first'?'#4b7290':'#9a5e38'});
  make('text',{x:p.x,y:p.y+4,'text-anchor':'middle','font-size':12,fill:'white'},kind==='first'?'1':'2');
 }
 root.setAttribute('aria-label','Synthetic PAPER tracing of fixed markers A B C from '+
  (mode==='both'?'both safe viewpoints':mode==='first'?'first safe viewpoint':'second safe viewpoint')+
  '. No real lights or hill access.');
}

function render(){
 const v=view(state),s=v.story;
 $('step-scene').hidden=v.screen!=='steps';$('connector-revisit').hidden=v.screen!=='connector';
 $('trace-panel').hidden=!(s.previewComplete&&v.screen==='steps');
 $('stage').textContent='E08 '+s.stage+' · '+v.screen+' · production LOCKED';
 $('speaker').textContent=s.speaker;$('line').textContent=s.line;
 $('milo').textContent='Milo at '+s.milo.replaceAll('-',' ')+'. Upper hill CLOSED.';
 $('inspected').textContent='Inspected: '+(s.inspected.join(', ')||'nothing yet');
 $('lamp-state').textContent='Lower A: '+(s.lights['lower-a']?'ON':'OFF')+
  ' · Lower B: '+(s.lights['lower-b']?'ON':'OFF')+
  (s.lights['lower-a']&&s.lights['lower-b']?' · Fixed marks visible for comparison.':' · Not enough light to compare yet.');
 $('first').textContent='FROM HERE — '+spread(s.firstView);
 $('second').textContent='FROM THERE — '+spread(s.secondView);
 $('comparison').textContent=s.comparison?'Same fixed marks; apparent spacing changed by '+s.comparison.spreadDifferenceDegrees.toFixed(1)+'°. Viewpoint, not the marks, moved.':'Compare two different safe viewpoints, not one guess.';
 $('parent').textContent='Optional parent cue: '+(s.parentCue||'What do you notice before making a guess?');
 $('steps-world').dataset.done=String(v.lowerLightsPaperOn);
 $('steps-world-note').textContent=v.lowerLightsPaperOn?'BEFORE: lower PAPER model unlit. NOW: two model lamps ON; two safe views compared. The marks stayed fixed; real lights NOT restored. Upper hill CLOSED.':'BEFORE: lower PAPER model unlit. Upper hill CLOSED; no real repair.';
 $('connector-trace').textContent=(linkedE07&&viewE07(linkedE07).walkthrough.reviewed?
  'E07 PAPER callback: Milo checked the model crossing and water edge; real connector NOT built. ':
  'No verified E07 PAPER route walk in this independent visit. ')+
  (v.lowerLightsPaperOn?'Milo kept two PAPER viewpoints of the same fixed marks; no real lights were restored.':
   'No E08 PAPER viewpoint record yet.');
 const back=$('e07-return'),fragment=linkedE07&&encodeStepsTransfer(linkedE07,state,linkedE06);
 back.hidden=!fragment;if(fragment)back.href='../e07-scene/'+fragment;
 const hill=$('e09-transfer'),hillFragment=v.lowerLightsPaperOn&&encodeHillTransfer(state,linkedE09||freshE09(),linkedE07,linkedE06);
 hill.hidden=!hillFragment;if(hillFragment)hill.href='../e09-scene/'+hillFragment;
 $('e09-callback').textContent=linkedE09&&v.lowerLightsPaperOn?
  'E09 PAPER return: '+linkedE09.history.length+' recorded model steps; upper hill remains CLOSED.':
  'The safe hill survey is a separate PAPER rehearsal, not a production unlock.';
 if(s.previewComplete){drawTrace(s,v.reviewMode);
  $('trace-detail').textContent=v.reviewMode==='first'?'FROM HERE: '+spread(s.firstView):
   v.reviewMode==='second'?'FROM THERE: '+spread(s.secondView):
   'FIRST: '+spread(s.firstView)+' | SECOND: '+spread(s.secondView)+'. A/B/C never moved; Milo changed viewpoint.';
 }else{$('trace-map').replaceChildren();$('trace-detail').textContent='Finish the PAPER comparison to trace both views.';}
 $('note').textContent=s.paperNote;
 $('hook').textContent=v.lowerLightsPaperOn?'Next question: survey North Hill from a safe place. E09 NOT UNLOCKED.':'The service plate date and source are UNKNOWN. No E09 unlock.';
 draw(s);
 for(const [key,,action] of rows)document.querySelector('[data-key="'+key+'"]').disabled=!can(state,action);
 for(const el of document.querySelectorAll('[data-anchor]'))el.dataset.here=String(el.dataset.anchor===s.milo);
}
render();