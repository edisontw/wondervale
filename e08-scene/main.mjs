import {fresh,dispatch,can,view} from './scene-model.mjs';
import {MARKERS,VIEWPOINTS} from '../engine/s01e08-authoring-prototype.mjs';
import {view as viewE07} from '../e07-scene/scene-model.mjs';
import {connectorWorld} from './connector-world.mjs';
import {approachFrame} from './approach-experiment.mjs';
import {freshShadow,dispatchShadow,canShadow,viewShadow} from './shadow-experiment.mjs';
import {viewfinderFrame} from './live-viewfinder.mjs';
import {decodeStepsTransfer,encodeStepsTransfer} from '../authoring-labs/e07-e08-scene-transfer.mjs';
import {decodeMemoryLantern,encodeMemoryLantern} from '../authoring-labs/e04-e08-scene-transfer.mjs';
import {decodeHillTransfer,encodeHillTransfer} from '../authoring-labs/e08-e09-scene-transfer.mjs';
import {decodeMemoryHill,encodeMemoryHill} from '../authoring-labs/e04-e09-scene-transfer.mjs';
import {fresh as freshE09,view as viewE09} from '../e09-scene/scene-model.mjs';
const memoryHill=decodeMemoryHill(location.hash);
const lantern=memoryHill||decodeMemoryLantern(location.hash);
const hillIncoming=lantern?null:decodeHillTransfer(location.hash);
const incoming=lantern||hillIncoming||decodeStepsTransfer(location.hash);
let state=incoming?.e08||fresh(),linkedE07=incoming?.e07||null,linkedE06=incoming?.e06||null;
let linkedE09=memoryHill?.e09||hillIncoming?.e09||null;
let selectedHillQuestion=null; // UI focus only; never a replay/approval flag.
let approach={layout:'first',view:'first',pins:[]},shadow=freshShadow();
const linkedE04=lantern?.e04||null,linkedE05=lantern?.e05||null;
const $=id=>document.getElementById(id);
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
 b.addEventListener('click',()=>{if(action.scene==='nav'&&action.type==='restart'){linkedE09=null;selectedHillQuestion=null;approach={layout:'first',view:'first',pins:[]};shadow=freshShadow();}state=dispatch(state,action);render();});$(host).append(b);
}
for(const button of document.querySelectorAll('[data-approach]')){
 button.addEventListener('click',()=>{
  const key=button.dataset.approach;
  if(key==='clear')approach.pins=[];
  else if(key==='pin'){
   if(!approachFrame(linkedE07,state,approach.layout,approach.view))return;
   const id=approach.layout+':'+approach.view;
   if(!approach.pins.includes(id))approach.pins.push(id);
  }else if(key==='first'||key==='now')approach.layout=key;
  else if(key==='here'||key==='there')approach.view=key==='here'?'first':'second';
  render();
 });
}
for(const button of document.querySelectorAll('[data-shadow]')){
 button.addEventListener('click',()=>{
  const key=button.dataset.shadow;
  const action=key==='near'||key==='far'?{type:'move-screen',screen:key}:
   key==='a'||key==='b'?{type:'choose-lamp',lamp:key}:
   {type:key};
  shadow=dispatchShadow(shadow,action);render();
 });
}
function drawShadow(){
 const story=view(state).story,paper=viewShadow(shadow);
 $('shadow-panel').hidden=!(story.previewComplete&&view(state).screen==='steps');
 const root=$('shadow-map');root.replaceChildren();
 const ns='http://www.w3.org/2000/svg';
 const add=(tag,attrs,caption)=>{
  const el=document.createElementNS(ns,tag);
  for(const [key,value] of Object.entries(attrs))el.setAttribute(key,String(value));
  if(caption!==undefined)el.textContent=caption;
  root.append(el);
 };
 add('line',{x1:15,y1:82,x2:405,y2:82,stroke:'#314c58','stroke-width':3});
 for(const mark of paper.shadows){
  const x=30+(mark.x+7)*18;
  add('circle',{'data-shadow-mark':mark.mark,cx:x,cy:82,r:12,fill:'#b5d3db',stroke:'#314c58'});
  add('text',{x,y:87,'text-anchor':'middle','font-size':13,fill:'#203b45'},mark.mark);
 }
 root.setAttribute('aria-label','Synthetic PAPER screen '+paper.screen+', lamp '+paper.lamp+
  ', shadow projections '+paper.shadows.map(p=>p.mark+' at '+p.x).join(', ')+'. No real light test.');
 $('shadow-position').textContent='Milo moves the PAPER screen '+paper.screen.toUpperCase()+
  ' and selects model lamp '+paper.lamp.toUpperCase()+'. Shadows A/B/C: '+
  paper.shadows.map(p=>p.mark+' '+p.x).join(' · ')+' (unitless). The marks stay fixed.';
 $('shadow-observations').textContent='Recorded PAPER trials: '+paper.notes.length+'/4. '+
  (paper.notes.map(p=>p.lamp.toUpperCase()+' '+p.screen.toUpperCase()).join(' · ')||'None yet.');
 $('shadow-result').textContent=paper.compared?
  'PAPER COMPARED — same lamp, screen moved. Shadow shifts: '+
  paper.shifts.map(p=>p.mark+' '+p.delta).join(' · ')+
  '. The marks did not move. This is not proof of a historical direction.':
  paper.comparable?'Two screen distances with one lamp are ready. Compare what changed.':
  'Keep one model lamp the same; move the PAPER screen and record both positions. Two changes at once do not isolate a cause.';
 for(const button of document.querySelectorAll('[data-shadow]')){
  const key=button.dataset.shadow;
  const action=key==='near'||key==='far'?{type:'move-screen',screen:key}:
   key==='a'||key==='b'?{type:'choose-lamp',lamp:key}:{type:key};
  button.disabled=!canShadow(shadow,action);
  if(['near','far','a','b'].includes(key))
   button.setAttribute('aria-pressed',String(key===paper.screen||key===paper.lamp));
 }
}
const spread=o=>o?o.viewpoint.replaceAll('-',' ')+' · fixed marks A/B/C · apparent spread '+o.spreadDegrees.toFixed(1)+'°':'Not observed yet';
for(const button of document.querySelectorAll('[data-hill-question]'))button.addEventListener('click',()=>{
 selectedHillQuestion=button.dataset.hillQuestion;render();
});
function draw(v){
 const root=$('map');root.replaceChildren();const p=VIEWPOINTS[v.milo],marks=new Map(MARKERS.map((m,i)=>[m.x+','+m.y,'ABC'[i]]));
 for(let y=0;y<6;y++)for(let x=0;x<9;x++){
  const id=x+','+y,m=marks.get(id),here=p.x===x&&p.y===y,el=document.createElement('div');
  el.className='cell';el.dataset.here=String(here);el.dataset.marker=String(!!m);
  el.dataset.dark=String(!!m&&!(v.lights['lower-a']&&v.lights['lower-b']));
  const question=x===1&&y===1?'light':x===7&&y===4?'view':null;
  const earned=question&&$('steps-world').dataset.hillReturn==='revised';
  el.dataset.hillQuestion=earned?question:'';
  el.dataset.selected=String(!!earned&&selectedHillQuestion===question);
  el.textContent=here?'M':earned?(question==='light'?'?L':'?V'):m||'·';root.append(el);
 }
 root.setAttribute('aria-label','Synthetic fixed markers A B C, Milo at '+v.milo.replaceAll('-',' ')+
  ', lower lamp A '+(v.lights['lower-a']?'on':'off')+', lower lamp B '+(v.lights['lower-b']?'on':'off'));
}

function drawLiveView(s){
 const frame=viewfinderFrame(s.milo,s.lights),root=$('live-viewfinder');
 root.replaceChildren();root.dataset.lit=String(frame.lit);
 const ns='http://www.w3.org/2000/svg';
 const add=(tag,attrs,content)=>{
  const el=document.createElementNS(ns,tag);
  for(const [key,value] of Object.entries(attrs))el.setAttribute(key,String(value));
  if(content!==undefined)el.textContent=content;
  root.append(el);
 };
 add('line',{x1:160,y1:8,x2:160,y2:136,stroke:'#7b9ba4','stroke-width':2,'stroke-dasharray':'4 4'});
 if(frame.lit)for(const mark of frame.marks){
  add('line',{'data-sightline':mark.mark,x1:160,y1:mark.y,x2:mark.x,y2:mark.y,
    stroke:'#4b7290','stroke-width':3});
  add('circle',{'data-live-mark':mark.mark,cx:mark.x,cy:mark.y,r:12,
    fill:'#b5d3db',stroke:'#314c58','stroke-width':2});
  add('text',{x:mark.x,y:mark.y+5,'text-anchor':'middle','font-size':13,fill:'#203b45'},mark.mark);
 }
 root.setAttribute('aria-label',frame.label);
 $('live-view-note').textContent=frame.lit?
  'Milo at '+frame.anchor.replaceAll('-',' ')+': A/B/C appear '+frame.spreadDegrees.toFixed(1)+
  '° apart. Walk to another SAFE viewpoint and watch the marks shift across the viewfinder. '+
  'The PAPER marks themselves stay fixed. Tap Observe to keep a note.':
  'The PAPER viewfinder is dim. Turn on both lower MODEL lamps to see A/B/C. Upper hill CLOSED.';
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

function drawApproach(frame){
 const panel=$('approach-panel');panel.hidden=!frame||view(state).screen!=='steps';
 const root=$('approach-map');root.replaceChildren();
 if(!frame)return;
 const ns='http://www.w3.org/2000/svg',pt=p=>({x:28+p.x*34,y:20+p.y*34});
 const add=(tag,attrs,text)=>{
  const el=document.createElementNS(ns,tag);
  for(const [key,value] of Object.entries(attrs))el.setAttribute(key,String(value));
  if(text!==undefined)el.textContent=text;
  root.append(el);
 };
 const origin=pt(VIEWPOINTS[frame.viewpoint]);
 for(const [i,mark] of MARKERS.entries()){
  const p=pt(mark);
  add('line',{'data-approach-ray':i,x1:origin.x,y1:origin.y,x2:p.x,y2:p.y,
   stroke:'#4b7290','stroke-width':2,'stroke-dasharray':'4 3'});
  add('circle',{'data-approach-marker':'ABC'[i],cx:p.x,cy:p.y,r:9,fill:'#b5d3db',stroke:'#314c58'});
  add('text',{x:p.x,y:p.y+4,'text-anchor':'middle','font-size':12},'ABC'[i]);
 }
 add('circle',{'data-approach-viewpoint':frame.viewpoint,cx:origin.x,cy:origin.y,r:11,fill:'#9a5e38'});
 add('text',{x:origin.x,y:origin.y+4,'text-anchor':'middle','font-size':12,fill:'white'},'M');
 root.setAttribute('aria-label','PAPER '+frame.viewpoint+' viewpoint; fixed A B C marks, spread '+frame.spreadDegrees.toFixed(1)+' degrees');
 $('approach-route').textContent=(frame.layout==='first'?'Finn\'s FIRST short model':'Milo\'s NOW revised model')+
  ': '+frame.conflicts+' connector overlap cells; traveler '+(frame.peoplePass?'PASS':'BLOCKED')+
  ', water '+(frame.waterPass?'PASS':'BLOCKED')+'.';
 $('approach-view').textContent='Milo sees fixed A/B/C from '+frame.viewpoint.toUpperCase()+
  ' ('+frame.viewpoint.replace('first','FROM HERE').replace('second','FROM THERE')+
  '): apparent spread '+frame.spreadDegrees.toFixed(1)+'°. Changing the PAPER route does not move these marks.';
 const total=approach.pins.length;
 $('approach-note').textContent=total===4?
  'PAPER COMPARED: Finn\'s revised model clears the traveler/water overlaps. Milo\'s viewpoint changes apparent spacing, but A/B/C stay fixed. No real connector, lights or access approved.':
  'PAPER field notes: '+total+'/4 model-and-view combinations checked. Choose a route and a viewpoint, then mark what Milo saw. You can revise or clear.';
 for(const b of document.querySelectorAll('[data-approach]')){
  const key=b.dataset.approach;
  b.disabled=key==='pin'?approach.pins.includes(approach.layout+':'+approach.view):
   key==='clear'?total===0:false;
  if(['first','now','here','there'].includes(key))
   b.setAttribute('aria-pressed',String(key===approach.layout||key==='here'&&approach.view==='first'||key==='there'&&approach.view==='second'));
 }
 $('connector-first-grid').dataset.active=String(frame.layout==='first');
 $('connector-now-grid').dataset.active=String(frame.layout==='now');
}
function drawConnectorCallback(){
 const paper=connectorWorld(linkedE07);
 $('connector-world-panel').hidden=!paper;
 for(const [id,layout] of [['connector-first-grid',paper?.first],['connector-now-grid',paper?.now]]){
  const root=$(id);root.replaceChildren();if(!layout)continue;
  for(const cell of layout.cells){
   const el=document.createElement('div');el.className='cell';el.textContent=cell.label;
   el.dataset.conflict=String(cell.conflict);el.dataset.connector=String(cell.connector);
   root.append(el);
  }
  root.setAttribute('aria-label',layout.layout+' synthetic connector, '+layout.conflicts+
   ' overlap cells. C connector, P traveler, W water, X overlap.');
 }
 $('connector-world-result').textContent=paper?
  'FIRST: '+paper.first.conflicts+' MODEL overlaps. NOW: '+paper.now.conflicts+
  ' after Milo tested Finn\'s longer detour for Milo, another traveler and water. '+
  'The route is PAPER only; real passage, drainage and lighting are NOT approved.':
  'No child-checked E07 PAPER connector is linked to this independent E08 visit.';
 $('connector-finn-revisit').textContent=paper?.finnRevisit||'';
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
  (linkedE04?'E04 sincere memories remain undated; E05 station sources remain MOCK. ':'')+
  (v.lowerLightsPaperOn?'Milo kept two PAPER viewpoints of the same fixed marks; no real lights were restored.':
   'No E08 PAPER viewpoint record yet.');
 const back=$('e07-return'),fragment=linkedE07&&(linkedE04?
  encodeMemoryLantern(linkedE04,linkedE05,linkedE06,linkedE07,state):
  encodeStepsTransfer(linkedE07,state,linkedE06));
 back.hidden=!fragment;if(fragment)back.href='../e07-scene/'+fragment;
 const hill=$('e09-transfer'),hillFragment=v.lowerLightsPaperOn&&(
  linkedE04?encodeMemoryHill(linkedE04,linkedE05,linkedE06,linkedE07,state,linkedE09||freshE09()):
  encodeHillTransfer(state,linkedE09||freshE09(),linkedE07,linkedE06));
 hill.hidden=!hillFragment;if(hillFragment)hill.href='../e09-scene/'+hillFragment;
 const hillNotes=linkedE09&&v.lowerLightsPaperOn?viewE09(linkedE09):null;
 const earnedQuestions=hillNotes?.sightlineBoard.compared&&
  hillNotes.sightlineBoard.placements.light==='fence_view'&&
  hillNotes.sightlineBoard.placements.view==='overlook';
 $('steps-world').dataset.hillReturn=earnedQuestions?'revised':'unverified';
 if(!earnedQuestions)selectedHillQuestion=null;
 $('hill-question-panel').hidden=!earnedQuestions;
 for(const button of document.querySelectorAll('[data-hill-question]')){
  button.setAttribute('aria-pressed',String(earnedQuestions&&selectedHillQuestion===button.dataset.hillQuestion));
 }
 $('hill-question-detail').textContent=!earnedQuestions?'No verified PAPER question locations yet.':
  selectedHillQuestion==='light'?'Milo checks ?L: the E09 fence-view LIGHT question. Nia: This is a question, not a safe light or an approved route.':
  selectedHillQuestion==='view'?'Milo checks ?V: the E09 overlook VIEWPOINT question. Finn: We can return to E09 and revise it; North Hill stays CLOSED.':
  'Milo can inspect ?L or ?V on this synthetic plan, then return to E09 to revise the question.';
 $('e09-callback').textContent=earnedQuestions?
  'Nia: Milo, your revised PAPER questions connect the safe fence lookout and overlook. The marks on our Steps model stay fixed; the hill remains CLOSED. We can revisit and change those questions.':
  hillNotes?'Finn: We kept '+linkedE09.history.length+
   ' PAPER survey steps, but have not matched both safe future questions. Let us try again; the hill stays CLOSED.':
  'The safe hill survey is a separate PAPER rehearsal, not a production unlock.';
 if(s.previewComplete){drawTrace(s,v.reviewMode);
  $('trace-detail').textContent=v.reviewMode==='first'?'FROM HERE: '+spread(s.firstView):
   v.reviewMode==='second'?'FROM THERE: '+spread(s.secondView):
   'FIRST: '+spread(s.firstView)+' | SECOND: '+spread(s.secondView)+'. A/B/C never moved; Milo changed viewpoint.';
 }else{$('trace-map').replaceChildren();$('trace-detail').textContent='Finish the PAPER comparison to trace both views.';}
 $('note').textContent=s.paperNote;
 $('hook').textContent=v.lowerLightsPaperOn?'Next question: survey North Hill from a safe place. E09 NOT UNLOCKED.':'The service plate date and source are UNKNOWN. No E09 unlock.';
 draw(s);drawLiveView(s);drawShadow();drawConnectorCallback();drawApproach(approachFrame(linkedE07,state,approach.layout,approach.view));
 for(const [key,,action] of rows)document.querySelector('[data-key="'+key+'"]').disabled=!can(state,action);
 for(const el of document.querySelectorAll('[data-anchor]'))el.dataset.here=String(el.dataset.anchor===s.milo);
}
render();
