// E11 independent PAPER scene. Reuses the strict fictional reducer; never unlocks production.
import {START,BOUNDARY,TOKENS,USERS,EVIDENCE,SAFE_LINKS,
  fresh,dispatch,projection} from '../engine/s01e11-authoring-prototype.mjs';
import {paperRevisit} from './revisit-model.mjs';
import {paperLoopVisual} from './loop-visual.mjs';
import {paperGardenRevisit} from './garden-revisit.mjs';
import {paperReturnRoute,WALK_LABELS} from './return-route.mjs';
import {paperReturnReflection} from './return-reflection.mjs';
import {paperReflectionWorld} from './reflection-world.mjs';
import {paperReflectionFollowUp} from './reflection-follow-up.mjs';
import {paperFollowUpMap,PAPER_CHECK_STOPS} from './follow-up-map.mjs';
import {paperE10NeedsRevisit} from './e10-needs-revisit.mjs';
import {inspectPaperRole} from './role-inspection.mjs';
import {PAPER_QUESTIONS,PAPER_CHECKS,draftPaperVerification} from './verification-plan.mjs';
import {view as viewE10} from '../authoring-labs/unnamed-story-model.mjs';
import {encodeLoopTransfer,decodeLoopTransfer} from '../authoring-labs/e10-e11-scene-transfer.mjs';
import {paperChronicle} from '../authoring-labs/e03-e11-paper-chronicle.mjs';
const $=id=>document.getElementById(id);
const titles={quiet:'Quiet seat',activity:'Activity area',access:'Access strip',
 quiet_reader:'Quiet reader',activity_group:'Activity group',
 e03_delivery:'E03 delivery',e06_drainage:'E06 water',e07_user_impact:'E07 shared use',
 e09_closure:'E09 closed hill',e10_needs:'E10 needs'};
const toolNames={walk:'Walk Milo',quiet:'Place quiet seat',activity:'Place activity area'};
const incoming=decodeLoopTransfer(location.hash);
const linkedE10=incoming?.e10||null,upstream=incoming?.upstream||null;
let state=incoming?.e11||fresh(),tool='walk',begun=!!incoming?.e11?.history.length,
 screen='trial',revisitFocus='quiet_reader',roleCell=null,mapView='now';
let selectedUnknown=null,draftChecks={},planFeedback='',returnSteps=[],
 reflectionChoices={},reflectionFocus=null,followUpQuestion=null,followUpAction=null,
 followUpStop=null;
function clearPlan(){selectedUnknown=null;draftChecks={};planFeedback='';}
function clearReflection(){reflectionChoices={};reflectionFocus=null;followUpQuestion=null;followUpAction=null;followUpStop=null;}
const adjacent=(a,b)=>{const [r,c]=a.split(',').map(Number),[s,d]=b.split(',').map(Number);return Math.abs(r-s)+Math.abs(c-d)===1;};
const validCell=x=>/^[0-2],[0-3]$/.test(x)&&!BOUNDARY.includes(x);
function act(action){returnSteps=[];clearReflection();state=dispatch(state,action);render();}
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

const SVG_NS='http://www.w3.org/2000/svg';
function svgPart(tag,attributes,text=null){
 const el=document.createElementNS(SVG_NS,tag);
 for(const [key,value] of Object.entries(attributes))el.setAttribute(key,String(value));
 if(text!==null)el.textContent=text;
 return el;
}
function drawPaperLoop(){
 const model=paperLoopVisual(state),svg=$('loop-visual');
 svg.replaceChildren();
 if(!model)return;
 const now=mapView==='now',shown=now?model.selectedCount:0;
 svg.dataset.view=mapView;
 svg.dataset.selectedCount=String(shown);
 svg.dataset.connected=String(now&&model.loopChecked);
 svg.dataset.reviewed=String(now&&model.reviewed);
 svg.setAttribute('aria-label',(now?'NOW':'FIRST')+' fictional PAPER map with '+shown+
  ' chosen model links. North Hill CLOSED; unnamed place NOT OPEN.');
 const nodes=Object.fromEntries(model.nodes.map(n=>[n.id,n]));
 for(const edge of model.edges){
  const a=nodes[edge.from],b=nodes[edge.to],selected=now&&edge.selected;
  const line=svgPart('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,
   stroke:selected?'#246c58':'#b9c7bc','stroke-width':selected?5:2,
   'stroke-linecap':'round','stroke-dasharray':selected?'none':'4 7',
   'data-edge':edge.id,'data-selected':selected});
  svg.append(line);
 }
 for(const node of model.nodes){
  svg.append(svgPart('circle',{cx:node.x,cy:node.y,r:16,
   fill:'#e6ede6',stroke:'#466d61','stroke-width':2}));
  const label=node.label==='Unnamed place'?'Unnamed place':node.label;
  svg.append(svgPart('text',{x:node.x,y:node.y+29,'text-anchor':'middle',
   'font-size':12,fill:'#253f37'},label));
 }
 svg.append(svgPart('rect',{x:326,y:155,width:88,height:68,rx:7,
  fill:'#eee5df',stroke:'#925b52','stroke-width':2}));
 svg.append(svgPart('line',{x1:335,y1:164,x2:405,y2:213,stroke:'#925b52','stroke-width':3}));
 svg.append(svgPart('line',{x1:405,y1:164,x2:335,y2:213,stroke:'#925b52','stroke-width':3}));
 svg.append(svgPart('text',{x:370,y:180,'text-anchor':'middle',
  'font-size':11,'font-weight':'bold',fill:'#5b3029'},'North Hill'));
 svg.append(svgPart('text',{x:370,y:199,'text-anchor':'middle',
  'font-size':12,'font-weight':'bold',fill:'#5b3029'},'CLOSED'));
 $('loop-first').setAttribute('aria-pressed',String(!now));
 $('loop-now').setAttribute('aria-pressed',String(now));
 $('loop-visual-status').textContent=(now?'NOW: '+shown+' child-chosen PAPER links. ':
  'FIRST: no child-chosen links yet. ')+
  (now&&model.loopChecked?'Connected fictional cycle; ':'Cycle not proven in this view; ')+
  (now&&model.reviewed?'Milo reviewed this model. ':'Milo can revise and check again. ')+
  'Dashed links are unchosen candidates, not real paths. North Hill CLOSED; unnamed place NOT OPEN.';
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

function returnRoute(){
 const model=paperReturnRoute(state,returnSteps,upstream);
 const panel=$('return-route');panel.hidden=!model;
 if(!model)return;
 $('return-route-position').textContent='Milo at '+WALK_LABELS[model.at]+
  ' · visited: '+(model.visited.map(id=>WALK_LABELS[id]).join(' + ')||'none')+
  ' · returned with both stops: '+(model.complete?'YES, PAPER ONLY':'not yet')+'.';
 const map=$('return-route-map');map.replaceChildren();
 for(const id of ['square','market','garden','map_room']){
  const stop=document.createElement('div');stop.className='route-stop';
  stop.dataset.place=id;stop.dataset.here=String(model.at===id);
  stop.dataset.visited=String(model.visited.includes(id));
  stop.textContent=(model.at===id?'Milo here · ':'')+WALK_LABELS[id];
  map.append(stop);
 }
 $('return-route-trail').textContent='Milo walked: '+model.trail.map(id=>WALK_LABELS[id]).join(' → ')+
  '. This is a paper sketch, not a verified public path.';
 $('return-route-feedback').textContent=model.feedback;
 $('return-route-garden').textContent=model.gardenNote||
  'Garden stop not visited. No earlier growth is claimed.';
 $('return-route-station').textContent=model.stationNote||
  'Map Room stop not visited. No earlier room change is claimed.';
 const host=$('return-route-controls');host.replaceChildren();
 const labels={
  'square:market':'Try Market PAPER detour',
  'square:garden':'Visit Garden PAPER stop',
  'market:square':'Return to Square PAPER start',
  'garden:square':'Return to Square PAPER start',
  'garden:map_room':'Visit Map Room PAPER stop',
  'map_room:garden':'Return to Garden PAPER stop'
 };
 for(const to of model.choices)
  button(host,labels[model.at+':'+to],()=>{returnSteps=[...returnSteps,to];clearReflection();returnRoute();reflection();},
   returnSteps.length>=24);
 button(host,'Undo last PAPER step',()=>{
  returnSteps=returnSteps.slice(0,-1);clearReflection();returnRoute();reflection();
 },!returnSteps.length);
 button(host,'Restart PAPER return route',()=>{returnSteps=[];clearReflection();returnRoute();reflection();},!returnSteps.length);
 $('return-route-result').textContent=model.complete?
  'PAPER route tested: both stops visited and Milo returned. No real route, Common access or official unlock.':
  'Not complete. Milo must visit both model stops and return to Square; a wrong turn is safe.';
}

function reflection(){
 const model=paperReturnReflection(state,returnSteps,upstream,reflectionChoices);
 const panel=$('return-reflection');panel.hidden=!model;
 if(!model){reflectionWorld();return;}
 const cards=$('reflection-cards');cards.replaceChildren();
 for(const card of model.cards){
  const shelf=card.placed==='paper'?'SEEN IN PAPER':card.placed==='check'?'NEEDS REAL CHECK':'not sorted';
  button(cards,'Choose '+card.label+' · '+shelf,()=>{
   reflectionFocus=card.id;reflection();
  },false,reflectionFocus===card.id);
 }
 const actions=$('reflection-places');actions.replaceChildren();
 for(const [shelf,label] of [['paper','Place under SEEN IN PAPER'],
  ['check','Place under NEEDS REAL CHECK']]){
  button(actions,label,()=>{
   if(!reflectionFocus)return;
   reflectionChoices={...reflectionChoices,[reflectionFocus]:shelf};
    followUpQuestion=null;followUpAction=null;followUpStop=null;
   reflection();
  },!reflectionFocus);
 }
 const chosen=model.cards.find(c=>c.id===reflectionFocus);
 $('reflection-feedback').textContent=!chosen?
  'Milo: "Pick a note. Where does our evidence belong?"':
  !chosen.placed?'Milo: "Try placing this note on a shelf."':
  (chosen.correct?'Nia: "That matches what we can check. "':
   'Nia: "Look again. A PAPER test is not a real-world fact. "')
  +chosen.explanation+' You can move the note again.';
 const shelves=$('reflection-shelves');shelves.replaceChildren();
 for(const [shelf,label] of [['paper','SEEN IN PAPER'],['check','NEEDS REAL CHECK']]){
  const p=document.createElement('p');
  p.textContent=label+': '+(model.cards.filter(c=>c.placed===shelf)
   .map(c=>c.label).join(' · ')||'No notes yet');shelves.append(p);
 }
 $('reflection-result').textContent=model.complete?
  'Four notes sorted. Milo: "Our PAPER world changed, but real facts still need checking." No real planting, public route, official Chronicle or unlock.':
  model.sortedCount+' of 4 notes supported by the model. Move any uncertain note and try again. No real-world facts verified.';
 reflectionWorld();
}

// Reconstruct a visible FIRST/NOW diary only from a completed, strictly replayed
// child return route and all four correctly placed evidence notes.
function reflectionWorld(){
 const world=paperReflectionWorld(state,returnSteps,upstream,reflectionChoices);
 const panel=$('reflection-world');panel.hidden=!world;
 if(!world){$('reflection-follow-up').hidden=true;$('follow-up-map').hidden=true;return;}
 for(const stage of ['first','now']){
  const host=$('reflection-world-'+stage);host.replaceChildren();
  for(const card of world[stage]){
   const note=document.createElement('div');note.className='reflection-note';
   note.dataset.shelf=card.shelf;
   const name=document.createElement('strong');name.textContent=card.label;
   const status=document.createElement('span');
   status.textContent=card.shelf==='paper'?'SEEN IN PAPER':
    card.shelf==='check'?'NEEDS REAL CHECK':'NOT SORTED';
   note.append(name,status);host.append(note);
  }
 }
 $('reflection-world-summary').textContent='Milo moved '+world.paperCount+
  ' verified PAPER model note(s) to SEEN IN PAPER and kept '+world.checkCount+
  ' note(s) for real checks. This is a changed PAPER notebook, not an opened place.';
 $('reflection-chronicle-preview').textContent=world.chroniclePreview;
 reflectionFollowUp();
}

function reflectionFollowUp(){
 const model=paperReflectionFollowUp(state,returnSteps,upstream,reflectionChoices,
  followUpQuestion,followUpAction);
 const panel=$('reflection-follow-up');panel.hidden=!model;
 if(!model){$('follow-up-map').hidden=true;return;}
 const questions=$('follow-up-questions');questions.replaceChildren();
 for(const q of model.unknowns)button(questions,'Question: '+q.label,()=>{
  followUpQuestion=q.id;followUpAction=null;followUpStop=null;reflectionFollowUp();
 },false,followUpQuestion===q.id);
 const actions=$('follow-up-actions');actions.replaceChildren();
 for(const action of model.actions)button(actions,action.label,()=>{
  followUpAction=action.id;followUpStop=null;reflectionFollowUp();
 },!followUpQuestion,followUpAction===action.id);
 $('follow-up-feedback').textContent=model.feedback;
 $('follow-up-diary').textContent=model.diaryLine||
  'PAPER NEXT STEP: none chosen. Real-world facts, permissions and access remain UNKNOWN.';
 followUpMap();
}

function followUpMap(){
 const model=paperFollowUpMap(state,returnSteps,upstream,reflectionChoices,
  followUpQuestion,followUpAction,followUpStop);
 const panel=$('follow-up-map');panel.hidden=!model;
 if(!model)return;
 const controls=$('follow-up-map-controls');controls.replaceChildren();
 for(const stop of PAPER_CHECK_STOPS)button(controls,'Place ? at '+stop.label,()=>{
  followUpStop=stop.id;followUpMap();
 },false,followUpStop===stop.id);
 button(controls,'Remove PAPER question mark',()=>{
  followUpStop=null;followUpMap();
 },!model.markerPlaced);
 for(const stage of ['first','now']){
  const host=$('follow-up-map-'+stage);host.replaceChildren();
  for(const stop of model[stage]){
   const note=document.createElement('div');note.className='check-map-stop';
   note.dataset.place=stop.id;note.dataset.marker=String(stop.marker);
   note.textContent=(stop.marker?'? · ':'')+stop.label;
   host.append(note);
  }
 }
 $('follow-up-map-feedback').textContent=model.feedback;
 $('follow-up-map-diary').textContent=model.chroniclePreview||
  'PAPER MAP: no completed check. Move the question mark to try another place.';
}

function gardenRevisit(){
 const recall=paperGardenRevisit(upstream?.e06);
 const panel=$('garden-revisit');panel.hidden=!recall;
 if(!recall)return;
 $('garden-current').dataset.stage=recall.current.stage;
 $('garden-lower-first').dataset.stage=recall.lower.firstStage;
 $('garden-lower-now').dataset.stage=recall.lower.nowStage;
 $('garden-current-note').textContent=recall.current.note;
 $('garden-lower-first-note').textContent='FIRST: removable PAPER seed marker; no planting.';
 $('garden-lower-now-note').textContent=recall.lower.note;
 $('garden-trials').textContent='Child-tested MODEL water trials: '+recall.lower.trialCount+
  '. Real growth, actual site access, planting/care permission and official unlock: NONE.';
}
function e10NeedsWorld(){
 const atlas=paperE10NeedsRevisit(linkedE10);
 const panel=$('e10-needs-world');panel.hidden=!atlas;
 if(!atlas)return;
 for(const stage of ['first','now']){
  const board=$('e10-needs-'+stage);board.replaceChildren();
  board.setAttribute('aria-label','E10 '+stage.toUpperCase()+
   ' child-tested fictional needs board; no real people, history or access');
  for(const slot of atlas[stage]){
   const el=document.createElement('div');el.className='needs-slot';
   el.dataset.slot=slot.id;el.dataset.occupied=String(slot.quiet||slot.activity);
   el.dataset.conflict=String(slot.conflict);
   const name=document.createElement('strong');name.textContent=slot.id.toUpperCase();
   const roles=document.createElement('span');
   roles.textContent=[slot.quiet?'Quiet reader':'',slot.activity?'Activity group':'']
    .filter(Boolean).join(' + ')||'Open PAPER spot';
   el.append(name,roles);board.append(el);
  }
 }
 $('e10-needs-result').textContent='FIRST: '+(atlas.firstConflict?'1 tested PAPER overlap':'no overlap')+
  ' → NOW: '+(atlas.nowConflict?'overlap':'0 overlaps after Milo moved a card')+
  '. The two simulated needs remain visible. Source, consent and real access UNKNOWN; North Hill CLOSED.';
}
function render(){
 gardenRevisit();
 e10NeedsWorld();
 const linked=linkedE10&&viewE10(linkedE10);
 const fragment=linkedE10&&encodeLoopTransfer(linkedE10,state,upstream);
 $('e10-return').hidden=!fragment;
 if(fragment)$('e10-return').href='../e10-scene/'+fragment;
 const fullMemory=!!(linked?.finishedPaper&&upstream?.e04&&upstream?.e05);
 $('e04-e05-context').hidden=!fullMemory;
 $('e04-e05-context').textContent=fullMemory?
  'E04 PAPER: two sincere but undated memories; earlier/later order UNKNOWN. E05 PAPER: two MOCK station drawings; maker, date and original UNKNOWN. These are strictly replayed child actions, NOT verified historical sources, rights or official Chronicle.':
  'No E04/E05 PAPER provenance linked. This is not historical proof.';
 const continuity=paperChronicle(null,null,fragment);
 $('e03-paper-source').textContent=continuity.e03Ready?
  'E03 canonical source gate verified: both attributed memory event IDs exist. E04-E11 are still PAPER ONLY; no official unlock.':
  'E03 canonical source gate NOT verified. PAPER actions do not establish earlier canonical completion.';
 const list=$('paper-chronicle');list.replaceChildren();
 for(const entry of continuity.entries){
  const item=document.createElement('li');item.textContent=entry.scene+': '+entry.text;list.append(item);
 }
 if(!continuity.entries.length){
  const item=document.createElement('li');item.textContent='No complete replayed E04-E11 PAPER chain. Direct authoring does not claim earlier progress.';list.append(item);
 }
 $('e10-linked-context').textContent=linked?.finishedPaper?
  'E10 PAPER notes earned: Milo observed '+linked.observations.length+
  ' fictional traces and compared two SIMULATED needs. The place name, real access and history remain UNKNOWN. E11 is a separate model, NOT UNLOCKED.':
  'No E10 PAPER investigation linked. Direct E11 authoring proves no prior completion.';
 $('e10-linked-notes').textContent=linked?.finishedPaper?
  'SEEN: '+linked.observations.map(x=>x.text).join(' / ')+
  '. MAYBE: '+linked.hypotheses.map(x=>x.traceId+' '+x.useTag).join(' / ')+
  '. SIMULATED NEEDS: '+linked.needs.map(x=>x.role+' '+x.want).join(' / ')+
  '. UNKNOWN: actual use, name, consent and safe entry. These are not real witnesses or canonical completion.':
  'No linked E10 field notes. The model is not testimony.';
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
 controls();board();tests();comparison();map();drawPaperLoop();review();worldRevisit();returnRoute();reflection();
}
$('access').addEventListener('click',()=>act({type:'place',tokenId:'access',cells:['1,1','1,2']}));
$('lift-quiet').addEventListener('click',()=>act({type:'lift',tokenId:'quiet'}));
$('lift-activity').addEventListener('click',()=>act({type:'lift',tokenId:'activity'}));
$('check-loop').addEventListener('click',()=>act({type:'check-loop'}));
$('loop-first').addEventListener('click',()=>{mapView='first';drawPaperLoop();});
$('loop-now').addEventListener('click',()=>{mapView='now';drawPaperLoop();});
$('begin').addEventListener('click',()=>{begun=true;render();});
$('e10-callback').addEventListener('click',()=>{if(state.reviewed){screen='callback';render();}});
$('e11-back').addEventListener('click',()=>{screen='trial';render();});
$('restart').addEventListener('click',()=>{tool='walk';begun=false;screen='trial';revisitFocus='quiet_reader';roleCell=null;mapView='now';clearPlan();act({type:'reset'});});
render();
