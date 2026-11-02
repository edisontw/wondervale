// E10 -> E11 read-only PAPER possible-use comparison, earned by actual child moves.
// Strict source-bound replay only. Neither cutout is a historical object or a real plan.
import {view as viewE10} from '../authoring-labs/unnamed-story-model.mjs';
import {viewTrial} from '../e10-scene/use-staging.mjs';

const LABELS=Object.freeze({stone_edge:'stone edge',notice_wall:'notice wall'});
function board(places){
 if(!places||!Object.values(places).every(x=>Object.hasOwn(LABELS,x)))return null;
 return Object.entries(places).map(([prop,anchor])=>({
  prop,anchor,label:(prop==='seat'?'Seat':'Notice')+' cutout at '+LABELS[anchor]
 }));
}
export function paperE10UseRevisit(e10,trial){
 const source=viewE10(e10),v=viewTrial(trial,e10);
 if(!source?.finishedPaper||source.sourceApproved!==false||
  source.actualName!==null||source.e11Unlocked!==false||
  source.realAccessApproved!==false||source.upperHillClosed!==true||
  !v?.revised||!v.compared||v.conflict||!v.firstConflict)return null;
 const first=board(v.firstConflict),now=board(v.now);
 if(!first||!now||v.firstConflict.seat!==v.firstConflict.notice||
  v.now.seat===v.now.notice)return null;
 return {first,now,
  paperNote:'FIRST: both imagined cutouts overlapped. NOW: Milo moved one and compared again. The observed marks did not change. Historical use, date, place name, permission and real access remain UNKNOWN.',
  sourceApproved:false,realAccessApproved:false,
  canonicalEvents:[],unlocks:[],rights:[],historicalClaims:[]};
}
