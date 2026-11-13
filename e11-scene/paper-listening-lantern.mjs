// Independent, fictional E11 listening-lantern trial; no physical safety or Canon implications.
const MODES = ['quiet','signal'];
export function replayLantern(events) {
  if (!Array.isArray(events) || events.length > 40) throw Error('Invalid PAPER history');
  let mode='signal',tested=false;
  for(const e of events) {
    if(!e || typeof e!=='object' || Array.isArray(e)) throw Error('Invalid event');
    if(e.type==='choose' && Object.keys(e).length===2 && MODES.includes(e.mode)) {
      mode=e.mode; tested=false;
    } else if(e.type==='try' && Object.keys(e).length===1) {
      tested=true;
    } else throw Error('Forged PAPER event');
  }
  return {mode,tested,
    nia:!tested?'Nia: Let us listen first.':mode==='quiet'?'Nia: I can hear the story.':'Nia: The signal is too loud for reading.',
    finn:!tested?'Finn: Try the lantern.':mode==='quiet'?'Finn: I cannot see when to start.':'Finn: I can see the signal!',
    world:!tested?'The lantern waits.':mode==='quiet'?'The lantern is dim. The reading corner is calm.':'The lantern flashes. The workbench is busy.',
    chronicle:tested?'PAPER Chronicle: Milo tested the '+mode+' lantern. Both friends still need a better plan.':'',
    canonEvents:[],unlocks:[],rights:[],northHillClosed:true,commonRevealed:false};
}
export function lanternAction(events,event) {
  const next=[...events,event]; replayLantern(next); return next;
}
export function lanternUndo(events) {replayLantern(events);return events.slice(0,-1)}
