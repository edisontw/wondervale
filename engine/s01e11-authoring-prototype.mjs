// E11 FICTIONAL PAPER MODEL ONLY. No real access, historical source, canonical save or unlock.
export const VERSION='s01e11-authoring-v1',MODE='SYNTHETIC_AUTHORING_ONLY',MAX_ACTIONS=160;
export const START='1,0',EXIT='1,3',BOUNDARY=Object.freeze(['0,3','2,3']);
export const TOKENS=Object.freeze(['quiet','activity','access']);
export const USERS=Object.freeze(['quiet_reader','activity_group']);
export const EVIDENCE=Object.freeze(['e03_delivery','e06_drainage','e07_user_impact','e09_closure','e10_needs']);
export const SAFE_LINKS=Object.freeze({'square-market':['square','market'],'market-common':['market','common'],'common-square':['common','square'],'square-garden':['square','garden'],'garden-map_room':['garden','map_room']});
export const CLOSED_LINKS=Object.freeze(['north_hill_closed','old_north_hill_direct']);
const own=(o,k)=>Object.hasOwn(o,k),cp=x=>JSON.parse(JSON.stringify(x)),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const validCell=x=>typeof x==='string'&&/^[0-2],[0-3]$/.test(x)&&!BOUNDARY.includes(x);
const adjacent=(a,b)=>{const [r,c]=a.split(',').map(Number),[s,d]=b.split(',').map(Number);return Math.abs(r-s)+Math.abs(c-d)===1;};
const sorted=a=>[...a].sort(),has=(a,x)=>a.includes(x);
const emptyLayout=()=>({quiet:[],activity:[],access:[]});
const occupied=(s,except)=>TOKENS.filter(k=>k!==except&&k!=='access').flatMap(k=>s.layout[k]);
function pathOpen(s){
 const blocked=new Set([...BOUNDARY,...s.layout.quiet,...s.layout.activity]),q=[START],seen=new Set(q);
 if(blocked.has(START)||blocked.has(EXIT))return false;
 while(q.length){const n=q.shift();if(n===EXIT)return true;
  for(let r=0;r<3;r++)for(let c=0;c<4;c++){const v=r+','+c;
   if(!seen.has(v)&&!blocked.has(v)&&adjacent(n,v)){seen.add(v);q.push(v);}
  }
 }return false;
}
function scenario(s,id){
 if(!s.layout.access.length)return {passed:false,reason:'Place the model access strip first.'};
 if(!s.layout.quiet.length||!s.layout.activity.length)return {passed:false,reason:'Keep both simulated needs on the board.'};
 if(!pathOpen(s))return {passed:false,reason:'The route is blocked; Milo stops.'};
 if(id==='quiet_reader'){
  if(!s.layout.access.some(x=>adjacent(x,s.layout.quiet[0])))return {passed:false,reason:'The quiet seat lacks adjacent passage.'};
  if(adjacent(s.layout.quiet[0],s.layout.activity[0]))return {passed:false,reason:'The activity piece touches the quiet seat.'};
  return {passed:true,reason:'The simulated reader can reach a quiet seat.'};
 }
 if(s.layout.access.includes(s.layout.activity[0]))return {passed:false,reason:'Activity blocks the access strip.'};
 return {passed:true,reason:'The simulated group has space without blocking passage.'};
}
function isLoop(ids){
 if(ids.length<3)return false;
 const graph={},degrees={};
 for(const id of ids){if(!own(SAFE_LINKS,id))return false;
  const [a,b]=SAFE_LINKS[id];for(const [x,y] of [[a,b],[b,a]]){(graph[x]??=[]).push(y);degrees[x]=(degrees[x]||0)+1;}
 }
 const nodes=Object.keys(degrees);
 if(nodes.length<3||!nodes.includes('common')||nodes.length!==ids.length||nodes.some(x=>degrees[x]!==2))return false;
 const seen=new Set(['common']),stack=['common'];
 while(stack.length){const x=stack.pop();for(const y of graph[x])if(!seen.has(y)){seen.add(y);stack.push(y);}}
 return seen.size===nodes.length;
}
export function fresh(){return {version:VERSION,mode:MODE,position:START,layout:emptyLayout(),revision:0,
 tests:{},trials:[],comparison:null,citation:null,loopEdges:[],loopChecked:false,reviewed:false,
 blockedAttempts:0,feedback:'FICTIONAL MODEL — no approved access, history or testimony.',
 history:[],canonicalEvents:[],unlocks:[],historicalClaims:[],rights:[],finished:false};}
function clean(a){
 if(!a||typeof a!=='object'||Array.isArray(a))return null;
 let v;
 switch(a.type){
  case 'move-milo':v={type:a.type,to:a.to};break;
  case 'place':v={type:a.type,tokenId:a.tokenId,cells:a.cells};break;
  case 'lift':v={type:a.type,tokenId:a.tokenId};break;
  case 'test-user':v={type:a.type,userId:a.userId};break;
  case 'compare-trials':v={type:a.type,first:a.first,second:a.second};break;
  case 'cite-earlier':v={type:a.type,discoveryId:a.discoveryId};break;
  case 'add-loop-edge':case 'remove-loop-edge':v={type:a.type,edgeId:a.edgeId};break;
  case 'snapshot-trial':case 'check-loop':case 'review-preview':case 'reset':v={type:a.type};break;
  default:return null;
 }
 return eq(v,a)?v:null;
}
const invalidate=s=>({...s,tests:{},comparison:null,reviewed:false});
function apply(s,a){
 switch(a.type){
  case 'move-milo':{
   if(!validCell(a.to)||!adjacent(s.position,a.to))return null;
   if([...BOUNDARY,...s.layout.quiet,...s.layout.activity].includes(a.to))
    return {...s,blockedAttempts:s.blockedAttempts+1,feedback:'Milo stops before the blocked paper cell. Try again.'};
   return {...s,position:a.to,feedback:'Milo walked one model step.'};
  }
  case 'place':{
   if(!has(TOKENS,a.tokenId)||!Array.isArray(a.cells)||!a.cells.length||
      !a.cells.every(validCell)||new Set(a.cells).size!==a.cells.length)return null;
   if(a.tokenId==='access'){
    if(a.cells.length!==2||!eq(sorted(a.cells),['1,1','1,2'])||occupied(s,'access').some(x=>a.cells.includes(x)))return null;
   }else if(a.cells.length!==1||[START,EXIT].includes(a.cells[0])||
      occupied(s,a.tokenId).includes(a.cells[0])||s.layout.access.includes(a.cells[0]))return null;
   const cells=sorted(a.cells);if(eq(s.layout[a.tokenId],cells))return null;
   const n=invalidate(s);return {...n,layout:{...s.layout,[a.tokenId]:cells},revision:s.revision+1,
    feedback:'Moved a reversible paper piece. Retest both simulated users.'};
  }
  case 'lift':{
   if(!has(TOKENS,a.tokenId)||!s.layout[a.tokenId].length)return null;
   const n=invalidate(s);return {...n,layout:{...s.layout,[a.tokenId]:[]},revision:s.revision+1,
    feedback:'Lifted the paper piece. Nothing is built.'};
  }
  case 'test-user':{
   if(!has(USERS,a.userId)||own(s.tests,a.userId))return null;
   const result=scenario(s,a.userId);
   return {...s,tests:{...s.tests,[a.userId]:result},feedback:result.reason};
  }
  case 'snapshot-trial':{
   if(!USERS.every(id=>own(s.tests,id))||s.trials.length>=12||s.trials.some(t=>t.revision===s.revision))return null;
   const trial={id:'trial-'+(s.trials.length+1),revision:s.revision,layout:cp(s.layout),tests:cp(s.tests)};
   return {...s,trials:[...s.trials,trial],feedback:'Saved a synthetic trial for before/after comparison.'};
  }
  case 'compare-trials':{
   if(typeof a.first!=='string'||typeof a.second!=='string'||a.first===a.second)return null;
   const i=s.trials.findIndex(t=>t.id===a.first),j=s.trials.findIndex(t=>t.id===a.second);
   if(i<0||j<=i||!eq(s.trials[j].layout,s.layout)||eq(s.trials[i].layout,s.trials[j].layout)||
     !USERS.every(id=>s.trials[j].tests[id]?.passed))return null;
   return {...s,comparison:{first:a.first,second:a.second,
    limitation:'A paper-model success is not real access, consent, drainage or universal agreement.'},
    reviewed:false,feedback:'Both simulated needs work after revision; real access is unknown.'};
  }
  case 'cite-earlier':{
   if(!has(EVIDENCE,a.discoveryId)||s.citation===a.discoveryId)return null;
   return {...s,citation:a.discoveryId,reviewed:false,
    feedback:'SYNTHETIC earlier-discovery label, not verified canonical evidence.'};
  }
  case 'add-loop-edge':{
   if(typeof a.edgeId!=='string'||!own(SAFE_LINKS,a.edgeId)||has(s.loopEdges,a.edgeId))return null;
   return {...s,loopEdges:[...s.loopEdges,a.edgeId],loopChecked:false,reviewed:false,
    feedback:'Added a fictional contemporary link; not permission to enter.'};
  }
  case 'remove-loop-edge':{
   if(!has(s.loopEdges,a.edgeId))return null;
   return {...s,loopEdges:s.loopEdges.filter(x=>x!==a.edgeId),loopChecked:false,reviewed:false,
    feedback:'Removed a paper-map link. Check the loop again.'};
  }
  case 'check-loop':{
   if(s.loopChecked)return null;
   const ok=isLoop(s.loopEdges);
   return {...s,loopChecked:ok,reviewed:false,feedback:ok?
    'Fictional closed loop includes Common; real links are not approved.':
    'The selected links do not form one connected safe closed cycle.'};
  }
  case 'review-preview':{
   if(s.reviewed||!s.comparison||!s.citation||!s.loopChecked||!USERS.every(id=>s.tests[id]?.passed))return null;
   return {...s,reviewed:true,feedback:'NONCANONICAL finale preview; Common remains closed.'};
  }
  default:return null;
 }
}
export function replay(history){
 if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
 let s=fresh();
 for(const a of history){const c=clean(a);if(!c||c.type==='reset')return null;
  const n=apply(s,c);if(!n)return null;
  s={...n,history:[...s.history,cp(c)]};
 }return s;
}
export function restore(snapshot){
 if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||!Array.isArray(snapshot.history))return null;
 const s=replay(snapshot.history);return s&&eq(s,snapshot)?s:null;
}
export function dispatch(snapshot,action){
 const s=restore(snapshot);if(!s)return fresh();
 const a=clean(action);if(!a)return s;
 if(a.type==='reset')return fresh();
 if(s.history.length>=MAX_ACTIONS)return s;
 const n=apply(s,a);return n?{...n,history:[...s.history,cp(a)]}:s;
}
export function projection(snapshot){
 const s=restore(snapshot);if(!s)return null;
 return {label:'FICTIONAL MODEL — NOT APPROVED HISTORY, ACCESS OR CONSTRUCTION',
  position:s.position,layout:cp(s.layout),tests:cp(s.tests),trials:cp(s.trials),
  comparison:cp(s.comparison),citation:s.citation?{id:s.citation,kind:'SYNTHETIC_REFERENCE_ONLY'}:null,
  loopEdges:[...s.loopEdges],loopChecked:s.loopChecked,reviewed:s.reviewed,
  oldMapStatus:'HISTORIC LINE NOT PROVEN SAFE',currentMapStatus:'MODEL ONLY — NO ACCESS PROOF',
  feedback:s.feedback,canonicalEvents:[],unlocks:[],historicalClaims:[],finished:false};
}
