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
  assert.ok(storage.getItem(DRAFT_KEY));
  assert.equal(storage.getItem('wondervale-s01e02-progress-v1'),before02);
  assert.equal(storage.getItem('wondervale-s01e03-progress-v1'),before03);
  const newRoot=doc.root();
  const resumed=mountE04Authoring(newRoot,{pack,e02Save:e02,e03Save:e03,storage});
  assert.equal(resumed.getState().phase,'completed');
  resumed.reset();
  assert.equal(resumed.getState().phase,'sources');
  assert.equal(storage.getItem(DRAFT_KEY),null);
  assert.equal(storage.getItem('wondervale-s01e02-progress-v1'),before02);
  assert.equal(storage.getItem('wondervale-s01e03-progress-v1'),before03);
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

test('unreadable storage warns, while empty and valid checkpoints do not',()=>{
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
  assert.doesNotMatch(root.allText(),/could not be restored/);
  assert.deepEqual(unreadable.getState().memoryViewed,['garden']);
  unreadable.destroy();
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

test('E04 CSS keeps 320px choices touchable and wraps narrow-screen content',()=>{
  const css=readFileSync(new URL('../e04/authoring-ui.css',import.meta.url),'utf8');
  assert.match(css,/\.e04-authoring\s*\{[^}]*width:\s*100%;[^}]*min-width:\s*0;/);
  assert.match(css,/\.e04-panel\s*\{[^}]*min-width:\s*0;[^}]*overflow-wrap:\s*anywhere;/);
  assert.match(css,/\.e04-button\s*\{[^}]*min-height:\s*44px;[^}]*min-width:\s*0;[^}]*max-width:\s*100%;[^}]*overflow-wrap:\s*anywhere;/);
  assert.match(css,/@media\s*\(max-width:\s*560px\)[\s\S]*?\.e04-choices\s*\{\s*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css,/\.e04-choices\s+\.e04-button:last-child\s*\{\s*grid-column:\s*1\s*\/\s*-1;/);
  assert.match(css,/@media\s*\(min-width:\s*400px\)\s*and\s*\(max-width:\s*560px\)/);
  assert.match(css,/\.e04-save-warning\s*\{[^}]*flex-wrap:\s*wrap;/);
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
