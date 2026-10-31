// E11 child-earned FIRST/NOW PAPER revisit. No historical or release state.
import {restore,projection,SAFE_LINKS,USERS} from '../engine/s01e11-authoring-prototype.mjs';

export const FOCUS_IDS=Object.freeze(['quiet_reader','activity_group']);

/** Derive the visible comparison from strict replayed trials, never caller-supplied labels. */
export function paperRevisit(snapshot,focus='quiet_reader'){
 const state=restore(snapshot);
 if(!state||!FOCUS_IDS.includes(focus)||!state.comparison)return null;
 const p=projection(state);
 const first=p.trials.find(t=>t.id===p.comparison.first);
 const now=p.trials.find(t=>t.id===p.comparison.second);
 if(!first||!now||!USERS.every(id=>now.tests[id]?.passed))return null;
 const links=state.reviewed&&state.loopChecked?
  state.loopEdges.map(id=>SAFE_LINKS[id].map(place=>
   place==='common'?'unnamed place':place).join(' ↔ ')):[];
 return {
  focus,first,now,firstPass:!!first.tests[focus]?.passed,
  nowPass:!!now.tests[focus]?.passed,
  reviewed:state.reviewed,
  recalled:state.reviewed&&p.citation?p.citation.id:null,
  links,
  source:'REPLAYED FICTIONAL PAPER TRIALS',
  historyApproved:false,realAccess:false,placeOpen:false,seasonComplete:false
 };
}
