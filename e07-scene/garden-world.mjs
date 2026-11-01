// Read-only, child-earned E06 PAPER marker/water world visible in independent E07.
// FIRST/NOW are experiment comparisons, never historical dates, actual planting or access.
import {restore as restoreE06,view as viewE06} from '../e06-scene/scene-model.mjs';

const SITES=['runoff-channel','footpath','raised-pocket'];
function tiles(markerSite){
 return SITES.map(site=>({site,marker:site===markerSite,
  waterRoute:site==='runoff-channel',sharedPath:site==='footpath',
  safePocket:site==='raised-pocket'}));
}
export function gardenCareWorld(snapshot){
 const valid=restoreE06(snapshot);
 if(!valid)return null;
 const v=viewE06(valid);
 if(!v||!v.lowerGrowthVisible||v.garden.phase!=='finished'||
    !v.care.compared||v.garden.markerSite!=='raised-pocket')return null;
 const unsafe=v.garden.attempts.find(t=>t.wet===true||t.blocksPath===true);
 const safe=v.garden.attempts.find(t=>t.site==='raised-pocket'&&t.provisional===true);
 const heavy=v.care.trials.find(t=>t.choice==='heavy'&&t.result==='paper-soggy');
 const gentle=v.care.trials.find(t=>t.choice==='gentle'&&t.result==='paper-seed');
 if(!unsafe||!safe||!heavy||!gentle||v.care.trials.at(-1)?.choice!=='gentle')return null;
 return {
  first:{markerSite:unsafe.site,risk:unsafe.wet?'water-route wet':'shared path blocked',
   water:'heavy',waterResult:'PAPER soggy seed',tiles:tiles(unsafe.site)},
  now:{markerSite:'raised-pocket',risk:'water and shared path clear in MODEL',
   water:'gentle',waterResult:'hypothetical PAPER sprout',tiles:tiles('raised-pocket')},
  currentGardenHealthy:true,paperOnly:true,realGrowthObserved:false,
  plantingPermissionApproved:false,realDrainageVerified:false,
  northHillClosed:true,officialUnlock:false
 };
}
