// E07/E08 replay-earned four-frame PAPER evidence used at E09's safe survey boundary.
// Recompute from upstream histories; E08's ephemeral UI pin selections are NOT transferred.
// Never infer real access, physical connection, lights, historical dates or a canonical unlock.
import {approachFrame} from '../e08-scene/approach-experiment.mjs';
import {restore as restoreHill,view as viewHill} from './scene-model.mjs';

export const QUESTIONS=Object.freeze({
 access:{anchor:'fence_view',clues:['boundary_sign','disturbed_ground'],
  note:'Can people use this hill way? Ask the responsible person and check real access. NOT DONE.'},
 identity:{anchor:'overlook',clues:['distant_symbol'],
  note:'What is beyond the distant mark? Find a reliable source later. NOT DONE.'}
});
const combinations=[['first','first'],['first','second'],['now','first'],['now','second']];

export function fourFrameEvidence(e07,e08){
 const cells=combinations.map(([layout,view])=>approachFrame(e07,e08,layout,view));
 if(cells.some(x=>!x)||cells[0].conflicts<=cells[2].conflicts||
    cells[0].spreadDegrees!==cells[2].spreadDegrees||
    cells[1].spreadDegrees!==cells[3].spreadDegrees||
    cells[0].spreadDegrees===cells[1].spreadDegrees)return null;
 return {cells,firstConflicts:cells[0].conflicts,nowConflicts:cells[2].conflicts,
  fixedMarks:['A','B','C'],upperHillClosed:true,realAccessApproved:false,
  canonicalEvents:[],unlocks:[],paperOnly:true};
}

export function placeQuestion(e07,e08,e09,question,anchor){
 const evidence=fourFrameEvidence(e07,e08),hill=restoreHill(e09);
 if(!evidence||!hill||!Object.hasOwn(QUESTIONS,question)||
    !['fence_view','overlook'].includes(anchor))return null;
 const seen=viewHill(hill).story.inspected,rule=QUESTIONS[question];
 if(!seen.includes('boundary_sign')||!rule.clues.every(id=>seen.includes(id)))
  return {ok:false,reason:'Look at the boundary and this clue from safe ground first.'};
 if(anchor!==rule.anchor)
  return {ok:false,reason:'Try the other safe observation point. The closed path stays closed.'};
 return {ok:true,anchor,question,note:rule.note,paperOnly:true,
  realCheckDone:false,realAccessApproved:false,upperHillClosed:true,
  canonicalEvents:[],unlocks:[]};
}
