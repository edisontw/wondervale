import {view as viewE07} from './scene-model.mjs';
import {view as viewE08} from '../e08-scene/scene-model.mjs';
import {viewfinderFrame} from '../e08-scene/live-viewfinder.mjs';

// An E08 observation can be reviewed at E07 only after BOTH PAPER action
// histories replay. Never turn a model sightline into real lighting or access.
export function earnedStepsViews(e07,e08){
 const route=viewE07(e07),steps=viewE08(e08);
 if(!route?.walkthrough.reviewed||!steps?.story.previewComplete||
    !steps.story.compared||!steps.story.firstView||!steps.story.secondView)return null;
 const lights=steps.story.lights;
 const first=viewfinderFrame(steps.story.firstView.viewpoint,lights);
 const second=viewfinderFrame(steps.story.secondView.viewpoint,lights);
 if(!first?.lit||!second?.lit||first.anchor===second.anchor||
    !Number.isFinite(first.spreadDegrees)||!Number.isFinite(second.spreadDegrees)||
    first.spreadDegrees===second.spreadDegrees)return null;
 return {first,second,paperOnly:true,realLightingApproved:false,
  upperHillClosed:true,canonicalEvents:[],unlocks:[],rights:[]};
}
