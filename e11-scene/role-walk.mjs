// E11 child-stepped PAPER visitor rehearsal. No real users, rights, access or canonical events.
import {START,BOUNDARY,USERS,restore} from '../engine/s01e11-authoring-prototype.mjs';
const STAGES=['first','now'],MAX=80;
const own=(x,k)=>Object.hasOwn(x,k);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const adjacent=(a,b)=>{const [r,c]=a.split(',').map(Number),[s,d]=b.split(',').map(Number);return Math.abs(r-s)+Math.abs(c-d)===1;};
const cell=x=>typeof x==='string'&&/^[0-2],[0-3]$/.test(x)&&!BOUNDARY.includes(x);
const key=(stage,role)=>stage+':'+role;
function source(snapshot){
 const s=restore(snapshot);
 if(!s?.comparison)return null;
 const first=s.trials.find(t=>t.id===s.comparison.first);
 const now=s.trials.find(t=>t.id===s.comparison.second);
 if(!first||!now||!USERS.every(id=>own(first.tests,id)&&own(now.tests,id)))return null;
 return {first,now};
}
function initial(){return {stage:null,role:null,position:START,steps:0,blocked:0,visits:{},feedback:'Choose a visitor and a PAPER layout.'};}
function apply(s,a,sourceTrials){
 if(!a||typeof a!=='object'||Array.isArray(a))return null;
 if(a.type==='choose'){
  if(!same(Object.keys(a).sort(),['role','stage','type'])||!STAGES.includes(a.stage)||!USERS.includes(a.role))return null;
  return {...s,stage:a.stage,role:a.role,position:START,steps:0,feedback:'Walk one paper cell at a time. Try a blocked cell safely.'};
 }
 if(a.type==='step'){
  if(!same(Object.keys(a).sort(),['to','type'])||!s.stage||!cell(a.to)||!adjacent(s.position,a.to))return null;
  const layout=sourceTrials[s.stage].layout;
  if([...layout.quiet,...layout.activity].includes(a.to))
   return {...s,blocked:s.blocked+1,feedback:'The visitor stops before a paper piece. Choose another adjacent cell.'};
  return {...s,position:a.to,steps:s.steps+1,feedback:'The visitor moved one paper cell.'};
 }
 if(a.type==='check'){
  if(!same(Object.keys(a),['type'])||!s.stage||s.steps<1)return null;
  const t=sourceTrials[s.stage],token=s.role==='quiet_reader'?'quiet':'activity';
  const target=t.layout[token][0];
  if(!target||!adjacent(s.position,target))
   return {...s,feedback:'Not beside the visitor\'s place yet. Walk closer and try again.'};
  const result=t.tests[s.role];
  const visits={...s.visits,[key(s.stage,s.role)]:{passed:result.passed,reason:result.reason,steps:s.steps}};
  return {...s,visits,feedback:(result.passed?'PAPER PASS: ':'PAPER RETRY: ')+result.reason};
 }
 return null;
}
export function paperRoleWalk(snapshot,history=[]){
 const src=source(snapshot);
 if(!src||!Array.isArray(history)||history.length>MAX)return null;
 let state=initial();
 for(const a of history){const next=apply(state,a,src);if(!next)return null;state=next;}
 const complete=STAGES.every(stage=>USERS.every(role=>own(state.visits,key(stage,role))));
 return {...state,history:JSON.parse(JSON.stringify(history)),complete,
  boards:{first:src.first.layout,now:src.now.layout},
  chronicle:complete?
   'PAPER CHRONICLE · FIRST quiet '+(state.visits['first:quiet_reader'].passed?'PASS':'RETRY')+
   ', group '+(state.visits['first:activity_group'].passed?'PASS':'RETRY')+
   ' → NOW quiet '+(state.visits['now:quiet_reader'].passed?'PASS':'RETRY')+
   ', group '+(state.visits['now:activity_group'].passed?'PASS':'RETRY')+
   '. Milo walked both needs. Real people, access, consent and opening remain UNKNOWN.':
   'PAPER CHRONICLE pending: walk both visitors on FIRST and NOW. Nothing has opened.',
  canonicalEvents:[],unlocks:[],realAccess:false,finished:false};
}
export function dispatchRoleWalk(snapshot,history,action){
 const current=paperRoleWalk(snapshot,history);
 if(!current||history.length>=MAX)return history;
 const next=paperRoleWalk(snapshot,[...history,action]);
 return next?[...history,action]:history;
}
