// E04 chronology authoring preview: accessible, dependency-free DOM controller.
// No route, production evidence, artwork, or canonical E04 progress is provided here.
import {openE04Authoring} from '../engine/s01e04-authoring-entry.mjs';
import {e04Handoff} from '../engine/s01e04-handoff.mjs';
import {
  DRAFT_KEY,MAX_ACTIONS,dispatch,draftPayload,timelineSupported,chronicleProjection,validateSourcePack
} from '../engine/s01e04-chronology.mjs';

const SLOTS=[['earlier','Earlier'],['later','Later'],['uncertain','Not sure yet']];
// Exact accepted E03 witness lines, from DETAILED_SCRIPT.md (COORDINATOR-009 / RESIDENT-001).
// These remain attributed memories, not verified historical dates or E04 source cards.
const MEMORY_LABELS=[
  ['station','Market coordinator','I remember a way to the station.','S01E03-COORDINATOR-009'],
  ['garden','Garden resident','I remember a way to the garden.','S01E03-RESIDENT-001']
];
const MAX_SAVE_CHARS=60000;

function load(storage,mode) {
  if (!storage || mode!=='draft_preview') return {raw:null,present:false,problem:false};
  try {
    const text=storage.getItem(DRAFT_KEY);
    if (text===null) return {raw:null,present:false,problem:false};
    if (typeof text!=='string' || text.length>MAX_SAVE_CHARS)
      return {raw:null,present:true,problem:true};
    return {raw:JSON.parse(text),present:true,problem:false};
  } catch { return {raw:null,present:true,problem:true}; }
}
function persist(storage,mode,state) {
  if (!storage || mode!=='draft_preview') return true;
  try {
    const payload=draftPayload(state);
    if (!payload) {
      storage.removeItem(DRAFT_KEY);
      return storage.getItem(DRAFT_KEY)===null;
    }
    const text=JSON.stringify(payload);
    if (text.length>MAX_SAVE_CHARS) return false;
    storage.setItem(DRAFT_KEY,text);
    // Some storage shims fail silently; only report saved after readback.
    return storage.getItem(DRAFT_KEY)===text;
  } catch { return false; } // Keep the in-memory draft playable.
}

export function mountE04Authoring(root,{pack,e02Save,e03Save,storage=null,mode='draft_preview'}={}) {
  if (!root || typeof root.replaceChildren!=='function' || !root.ownerDocument)
    throw new TypeError('E04 preview needs a DOM root');
  // Check actual E02/E03 event-replayed saves before inspecting or showing source data.
  const gate=e04Handoff(e02Save,e03Save);
  const doc=root.ownerDocument;
  const el=(tag,cls='',label='')=>{
    const n=doc.createElement(tag);
    if(cls)n.className=cls;
    if(label)n.textContent=label;
    return n;
  };
  const blocked=el('section','e04-authoring');
  blocked.setAttribute('aria-label','Episode 04 entry');
  if (!gate.ready) {
    const title=el('h2','','Episode 04 is not available yet');
    const hint=el('p','e04-notice',gate.reason==='complete-riverside-first'
      ? 'Finish Riverside and Market Lane before opening this chapter.'
      : 'Finish Market Lane before opening this chapter.');
    blocked.append(title,hint);
    root.replaceChildren(blocked);
    return {ready:false,reason:gate.reason,getState:()=>null,reset:()=>false,destroy:()=>root.replaceChildren()};
  }
  // No built-in source pack: owner-reviewed evidence must be supplied by a future integrator.
  const sources=validateSourcePack(pack);
  const checkpoint=load(storage,mode);
  const opened=openE04Authoring(e02Save,e03Save,sources,checkpoint.raw,mode);
  let state=opened.session;
  // Restore is strict event replay: any mismatched/invalid checkpoint starts fresh.
  // Keep the old bytes untouched until a new valid action explicitly saves.
  let restoreWarning=checkpoint.problem ||
    (checkpoint.present && JSON.stringify(opened.session)!==JSON.stringify(checkpoint.raw));
  let disposed=false;
  let resetPending=false;
  let resetError=false;
  let saveError=false;
  let saveRecovered=false;
  const read=()=>structuredClone(state);
  function update(action,key) {
    if(disposed || state.history.length>=MAX_ACTIONS)return;
    resetPending=false;
    state=dispatch(state,action,sources);
    saveError=!persist(storage,mode,state);
    if (!saveError) restoreWarning=false;
    saveRecovered=false;
    render(key);
  }
  function retrySave() {
    if(disposed || !saveError)return false;
    saveError=!persist(storage,mode,state);
    saveRecovered=!saveError;
    if (!saveError) restoreWarning=false;
    render('retry-save');
    return !saveError;
  }
  function reset() {
    if(disposed)return false;
    // Do not show a fresh draft if the old checkpoint still survives on disk.
    // Otherwise reloading the page can silently resurrect a supposedly cleared draft.
    if(mode==='draft_preview' && storage) {
      try {
        storage.removeItem(DRAFT_KEY);
        if(storage.getItem(DRAFT_KEY)!==null) throw new Error('Draft checkpoint still present');
      } catch {
        resetPending=true;
        resetError=true;
        render('confirm-reset');
        return false;
      }
    }
    resetPending=false;
    resetError=false;
    saveError=false;
    saveRecovered=false;
    restoreWarning=false;
    state=openE04Authoring(e02Save,e03Save,sources,null,mode).session;
    render('start-over');
    return true;
  }
  function render(focusKey=null) {
    if(disposed)return;
    const focusables=new Map();
    const box=el('section','e04-authoring');
    box.setAttribute('aria-label','Episode 04 chronology authoring preview');
    const heading=el('h2','','What changed over time?');
    // Restart returns keyboard and screen-reader users to the beginning of the draft.
    if(focusKey==='start-over')heading.tabIndex=-1;
    box.append(heading);
    box.append(el('p','e04-notice','Interaction preview only. This is not a completed episode, and no canonical progress is saved.'));
    const atLimit=state.history.length>=MAX_ACTIONS && state.phase!=='completed';
    const seen=state.cardViewed.length+state.clueViewed.length+state.memoryViewed.length;
    const total=sources.cards.length+sources.clues.length+MEMORY_LABELS.length;
    const status=el('p','e04-status',`Sources inspected: ${seen} of ${total}. Stage: ${state.phase.replaceAll('_',' ')}.`);
    status.setAttribute('role','status');
    status.setAttribute('aria-live','polite');
    box.append(status);
    let limitWarning=null;
    if(atLimit) {
      const warning=el('p','e04-save-warning',
        'This preview has reached its 250-change safety limit. Your draft stays available on this page, but no more changes can be made. Start this draft again to create a new draft.');
      warning.setAttribute('role','alert');
      warning.tabIndex=-1;
      limitWarning=warning;
      box.append(warning);
    }
    if(restoreWarning) {
      const warning=el('p','e04-save-warning',
        'The previous Episode 04 draft could not be restored. This preview starts fresh. '+
        'The old saved data has not been deleted; continuing may replace it.');
      warning.setAttribute('role','alert');
      box.append(warning);
    }
    let saveStatus=null;
    if(saveError) {
      const warning=el('div','e04-save-warning');
      const message=el('p','',
        'This draft is not saved on this device. Keep this page open and retry saving.');
      message.setAttribute('role','alert');
      warning.append(message);
      button(warning,'Retry saving',retrySave,'retry-save');
      box.append(warning);
    } else if(saveRecovered) {
      const message=el('p','e04-save-success','Draft saved on this device.');
      message.setAttribute('role','status');
      // Retry removes its button; keep keyboard/screen-reader focus on confirmation.
      message.tabIndex=-1;
      saveStatus=message;
      box.append(message);
    }
    function button(parent,label,action,key,disabled=false,pressed=null) {
      const b=el('button','e04-button',label);
      b.type='button';
      b.disabled=disabled || (atLimit && !['reset','keep-reset','confirm-reset','retry-save'].includes(key));
      b.dataset.focusKey=key;
      if(pressed!==null)b.setAttribute('aria-pressed',String(pressed));
      b.addEventListener('click',()=>action());
      parent.append(b);
      focusables.set(key,b);
      return b;
    }
    const memories=el('section','e04-panel');
    memories.append(el('h3','','Two memories'));
    memories.append(el('p','','These are attributed accounts, not proof that either speaker is wrong.'));
    for(const [which,name,quote,sourceId] of MEMORY_LABELS) {
      const row=el('div','e04-row');
      row.append(el('span','e04-label',name+' memory'));
      const inspected=state.memoryViewed.includes(which);
      button(row,inspected?'Memory inspected':'Inspect memory',()=>update({type:'inspect-memory',which},'memory:'+which),
        'memory:'+which,inspected);
      memories.append(row);
      if(inspected) {
        const quotation=el('blockquote','e04-memory-quote');
        quotation.dataset.sourceId=sourceId;
        quotation.append(el('p','',`“${quote}”`));
        quotation.append(el('cite','',name+' · Market Lane'));
        memories.append(quotation);
      }
    }
    box.append(memories);
    const evidence=el('section','e04-panel');
    evidence.append(el('h3','','Source cards'));
    evidence.append(el('p','','Inspect a source before choosing where it belongs. You can change your choice.'));
    for(const card of sources.cards) {
      const cardBox=el('article','e04-card');
      cardBox.append(el('h4','',card.label));
      cardBox.append(el('p','e04-kind',card.kind));
      const inspected=state.cardViewed.includes(card.id);
      button(cardBox,inspected?'Inspected':'Inspect source',()=>update({type:'inspect-card',id:card.id},'inspect:'+card.id),
        'inspect:'+card.id,inspected);
      const choices=el('div','e04-choices');
      choices.setAttribute('role','group');
      choices.setAttribute('aria-label','Time position for '+card.label);
      for(const [slot,label] of SLOTS) {
        const selected=state.slots[card.id]===slot;
        button(choices,label,()=>update({type:'place',id:card.id,slot},'place:'+card.id+':'+slot),
          'place:'+card.id+':'+slot,!inspected||state.phase==='completed',selected);
      }
      cardBox.append(choices);
      evidence.append(cardBox);
    }
    box.append(evidence);
    const clues=el('section','e04-panel');
    clues.append(el('h3','','Check the clues'));
    for(const clue of sources.clues) {
      const row=el('div','e04-card');
      row.append(el('h4','',clue.label));
      const inspected=state.clueViewed.includes(clue.id);
      if(inspected)row.append(el('p','e04-clue-text',clue.text));
      button(row,inspected?'Clue inspected':'Inspect clue',()=>update({type:'inspect-clue',id:clue.id},'clue:'+clue.id),
        'clue:'+clue.id,inspected);
      clues.append(row);
    }
    box.append(clues);
    const decisions=el('section','e04-panel');
    decisions.append(el('h3','','What do the sources suggest?'));
    const ready=timelineSupported(state,sources) &&
      MEMORY_LABELS.every(([which])=>state.memoryViewed.includes(which)) &&
      state.clueViewed.includes(sources.relativeOrder.basis);
    button(decisions,'Both memories may describe different times',()=>update({
      type:'explain',kind:'different_times',basis:sources.relativeOrder.basis
    },'explain'),'explain',!ready||state.phase==='completed');
    if(state.explanation) {
      const projection=chronicleProjection(state,sources);
      const note=el('p','e04-clue-text','A supported relative order can be recorded. Unknown dates remain unknown.');
      decisions.append(note);
      if(projection.uncertain.length)decisions.append(el('p','',
        'Still uncertain: '+projection.uncertain.map(id=>sources.cards.find(c=>c.id===id)?.label).join(', ')));
    }
    button(decisions,'Review draft Chronicle',()=>update({type:'chronicle'},'chronicle'),
      'chronicle',state.phase!=='chronicle');
    if(state.chronicleSeen) {
      const summary=chronicleProjection(state,sources);
      const review=el('section','e04-chronicle');
      review.setAttribute('aria-label','Draft Chronicle timeline');
      review.append(el('h4','','Our draft timeline'));
      review.append(el('p','','Earlier and later show source order, not confirmed calendar dates.'));
      const timeline=el('ol','e04-timeline');
      for(const [label,id] of [['Earlier',summary.relativeOrder?.earlier],['Later',summary.relativeOrder?.later]]) {
        if(!id)continue;
        const item=el('li','e04-timeline-step');
        item.append(el('strong','',label));
        item.append(el('span','',sources.cards.find(c=>c.id===id)?.label??id));
        timeline.append(item);
      }
      review.append(timeline);
      if(summary.uncertain.length)review.append(el('p','e04-uncertain',
        'Not sure yet: '+summary.uncertain.map(id=>sources.cards.find(c=>c.id===id)?.label??id).join(', ')+'.'));
      review.append(el('p','e04-memory-note',
        'Market coordinator and Garden resident gave two memories. Neither memory has a verified date.'));
      review.append(el('p','e04-explanation',
        'Different times could explain both memories. We do not need to call either person wrong.'));
      decisions.append(review);
    }
    button(decisions,'Complete draft timeline',()=>update({type:'finish'},'finish'),
      'finish',state.phase!=='ready_to_finish');
    if(state.phase==='completed')decisions.append(el('p','e04-status','Draft timeline complete. This does not unlock another episode.'));
    box.append(decisions);
    const footer=el('footer','e04-footer');
    if(resetPending) {
      footer.append(el('p','e04-reset-warning',
        'Start again? Only this Episode 04 draft will be cleared. Earlier chapters stay saved.'));
      if(resetError) {
        const warning=el('p','e04-reset-error',
          'Could not clear this draft on this device. Your work is still here. Try again.');
        warning.setAttribute('role','alert');
        footer.append(warning);
      }
      button(footer,'Keep this draft',()=>{resetPending=false;resetError=false;render('reset');},'keep-reset');
      button(footer,'Clear Episode 04 draft',reset,'confirm-reset');
    } else {
      button(footer,'Start this draft again',()=>{resetPending=true;resetError=false;render('keep-reset');},'reset');
    }
    box.append(footer);
    root.replaceChildren(box);
    // The last permitted edit disables its control. Focus the visible alert
    // instead of silently jumping to the restart button at the page footer.
    if(atLimit && focusKey && !['reset','keep-reset','confirm-reset','retry-save'].includes(focusKey)) {
      limitWarning?.focus();
      return;
    }
    // Keep successful save recovery in view at any action count.
    if(focusKey==='retry-save' && saveStatus) {
      saveStatus.focus();
      return;
    }
    if(focusKey==='start-over') {
      heading.focus(); // Also scrolls the new draft heading into view on short screens.
      return;
    }
    // A completed inspection disables its original button. Never send keyboard
    // focus to a disabled/detached control after replacing the DOM tree.
    if(focusKey) {
      const controls=[...focusables.values()];
      const original=focusables.get(focusKey);
      let target=original && !original.disabled ? original : null;
      if(!target && original) {
        const index=controls.indexOf(original);
        for(let distance=1;distance<controls.length && !target;distance++) {
          const after=controls[index+distance],before=controls[index-distance];
          if(after && !after.disabled)target=after;
          else if(before && !before.disabled)target=before;
        }
      }
      if(!target)target=controls.find(control=>!control.disabled);
      target?.focus();
    }
  }
  render();
  return {
    ready:true,reason:null,sources:opened.sources,getState:read,reset,
    destroy:()=>{disposed=true;root.replaceChildren();}
  };
}
