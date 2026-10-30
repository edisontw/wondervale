// E06 Lower Garden child-driven PAPER rehearsal. Synthetic geometry, no real planting.
// Reuses the E06 two-garden reducer; strict replay prevents forged sources or unlocks.
import * as E06 from '../engine/s01e06-authoring-prototype.mjs';
export const VERSION='e06-lower-garden-story-paper-v1';
export const MAX_STEPS=70;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const valued=new Set(['walk','inspect','weather','channel','place','think']);
const plain=new Set(['start','run','compare','enter','check','finish']);
const thoughts=['keep-path','need-more'];
export function fresh(){
 return {version:VERSION,mode:'authoring_preview',phase:'opening',garden:E06.fresh(),
  attempts:[],thought:null,history:[],canonicalEvents:[],unlocks:[],historicalClaims:[]};
}
function clean(a){
 if(!a||typeof a!=='object'||Array.isArray(a))return null;
 const c=valued.has(a.type)?{type:a.type,value:a.value}:
  plain.has(a.type)?{type:a.type}:null;
 return c&&same(c,a)?c:null;
}
function garden(s,a,phase=s.phase){
 const next=E06.dispatch(s.garden,a);
 return same(next,s.garden)?null:{...s,garden:next,phase};
}
function hasUnsafe(s){return s.attempts.some(a=>a.wet||a.blocksPath);}
function hasSafe(s){return s.attempts.some(a=>a.provisional);}
function apply(s,a){
 if(s.phase==='finished')return null;
 if(a.type==='start')return s.phase==='opening'?{...s,phase:'current'}:null;
 if(s.phase==='opening')return null;
 if(s.phase==='current'){
  if(a.type==='walk')return garden(s,{type:'walk-to',target:a.value});
  if(a.type==='inspect')return garden(s,{type:'inspect',id:a.value});
  if(a.type==='weather')return garden(s,{type:'set-weather',weather:a.value});
  if(a.type==='channel')return garden(s,{type:'set-channel',channel:a.value});
  if(a.type==='run')return garden(s,{type:'run-model'});
  if(a.type==='compare')return garden(s,{type:'compare-model'});
  if(a.type==='enter')return garden(s,{type:'visit-lower'},'lower');
  return null;
 }
 if(s.phase!=='lower')return null;
 if(a.type==='walk')return garden(s,{type:'walk-to',target:a.value});
 if(a.type==='inspect')return garden(s,{type:'inspect',id:a.value});
 if(a.type==='place'){
  const n=garden(s,{type:'move-marker',site:a.value});
  return n?{...n,thought:null}:null;
 }
 if(a.type==='check'){
  const n=garden(s,{type:'inspect-result'});
  if(!n)return null;
  const p=E06.siteEffect(n.garden.markerSite);
  return {...n,attempts:[...s.attempts,{site:n.garden.markerSite,...p}]};
 }
 if(a.type==='think'){
  return hasUnsafe(s)&&hasSafe(s)&&thoughts.includes(a.value)&&s.thought!==a.value?
   {...s,thought:a.value}:null;
 }
 if(a.type==='finish'){
  if(!s.thought||!hasUnsafe(s)||!hasSafe(s)||!s.garden.markerInspected||
   !E06.siteEffect(s.garden.markerSite)?.provisional)return null;
  return garden(s,{type:'confirm-small-trial'},'finished');
 }
 return null;
}
export function replay(history){
 if(!Array.isArray(history)||history.length>MAX_STEPS)return null;
 let s=fresh();
 for(const raw of history){
  const a=clean(raw);if(!a)return null;
  const next=apply(s,a);if(!next)return null;
  s={...next,history:[...s.history,a]};
 }
 return s;
}
export function restore(snapshot){
 if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot))return null;
 const s=replay(snapshot.history);
 return s&&same(s,snapshot)?s:null;
}
export function dispatch(snapshot,action){
 const s=restore(snapshot);if(!s)return fresh();
 if(s.history.length>=MAX_STEPS)return s;
 const a=clean(action);if(!a)return s;
 const n=apply(s,a);
 return n?{...n,history:[...s.history,a]}:s;
}
export function can(snapshot,action){
 const s=restore(snapshot),a=clean(action);
 return !!(s&&a&&s.history.length<MAX_STEPS&&apply(s,a));
}
export function view(snapshot){
 const s=restore(snapshot);if(!s)return null;
 const p=E06.previewProjection(s.garden);
 const last=s.history.at(-1);
 const site=s.garden.markerSite, effect=E06.siteEffect(site);
 let speaker='Nia',line='The old PAPER map shows a lower garden. First, look at the healthy garden above.';
 if(s.phase==='current')line='Milo, look at two places, then test water on the PAPER tray.';
 if(last?.type==='walk'){speaker='Milo';line='I can walk to '+last.value.replaceAll('-',' ')+'.';}
 if(last?.type==='inspect'){
  speaker='Nia';line=s.phase==='current'?'What do you see now? The past is still a question.':
   last.value==='runoff-trace'?'I see a water trace in this MODEL. Is it safe to plant here?':
   'People need a clear path. Can we leave space?';
 }
 if(last?.type==='run'){speaker='Finn';line='The PAPER tray collects '+p.lastRun.catchment+' of 3 model water marks.';}
 if(last?.type==='compare'){speaker='Nia';line='The model changed. It does not prove why the real garden moved.';}
 if(last?.type==='enter'){speaker='Finn';line='A lower PAPER site! Let us look at water and the path before placing anything.';}
 if(last?.type==='place'){speaker='Milo';line='I put a temporary marker here. What happens to water and people?';}
 if(last?.type==='check'){
  speaker=effect?.provisional?'Nia':'Finn';
  line=effect?.wet?'This marker is wet in our MODEL. We can move it.':
   effect?.blocksPath?'This marker blocks the shared path. Try another place.':
   'The path and water route stay clear in this MODEL. We still need permission.';
 }
 if(last?.type==='think'){speaker='Milo';line=last.value==='keep-path'?
  'I think we can keep the path open and try a small pocket.':
  'I am not sure yet. A small trial needs permission and more evidence.';}
 if(s.phase==='finished'){speaker='Nia';line='The healthy upper garden stays. Our lower PAPER pocket is only a plan, not a planted garden.';}
 return {phase:s.phase,speaker,line,milo:s.garden.location,observedCurrent:[...s.garden.currentObserved],
  observedLower:[...s.garden.lowerObserved],runs:s.garden.modelRuns.map(r=>({...r})),
  modelCompared:s.garden.modelCompared,weather:s.garden.weather,channel:s.garden.channel,
  attempts:s.attempts.map(a=>({...a})),markerSite:site,markerEffect:effect,thought:s.thought,
  lowerVisited:s.garden.phase!=='current',presentGardenHealthy:true,
  parentCue:hasUnsafe(s)&&hasSafe(s)?
   'What changed when Milo moved the marker? What must we check in the real place?':null,
  paperNote:s.phase==='finished'?
   'PAPER NOTE: a small marker fits this SYNTHETIC layout. Real water, land access, planting permission, care, history and growth remain UNKNOWN. Finn asks how a connector could protect people and water.':null,
  canonicalEvents:[],unlocks:[],historicalClaims:[]};
}
