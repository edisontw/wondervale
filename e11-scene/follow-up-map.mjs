// A movable question-mark on a FICTIONAL PAPER map, never a real inspection.
// Rebuild every view from the strictly replayed E11 return and child-sorted notes.
import {paperReflectionFollowUp} from './reflection-follow-up.mjs';

export const PAPER_CHECK_STOPS=Object.freeze([
 Object.freeze({id:'square',label:'Square PAPER start'}),
 Object.freeze({id:'garden',label:'Garden PAPER stop'}),
 Object.freeze({id:'map_room',label:'Map Room PAPER stop'})
]);
const suitableStop=Object.freeze({
 station:'map_room',garden:'garden',planting:'garden',route:'square'
});
export function paperFollowUpMap(snapshot,steps=[],upstream=null,placements={},
 questionId=null,actionId=null,stopId=null){
 const plan=paperReflectionFollowUp(snapshot,steps,upstream,placements,questionId,actionId);
 if(!plan?.matched)return null;
 if(stopId!==null&&!PAPER_CHECK_STOPS.some(s=>s.id===stopId))return null;
 const markerPlaced=stopId!==null,markerMatches=markerPlaced&&suitableStop[questionId]===stopId;
 const selected=plan.unknowns.find(q=>q.id===questionId);
 const stop=PAPER_CHECK_STOPS.find(s=>s.id===stopId);
 return {
  questionId,actionId,stopId,markerPlaced,markerMatches,
  first:PAPER_CHECK_STOPS.map(s=>({...s,marker:false})),
  now:PAPER_CHECK_STOPS.map(s=>({...s,marker:s.id===stopId})),
  feedback:!markerPlaced?'Milo: "Where should I put our question mark on this PAPER map?"':
   markerMatches?'Nia: "That is a useful place to START asking. We have not checked it."':
   'Finn: "That mark may fit another question. Move it and try again."',
  chroniclePreview:markerMatches?
   'PAPER MAP PLAN — NOT DONE: ? at '+stop.label+' for '+selected.label+
   '. No real visit, permission, safety check or opening.':null,
  actualCheckPerformed:false,realWorldFactsVerified:0,permissionApproved:false,
  realRouteOpen:false,canonicalEvents:[],unlocks:[],seasonComplete:false,
  persistentSave:false
 };
}
