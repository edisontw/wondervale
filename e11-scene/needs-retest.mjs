// E10-earned E11 PAPER negotiation; no real users or access claims.
import {paperE10NeedsRevisit} from './e10-needs-revisit.mjs';
const slots=['left','shared','right'];
export function paperNeedsRetest(e10,history=[]){
 const atlas=paperE10NeedsRevisit(e10);
 if(!atlas||!Array.isArray(history)||history.length>24)return null;
 let quiet=atlas.now.find(s=>s.quiet).id,activity=atlas.now.find(s=>s.activity).id;
 let tested=false,passed=false,moved=false;
 for(const a of history){
  if(!a||typeof a!=='object'||Array.isArray(a))return null;
  if(a.type==='place'&&Object.keys(a).length===3&&Object.hasOwn(a,'role')&&Object.hasOwn(a,'slot')&&
   ['quiet','activity'].includes(a.role)&&slots.includes(a.slot)&&!tested){
   if(a.role==='quiet')quiet=a.slot;else activity=a.slot;
   moved=true;
  }else if(a.type==='test'&&Object.keys(a).length===1&&!tested&&moved){
   tested=true;passed=quiet!==activity;
  }else if(a.type==='revise'&&Object.keys(a).length===1&&tested){
   tested=false;passed=false;moved=false;
  }else return null;
 }
 return {quiet,activity,tested,passed,moved,
 feedback:!tested?'Milo: Move a PAPER need card, then ask both visitors.':
 passed?'Nia: Both visitors have a PAPER spot. Finn: We made room for both.':
 'Nia: Both visitors need this spot. Finn: Try moving one card.',
 chronicle:passed?'PAPER CHRONICLE: Milo renegotiated two simulated needs.':'PAPER CHRONICLE PENDING',
 canonicalEvents:[],unlocks:[],rights:[],realAccessApproved:false,northHillClosed:true,commonRevealed:false};
}
export function dispatchNeedsRetest(e10,history,action){
 const next=[...history,action];
 return paperNeedsRetest(e10,next)?next:history;
}
