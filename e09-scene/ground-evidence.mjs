// E09 child-placed PAPER observation pins. Synthetic sites, not real terrain or a cause claim.
export const CLUE_SITES=Object.freeze({
 disturbed_ground:'fence_view',runoff_marks:'lower_bend'
});
export const SITES=Object.freeze(['fence_view','lower_bend']);
export function freshGround(){
 return {placements:{disturbed_ground:null,runoff_marks:null},compared:false,
  feedback:'Walk, inspect, then move each observation onto Milo\'s safe sketch.'};
}
export function groundStep(board,action,inspected){
 if(!board||!action||!Array.isArray(inspected))return null;
 const clues=Object.keys(CLUE_SITES);
 if(action.type==='place'){
  if(!clues.includes(action.clue)||!SITES.includes(action.at)||
     !inspected.includes(action.clue))return null;
  const correct=CLUE_SITES[action.clue]===action.at;
  return {placements:{...board.placements,[action.clue]:action.at},compared:false,
   feedback:correct?'Pin placed where Milo looked. Check the other observation.':
    'That is not where Milo saw this clue. Move the pin; nothing is lost.'};
 }
 if(action.type==='remove'){
  if(!clues.includes(action.clue)||!board.placements[action.clue])return null;
  return {placements:{...board.placements,[action.clue]:null},compared:false,
   feedback:'Pin removed. Milo can try again.'};
 }
 if(action.type==='compare'){
  if(!clues.every(id=>inspected.includes(id)))return null;
  const complete=clues.every(id=>board.placements[id]===CLUE_SITES[id]);
  return {...board,compared:complete,
   feedback:complete?
    'Milo saw loose ground by the fence and water marks at the bend. Two observations; the cause and date are still UNKNOWN.':
    'One or both pins do not match where Milo looked. Walk back in your mind, then revise.'};
 }
 return null;
}
