// Display-only projection for the synthetic E06 Lower Garden diagram.
// It draws no real site geometry and never infers a check result before the
// existing reducer has recorded an inspect-result action.
import {SITES} from '../engine/s01e06-authoring-prototype.mjs';

const LABELS=Object.freeze({
  'runoff-channel':'Runoff channel',
  'footpath':'Shared footpath',
  'raised-pocket':'Raised pocket'
});
const X_ORIGIN=75,X_STEP=85,Y_ORIGIN=65,Y_STEP=72;

function resultFor(attempt){
  if(attempt.wet&&attempt.blocksPath)return 'wet-and-blocked';
  if(attempt.wet)return 'wet';
  if(attempt.blocksPath)return 'blocks-path';
  return attempt.provisional?'clear':'unknown';
}

export function lowerGardenSpatialView(garden){
  if(!garden||typeof garden!=='object'||Array.isArray(garden)||
    !Array.isArray(garden.attempts)||typeof garden.markerInspected!=='boolean')return null;
  const markerSite=garden.markerSite??null;
  if(markerSite!==null&&!Object.hasOwn(SITES,markerSite))return null;
  const checked=new Map();
  for(const attempt of garden.attempts){
    if(!attempt||typeof attempt!=='object'||!Object.hasOwn(SITES,attempt.site)||
      typeof attempt.wet!=='boolean'||typeof attempt.blocksPath!=='boolean'||
      typeof attempt.provisional!=='boolean'||
      JSON.stringify(Object.keys(attempt).sort())!==
        '["blocksPath","provisional","site","wet"]')return null;
    checked.set(attempt.site,{result:resultFor(attempt),wet:attempt.wet,
      blocksPath:attempt.blocksPath,provisional:attempt.provisional});
  }
  if(garden.markerInspected&&(!markerSite||!checked.has(markerSite)))return null;
  const zones=Object.keys(SITES).map(site=>({
    site,label:LABELS[site],
    x:X_ORIGIN+SITES[site].x*X_STEP,
    y:Y_ORIGIN+SITES[site].y*Y_STEP,
    check:checked.get(site)||null
  }));
  const point=markerSite?zones.find(zone=>zone.site===markerSite):null;
  return {
    modelOnly:true,
    marker:point?{site:point.site,x:point.x,y:point.y,checked:garden.markerInspected}:null,
    zones
  };
}
