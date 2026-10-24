import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fresh as fresh02,dispatch as dispatch02,payload as payload02} from '../engine/s01e02.mjs';
import {fresh as fresh03,dispatch as dispatch03,payload as payload03} from '../engine/s01e03.mjs';
import {DRAFT_KEY,MAX_ACTIONS,dispatch as dispatch04,fresh as fresh04} from '../engine/s01e04-chronology.mjs';
import {mountE04Authoring} from '../e04/authoring-ui.mjs';

// Synthetic evidence pack: test-only. No approved E04 source art or script.
const pack={
  id:'ui-fixture',revision:'test-r1',
  cards:[
    {id:'first-map',label:'First map',kind:'map'},
    {id:'later-record',label:'Later record',kind:'document'},
    {id:'undated-photo',label:'Undated photo',kind:'photo'}
  ],
  clues:[{id:'revision-note',label:'Revision note',text:'The later record mentions a revised map.'}],
  relativeOrder:{earlier:'first-map',later:'later-record',basis:'revision-note'}
};
const drain02=s=>{while(s.queue.length)s=dispatch02(s,{type:'next'});return s;};
const drain03=s=>{while(s.queue.length)s=dispatch03(s,{type:'next'});return s;};
const move03=s=>{while(s.travel.length)s=dispatch03(s,{type:'step',to:s.travel[0]});return s;};
function realE02() {
  let s=fresh02();
  const a=x=>{s=drain02(dispatch02(s,x));};
  a({type:'begin'});a({type:'go',to:'oldStones'});a({type:'inspect',what:'stones'});a({type:'close-detail'});
  a({type:'go',to:'lookoutView'});a({type:'inspect',what:'gap'});a({type:'close-detail'});
  a({type:'notebook'});a({type:'fact',choice:'gap'});a({type:'revision',choice:'A'});
  a({type:'market'});a({type:'chronicle'});a({type:'finish'});
  assert.equal(s.phase,'completed');
  return payload02(s);
}
function realE03() {
  let s=drain03(dispatch03(fresh03(),{type:'begin',ready:true}));
  const deliver=state=>drain03(dispatch03(move03(dispatch03(state,{type:'take-route',route:'L'})),{type:'deliver'}));
  s=deliver(s);s=drain03(move03(dispatch03(s,{type:'return'})));
  s=deliver(s);s=dispatch03(s,{type:'inspect',what:'S'});
  s=drain03(dispatch03(s,{type:'compare',reason:'steps'}));
  s=drain03(move03(dispatch03(s,{type:'return'})));
  s=deliver(s);s=drain03(move03(dispatch03(s,{type:'return'})));
  for(const kind of ['WALK','CART'])s=drain03(dispatch03(s,{type:'sign',kind,to:'L'}));
  s=move03(dispatch03(s,{type:'go-glyph'}));s=drain03(dispatch03(s,{type:'glyph'}));
  for(const which of ['garden','station'])s=drain03(dispatch03(s,{type:'memory',which}));
  s=drain03(dispatch03(s,{type:'chronicle'}));s=dispatch03(s,{type:'finish'});
  assert.equal(s.phase,'completed');
  return payload03(s);
}
class FakeNode {
  constructor(doc,tag='div') {
    this.ownerDocument=doc;this.tagName=tag.toUpperCase();this.children=[];
    this.dataset={};this.attributes={};this.handlers={};this.textContent='';this.disabled=false;
  }
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(...nodes){this.children=[...nodes];}
  setAttribute(name,value){this.attributes[name]=String(value);}
  addEventListener(name,fn){this.handlers[name]=fn;}
  focus(){this.ownerDocument.activeElement=this;}
  click(){if(!this.disabled)this.handlers.click?.();}
  find(key){
    if(this.dataset.focusKey===key)return this;
    for(const c of this.children){const found=c.find?.(key);if(found)return found;}
    return null;
  }
  allText(){return [this.textContent,...this.children.map(c=>c.allText())].join(' ');}
}
class FakeDocument {
  createElement(tag){return new FakeNode(this,tag);}
  root(){return this.createElement('div');}
}
class MemoryStorage {
  constructor(){this.items=new Map();}
  getItem(k){return this.items.get(k)??null;}
  setItem(k,v){this.items.set(k,String(v));}
  removeItem(k){this.items.delete(k);}
}
const tap=(root,key)=>{
  const button=root.find(key);
  assert.ok(button,'Missing keyboard/touch button: '+key);
  assert.equal(button.tagName,'BUTTON');
  assert.equal(button.disabled,false,'Button must be operable: '+key);
  button.click();
};
test('E04 DOM refuses forged/empty chapter saves without leaking evidence cards',()=>{
  const doc=new FakeDocument(),root=doc.root();
  const blocked=mountE04Authoring(root,{pack,e02Save:null,e03Save:null});
  assert.equal(blocked.ready,false);
  assert.equal(blocked.getState(),null);
  assert.equal(root.allText().includes('First map'),false);
  assert.match(root.allText(),/Finish Riverside/);
});
test('touch/keyboard buttons inspect, revise, explain, Chronicle, persist and reset draft only',()=>{
  const doc=new FakeDocument(),root=doc.root(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  storage.setItem('wondervale-s01e02-progress-v1',JSON.stringify(e02));
  storage.setItem('wondervale-s01e03-progress-v1',JSON.stringify(e03));
  const before02=storage.getItem('wondervale-s01e02-progress-v1');
  const before03=storage.getItem('wondervale-s01e03-progress-v1');
  const ui=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage});
  assert.equal(ui.ready,true);
  assert.equal(root.find('place:first-map:earlier').disabled,true);
  assert.equal(root.allText().includes('way to the station'),false);
  tap(root,'memory:station');
  assert.equal(doc.activeElement.dataset.focusKey,'memory:garden', 'keyboard focus follows completed memory inspection');
  assert.equal(root.allText().includes('way to the station'),true);
  tap(root,'memory:garden');
  assert.equal(doc.activeElement.dataset.focusKey,'inspect:first-map', 'focus advances to available source');
  assert.equal(root.allText().includes('way to the garden'),true);
  for(const id of pack.cards.map(c=>c.id))tap(root,'inspect:'+id);
  tap(root,'clue:revision-note');
  assert.equal(doc.activeElement.disabled,false, 'focus cannot remain on disabled clue');
  assert.match(doc.activeElement.dataset.focusKey,/^place:/, 'focus returns to available placements');
  tap(root,'place:first-map:later');
  assert.equal(root.find('explain').disabled,true);
  tap(root,'place:first-map:earlier');
  tap(root,'place:later-record:later');
  tap(root,'place:undated-photo:uncertain');
  assert.equal(root.find('explain').disabled,false);
  assert.equal(doc.activeElement.dataset.focusKey,'place:undated-photo:uncertain');
  tap(root,'explain');
  assert.equal(root.find('finish').disabled,true);
  tap(root,'chronicle');
  assert.equal(doc.activeElement.dataset.focusKey,'finish', 'Chronicle review transfers focus to completion');
  assert.ok(root.allText().includes('Our draft timeline'));
  assert.ok(root.allText().includes('Not sure yet: Undated photo'));
  assert.ok(root.allText().indexOf('Earlier First map')<root.allText().indexOf('Later Later record'));
  assert.equal(root.find('finish').disabled,false);
  tap(root,'place:first-map:later');
  assert.equal(root.find('finish').disabled,true);
  tap(root,'place:first-map:earlier');
  tap(root,'explain');tap(root,'chronicle');tap(root,'finish');
  assert.equal(ui.getState().phase,'completed');
  assert.match(doc.activeElement.className,/e04-completion/,
    'Finishing must focus the success status, not the reset button');
  assert.equal(doc.activeElement.attributes.role,'status');
  assert.ok(storage.getItem(DRAFT_KEY));
  assert.equal(storage.getItem('wondervale-s01e02-progress-v1'),before02);
  assert.equal(storage.getItem('wondervale-s01e03-progress-v1'),before03);
  const newRoot=doc.root();
  const resumed=mountE04Authoring(newRoot,{pack,e02Save:e02,e03Save:e03,storage});
  assert.equal(resumed.getState().phase,'completed');
  tap(newRoot,'resume');
  assert.match(doc.activeElement.className,/e04-completion/,
    'A completed restored draft resumes at its confirmation, not the reset footer');
  resumed.reset();
  assert.equal(resumed.getState().phase,'sources');
  assert.equal(storage.getItem(DRAFT_KEY),null);
  assert.equal(storage.getItem('wondervale-s01e02-progress-v1'),before02);
  assert.equal(storage.getItem('wondervale-s01e03-progress-v1'),before03);
  ui.destroy();resumed.destroy();
});
test('Restored partial drafts offer a non-mutating jump to the next unfinished action',()=>{
  const doc=new FakeDocument(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  let s=dispatch04(fresh04(pack),{type:'inspect-memory',which:'station'},pack);
  storage.setItem(DRAFT_KEY,JSON.stringify(s));
  const first=doc.root(),ui=mountE04Authoring(first,{pack,e02Save:e02,e03Save:e03,storage});
  const before=storage.getItem(DRAFT_KEY);
  tap(first,'resume');
  assert.equal(doc.activeElement.dataset.focusKey,'memory:garden');
  assert.equal(storage.getItem(DRAFT_KEY),before,'Resume must not create a new history event');
  tap(first,'memory:garden');
  assert.equal(first.find('resume'),null,'Resume shortcut disappears after the next valid edit');
  ui.destroy();

  const second=doc.root(),continued=mountE04Authoring(second,{pack,e02Save:e02,e03Save:e03,storage});
  tap(second,'resume');
  assert.equal(doc.activeElement.dataset.focusKey,'inspect:first-map');
  continued.destroy();

  for(const card of pack.cards)s=dispatch04(s,{type:'inspect-card',id:card.id},pack);
  s=dispatch04(s,{type:'inspect-memory',which:'garden'},pack);
  for(const clue of pack.clues)s=dispatch04(s,{type:'inspect-clue',id:clue.id},pack);
  storage.setItem(DRAFT_KEY,JSON.stringify(s));
  const third=doc.root(),placement=mountE04Authoring(third,{pack,e02Save:e02,e03Save:e03,storage});
  tap(third,'resume');
  assert.equal(doc.activeElement.tagName,'H4',
    'Resume must focus a neutral source heading, not preselect Earlier/Later');
  assert.equal(doc.activeElement.textContent,'First map');
  assert.equal(storage.getItem(DRAFT_KEY),JSON.stringify(s));
  placement.destroy();

  const replayRoot=doc.root();
  const replay=mountE04Authoring(replayRoot,{
    pack,e02Save:e02,e03Save:e03,storage,mode:'historical_replay'
  });
  assert.equal(replayRoot.find('resume'),null,'Historical replay never claims a restored draft');
  replay.destroy();
});

test('unsupported fully placed E04 draft offers a neutral, non-mutating review path',()=>{
  const doc=new FakeDocument(),root=doc.root(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  storage.setItem('wondervale-s01e02-progress-v1',JSON.stringify(e02));
  storage.setItem('wondervale-s01e03-progress-v1',JSON.stringify(e03));
  let state=fresh04(pack);
  for(const which of ['station','garden'])
    state=dispatch04(state,{type:'inspect-memory',which},pack);
  for(const card of pack.cards)
    state=dispatch04(state,{type:'inspect-card',id:card.id},pack);
  for(const clue of pack.clues)
    state=dispatch04(state,{type:'inspect-clue',id:clue.id},pack);
  for(const [id,slot] of [
    ['first-map','later'],['later-record','earlier'],['undated-photo','uncertain']
  ])state=dispatch04(state,{type:'place',id,slot},pack);
  assert.equal(state.phase,'timeline');
  const checkpoint=JSON.stringify(state);
  storage.setItem(DRAFT_KEY,checkpoint);
  const ui=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage});
  assert.ok(root.find('review-positions'),'All placed but unsupported must show a review action');
  assert.match(root.allText(),/draft timeline still needs review/);
  assert.equal(root.find('explain').disabled,true);
  tap(root,'resume');
  assert.match(doc.activeElement.className,/e04-review-cue/,
    'Restored unsupported timeline resumes at the neutral cue');
  assert.equal(doc.activeElement.attributes.role,'status');
  assert.match(root.allText(),/Your choices so far/);
  assert.match(root.allText(),/First map · Later/,'Overview reports the current choice');
  assert.match(root.allText(),/Later record · Earlier/);
  assert.equal(root.find('review-card:first-map').attributes['aria-label'],
    'Review First map (your choice: Later)');
  tap(root,'review-card:later-record');
  assert.equal(doc.activeElement.tagName,'H4');
  assert.equal(doc.activeElement.textContent,'Later record',
    'Per-source navigation focuses a neutral card heading, not a suggested slot');
  tap(root,'back-to-review:later-record');
  assert.equal(doc.activeElement.tagName,'H4');
  assert.equal(doc.activeElement.textContent,'Your choices so far',
    'A return shortcut avoids manual scrolling across a larger pack');
  assert.deepEqual(ui.getState(),state,'Review/return navigation cannot change history');
  assert.equal(storage.getItem(DRAFT_KEY),checkpoint,'Review/return navigation cannot save');
  tap(root,'review-positions');
  assert.equal(doc.activeElement.tagName,'H3');
  assert.equal(doc.activeElement.textContent,'Source cards',
    'Review focuses the source section, never a specific answer choice');
  assert.deepEqual(ui.getState(),state,'Review navigation cannot edit history');
  assert.equal(storage.getItem(DRAFT_KEY),checkpoint,'Review navigation cannot rewrite a save');
  tap(root,'place:first-map:earlier');
  assert.ok(root.find('review-positions'),'Cue remains until order is supported');
  tap(root,'back-to-review:first-map');
  assert.equal(doc.activeElement.textContent,'Your choices so far');
  tap(root,'review-card:later-record');
  assert.equal(doc.activeElement.textContent,'Later record');
  tap(root,'place:later-record:later');
  assert.equal(root.find('review-positions'),null,'Cue clears once timeline is supported');
  assert.equal(root.find('review-card:first-map'),null,'Resolved drafts remove review-only controls');
  assert.equal(root.find('explain').disabled,false);
  assert.equal(storage.getItem('wondervale-s01e02-progress-v1'),JSON.stringify(e02));
  assert.equal(storage.getItem('wondervale-s01e03-progress-v1'),JSON.stringify(e03));
  const resumedRoot=doc.root();
  const resumed=mountE04Authoring(resumedRoot,{pack,e02Save:e02,e03Save:e03,storage});
  assert.equal(resumedRoot.find('review-positions'),null);
  tap(resumedRoot,'resume');
  assert.equal(doc.activeElement.dataset.focusKey,'explain',
    'Supported restored timeline resumes at explanation, not the review cue');
  ui.destroy();resumed.destroy();
});

test('invalid E04 checkpoints show a recovery warning without deleting saved bytes',()=>{
  const e02=realE02(),e03=realE03();
  for(const bad of [
    '{invalid json',
    'null',
    JSON.stringify({schema:1,history:[{type:'finish'}]}),
    'x'.repeat(60001)
  ]) {
    const doc=new FakeDocument(),root=doc.root(),storage=new MemoryStorage();
    storage.setItem(DRAFT_KEY,bad);
    storage.setItem('wondervale-s01e02-progress-v1',JSON.stringify(e02));
    storage.setItem('wondervale-s01e03-progress-v1',JSON.stringify(e03));
    const old02=storage.getItem('wondervale-s01e02-progress-v1');
    const old03=storage.getItem('wondervale-s01e03-progress-v1');
    const ui=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage});
    assert.equal(ui.getState().phase,'sources');
    assert.deepEqual(ui.getState().history,[]);
    assert.match(root.allText(),/previous Episode 04 draft could not be restored/);
    assert.equal(root.find('resume'),null,'Invalid checkpoints must not show a resume shortcut');
    assert.equal(storage.getItem(DRAFT_KEY),bad,'Opening must preserve original invalid bytes');
    tap(root,'memory:station');
    assert.doesNotMatch(root.allText(),/previous Episode 04 draft could not be restored/);
    assert.notEqual(storage.getItem(DRAFT_KEY),bad,'A new valid action replaces invalid bytes');
    assert.equal(storage.getItem('wondervale-s01e02-progress-v1'),old02);
    assert.equal(storage.getItem('wondervale-s01e03-progress-v1'),old03);
    const resumedRoot=doc.root();
    const resumed=mountE04Authoring(resumedRoot,{pack,e02Save:e02,e03Save:e03,storage});
    assert.deepEqual(resumed.getState().memoryViewed,['station']);
    assert.doesNotMatch(resumedRoot.allText(),/previous Episode 04 draft could not be restored/);
    ui.destroy();resumed.destroy();
  }
});

test('Retry saving clears a corrupt-checkpoint warning only after verified recovery',()=>{
  const doc=new FakeDocument(),root=doc.root(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  const bad='{invalid json';
  storage.setItem(DRAFT_KEY,bad);
  storage.setItem('wondervale-s01e02-progress-v1',JSON.stringify(e02));
  storage.setItem('wondervale-s01e03-progress-v1',JSON.stringify(e03));
  const before02=storage.getItem('wondervale-s01e02-progress-v1');
  const before03=storage.getItem('wondervale-s01e03-progress-v1');
  const originalSet=storage.setItem.bind(storage);
  storage.setItem=()=>{throw new Error('Storage temporarily blocked');};
  const ui=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage});
  assert.match(root.allText(),/previous Episode 04 draft could not be restored/);
  tap(root,'memory:station');
  assert.equal(storage.getItem(DRAFT_KEY),bad);
  assert.match(root.allText(),/previous Episode 04 draft could not be restored/);
  assert.match(root.allText(),/This draft is not saved on this device/);
  tap(root,'retry-save');
  assert.equal(storage.getItem(DRAFT_KEY),bad);
  assert.match(root.allText(),/previous Episode 04 draft could not be restored/);
  storage.setItem=originalSet;
  const before=ui.getState();
  tap(root,'retry-save');
  assert.deepEqual(ui.getState(),before,'Retry must not change story state');
  assert.doesNotMatch(root.allText(),/previous Episode 04 draft could not be restored/);
  assert.doesNotMatch(root.allText(),/This draft is not saved on this device/);
  assert.match(root.allText(),/Draft saved on this device/);
  assert.notEqual(storage.getItem(DRAFT_KEY),bad);
  assert.equal(storage.getItem('wondervale-s01e02-progress-v1'),before02);
  assert.equal(storage.getItem('wondervale-s01e03-progress-v1'),before03);
  const resumed=mountE04Authoring(doc.root(),{pack,e02Save:e02,e03Save:e03,storage});
  assert.deepEqual(resumed.getState(),before);
  ui.destroy();resumed.destroy();
});

test('multiple timeline revisions survive a failed save, later recovery and remount without changing E02/E03',()=>{
  const doc=new FakeDocument(),root=doc.root(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  storage.setItem('wondervale-s01e02-progress-v1',JSON.stringify(e02));
  storage.setItem('wondervale-s01e03-progress-v1',JSON.stringify(e03));
  let state=fresh04(pack);
  for(const which of ['station','garden'])
    state=dispatch04(state,{type:'inspect-memory',which},pack);
  for(const card of pack.cards)
    state=dispatch04(state,{type:'inspect-card',id:card.id},pack);
  for(const clue of pack.clues)
    state=dispatch04(state,{type:'inspect-clue',id:clue.id},pack);
  for(const [id,slot] of [
    ['first-map','later'],['later-record','earlier'],['undated-photo','uncertain']
  ])state=dispatch04(state,{type:'place',id,slot},pack);
  storage.setItem(DRAFT_KEY,JSON.stringify(state));
  const checkpoint=storage.getItem(DRAFT_KEY);
  const originalSet=storage.setItem.bind(storage);
  let blocked=true;
  storage.setItem=(key,value)=>{
    if(key===DRAFT_KEY && blocked)throw new Error('Simulated storage quota');
    originalSet(key,value);
  };
  const ui=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage});
  tap(root,'place:first-map:earlier');
  assert.equal(doc.activeElement.attributes.role,'alert',
    'First failed save must focus a visible warning, not an off-screen source');
  assert.match(doc.activeElement.allText(),/not saved on this device/);
  assert.equal(storage.getItem(DRAFT_KEY),checkpoint);
  tap(root,'retry-save');
  assert.equal(doc.activeElement.dataset.focusKey,'retry-save',
    'Failed retry remains keyboard-accessible');
  tap(root,'place:first-map:later');
  assert.equal(doc.activeElement.dataset.focusKey,'place:first-map:later',
    'Repeated failure does not interrupt every later source edit');
  assert.equal(storage.getItem(DRAFT_KEY),checkpoint);
  blocked=false;
  tap(root,'place:first-map:earlier');
  assert.match(doc.activeElement.className,/e04-save-success/,
    'Successful later edit must announce that the unsaved draft was recovered');
  assert.equal(doc.activeElement.attributes.role,'status');
  const saved=ui.getState(),savedBytes=storage.getItem(DRAFT_KEY);
  assert.deepEqual(JSON.parse(savedBytes),saved);
  assert.equal(saved.history.length,state.history.length+3);
  assert.equal(root.find('retry-save'),null);
  ui.destroy();
  const restoredRoot=doc.root();
  const restored=mountE04Authoring(restoredRoot,{pack,e02Save:e02,e03Save:e03,storage});
  assert.deepEqual(restored.getState(),saved,'Remount must recover all three revisions');
  tap(restoredRoot,'resume');
  assert.match(doc.activeElement.className,/e04-review-cue/);
  blocked=true;
  tap(restoredRoot,'place:later-record:later');
  assert.equal(storage.getItem(DRAFT_KEY),savedBytes,'Failed write must preserve last valid checkpoint');
  restored.destroy();
  const afterReload=mountE04Authoring(doc.root(),{pack,e02Save:e02,e03Save:e03,storage});
  assert.deepEqual(afterReload.getState(),saved,
    'Reload after failed write must restore last saved state, never claim unsaved edit');
  assert.equal(storage.getItem('wondervale-s01e02-progress-v1'),JSON.stringify(e02));
  assert.equal(storage.getItem('wondervale-s01e03-progress-v1'),JSON.stringify(e03));
  afterReload.destroy();
});

test('reset confirmation describes scope and failed deletion without changing other saves',()=>{
  const doc=new FakeDocument(),root=doc.root(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  storage.setItem('wondervale-s01e02-progress-v1',JSON.stringify(e02));
  storage.setItem('wondervale-s01e03-progress-v1',JSON.stringify(e03));
  const ui=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage});
  tap(root,'memory:station');
  const saved=storage.getItem(DRAFT_KEY);
  tap(root,'reset');
  assert.equal(doc.activeElement.dataset.focusKey,'keep-reset');
  const scopeId=root.find('keep-reset').attributes['aria-describedby'];
  assert.match(scopeId,/^e04-reset-prompt-[0-9]+$/);
  assert.equal(root.find('confirm-reset').attributes['aria-describedby'],scopeId);
  assert.match(root.allText(),/Earlier chapters stay saved/);
  tap(root,'keep-reset');
  assert.equal(doc.activeElement.dataset.focusKey,'reset');
  assert.equal(storage.getItem(DRAFT_KEY),saved);
  tap(root,'reset');
  const remove=storage.removeItem.bind(storage);
  storage.removeItem=k=>{if(k===DRAFT_KEY)throw Error('Simulated storage failure');remove(k);};
  tap(root,'confirm-reset');
  assert.equal(doc.activeElement.dataset.focusKey,'confirm-reset');
  assert.match(root.allText(),/Could not clear this draft/);
  assert.equal(root.find('confirm-reset').attributes['aria-describedby'],
    scopeId+' e04-reset-error-'+scopeId.split('-').at(-1));
  assert.equal(root.find('keep-reset').attributes['aria-describedby'],
    root.find('confirm-reset').attributes['aria-describedby']);
  assert.equal(storage.getItem(DRAFT_KEY),saved);
  assert.deepEqual(ui.getState().memoryViewed,['station']);
  storage.removeItem=remove;
  tap(root,'confirm-reset');
  assert.equal(storage.getItem(DRAFT_KEY),null);
  assert.deepEqual(ui.getState().history,[]);
  assert.equal(storage.getItem('wondervale-s01e02-progress-v1'),JSON.stringify(e02));
  assert.equal(storage.getItem('wondervale-s01e03-progress-v1'),JSON.stringify(e03));
  ui.destroy();
});

test('unreadable storage warns and never overwrites a newly readable checkpoint',()=>{
  const doc=new FakeDocument(),storage=new MemoryStorage(),e02=realE02(),e03=realE03();
  const freshRoot=doc.root();
  const clean=mountE04Authoring(freshRoot,{pack,e02Save:e02,e03Save:e03,storage});
  assert.doesNotMatch(freshRoot.allText(),/could not be restored/);
  tap(freshRoot,'memory:station');
  const saved=storage.getItem(DRAFT_KEY);
  clean.destroy();
  const validRoot=doc.root();
  const valid=mountE04Authoring(validRoot,{pack,e02Save:e02,e03Save:e03,storage});
  assert.deepEqual(valid.getState().memoryViewed,['station']);
  assert.doesNotMatch(validRoot.allText(),/could not be restored/);
  valid.destroy();
  const originalGet=storage.getItem.bind(storage);
  let failRead=true;
  storage.getItem=k=>{
    if(k===DRAFT_KEY && failRead)throw new Error('Storage read denied');
    return originalGet(k);
  };
  const root=doc.root();
  const unreadable=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage});
  assert.match(root.allText(),/previous Episode 04 draft could not be restored/);
  assert.deepEqual(unreadable.getState().history,[]);
  failRead=false;
  assert.equal(storage.getItem(DRAFT_KEY),saved);
  tap(root,'memory:garden');
  assert.match(root.allText(),/changed in another tab or become readable again/);
  assert.deepEqual(unreadable.getState().history,[],
    'A newly readable checkpoint must be reloaded, not overwritten');
  assert.equal(storage.getItem(DRAFT_KEY),saved);
  unreadable.destroy();
});


test('unreadable E04 checkpoint can be retried without writing or losing the previous draft',()=>{
  const doc=new FakeDocument(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  storage.setItem('wondervale-s01e02-progress-v1',JSON.stringify(e02));
  storage.setItem('wondervale-s01e03-progress-v1',JSON.stringify(e03));
  const earlier=[storage.getItem('wondervale-s01e02-progress-v1'),
    storage.getItem('wondervale-s01e03-progress-v1')];
  const saved=dispatch04(fresh04(pack),{type:'inspect-memory',which:'station'},pack);
  const checkpoint=JSON.stringify(saved);
  storage.setItem(DRAFT_KEY,checkpoint);
  const get=storage.getItem.bind(storage),set=storage.setItem.bind(storage);
  let readBlocked=true,writes=0;
  storage.getItem=k=>{
    if(k===DRAFT_KEY && readBlocked)throw new Error('Temporary storage read denied');
    return get(k);
  };
  storage.setItem=(k,v)=>{if(k===DRAFT_KEY)writes++;set(k,v);};
  const root=doc.root();
  const ui=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage});
  assert.deepEqual(ui.getState().history,[]);
  assert.match(root.allText(),/previous Episode 04 draft could not be restored/);
  assert.ok(root.find('retry-read'),'A transient read failure offers a read-only retry');
  assert.equal(root.find('resume'),null);
  tap(root,'retry-read');
  assert.equal(doc.activeElement.dataset.focusKey,'retry-read',
    'Repeated read failure keeps the retry keyboard-accessible');
  assert.deepEqual(ui.getState().history,[]);
  assert.equal(writes,0);
  readBlocked=false;
  tap(root,'retry-read');
  assert.deepEqual(ui.getState(),saved,'Retry must restore the event-replayed checkpoint');
  assert.equal(doc.activeElement.dataset.focusKey,'resume',
    'Successful recovery offers the deliberate Continue draft action');
  assert.equal(root.find('retry-read'),null);
  assert.doesNotMatch(root.allText(),/could not be restored/);
  assert.equal(storage.getItem(DRAFT_KEY),checkpoint);
  assert.equal(writes,0,'Reading a draft must not rewrite it');
  tap(root,'resume');
  assert.equal(doc.activeElement.dataset.focusKey,'memory:garden');
  assert.deepEqual([get('wondervale-s01e02-progress-v1'),
    get('wondervale-s01e03-progress-v1')],earlier);
  ui.destroy();
});

test('unreadable E04 checkpoint prevents writes and retry-save cannot overwrite newly readable bytes',()=>{
  const doc=new FakeDocument(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  const saved=dispatch04(fresh04(pack),{type:'inspect-memory',which:'station'},pack);
  const checkpoint=JSON.stringify(saved);
  storage.setItem(DRAFT_KEY,checkpoint);
  storage.setItem('wondervale-s01e02-progress-v1',JSON.stringify(e02));
  storage.setItem('wondervale-s01e03-progress-v1',JSON.stringify(e03));
  const get=storage.getItem.bind(storage),set=storage.setItem.bind(storage);
  let readBlocked=true,writes=0;
  storage.getItem=k=>{
    if(k===DRAFT_KEY && readBlocked)throw new Error('Storage read denied');
    return get(k);
  };
  storage.setItem=(k,v)=>{if(k===DRAFT_KEY)writes++;set(k,v);};
  const root=doc.root(),ui=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage});
  tap(root,'memory:garden');
  assert.deepEqual(ui.getState().memoryViewed,['garden']);
  assert.equal(root.find('retry-read'),null,
    'Do not offer a reload that would discard unsaved edits');
  assert.match(root.allText(),/This draft is not saved on this device/);
  assert.equal(writes,0,'Failed read preflight must prevent destructive writes');
  assert.equal(storage.items.get(DRAFT_KEY),checkpoint);
  readBlocked=false;
  tap(root,'retry-save');
  assert.deepEqual(ui.getState().memoryViewed,['garden'],
    'Unsaved in-memory edit remains visible without discarding it');
  assert.equal(storage.getItem(DRAFT_KEY),checkpoint,
    'A previously unreadable checkpoint cannot be overwritten without a new mount');
  assert.equal(writes,0);
  assert.match(root.allText(),/changed in another tab or become readable again/);
  assert.deepEqual([get('wondervale-s01e02-progress-v1'),
    get('wondervale-s01e03-progress-v1')],[JSON.stringify(e02),JSON.stringify(e03)]);
  ui.destroy();
});

test('retrying a newly readable but corrupt E04 checkpoint never silently accepts it',()=>{
  const doc=new FakeDocument(),storage=new MemoryStorage();
  const corrupt='{broken json';
  storage.setItem(DRAFT_KEY,corrupt);
  const get=storage.getItem.bind(storage);
  let blocked=true;
  storage.getItem=k=>{
    if(k===DRAFT_KEY && blocked)throw new Error('Read denied');
    return get(k);
  };
  const root=doc.root(),ui=mountE04Authoring(root,{
    pack,e02Save:realE02(),e03Save:realE03(),storage
  });
  assert.ok(root.find('retry-read'));
  blocked=false;
  tap(root,'retry-read');
  assert.deepEqual(ui.getState().history,[]);
  assert.equal(root.find('resume'),null);
  assert.equal(root.find('retry-read'),null);
  assert.equal(doc.activeElement.attributes.role,'alert');
  assert.match(root.allText(),/previous Episode 04 draft could not be restored/);
  assert.equal(get(DRAFT_KEY),corrupt);
  ui.destroy();
});

test('source-pack revision change warns and preserves prior draft until a new valid save',()=>{
  const doc=new FakeDocument(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  storage.setItem('wondervale-s01e02-progress-v1',JSON.stringify(e02));
  storage.setItem('wondervale-s01e03-progress-v1',JSON.stringify(e03));
  const before02=storage.getItem('wondervale-s01e02-progress-v1');
  const before03=storage.getItem('wondervale-s01e03-progress-v1');
  const originalRoot=doc.root();
  const original=mountE04Authoring(originalRoot,{pack,e02Save:e02,e03Save:e03,storage});
  tap(originalRoot,'memory:station');
  const oldCheckpoint=storage.getItem(DRAFT_KEY);
  assert.ok(oldCheckpoint);
  original.destroy();

  const revisedPack={...pack,revision:'test-r2'};
  const root=doc.root();
  const revised=mountE04Authoring(root,{pack:revisedPack,e02Save:e02,e03Save:e03,storage});
  assert.equal(revised.ready,true);
  assert.deepEqual(revised.getState().history,[],'Old source revision cannot replay into a new pack');
  assert.match(root.allText(),/previous Episode 04 draft could not be restored/);
  assert.equal(storage.getItem(DRAFT_KEY),oldCheckpoint,'Opening must not erase old source-pack draft');
  tap(root,'memory:garden');
  assert.doesNotMatch(root.allText(),/previous Episode 04 draft could not be restored/);
  assert.notEqual(storage.getItem(DRAFT_KEY),oldCheckpoint);
  const resumed=mountE04Authoring(doc.root(),{pack:revisedPack,e02Save:e02,e03Save:e03,storage});
  assert.deepEqual(resumed.getState().memoryViewed,['garden']);
  assert.equal(storage.getItem('wondervale-s01e02-progress-v1'),before02);
  assert.equal(storage.getItem('wondervale-s01e03-progress-v1'),before03);
  revised.destroy();resumed.destroy();
});

test('same-revision evidence edits invalidate stale E04 drafts without changing earlier saves',()=>{
  const doc=new FakeDocument(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  storage.setItem('wondervale-s01e02-progress-v1',JSON.stringify(e02));
  storage.setItem('wondervale-s01e03-progress-v1',JSON.stringify(e03));
  const before02=storage.getItem('wondervale-s01e02-progress-v1');
  const before03=storage.getItem('wondervale-s01e03-progress-v1');
  const originalRoot=doc.root();
  const original=mountE04Authoring(originalRoot,{pack,e02Save:e02,e03Save:e03,storage});
  tap(originalRoot,'memory:station');
  const oldCheckpoint=storage.getItem(DRAFT_KEY);
  original.destroy();

  // Even an accidental content edit without a revision bump must not replay
  // an old draft against changed source evidence.
  const changedPack={...pack,clues:pack.clues.map(clue=>({
    ...clue,text:clue.text+' [synthetic edit]'
  }))};
  assert.equal(changedPack.revision,pack.revision);
  const root=doc.root();
  const revised=mountE04Authoring(root,{pack:changedPack,e02Save:e02,e03Save:e03,storage});
  assert.deepEqual(revised.getState().history,[]);
  assert.match(root.allText(),/previous Episode 04 draft could not be restored/);
  assert.equal(storage.getItem(DRAFT_KEY),oldCheckpoint,'Do not erase a stale checkpoint on load');
  tap(root,'memory:garden');
  assert.doesNotMatch(root.allText(),/previous Episode 04 draft could not be restored/);
  assert.notEqual(storage.getItem(DRAFT_KEY),oldCheckpoint);
  const resumed=mountE04Authoring(doc.root(),{pack:changedPack,e02Save:e02,e03Save:e03,storage});
  assert.deepEqual(resumed.getState().memoryViewed,['garden']);
  assert.equal(storage.getItem('wondervale-s01e02-progress-v1'),before02);
  assert.equal(storage.getItem('wondervale-s01e03-progress-v1'),before03);
  revised.destroy();resumed.destroy();
});

test('historical replay does not read or overwrite draft checkpoint',()=>{
  const doc=new FakeDocument(),root=doc.root(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  storage.setItem(DRAFT_KEY,'invalid-not-json');
  const replay=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage,mode:'historical_replay'});
  assert.equal(replay.ready,true);
  tap(root,'memory:station');
  assert.equal(replay.getState().mode,'historical_replay');
  assert.equal(storage.getItem(DRAFT_KEY),'invalid-not-json');
  replay.reset();
  assert.equal(storage.getItem(DRAFT_KEY),'invalid-not-json');
});


test('restart confirmation is cancellable and clears only E04 draft',()=>{
  const doc=new FakeDocument(),root=doc.root(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  storage.setItem('wondervale-s01e02-progress-v1',JSON.stringify(e02));
  storage.setItem('wondervale-s01e03-progress-v1',JSON.stringify(e03));
  const before02=storage.getItem('wondervale-s01e02-progress-v1');
  const before03=storage.getItem('wondervale-s01e03-progress-v1');
  const ui=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage});
  tap(root,'memory:station');
  const checkpoint=storage.getItem(DRAFT_KEY);
  assert.ok(checkpoint);
  tap(root,'reset');
  assert.match(root.allText(),/Only this Episode 04 draft/);
  assert.equal(storage.getItem(DRAFT_KEY),checkpoint);
  tap(root,'keep-reset');
  assert.equal(storage.getItem(DRAFT_KEY),checkpoint);
  assert.deepEqual(ui.getState().memoryViewed,['station']);
  tap(root,'reset');
  tap(root,'confirm-reset');
  assert.equal(storage.getItem(DRAFT_KEY),null);
  assert.deepEqual(ui.getState().memoryViewed,[]);
  assert.equal(ui.getState().phase,'sources');
  assert.equal(storage.getItem('wondervale-s01e02-progress-v1'),before02);
  assert.equal(storage.getItem('wondervale-s01e03-progress-v1'),before03);
});

test('failed checkpoint deletion retains draft, reports error and permits retry',()=>{
  const doc=new FakeDocument(),root=doc.root(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  const ui=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage});
  tap(root,'memory:station');
  const checkpoint=storage.getItem(DRAFT_KEY);
  const originalRemove=storage.removeItem.bind(storage);
  storage.removeItem=()=>{throw new Error('Storage denied');};
  tap(root,'reset');
  tap(root,'confirm-reset');
  assert.equal(storage.getItem(DRAFT_KEY),checkpoint);
  assert.deepEqual(ui.getState().memoryViewed,['station']);
  assert.match(root.allText(),/Could not clear this draft/);
  assert.equal(root.find('confirm-reset').disabled,false);
  storage.removeItem=()=>{};
  tap(root,'confirm-reset');
  assert.equal(storage.getItem(DRAFT_KEY),checkpoint);
  assert.deepEqual(ui.getState().memoryViewed,['station']);
  assert.match(root.allText(),/Could not clear this draft/);
  storage.removeItem=originalRemove;
  tap(root,'confirm-reset');
  assert.equal(storage.getItem(DRAFT_KEY),null);
  assert.deepEqual(ui.getState().memoryViewed,[]);
  assert.equal(ui.getState().phase,'sources');
});

test('failed draft writes are reported and recover after a later action',()=>{
  for(const failure of ['throw','silent']) {
    const doc=new FakeDocument(),root=doc.root(),storage=new MemoryStorage();
    const e02=realE02(),e03=realE03();
    const originalSet=storage.setItem.bind(storage);
    storage.setItem=failure==='throw'
      ? ()=>{throw new Error('Quota exceeded');}
      : ()=>{};
    const ui=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage});
    tap(root,'memory:station');
    assert.deepEqual(ui.getState().memoryViewed,['station']);
    assert.equal(storage.getItem(DRAFT_KEY),null,'Failed write must not claim a checkpoint');
    assert.match(root.allText(),/This draft is not saved on this device/);
    storage.setItem=originalSet;
    tap(root,'memory:garden');
    assert.ok(storage.getItem(DRAFT_KEY),'Later action retries the complete draft');
    assert.doesNotMatch(root.allText(),/This draft is not saved on this device/);
    const resumed=mountE04Authoring(doc.root(),{pack,e02Save:e02,e03Save:e03,storage});
    assert.deepEqual(resumed.getState().memoryViewed,['station','garden']);
    ui.destroy();resumed.destroy();
  }
});

test('failed overwrite warns instead of presenting an old checkpoint as current',()=>{
  const doc=new FakeDocument(),root=doc.root(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  const ui=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage});
  tap(root,'memory:station');
  const prior=storage.getItem(DRAFT_KEY);
  assert.ok(prior);
  const originalSet=storage.setItem.bind(storage);
  storage.setItem=()=>{throw new Error('Storage blocked');};
  tap(root,'memory:garden');
  assert.deepEqual(ui.getState().memoryViewed,['station','garden']);
  assert.equal(storage.getItem(DRAFT_KEY),prior,'Old checkpoint must not be mistaken for the latest state');
  assert.match(root.allText(),/This draft is not saved on this device/);
  storage.setItem=originalSet;
  tap(root,'inspect:first-map');
  assert.notEqual(storage.getItem(DRAFT_KEY),prior);
  assert.doesNotMatch(root.allText(),/This draft is not saved on this device/);
  const resumed=mountE04Authoring(doc.root(),{pack,e02Save:e02,e03Save:e03,storage});
  assert.deepEqual(resumed.getState().memoryViewed,['station','garden']);
  assert.ok(resumed.getState().cardViewed.includes('first-map'));
  ui.destroy();resumed.destroy();
});

test('mismatched write readback rolls back the last checkpoint and Retry persists the current draft',()=>{
  const doc=new FakeDocument(),root=doc.root(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  storage.setItem('wondervale-s01e02-progress-v1',JSON.stringify(e02));
  storage.setItem('wondervale-s01e03-progress-v1',JSON.stringify(e03));
  const before02=storage.getItem('wondervale-s01e02-progress-v1');
  const before03=storage.getItem('wondervale-s01e03-progress-v1');
  const ui=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage});
  tap(root,'memory:station');
  const prior=storage.getItem(DRAFT_KEY);
  const originalSet=storage.setItem.bind(storage);
  let corruptOnce=true;
  storage.setItem=(key,value)=>{
    if(key===DRAFT_KEY && corruptOnce) {
      corruptOnce=false;
      return originalSet(key,'{"broken":true}');
    }
    return originalSet(key,value);
  };
  tap(root,'memory:garden');
  assert.deepEqual(ui.getState().memoryViewed,['station','garden']);
  assert.equal(storage.getItem(DRAFT_KEY),prior,
    'A mismatched readback must not discard the last verified checkpoint');
  assert.match(root.allText(),/This draft is not saved on this device/);
  const oldMount=mountE04Authoring(doc.root(),{pack,e02Save:e02,e03Save:e03,storage});
  assert.deepEqual(oldMount.getState().memoryViewed,['station'],
    'Reload before retry must recover the last verified checkpoint only');
  oldMount.destroy();
  tap(root,'retry-save');
  assert.equal(storage.getItem(DRAFT_KEY),JSON.stringify(ui.getState()));
  assert.doesNotMatch(root.allText(),/This draft is not saved on this device/);
  assert.equal(storage.getItem('wondervale-s01e02-progress-v1'),before02);
  assert.equal(storage.getItem('wondervale-s01e03-progress-v1'),before03);
  ui.destroy();
});

test('reset refuses to remove a checkpoint while storage reads are failing',()=>{
  const doc=new FakeDocument(),root=doc.root(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  storage.setItem('wondervale-s01e02-progress-v1',JSON.stringify(e02));
  storage.setItem('wondervale-s01e03-progress-v1',JSON.stringify(e03));
  const before02=storage.getItem('wondervale-s01e02-progress-v1');
  const before03=storage.getItem('wondervale-s01e03-progress-v1');
  const ui=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage});
  tap(root,'memory:station');
  const prior=storage.getItem(DRAFT_KEY);
  const originalGet=storage.getItem.bind(storage);
  const originalRemove=storage.removeItem.bind(storage);
  let removes=0;
  storage.getItem=key=>{
    if(key===DRAFT_KEY)throw new Error('Transient read denial');
    return originalGet(key);
  };
  storage.removeItem=key=>{removes++;originalRemove(key);};
  tap(root,'reset');tap(root,'confirm-reset');
  assert.equal(removes,0,'Unreadable storage must never trigger deletion');
  assert.equal(storage.items.get(DRAFT_KEY),prior);
  assert.deepEqual(ui.getState().memoryViewed,['station']);
  assert.match(root.allText(),/Could not clear this draft/);
  storage.getItem=originalGet;
  tap(root,'confirm-reset');
  assert.equal(removes,1);
  assert.equal(storage.getItem(DRAFT_KEY),null);
  assert.deepEqual(ui.getState().memoryViewed,[]);
  assert.equal(storage.getItem('wondervale-s01e02-progress-v1'),before02);
  assert.equal(storage.getItem('wondervale-s01e03-progress-v1'),before03);
  ui.destroy();
});

test('reselecting the same slot never rewrites storage or invents a save failure',()=>{
  const doc=new FakeDocument(),root=doc.root(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  const ui=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage});
  tap(root,'inspect:first-map');
  tap(root,'place:first-map:earlier');
  const saved=storage.getItem(DRAFT_KEY),before=ui.getState();
  assert.ok(saved);
  const originalSet=storage.setItem.bind(storage);
  let attempts=0;
  storage.setItem=()=>{attempts++;throw new Error('Storage denied');};
  tap(root,'place:first-map:earlier'); // Already selected; no new action.
  assert.deepEqual(ui.getState(),before);
  assert.equal(attempts,0,'A no-op must not attempt another checkpoint write');
  assert.equal(storage.getItem(DRAFT_KEY),saved);
  assert.doesNotMatch(root.allText(),/This draft is not saved on this device/);
  assert.equal(root.find('retry-save'),null);
  tap(root,'place:first-map:later'); // Real edit: write failure must still warn.
  assert.equal(attempts,1);
  assert.match(root.allText(),/This draft is not saved on this device/);
  const unsaved=ui.getState();
  tap(root,'place:first-map:later'); // Repeated choice cannot mask the failure.
  assert.equal(attempts,1);
  assert.deepEqual(ui.getState(),unsaved);
  assert.match(root.allText(),/This draft is not saved on this device/);
  storage.setItem=originalSet;
  tap(root,'retry-save');
  assert.deepEqual(ui.getState(),unsaved);
  assert.equal(storage.getItem(DRAFT_KEY),JSON.stringify(unsaved));
  assert.doesNotMatch(root.allText(),/This draft is not saved on this device/);
  ui.destroy();
});

test('Retry saving persists the same in-memory draft without changing story progress',()=>{
  const doc=new FakeDocument(),root=doc.root(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  const originalSet=storage.setItem.bind(storage);
  storage.setItem=()=>{}; // Silent write failure.
  const ui=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage});
  tap(root,'memory:station');
  const before=ui.getState();
  assert.equal(storage.getItem(DRAFT_KEY),null);
  assert.match(root.allText(),/This draft is not saved on this device/);
  assert.equal(root.find('retry-save').disabled,false);
  storage.setItem=originalSet;
  tap(root,'retry-save');
  assert.deepEqual(ui.getState(),before,'Retry must not dispatch a story action');
  assert.ok(storage.getItem(DRAFT_KEY),'Retry should persist the complete draft');
  assert.equal(root.find('retry-save'),null,'Retry control disappears after success');
  assert.equal(doc.activeElement?.attributes.role,'status',
    'Successful retry focuses the confirmation instead of jumping to an unrelated button');
  assert.match(doc.activeElement.textContent,/Draft saved on this device/);
  assert.equal(doc.activeElement.tabIndex,-1);
  assert.match(root.allText(),/Draft saved on this device/);
  const resumed=mountE04Authoring(doc.root(),{pack,e02Save:e02,e03Save:e03,storage});
  assert.deepEqual(resumed.getState(),before);
  ui.destroy();resumed.destroy();
});

test('Retry saving remains available after repeated storage failures',()=>{
  const doc=new FakeDocument(),root=doc.root(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  const originalSet=storage.setItem.bind(storage);
  storage.setItem=()=>{throw new Error('Quota exceeded');};
  const ui=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage});
  tap(root,'memory:station');
  const before=ui.getState();
  tap(root,'retry-save');
  assert.deepEqual(ui.getState(),before);
  assert.match(root.allText(),/This draft is not saved on this device/);
  assert.equal(root.find('retry-save').disabled,false);
  assert.equal(doc.activeElement.dataset.focusKey,'retry-save');
  storage.setItem=originalSet;
  tap(root,'retry-save');
  assert.deepEqual(ui.getState(),before);
  assert.ok(storage.getItem(DRAFT_KEY));
  assert.doesNotMatch(root.allText(),/This draft is not saved on this device/);
  ui.destroy();
});


test('250-action safety cap explains the limit, preserves draft, and allows a scoped restart',()=>{
  const doc=new FakeDocument(),root=doc.root(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  storage.setItem('wondervale-s01e02-progress-v1',JSON.stringify(e02));
  storage.setItem('wondervale-s01e03-progress-v1',JSON.stringify(e03));
  const before02=storage.getItem('wondervale-s01e02-progress-v1');
  const before03=storage.getItem('wondervale-s01e03-progress-v1');
  let state=dispatch04(fresh04(pack),{type:'inspect-card',id:'first-map'},pack);
  for(let i=1;i<MAX_ACTIONS-1;i++)
    state=dispatch04(state,{type:'place',id:'first-map',slot:i%2?'earlier':'later'},pack);
  assert.equal(state.history.length,MAX_ACTIONS-1);
  storage.setItem(DRAFT_KEY,JSON.stringify(state));
  const ui=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage});
  assert.equal(root.find('place:first-map:earlier').disabled,false);
  assert.doesNotMatch(root.allText(),/250-change safety limit/);
  tap(root,'place:first-map:earlier');
  assert.equal(ui.getState().history.length,MAX_ACTIONS);
  assert.match(root.allText(),/250-change safety limit/);
  assert.equal(doc.activeElement.tagName,'P','The 250th edit focuses the limit alert');
  assert.equal(doc.activeElement.attributes.role,'alert');
  assert.match(doc.activeElement.textContent,/250-change safety limit/);
  const cappedSave=storage.getItem(DRAFT_KEY);
  for(const key of ['memory:station','inspect:later-record','place:first-map:later','clue:revision-note','explain','chronicle','finish'])
    assert.equal(root.find(key).disabled,true,'At cap, action is disabled: '+key);
  root.find('place:first-map:later').click();
  assert.equal(storage.getItem(DRAFT_KEY),cappedSave);
  ui.destroy();
  const resumedRoot=doc.root();
  const resumed=mountE04Authoring(resumedRoot,{pack,e02Save:e02,e03Save:e03,storage});
  assert.equal(resumed.getState().history.length,MAX_ACTIONS);
  assert.match(resumedRoot.allText(),/250-change safety limit/);
  tap(resumedRoot,'reset');
  tap(resumedRoot,'confirm-reset');
  assert.equal(resumed.getState().history.length,0);
  assert.equal(storage.getItem(DRAFT_KEY),null);
  assert.doesNotMatch(resumedRoot.allText(),/250-change safety limit/);
  assert.equal(resumedRoot.find('memory:station').disabled,false);
  assert.equal(storage.getItem('wondervale-s01e02-progress-v1'),before02);
  assert.equal(storage.getItem('wondervale-s01e03-progress-v1'),before03);
  resumed.destroy();
});

test('the 250th action can retry a failed save without changing the capped draft',()=>{
  const doc=new FakeDocument(),root=doc.root(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  let state=dispatch04(fresh04(pack),{type:'inspect-card',id:'first-map'},pack);
  for(let i=1;i<MAX_ACTIONS-1;i++)
    state=dispatch04(state,{type:'place',id:'first-map',slot:i%2?'earlier':'later'},pack);
  const oldCheckpoint=JSON.stringify(state);
  storage.setItem(DRAFT_KEY,oldCheckpoint);
  const ui=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage});
  const originalSet=storage.setItem.bind(storage);
  storage.setItem=()=>{throw new Error('Storage denied');};
  tap(root,'place:first-map:earlier');
  assert.equal(ui.getState().history.length,MAX_ACTIONS);
  assert.equal(storage.getItem(DRAFT_KEY),oldCheckpoint);
  assert.match(root.allText(),/250-change safety limit/);
  assert.match(root.allText(),/This draft is not saved on this device/);
  assert.equal(root.find('retry-save').disabled,false);
  tap(root,'retry-save');
  assert.equal(doc.activeElement.dataset.focusKey,'retry-save',
    'Repeated failure keeps Retry saving focused and usable');
  assert.equal(storage.getItem(DRAFT_KEY),oldCheckpoint);
  storage.setItem=originalSet;
  tap(root,'retry-save');
  assert.equal(ui.getState().history.length,MAX_ACTIONS);
  assert.equal(doc.activeElement.tagName,'P','Successful retry focuses the saved status');
  assert.equal(doc.activeElement.attributes.role,'status');
  assert.match(doc.activeElement.textContent,/Draft saved on this device/);
  assert.equal(doc.activeElement.tabIndex,-1);
  assert.equal(storage.getItem(DRAFT_KEY),JSON.stringify(ui.getState()));
  assert.doesNotMatch(root.allText(),/This draft is not saved on this device/);
  assert.match(root.allText(),/250-change safety limit/);
  assert.equal(root.find('place:first-map:later').disabled,true);
  tap(root,'reset');
  tap(root,'keep-reset');
  assert.equal(ui.getState().history.length,MAX_ACTIONS,'Cancelling restart keeps capped draft');
  assert.equal(storage.getItem(DRAFT_KEY),JSON.stringify(ui.getState()));
  ui.destroy();
});

test('E04 CSS keeps 320px choices touchable and wraps narrow-screen content',()=>{
  const css=readFileSync(new URL('../e04/authoring-ui.css',import.meta.url),'utf8');
  assert.match(css,/\.e04-authoring\s*\{[^}]*width:\s*100%;[^}]*min-width:\s*0;/);
  assert.match(css,/\.e04-panel\s*\{[^}]*min-width:\s*0;[^}]*overflow-wrap:\s*anywhere;/);
  assert.match(css,/\.e04-button\s*\{[^}]*min-height:\s*44px;[^}]*min-width:\s*0;[^}]*max-width:\s*100%;[^}]*overflow-wrap:\s*anywhere;/);
  assert.match(css,/@media\s*\(max-width:\s*560px\)[\s\S]*?\.e04-choices\s*\{\s*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css,/\.e04-choices\s+\.e04-button:last-child\s*\{\s*grid-column:\s*1\s*\/\s*-1;/);
  assert.match(css,/@media\s*\(min-width:\s*400px\)\s*and\s*\(max-width:\s*560px\)/);
  assert.match(css,/\.e04-save-warning\s*\{[^}]*flex-wrap:\s*wrap;/);
  assert.match(css,/\.e04-position-label\s*\{[^}]*min-width:\s*0;[^}]*overflow-wrap:\s*anywhere;/);
  assert.match(css,/\.e04-position-item\s*\{[^}]*flex-wrap:\s*wrap;/);
});

// The canonical E02/E03 unlock must run before any E04 draft inspection.
test('locked E04 does not read or mutate an invalid preview checkpoint',()=>{
  const doc=new FakeDocument(),root=doc.root(),storage=new MemoryStorage();
  const invalid='{invalid json';
  storage.setItem(DRAFT_KEY,invalid);
  const originalGet=storage.getItem.bind(storage);
  let draftReads=0;
  storage.getItem=k=>{
    if(k===DRAFT_KEY)draftReads++;
    return originalGet(k);
  };
  const blocked=mountE04Authoring(root,{pack,e02Save:null,e03Save:null,storage});
  assert.equal(blocked.ready,false);
  assert.equal(draftReads,0,'A locked chapter must not inspect the E04 draft');
  assert.doesNotMatch(root.allText(),/previous Episode 04 draft could not be restored/);
  assert.doesNotMatch(root.allText(),/First map/);
  assert.equal(originalGet(DRAFT_KEY),invalid);
  blocked.destroy();
});


test('corrupt checkpoint focuses a visible alert once and keeps earlier saves intact',()=>{
  const doc=new FakeDocument(),root=doc.root(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  const old02=JSON.stringify(e02),old03=JSON.stringify(e03);
  const corrupt='{"schema":1,"history":[{"type":"finish"}]}';
  storage.setItem('wondervale-s01e02-progress-v1',old02);
  storage.setItem('wondervale-s01e03-progress-v1',old03);
  storage.setItem(DRAFT_KEY,corrupt);
  const ui=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage});
  assert.equal(ui.ready,true);
  assert.deepEqual(ui.getState().history,[]);
  const alert=root.children[0].children.find(n=>n.className==='e04-save-warning' && n.attributes.role==='alert');
  assert.ok(alert,'Rejected checkpoint must expose a screen-reader alert');
  assert.equal(alert.tabIndex,-1,'Alert is focusable programmatically, not an extra Tab stop');
  assert.equal(doc.activeElement,alert,'Initial mount focuses the rejected checkpoint warning');
  assert.equal(root.find('resume'),null,'Corrupt drafts must never offer Continue draft');
  assert.equal(storage.getItem(DRAFT_KEY),corrupt,'Warning does not erase old bytes');
  tap(root,'reset');
  assert.equal(doc.activeElement.dataset.focusKey,'keep-reset');
  tap(root,'keep-reset');
  assert.equal(doc.activeElement.dataset.focusKey,'reset');
  assert.equal(storage.getItem(DRAFT_KEY),corrupt,'Cancel restart must preserve old bytes');
  tap(root,'memory:station');
  assert.equal(doc.activeElement.dataset.focusKey,'memory:garden',
    'A subsequent edit must not steal focus back to the restore warning');
  assert.doesNotMatch(root.allText(),/could not be restored/);
  assert.notEqual(storage.getItem(DRAFT_KEY),corrupt,'Valid edit replaces rejected checkpoint');
  assert.equal(storage.getItem('wondervale-s01e02-progress-v1'),old02);
  assert.equal(storage.getItem('wondervale-s01e03-progress-v1'),old03);
  ui.destroy();
  const validDoc=new FakeDocument(),validRoot=validDoc.root();
  const valid=mountE04Authoring(validRoot,{pack,e02Save:e02,e03Save:e03,storage});
  assert.equal(validDoc.activeElement,undefined,'Valid restore does not forcibly move focus');
  assert.equal(validRoot.find('resume')?.dataset.focusKey,'resume');
  valid.destroy();
});

test('two E04 preview mounts cannot overwrite or reset another tab checkpoint',()=>{
  const doc=new FakeDocument(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  storage.setItem('wondervale-s01e02-progress-v1',JSON.stringify(e02));
  storage.setItem('wondervale-s01e03-progress-v1',JSON.stringify(e03));
  const before02=storage.getItem('wondervale-s01e02-progress-v1');
  const before03=storage.getItem('wondervale-s01e03-progress-v1');
  const rootA=doc.root(),rootB=doc.root();
  const a=mountE04Authoring(rootA,{pack,e02Save:e02,e03Save:e03,storage});
  const b=mountE04Authoring(rootB,{pack,e02Save:e02,e03Save:e03,storage});
  tap(rootA,'memory:station');
  const newest=storage.getItem(DRAFT_KEY);
  assert.ok(newest);
  tap(rootB,'memory:garden');
  assert.deepEqual(b.getState().history,[],'Stale tab must not even dispatch a new event');
  assert.equal(storage.getItem(DRAFT_KEY),newest);
  assert.match(rootB.allText(),/changed in another tab/);
  assert.equal(doc.activeElement.attributes.role,'alert');
  assert.equal(rootB.find('memory:station').disabled,true);
  assert.equal(rootB.find('reset').disabled,true);
  assert.equal(b.reset(),false,'Direct reset API must also reject stale tab');
  tap(rootA,'memory:garden');
  assert.notEqual(storage.getItem(DRAFT_KEY),newest,'Active tab remains writable');
  assert.equal(storage.getItem('wondervale-s01e02-progress-v1'),before02);
  assert.equal(storage.getItem('wondervale-s01e03-progress-v1'),before03);
  a.destroy();b.destroy();
});

test('stale restored E04 tab cannot resurrect a checkpoint after another tab resets',()=>{
  const doc=new FakeDocument(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  const first=mountE04Authoring(doc.root(),{pack,e02Save:e02,e03Save:e03,storage});
  first.reset();first.destroy();
  const seed=mountE04Authoring(doc.root(),{pack,e02Save:e02,e03Save:e03,storage});
  const seedRoot=doc.root();
  seed.destroy();
  const aRoot=doc.root(),bRoot=doc.root();
  const a=mountE04Authoring(aRoot,{pack,e02Save:e02,e03Save:e03,storage});
  tap(aRoot,'memory:station');
  a.destroy();
  const ownerRoot=doc.root(),staleRoot=doc.root();
  const owner=mountE04Authoring(ownerRoot,{pack,e02Save:e02,e03Save:e03,storage});
  const stale=mountE04Authoring(staleRoot,{pack,e02Save:e02,e03Save:e03,storage});
  tap(ownerRoot,'reset');tap(ownerRoot,'confirm-reset');
  assert.equal(storage.getItem(DRAFT_KEY),null);
  tap(staleRoot,'memory:garden');
  assert.equal(storage.getItem(DRAFT_KEY),null,'Reset must not be undone by stale tab');
  assert.equal(stale.getState().history.length,1,'Rejected edit must not alter local history');
  assert.match(staleRoot.allText(),/changed in another tab/);
  owner.destroy();stale.destroy();
});

test('storage event catches cross-tab checkpoint ABA and destroy unregisters listener',()=>{
  const doc=new FakeDocument(),storage=new MemoryStorage(),listeners=new Set();
  doc.defaultView={
    addEventListener:(type,fn)=>{if(type==='storage')listeners.add(fn);},
    removeEventListener:(type,fn)=>{if(type==='storage')listeners.delete(fn);}
  };
  const e02=realE02(),e03=realE03(),root=doc.root();
  const ui=mountE04Authoring(root,{pack,e02Save:e02,e03Save:e03,storage});
  assert.equal(listeners.size,1);
  // Another tab may write and clear the same key before this tab next reads.
  for(const fn of listeners)fn({key:DRAFT_KEY,storageArea:storage,newValue:'external'});
  assert.match(root.allText(),/changed in another tab/);
  assert.equal(doc.activeElement.attributes.role,'alert');
  assert.equal(root.find('memory:station').disabled,true);
  assert.equal(ui.reset(),false);
  assert.equal(storage.getItem(DRAFT_KEY),null);
  ui.destroy();
  assert.equal(listeners.size,0,'Destroy must remove the storage listener');
});


test('stale E04 tab explicitly loads the latest valid checkpoint without rewriting it',()=>{
  const doc=new FakeDocument(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  storage.setItem('wondervale-s01e02-progress-v1',JSON.stringify(e02));
  storage.setItem('wondervale-s01e03-progress-v1',JSON.stringify(e03));
  const old02=storage.getItem('wondervale-s01e02-progress-v1');
  const old03=storage.getItem('wondervale-s01e03-progress-v1');
  const aRoot=doc.root(),bRoot=doc.root();
  const a=mountE04Authoring(aRoot,{pack,e02Save:e02,e03Save:e03,storage});
  const b=mountE04Authoring(bRoot,{pack,e02Save:e02,e03Save:e03,storage});
  tap(aRoot,'memory:station');
  const saved=storage.getItem(DRAFT_KEY);
  tap(bRoot,'memory:garden');
  assert.match(bRoot.allText(),/changed in another tab/);
  assert.equal(bRoot.find('review-latest').disabled,false);
  tap(bRoot,'review-latest');
  assert.deepEqual(b.getState(),a.getState(),'Read-only reload must replay newest checkpoint');
  assert.equal(storage.getItem(DRAFT_KEY),saved,'Reload must not write storage');
  assert.equal(doc.activeElement.dataset.focusKey,'resume');
  tap(bRoot,'memory:garden');
  assert.equal(b.getState().history.length,2,'Reloaded tab can continue safely');
  assert.equal(storage.getItem('wondervale-s01e02-progress-v1'),old02);
  assert.equal(storage.getItem('wondervale-s01e03-progress-v1'),old03);
  a.destroy();b.destroy();
});

test('cross-tab reload requires explicit discard of unsaved work and refuses invalid latest bytes',()=>{
  const doc=new FakeDocument(),storage=new MemoryStorage();
  const e02=realE02(),e03=realE03();
  const aRoot=doc.root(),bRoot=doc.root();
  const a=mountE04Authoring(aRoot,{pack,e02Save:e02,e03Save:e03,storage});
  tap(aRoot,'memory:station');
  const b=mountE04Authoring(bRoot,{pack,e02Save:e02,e03Save:e03,storage});
  const originalSet=storage.setItem.bind(storage);
  let failOnce=true;
  storage.setItem=(k,v)=>{
    if(k===DRAFT_KEY && failOnce){failOnce=false;throw new Error('Simulated quota');}
    return originalSet(k,v);
  };
  tap(bRoot,'memory:garden');
  const unsaved=b.getState();
  assert.equal(unsaved.history.length,2);
  assert.match(bRoot.allText(),/not saved on this device/);
  storage.setItem=originalSet;
  tap(aRoot,'inspect:first-map');
  const latest=storage.getItem(DRAFT_KEY);
  tap(bRoot,'inspect:later-record'); // detects conflict before dispatch
  assert.deepEqual(b.getState(),unsaved);
  tap(bRoot,'review-latest');
  assert.ok(bRoot.find('confirm-conflict'));
  assert.match(bRoot.allText(),/discard those changes from this tab only/);
  assert.deepEqual(b.getState(),unsaved,'First click must not discard unsaved edits');
  assert.equal(doc.activeElement.dataset.focusKey,'keep-conflict');
  tap(bRoot,'keep-conflict');
  assert.deepEqual(b.getState(),unsaved,'Cancel keeps in-memory unsaved edits');
  assert.equal(storage.getItem(DRAFT_KEY),latest);
  tap(bRoot,'review-latest');
  tap(bRoot,'confirm-conflict');
  assert.deepEqual(b.getState(),a.getState());
  assert.equal(storage.getItem(DRAFT_KEY),latest,'Confirmed reload is read-only');

  // Invalid external checkpoint cannot replace the current in-memory draft.
  const before=b.getState();
  storage.setItem(DRAFT_KEY,'{broken');
  tap(bRoot,'memory:garden');
  assert.match(bRoot.allText(),/changed in another tab/);
  tap(bRoot,'review-latest');
  assert.match(bRoot.allText(),/cannot be read or verified yet/);
  assert.deepEqual(b.getState(),before);
  assert.equal(storage.getItem(DRAFT_KEY),'{broken');
  storage.setItem(DRAFT_KEY,latest);
  tap(bRoot,'review-latest');
  assert.deepEqual(b.getState(),before,'Retry with valid saved bytes replays safely');
  a.destroy();b.destroy();
});
