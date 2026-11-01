// E10 -> E11 child-earned PAPER needs atlas. Never a historical or real-site plan.
// Only strict E10 replay-verified completion may supply the two tested boards.
import {view as viewE10} from '../authoring-labs/unnamed-story-model.mjs';

const SLOTS=Object.freeze(['left','shared','right']);
export function paperE10NeedsRevisit(e10){
 const v=viewE10(e10);
 if(!v?.finishedPaper||!v.sourceChecked||v.sourceApproved!==false||
    v.actualName!==null||v.e11Unlocked!==false||v.realAccessApproved!==false||
    v.upperHillClosed!==true||!v.testedOneSlot||!v.changedAfterTest||
    !v.comparison)return null;
 const {first,now}=v.comparison;
 if(!first||!now||!['quiet','activity'].every(id=>
   SLOTS.includes(first[id])&&SLOTS.includes(now[id])))return null;
 // FIRST is Milo's real PAPER one-slot experiment, not a claim about the past.
 if(first.quiet!==first.activity||now.quiet===now.activity)return null;
 const board=slots=>SLOTS.map(id=>({
  id,quiet:slots.quiet===id,activity:slots.activity===id,
  conflict:slots.quiet===id&&slots.activity===id
 }));
 return {
  first:board(first),now:board(now),firstConflict:true,nowConflict:false,
  changed: first.quiet!==now.quiet||first.activity!==now.activity,
  qualifier:'FIRST = Milo\'s tested PAPER overlap; NOW = Milo\'s revised PAPER needs. Neither is historical or approved.',
  realAccessApproved:false,sourceApproved:false,canonicalEvents:[],unlocks:[]
 };
}
