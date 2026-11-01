// Read-only E06 Current/Lower Garden callback for later PAPER visits.
// All stages come from strict child-action replay, never caller-supplied growth flags.
import {restore,view} from '../e06-scene/scene-model.mjs';

export function paperGardenRevisit(snapshot){
 const state=restore(snapshot);
 if(!state)return null;
 const v=view(state);
 if(!v)return null;
 const stage=v.lowerPaperStarted?v.care.stage:'not-visited';
 return {
  current:{stage:'healthy',compared:v.currentCompared,
   note:v.currentCompared?
    'NOW: Milo compared PAPER rain runs. Healthy present beds stay in place.':
    'NOW: healthy present beds; the PAPER water comparison is still open.'},
  lower:{firstStage:'paper-marker',nowStage:stage,
   trialCount:v.care.trials.length,compared:v.care.compared,
   note:stage==='paper-sprout'?
    'NOW: a possible PAPER sprout after Milo compared lots and a little MODEL water.':
    stage==='paper-soggy'?
    'NOW: the PAPER seed is soggy; Milo can retry with less MODEL water.':
    stage==='paper-seed'?
    'NOW: a PAPER seed marker; compare the two water trials before imagining growth.':
    stage==='paper-marker'?
    'NOW: only a removable PAPER pocket marker; no model growth earned.':
    'NOW: Lower Garden model has not been visited.'},
  historyApproved:false,realGrowth:false,plantingPermission:false,
  actualSiteAccess:false,canonicalEvents:[],unlocks:[]
 };
}
