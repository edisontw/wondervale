// Child-controlled PAPER comparison of E07 model footprints and E08 fixed-marker viewpoints.
// These are two separate synthetic experiments, not a shared physical site map.
import {connectorWorld} from './connector-world.mjs';
import {view as viewE08} from './scene-model.mjs';

export function approachFrame(e07,e08,layout,viewpoint){
  if(!['first','now'].includes(layout)||!['first','second'].includes(viewpoint))return null;
  const connector=connectorWorld(e07),steps=viewE08(e08);
  if(!connector||!steps?.story?.comparison||!steps.story.firstView||!steps.story.secondView)return null;
  const route=connector[layout],observation=viewpoint==='first'?steps.story.firstView:steps.story.secondView;
  if(!route||!observation||!Number.isFinite(observation.spreadDegrees))return null;
  return {layout,view:viewpoint,viewpoint:observation.viewpoint,
    spreadDegrees:observation.spreadDegrees,conflicts:route.conflicts,
    miloPass:route.miloPass,peoplePass:route.peoplePass,waterPass:route.waterPass,
    fixedMarks:['A','B','C'],paperOnly:true,realRouteBuilt:false,
    realLightingApproved:false,upperHillClosed:true};
}
