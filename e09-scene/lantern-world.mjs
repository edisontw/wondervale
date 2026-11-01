// E08 child-earned PAPER lamp/viewpoint callback for E09 safe overlook.
// Synthetic geometry only: no real lighting, hill access, dates, rights or canonical unlock.
import * as E08 from '../e08-scene/scene-model.mjs';
import {MARKERS,VIEWPOINTS} from '../engine/s01e08-authoring-prototype.mjs';

export function lanternWorld(snapshot){
 const s=E08.restore(snapshot);
 if(!s)return null;
 const v=E08.view(s),story=v?.story;
 if(!v?.lowerLightsPaperOn||!story?.previewComplete||!story?.comparison||
    !story.lights['lower-a']||!story.lights['lower-b']||
    !story.firstView||!story.secondView||
    !Object.hasOwn(VIEWPOINTS,story.firstView.viewpoint)||
    !Object.hasOwn(VIEWPOINTS,story.secondView.viewpoint)||
    story.firstView.viewpoint===story.secondView.viewpoint)return null;
 const markers=MARKERS.map(m=>({id:m.id,x:m.x,y:m.y}));
 const viewpoints=[story.firstView,story.secondView].map((o,i)=>({
  id:i===0?'here':'there',anchor:o.viewpoint,
  x:VIEWPOINTS[o.viewpoint].x,y:VIEWPOINTS[o.viewpoint].y,
  spreadDegrees:o.spreadDegrees
 }));
 const rays=viewpoints.flatMap(v=>markers.map(m=>({
  from:v.id,x1:v.x,y1:v.y,x2:m.x,y2:m.y
 })));
 return {first:{lampsOn:false,rays:[]},now:{lampsOn:true,rays},
  markers,viewpoints,differenceDegrees:story.comparison.spreadDifferenceDegrees,
  paperOnly:true,realLightingApproved:false,realHillAccessApproved:false,
  upperHillClosed:true,historicalDate:null,canonicalEvents:[],unlocks:[]};
}
