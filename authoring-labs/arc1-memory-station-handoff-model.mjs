// E03 two attributed memories -> E04 undated uncertainty -> E05 station PAPER story.
// Noncanonical, in-memory authoring only. Never a production E04/E05 entry.
import * as Station from './station-story-model.mjs';
import {E04_SOURCE_EVENTS} from '../engine/s01e04-handoff.mjs';
export const VERSION='arc1-e03-e05-paper-handoff-v1',MAX_ACTIONS=150;
export const MEMORIES=Object.freeze({
 station:Object.freeze({speaker:'Market coordinator',sourceId:'S01E03-COORDINATOR-009',
  event:E04_SOURCE_EVENTS.station,text:'I remember a way to the station.'}),
 garden:Object.freeze({speaker:'Garden resident',sourceId:'S01E03-RESIDENT-001',
  event:E04_SOURCE_EVENTS.garden,text:'I remember a way to the garden.'})
});
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
// Cache only byte-identical snapshots; nested mutation forces full replay validation.
const verified=new WeakMap();
const mark=s=>(verified.set(s,JSON.stringify(s)),s);
const has=(xs,x)=>xs.includes(x);
const emptyTimeline=()=>({phase:'memories',inspected:[],slots:{},compared:false,finishedPaper:false});
export function fresh(){return mark({version:VERSION,mode:'noncanonical_paper',stage:'e04',
 timeline:emptyTimeline(),station:Station.fresh(),history:[],canonicalEvents:[],
 unlocks:[],historicalClaims:[],rights:[]});}
function clean(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
 if(raw.scene==='nav'&&has(['to-e05','to-e04','restart-e04'],raw.type))
  return {scene:'nav',type:raw.type};
 if(raw.scene==='e04'&&raw.action&&typeof raw.action==='object'&&!Array.isArray(raw.action)){
  const a=raw.action;
  if(a.type==='inspect')return {scene:'e04',action:{type:'inspect',which:a.which}};
  if(a.type==='place')return {scene:'e04',action:{type:'place',which:a.which,slot:a.slot}};
  if(has(['compare','finish-paper'],a.type))return {scene:'e04',action:{type:a.type}};
 }
 if(raw.scene==='e05'&&raw.action&&typeof raw.action==='object'&&!Array.isArray(raw.action))
  return {scene:'e05',action:raw.action};
 return null;
}
const ready=t=>t.finishedPaper&&t.compared&&
 Object.keys(MEMORIES).every(k=>t.inspected.includes(k)&&t.slots[k]==='unknown');
function apply(s,a){
 if(a.scene==='nav'){
  if(a.type==='to-e05'&&s.stage==='e04'&&ready(s.timeline))
   return {...s,stage:'e05'};
  if(a.type==='to-e04'&&s.stage==='e05')return {...s,stage:'e04'};
  if(a.type==='restart-e04')return {...fresh(),history:s.history};
  return null;
 }
 if(a.scene==='e04'&&s.stage==='e04'){
  const t=s.timeline,b=a.action,keys=Object.keys(MEMORIES);
  if(t.finishedPaper)return null;
  if(b.type==='inspect'&&keys.includes(b.which)&&!t.inspected.includes(b.which)){
   const inspected=[...t.inspected,b.which];
   return {...s,timeline:{...t,inspected,phase:inspected.length===2?'timeline':'memories'}};
  }
  if(b.type==='place'&&t.inspected.length===2&&keys.includes(b.which)&&
     has(['earlier','later','unknown'],b.slot)&&t.slots[b.which]!==b.slot)
   return {...s,timeline:{...t,slots:{...t.slots,[b.which]:b.slot},compared:false}};
  if(b.type==='compare'&&t.inspected.length===2&&!t.compared&&
     keys.every(k=>t.slots[k]==='unknown'))
   return {...s,timeline:{...t,compared:true,phase:'reflection'}};
  if(b.type==='finish-paper'&&t.compared)
   return {...s,timeline:{...t,finishedPaper:true,phase:'done'}};
  return null;
 }
 if(a.scene==='e05'&&s.stage==='e05'&&ready(s.timeline)&&
    Station.can(s.station,a.action)){
  const next=Station.dispatch(s.station,a.action);
  return same(next,s.station)?null:{...s,station:next};
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
 return mark(s);
}
export function restore(snapshot){
 if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||
   snapshot.version!==VERSION||snapshot.mode!=='noncanonical_paper')return null;
 if(verified.get(snapshot)===JSON.stringify(snapshot))return snapshot;
 const s=replay(snapshot.history);
 return s&&same(s,snapshot)?mark(snapshot):null;
}
export function can(snapshot,action){
 const s=restore(snapshot),a=clean(action);
 return !!(s&&s.history.length<MAX_ACTIONS&&a&&same(a,action)&&apply(s,a));
}
export function dispatch(snapshot,action){
 const s=restore(snapshot);if(!s)return fresh();
 const a=clean(action);
 if(!a||!same(a,action)||s.history.length>=MAX_ACTIONS)return s;
 const n=apply(s,a);
 return n?mark({...n,history:[...s.history,a]}):s;
}
export function view(snapshot){
 const s=restore(snapshot);if(!s)return null;
 const t=s.timeline,v=Station.view(s.station);
 return {stage:s.stage,timeline:structuredClone(t),station:v,
  memoryCards:Object.fromEntries(Object.entries(MEMORIES).map(([k,m])=>[k,{
   speaker:m.speaker,sourceId:m.sourceId,event:m.event,
   text:t.inspected.includes(k)?m.text:null,slot:t.slots[k]??null}])),
  paperReady:ready(t),stationPaperFinished:v.reflection,
  e04CanonicalComplete:false,e05ProductionUnlocked:false,
  sourceDates:'UNKNOWN',sourceCardsApproved:false,stationAccessApproved:false,
  oldTrainServiceOpen:false,northHillClosed:true,commonRevealed:false,
  canonicalEvents:[],unlocks:[],historicalClaims:[],rights:[],
  speaker:s.stage==='e04'?(t.inspected.length<2?'Milo':t.compared?'Nia':'Finn'):v.speaker,
  line:s.stage==='e04'?(t.inspected.length<2?
    'Two people remember different ways. Let us listen to both.':
    t.compared?'We cannot date these memories. We can still ask the station a question.':
    'Can we put either memory BEFORE or AFTER without a date? Try, then revise.') :v.line,
  parentCue:t.inspected.length===2?
    'What would we need to know which memory came first?':null,
  paperNote:t.finishedPaper?
    'PAPER ONLY: both E03 memories are sincere and undated. Relative order UNKNOWN. Try a removable station model; do not claim a real route or unlock.':null};
}
