// E07 -> E11 PAPER-only handoff. Never grant Canon access or actual user consent.
import * as E07 from '../e07-scene/scene-model.mjs';
import {replayTurns} from './paper-turn-taking.mjs';

export function earnedTurnTaking(e07History, e11Events) {
  // Only the upstream reducer can validate an E07 event history.
  const upstream=E07.replay(e07History);
  if (!upstream) return null;
  const evidence=E07.view(upstream);
  if (!evidence?.walkthrough?.reviewed ||
      !evidence.walkthrough.otherPassed ||
      !evidence.walkthrough.checked.includes('crossing') ||
      !evidence.walkthrough.checked.includes('water-edge') ||
      !evidence.story?.previewComplete ||
      evidence.canonicalEvents.length || evidence.unlocks.length ||
      evidence.rights.length || evidence.realAccessApproved) return null;
  const downstream=replayTurns(e11Events);
  return {
    ...downstream,
    e07PaperReviewed:true,
    e07OtherTravelerPassed:true,
    crossEpisodeFeedback:'Finn: We checked another traveler at the model crossing. Now let us listen and take turns at the table.',
    paperOnly:true, canonicalEvents:[], unlocks:[], rights:[],
    northHillClosed:true, commonRevealed:false, realAccessApproved:false
  };
}
