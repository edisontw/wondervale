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
// Per-mount IDs avoid ambiguous screen-reader descriptions in replay/test roots.
let mountSequence=0;

function load(storage,mode) {
  if (!storage || mode!=='draft_preview') return {raw:null,present:false,problem:false,bytes:null};
  let text;
  try { text=storage.getItem(DRAFT_KEY); }
  catch { return {raw:null,present:true,problem:true,unreadable:true,bytes:null}; }
  if (text===null) return {raw:null,present:false,problem:false,bytes:null};
  if (typeof text!=='string' || text.length>MAX_SAVE_CHARS)
    return {raw:null,present:true,problem:true,bytes:typeof text==='string'?text:null};
  try { return {raw:JSON.parse(text),present:true,problem:false,bytes:text}; }
  catch { return {raw:null,present:true,problem:true,bytes:text}; }
}
function persist(storage,mode,state,expectedBytes) {
  if (!storage || mode!=='draft_preview') return {ok:true,bytes:expectedBytes};
  try {
    // Optimistic preflight: never intentionally overwrite another tab's
    // newer checkpoint or resurrect a checkpoint cleared by another tab.
    // localStorage has no atomic compare-and-swap; this is best effort.
    const previous=storage.getItem(DRAFT_KEY);
    if(previous!==expectedBytes)return {ok:false,conflict:true};
    const payload=draftPayload(state);
    if (!payload) {
      storage.removeItem(DRAFT_KEY);
      return storage.getItem(DRAFT_KEY)===null
        ? {ok:true,bytes:null} : {ok:false};
    }
    const text=JSON.stringify(payload);
    if (text.length>MAX_SAVE_CHARS) return {ok:false};
    let observed;
    try {
      storage.setItem(DRAFT_KEY,text);
      observed=storage.getItem(DRAFT_KEY);
    } catch {
      // A setter may throw after writing. Check the actual result when possible.
      try { observed=storage.getItem(DRAFT_KEY); }
      catch { return {ok:false}; }
    }
    if(observed===text)return {ok:true,bytes:text};
    if(observed!==previous) {
      try {
        // Bounded rollback of a mismatched write; not cross-tab atomic.
        if(storage.getItem(DRAFT_KEY)===observed) {
          if(previous===null)storage.removeItem(DRAFT_KEY);
          else storage.setItem(DRAFT_KEY,previous);
        }
      } catch { /* Keep the unsaved warning and in-memory draft. */ }
    }
    return {ok:false};
  } catch { return {ok:false}; } // Keep the in-memory draft playable.
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
  const mountId=++mountSequence;
  const resetPromptId='e04-reset-prompt-'+mountId;
  const resetErrorId='e04-reset-error-'+mountId;
  const checkpoint=load(storage,mode);
  let knownCheckpoint=checkpoint.bytes??null;
  let conflict=false;
  const opened=openE04Authoring(e02Save,e03Save,sources,checkpoint.raw,mode);
  let state=opened.session;
  // Restore is strict event replay: any mismatched/invalid checkpoint starts fresh.
  // Keep the old bytes untouched until a new valid action explicitly saves.
  let restoreWarning=checkpoint.problem ||
    (checkpoint.present && JSON.stringify(opened.session)!==JSON.stringify(checkpoint.raw));
  // Only a transient read failure can be retried without changing old bytes.
  // Malformed or incompatible saves still require a deliberate new action.
  let readFailure=Boolean(checkpoint.unreadable);
  // Offer a deliberate resume jump only for a valid, event-replayed local draft.
  // Fresh, corrupt and historical-replay sessions must not claim recovery.
  let resumeAvailable=mode==='draft_preview' && checkpoint.present &&
    !restoreWarning && state.history.length>0;
  let disposed=false;
  let resetPending=false;
  let resetError=false;
  let saveError=false;
  let saveRecovered=false;
  let conflictReloadPending=false;
  let conflictReadError=false;
  const read=()=>structuredClone(state);
  const unsavedInThisTab=()=>{
    const payload=draftPayload(state);
    return saveError || (payload ? JSON.stringify(payload) : null)!==knownCheckpoint;
  };
  function markConflict() {
    conflict=true;
    resetPending=false;
    saveRecovered=false;
    resumeAvailable=false;
    conflictReloadPending=false;
    conflictReadError=false;
    render('checkpoint-conflict');
  }
  // Loading another tab's checkpoint is always an explicit, read-only action.
  // If this tab has unsaved edits, require a second deliberate confirmation.
  function reviewLatestSaved() {
    if(disposed || !conflict || mode!=='draft_preview')return false;
    if(unsavedInThisTab() && !conflictReloadPending) {
      conflictReloadPending=true;
      conflictReadError=false;
      render('keep-conflict');
      return false;
    }
    const latest=load(storage,mode);
    if(latest.problem) {
      conflictReadError=true;
      render('reload-conflict');
      return false;
    }
    const reopened=openE04Authoring(e02Save,e03Save,sources,latest.raw,mode);
    if(latest.present && JSON.stringify(reopened.session)!==JSON.stringify(latest.raw)) {
      conflictReadError=true;
      render('reload-conflict');
      return false;
    }
    // No write, deletion, event dispatch or merge: the latest checkpoint
    // replaces local state only after the user's explicit decision.
    state=reopened.session;
    knownCheckpoint=latest.bytes??null;
    conflict=false;conflictReloadPending=false;conflictReadError=false;
    restoreWarning=false;readFailure=false;saveError=false;saveRecovered=false;
    resetPending=false;resetError=false;
    resumeAvailable=latest.present && state.history.length>0;
    render(resumeAvailable?'resume':'start-over');
    return true;
  }
  function changedElsewhere() {
    if(!storage || mode!=='draft_preview')return false;
    try {
      if(storage.getItem(DRAFT_KEY)===knownCheckpoint)return false;
    } catch { return false; } // Persist/reset will show the read-denial warning.
    markConflict();
    return true;
  }
  function update(action,key) {
    if(disposed || state.history.length>=MAX_ACTIONS || conflict || changedElsewhere())return;
    resetPending=false;
    const next=dispatch(state,action,sources);
    // A repeated selection is not a new action: never rewrite a saved checkpoint.
    if(next.history.length===state.history.length) { render(key); return; }
    state=next;
    readFailure=false; // Never discard new in-memory edits by reloading old storage.
    resumeAvailable=false;
    const wasSaveError=saveError;
    const result=persist(storage,mode,state,knownCheckpoint);
    if(result.conflict){saveError=true;markConflict();return;}
    saveError=!result.ok;
    if(result.ok){knownCheckpoint=result.bytes;restoreWarning=false;}
    // A later successful edit can recover an earlier failed write without Retry.
    saveRecovered=wasSaveError && !saveError;
    // On a short screen the warning sits above the cards. Announce the first
    // failure where it is visible; do not interrupt every subsequent edit.
    render(!wasSaveError && saveError ? 'save-failed' :
      saveRecovered ? 'retry-save' : key);
  }
  function retrySave() {
    if(disposed || !saveError || conflict || changedElsewhere())return false;
    const result=persist(storage,mode,state,knownCheckpoint);
    if(result.conflict){markConflict();return false;}
    saveError=!result.ok;
    saveRecovered=!saveError;
    if(result.ok){knownCheckpoint=result.bytes;restoreWarning=false;}
    render('retry-save');
    return !saveError;
  }
  function retryRead() {
    if(disposed || !readFailure || state.history.length>0 || mode!=='draft_preview')
      return false;
    const latest=load(storage,mode);
    if(latest.unreadable) {
      render('retry-read');
      return false;
    }
    readFailure=false;
    if(latest.problem) {
      restoreWarning=true;
      render('restore-warning');
      return false;
    }
    const reopened=openE04Authoring(e02Save,e03Save,sources,latest.raw,mode);
    if(latest.present && JSON.stringify(reopened.session)!==JSON.stringify(latest.raw)) {
      restoreWarning=true;
      render('restore-warning');
      return false;
    }
    // This is a read-only restore. No new history event or storage write.
    state=reopened.session;
    knownCheckpoint=latest.bytes??null;
    restoreWarning=false;
    resumeAvailable=latest.present && state.history.length>0;
    resetPending=false;resetError=false;saveError=false;saveRecovered=false;
    render(resumeAvailable?'resume':'start-over');
    return true;
  }
  function reset() {
    if(disposed || conflict || changedElsewhere())return false;
    // Do not show a fresh draft if the old checkpoint still survives on disk.
    // Otherwise reloading the page can silently resurrect a supposedly cleared draft.
    if(mode==='draft_preview' && storage) {
      try {
        // Never delete when storage cannot first confirm what is on disk.
        // A transient read failure must not turn a recoverable draft into
        // an unverified reset.
        if(storage.getItem(DRAFT_KEY)!==knownCheckpoint){markConflict();return false;}
        storage.removeItem(DRAFT_KEY);
        if(storage.getItem(DRAFT_KEY)!==null) throw new Error('Draft checkpoint still present');
        knownCheckpoint=null;
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
    readFailure=false;
    state=openE04Authoring(e02Save,e03Save,sources,null,mode).session;
    resumeAvailable=false;
    render('start-over');
    return true;
  }
  function render(focusKey=null) {
    if(disposed)return;
    const focusables=new Map();
    const cardHeadings=new Map();
    let resumeTarget=null;
    let reviewCue=null;
    let positionReviewHeading=null;
    const box=el('section','e04-authoring');
    box.setAttribute('aria-label','Episode 04 chronology authoring preview');
    const heading=el('h2','','What changed over time?');
    // Restart returns keyboard and screen-reader users to the beginning of the draft.
    if(focusKey==='start-over')heading.tabIndex=-1;
    box.append(heading);
    box.append(el('p','e04-notice','Interaction preview only. This is not a completed episode, and no canonical progress is saved.'));
    const atLimit=state.history.length>=MAX_ACTIONS && state.phase!=='completed';
    // A fully placed but unsupported timeline needs a neutral review path,
    // never an answer hint or an implicit edit to the draft.
    const needsOrderReview=!atLimit && state.phase!=='completed' &&
      sources.cards.every(card=>Object.hasOwn(state.slots,card.id)) &&
      !timelineSupported(state,sources);
    const seen=state.cardViewed.length+state.clueViewed.length+state.memoryViewed.length;
    const total=sources.cards.length+sources.clues.length+MEMORY_LABELS.length;
    const status=el('p','e04-status',`Sources inspected: ${seen} of ${total}. Stage: ${state.phase.replaceAll('_',' ')}.`);
    status.setAttribute('role','status');
    status.setAttribute('aria-live','polite');
    box.append(status);
    if(resumeAvailable) {
      const resume=el('div','e04-resume');
      resume.append(el('p','',state.phase==='completed'
        ? 'Your completed draft was restored on this device.'
        : 'Your saved draft was restored on this device. Continue where you stopped.'));
      button(resume,'Continue draft',()=>resumeTarget?.focus(),'resume');
      box.append(resume);
    }
    let limitWarning=null;
    if(atLimit) {
      const warning=el('p','e04-save-warning',
        'This preview has reached its 250-change safety limit. Your draft stays available on this page, but no more changes can be made. Start this draft again to create a new draft.');
      warning.setAttribute('role','alert');
      warning.tabIndex=-1;
      limitWarning=warning;
      box.append(warning);
    }
    let conflictAlert=null;
    if(conflict) {
      const warning=el('div','e04-save-warning');
      warning.setAttribute('role','alert');
      warning.tabIndex=-1;
      warning.append(el('p','',
        'The saved Episode 04 draft may have changed in another tab or become readable again. This tab will not overwrite or clear it. ' +
        'Any unsaved changes here are still only on this page. You can review the latest saved draft, ' +
        'but this does not merge changes from two tabs.'));
      if(conflictReadError)warning.append(el('p','',
        'The latest saved draft cannot be read or verified yet. No local work was discarded. Try again later.'));
      if(conflictReloadPending) {
        warning.append(el('p','',
          'This tab has unsaved changes. Loading the latest saved draft will discard those changes from this tab only. ' +
          'It will not change the saved checkpoint or earlier chapters.'));
        button(warning,'Keep unsaved changes on this tab',()=>{
          conflictReloadPending=false;conflictReadError=false;render('review-latest');
        },'keep-conflict');
        button(warning,'Discard unsaved changes and load latest',reviewLatestSaved,'confirm-conflict');
      } else {
        button(warning,'Review latest saved draft',reviewLatestSaved,'review-latest');
      }
      conflictAlert=warning;
      box.append(warning);
    }
    let restoreAlert=null;
    if(restoreWarning && !conflict) {
      const warning=el('p','e04-save-warning',
        'The previous Episode 04 draft could not be restored. This preview starts fresh. '+
        'The old saved data has not been deleted; continuing may replace it.');
      warning.setAttribute('role','alert');
      // Announce a rejected checkpoint before the user edits a fresh draft.
      // Focus only on initial mount, not on later rerenders or valid restores.
      warning.tabIndex=-1;
      restoreAlert=warning;
      if(readFailure && state.history.length===0)
        button(warning,'Try loading saved draft again',retryRead,'retry-read');
      box.append(warning);
    }
    let saveStatus=null;
    let saveWarning=null;
    let completionStatus=null;
    if(saveError && !conflict) {
      const warning=el('div','e04-save-warning');
      warning.setAttribute('role','alert');
      warning.tabIndex=-1;
      saveWarning=warning;
      const message=el('p','',
        'This draft is not saved on this device. Keep this page open and retry saving.');
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
      const reviewOnly=key==='review-positions' || key.startsWith('review-card:') || key.startsWith('back-to-review:');
      const conflictAction=['review-latest','keep-conflict','confirm-conflict'].includes(key);
      b.disabled=disabled || (conflict && !reviewOnly && !conflictAction) ||
        (atLimit && !['reset','keep-reset','confirm-reset','retry-save',
          'review-latest','keep-conflict','confirm-conflict'].includes(key));
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
    const sourceHeading=el('h3','','Source cards');
    sourceHeading.tabIndex=-1; // Neutral focus destination, not a suggested slot.
    evidence.append(sourceHeading);
    evidence.append(el('p','','Inspect a source before choosing where it belongs. You can change your choice.'));
    for(const card of sources.cards) {
      const cardBox=el('article','e04-card');
      const cardHeading=el('h4','',card.label);
      cardHeading.tabIndex=-1; // Neutral landing before time choices; do not suggest an answer.
      cardHeadings.set(card.id,cardHeading);
      cardBox.append(cardHeading);
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
      if(needsOrderReview) {
        const back=button(cardBox,'Back to review list',()=>positionReviewHeading?.focus(),
          'back-to-review:'+card.id);
        back.setAttribute('aria-label','Back to review list from '+card.label);
      }
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
    if(needsOrderReview) {
      const cue=el('div','e04-review-cue');
      cue.setAttribute('role','status');
      cue.tabIndex=-1;
      cue.append(el('p','','All source cards have a position, but the draft timeline still needs review. Compare the clues and your choices; no answer has been selected for you.'));
      button(cue,'Review source positions',()=>sourceHeading.focus(),'review-positions');
      decisions.append(cue);
      reviewCue=cue;
      // A bounded overview of the child's own choices, never the correct order.
      // Review links only move focus/scroll; they do not dispatch or save events.
      const overview=el('section','e04-position-review');
      overview.setAttribute('aria-label','Your draft source positions');
      positionReviewHeading=el('h4','','Your choices so far');
      positionReviewHeading.tabIndex=-1;
      overview.append(positionReviewHeading);
      overview.append(el('p','','These are your choices, not verified answers. Revisit any source to compare it with the clues.'));
      const list=el('ul','e04-position-list');
      for(const card of sources.cards) {
        const item=el('li','e04-position-item');
        const chosen=SLOTS.find(([slot])=>state.slots[card.id]===slot)?.[1];
        item.append(el('span','e04-position-label',card.label+' · '+chosen));
        const jump=button(item,'Review source',()=>cardHeadings.get(card.id)?.focus(),
          'review-card:'+card.id);
        jump.setAttribute('aria-label','Review '+card.label+' (your choice: '+chosen+')');
        list.append(item);
      }
      overview.append(list);
      decisions.append(overview);
    }
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
    if(state.phase==='completed') {
      const done=el('p','e04-status e04-completion','Draft timeline complete. This does not unlock another episode.');
      done.setAttribute('role','status');
      // The Finish button becomes disabled after completion. Announce success
      // at the decision itself instead of moving focus to the footer reset.
      done.tabIndex=-1;
      completionStatus=done;
      decisions.append(done);
    }
    box.append(decisions);
    const footer=el('footer','e04-footer');
    if(resetPending) {
      const prompt=el('p','e04-reset-warning',
        'Start again? Only this Episode 04 draft will be cleared. Earlier chapters stay saved.');
      prompt.setAttribute('id',resetPromptId);
      footer.append(prompt);
      if(resetError) {
        const warning=el('p','e04-reset-error',
          'Could not clear this draft on this device. Your work is still here. Try again.');
        warning.setAttribute('id',resetErrorId);
        warning.setAttribute('role','alert');
        footer.append(warning);
      }
      // The safe option receives focus on opening. Both choices must expose
      // the scope of deletion, including after a failed storage removal.
      const description=resetPromptId+(resetError?' '+resetErrorId:'');
      const keep=button(footer,'Keep this draft',()=>{
        resetPending=false;resetError=false;render('reset');
      },'keep-reset');
      const clear=button(footer,'Clear Episode 04 draft',reset,'confirm-reset');
      keep.setAttribute('aria-describedby',description);
      clear.setAttribute('aria-describedby',description);
    } else {
      button(footer,'Start this draft again',()=>{resetPending=true;resetError=false;render('keep-reset');},'reset');
    }
    box.append(footer);
    root.replaceChildren(box);
    if(resumeAvailable) {
      let nextKey=null;
      if(state.phase==='completed')resumeTarget=completionStatus;
      else if(atLimit)resumeTarget=limitWarning;
      else {
        const unseenMemory=MEMORY_LABELS.find(([which])=>!state.memoryViewed.includes(which));
        const unseenCard=sources.cards.find(c=>!state.cardViewed.includes(c.id));
        const unseenClue=sources.clues.find(c=>!state.clueViewed.includes(c.id));
        const unplaced=sources.cards.find(c=>!Object.hasOwn(state.slots,c.id));
        if(unseenMemory)nextKey='memory:'+unseenMemory[0];
        else if(unseenCard)nextKey='inspect:'+unseenCard.id;
        else if(unseenClue)nextKey='clue:'+unseenClue.id;
        else if(unplaced)resumeTarget=cardHeadings.get(unplaced.id);
        else if(needsOrderReview)resumeTarget=reviewCue;
        else if(state.phase==='ready_to_finish')nextKey='finish';
        else if(state.phase==='chronicle')nextKey='chronicle';
        else if(!state.explanation && timelineSupported(state,sources))nextKey='explain';
        else resumeTarget=cardHeadings.get(sources.cards[0].id);
      }
      if(nextKey)resumeTarget=focusables.get(nextKey);
    }
    if(focusKey==='checkpoint-conflict' && conflictAlert) {
      conflictAlert.focus();
      return;
    }
    if(focusKey==='reload-conflict' && conflictAlert) {
      focusables.get(conflictReloadPending?'confirm-conflict':'review-latest')?.focus();
      return;
    }
    // The last permitted edit disables its control. Focus the visible alert
    // instead of silently jumping to the restart button at the page footer.
    // When a capped draft becomes stale, the conflict confirmation must remain
    // keyboard reachable. Its safe Keep choice takes priority over the cap alert.
    if(atLimit && !conflict && focusKey && !['reset','keep-reset','confirm-reset','retry-save'].includes(focusKey)) {
      limitWarning?.focus();
      return;
    }
    if(focusKey==='restore-warning' && restoreAlert) {
      restoreAlert.focus(); // Scroll the rejected-checkpoint warning into view on short screens.
      return;
    }
    if(focusKey==='save-failed' && saveWarning) {
      saveWarning.focus(); // Visible alert before any off-screen editing controls.
      return;
    }
    // Keep successful save recovery in view at any action count.
    if(focusKey==='retry-save' && saveStatus) {
      saveStatus.focus();
      return;
    }
    if(focusKey==='finish' && completionStatus) {
      completionStatus.focus();
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
  // Cross-tab events catch even an A→B→A storage sequence that a later
  // getItem equality check alone would miss. No listener in test-only fake DOMs.
  const view=doc.defaultView;
  const onExternalStorage=event=>{
    if(disposed || mode!=='draft_preview' || !storage ||
       (event.key!==DRAFT_KEY && event.key!==null) ||
       (event.storageArea && event.storageArea!==storage))return;
    markConflict();
  };
  if(storage && view?.addEventListener)view.addEventListener('storage',onExternalStorage);
  render(restoreWarning ? 'restore-warning' : null);
  return {
    ready:true,reason:null,sources:opened.sources,getState:read,reset,
    destroy:()=>{
      disposed=true;
      if(storage && view?.removeEventListener)view.removeEventListener('storage',onExternalStorage);
      root.replaceChildren();
    }
  };
}
