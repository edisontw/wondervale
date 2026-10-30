// E06 Current Garden: isolated child-driven story/EFL PAPER rehearsal.
// Uses the existing E06 synthetic tray reducer; never imports production saves or unlocks.
import {fresh as freshGarden,dispatch as gardenAction,previewProjection} from '../engine/s01e06-authoring-prototype.mjs';
export const VERSION='e06-current-garden-story-paper-v1';
export const MAX_STEPS=45;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const one=new Set(['walk','inspect','guess','weather','channel','revise']);
const noValue=new Set(['start','run','compare']);
const guesses=['put-back','not-sure'];
const revisions=['small-test','need-evidence'];
export function fresh(){
 return {version:VERSION,mode:'authoring_preview',phase:'opening',garden:freshGarden(),
  hypothesis:null,revision:null,history:[],canonicalEvents:[],unlocks:[],historicalClaims:[]};
}
function clean(action){
 if(!action||typeof action!=='object'||Array.isArray(action))return null;
 const a=one.has(action.type)?{type:action.type,value:action.value}:
   noValue.has(action.type)?{type:action.type}:null;
 return a&&same(a,action)?a:null;
}
function useGarden(s,a,phase=s.phase){
 const next=gardenAction(s.garden,a);
 return same(next,s.garden)?null:{...s,garden:next,phase};
}
function apply(s,a){
 if(s.phase==='finished')return null;
 if(a.type==='start')return s.phase==='opening'?{...s,phase:'explore'}:null;
 if(s.phase==='opening')return null;
 if(a.type==='walk'&&['explore','model'].includes(s.phase))
  return useGarden(s,{type:'walk-to',target:a.value});
 if(a.type==='inspect'&&['explore','model'].includes(s.phase))
  return useGarden(s,{type:'inspect',id:a.value});
 if(a.type==='guess'&&['explore','model'].includes(s.phase)&&
    s.garden.currentObserved.length>=2&&guesses.includes(a.value)&&s.hypothesis!==a.value)
  return {...s,hypothesis:a.value};
 if(!s.hypothesis)return null;
 if(a.type==='weather'&&['explore','model'].includes(s.phase))
  return useGarden(s,{type:'set-weather',weather:a.value},'model');
 if(a.type==='channel'&&['explore','model'].includes(s.phase))
  return useGarden(s,{type:'set-channel',channel:a.value},'model');
 if(a.type==='run'&&['explore','model'].includes(s.phase))
  return useGarden(s,{type:'run-model'},'model');
 if(a.type==='compare'&&s.phase==='model')
  return useGarden(s,{type:'compare-model'},'review');
 if(a.type==='revise'&&s.phase==='review'&&revisions.includes(a.value))
  return {...s,revision:a.value,phase:'finished'};
 return null;
}
export function replay(history){
 if(!Array.isArray(history)||history.length>MAX_STEPS)return null;
 let s=fresh();
 for(const raw of history){
  const a=clean(raw);
  if(!a)return null;
  const next=apply(s,a);
  if(!next)return null;
  s={...next,history:[...s.history,a]};
 }
 return s;
}
export function restore(snapshot){
 if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot))return null;
 const r=replay(snapshot.history);
 return r&&same(r,snapshot)?r:null;
}
export function dispatch(snapshot,action){
 const s=restore(snapshot);
 if(!s)return fresh();
 if(s.history.length>=MAX_STEPS)return s;
 const a=clean(action);
 if(!a)return s;
 const next=apply(s,a);
 return next?{...next,history:[...s.history,a]}:s;
}
export function can(snapshot,action){
 const s=restore(snapshot),a=clean(action);
 return !!(s&&a&&s.history.length<MAX_STEPS&&apply(s,a));
}
export function view(snapshot){
 const s=restore(snapshot);
 if(!s)return null;
 const p=previewProjection(s.garden);
 const last=s.history.at(-1);
 let speaker='Nia',line='The old PAPER map marks a lower garden. Let us look at the healthy garden now.';
 if(s.phase==='explore'){speaker='Milo';line='I want to put it back! What do the plants need now?';}
 if(last?.type==='walk'){speaker='Milo';line='I can walk to '+last.value.replaceAll('-',' ')+'.';}
 if(last?.type==='inspect'){
  speaker=last.value==='slope'?'Finn':last.value==='shared-path'?'Nia':'Milo';
  line=last.value==='slope'?'The garden is higher now. Water can go down.':
   last.value==='shared-path'?'People still need this path.':'I see healthy beds. They need care.';
 }
 if(last?.type==='guess'){speaker='Milo';line=last.value==='put-back'?
  'I think we could put it all back. Maybe. Let us test.':
  'I am not sure. We can look at water before we decide.';}
 if(['weather','channel'].includes(last?.type)){speaker='Finn';line='Change the PAPER tray and run it. What do you predict?';}
 if(last?.type==='run'){
  speaker='Finn';const r=p.lastRun;
  line=r.weather==='dry'?'The model is dry. No rain runs down.':
   r.channel==='blocked'?'The channel is blocked. More model water collects below.':
   'The channel is open. Some model water can pass.';
 }
 if(s.phase==='review'){speaker='Nia';line='We saw water go down in a MODEL. Does that prove why the real garden moved? No. What can we try next?';}
 if(s.phase==='finished'){
  speaker='Milo';line=s.revision==='small-test'?
   'The healthy garden stays. Maybe a SMALL paper garden could fit below. We need permission.':
   'The healthy garden stays. We need more evidence before a small trial below.';
 }
 return {phase:s.phase,speaker,line,milo:s.garden.location,observed:[...s.garden.currentObserved],
  hypothesis:s.hypothesis,revision:s.revision,weather:s.garden.weather,channel:s.garden.channel,
  runs:s.garden.modelRuns.map(r=>({...r})),lastRun:p.lastRun,modelCompared:s.garden.modelCompared,
  parentCue:s.garden.modelCompared?'What might happen if we moved the whole garden back? What is still unknown?':null,
  paperNote:s.phase==='finished'?
   'PAPER NOTE: healthy upper beds and a shared path were observed in a model. Water results are SYNTHETIC; the real historical cause, site permission and lower planting remain UNKNOWN. Finn wonders about a future connector.':null,
  currentGardenHealthy:true,canonicalEvents:[],unlocks:[],historicalClaims:[]};
}
