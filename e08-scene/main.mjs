import {fresh,dispatch,can,view} from './scene-model.mjs';
import {MARKERS,VIEWPOINTS} from '../engine/s01e08-authoring-prototype.mjs';
let state=fresh();const $=id=>document.getElementById(id);
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
 ['connector','Review Finn\'s PAPER connector',n('connector')],
 ['steps','Return to lower Steps',n('steps')],
 ['restart','Restart E08 PAPER model',n('restart')]
];
const groups={'walk-controls':rows.slice(0,4),'inspect-controls':rows.slice(4,9),
 'lamp-controls':rows.slice(9,11),'observe-controls':rows.slice(11,14),'nav-controls':rows.slice(14)};
for(const [host,items] of Object.entries(groups))for(const [key,label,action] of items){
 const b=document.createElement('button');b.type='button';b.dataset.key=key;b.textContent=label;
 b.addEventListener('click',()=>{state=dispatch(state,action);render();});$(host).append(b);
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
function render(){
 const v=view(state),s=v.story;
 $('step-scene').hidden=v.screen!=='steps';$('connector-revisit').hidden=v.screen!=='connector';
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
 $('steps-world-note').textContent=v.lowerLightsPaperOn?'Lower model lamps ON; real lights NOT restored. Upper hill CLOSED.':'Lower model lamps are not a real repair. Upper hill CLOSED.';
 $('note').textContent=s.paperNote;
 $('hook').textContent=v.lowerLightsPaperOn?'Next question: survey North Hill from a safe place. E09 NOT UNLOCKED.':'The service plate date and source are UNKNOWN. No E09 unlock.';
 draw(s);
 for(const [key,,action] of rows)document.querySelector('[data-key="'+key+'"]').disabled=!can(state,action);
 for(const el of document.querySelectorAll('[data-anchor]'))el.dataset.here=String(el.dataset.anchor===s.milo);
}
render();