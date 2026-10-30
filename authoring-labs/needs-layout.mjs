// E10 needs -> E11 reversible shared-space paper trial. NEVER canonical.
import * as E10 from '../engine/s01e10-authoring-prototype.mjs';
import * as E11 from '../engine/s01e11-authoring-prototype.mjs';
export const VERSION='season1-needs-layout-paper-v1',MAX_ACTIONS=250;
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function fresh(){return {version:VERSION,mode:'authoring_preview',stage:'needs',
  needs:E10.fresh(),layout:E11.fresh(),history:[],
  canonicalEvents:[],unlocks:[],historicalClaims:[],rights:[]};}
function clean(a){
 if(!a||typeof a!=='object'||Array.isArray(a))return null;
 if(a.scene==='nav'&&['to-layout','to-needs'].includes(a.type))return {scene:'nav',type:a.type};
 if(a.scene==='needs'){
  if(a.type==='walk')return {scene:'needs',type:a.type,to:a.to};
  if(a.type==='inspect')return {scene:'needs',type:a.type,traceId:a.traceId};
  if(['suggest','remove'].includes(a.type))return {scene:'needs',type:a.type,traceId:a.traceId,useTag:a.useTag};
  if(a.type==='revise')return {scene:'needs',type:a.type,traceId:a.traceId,oldTag:a.oldTag,newTag:a.newTag};
  if(a.type==='hear')return {scene:'needs',type:a.type,needId:a.needId};
  if(a.type==='place')return {scene:'needs',type:a.type,needId:a.needId,slot:a.slot};
  if(['compare-symbol','check-source','review-tradeoff','review'].includes(a.type))return {scene:'needs',type:a.type};
 }
 if(a.scene==='layout'){
  if(a.type==='move-milo')return {scene:'layout',type:a.type,to:a.to};
  if(a.type==='place')return {scene:'layout',type:a.type,tokenId:a.tokenId,cells:a.cells};
  if(a.type==='lift')return {scene:'layout',type:a.type,tokenId:a.tokenId};
  if(a.type==='test-user')return {scene:'layout',type:a.type,userId:a.userId};
  if(a.type==='compare-trials')return {scene:'layout',type:a.type,first:a.first,second:a.second};
  if(a.type==='cite-earlier')return {scene:'layout',type:a.type,discoveryId:a.discoveryId};
  if(['add-loop-edge','remove-loop-edge'].includes(a.type))return {scene:'layout',type:a.type,edgeId:a.edgeId};
  if(['snapshot-trial','check-loop','review-preview'].includes(a.type))return {scene:'layout',type:a.type};
 }
 return null;
}
const ready=n=>n.reviewed&&n.sourceChecked&&!n.nameRevealed&&!n.fixtureEnabled&&
 Object.keys(E10.NEEDS).every(id=>n.heard.includes(id)&&E10.SLOTS.includes(n.board[id]))&&
 n.board.quiet!==n.board.activity;
function apply(s,a){
 if(a.scene==='nav'){
  if(a.type==='to-layout'&&s.stage==='needs'&&ready(s.needs))return {...s,stage:'layout'};
  if(a.type==='to-needs'&&s.stage==='layout')return {...s,stage:'needs'};
  return null;
 }
 if(a.scene==='needs'&&s.stage==='needs'){
  const {scene,...command}=a,after=E10.dispatch(s.needs,command);
  return eq(after,s.needs)?null:{...s,needs:after,layout:E11.fresh()};
 }
 if(a.scene==='layout'&&s.stage==='layout'&&ready(s.needs)){
  const {scene,...command}=a,after=E11.dispatch(s.layout,command);
  return eq(after,s.layout)?null:{...s,layout:after};
 }
 return null;
}
export function replay(history){
 if(!Array.isArray(history)||history.length>MAX_ACTIONS)return null;
 let s=fresh();
 for(const action of history){
  const a=clean(action);if(!a||!eq(a,action))return null;
  const next=apply(s,a);if(!next)return null;
  s={...next,history:[...s.history,a]};
 }
 return s;
}
export function restore(snapshot){
 if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||snapshot.version!==VERSION||
 snapshot.mode!=='authoring_preview')return null;
 const s=replay(snapshot.history);return s&&eq(s,snapshot)?s:null;
}
export function dispatch(snapshot,action){
 const s=restore(snapshot);if(!s)return fresh();
 if(s.history.length>=MAX_ACTIONS)return s;
 const a=clean(action);if(!a||!eq(a,action))return s;
 const next=apply(s,a);return next?{...next,history:[...s.history,a]}:s;
}
export function project(snapshot){
 const s=restore(snapshot);if(!s)return null;
 return {stage:s.stage,sourceStatus:'UNKNOWN — SOURCE PENDING',
  simulatedNeeds:s.needs.heard.map(id=>({id,slot:s.needs.board[id]??null,kind:'SIMULATED'})),
  needsReviewed:s.needs.reviewed,layoutReviewed:s.layout.reviewed,
  trials:s.layout.trials.length,comparison:s.layout.comparison,
  loopChecked:s.layout.loopChecked,upperHillClosed:true,
  actualName:null,actualAccessApproved:false,actualNeedsApproved:false,
  seasonFinished:false,canonicalEvents:[],unlocks:[],historicalClaims:[],rights:[],
  note:'The E10 simulated needs inform only a reversible E11 paper trial; no approved name, entry, public loop or season ending.'};
}
