// Read-only, replay-verified E09 PAPER character and Chronicle callbacks.
// Fictional geometry only. No history, rights, canonical events, persistence or unlock.
import {view} from './scene-model.mjs';
import {CLUE_SITES} from './ground-evidence.mjs';
import {SIGHTLINE_TARGETS} from './sightline-questions.mjs';

const label={disturbed_ground:'GROUND',runoff_marks:'WATER'};
const questionLabel={light:'VISIBILITY',view:'VIEWPOINT'};

export function paperReaction(snapshot){
 const v=view(snapshot);
 if(!v)return null; // The scene model rejects forged state/history before dialogue is rendered.
 const h=snapshot.history,last=h.at(-1),s=v.story;
 let speaker=s.speaker,line=s.line;
 if(last?.scene==='ground'){
  if(last.type==='place'){
   speaker='Milo';
   line=last.at===CLUE_SITES[last.clue]?
    'I put the '+label[last.clue]+' pin where I looked.':
    'That is not where I saw it. I can move this PAPER pin.';
  }else if(last.type==='remove'){
   speaker='Milo';line='I can look again and place the pin somewhere else.';
  }else if(last.type==='compare'){
   speaker=v.groundBoard.compared?'Nia':'Finn';
   line=v.groundBoard.compared?
    'We saw ground and water marks. We still do not know the cause.':
    'These pins do not match Milo\'s walk. We can revise them.';
  }
 }else if(last?.scene==='sightline'){
  if(last.type==='place'){
   speaker='Milo';
   line=last.at===SIGHTLINE_TARGETS[last.question].at?
    'I put the '+questionLabel[last.question]+' question where I looked.':
    'This question needs another place. I can move it.';
  }else if(last.type==='remove'){
   speaker='Milo';line='I can move that question. We have not tested it.';
  }else if(last.type==='compare'){
   speaker=v.sightlineBoard.compared?'Finn':'Nia';
   line=v.sightlineBoard.compared?
    'Two future questions are pinned. Both checks are NOT DONE.':
    'Which safe view matches each question? We can try again.';
  }
 }else if(last?.scene==='nav'&&last.type==='blank'){
  speaker='Finn';line='BEFORE: this PAPER sketch has no notes from our walk.';
 }else if(last?.scene==='nav'&&last.type==='notes'){
  speaker='Milo';line='NOW: these are marks from where I really walked in our model.';
 }

 // These entries describe only actions accepted by the strict E09 reducer.
 const entries=['PAPER CHRONICLE — fictional survey, NOT a real hill route.'];
 if(s.inspected.includes('boundary_sign'))entries.push('Milo read CLOSED from the safe side.');
 if(h.some(a=>a.scene==='story'&&a.action?.type==='walk'&&a.action.to==='upper_closed'))
  entries.push('Milo tried the old way and stopped at the fence.');
 if(s.inspected.includes('disturbed_ground')&&s.inspected.includes('runoff_marks'))
  entries.push('Milo saw uneven ground and water marks at two different model points.');
 if(v.groundBoard.compared){
  const revised=h.some(a=>a.scene==='ground'&&a.type==='place'&&
   CLUE_SITES[a.clue]&&a.at!==CLUE_SITES[a.clue]);
  entries.push(revised?
   'Milo moved a misplaced pin and matched both observations.':
   'Milo placed both observations where he looked.');
  entries.push('The ground-change cause and date remain UNKNOWN.');
 }
 if(s.routeResult?.complete)
  entries.push('Milo walked and marked a connected lower MODEL route. The upper hill remains CLOSED.');
 if(s.symbolCompared)entries.push('The distant mark shape matches; the place name is UNKNOWN.');
 if(v.sightlineBoard.compared)
  entries.push('Milo pinned VISIBILITY and VIEWPOINT as future PAPER questions — NOT DONE.');
 if(s.previewComplete)entries.push('Survey review finished in this PAPER model only.');
 entries.push('Real access NOT APPROVED. Canonical events: 0. E10 NOT UNLOCKED.');
 return {speaker,line,chronicle:entries.join(' ')};
}
