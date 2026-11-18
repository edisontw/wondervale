// Child-earned E11 FIRST/NOW PAPER world atlas. These are three separate
// replayed models, NOT a surveyed route, historical map or approved construction.
import {paperSharedUse} from './shared-use-followthrough.mjs';
import {paperGardenRevisit} from './garden-revisit.mjs';
import {paperE10NeedsRevisit} from './e10-needs-revisit.mjs';
import {paperE10UseRevisit} from './e10-use-revisit.mjs';
import {view as viewE05} from '../e05-scene/scene-model.mjs';
import {view as viewE07} from '../e07-scene/scene-model.mjs';
import {earnedE05} from './e05-earned-layout-trial.mjs';
import {earnedTurnTaking} from './e07-earned-turn-taking.mjs';

export const PAPER_ATLAS_PLACES=Object.freeze([
 {id:'garden',label:'Lower Garden'},
 {id:'connector',label:"Finn's connector"},
 {id:'courtyard',label:'Unnamed courtyard'}
]);

export function paperWorldAtlas(e11,visitorHistory,upstream,sharedHistory,e10,useTrial=null){
 const shared=paperSharedUse(e11,visitorHistory,upstream,sharedHistory);
 const garden=paperGardenRevisit(upstream?.e06);
 const needs=paperE10NeedsRevisit(e10);
 const possibleUse=useTrial?paperE10UseRevisit(e10,useTrial):null;
 // A model snapshot, URL completion claim or unfinished comparison cannot
 // create a world change. All three source scenes must be child-replayed.
 if(!shared?.compared||!shared.changed||!shared.first||!shared.now||
    shared.first.phase!=='first'||shared.now.phase!=='now'||
    !garden?.lower.compared||!needs?.changed||
    (useTrial&&!possibleUse))return null;
 const stage=(id,phase)=>{
  const first=phase==='first',check=first?shared.first:shared.now;
  if(id==='garden')return {
   title:first?'Removable seed marker':'Revised seed model',
   detail:first?'FIRST: Lower Garden has only a removable PAPER marker.':
    garden.lower.note,
   mark:first?garden.lower.firstStage:garden.lower.nowStage
  };
  if(id==='connector')return {
   title:check.overlaps+' connector overlap cells',
   detail:(first?'FIRST':'NOW')+': E06 rain tray '+check.catchment+
    '/3 marks; E07 connector '+check.overlaps+' overlaps. Quiet visitor '+
    (check.quietPass?'PASS':'RETRY')+', group '+(check.groupPass?'PASS':'RETRY')+'.',
   mark:check.overlaps?'conflict':'revised'
  };
  return {
   title:first?'Two PAPER needs overlap':'Two PAPER needs separated',
   detail:(first?'FIRST':'NOW')+': E10 simulated quiet and activity needs '+
    (first?'share one model slot.':'were moved to separate model slots.')+
    (possibleUse?' Imagined cutouts: '+(first?'overlap.':'revised, not history.'):''),
   mark:first?'conflict':'revised'
  };
 };
 const boards=Object.fromEntries(['first','now'].map(phase=>[
  phase,PAPER_ATLAS_PLACES.map(p=>({...p,...stage(p.id,phase)}))
 ]));
 return {
  boards,changed:true,paperOnly:true,
  chronicle:'PAPER ATLAS — FIRST / NOW: Lower Garden marker → '+
   garden.lower.nowStage+'; E07 connector '+shared.first.overlaps+' → '+
   shared.now.overlaps+' overlap cells; E10 courtyard two needs overlap → separated. '+
   'E06 rain '+shared.first.catchment+'/3 → '+shared.now.catchment+
   '/3 model marks. Three INDEPENDENT child-replayed models, NOT a physical connection. '+
   'Real history, people, water, access, permissions and place identity UNKNOWN.',
  sourceApproved:false,realRouteOpen:false,realAccessApproved:false,
  actualPlanting:false,commonRevealed:false,
  canonicalEvents:[],unlocks:[],persistentSave:false
 };
}

/** Read-only partial PAPER world-state projection, never real approval.
 * E05 is optional to the existing three-place Atlas / Repair contract.
 */
export function paperWorldAtlasSources(e11,visitors,upstream,sharedHistory,e10,
 useTrial=null,e05History=null,e07History=null){
 const source05=upstream?.e05,source07=upstream?.e07;
 const ok05=!!(earnedE05(e05History)||
  (source05&&viewE05(source05)&&earnedE05(source05.history)));
 const garden=paperGardenRevisit(upstream?.e06),ok06=!!garden?.lower.compared;
 const ok07=!!(earnedTurnTaking(e07History,[])||
  (source07&&viewE07(source07)&&earnedTurnTaking(source07.history,[])));
 const ok10=!!paperE10NeedsRevisit(e10);
 const sources=[
  {id:'e05',label:'E05 Map Room',status:ok05?'verified':'missing',
   note:ok05?'Milo checked the PAPER Map Room; station access remains UNKNOWN.':
    'No replay-verified E05 Map Room review.'},
  {id:'e06',label:'E06 Lower Garden',status:ok06?'verified':'missing',
   note:ok06?garden.lower.note:'No replay-verified Lower Garden comparison.'},
  {id:'e07',label:'E07 connector',status:ok07?'verified':'missing',
   note:ok07?'Milo checked a PAPER crossing for another traveler and water.':
    'No replay-verified connector and traveler review.'},
  {id:'e10',label:'E10 two needs',status:ok10?'verified':'missing',
   note:ok10?'Milo separated two simulated needs after a PAPER test.':
    'No replay-verified E10 needs comparison.'}
 ];
 // Read-only FIRST/NOW PAPER echoes, never connected geography or real work.
 // These notes derive ONLY from the strict per-source replay decisions.
 const echoNow=Object.freeze({
  e05:'NOW · Milo found a clearer PAPER Map Room table path.',
  e06:'NOW · A PAPER sprout replaces a removable Lower Garden marker.',
  e07:'NOW · Milo retested a PAPER crossing for another traveler and water.',
  e10:'NOW · Two simulated needs use separate PAPER slots after Milo checked them.'
 });
 const echoes=sources.map(source=>({
  id:source.id,label:source.label,status:source.status,
  first:'FIRST · Milo has a question, not a checked world change.',
  now:source.status==='verified'?echoNow[source.id]:
   'NOW · No child-earned PAPER change verified yet.',
  changed:source.status==='verified'
 }));
 const partial=sources.filter(s=>s.status==='verified').map(
  ({id,label,note})=>({id,label,note}));
 const atlas=paperWorldAtlas(e11,visitors,upstream,sharedHistory,e10,useTrial);
 return {
  sources,partial,echoes,verifiedCount:partial.length,visible:partial.length>0,atlas,
  partialChronicle:'PAPER CHRONICLE — '+partial.length+'/4 child-replayed sources verified. '+
   (partial.length?partial.map(s=>s.label+': '+s.note).join(' '):
    'No verified PAPER source.')+
   (atlas?' Full FIRST/NOW model earned.':
    ' Full FIRST/NOW Atlas and Repair remain unearned.')+
   ' North Hill CLOSED; unnamed place UNKNOWN. No real world change or official unlock.',
  paperOnly:true,sourceApproved:false,realRouteOpen:false,
  realAccessApproved:false,actualPlanting:false,commonRevealed:false,
  canonicalEvents:[],unlocks:[],persistentSave:false
 };
}
