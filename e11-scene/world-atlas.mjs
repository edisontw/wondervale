// Child-earned E11 FIRST/NOW PAPER world atlas. These are three separate
// replayed models, NOT a surveyed route, historical map or approved construction.
import {paperSharedUse} from './shared-use-followthrough.mjs';
import {paperGardenRevisit} from './garden-revisit.mjs';
import {paperE10NeedsRevisit} from './e10-needs-revisit.mjs';
import {paperE10UseRevisit} from './e10-use-revisit.mjs';

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
