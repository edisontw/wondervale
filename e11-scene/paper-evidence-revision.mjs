// E11 fictional evidence-driven model revision. PAPER only; no E05 provenance or Canon unlock.
const OPTIONS = ['old-map', 'new-mark', 'both'];
export function replayEvidence(events) {
  if (!Array.isArray(events) || events.length > 30) return null;
  let selected=null, observed=false, model='unmarked', chronicle=[];
  for (const e of events) {
    if (!e || typeof e !== 'object' || Array.isArray(e) ||
        Object.keys(e).sort().join(',') !== (e.type==='inspect'?'type':e.type==='choose'?'option,type':e.type==='try'?'type':'invalid')) return null;
    if (e.type==='inspect') { if (observed) return null; observed=true; }
    else if (e.type==='choose') {
      if (!observed || !OPTIONS.includes(e.option)) return null;
      selected=e.option;
    } else if (e.type==='try') {
      if (!observed || !selected) return null;
      model=selected==='both'?'two-trace-model':selected==='old-map'?'old-only-model':'new-only-model';
      chronicle.push(selected==='both'?'Milo kept both fictional clues on the model.':'Milo tried one clue; another clue is still missing.');
      selected=null;
    } else return null;
  }
  return Object.freeze({
    observed, selected, model, chronicle:[...chronicle],
    nia:model==='two-trace-model'?'Nia: We can see both clues.':'Nia: What does the other clue show?',
    finn:model==='two-trace-model'?'Finn: Let us test this new model.':'Finn: We can change our model.',
    paperOnly:true, canonicalEvents:[], unlocks:[], rights:[],
    northHillClosed:true, commonRevealed:false, realAccessApproved:false
  });
}
