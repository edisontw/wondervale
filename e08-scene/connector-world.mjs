// Read-only E07 FIRST/NOW PAPER connector visualization for independent E08 visits.
// Every cell is synthetic; no pavement, drainage, lighting, access or unlock is inferred.
import {restore as restoreE07,view as viewE07} from '../e07-scene/scene-model.mjs';
import {BASELINE,BOARD,evaluateLayout} from '../engine/s01e07-authoring-prototype.mjs';

function grid(layout){
 const connector=new Set(layout.footprint);
 const people=new Set(layout.traces.resident.path);
 const water=new Set(layout.traces.water.path);
 const cells=[];let conflicts=0;
 for(let y=0;y<BOARD.height;y++)for(let x=0;x<BOARD.width;x++){
  const id=x+','+y,c=connector.has(id),p=people.has(id),w=water.has(id);
  const conflict=c&&(p||w);if(conflict)conflicts++;
  cells.push({label:conflict?'X':c?'C':p?'P':w?'W':'·',
   conflict,connector:c,people:p,water:w});
 }
 return {layout:layout.layout,cells,conflicts,
  miloPass:layout.traces.milo.pass,peoplePass:layout.traces.resident.pass,
  waterPass:layout.traces.water.pass};
}

export function connectorWorld(e07){
 const verified=restoreE07(e07);
 if(!verified)return null;
 const v=viewE07(verified);
 if(!v||!v.connectorPaperRevised||!v.walkthrough.reviewed||!v.story.compared)return null;
 const first=evaluateLayout(BASELINE),now=v.story.layout;
 if(!first||!now||!Object.values(v.story.revisedTrials).every(
  t=>t?.pass===true&&t.layoutHash===now.layoutHash))return null;
 return {first:grid(first),now:grid(now),paperOnly:true,
  realRouteBuilt:false,realDrainageVerified:false,upperHillClosed:true,stepsLightsOff:true};
}
