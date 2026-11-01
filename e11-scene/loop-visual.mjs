// Visible E11 PAPER loop callback. Geometry is a schematic of possible model links,
// never a measured route, approved site access, official Chronicle or a save.
import {restore,SAFE_LINKS} from '../engine/s01e11-authoring-prototype.mjs';

export const PAPER_NODES=Object.freeze([
 {id:'square',label:'Square',x:62,y:94},
 {id:'market',label:'Market',x:175,y:37},
 {id:'common',label:'Unnamed place',x:289,y:94},
 {id:'garden',label:'Garden',x:62,y:187},
 {id:'map_room',label:'Map Room',x:175,y:205}
]);

export function paperLoopVisual(snapshot){
 const s=restore(snapshot);
 if(!s)return null;
 return {
  nodes:PAPER_NODES.map(n=>({...n})),
  edges:Object.entries(SAFE_LINKS).map(([id,[from,to]])=>({
   id,from,to,selected:s.loopEdges.includes(id)
  })),
  selectedCount:s.loopEdges.length,
  loopChecked:s.loopChecked,
  reviewed:s.reviewed,
  historicHillClosed:true,
  unnamedPlaceOpen:false,
  officialChronicle:false,
  seasonComplete:false,
  canonicalEvents:[],
  unlocks:[]
 };
}
