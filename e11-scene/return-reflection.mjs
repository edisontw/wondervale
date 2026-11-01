// E11 child-controlled evidence sorting after a fully replayed PAPER return walk.
// "Seen" is a model observation only. Nothing here certifies actual history or access.
import {paperReturnRoute} from './return-route.mjs';

export const REFLECTION_CARDS=Object.freeze([
 Object.freeze({id:'station',label:'E05 wall-side PAPER table'}),
 Object.freeze({id:'garden',label:'E06 possible PAPER sprout'}),
 Object.freeze({id:'planting',label:'Real seeds were planted'}),
 Object.freeze({id:'route',label:'The public route is safe'})
]);
export function paperReturnReflection(snapshot,steps=[],upstream=null,placements={}){
 const route=paperReturnRoute(snapshot,steps,upstream);
 if(!route?.complete||!placements||typeof placements!=='object'||
  Array.isArray(placements))return null;
 const allowed=REFLECTION_CARDS.map(c=>c.id);
 if(Object.entries(placements).some(([id,shelf])=>
  !allowed.includes(id)||!['paper','check'].includes(shelf)))return null;
 const expected={station:route.stationEarned?'paper':'check',
  garden:route.gardenEarned?'paper':'check',planting:'check',route:'check'};
 const cards=REFLECTION_CARDS.map(c=>({
  ...c,expected:expected[c.id],placed:placements[c.id]||null,
  correct:placements[c.id]===expected[c.id],
  explanation:c.id==='station'?
   (route.stationEarned?'Milo tested this table in the E05 PAPER model.':'No verified E05 PAPER test is linked.'):
   c.id==='garden'?
   (route.gardenEarned?'Milo compared model water and a possible PAPER sprout.':'No verified E06 PAPER growth test is linked.'):
   c.id==='planting'?'No real planting or permission was observed.':
   'No real public path or access inspection was verified.'
 }));
 return {
  cards,complete:cards.every(c=>c.correct),
  sortedCount:cards.filter(c=>c.correct).length,
  observedPaperCount:cards.filter(c=>c.expected==='paper').length,
  realWorldFactsVerified:0,canonicalEvents:[],unlocks:[],
  realRouteOpen:false,seasonComplete:false
 };
}
