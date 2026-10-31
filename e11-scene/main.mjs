// E11 independent PAPER scene. Reuses the strict fictional reducer; never unlocks production.
import {START,BOUNDARY,TOKENS,USERS,EVIDENCE,SAFE_LINKS,
  fresh,dispatch,projection} from '../engine/s01e11-authoring-prototype.mjs';
import {paperRevisit} from './revisit-model.mjs';
import {inspectPaperRole} from './role-inspection.mjs';
import {PAPER_QUESTIONS,PAPER_CHECKS,draftPaperVerification} from './verification-plan.mjs';
const $=id=>document.getElementById(id);
const titles={quiet:'Quiet seat',activity:'Activity area',access:'Access strip',
 quiet_reader:'Quiet reader',activity_group:'Activity group',
 e03_delivery:'E03 delivery',e06_drainage:'E06 water',e07_user_impact:'E07 shared use',
 e09_closure:'E09 closed hill',e10_needs:'E10 needs'};
const toolNames={walk:'Walk Milo',quiet:'Place quiet seat',activity:'Place activity area'};
let state=fresh(),tool='walk',begun=false,screen='trial',revisitFocus='quiet_reader',roleCell=null;
let selectedUnknown=null,draftChecks={},planFeedback='';
function clearPlan(){selectedUnknown=null;draftChecks={};planFeedback='';}
const adjacent=(a,b)=>{const [r,c]=a.split(',').map(Number),[s,d]=b.split(',').map(Number);return Math.abs(r-s)+Math.abs(c-d)===1;};
const validCell=x=>/^[0-2],[0-3]$/.test(x)&&!BOUNDARY.includes(x);
function act(action){state=dispatch(state,action);render();}
function button(host,name,handler,disabled=false,pressed=false){
 const b=document.createElement('button');b.type='button';b.textContent=name;b.disabled=disabled;
 if(pressed)b.setAttribute('aria-pressed','true');
 b.addEventListener('click',handler);host.append(b);return b;
}
function controls(){
 const host=$('tools');host.replaceChildren();
 for(const [id,name] of Object.entries(toolNames))
  button(host,name,()=>{tool=id;render();},false,tool===id);
 $('access').disabled=state.layout.access.length>0;
 $('lift-quiet').disabled=!state.layout.quiet.length;
 $('lift-activity').disabled=!state.layout.activity.length;
}
function board(){
 const host=$('grid');host.replaceChildren();
 for(let r=0;r<3;r++)for(let c=0;c<4;c++){
  const cell=r+','+c,blocked=BOUNDARY.includes(cell);
  const quiet=state.layout.quiet.includes(cell),activity=state.layout.activity.includes(cell);
  const access=state.layout.access.includes(cell),milo=state.position===cell;
  const b=document.createElement('button');b.type='button';b.className='cell';
  if(blocked)b.classList.add('boundary');
  if(quiet)b.classList.add('quiet');if(activity)b.classList.add('activity');
  if(access)b.classList.add('access');if(milo)b.classList.add('milo');
  b.setAttribute('aria-label','Cell '+cell);
  const name=document.createElement('span');name.textContent=cell;
  const details=document.createElement('small');
  details.textContent=[blocked?'BOUNDARY':'',milo?'Milo':'',quiet?'Quiet':'',activity?'Activity':'',access?'Access':''].filter(Boolean).join(' · ')||'Open';
  b.append(name,details);
  if(tool==='walk'){
   b.disabled=blocked||!adjacent(state.position,cell);
   b.addEventListener('click',()=>act({type:'move-milo',to:cell}));
  }else{
   b.disabled=!validCell(cell)||[START,'1,3'].includes(cell)||
    (tool==='quiet'&&activity)||(tool==='activity'&&quiet)||
    state.layout[tool].includes(cell);
   b.addEventListener('click',()=>act({type:'place',tokenId:tool,cells:[cell]}));
  }
  host.append(b);
 }
 $('position').textContent='Milo at '+state.position+' · selected tool: '+toolNames[tool]+
  ' · safe stops at occupied cells: '+state.blockedAttempts+'.';
 $('feedback').textContent=state.feedback.replace(/\bCommon\b/g,'the unnamed place');
}
function tests(){
 const host=$('tests');host.replaceChildren();
 for(const id of USERS)button(host,'Test '+titles[id],
  ()=>act({type:'test-user',userId:id}),Object.hasOwn(state.tests,id));
 const result=$('test-results');
 result.textContent=USERS.map(id=>titles[id]+': '+(!Object.hasOwn(state.tests,id)?'not tested':
  (state.tests[id].passed?'PASS':'RETRY')+' — '+state.tests[id].reason)).join(' | ');
 $('parent-cue').hidden=!Object.values(state.tests).some(t=>!t.passed)&&state.blockedAttempts===0;
 const trialHost=$('trial-controls');trialHost.replaceChildren();
 button(trialHost,'Save tested trial',()=>act({type:'snapshot-trial'}),
  !USERS.every(id=>Object.hasOwn(state.tests,id))||
  state.trials.some(t=>t.revision===state.revision));
 const cards=$('trials');cards.replaceChildren();
 for(const t of state.trials){
  const div=document.createElement('div');div.className='trial';
  const title=document.createElement('strong');title.textContent=t.id+' · revision '+t.revision;
  const detail=document.createElement('p');
  detail.textContent='Quiet '+(t.layout.quiet[0]||'none')+', activity '+(t.layout.activity[0]||'none')+
   ' · reader '+(t.tests.quiet_reader?.passed?'PASS':'RETRY')+
   ', group '+(t.tests.activity_group?.passed?'PASS':'RETRY');
  div.append(title,detail);cards.append(div);
 }
}
function comparison(){
 const host=$('compare-controls');host.replaceChildren();
 const first=state.trials[0],last=state.trials[state.trials.length-1];
 button(host,'Compare FIRST and NOW',()=>act({type:'compare-trials',first:first.id,second:last.id}),
  !first||!last||first===last||!!state.comparison);
 $('comparison').textContent=state.comparison?
  'FIRST '+state.comparison.first+' → NOW '+state.comparison.second+
  '. '+state.comparison.limitation:
  'Change a piece, retest both users, save a second trial, then compare.';
 const refs=$('citation-controls');refs.replaceChildren();
 for(const id of EVIDENCE)button(refs,'Recall '+titles[id],()=>act({type:'cite-earlier',discoveryId:id}),
  state.citation===id,state.citation===id);
 $('citation').textContent=state.citation?
  'SYNTHETIC earlier-discovery label: '+titles[state.citation]+'. No verified source or canonical E10 handoff.':
  'No earlier model clue selected.';
}
function map(){
 const host=$('map');host.replaceChildren();
 for(const [id,nodes] of Object.entries(SAFE_LINKS)){
  const chosen=state.loopEdges.includes(id);
  button(host,(chosen?'Remove link: ':'Add link: ')+nodes.map(x=>x==='common'?'unnamed place':x).join(' ↔ '),
   ()=>act({type:chosen?'remove-loop-edge':'add-loop-edge',edgeId:id}),false,chosen);
 }
 $('check-loop').disabled=state.loopChecked;
 $('loop-status').textContent='Chosen links: '+(state.loopEdges.join(', ')||'none')+
  '. Connected current cycle: '+(state.loopChecked?'YES — FICTIONAL ONLY':'not established')+
  '. Historic hill remains CLOSED.';
}
function review(){
 const host=$('review-controls');host.replaceChildren();
 button(host,'Review NONCANONICAL finale',()=>act({type:'review-preview'}),
  state.reviewed||!state.comparison||!state.citation||!state.loopChecked||
  !USERS.every(id=>state.tests[id]?.passed));
 const p=projection(state);
 $('chronicle').textContent='AUTHORING ONLY · '+(state.reviewed?'model review recorded':'model review pending')+
  ' · old map: '+p.oldMapStatus+' · new map: '+p.currentMapStatus+
  ' · canonical events: '+p.canonicalEvents.length+'; unlocks: '+p.unlocks.length+
  '; historical claims: '+p.historicalClaims.length+'; finished: '+p.finished+'.';
 $('hook').hidden=!state.reviewed;
 $('hook').textContent=state.reviewed?
  'Milo: "We changed it because both people matter." What real evidence and permissions are still missing? The unnamed place is NOT OPEN; Season 1 is NOT COMPLETE.':'';
}

function miniBoard(host,trial,focus,stage){
 host.replaceChildren();
 host.setAttribute('aria-label',stage+' fictional paper board for '+titles[focus]);
 for(let r=0;r<3;r++)for(let c=0;c<4;c++){
  const cell=r+','+c,quiet=trial.layout.quiet.includes(cell),
   activity=trial.layout.activity.includes(cell),
   access=trial.layout.access.includes(cell),closed=BOUNDARY.includes(cell);
  const mark=document.createElement(stage==='FIRST'?'button':'span');mark.className='mini-cell';
  if(stage==='FIRST'){
   mark.type='button';mark.dataset.cell=cell;
   mark.setAttribute('aria-label','Inspect FIRST cell '+cell);
   mark.addEventListener('click',()=>{
    if(roleCell!==cell)clearPlan();
    roleCell=cell;worldRevisit();
    const next=[...$('revisit-first').querySelectorAll('button')].find(b=>b.dataset.cell===cell);
    next?.focus();
   });
  }
  if(closed)mark.classList.add('mini-closed');
  if(access)mark.classList.add('mini-access');
  if(quiet)mark.classList.add('mini-quiet');
  if(activity)mark.classList.add('mini-activity');
  if((focus==='quiet_reader'&&quiet)||(focus==='activity_group'&&activity))
   mark.classList.add('mini-focus');
  mark.textContent=closed?'CLOSED':quiet?'Quiet':activity?'Activity':access?'Way':'·';
  mark.setAttribute('aria-label',stage==='FIRST'?'Inspect FIRST cell '+cell:
   cell+': '+(closed?'closed boundary':quiet?'quiet seat':
   activity?'activity area':access?'access strip':'empty paper cell'));
  host.append(mark);
 }
}
function verificationPlan(){
 const inspection=roleCell?inspectPaperRole(state,revisitFocus,roleCell):null;
 const host=$('verification-plan');host.hidden=!inspection?.found;
 if(!inspection?.found)return;
 const questions=$('unknown-cards');questions.replaceChildren();
 for(const q of PAPER_QUESTIONS)
  button(questions,'Unknown: '+q.label,()=>{
   selectedUnknown=q.id;planFeedback='Choose a future check station for this question.';verificationPlan();
  },false,selectedUnknown===q.id);
 const stations=$('check-stations');stations.replaceChildren();
 for(const check of PAPER_CHECKS)
  button(stations,check.label,()=>{
   const result=draftPaperVerification(state,revisitFocus,roleCell,selectedUnknown,check.id);
   if(!result)return;
   planFeedback=result.feedback;
   if(result.matched)draftChecks[selectedUnknown]=result.draft;
   verificationPlan();
  },!selectedUnknown);
 $('plan-feedback').textContent=planFeedback||
  'Milo: "Which question should we plan to check outside this paper model?"';
 const cards=$('draft-checks');cards.replaceChildren();
 for(const q of PAPER_QUESTIONS){
  const line=document.createElement('p');
  line.textContent=draftChecks[q.id]||q.label+' — still needs a plan';
  cards.append(line);
 }
 $('plan-finish').textContent=PAPER_QUESTIONS.every(q=>draftChecks[q.id])?
  'Three future checks drafted, ZERO performed. Nia: "We must ask, inspect and get permission before anyone opens this place."':
  'A plan is not real testimony, an inspection, permission or a completed season.';
}
function worldRevisit(){
 const model=paperRevisit(state,revisitFocus);
 $('revisit').hidden=!model;
 if(!model){roleCell=null;clearPlan();return;}
 const choices=$('revisit-focus');choices.replaceChildren();
 for(const [id,name] of [['quiet_reader','Trace quiet reader'],['activity_group','Trace activity group']])
  button(choices,name,()=>{revisitFocus=id;roleCell=null;clearPlan();worldRevisit();},false,revisitFocus===id);
 miniBoard($('revisit-first'),model.first,revisitFocus,'FIRST');
 miniBoard($('revisit-now'),model.now,revisitFocus,'NOW');
 $('revisit-first-result').textContent='FIRST '+titles[revisitFocus]+': '+
  (model.firstPass?'PASS':'RETRY')+' — '+model.first.tests[revisitFocus].reason;
 $('revisit-now-result').textContent='NOW '+titles[revisitFocus]+': '+
  (model.nowPass?'PASS':'RETRY')+' — '+model.now.tests[revisitFocus].reason;
 const inspected=roleCell?inspectPaperRole(state,revisitFocus,roleCell):null;
 $('role-response').textContent=inspected?.response||'Milo: "Choose a FIRST piece to inspect."';
 $('role-dialogue').textContent=inspected?.found?inspected.finn+' '+inspected.nia:'';
 $('role-next').textContent=inspected?.found?inspected.nextQuestion:
  'The model is not a real consultation. We can try again.';
 verificationPlan();
 $('revisit-world').textContent=model.reviewed?
  'PAPER revisit: '+model.links.join(' | ')+
  '. Recalled synthetic label: '+(titles[model.recalled]||'none')+
  '. North Hill CLOSED; unnamed place NOT OPEN; no actual access, Chronicle or season completion.':
  'Both boards come from Milo\'s saved model trials. The new loop is not yet reviewed; no real place is open.';
}

function render(){
 $('begin').hidden=begun;
 $('e11-work').hidden=!begun||screen==='callback';
 $('e10-notes').hidden=screen!=='callback';
 $('e11-back').hidden=screen!=='callback';
 $('e10-callback').disabled=!state.reviewed||screen==='callback';
 $('story-line').textContent=state.reviewed?
  'Milo revised a paper layout and a model loop. Nia keeps the real-world questions open.':
  (Object.values(state.tests).some(t=>!t.passed)?
   'Milo stops at a conflict. Finn: "Who needs this way?" Try moving a piece.':
   'Two simulated needs share one small model. Milo can test, move, compare and try again.');
 controls();board();tests();comparison();map();review();worldRevisit();
}
$('access').addEventListener('click',()=>act({type:'place',tokenId:'access',cells:['1,1','1,2']}));
$('lift-quiet').addEventListener('click',()=>act({type:'lift',tokenId:'quiet'}));
$('lift-activity').addEventListener('click',()=>act({type:'lift',tokenId:'activity'}));
$('check-loop').addEventListener('click',()=>act({type:'check-loop'}));
$('begin').addEventListener('click',()=>{begun=true;render();});
$('e10-callback').addEventListener('click',()=>{if(state.reviewed){screen='callback';render();}});
$('e11-back').addEventListener('click',()=>{screen='trial';render();});
$('restart').addEventListener('click',()=>{tool='walk';begun=false;screen='trial';revisitFocus='quiet_reader';roleCell=null;clearPlan();act({type:'reset'});});
render();
