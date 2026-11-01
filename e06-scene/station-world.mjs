// E05 child-earned Map Room callback in E06 PAPER Current Garden.
// Strict action replay, not a production checkpoint, history, site survey or permission.
import * as E05 from '../e05-scene/scene-model.mjs';
export function stationWorld(snapshot){
 const s=E05.restore(snapshot);
 if(!s)return null;
 const v=E05.view(s),g=v?.gardenMap,r=v?.station;
 if(v?.stage!=='review'||!v.mapRoomPaperVisible||!g?.overlay||!g.question||
    g.inspected.length!==2||!['older','present'].every(x=>g.inspected.includes(x))||
    r?.table!=='near-wall'||!r.clear||!r.mapRoom||
    v.e06Unlocked!==false||v.productionEntryReady!==false||
    s.rights.length||s.unlocks.length||s.canonicalEvents.length||s.historicalClaims.length)return null;
 return {
  first:{board:'Old marks · untouched',table:'No PAPER table',path:'Public walkway clear'},
  now:{board:'Two marks aligned on COPY',table:'PAPER table by wall',path:'Public walkway clear'},
  triedWalkway:s.station.history.some(a=>a.type==='place-table'&&a.value==='across-walkway'),
  observedMarks:['lower PAPER mark','upper PAPER mark'],
  stationRealAccessApproved:false,historyKnown:false,siteGeometryVerified:false,
  productionEntryReady:false,e06Unlocked:false,canonicalEvents:[],unlocks:[],rights:[]
 };
}
