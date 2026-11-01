// Read-only E03 source gate plus strictly replayed E04-E11 PAPER callbacks.
// A URL fragment and a canonical E03 checkpoint do not approve later production.
import {e04Handoff} from '../engine/s01e04-handoff.mjs';
import {decodeLoopTransfer} from './e10-e11-scene-transfer.mjs';
import {view as view04} from './arc1-memory-station-handoff-model.mjs';
import {view as view05} from '../e05-scene/scene-model.mjs';
import {view as view06} from '../e06-scene/scene-model.mjs';
import {view as view07} from '../e07-scene/scene-model.mjs';
import {view as view08} from '../e08-scene/scene-model.mjs';
import {view as view09} from '../e09-scene/scene-model.mjs';
import {view as view10} from './unnamed-story-model.mjs';
import {projection as view11} from '../engine/s01e11-authoring-prototype.mjs';

export function paperChronicle(e02Save,e03Save,fragment){
 const gate=e04Handoff(e02Save,e03Save);
 const base={e03Ready:gate.ready,sourceIds:gate.ready?gate.sources:null,
  status:'no-valid-paper-chain',entries:[],canonicalEvents:[],unlocks:[],
  historicalClaims:[],rights:[],officialChronicle:false,seasonComplete:false};
 const chain=decodeLoopTransfer(fragment);
 if(!chain?.upstream?.e04||!chain.upstream.e05||!chain.upstream.e06||
    !chain.upstream.e07||!chain.upstream.e08||!chain.upstream.e09)return base;
 const u=chain.upstream;
 const a=view04(u.e04),b=view05(u.e05),c=view06(u.e06),
  d=view07(u.e07),e=view08(u.e08),f=view09(u.e09),
  g=view10(chain.e10),h=view11(chain.e11);
 // No claimed world change without the child's strictly replayed actions.
 if(!a||!b||!c||!d||!e||!f||!g||!h)return base;
 const placed=Object.values(h.layout).reduce((n,cells)=>n+cells.length,0);
 return {...base,status:gate.ready?'e03-verified-paper-chain':'paper-only-e03-unverified',
  entries:[
   {scene:'E04',text:'Both sincere E03 memories heard; earlier/later UNKNOWN (no dated source).'},
   {scene:'E05',text:'Removable station copy tested; MOCK source maker/date/original UNKNOWN; PAPER Map Room path cleared.'},
   {scene:'E06 Current',text:'Present garden remains healthy; PAPER rain model  ' + (c.currentCompared?'compared':'still being tested') + '.'},
   {scene:'E06 Lower',text:'Lower pocket inspected; hypothetical PAPER care compared. No planting permission.'},
   {scene:'E07',text:'Finn connector  ' + (d.connectorPaperRevised?'was revised':'is still under test') + ' for Milo, another walker and water.'},
   {scene:'E08',text:'Lower model lamp/viewpoint trial  ' + (e.lowerLightsPaperOn?'compared':'still in progress') + '; real lighting NOT approved.'},
   {scene:'E09',text:'Lower PAPER survey  ' + (f.story.provisionalFinished?'checked':'still in progress') + '; upper North Hill remains CLOSED.'},
   {scene:'E10',text:'Fictional traces and two SIMULATED needs compared; FIRST/NOW model revised.'},
   {scene:'E11',text:'Reversible PAPER layout cells placed: '+placed+
    '; model review: '+(h.reviewed?'recorded':'pending')+'. Shared place remains CLOSED.'}
  ]};
}
