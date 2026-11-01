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
 const walkedEdgeIds=SAFE_EDGES.filter(e=>h.surveyedEdges.includes(e.id)).map(e=>e.id);
 const markedEdgeIds=SAFE_EDGES.filter(e=>
   h.markedEdges.includes(e.id)&&h.surveyedEdges.includes(e.id)).map(e=>e.id);
 return {
  kind:'noncanonical_paper_survey',safeEdgeIds:SAFE_EDGES.map(e=>e.id),
  walkedEdgeIds,closedEdgeId:CLOSED_EDGE,
  first:{markedEdgeIds:[],clueIds:[]},
  now:{markedEdgeIds,clueIds:[...h.inspected]},
  upperHillClosed:true,realAccessApproved:false,realTerrainVerified:false,
  historicalDate:null,placeName:null,canonicalEvents:[],unlocks:[],rights:[]
 };
}
