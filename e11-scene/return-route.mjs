// E11 child-operated return walk through PAPER stops, not a real public route.
// The visit trace is ephemeral and rebuilt from a bounded sequence of legal steps.
// Strict E05/E06 replay is the ONLY source of earned station/garden callbacks.
import {restore} from '../engine/s01e11-authoring-prototype.mjs';
import {paperGardenRevisit} from './garden-revisit.mjs';
import {stationWorld} from '../e06-scene/station-world.mjs';

export const PAPER_WALK=Object.freeze({
 square:Object.freeze(['market','garden']),
 market:Object.freeze(['square']),
 garden:Object.freeze(['square','map_room']),
 map_room:Object.freeze(['garden'])
});
export const WALK_LABELS=Object.freeze({
 square:'Square PAPER start',market:'Market PAPER detour',
 garden:'Garden PAPER stop',map_room:'Map Room PAPER stop'
});
export function paperReturnRoute(snapshot,steps=[],upstream=null){
 const s=restore(snapshot);
 if(!s?.reviewed||!s.loopChecked||!s.comparison||
    !Array.isArray(steps)||steps.length>24)return null;
 let at='square',detours=0;
 const visited=new Set(),trail=['square'];
 for(const to of steps){
  if(typeof to!=='string'||!PAPER_WALK[at].includes(to))return null;
  at=to;trail.push(to);
  if(to==='market')detours++;
  if(to==='garden'||to==='map_room')visited.add(to);
 }
 const garden=paperGardenRevisit(upstream?.e06);
 const station=stationWorld(upstream?.e05);
 const gardenEarned=!!(garden?.lower.compared&&garden.lower.nowStage==='paper-sprout');
 const stationEarned=!!station;
 const complete=at==='square'&&visited.has('garden')&&visited.has('map_room');
 let feedback='Milo: "Which PAPER stop shall we visit first?"';
 if(steps.length){
  if(at==='market')feedback='Finn: "This detour does not reach the two stops. We can walk back."';
  else if(at==='garden')feedback='Milo: "We can check the garden PAPER change here."';
  else if(at==='map_room')feedback='Nia: "Look at the model table. Is the path still clear?"';
  else feedback=complete?
   'Milo: "We visited both model changes and came back. The real way is still UNKNOWN."':
   'Milo: "We are back, but we have not checked both model stops. Try again."';
 }
 return {
  at,trail,visited:[...visited],detours,complete,choices:[...PAPER_WALK[at]],
  feedback,
  gardenNote:visited.has('garden')?(gardenEarned?
   'E06 child-earned PAPER: '+garden.lower.note:
   'E06 garden change NOT VERIFIED in this visit. Practice only; no growth claim.'):null,
  stationNote:visited.has('map_room')?(stationEarned?
   'E05 child-earned PAPER: '+station.now.table+'; '+station.now.board+
    '; '+station.now.path+'.':
   'E05 Map Room change NOT VERIFIED in this visit. Practice only; no source claim.'):null,
  gardenEarned,stationEarned,
  realRouteOpen:false,siteAccessApproved:false,commonRevealed:false,
  historicHillClosed:true,canonicalEvents:[],unlocks:[],seasonComplete:false,
  persistentSave:false
 };
}
