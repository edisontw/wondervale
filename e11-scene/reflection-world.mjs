// E11 noncanonical PAPER world consequence after Milo finishes a real child-operated
// model return walk and correctly sorts evidence. No actual history, access or rights.
import {paperReturnReflection} from './return-reflection.mjs';

export function paperReflectionWorld(snapshot,steps=[],upstream=null,placements={}){
 const reflection=paperReturnReflection(snapshot,steps,upstream,placements);
 if(!reflection?.complete)return null;
 const first=reflection.cards.map(({id,label})=>({id,label,shelf:'unsorted'}));
 const now=reflection.cards.map(({id,label,expected})=>({id,label,shelf:expected}));
 const paperCount=now.filter(card=>card.shelf==='paper').length;
 const checkCount=now.filter(card=>card.shelf==='check').length;
 return {
  first,now,paperCount,checkCount,
  // A provisional diary line, deliberately not a canonical event or persistent save.
  chroniclePreview:'PAPER DIARY ONLY: Milo revisited Garden and Map Room, then sorted '+
   paperCount+' child-earned model observation'+(paperCount===1?'':'s')+
   ' and '+checkCount+' question'+(checkCount===1?'':'s')+
   ' for a future real-world check. No place was opened.',
  worldChanged:true,
  realWorldFactsVerified:0,canonicalEvents:[],unlocks:[],
  realRouteOpen:false,seasonComplete:false
 };
}
