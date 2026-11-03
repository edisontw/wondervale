// E09 synthetic hill notebook: two child-placed FUTURE checks prompted by E08.
// Placement is a question, not a performed lighting/access test or physical route.
export const SIGHTLINE_TARGETS=Object.freeze({
 light:{at:'fence_view',clue:'disturbed_ground'},
 view:{at:'overlook',clue:'distant_symbol'}
});
export const SIGHTLINE_SITES=Object.freeze(['fence_view','overlook']);
export function freshSightline(){
 return {placements:{light:null,view:null},compared:false,
  feedback:'Look at the safe fence and distant mark, then place two future check notes.'};
}
export function sightlineStep(board,action,inspected){
 if(!board||!action||!Array.isArray(inspected)||!inspected.includes('boundary_sign'))return null;
 const ids=Object.keys(SIGHTLINE_TARGETS);
 if(action.type==='place'){
  if(!ids.includes(action.question)||!SIGHTLINE_SITES.includes(action.at)||
     !inspected.includes(SIGHTLINE_TARGETS[action.question].clue))return null;
  const correct=SIGHTLINE_TARGETS[action.question].at===action.at;
  return {placements:{...board.placements,[action.question]:action.at},compared:false,
   feedback:correct?'A future question is pinned to the model observation point.':
    'This question belongs with a different observation. Move the note; no penalty.'};
 }
 if(action.type==='remove'){
  if(!ids.includes(action.question)||!board.placements[action.question])return null;
  return {placements:{...board.placements,[action.question]:null},compared:false,
   feedback:'Future question removed; Milo can try another place.'};
 }
 if(action.type==='compare'){
  if(!ids.every(id=>inspected.includes(SIGHTLINE_TARGETS[id].clue)&&board.placements[id]))return null;
  const matched=ids.every(id=>board.placements[id]===SIGHTLINE_TARGETS[id].at);
  return {...board,compared:matched,
   feedback:matched?
    'Two questions placed: better visibility at the fence? another safe view of the distant mark? Both are NOT DONE. E08 changed apparent spacing; E09 access and lighting remain UNKNOWN.':
    'These two questions do not yet match Milo\'s observation points. Move a note and compare again.'};
 }
 return null;
}
