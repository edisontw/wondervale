// Source-bound PAPER Chronicle reflection cards. Not a production ledger or unlock.
import {restore,project} from './world-revisit.mjs';

export const PAPER_REFLECTIONS=Object.freeze({
  station:{action:'try-fit',tested:'Milo turned a replica and checked that the paper walkway stayed clear.',unknown:'Original station records, access and room permission remain unverified.'},
  current:{action:'run-tray',tested:'Milo compared rain and an open channel using a model tray.',unknown:'No real rainfall or historical garden cause is established.'},
  lower:{action:'test-pocket',tested:'Milo moved a paper seed marker away from runoff and the shared path.',unknown:'No planting permission, real seed or biological growth is claimed.'},
  connector:{action:'test-passage',tested:'Milo retested the connector for a walker and water.',unknown:'Real geometry, right of way and drainage are not approved.'},
  steps:{action:'compare-views',tested:'Milo compared two lower viewpoints with reversible model lights.',unknown:'No real lighting installation, historical date or provenance is known.'},
  hill:{action:'review-hill',tested:'Milo stopped at the CLOSED edge and revised a lower paper survey.',unknown:'North Hill stays CLOSED; real terrain and access are unverified.'},
  needs:{action:'review-needs',tested:'Milo separated two SIMULATED present-day needs.',unknown:'No actual resident testimony, place name or access is verified.'},
  layout:{action:'test-layout',tested:'Milo revised a shared paper layout and retested both uses.',unknown:'No construction, official opening, production loop or Season completion is granted.'}
});

export function paperChronicle(state){
  const verified=restore(state);
  if(!verified)return null;
  const p=project(verified);
  if(!p)return null;
  return p.paperNotes.map(note=>{
    const spec=PAPER_REFLECTIONS[note.place];
    const entry=p.progress.find(item=>item.id===note.place);
    const actionIndex=verified.history.findLastIndex(action=>action.type===spec.action);
    // Strict replay makes this a real child MODEL trial, not an invented completion.
    if(!entry?.done||!entry.available||actionIndex<0)throw new TypeError('Unverified PAPER reflection');
    return {
      place:note.place,label:entry.label,kind:'PAPER MODEL — NOT CHRONICLE',
      text:note.text,before:entry.before,now:entry.now,
      tested:spec.tested,unknown:spec.unknown,proofAction:spec.action,
      proofStep:actionIndex+1,canRevisit:true,
      canonical:false,unlock:false,rights:false,seasonFinished:false
    };
  });
}
