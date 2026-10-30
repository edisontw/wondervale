import {fresh,dispatch,can,view} from './scene-model.mjs';
let state=fresh();
const $=id=>document.getElementById(id);
const garden=(type,value)=>({scene:'garden',action:value===undefined?{type}:{type,value}});
const nav=type=>({scene:'nav',type});
const current=[
  ['start','Begin garden story',garden('start')],
  ['bed','Inspect healthy bed',garden('inspect','present-bed')],
  ['slope-walk','Milo: walk to slope',garden('walk','slope')],
  ['slope','Inspect slope',garden('inspect','slope')],
  ['path-walk','Milo: walk to shared path',garden('walk','shared-path')],
  ['path','Inspect shared path',garden('inspect','shared-path')],
  ['tray-walk','Milo: walk to MODEL tray',garden('walk','model-tray')],
  ['dry','Set DRY',garden('weather','dry')],
  ['rain','Set RAIN',garden('weather','rain')],
  ['open','Open MODEL channel',garden('channel','open')],
  ['blocked','Block MODEL channel',garden('channel','blocked')],
  ['run','Run MODEL tray',garden('run')],
  ['compare','Compare MODEL runs',garden('compare')],
  ['enter','Walk to Lower Garden PAPER model',garden('enter')]
];
const lower=[
  ['trace','Inspect runoff trace',garden('inspect','runoff-trace')],
  ['path-walk','Milo: walk to public path',garden('walk','public-path')],
  ['path','Inspect public path',garden('inspect','public-path')],
  ['channel-walk','Milo: walk to runoff channel',garden('walk','runoff-channel')],
  ['channel-place','Try marker in water route',garden('place','runoff-channel')],
  ['footpath-walk','Milo: walk to footpath',garden('walk','footpath')],
  ['footpath-place','Try marker on footpath',garden('place','footpath')],
  ['pocket-walk','Milo: walk to raised pocket',garden('walk','raised-pocket')],
  ['pocket-place','Move marker to raised pocket',garden('place','raised-pocket')],
  ['check','Check water and people',garden('check')],
  ['think','I think: keep the path open',garden('think','keep-path')],
  ['unsure','I need more evidence',garden('think','need-more')],
  ['finish','Keep small PAPER pocket plan',garden('finish')]
];
const navigation=[
  ['to-current','Revisit healthy Current Garden',nav('to-current')],
  ['to-lower','Return to Lower Garden model',nav('to-lower')],
  ['restart','Restart both PAPER garden scenes',nav('restart')]
];
function buttons(id,rows){
  const root=$(id);root.replaceChildren();
  for(const [key,label,action] of rows){
    const b=document.createElement('button');
    b.type='button';b.dataset.key=key;b.textContent=label;
    b.disabled=!can(state,action);
    b.addEventListener('click',()=>{state=dispatch(state,action);render();});
    root.append(b);
  }
}
function render(){
  const v=view(state),g=v.garden;
  $('current-scene').hidden=v.screen!=='current';
  $('lower-scene').hidden=v.screen!=='lower';
  $('current-world').dataset.done=String(v.currentCompared);
  $('lower-world').dataset.done=String(v.lowerPaperStarted);
  $('current-world-note').textContent='Healthy present beds remain. '+(v.currentCompared?
    'MODEL water comparison completed.':'MODEL water comparison open.');
  $('lower-world-note').textContent=v.lowerPaperStarted?
    'A removable PAPER pocket plan remains. No real plants or growth.':
    v.lowerVisited?'Lower garden MODEL inspected; no approved planting.':'Not visited yet.';
  $('stage').textContent='Viewing '+(v.screen==='current'?'Current Garden':'Lower Garden')+
    ' · model phase '+g.phase+' · production entry LOCKED';
  $('speaker').textContent=g.speaker;
  $('line').textContent=g.line;
  $('milo').textContent='Milo at '+g.milo;
  $('tray').textContent='PAPER tray: '+g.runs.length+' run(s). Weather '+g.weather+
    '; channel '+g.channel+'; compared '+g.modelCompared+'. A model is not historical proof.';
  $('upper-observations').textContent='Observed now: '+(g.observedCurrent.join(', ')||'nothing yet');
  $('lower-observations').textContent='Observed MODEL: '+(g.observedLower.join(', ')||'nothing yet');
  const last=g.attempts.at(-1);
  $('marker').textContent='Temporary marker: '+(g.markerSite||'not placed')+
    (last?' · last check: '+(last.wet?'WET in model':last.blocksPath?'BLOCKS path':'model path and water clear'):' · not checked');
  $('note').textContent=v.paperChronicle;
  $('parent').textContent='Optional parent question: '+v.parentCue;
  buttons('current-actions',current);
  buttons('lower-actions',lower);
  buttons('nav-actions',navigation);
}
render();
