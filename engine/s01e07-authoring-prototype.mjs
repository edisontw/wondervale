// E07 authoring-only connector model. Synthetic cells are NOT real Wondervale pavement,
// dimensions, drainage, other-user clearance or construction permission.
// Pure in-memory replay; no localStorage, production ledger, E06 completion or E08 unlock.
export const VERSION='s01e07-authoring-prototype-v1';
export const MAX_ACTIONS=90;
export const BOARD=Object.freeze({width:8,height:7,start:'0,3',finish:'7,3'});
export const ANCHORS=Object.freeze(['entry','shared-path','channel','workbench']);
export const REQUIRED_OBSERVATIONS=Object.freeze(['shared-path','channel']);
export const ANCHOR_EDGES=Object.freeze([
  Object.freeze(['entry','shared-path']),Object.freeze(['shared-path','channel']),
  Object.freeze(['channel','workbench'])
]);
export const BASELINE='short-crossing';
const cells=points=>Object.freeze(points.map(([x,y])=>String(x)+','+String(y)));
// Each snap occupies actual model cells. Side routes detour and are longer than Finn's
// initial short route; conflicts are computed by overlap, not a preassigned grade.
export const SNAPS=Object.freeze({
  'short-crossing':cells([[2,3],[3,3],[4,3],[5,3],[3,2],[4,4]]),
  'side-offset':cells([[2,3],[2,2],[2,1],[3,1],[4,1],[5,1],[5,2],[5,3]]),
  'path-clear-water-blocked':cells([[2,3],[3,3],[4,3],[5,3],[4,4]]),
  'channel-clear-path-blocked':cells([[2,3],[3,3],[4,3],[5,3],[3,2]]),
  'lower-offset':cells([[2,3],[2,4],[2,5],[3,5],[4,5],[5,5],[5,4],[5,3]])
});
export const RESIDENT_PATH=Object.freeze(['3,2','4,2']);
export const WATER_PATH=Object.freeze(['3,4','4,4']);
const LEFT=Object.freeze(['0,3','1,3']);
const RIGHT=Object.freeze(['6,3','7,3']);
const own=(o,k)=>Object.hasOwn(o,k);
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const includes=(xs,x)=>xs.includes(x);
const key=(x,y)=>String(x)+','+String(y);
const neighbors=cell=>{
  const [x,y]=cell.split(',').map(Number);
  return [[x+1,y],[x,y-1],[x,y+1],[x-1,y]].filter(([a,b])=>
    a>=0&&b>=0&&a<BOARD.width&&b<BOARD.height).map(([a,b])=>key(a,b));
};
function route(footprint){
  const legal=new Set([...LEFT,...RIGHT,...footprint]);
  const todo=[BOARD.start],previous=new Map([[BOARD.start,null]]);
  for(let i=0;i<todo.length;i++){
    const at=todo[i];if(at===BOARD.finish)break;
    for(const next of neighbors(at))if(legal.has(next)&&!previous.has(next)){
      previous.set(next,at);todo.push(next);
    }
  }
  if(!previous.has(BOARD.finish))return null;
  const path=[];
  for(let p=BOARD.finish;p!==null;p=previous.get(p))path.push(p);
  return path.reverse();
}
export function evaluateLayout(snap){
  if(typeof snap!=='string'||!own(SNAPS,snap))return null;
  const footprint=SNAPS[snap];
  const used=new Set(footprint);
  if(used.size!==footprint.length||footprint.some(cell=>{
    const [x,y]=cell.split(',').map(Number);
    return !Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=BOARD.width||y>=BOARD.height;
  }))return null;
  const miloRoute=route(footprint);
  const residentOverlaps=RESIDENT_PATH.filter(cell=>used.has(cell));
  const waterOverlaps=WATER_PATH.filter(cell=>used.has(cell));
  return {layout:snap,layoutHash:'e07-model-v1:'+snap+':'+footprint.join('|'),
    footprint:[...footprint],traces:{
      milo:{pass:!!miloRoute,path:miloRoute??[],steps:miloRoute?miloRoute.length-1:null},
      resident:{pass:residentOverlaps.length===0,path:[...RESIDENT_PATH],overlaps:residentOverlaps},
      water:{pass:waterOverlaps.length===0,path:[...WATER_PATH],overlaps:waterOverlaps}
    },source:'synthetic-model-only'};
}
export function fresh(){
  return {version:VERSION,mode:'authoring_preview',phase:'inspect',miloPosition:'entry',
    observed:[],baseline:BASELINE,currentSnap:BASELINE,previousSnaps:[],
    firstTrials:{milo:null,resident:null,water:null},
    revisedTrials:{milo:null,resident:null,water:null},compared:false,
    previewComplete:false,history:[],canonicalEvents:[],unlocks:[],historicalClaims:[]};
}
const cleanAction=a=>{
  if(!a||typeof a!=='object'||Array.isArray(a))return null;
  switch(a.type){
    case 'walk':return {type:a.type,anchor:a.anchor};
    case 'inspect':return {type:a.type,anchor:a.anchor};
    case 'place-piece':return {type:a.type,pieceId:a.pieceId,snapId:a.snapId};
    case 'test-milo':case 'test-resident':case 'test-water':
    case 'run-all-traces':case 'undo-piece':case 'compare-layouts':
    case 'confirm-preview':case 'reset':return {type:a.type};
    default:return null;
  }
};
const readyForBaseline=s=>REQUIRED_OBSERVATIONS.every(x=>s.observed.includes(x))&&s.miloPosition==='workbench';
const firstComplete=s=>Object.values(s.firstTrials).every(Boolean);
const firstShowsSideEffect=s=>!s.firstTrials.resident?.pass||!s.firstTrials.water?.pass;
const revisedComplete=s=>Object.values(s.revisedTrials).every(Boolean);
const revisedAllPass=s=>revisedComplete(s)&&Object.values(s.revisedTrials).every(t=>t.pass&&t.layoutHash===evaluateLayout(s.currentSnap).layoutHash);
function traceResult(s,kind){
  const e=evaluateLayout(s.phase==='revise'?s.currentSnap:BASELINE);
  return {...e.traces[kind],layoutHash:e.layoutHash,source:e.source};
}
function apply(s,a){
  if(s.phase==='preview-complete')return null;
  switch(a.type){
    case 'walk':{
      if(!includes(ANCHORS,a.anchor)||a.anchor===s.miloPosition||s.phase==='preview-complete')return null;
      if(!ANCHOR_EDGES.some(([x,y])=>x===s.miloPosition&&y===a.anchor||y===s.miloPosition&&x===a.anchor))return null;
      return {...s,miloPosition:a.anchor};
    }
    case 'inspect':{
      if(s.phase!=='inspect'||!includes(ANCHORS,a.anchor)||s.miloPosition!==a.anchor||
        s.observed.includes(a.anchor))return null;
      return {...s,observed:[...s.observed,a.anchor]};
    }
    case 'test-milo':case 'test-resident':case 'test-water':{
      const kind=a.type.slice(5);
      if(!readyForBaseline(s))return null;
      if(s.phase==='inspect'&&kind!=='milo')return null;
      if(s.phase==='first-trial'&&kind==='milo')return null;
      if(!includes(['inspect','first-trial','revise'],s.phase))return null;
      if(s.phase==='first-trial'&&!s.firstTrials.milo)return null;
      if(s.phase==='revise'&&(s.currentSnap===BASELINE||!s.previousSnaps.length))return null;
      const field=s.phase==='revise'?'revisedTrials':'firstTrials';
      if(s[field][kind])return null;
      const updated={...s[field],[kind]:traceResult(s,kind)};
      const phase=s.phase==='revise'?'revise':Object.values(updated).every(Boolean)?'revise':'first-trial';
      return {...s,[field]:updated,phase};
    }
    case 'run-all-traces':{
      if(s.phase!=='revise'||s.currentSnap===BASELINE||!firstComplete(s)||!firstShowsSideEffect(s)||
        revisedComplete(s)||!readyForBaseline(s))return null;
      const revisedTrials={};
      for(const kind of ['milo','resident','water'])revisedTrials[kind]=traceResult(s,kind);
      return {...s,revisedTrials};
    }
    case 'place-piece':{
      if(s.phase!=='revise'||!firstComplete(s)||!firstShowsSideEffect(s)||
        s.miloPosition!=='workbench'||a.pieceId!=='connector'||
        typeof a.snapId!=='string'||!own(SNAPS,a.snapId)||a.snapId===s.currentSnap)return null;
      return {...s,currentSnap:a.snapId,previousSnaps:[...s.previousSnaps,s.currentSnap],
        revisedTrials:{milo:null,resident:null,water:null},compared:false};
    }
    case 'undo-piece':{
      if(s.phase!=='revise'||!s.previousSnaps.length||s.miloPosition!=='workbench')return null;
      return {...s,currentSnap:s.previousSnaps.at(-1),previousSnaps:s.previousSnaps.slice(0,-1),
        revisedTrials:{milo:null,resident:null,water:null},compared:false};
    }
    case 'compare-layouts':{
      if(s.phase!=='revise'||s.currentSnap===BASELINE||!firstComplete(s)||
        !firstShowsSideEffect(s)||!revisedAllPass(s)||s.compared)return null;
      return {...s,phase:'compare',compared:true};
    }
    case 'confirm-preview':{
      if(s.phase!=='compare'||!s.compared||!revisedAllPass(s)||s.currentSnap===BASELINE)return null;
      return {...s,phase:'preview-complete',previewComplete:true};
    }
    default:return null;
  }
}
export function replay(history){
  if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
  let s=fresh();
  for(const a of history){
    const clean=cleanAction(a);
    if(!clean||!equal(clean,a)||a.type==='reset')return null;
    const next=apply(s,clean);
    if(!next)return null;
    s={...next,history:[...s.history,clean]};
  }
  return s;
}
export function restore(snapshot){
  if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||
    snapshot.version!==VERSION||snapshot.mode!=='authoring_preview')return null;
  const rebuilt=replay(snapshot.history);
  return rebuilt&&equal(rebuilt,snapshot)?rebuilt:null;
}
export function dispatch(state,action){
  const s=restore(state);
  if(!s)return fresh(); // Reject forged snapshots, never trust a claimed completed flag.
  const clean=cleanAction(action);
  if(!clean||!equal(clean,action))return s;
  if(clean.type==='reset')return fresh();
  if(s.history.length>=MAX_ACTIONS)return s;
  const next=apply(s,clean);
  return next?{...next,history:[...s.history,clean]}:s;
}
export function previewProjection(state){
  const s=restore(state);
  if(!s)return null;
  const baseline=evaluateLayout(BASELINE),current=evaluateLayout(s.currentSnap);
  const trials=s.phase==='inspect'||s.phase==='first-trial'?s.firstTrials:s.revisedTrials;
  const message=s.previewComplete?'The model works for Milo and leaves room for others and water. Real construction is not approved.':
    s.phase==='compare'?'Compare FIRST and NOW. Who else can pass?':
    s.phase==='inspect'?'Walk to the shared path and channel. Look before you test.':
    s.phase==='first-trial'?'It works for Milo. Who else uses this place?':
    trials.resident&&!trials.resident.pass?'The shared path is blocked. Try moving the piece.':
    trials.water&&!trials.water.pass?'Water needs a way. Try moving the piece.':
    'Move the model connector, then test Milo, another user and water.';
  return {scene:'s01e07-connector-passage',mode:'authoring_preview',label:'MODEL — NOT THE REAL SITE',
    phase:s.phase,miloPosition:s.miloPosition,observed:[...s.observed],
    baseline,layout:current,firstTrials:s.firstTrials,revisedTrials:s.revisedTrials,
    compared:s.compared,previewComplete:s.previewComplete,
    firstNow:s.compared?{first:baseline,now:current}:null,
    message,stepsHook:s.previewComplete?'Lantern Steps base only; lights remain off.':null,
    canonicalEvents:[],unlocks:[],historicalClaims:[]};
}
