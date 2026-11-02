// Cross-scene PAPER thought experiment: two independent, child-tested synthetic models.
// A channel setting in E06 is NOT a measured input to the E07 site; compare constraints,
// not historical weather, physical drainage, construction safety or permission.
import * as E06 from '../e06-scene/scene-model.mjs';
import * as E07 from './scene-model.mjs';
import {evaluateLayout} from '../engine/s01e07-authoring-prototype.mjs';

export function runoffChoice(e06,e07,channel,phase){
 if(!['open','blocked'].includes(channel)||!['first','now'].includes(phase))return null;
 const s6=E06.restore(e06),s7=E07.restore(e07);
 if(!s6||!s7)return null;
 const g=E06.view(s6),c=E07.view(s7);
 if(!g?.lowerGrowthVisible||!g.garden.modelCompared||!c?.story.previewComplete||
    !c.walkthrough.reviewed||g.canonicalEvents.length||c.canonicalEvents.length||
    g.unlocks.length||c.unlocks.length||g.rights.length||c.rights.length)return null;
 // Use only a rain experiment Milo actually ran, never infer a missing trial.
 const run=g.garden.runs.find(r=>r.weather==='rain'&&r.channel===channel);
 if(!run||run.synthetic!==true||!Number.isInteger(run.catchment))return null;
 const layout=phase==='first'?evaluateLayout('short-crossing'):c.story.layout;
 if(!layout||layout.source!=='synthetic-model-only')return null;
 const water=layout.traces.water,resident=layout.traces.resident;
 if(!water||!resident||!layout.traces.milo)return null;
 const overlap=[...new Set([...water.overlaps,...resident.overlaps])];
 return {
  channel,phase,catchment:run.catchment,bypass:run.bypass,
  layout:layout.layout,footprint:[...layout.footprint],
  waterPath:[...water.path],residentPath:[...resident.path],
  waterOverlaps:[...water.overlaps],residentOverlaps:[...resident.overlaps],
  overlap,modelWalkClear:layout.traces.milo.pass&&water.pass&&resident.pass,
  // This is a comparison of two separately tested models, not a coupled simulation.
  bothPaperChecksClear:channel==='open'&&layout.traces.milo.pass&&water.pass&&resident.pass,
  paperOnly:true,modelsIndependent:true,realDrainageVerified:false,
  actualGardenToConnectorLinkVerified:false,realAccessApproved:false,
  officialUnlock:false,canonicalEvents:[],unlocks:[]
 };
}
