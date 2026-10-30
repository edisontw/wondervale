// Child-driven Season 1 paper-world revisit. NONCANONICAL and in-memory only.
// This is a retrospective model, not a transfer of independent E05–E11 reducers.
export const VERSION='season1-paper-revisit-v1';
export const PLACES=['station','current','lower','connector','steps','hill','needs','layout'];
export const MAX_ACTIONS=180;
export const LABELS={
 station:'E05 · Station paper room',current:'E06 · Present garden',
 lower:'E06 · Lower paper pocket',connector:'E07 · Connector',
 steps:'E08 · Lower Lantern Steps',hill:'E09 · Closed Hill',
 needs:'E10 · Unnamed-place needs',layout:'E11 · Shared-space model'
};
export const CUES={
 station:'Milo: "Does it fit? Is the path clear?"',
 current:'Nia: "What changes when it rains?"',
 lower:'Milo: "Where can a small pocket stay dry?"',
 connector:'Finn: "Who else needs this way?"',
 steps:'Nia: "Look again from another place."',
 hill:'Milo: "The upper hill stays closed. Which lower way can we mark?"',
 needs:'Milo: "Two people need different things. We can listen."',
 layout:'Finn: "Try it. Who can use this space now?"'
};
export const BEFORE={
 station:'Replica does not fit; table crosses the walkway.',
 current:'Present beds remain healthy; rain path is not compared.',
 lower:'No safe small paper pocket has been selected.',
 connector:'One paper connector blocks another user and water.',
 steps:'Both lower model lamps are off; only one view is known.',
 hill:'Upper route CLOSED; lower surveyed line is incomplete.',
 needs:'Two simulated needs have not been compared; name UNKNOWN.',
 layout:'Two paper activities overlap; no shared layout is verified.'
};
export const AFTER={
 station:'A small paper Map Room stands near the wall; walkway clear.',
 current:'Rain tray compared; present beds remain healthy.',
 lower:'A raised paper pocket has a seed marker (not real growth).',
 connector:'The paper connector now keeps people and water moving.',
 steps:'Two lower model lights and two viewpoints compared; no date.',
 hill:'A lower paper survey line is marked; upper hill CLOSED.',
 needs:'Two SIMULATED needs are heard and placed separately; name UNKNOWN.',
 layout:'A reversible paper plan serves both needs; no real opening.'
};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function model(){
 return {
  station:{replica:'side-b',table:'across',done:false},
  current:{weather:'dry',channel:'blocked',done:false},
  lower:{site:'runoff',done:false},
  connector:{route:'blocked',done:false},
  steps:{lights:'off',views:[],done:false},
  hill:{sign:false,lower:false,closedAttempt:false,done:false},
  needs:{heard:[],separate:false,done:false},
  layout:{plan:'overlap',done:false}
 };
}
export function fresh(){
 return {version:VERSION,mode:'authoring_preview',place:'station',models:model(),
  view:'now',feedback:'Milo found an unfinished PAPER map. Test the station first.',
  history:[],canonicalEvents:[],unlocks:[],historicalClaims:[],rights:[]};
}
function clean(a){
 if(!a||typeof a!=='object'||Array.isArray(a))return null;
 const {type,value}=a;
 const allowed={
  visit:PLACES,look:['before','now'],rotate:['side-a','side-b'],
  'shift-table':['across','near-wall'],rain:['dry','rain'],
  channel:['blocked','open'],'move-pocket':['runoff','footpath','raised'],
  'move-bridge':['blocked','clear'],lights:['off','on'],
  'look-from':['base','side'],hear:['quiet','activity'],
  'separate-needs':['overlap','separate'],'move-layout':['overlap','clear']
 };
 if(Object.hasOwn(allowed,type)&&allowed[type].includes(value)&&
    Object.keys(a).length===2)return {type,value};
 const simple=['try-fit','run-tray','test-pocket','test-passage','compare-views',
  'inspect-sign','mark-lower','try-closed','review-hill','review-needs','test-layout'];
 if(simple.includes(type)&&Object.keys(a).length===1)return {type};
 return null;
}
const nextPlace=(m)=>{const n=PLACES.findIndex(x=>!m[x].done);return n<0?PLACES.length-1:n;};
function apply(s,a){
 const m=structuredClone(s.models),p=s.place,one=m[p];
 const move=(feedback)=>({...s,models:m,feedback});
 if(a.type==='visit'){
  const idx=PLACES.indexOf(a.value);
  if(idx>nextPlace(m)||a.value===p)return null;
  return {...s,place:a.value,view:'now',feedback:'Milo revisits '+LABELS[a.value]+'. Compare BEFORE and NOW.'};
 }
 if(a.type==='look'){
  if(s.view===a.value)return null;
  return {...s,view:a.value,feedback:a.value==='before'?'BEFORE: what was missing?':'NOW: what changed, and what remains unknown?'};
 }
 if(p==='station'){
  if(a.type==='rotate'&&one.replica!==a.value){one.replica=a.value;one.done=false;return move('Turn the replica; test both marks.');}
  if(a.type==='shift-table'&&one.table!==a.value){one.table=a.value;one.done=false;return move('Move the paper table; check the public path.');}
  if(a.type==='try-fit'&&!one.done){
   if(one.replica==='side-a'&&one.table==='near-wall'){one.done=true;return move('It fits AND the walkway stays clear. Paper Map Room added.');}
   return move('Not yet: both marks must fit, and the walkway must stay clear. Try again.');
  }
 }
 if(p==='current'){
  if(a.type==='rain'&&one.weather!==a.value){one.weather=a.value;one.done=false;return move('Change the weather on the tray.');}
  if(a.type==='channel'&&one.channel!==a.value){one.channel=a.value;one.done=false;return move('Change the model channel.');}
  if(a.type==='run-tray'&&!one.done){
   if(one.weather==='rain'&&one.channel==='open'){one.done=true;return move('Water passes in the paper model. The present garden stays healthy.');}
   return move('The dry/blocked model does not show a safe rain path. Revise and retry.');
  }
 }
 if(p==='lower'){
  if(a.type==='move-pocket'&&one.site!==a.value){one.site=a.value;one.done=false;return move('Move the paper pocket marker.');}
  if(a.type==='test-pocket'&&!one.done){
   if(one.site==='raised'){one.done=true;return move('Raised PAPER pocket chosen; seed marker appears. No real planting.');}
   return move('The pocket meets runoff or a shared footpath. Move it and retry.');
  }
 }
 if(p==='connector'){
  if(a.type==='move-bridge'&&one.route!==a.value){one.route=a.value;one.done=false;return move('Shift Finn’s paper connector.');}
  if(a.type==='test-passage'&&!one.done){
   if(one.route==='clear'){one.done=true;return move('Milo, another walker and water pass the PAPER connector.');}
   return move('A walker or water cannot pass. Move the model and retry.');
  }
 }
 if(p==='steps'){
  if(a.type==='lights'&&one.lights!==a.value){one.lights=a.value;one.done=false;return move('Only the LOWER model lamps change; no real electricity.');}
  if(a.type==='look-from'&&!one.views.includes(a.value)){one.views.push(a.value);one.done=false;return move('A second lower viewpoint may change what Milo sees.');}
  if(a.type==='compare-views'&&!one.done){
   if(one.lights==='on'&&one.views.length===2){one.done=true;return move('Both lower viewpoints compared. The service plate has NO approved date.');}
   return move('Compare two distinct LOWER viewpoints with the model lamps on.');
  }
 }
 if(p==='hill'){
  if(a.type==='inspect-sign'&&!one.sign){one.sign=true;return move('CLOSED means no upper route, even in the model.');}
  if(a.type==='try-closed'&&!one.closedAttempt){one.closedAttempt=true;return move('Milo stops safely at the closed edge. No entry or shortcut.');}
  if(a.type==='mark-lower'&&!one.lower){one.lower=true;return move('A lower PAPER survey line is marked; real access remains unknown.');}
  if(a.type==='review-hill'&&!one.done){
   if(one.sign&&one.lower){one.done=true;return move('Safe paper survey recorded; North Hill stays CLOSED.');}
   return move('First inspect the closed sign and mark only the lower paper line.');
  }
 }
 if(p==='needs'){
  if(a.type==='hear'&&!one.heard.includes(a.value)){one.heard.push(a.value);return move('One SIMULATED need heard. This is not resident testimony.');}
  if(a.type==='separate-needs'&&one.separate!==(a.value==='separate')){
   one.separate=a.value==='separate';one.done=false;return move('Rearrange the two fictional need cards.');
  }
  if(a.type==='review-needs'&&!one.done){
   if(one.heard.length===2&&one.separate){one.done=true;return move('Both simulated needs considered. Real name and residents UNKNOWN.');}
   return move('Listen to both needs and give each a separate paper place.');
  }
 }
 if(p==='layout'){
  if(a.type==='move-layout'&&one.plan!==a.value){one.plan=a.value;one.done=false;return move('Move the paper layout; retest both uses.');}
  if(a.type==='test-layout'&&!one.done){
   if(one.plan==='clear'){one.done=true;return move('Paper plan serves two simulated uses. NOT a real opening or Season ending.');}
   return move('One activity blocks the other. Revise the model, then retest.');
  }
 }
 return null;
}
export function replay(history){
 if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
 let s=fresh();
 for(const raw of history){
  const a=clean(raw);if(!a||!same(a,raw))return null;
  const n=apply(s,a);if(!n)return null;
  s={...n,history:[...s.history,a]};
 }
 return s;
}
export function restore(state){
 if(!state||typeof state!=='object'||Array.isArray(state)||state.version!==VERSION||
 state.mode!=='authoring_preview')return null;
 const r=replay(state.history);return r&&same(r,state)?r:null;
}
export function dispatch(state,action){
 const s=restore(state);if(!s)return fresh();
 if(s.history.length>=MAX_ACTIONS)return s;
 const a=clean(action);if(!a||!same(a,action))return s;
 const n=apply(s,a);return n?{...n,history:[...s.history,a]}:s;
}
export function project(state){
 const s=restore(state);if(!s)return null;
 const progress=PLACES.map((id,i)=>({
  id,label:LABELS[id],available:i<=nextPlace(s.models),
  done:s.models[id].done,before:BEFORE[id],
  now:s.models[id].done?AFTER[id]:BEFORE[id]
 }));
 return {place:s.place,view:s.view,progress,
  completed:progress.filter(x=>x.done).length,
  current:progress.find(x=>x.id===s.place),
  paperNotes:progress.filter(x=>x.done).map(x=>({place:x.id,kind:'PAPER MODEL',text:AFTER[x.id]})),
  feedback:s.feedback,cue:CUES[s.place],upperHillClosed:true,
  actualHistoricalDate:null,actualName:null,seasonFinished:false,
  canonicalEvents:[],unlocks:[],historicalClaims:[],rights:[],
  note:'Independent in-memory paper recap. NOT a production Chronicle, save, unlock, approved historical source, real access, planting, electricity or Season ending.'};
}
