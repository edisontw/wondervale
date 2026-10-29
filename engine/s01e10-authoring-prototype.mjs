// Fictional E10 authoring fixture ONLY. No approved source, access, canonical save or unlock.
export const VERSION='s01e10-authoring-v1', MAX_ACTIONS=128;
export const NODES=Object.freeze(['entry','stone_edge','notice_wall','quiet_corner','meeting_edge']);
export const CLOSED_NODE='closed_hill';
export const EDGES=Object.freeze([['entry','stone_edge'],['entry','notice_wall'],['stone_edge','quiet_corner'],['notice_wall','meeting_edge'],['quiet_corner','meeting_edge']]);
export const TRACES=Object.freeze({
  surface:Object.freeze({at:'stone_edge',seen:'A worn strip; its age and use are unknown.'}),
  holes:Object.freeze({at:'notice_wall',seen:'Mounting holes; their age and use are unknown.'})
});
export const NEEDS=Object.freeze({
  quiet:Object.freeze({at:'quiet_corner',role:'simulated reader',want:'a quiet reading place'}),
  activity:Object.freeze({at:'meeting_edge',role:'simulated activity group',want:'room to meet and play'})
});
export const USE_TAGS=Object.freeze(['meeting','resting','display','passing']);
export const SLOTS=Object.freeze(['left','right','shared']);
const own=(o,k)=>Object.hasOwn(o,k),copy=x=>JSON.parse(JSON.stringify(x)),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const has=(a,x)=>a.includes(x),valid=(o,k)=>typeof k==='string'&&own(o,k);
const twoHyp=s=>Object.keys(TRACES).every(id=>s.hypotheses[id].length>0);
const twoNeeds=s=>Object.keys(NEEDS).every(id=>has(s.heard,id)&&own(s.board,id));
export function fresh(){return {version:VERSION,mode:'SYNTHETIC_AUTHORING_ONLY',position:'entry',
  inspected:[],observations:[],symbolCompared:false,hypotheses:{surface:[],holes:[]},
  heard:[],board:{},fixtureEnabled:false,sourceChecked:false,nameRevealed:false,
  tradeoffReviewed:false,reviewed:false,finished:false,blockedAttempts:0,
  feedback:'Fictional model: access and historical source are not approved.',
  history:[],canonicalEvents:[],unlocks:[],historicalClaims:[]};}
function clean(a){
  if(!a||typeof a!=='object'||Array.isArray(a))return null;
  switch(a.type){
    case 'walk':return {type:a.type,to:a.to};
    case 'inspect':return {type:a.type,traceId:a.traceId};
    case 'suggest':case 'remove':return {type:a.type,traceId:a.traceId,useTag:a.useTag};
    case 'revise':return {type:a.type,traceId:a.traceId,oldTag:a.oldTag,newTag:a.newTag};
    case 'hear':return {type:a.type,needId:a.needId};
    case 'place':return {type:a.type,needId:a.needId,slot:a.slot};
    case 'compare-symbol':case 'enable-fixture':case 'check-source':
    case 'review-tradeoff':case 'review':case 'finish-preview':case 'reset':return {type:a.type};
    default:return null;
  }
}
const invalidate=s=>({...s,tradeoffReviewed:false,reviewed:false});
function apply(s,a){
  if(s.finished)return null;
  switch(a.type){
    case 'walk':{
      if(a.to===CLOSED_NODE)return {...s,blockedAttempts:s.blockedAttempts+1,feedback:'The hill stays closed.'};
      if(typeof a.to!=='string'||!NODES.includes(a.to)||a.to===s.position||
        !EDGES.some(([x,y])=>(x===s.position&&y===a.to)||(y===s.position&&x===a.to)))return null;
      return {...s,position:a.to,feedback:'Milo walked to another model point.'};
    }
    case 'inspect':{
      if(!valid(TRACES,a.traceId)||TRACES[a.traceId].at!==s.position||has(s.inspected,a.traceId))return null;
      return {...s,inspected:[...s.inspected,a.traceId],
        observations:[...s.observations,{kind:'SEEN',traceId:a.traceId,text:TRACES[a.traceId].seen}],
        feedback:TRACES[a.traceId].seen};
    }
    case 'compare-symbol':
      return s.position==='entry'&&!s.symbolCompared?{...s,symbolCompared:true,feedback:'The shape resembles our sketch; no name is proved.'}:null;
    case 'suggest':{
      if(!valid(TRACES,a.traceId)||!has(s.inspected,a.traceId)||!has(USE_TAGS,a.useTag)||has(s.hypotheses[a.traceId],a.useTag))return null;
      const n=invalidate(s);return {...n,hypotheses:{...n.hypotheses,[a.traceId]:[...n.hypotheses[a.traceId],a.useTag]},
        feedback:'MAYBE: this is not a verified past use.'};
    }
    case 'revise':{
      if(!valid(TRACES,a.traceId)||!has(USE_TAGS,a.newTag)||!has(s.hypotheses[a.traceId],a.oldTag)||
        has(s.hypotheses[a.traceId],a.newTag))return null;
      const n=invalidate(s);return {...n,hypotheses:{...n.hypotheses,
        [a.traceId]:n.hypotheses[a.traceId].map(t=>t===a.oldTag?a.newTag:t)},
        feedback:'Revised MAYBE; SEEN evidence is unchanged.'};
    }
    case 'remove':{
      if(!valid(TRACES,a.traceId)||!has(s.hypotheses[a.traceId],a.useTag))return null;
      const n=invalidate(s);return {...n,hypotheses:{...n.hypotheses,
        [a.traceId]:n.hypotheses[a.traceId].filter(t=>t!==a.useTag)},feedback:'Removed MAYBE; try again.'};
    }
    case 'hear':{
      if(!valid(NEEDS,a.needId)||NEEDS[a.needId].at!==s.position||has(s.heard,a.needId))return null;
      return {...s,heard:[...s.heard,a.needId],feedback:'Simulated present need, not past testimony.'};
    }
    case 'place':{
      if(!valid(NEEDS,a.needId)||!has(s.heard,a.needId)||!has(SLOTS,a.slot)||s.board[a.needId]===a.slot)return null;
      const n=invalidate(s);return {...n,board:{...n.board,[a.needId]:a.slot},
        feedback:'Moved paper card; both voices remain.'};
    }
    case 'enable-fixture':
      return s.fixtureEnabled?null:{...s,fixtureEnabled:true,feedback:'SYNTHETIC TEST TOKEN only; no approved source.'};
    case 'check-source':{
      if(!s.symbolCompared||s.inspected.length!==2||s.sourceChecked)return null;
      return s.fixtureEnabled?{...s,sourceChecked:true,nameRevealed:true,
        feedback:'SYNTHETIC TEST TOKEN: Common. Not approved history.'}:
        {...s,sourceChecked:true,feedback:'UNKNOWN: name source not approved.'};
    }
    case 'review-tradeoff':
      return twoHyp(s)&&twoNeeds(s)&&!s.tradeoffReviewed?{...s,tradeoffReviewed:true,
        feedback:'Quiet and activity need different conditions. No permanent layout is chosen.'}:null;
    case 'review':
      return s.inspected.length===2&&s.symbolCompared&&twoHyp(s)&&twoNeeds(s)&&
        s.sourceChecked&&s.tradeoffReviewed&&!s.reviewed?{...s,reviewed:true,
        feedback:'SEEN / MAYBE / NEEDS / UNKNOWN remain separate.'}:null;
    case 'finish-preview':
      return s.reviewed&&s.fixtureEnabled&&s.nameRevealed&&s.tradeoffReviewed?
        {...s,finished:true,feedback:'Fictional preview only; no E11 unlock.'}:null;
    default:return null;
  }
}
export function replay(history){
  if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
  let s=fresh();
  for(const a of history){
    const c=clean(a);if(!c||!eq(c,a)||a.type==='reset')return null;
    const next=apply(s,c);if(!next)return null;
    s={...next,history:[...s.history,copy(c)]};
  }
  return s;
}
export function restore(snapshot){
  if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||!Array.isArray(snapshot.history))return null;
  const s=replay(snapshot.history);return s&&eq(s,snapshot)?s:null;
}
export function dispatch(snapshot,action){
  const s=restore(snapshot);if(!s)return fresh();
  const a=clean(action);if(!a||!eq(a,action))return s;
  if(a.type==='reset')return fresh();
  if(s.history.length>=MAX_ACTIONS)return s;
  const next=apply(s,a);return next?{...next,history:[...s.history,copy(a)]}:s;
}
export function previewProjection(snapshot){
  const s=restore(snapshot);if(!s)return null;
  return {label:'SYNTHETIC AUTHORING MODEL — NOT REAL ACCESS OR HISTORY',
    position:s.position,sourceStatus:s.nameRevealed?'SYNTHETIC — NO APPROVED SOURCE':'UNKNOWN — SOURCE PENDING',
    testName:s.nameRevealed?'Common':null,
    cards:{seen:copy(s.observations),
      maybe:Object.entries(s.hypotheses).flatMap(([traceId,tags])=>tags.map(useTag=>({traceId,useTag,qualifier:'MAYBE'}))),
      needs:s.heard.map(id=>({id,role:NEEDS[id].role,want:NEEDS[id].want,slot:s.board[id]??null,kind:'SIMULATED PRESENT NEED'})),
      unknown:['Actual trace ages and uses','Approved name source and rights','Actual safe entry and representative needs']},
    tradeoffReviewed:s.tradeoffReviewed,reviewed:s.reviewed,finished:s.finished,
    feedback:s.feedback,canonicalEvents:[],unlocks:[],historicalClaims:[]};
}
