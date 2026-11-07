// Noncanonical E06 Lower Garden FIRST/NOW callback. No clocks, saves, or unlocks.
// Input is a complete E06 authoring action history, never a mutable completion flag.
import {replay, previewProjection} from './s01e06-authoring-prototype.mjs';
export function lowerGardenRevisit(history, requestedStage='first') {
 if(!['first','now'].includes(requestedStage)) return null;
 const state=replay(history);
 if(!state) return null;
 const view=previewProjection(state);
 if(!view) return null;
 const planted=state.lowerPreviewStarted===true && state.phase==='done';
 const tried=state.history.filter(a=>a.type==='move-marker').map(a=>a.site);
 const revised=planted && tried.some(site=>site==='runoff-channel'||site==='footpath');
 const response=planted
  ? revised
   ? 'Finn: You moved the pocket away from water and the shared path. Nia: We can test a small idea and keep both places safe. This is only a MODEL.'
   : 'Nia: You checked the water and path first. Finn: A small pocket fits our MODEL. Real planting still needs permission.'
  : state.markerSite==='runoff-channel'
   ? 'Finn: Water passes here. Milo can move the marker before trying again.'
   : state.markerSite==='footpath'
    ? 'Nia: People need this path. Milo can try another place.'
    : 'Nia: Look at water and the path. We do not know the real history yet.';

 const stage=requestedStage==='now' && planted?'model-sprout':'empty';
 return {
  mode:'authoring_preview',scene:'s01e06-lower-garden',
  first:{pocket:'empty',marker:planted?'raised-pocket':state.markerSite},
  now:{pocket:stage,marker:planted?'raised-pocket':state.markerSite},
  response,revised,
  difference:stage==='model-sprout'?'One synthetic sprout appears on revisit; real growth is unknown.':'No growth is established.',
  canRevise:!planted && state.phase==='lower',
  observed:state.lowerObserved.slice(),
  unknown:['real plant growth','planting permission','historical garden location'],
  canonicalEvents:[],unlocks:[],historicalClaims:[],
  modelOnly:true
 };
}
