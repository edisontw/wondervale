// E11 -> E10 child-controlled PAPER need recheck. No historical or access claim.
import {view as viewE10} from '../authoring-labs/unnamed-story-model.mjs';
import {restore as restoreE11,USERS} from '../engine/s01e11-authoring-prototype.mjs';
export const ROLES=Object.freeze({quiet_reader:'quiet',activity_group:'activity'});
export const SLOTS=Object.freeze(['left','shared','right']);
export function source(e10,e11){
 const a=viewE10(e10),b=restoreE11(e11);
 if(!a?.finishedPaper||!a.comparison||a.sourceApproved!==false||
  a.realAccessApproved!==false||a.actualName!==null||a.upperHillClosed!==true||
  !b||!USERS.every(id=>Object.hasOwn(b.tests,id))||
  b.canonicalEvents.length||b.unlocks.length||b.rights.length||b.historicalClaims.length)return null;
 return {slots:{...a.comparison.now},tests:Object.fromEntries(USERS.map(id=>
  [id,{passed:b.tests[id].passed,reason:b.tests[id].reason}])),
  paperOnly:true,rights:[],canonicalEvents:[],unlocks:[]};
}
export function check(e10,e11,role,slot){
 const s=source(e10,e11);
 if(!s||!Object.hasOwn(ROLES,role)||!SLOTS.includes(slot))return null;
 const same=s.slots[ROLES[role]]===slot;
 const tested=s.tests[role].passed;
 return {role,slot,same,tested,matched:same&&tested,
  message:!same?'That is not where Milo left this need in E10. Try another PAPER slot.':
   !tested?'The E11 visitor still needs another PAPER trial. No fit is proven.':
   'The E10 need card and E11 visitor trial agree in these two PAPER models only.',
  realAccessApproved:false,sourceApproved:false,canonicalEvents:[],unlocks:[],rights:[]};
}
