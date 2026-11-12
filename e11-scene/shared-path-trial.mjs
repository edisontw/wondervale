// Independent, fictional E11 PAPER path trial. No actual access or rights.
export function replayPath(events=[]) {
 if(!Array.isArray(events)||events.length>24)throw Error('Invalid history');
 let width='narrow',tested=false;
 for(const e of events){
  if(!e||typeof e!=='object'||Array.isArray(e))throw Error('Invalid event');
  const keys=Object.keys(e);
  if(e.type==='place'&&keys.length===2&&keys.includes('width')&&['narrow','shared'].includes(e.width)){
   width=e.width;tested=false;
  }else if(e.type==='test'&&keys.length===1&&!tested){tested=true;}
  else throw Error('Invalid event');
 }
 const passed=tested&&width==='shared';
 return {width,tested,passed,
  feedback:!tested?'Nia: Choose a path. Ask the other traveler to try.':
   passed?'Finn: We made room for another traveler in our PAPER model.':
   'Finn: My narrow model blocks the other traveler. Let us change it.',
  world:!tested?'Not tested':passed?'Two PAPER travelers can pass':'Second PAPER traveler waits',
  chronicle:passed?'PAPER Chronicle: Milo revised the model for two travelers.':null,
  canonicalEvents:[],unlocks:[],rights:[],realAccessApproved:false,northHillClosed:true,commonRevealed:false};
}
export function dispatchPath(history,event){const next=[...history,event];replayPath(next);return next;}
