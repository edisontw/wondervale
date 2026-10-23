import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh as fresh02,dispatch as dispatch02,payload as payload02} from '../engine/s01e02.mjs';
import {fresh as fresh03,dispatch as dispatch03,payload as payload03} from '../engine/s01e03.mjs';
import {DRAFT_KEY} from '../engine/s01e04-chronology.mjs';
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
  assert.equal(root.allText().includes('way to the station'),true);
  tap(root,'memory:garden');
  assert.equal(root.allText().includes('way to the garden'),true);
  for(const id of pack.cards.map(c=>c.id))tap(root,'inspect:'+id);
  tap(root,'clue:revision-note');
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
