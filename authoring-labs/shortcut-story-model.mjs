// E07 child-driven PAPER story, reusing the strictly replayed synthetic connector reducer.
// This is an independent authoring rehearsal, not production history, geometry or an unlock.
import * as E07 from '../engine/s01e07-authoring-prototype.mjs';
export const VERSION='e07-shortcut-story-paper-v1';
export const MAX_STEPS=90;
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const withValue=new Set(['walk','inspect','trial','place']);
const withoutValue=new Set(['start','undo','compare','finish']);
const trials=new Set(['milo','resident','water']);
export function fresh(){
 return {version:VERSION,mode:'authoring_preview',stage:'opening',connector:E07.fresh(),
  history:[],canonicalEvents:[],unlocks:[],historicalClaims:[]};
}
function clean(a){
 if(!a||typeof a!=='object'||Array.isArray(a))return null;
 const c=withValue.has(a.type)?{type:a.type,value:a.value}:
  withoutValue.has(a.type)?{type:a.type}:null;
 return c&&equal(c,a)?c:null;
}
function apply(s,a){
 if(a.type==='start')return s.stage==='opening'?{...s,stage:'explore'}:null;
 if(s.stage==='opening'||s.stage==='finished')return null;
 let action;
 if(a.type==='walk')action={type:'walk',anchor:a.value};
 if(a.type==='inspect')action={type:'inspect',anchor:a.value};
 if(a.type==='trial'&&trials.has(a.value))action={type:'test-'+a.value};
 if(a.type==='place')action={type:'place-piece',pieceId:'connector',snapId:a.value};
 if(a.type==='undo')action={type:'undo-piece'};
 if(a.type==='compare')action={type:'compare-layouts'};
 if(a.type==='finish')action={type:'confirm-preview'};
 if(!action)return null;
 const next=E07.dispatch(s.connector,action);
 if(equal(next,s.connector))return null;
 const stage=next.previewComplete?'finished':
  next.phase==='compare'?'compare':
  next.phase==='revise'?'revise':
  next.phase==='first-trial'?'first-trial':'explore';
 return {...s,stage,connector:next};
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
 return s&&equal(s,snapshot)?s:null;
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
 const p=E07.previewProjection(s.connector);
 const last=s.history.at(-1);
 let speaker='Finn',line='I made a short PAPER connector! Milo, can you test it?';
 if(last?.type==='start'){speaker='Nia';line='Look at the shared path and the water trace before we try Finn’s idea.';}
 if(last?.type==='walk'){speaker='Milo';line='I walk to the '+last.value.replaceAll('-',' ')+'.';}
 if(last?.type==='inspect'){speaker='Nia';line=last.value==='shared-path'?
  'Someone else uses this path. Can they pass?':
  last.value==='channel'?'Water needs a way too. What might happen here?':
  'We can look before we decide.';}
 if(last?.type==='trial'){
  const t=s.connector.phase==='revise'?s.connector.revisedTrials[last.value]:
   s.connector.firstTrials[last.value];
  speaker=last.value==='milo'?'Milo':last.value==='resident'?'Nia':'Finn';
  line=last.value==='milo'?(t?.pass?'It works for me. Is that enough?':'I cannot get through. Let us change the model.'):
   last.value==='resident'?(t?.pass?'The other traveler can pass.':'The other traveler must stop. The path is blocked.'):
   (t?.pass?'The water route stays clear.':'Water meets the connector. It needs a way.');
 }
 if(last?.type==='place'){speaker='Finn';line='My first idea was fast for Milo. Let us test this new position for everyone.';}
 if(last?.type==='undo'){speaker='Milo';line='I can undo a change and try again. No one is hurt in our PAPER model.';}
 if(last?.type==='compare'){speaker='Nia';line='FIRST and NOW are different. What changed for people and water?';}
 if(s.stage==='finished'){speaker='Finn';line='I thought short meant best. Now I will ask: who else uses this place?';}
 const first=s.connector.firstTrials,now=s.connector.revisedTrials;
 const allFirst=Object.values(first).every(Boolean);
 const allNow=Object.values(now).every(Boolean);
 const outcomes=allNow?now:allFirst?first:null;
 const parentCue=s.connector.firstTrials.milo?
  'It works for Milo. Who else needs this space? Let your child run the tests.':null;
 return {stage:s.stage,speaker,line,milo:p.miloPosition,observed:p.observed,
  baseline:p.baseline,layout:p.layout,firstTrials:first,revisedTrials:now,
  allFirst,allNow,outcomes,compared:p.compared,previewComplete:p.previewComplete,
  parentCue,firstNow:p.firstNow,
  paperNote:s.stage==='finished'?
   'PAPER NOTE: Finn revised a model so Milo, another user and water can pass. Lantern Steps BASE is the next question; its lights remain OFF. Real route, access, clearance, permission and historical sources are UNKNOWN.':
   'PAPER MODEL ONLY. No real route or construction is approved.',
  upperHillClosed:true,lightsOff:true,canonicalEvents:[],unlocks:[],historicalClaims:[]};
}
