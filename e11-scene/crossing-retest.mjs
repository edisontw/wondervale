// Optional E07-earned E11 PAPER crossing retest. No physical clearance claim.
import {paperReturnRoute} from './return-route.mjs';
export function paperCrossingRetest(e11,steps,upstream,history=[]){
 const route=paperReturnRoute(e11,steps,upstream);
 if(!route||route.at!=='connector'||!route.crossingEarned||
  !Array.isArray(history)||history.length>12)return null;
 let width='narrow',tested=false,passed=false;
 for(const a of history){
  if(!a||typeof a!=='object'||Array.isArray(a)||
   Object.keys(a).some(k=>!['type','width'].includes(k)))return null;
  if(a.type==='place'&&Object.keys(a).length===2&&
   ['narrow','shared'].includes(a.width)&&!tested)width=a.width;
  else if(a.type==='test'&&Object.keys(a).length===1&&!tested){
   tested=true;passed=width==='shared';
  }else if(a.type==='revise'&&Object.keys(a).length===1&&tested){
   tested=false;passed=false;
  }else return null;
 }
 return {width,tested,passed,
  feedback:!tested?'Milo: "Choose a PAPER crossing width. Let another traveler try."':
   passed?'Finn: "The other traveler fits in this PAPER model. We made room together."':
   'Finn: "My narrow PAPER crossing stops the other traveler. Can we make more room?"',
  chronicle:passed?'PAPER CHRONICLE: Milo retested a shared crossing for another traveler; real access UNKNOWN.':
   'PAPER CHRONICLE PENDING: another traveler has not passed this new trial.',
  canonicalEvents:[],unlocks:[],rights:[],realAccessApproved:false,
  northHillClosed:true,commonRevealed:false,seasonComplete:false};
}
export function dispatchCrossingRetest(e11,steps,upstream,history,action){
 const next=[...history,action];
 return paperCrossingRetest(e11,steps,upstream,next)?next:history;
}
