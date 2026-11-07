// E09 child-earned route sketch displayed on independent E10 PAPER revisit.
// All coordinates are schematic; never infer real access, terrain safety or historical rights.
import * as E09 from '../e09-scene/scene-model.mjs';
import {SAFE_EDGES,CLOSED_EDGE} from '../engine/s01e09-authoring-prototype.mjs';

export function hillWorld(snapshot){
 const s=E09.restore(snapshot);
 if(!s)return null;
 const v=E09.view(s),h=v?.story;
 if(!h?.previewComplete||!h.reviewed||!h.routeResult?.complete||
    !h.symbolCompared||!v.upperHillClosed||v.e10Unlocked!==false)return null;
 // Only validated child actions may earn a revision callback. A first-try
 // complete route must never be described as corrected.
 const revisedRoute=s.history.some(entry=>entry.scene==='story'&&(
   entry.action?.type==='unmark'||entry.action?.type==='check-route'&&
   s.history.slice(0,s.history.indexOf(entry)).filter(x=>
     x.scene==='story'&&x.action?.type==='mark').length<3));
 const revisitVoice=revisedRoute?
  {speaker:'Nia',line:'You found the gap and fixed your PAPER path.'}:
  {speaker:'Finn',line:'Your first PAPER path joined the lower marks.'};
 const walkedEdgeIds=SAFE_EDGES.filter(e=>h.surveyedEdges.includes(e.id)).map(e=>e.id);
 const markedEdgeIds=SAFE_EDGES.filter(e=>
   h.markedEdges.includes(e.id)&&h.surveyedEdges.includes(e.id)).map(e=>e.id);
 return {
  kind:'noncanonical_paper_survey',safeEdgeIds:SAFE_EDGES.map(e=>e.id),
  walkedEdgeIds,closedEdgeId:CLOSED_EDGE,revisitVoice,
  first:{markedEdgeIds:[],clueIds:[]},
  now:{markedEdgeIds,clueIds:[...h.inspected]},
  upperHillClosed:true,realAccessApproved:false,realTerrainVerified:false,
  historicalDate:null,placeName:null,canonicalEvents:[],unlocks:[],rights:[]
 };
}
