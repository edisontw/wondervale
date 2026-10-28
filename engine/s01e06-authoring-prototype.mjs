// S01E06 authoring-only two-garden model. All geometry, runoff and planting sites are
// synthetic test fixtures, NOT historical evidence, approved terrain or a production scene.
// Pure in-memory state: no localStorage, canonical ledger, E05 checkpoint or E07 unlock.
export const VERSION='s01e06-authoring-prototype-v1';
export const MAX_ACTIONS=80;
export const CURRENT_ANCHORS=Object.freeze(['present-bed','slope','shared-path','model-tray']);
export const LOWER_ANCHORS=Object.freeze(['runoff-trace','public-path','runoff-channel','footpath','raised-pocket']);
export const CURRENT_OBSERVATIONS=Object.freeze(['present-bed','slope','shared-path']);
export const LOWER_OBSERVATIONS=Object.freeze(['runoff-trace','public-path']);
export const SITES=Object.freeze({
  'runoff-channel':Object.freeze({x:1,y:2,wet:true,blocksPath:false}),
  'footpath':Object.freeze({x:3,y:2,wet:false,blocksPath:true}),
  'raised-pocket':Object.freeze({x:4,y:1,wet:false,blocksPath:false})
});
const includes=(xs,x)=>xs.includes(x);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function simulate(weather,channel){
  if(!includes(['dry','rain'],weather)||!includes(['open','blocked'],channel))return null;
  return {weather,channel,catchment:weather==='dry'?0:channel==='blocked'?3:1,
    bypass:weather==='rain'&&channel==='open'?2:0,synthetic:true};
}
export function siteEffect(site){
  if(!Object.hasOwn(SITES,site))return null;
  return {wet:SITES[site].wet,blocksPath:SITES[site].blocksPath,
    provisional:SITES[site].wet===false&&SITES[site].blocksPath===false};
}
export function fresh(){
  return {version:VERSION,mode:'authoring_preview',phase:'current',
    location:'present-bed',currentObserved:[],weather:'dry',channel:'open',
    modelRuns:[],modelCompared:false,lowerObserved:[],markerSite:null,
    markerInspected:false,lowerPreviewStarted:false,history:[],
    canonicalEvents:[],unlocks:[],historicalClaims:[]};
}
function canonical(a){
  if(!a||typeof a!=='object'||Array.isArray(a))return null;
  switch(a.type){
    case 'walk-to':return {type:'walk-to',target:a.target};
    case 'inspect':return {type:'inspect',id:a.id};
    case 'set-weather':return {type:'set-weather',weather:a.weather};
    case 'set-channel':return {type:'set-channel',channel:a.channel};
    case 'move-marker':return {type:'move-marker',site:a.site};
    case 'run-model':case 'compare-model':case 'visit-lower':
    case 'inspect-result':case 'confirm-small-trial':return {type:a.type};
    default:return null;
  }
}
function hasModelEvidence(runs){
  const has=(w,c)=>runs.some(r=>r.weather===w&&(c===null||r.channel===c));
  return has('dry',null)&&has('rain','open')&&has('rain','blocked');
}
function apply(s,a){
  if(s.phase==='done')return null;
  switch(a.type){
    case 'walk-to':{
      const anchors=s.phase==='current'?CURRENT_ANCHORS:LOWER_ANCHORS;
      if(!includes(anchors,a.target)||a.target===s.location)return null;
      return {...s,location:a.target};
    }
    case 'inspect':{
      const options=s.phase==='current'?CURRENT_OBSERVATIONS:LOWER_OBSERVATIONS;
      const field=s.phase==='current'?'currentObserved':'lowerObserved';
      if(!includes(options,a.id)||s.location!==a.id||s[field].includes(a.id))return null;
      return {...s,[field]:[...s[field],a.id]};
    }
    case 'set-weather':
      if(s.phase!=='current'||s.currentObserved.length<2||
        !includes(['dry','rain'],a.weather)||s.weather===a.weather)return null;
      return {...s,weather:a.weather};
    case 'set-channel':
      if(s.phase!=='current'||s.currentObserved.length<2||
        !includes(['open','blocked'],a.channel)||s.channel===a.channel)return null;
      return {...s,channel:a.channel};
    case 'run-model':{
      if(s.phase!=='current'||s.location!=='model-tray'||s.currentObserved.length<2||
        s.modelRuns.length>=4||s.modelRuns.some(r=>r.weather===s.weather&&r.channel===s.channel))return null;
      return {...s,modelRuns:[...s.modelRuns,simulate(s.weather,s.channel)]};
    }
    case 'compare-model':
      if(s.phase!=='current'||s.location!=='model-tray'||s.modelCompared||
        !hasModelEvidence(s.modelRuns))return null;
      return {...s,modelCompared:true};
    case 'visit-lower':
      if(s.phase!=='current'||!s.modelCompared)return null;
      return {...s,phase:'lower',location:'runoff-trace'};
    case 'move-marker':
      if(s.phase!=='lower'||s.lowerObserved.length!==LOWER_OBSERVATIONS.length||
        !Object.hasOwn(SITES,a.site)||s.location!==a.site||s.markerSite===a.site)return null;
      return {...s,markerSite:a.site,markerInspected:false};
    case 'inspect-result':
      if(s.phase!=='lower'||!s.markerSite||s.markerInspected)return null;
      return {...s,markerInspected:true};
    case 'confirm-small-trial':
      if(s.phase!=='lower'||!s.markerInspected||!siteEffect(s.markerSite)?.provisional||
        s.lowerObserved.length!==LOWER_OBSERVATIONS.length)return null;
      return {...s,phase:'done',lowerPreviewStarted:true};
    default:return null;
  }
}
export function replay(history){
  if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
  let s=fresh();
  for(const action of history){
    const clean=canonical(action);
    if(!clean||!same(clean,action))return null;
    const next=apply(s,clean);
    if(!next)return null;
    s={...next,history:[...s.history,clean]};
  }
  return s;
}
export function restore(snapshot){
  if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||
    snapshot.version!==VERSION||snapshot.mode!=='authoring_preview')return null;
  const s=replay(snapshot.history);
  return s&&same(s,snapshot)?s:null;
}
export function dispatch(state,action){
  const s=restore(state);
  if(!s)return fresh(); // Fail closed on tampered state.
  if(s.history.length>=MAX_ACTIONS)return s;
  const clean=canonical(action);
  if(!clean||!same(clean,action))return s;
  const next=apply(s,clean);
  return next?{...next,history:[...s.history,clean]}:s;
}
export function previewProjection(state){
  const s=restore(state);
  if(!s)return null;
  const lastRun=s.modelRuns.at(-1)??null;
  const placement=siteEffect(s.markerSite);
  const observed=s.phase==='current'?s.currentObserved:s.lowerObserved;
  const message=s.phase==='done'?
    'A small LOWER pocket appears in this preview. The healthy upper garden stays. Growth is not guaranteed.':
    s.phase==='lower'&&placement?
      placement.wet?'The marker is in a water route. It may get wet; try another spot.':
      placement.blocksPath?'The marker blocks the shared path. Milo can move it.':
      'This small pocket leaves the modeled water route and path clear. It still needs permission.':
    s.phase==='lower'?'Look at the water trace and the shared path before trying a small pocket.':
    s.modelCompared?'Water can run down in this MODEL. We still do not know why the garden moved.':
    'Look at the healthy garden, compare the slope, then try the MODEL tray.';
  return {scene:s.phase==='current'?'s01e06-current-garden':'s01e06-lower-garden',
    location:s.location,observed,modelRuns:s.modelRuns,lastRun,modelCompared:s.modelCompared,
    placement,lowerPreviewStarted:s.lowerPreviewStarted,presentGardenHealthy:true,
    observedFacts:s.currentObserved.map(id=>({id,source:'visible-present-garden'})),
    simulatedEvidence:s.modelRuns.map(r=>({...r,source:'synthetic-tray-model'})),
    remainingQuestion:'Why did the real garden move? The model cannot establish its history.',
    message,canonicalEvents:[],unlocks:[],historicalClaims:[]};
}
