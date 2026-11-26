// Read-only Season 1 Alpha ledger composed only from current replay-validated
// E04, E05→E06, and E10→E11 records. It never writes Canon or unlocks.
import {validateE04AlphaHandoff} from './e04-e05-handoff.mjs';
import {decodeStationGardenTransfer} from '../authoring-labs/e05-e06-scene-transfer.mjs';
import {decodeLoopTransfer} from '../authoring-labs/e10-e11-scene-transfer.mjs';
import {view as view05} from '../e05-scene/scene-model.mjs';
import {view as view06} from '../e06-scene/scene-model.mjs';
import {view as view07} from '../e07-scene/scene-model.mjs';
import {view as view08} from '../e08-scene/scene-model.mjs';
import {view as view09} from '../e09-scene/scene-model.mjs';
import {view as view10} from '../authoring-labs/unnamed-story-model.mjs';
import {projection as view11} from '../engine/s01e11-authoring-prototype.mjs';

export const ALPHA_E05_E06_KEY='wondervale-alpha-s01e05-e06-replay-v1';

const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const extendsHistory=(earlier,later)=>Array.isArray(earlier)&&Array.isArray(later)&&
  earlier.length<=later.length&&same(earlier,later.slice(0,earlier.length));

function boundStationTransfer(storage,text,e04){
  try{
    const saved=JSON.parse(text);
    if(!e04||!saved||saved.v!==1||typeof saved.hash!=='string'||
       !same(saved.e04,e04.record))return null;
    return decodeStationGardenTransfer(saved.hash);
  }catch{return null;}
}

// Bind the earned Station visit to the specific fictional E04 replay that
// actually entered it. Independent PAPER previews remain playable but cannot
// be combined with an unrelated E04 record to claim a continuous Alpha ledger.
export function recordAlphaStationTransfer(storage,arrivalHash,stationHash){
  try{
    const next=decodeStationGardenTransfer(stationHash);
    const arrival=typeof arrivalHash==='string'&&arrivalHash.startsWith('#alpha-e04-e05=')?
      validateE04AlphaHandoff(arrivalHash,storage):null;
    const current=validateE04AlphaHandoff(null,storage);
    const prior=boundStationTransfer(storage,storage.getItem(ALPHA_E05_E06_KEY),current);
    const returned=decodeStationGardenTransfer(arrivalHash);
    const sameVisit=prior&&returned&&same(prior.e05.history,returned.e05.history)&&
      next&&extendsHistory(returned.e05.history,next.e05.history);
    if(!next||!current||(!arrival&&!sameVisit)){
      storage.removeItem(ALPHA_E05_E06_KEY);
      return false;
    }
    storage.setItem(ALPHA_E05_E06_KEY,JSON.stringify({v:1,e04:current.record,hash:stationHash}));
    return true;
  }catch{return false;}
}

export function buildAlphaChronicle(storage,e05E06Record,e10E11Hash,e11Reviewed=false,e11Placed=null){
  const e04=validateE04AlphaHandoff(null,storage);
  const e05E06=boundStationTransfer(storage,e05E06Record,e04);
  const loop=decodeLoopTransfer(e10E11Hash);
  const u=loop?.upstream;
  if(!e04||e04.mode!=='noncanonical_alpha_paper'||!e05E06||
     !loop?.e10||!loop?.e11||!u?.e06||!u?.e07||!u?.e08||!u?.e09||
     !extendsHistory(e05E06.e06.history,u.e06.history))return null;
  const b=view05(e05E06.e05),c=view06(u.e06),d=view07(u.e07),
    e=view08(u.e08),f=view09(u.e09),g=view10(loop.e10),h=view11(loop.e11);
  if(!b||b.stage!=='review'||!c||!d||!e||!f||!g||!h)return null;
  const placed=e11Placed??Object.values(h.layout).reduce((count,cells)=>count+cells.length,0);
  return {
    mode:'noncanonical_alpha_paper',
    upstreamReplaysVerified:true,
    officialChronicle:false,
    canonicalEvents:[],
    unlocks:[],
    entries:[
      {scene:'E02–E03',text:'Prerequisite scenes replay-checked; both E03 memories remain attributed and undated.'},
      {scene:'E04',text:'Market coordinator and Garden resident memories stay separate. Version 1 comes before Version 2 in the fictional pack; the undated photo stays Not sure yet.'},
      {scene:'E05',text:'Removable station copy tested; MOCK source maker/date/original UNKNOWN; PAPER Map Room path cleared.'},
      {scene:'E06 Current',text:'Present garden remains healthy; PAPER rain model '+(c.currentCompared?'compared':'still being tested')+'.'},
      {scene:'E06 Lower',text:'Lower pocket inspected; hypothetical PAPER care compared. No planting permission.'},
      {scene:'E07',text:'Finn connector '+(d.connectorPaperRevised?'was revised':'is still under test')+' for Milo, another walker and water.'},
      {scene:'E08',text:'Lower model lamp/viewpoint trial '+(e.lowerLightsPaperOn?'compared':'still in progress')+'; real lighting NOT approved.'},
      {scene:'E09',text:'Lower PAPER survey '+(f.story.provisionalFinished?'checked':'still in progress')+'; upper North Hill remains CLOSED.'},
      {scene:'E10',text:'Fictional traces and two SIMULATED needs compared; FIRST/NOW model revised.'},
      {scene:'E11',text:'Reversible PAPER layout cells placed: '+placed+'; model review: '+(e11Reviewed||h.reviewed?'recorded':'pending')+'. Shared place remains CLOSED.'}
    ]
  };
}
