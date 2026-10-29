// E08 authoring-only lower Lantern Steps model. Synthetic geometry and lamp switches
// are not actual pavement, electrical work, historical evidence, or canonical progress.
export const VERSION = 's01e08-authoring-prototype-v1';
export const MAX_ACTIONS = 80;
export const MARKERS = Object.freeze([
  Object.freeze({id:'mark-a',x:3,y:2}),
  Object.freeze({id:'mark-b',x:5,y:3}),
  Object.freeze({id:'mark-c',x:7,y:4})
]);
export const VIEWPOINTS = Object.freeze({
  base:Object.freeze({x:1,y:1}),
  'lower-landing':Object.freeze({x:2,y:1}),
  side:Object.freeze({x:1,y:4})
});
export const SAFE_EDGES = Object.freeze([
  Object.freeze(['base','lower-landing']),
  Object.freeze(['lower-landing','side'])
]);
export const FIXTURES = Object.freeze(['lower-a','lower-b']);
export const FEATURES = Object.freeze({
  brackets:'base',boundary:'base',
  'lower-a':'base','lower-b':'lower-landing',
  'service-plate':'side'
});
const own=(o,k)=>Object.hasOwn(o,k);
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const clone=x=>JSON.parse(JSON.stringify(x));
const bothOn=s=>FIXTURES.every(id=>s.lights[id]);
const ready=s=>['brackets','boundary'].every(id=>s.inspected.includes(id));
const lampHash=s=>FIXTURES.map(id=>id+':'+(s.lights[id]?'on':'off')).join('|');
const round=x=>Math.round(x*1000000)/1000000;

export function angularSpreadDegrees(markers,viewpoint){
  if(!Array.isArray(markers)||markers.length<2||!viewpoint||
     !Number.isFinite(viewpoint.x)||!Number.isFinite(viewpoint.y))return null;
  const angles=[];
  for(const marker of markers){
    if(!marker||!Number.isFinite(marker.x)||!Number.isFinite(marker.y)||
       (marker.x===viewpoint.x&&marker.y===viewpoint.y))return null;
    const angle=Math.atan2(marker.y-viewpoint.y,marker.x-viewpoint.x)*180/Math.PI;
    angles.push((angle+360)%360);
  }
  angles.sort((a,b)=>a-b);
  let largest=0;
  for(let i=0;i<angles.length;i++){
    const next=i===angles.length-1?angles[0]+360:angles[i+1];
    largest=Math.max(largest,next-angles[i]);
  }
  return round(Math.max(0,360-largest));
}
export function geometryAt(anchor){
  if(typeof anchor!=='string'||!own(VIEWPOINTS,anchor))return null;
  const v=VIEWPOINTS[anchor];
  const angles=MARKERS.map(m=>({
    id:m.id,angleDegrees:round(Math.atan2(m.y-v.y,m.x-v.x)*180/Math.PI)
  }));
  return {viewpoint:anchor,markerIds:MARKERS.map(m=>m.id),
    angles,spreadDegrees:angularSpreadDegrees(MARKERS,v),
    source:'synthetic-perspective-model-only'};
}
export function fresh(){
  return {version:VERSION,mode:'authoring_preview',phase:'inspect',
    miloPosition:'base',inspected:[],
    lights:{'lower-a':false,'lower-b':false},observations:[],
    compared:false,comparison:null,previewComplete:false,history:[],
    canonicalEvents:[],unlocks:[],historicalClaims:[]};
}
function cleanAction(a){
  if(!a||typeof a!=='object'||Array.isArray(a))return null;
  switch(a.type){
    case 'walk':return {type:'walk',anchor:a.anchor};
    case 'inspect':return {type:'inspect',feature:a.feature};
    case 'toggle-lamp':return {type:'toggle-lamp',lampId:a.lampId};
    case 'observe-view':case 'compare-views':case 'confirm-preview':
    case 'reset':return {type:a.type};
    default:return null;
  }
}
function apply(s,a){
  if(s.previewComplete)return null;
  switch(a.type){
    case 'walk':{
      if(typeof a.anchor!=='string'||!own(VIEWPOINTS,a.anchor)||
         a.anchor===s.miloPosition||
         !SAFE_EDGES.some(([x,y])=>
           (x===s.miloPosition&&y===a.anchor)||
           (y===s.miloPosition&&x===a.anchor)))return null;
      return {...s,miloPosition:a.anchor};
    }
    case 'inspect':{
      if(typeof a.feature!=='string'||!own(FEATURES,a.feature)||
         FEATURES[a.feature]!==s.miloPosition||s.inspected.includes(a.feature))return null;
      return {...s,inspected:[...s.inspected,a.feature]};
    }
    case 'toggle-lamp':{
      if(!ready(s)||typeof a.lampId!=='string'||!FIXTURES.includes(a.lampId)||
         !s.inspected.includes(a.lampId))return null;
      return {...s,phase:'light-test',
        lights:{...s.lights,[a.lampId]:!s.lights[a.lampId]},
        observations:[],compared:false,comparison:null};
    }
    case 'observe-view':{
      if(!ready(s)||!bothOn(s)||s.observations.length>=8)return null;
      const result=geometryAt(s.miloPosition);
      if(!result)return null;
      return {...s,phase:'view-test',compared:false,comparison:null,
        observations:[...s.observations,{...result,lampStateHash:lampHash(s)}]};
    }
    case 'compare-views':{
      if(!bothOn(s)||s.compared||s.observations.length<2)return null;
      const first=s.observations[0];
      const second=[...s.observations].reverse().find(o=>o.viewpoint!==first.viewpoint);
      if(!second||first.lampStateHash!==second.lampStateHash||
         first.lampStateHash!==lampHash(s))return null;
      const delta=round(Math.abs(first.spreadDegrees-second.spreadDegrees));
      if(delta<5)return null;
      return {...s,phase:'compare',compared:true,
        comparison:{from:first,to:second,spreadDifferenceDegrees:delta,
          markersUnchanged:true,interpretation:'perspective-changes-apparent-spacing'}};
    }
    case 'confirm-preview':{
      if(!s.compared||!s.comparison||!s.inspected.includes('service-plate')||
         !bothOn(s))return null;
      return {...s,phase:'preview-complete',previewComplete:true};
    }
    default:return null;
  }
}
export function replay(history){
  if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
  let state=fresh();
  for(const action of history){
    const clean=cleanAction(action);
    if(!clean||!equal(clean,action)||action.type==='reset')return null;
    const next=apply(state,clean);
    if(!next)return null;
    state={...next,history:[...state.history,clone(clean)]};
  }
  return state;
}
export function restore(snapshot){
  if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||
     !Array.isArray(snapshot.history))return null;
  const derived=replay(snapshot.history);
  return derived&&equal(derived,snapshot)?derived:null;
}
export function dispatch(snapshot,action){
  const state=restore(snapshot);
  if(!state)return fresh();
  const clean=cleanAction(action);
  if(!clean||!equal(clean,action))return state;
  if(clean.type==='reset')return fresh();
  if(state.history.length>=MAX_ACTIONS)return state;
  const next=apply(state,clean);
  return next?{...next,history:[...state.history,clone(clean)]}:state;
}
export function previewProjection(snapshot){
  const state=restore(snapshot);
  if(!state)return null;
  return {scene:'s01e08-lower-lantern-steps-model',
    label:'MODEL — NOT THE REAL STEPS',phase:state.phase,
    miloPosition:state.miloPosition,inspected:[...state.inspected],
    lights:{...state.lights},enoughLight:bothOn(state),
    message:bothOn(state)?'The lower marks are visible.':'Not enough light to compare yet.',
    observations:clone(state.observations),comparison:clone(state.comparison),
    servicePlate:state.inspected.includes('service-plate')?'undated_source_pending':null,
    previewComplete:state.previewComplete,
    next:'E09 safe North Hill survey — production not unlocked',
    canonicalEvents:[],unlocks:[],historicalClaims:[]};
}
