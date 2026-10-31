// E05 future scene shell: composed authoring-only actions, never a production ledger.
// The E04 canonical checkpoint, authorized foyer access and genuine station records
// do not exist yet. Keep this model OUT of static production packages.
import * as Story from '../authoring-labs/station-story-model.mjs';
import * as Sources from '../authoring-labs/station-sources-model.mjs';

export const VERSION='e05-scene-paper-shell-v1';
export const MAX_ACTIONS=180;
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const verified=new WeakMap();
const mark=s=>(verified.set(s,JSON.stringify(s)),s);
const navTypes=['to-records','to-layout','to-review','back-to-records','restart'];
export function fresh(){return mark({version:VERSION,mode:'noncanonical_paper',stage:'foyer',
  station:Story.fresh(),sources:Sources.fresh(),garden:{inspected:[],overlay:false,question:false},history:[],canonicalEvents:[],
  unlocks:[],historicalClaims:[],rights:[]});}
function clean(raw){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
  let a=null;
  if(raw.scene==='nav'&&navTypes.includes(raw.type))a={scene:'nav',type:raw.type};
  if(raw.scene==='garden'&&raw.action&&typeof raw.action==='object'&&!Array.isArray(raw.action)){
    const g=raw.action;
    if(g.type==='inspect'&&['older','present'].includes(g.value))a={scene:'garden',action:{type:'inspect',value:g.value}};
    if(['overlay','ask-why'].includes(g.type))a={scene:'garden',action:{type:g.type}};
  }
  if(['station','sources'].includes(raw.scene)&&raw.action&&
     typeof raw.action==='object'&&!Array.isArray(raw.action))
    a={scene:raw.scene,action:raw.action};
  return a&&eq(a,raw)?a:null;
}
function apply(s,a){
  if(a.scene==='nav'){
    if(a.type==='restart')return {...fresh(),history:s.history};
    if(a.type==='to-records'&&s.stage==='foyer'&&
       Story.view(s.station)?.phase==='layout')return {...s,stage:'records'};
    if(a.type==='to-layout'&&s.stage==='records'&&
       Sources.view(s.sources)?.phase==='finished')return {...s,stage:'layout'};
    if(a.type==='back-to-records'&&s.stage==='layout'&&
       Sources.view(s.sources)?.phase==='finished')return {...s,stage:'records'};
    if(a.type==='to-review'&&s.stage==='layout'&&
       Story.view(s.station)?.reflection&&Sources.view(s.sources)?.phase==='finished')
      return {...s,stage:'review'};
    return null;
  }
  if(a.scene==='garden'&&s.stage==='review'){
    const g=s.garden,act=a.action;
    if(act.type==='inspect'&&!g.inspected.includes(act.value))
      return {...s,garden:{...g,inspected:[...g.inspected,act.value]}};
    if(act.type==='overlay'&&g.inspected.length===2&&!g.overlay)
      return {...s,garden:{...g,overlay:true}};
    if(act.type==='ask-why'&&g.overlay&&!g.question)
      return {...s,garden:{...g,question:true}};
    return null;
  }
  if(a.scene==='station'&&['foyer','layout'].includes(s.stage)){
    const type=a.action.type;
    if(s.stage==='foyer'&&['place-table','confirm','reflect'].includes(type))return null;
    if(s.stage==='layout'&&!['walk','place-table','confirm','reflect'].includes(type))return null;
    if(!Story.can(s.station,a.action))return null;
    const next=Story.dispatch(s.station,a.action);
    return eq(next,s.station)?null:{...s,station:next};
  }
  if(a.scene==='sources'&&s.stage==='records'&&Sources.can(s.sources,a.action)){
    const next=Sources.dispatch(s.sources,a.action);
    return eq(next,s.sources)?null:{...s,sources:next};
  }
  return null;
}
export function replay(history){
  if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
  let s=fresh();
  for(const raw of history){
    const a=clean(raw);if(!a)return null;
    const n=apply(s,a);if(!n)return null;
    s={...n,history:[...s.history,a]};
  }
  return mark(s);
}
export function restore(snapshot){
  if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||
     snapshot.version!==VERSION||snapshot.mode!=='noncanonical_paper')return null;
  if(verified.get(snapshot)===JSON.stringify(snapshot))return snapshot;
  const rebuilt=replay(snapshot.history);
  return rebuilt&&eq(rebuilt,snapshot)?mark(snapshot):null;
}
export function can(snapshot,action){
  const s=restore(snapshot),a=clean(action);
  return !!(s&&a&&s.history.length<MAX_ACTIONS&&apply(s,a));
}
export function dispatch(snapshot,action){
  const s=restore(snapshot);if(!s)return fresh();
  const a=clean(action);if(!a||s.history.length>=MAX_ACTIONS)return s;
  const next=apply(s,a);
  return next?mark({...next,history:[...s.history,a]}):s;
}
export function view(snapshot){
  const s=restore(snapshot);if(!s)return null;
  const station=Story.view(s.station),sources=Sources.view(s.sources);
  const stageText={foyer:'Milo: Look at the old board. We can test a COPY.',
    records:'Nia: These are MOCK drawings, not real station records. Who made them?',
    layout:'Finn: We can make a paper Map Room. Keep the public way clear.',
    review:'Milo: The paper room is ready. Why are there two garden places?'};
  const garden=s.garden;
  const reviewLine=garden.question?'Milo: The two PAPER garden marks differ. Why? We still need real evidence.':
    garden.overlay?'Nia: The model marks are apart. That does not tell us when or why.':
      'Finn: Look at both PAPER garden sheets. Then lay them together.';
  return {stage:s.stage,station,sources,gardenMap:{...garden,inspected:[...garden.inspected]},speaker:s.stage==='foyer'?station.speaker:
    s.stage==='records'?sources.speaker:s.stage==='layout'?station.speaker:garden.question?'Milo':garden.overlay?'Nia':'Finn',
    line:s.stage==='review'?reviewLine:s.stage==='records'?sources.line:
      s.stage==='foyer'?station.line:station.line,
    stageText:stageText[s.stage],
    parentCue:s.stage==='review'?'What do the two PAPER marks show? What can they not explain?':
      s.stage==='records'?sources.parentCue:station.parentCue,
    mapRoomPaperVisible:station.mapRoom&&sources.phase==='finished',
    paperChronicle:s.stage==='review'?
      'PAPER ONLY: the removable copy fit two drawn marks; both MOCK records have maker/date/original UNKNOWN; the trial Map Room keeps a path clear. The old train service and North Hill stay CLOSED. The garden-location question remains OPEN.'+
      (garden.question?' Milo overlaid two fictional garden marks; their difference is visible, but date, location provenance and cause remain UNKNOWN.':''):null,
    e04CanonicalComplete:false,productionEntryReady:false,foyerAccessApproved:false,
    stationRecordsApproved:false,e06Unlocked:false,northHillClosed:true,commonRevealed:false,
    canonicalEvents:[],unlocks:[],historicalClaims:[],rights:[]};
}
