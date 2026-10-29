// E10 courtyard authoring lab. Synthetic-only; no production imports, storage, network or unlock.
import {NODES,CLOSED_NODE,EDGES,TRACES,NEEDS,USE_TAGS,SLOTS,
  fresh,dispatch,previewProjection} from '../engine/s01e10-authoring-prototype.mjs';

const $=id=>document.getElementById(id);
const names={entry:'Entry',stone_edge:'Stone edge',notice_wall:'Notice wall',
  quiet_corner:'Quiet corner',meeting_edge:'Meeting edge'};
const traceNames={surface:'Worn strip',holes:'Mounting holes'};
const needNames={quiet:'quiet reader',activity:'activity group'};
const slotNames={left:'Left',right:'Right',shared:'Shared'};
const coords={entry:[13,56],stone_edge:[37,30],notice_wall:[37,75],
  quiet_corner:[69,28],meeting_edge:[78,74],closed_hill:[89,11]};
let state=fresh();
const actor=document.createElement('div');
actor.className='milo';actor.textContent='Milo';actor.setAttribute('aria-hidden','true');
const adjacent=(a,b)=>EDGES.some(([x,y])=>(x===a&&y===b)||(x===b&&y===a));
function act(action){state=dispatch(state,action);render();}
function button(host,label,action,disabled=false,pressed=false){
  const b=document.createElement('button');b.type='button';b.textContent=label;
  b.disabled=disabled;if(pressed)b.setAttribute('aria-pressed','true');
  b.addEventListener('click',()=>act(action));host.append(b);return b;
}
function line(host,a,b,cls=''){
  const w=host.clientWidth,h=host.clientHeight;
  const x1=coords[a][0]*w/100,y1=coords[a][1]*h/100;
  const x2=coords[b][0]*w/100,y2=coords[b][1]*h/100;
  const e=document.createElement('div');e.className='edge '+cls;
  e.style.left=x1+'px';e.style.top=y1+'px';
  e.style.width=Math.hypot(x2-x1,y2-y1)+'px';
  e.style.transform='rotate('+Math.atan2(y2-y1,x2-x1)+'rad)';
  host.append(e);
}
function world(){
  const host=$('scene');host.replaceChildren();
  const tag=document.createElement('span');tag.className='world-label';
  tag.textContent='SYNTHETIC COURTYARD';host.append(tag);
  const warning=document.createElement('span');warning.className='closed-label';
  warning.textContent='CLOSED HILL — NO ENTRY';host.append(warning);
  for(const [a,b] of EDGES)line(host,a,b);
  line(host,'meeting_edge',CLOSED_NODE,'closed');
  for(const id of NODES){
    const b=document.createElement('button');b.type='button';
    b.className='anchor'+(state.position===id?' active':'');
    b.textContent=names[id];b.setAttribute('aria-label','Walk Milo to '+names[id]);
    b.disabled=state.finished||!adjacent(state.position,id);
    b.style.left=coords[id][0]+'%';b.style.top=coords[id][1]+'%';
    b.addEventListener('click',()=>act({type:'walk',to:id}));host.append(b);
  }
  host.append(actor);
  actor.style.left=coords[state.position][0]+'%';
  actor.style.top=Math.min(90,coords[state.position][1]+15)+'%';
  host.dataset.phase=state.finished?'complete':'explore';
}
function movement(){
  const host=$('walk-controls');host.replaceChildren();
  for(const id of NODES)
    button(host,'Go to '+names[id],{type:'walk',to:id},
      state.finished||!adjacent(state.position,id));
  const ins=$('inspect-controls');ins.replaceChildren();
  for(const [id,t] of Object.entries(TRACES))
    button(ins,'Look: '+traceNames[id],{type:'inspect',traceId:id},
      state.finished||state.position!==t.at||state.inspected.includes(id));
  const boundary=$('boundary-controls');boundary.replaceChildren();
  button(boundary,'Try closed hill (stop safely)',{type:'walk',to:CLOSED_NODE},
    state.finished||state.position!=='meeting_edge');
  $('feedback').textContent=state.feedback;
  $('walk-status').textContent='Milo: '+names[state.position]+'. Observed: '+
    (state.inspected.map(id=>traceNames[id]).join(', ')||'none yet')+
    '. Safe stop attempts: '+state.blockedAttempts+'.';
  $('parent-cue-evidence').hidden=state.inspected.length<2||state.finished;
}
function hypotheses(){
  const host=$('hypothesis-controls');host.replaceChildren();
  for(const id of Object.keys(TRACES)){
    const tags=state.hypotheses[id];
    if(!tags.length){
      const first=id==='surface'?'passing':'display';
      button(host,'Try: '+first+' at '+traceNames[id],
        {type:'suggest',traceId:id,useTag:first},
        state.finished||!state.inspected.includes(id));
    }else{
      const first=tags[0];
      const next=first==='passing'?'meeting':first==='display'?'resting':'passing';
      button(host,'Revise: '+first+' to '+next,
        {type:'revise',traceId:id,oldTag:first,newTag:next},
        state.finished||tags.includes(next));
      button(host,'Remove: '+first+' at '+traceNames[id],
        {type:'remove',traceId:id,useTag:first},state.finished);
    }
  }
  $('hypothesis-status').textContent=Object.keys(TRACES).map(id=>
    traceNames[id]+': '+(state.hypotheses[id].map(t=>'MAYBE '+t).join(', ')||'not yet guessed')
  ).join(' | ')+'. A MAYBE is not proof.';
}
function source(){
  const host=$('source-controls');host.replaceChildren();
  button(host,'Compare symbol shape',{type:'compare-symbol'},
    state.finished||state.position!=='entry'||state.symbolCompared);
  button(host,'Enable SYNTHETIC name fixture (test only)',{type:'enable-fixture'},
    state.finished||state.fixtureEnabled,state.fixtureEnabled);
  button(host,'Check name source',{type:'check-source'},
    state.finished||!state.symbolCompared||state.inspected.length!==2||state.sourceChecked);
  const p=previewProjection(state);
  $('name-status').textContent='Source: '+p.sourceStatus+
    (p.testName?' | SYNTHETIC TEST TOKEN: '+p.testName+' — NOT APPROVED HISTORY':'')+
    '. Symbol shape alone proves no name.';
}
function needs(){
  const host=$('need-controls');host.replaceChildren();
  for(const [id,n] of Object.entries(NEEDS)){
    button(host,'Listen: '+needNames[id],{type:'hear',needId:id},
      state.finished||state.position!==n.at||state.heard.includes(id));
    for(const slot of SLOTS){
      button(host,(state.board[id]===slot?'Placed ':'Place ')+id+': '+slotNames[slot],
        {type:'place',needId:id,slot},
        state.finished||!state.heard.includes(id)||state.board[id]===slot,
        state.board[id]===slot);
    }
  }
  const board=$('board');board.replaceChildren();
  for(const slot of SLOTS){
    const col=document.createElement('div');col.className='board-slot';
    const title=document.createElement('strong');title.textContent=slotNames[slot];col.append(title);
    const members=Object.keys(state.board).filter(id=>state.board[id]===slot);
    const contents=document.createElement('span');
    contents.textContent=members.length?members.map(id=>needNames[id]+' (simulated)').join('; '):
      'No paper card';col.append(contents);board.append(col);
  }
  $('parent-cue-needs').hidden=state.heard.length<2||state.finished;
}
function items(id,values){
  const host=$(id);host.replaceChildren();
  for(const v of values){
    const li=document.createElement('li');li.textContent=v;host.append(li);
  }
}
function notebook(){
  const p=previewProjection(state);
  items('seen',p.cards.seen.length?p.cards.seen.map(x=>x.text):['Not observed yet.']);
  items('maybe',p.cards.maybe.length?p.cards.maybe.map(x=>traceNames[x.traceId]+': MAYBE '+x.useTag):
    ['No past-use guesses yet.']);
  items('needs',p.cards.needs.length?p.cards.needs.map(x=>
    x.role+' needs '+x.want+' (simulated; '+(x.slot||'not placed')+')'):
    ['No present-day needs heard yet.']);
  items('unknown',p.cards.unknown);
  const host=$('finish-controls');host.replaceChildren();
  const bothTraces=Object.keys(TRACES).every(id=>state.hypotheses[id].length>0);
  const bothNeeds=Object.keys(NEEDS).every(id=>state.heard.includes(id)&&
    Object.hasOwn(state.board,id));
  button(host,'Compare needs tradeoff',{type:'review-tradeoff'},
    state.finished||!bothTraces||!bothNeeds||state.tradeoffReviewed);
  button(host,'Review four kinds of notes',{type:'review'},
    state.finished||state.inspected.length!==2||!state.symbolCompared||
    !bothTraces||!bothNeeds||!state.sourceChecked||!state.tradeoffReviewed||state.reviewed);
  button(host,'Finish SYNTHETIC preview',{type:'finish-preview'},
    state.finished||!state.reviewed||!state.fixtureEnabled||!state.nameRevealed);
  $('chronicle').textContent='AUTHORING ONLY: '+p.cards.seen.length+' SEEN; '+
    p.cards.maybe.length+' MAYBE; '+p.cards.needs.length+' NEEDS; '+
    p.cards.unknown.length+' UNKNOWN. Canonical events: 0; E11 unlocks: 0; historical claims: 0.';
  $('hook').hidden=!state.finished;
  $('hook').textContent=state.finished?
    'SYNTHETIC MODEL COMPLETE — E11 remains NOT UNLOCKED. What would a fair shared-space layout need? Nothing has been built.':'';
}
function render(){world();movement();hypotheses();source();needs();notebook();}
$('restart').addEventListener('click',()=>act({type:'reset'}));
window.addEventListener('resize',world);
render();
