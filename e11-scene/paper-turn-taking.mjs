// Fictional PAPER turn-taking trial. No actual user consent, access or Canon rights.
const CHOICES=['read','build','share'];
export function replayTurns(events) {
 if(!Array.isArray(events)||events.length>48) throw Error('Invalid PAPER history');
 let choice='build',tested=false;
 for(const e of events) {
  if(!e||typeof e!=='object'||Array.isArray(e)) throw Error('Invalid event');
  if(e.type==='choose'&&Object.keys(e).length===2&&CHOICES.includes(e.choice)){choice=e.choice;tested=false}
  else if(e.type==='try'&&Object.keys(e).length===1){tested=true}
  else throw Error('Forged PAPER event');
 }
 const outcome=!tested?'Milo has not tried a plan.':choice==='build'?'The model work area is busy; the reading time is interrupted.':choice==='read'?'The model table is quiet; the build must wait.':'A paper timer alternates reading and building turns.';
 return {choice,tested,world:outcome,
 nia:!tested?'Nia: Who needs a turn?':choice==='build'?'Nia: I need time to read.':choice==='read'?'Nia: I can read now.':'Nia: I can read during my turn.',
 finn:!tested?'Finn: Let us try a plan.':choice==='read'?'Finn: When can I build?':choice==='build'?'Finn: My model is moving!':'Finn: I can build when the timer changes.',
 chronicle:tested?'PAPER Chronicle: Milo tried '+choice+'. '+(choice==='share'?'Both friends get a turn.':'Milo can revise the plan.'):'',
 canonEvents:[],unlocks:[],rights:[],northHillClosed:true,commonRevealed:false};
}
export function turnAction(events,event){const next=[...events,event];replayTurns(next);return next}
export function turnUndo(events){replayTurns(events);return events.slice(0,-1)}
