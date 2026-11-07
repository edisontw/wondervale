// E11 PAPER-only, child-action-driven dialogue. No new progress flags or canon.
const USERS_TESTED=tests=>['quiet_reader','activity_group'].every(id=>tests[id]?.passed===true);
export function paperE11Story(state) {
  const trials=Array.isArray(state?.trials)?state.trials:[];
  const tests=state?.tests||{};
  if(state?.reviewed)
    return 'Milo: "We changed it because both people matter." Nia: "Our paper path works. Who must check the real place?" Finn: "Keep the hill closed."';
  if(state?.comparison)
    return 'Milo: "FIRST and NOW are different!" Nia: "Both needs still matter." Finn: "Check the model loop; real access is not proven."';
  if(trials.length>=2)
    return 'Finn: "We tried two layouts." Milo: "Let me compare them." Nia: "What changed for each visitor?"';
  if(trials.length===1)
    return 'Milo: "This is our FIRST trial." Finn: "Move a piece and test again." Nia: "Keep both visitors in mind."';
  if(Object.values(tests).some(t=>t&&t.passed===false)||Number(state?.blockedAttempts)>0)
    return 'Milo: "It blocks the way!" Finn: "Who needs this path?" Nia: "We can move a piece and try again."';
  if(USERS_TESTED(tests))
    return 'Milo: "Both visitors tried our paper plan." Nia: "What worked for each one?" Finn: "Save this trial, then move a piece and compare."';
  if(Object.keys(tests).length)
    return 'Nia: "We tested one need. What about the other?" Milo: "Let us check both."';
  if((state?.revision||0)>0)
    return 'Finn: "Our paper pieces moved." Nia: "Will both visitors fit?" Milo: "Let us test."';
  return 'Milo: "Two people need this space." Nia: "Let us watch both." Finn: "Try a layout, then walk the path."';
}
