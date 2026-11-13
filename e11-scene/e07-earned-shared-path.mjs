// PAPER-only E07 -> E11 bridge. Editable histories are not identity, rights or real access.
import * as E07 from '../e07-scene/scene-model.mjs';
import {replayPath,dispatchPath} from './shared-path-trial.mjs';

export function earnedE07(history) {
  const source=E07.replay(history);
  if(!source)return null;
  const v=E07.view(source);
  if(!v || !v.story?.previewComplete || !v.walkthrough?.reviewed ||
     !v.walkthrough.otherPassed ||
     !v.walkthrough.checked.includes('crossing') ||
     !v.walkthrough.checked.includes('water-edge') ||
     v.canonicalEvents.length || v.unlocks.length || v.rights.length ||
     v.realAccessApproved || !v.northHillClosed)return null;
  return {sourceHistory:history,sourceVersion:source.version,
    paperOnly:true,canonicalEvents:[],unlocks:[],rights:[]};
}

export function replayEarnedPath(e07History,pathHistory=[]) {
  if(!earnedE07(e07History))return null;
  try {
    const trial=replayPath(pathHistory);
    return {...trial,earnedFromE07:true,paperOnly:true,
      canonicalEvents:[],unlocks:[],rights:[],realAccessApproved:false,
      northHillClosed:true,commonRevealed:false};
  }catch{return null;}
}

export function dispatchEarnedPath(e07History,pathHistory,action) {
  if(!replayEarnedPath(e07History,pathHistory))return null;
  try {
    const next=dispatchPath(pathHistory,action);
    return replayEarnedPath(e07History,next)?next:null;
  }catch{return null;}
}
