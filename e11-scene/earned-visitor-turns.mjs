// Strict E10-earned PAPER gate for E11 visitor-turn rehearsal. No Canon transfer.
import {replay as replayE10} from '../authoring-labs/unnamed-story-model.mjs';
import {paperE10NeedsRevisit} from './e10-needs-revisit.mjs';
import {replayTurns,dispatchTurns} from './visitor-turns.mjs';
export function replayEarnedVisitorTurns(e10Events,turnEvents=[]){
  const e10=replayE10(e10Events);
  if(!e10 || !paperE10NeedsRevisit(e10)) return null;
  try {
    const turns=replayTurns(turnEvents);
    return {...turns,source:'E10 child-earned PAPER needs',canonicalEvents:[],unlocks:[],
      rights:[],realAccessApproved:false,northHillClosed:true,commonRevealed:false};
  } catch {return null;}
}
export function dispatchEarnedVisitorTurns(e10Events,turnEvents,action){
  if(!replayEarnedVisitorTurns(e10Events,turnEvents)) return null;
  try {
    const next=dispatchTurns(turnEvents,action);
    return replayEarnedVisitorTurns(e10Events,next)?next:null;
  } catch {return null;}
}
