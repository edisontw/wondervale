// Browser-only E04 authoring regression. Synthetic source cards are engineering fixtures,
// never canonical evidence or approved Episode 04 story content.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {fresh as fresh02,dispatch as dispatch02,payload as payload02} from '../engine/s01e02.mjs';
import {fresh as fresh03,dispatch as dispatch03,payload as payload03} from '../engine/s01e03.mjs';
import {DRAFT_KEY} from '../engine/s01e04-chronology.mjs';

const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const pack={
  id:'browser-layout-fixture',revision:'test-r1',
  cards:[
    {id:'first-map',label:'First map',kind:'map'},
    {id:'later-record',label:'Later record',kind:'document'},
    {id:'undated-photo',label:'VeryLongUnbrokenSyntheticPhotoLabelForNarrowViewportWrapping',kind:'photo'}
  ],
  clues:[{id:'revision-note',label:'Revision note',text:'A synthetic note about a changed map.'}],
  relativeOrder:{earlier:'first-map',later:'later-record',basis:'revision-note'}
};
const drain02=s=>{while(s.queue.length)s=dispatch02(s,{type:'next'});return s;};
const drain03=s=>{while(s.queue.length)s=dispatch03(s,{type:'next'});return s;};
const move03=s=>{while(s.travel.length)s=dispatch03(s,{type:'step',to:s.travel[0]});return s;};
function completedE02(){
  let s=fresh02();
  const a=x=>{s=drain02(dispatch02(s,x));};
  for(const action of [
    {type:'begin'},{type:'go',to:'oldStones'},{type:'inspect',what:'stones'},
    {type:'close-detail'},{type:'go',to:'lookoutView'},{type:'inspect',what:'gap'},
    {type:'close-detail'},{type:'notebook'},{type:'fact',choice:'gap'},
    {type:'revision',choice:'A'},{type:'market'},{type:'chronicle'},{type:'finish'}
  ])a(action);
  assert.equal(s.phase,'completed');
  return payload02(s);
}
function completedE03(){
  let s=drain03(dispatch03(fresh03(),{type:'begin',ready:true}));
  const deliver=state=>drain03(dispatch03(move03(dispatch03(state,{type:'take-route',route:'L'})),{type:'deliver'}));
  s=deliver(s);s=drain03(move03(dispatch03(s,{type:'return'})));
  s=deliver(s);s=dispatch03(s,{type:'inspect',what:'S'});
  s=drain03(dispatch03(s,{type:'compare',reason:'steps'}));
  s=drain03(move03(dispatch03(s,{type:'return'})));
  s=deliver(s);s=drain03(move03(dispatch03(s,{type:'return'})));
  for(const kind of ['WALK','CART'])s=drain03(dispatch03(s,{type:'sign',kind,to:'L'}));
  s=move03(dispatch03(s,{type:'go-glyph'}));
  s=drain03(dispatch03(s,{type:'glyph'}));
  for(const which of ['garden','station'])s=drain03(dispatch03(s,{type:'memory',which}));
  s=drain03(dispatch03(s,{type:'chronicle'}));s=dispatch03(s,{type:'finish'});
  assert.equal(s.phase,'completed');
  return payload03(s);
}
const e02Save=completedE02(),e03Save=completedE03();
// Use a system Chromium when running local QA without Playwright's downloaded browser.
const browser=await chromium.launch({
  headless:true,
  ...(process.env.E04_CHROMIUM_EXECUTABLE
    ? {executablePath:process.env.E04_CHROMIUM_EXECUTABLE}
    : {})
});
const cases=[{width:320,height:640},{width:568,height:320},{width:1366,height:768}];
try {
  for(const size of cases){
    const mobile=size.width<900;
    const context=await browser.newContext({
      viewport:size,isMobile:mobile,hasTouch:mobile,reducedMotion:'reduce'
    });
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    // No E04 production route exists. This intercepted HTML is test-only and
    // loads the actual E04 JS/CSS from the repository's local static server.
    await page.route('**/__e04_browser_probe__',route=>route.fulfill({
      status:200,contentType:'text/html',
      body:'<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/e04/authoring-ui.css"></head><body style="margin:0"><main id="e04-root"></main></body></html>'
    }));
    await page.goto(base+'/__e04_browser_probe__');
    await page.evaluate(async ({pack,e02Save,e03Save})=>{
      const {mountE04Authoring}=await import('/e04/authoring-ui.mjs');
      localStorage.setItem('wondervale-s01e02-progress-v1',JSON.stringify(e02Save));
      localStorage.setItem('wondervale-s01e03-progress-v1',JSON.stringify(e03Save));
      window.__e04=mountE04Authoring(document.getElementById('e04-root'),{
        pack,e02Save,e03Save,storage:localStorage
      });
    },{pack,e02Save,e03Save});
    assert.equal(await page.evaluate(()=>window.__e04.ready),true,'Canonical entry gate');
    const action=async key=>{
      const b=page.locator('[data-focus-key="'+key+'"]');
      if(mobile)await b.tap();else await b.click();
    };
    const layout=async label=>{
      const geometry=await page.evaluate(()=>{
        const buttons=[...document.querySelectorAll('.e04-authoring button')];
        return {
          viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,
          buttons:buttons.map(b=>{
            const r=b.getBoundingClientRect();
            return {name:b.dataset.focusKey,x:r.x,right:r.right,width:r.width,height:r.height};
          })
        };
      });
      assert.ok(geometry.scrollWidth<=geometry.viewport+1,
        label+' horizontal overflow: '+JSON.stringify(geometry));
      for(const b of geometry.buttons){
        assert.ok(b.x>=-1&&b.right<=geometry.viewport+1,
          label+' clipped control '+JSON.stringify(b));
        assert.ok(b.height>=43.5,label+' touch target too short '+JSON.stringify(b));
      }
    };
    await layout('initial '+size.width);
    const choices=await page.locator('.e04-choices').first().locator('button').evaluateAll(
      nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {top:r.top,width:r.width};})
    );
    if(size.width===320){
      assert.ok(Math.abs(choices[0].top-choices[1].top)<2,'320px: first two choices share row');
      assert.ok(choices[2].top>choices[1].top+20,'320px: uncertainty moves to next row');
    } else {
      assert.ok(Math.abs(choices[0].top-choices[2].top)<2,'wider view: three choices share row');
    }
    // Trigger a real browser Storage write failure, then retry without story mutation.
    await page.evaluate(key=>{
      window.__e04Blocked=true;
      const original=Storage.prototype.setItem;
      Storage.prototype.setItem=function(k,v){
        if(k===key&&window.__e04Blocked)throw new Error('Simulated quota');
        return original.call(this,k,v);
      };
    },DRAFT_KEY);
    await action('memory:station');
    const beforeRetry=await page.evaluate(()=>window.__e04.getState());
    assert.equal(await page.locator('[data-focus-key="retry-save"]').count(),1);
    await layout('save warning '+size.width);
    await action('retry-save');
    assert.deepEqual(await page.evaluate(()=>window.__e04.getState()),beforeRetry);
    await page.evaluate(()=>{window.__e04Blocked=false;});
    await action('retry-save');
    assert.deepEqual(await page.evaluate(()=>window.__e04.getState()),beforeRetry);
    assert.equal(await page.locator('[data-focus-key="retry-save"]').count(),0);
    await action('memory:garden');
    for(const id of ['first-map','later-record','undated-photo'])await action('inspect:'+id);
    await action('clue:revision-note');
    await action('place:first-map:earlier');
    await action('place:later-record:later');
    await action('place:undated-photo:uncertain');
    await action('explain');await action('chronicle');
    assert.equal(await page.locator('.e04-timeline-step').count(),2);
    await layout('Chronicle '+size.width);
    await action('finish');
    assert.equal(await page.evaluate(()=>window.__e04.getState().phase),'completed');
    assert.equal(await page.locator('.e04-completion').evaluate(node=>document.activeElement===node),true,
      'Finish must focus the completed draft announcement, not jump to reset');
    assert.equal(await page.locator('.e04-completion').getAttribute('role'),'status');
    const unchanged=await page.evaluate(()=>[
      localStorage.getItem('wondervale-s01e02-progress-v1'),
      localStorage.getItem('wondervale-s01e03-progress-v1')
    ]);
    assert.deepEqual(unchanged,[JSON.stringify(e02Save),JSON.stringify(e03Save)]);
    // Real keyboard regression: cancel restart without losing progress, then
    // confirm via Tab/Enter. The new draft should begin in view, not at its footer.
    const focusKey=()=>page.evaluate(()=>document.activeElement?.dataset?.focusKey??null);
    const saved=await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY);
    assert.ok(saved,'Completed draft has a local checkpoint');
    await page.locator('[data-focus-key="reset"]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await focusKey(),'keep-reset','Restart confirmation starts at the safe option');
    await page.keyboard.press('Enter');
    assert.equal(await focusKey(),'reset','Cancel returns focus to restart control');
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY),saved);
    assert.equal(await page.evaluate(()=>window.__e04.getState().phase),'completed');
    await page.keyboard.press('Enter');
    assert.equal(await focusKey(),'keep-reset');
    await page.keyboard.press('Tab');
    assert.equal(await focusKey(),'confirm-reset','Confirmation reachable by keyboard');
    const scopeId=await page.locator('[data-focus-key="confirm-reset"]').getAttribute('aria-describedby');
    assert.match(scopeId,/^e04-reset-prompt-\\d+$/);
    assert.equal(await page.locator('[data-focus-key="keep-reset"]').getAttribute('aria-describedby'),scopeId);
    assert.match(await page.locator('#'+scopeId).innerText(),/Earlier chapters stay saved/);
    // Force a real Storage removal error: both buttons must then describe the
    // failure and retain the checkpoint, without disturbing prior episodes.
    await page.evaluate(key=>{
      const original=Storage.prototype.removeItem;
      window.__e04ResetBlocked=true;
      Storage.prototype.removeItem=function(k){
        if(k===key && window.__e04ResetBlocked)throw Error('Simulated reset failure');
        return original.call(this,k);
      };
    },DRAFT_KEY);
    await page.keyboard.press('Enter');
    assert.equal(await focusKey(),'confirm-reset','Failed reset keeps retry in focus');
    assert.equal(await page.locator('.e04-reset-error').getAttribute('role'),'alert');
    const failureDescription=await page.locator('[data-focus-key="confirm-reset"]').getAttribute('aria-describedby');
    assert.match(failureDescription,new RegExp('^'+scopeId+' e04-reset-error-\\\\d+
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY),null);
    const heading=page.locator('.e04-authoring h2');
    assert.equal(await heading.evaluate(node=>document.activeElement===node),true,
      'After clearing, focus should return to the beginning of the new draft');
    const headingPosition=await heading.evaluate(node=>({
      top:node.getBoundingClientRect().top,height:innerHeight
    }));
    assert.ok(headingPosition.top>=-1 && headingPosition.top<headingPosition.height,
      'Restart heading should be visible on short screens: '+JSON.stringify(headingPosition));
    await page.keyboard.press('Tab');
    assert.equal(await focusKey(),'memory:station','Tab from heading enters the first action');
    await page.keyboard.press('Tab');
    assert.equal(await focusKey(),'memory:garden');
    await page.keyboard.press('Enter');
    assert.deepEqual(await page.evaluate(()=>window.__e04.getState().memoryViewed),['garden']);
    assert.equal(await focusKey(),'inspect:first-map',
      'Inspecting a memory must not strand focus on its disabled button');
    await page.keyboard.press('Enter');
    assert.deepEqual(await page.evaluate(()=>window.__e04.getState().cardViewed),['first-map']);
    assert.equal(await focusKey(),'place:first-map:earlier',
      'Inspecting a card advances focus to an enabled placement');
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(()=>window.__e04.getState().slots['first-map']),'earlier');
    assert.deepEqual(await page.evaluate(()=>[
      localStorage.getItem('wondervale-s01e02-progress-v1'),
      localStorage.getItem('wondervale-s01e03-progress-v1')
    ]),unchanged,'Keyboard restart and new draft must not modify earlier episodes');
    await layout('keyboard and restart '+size.width);
    // A browser reload must recover the exact draft checkpoint, not just the
    // visible phase. Synthetic fixture only; no production E04 route is served.
    const beforeReload=await page.evaluate(()=>window.__e04.getState());
    const checkpoint=await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY);
    assert.ok(checkpoint,'Partial draft should persist before reload');
    await page.reload();
    await page.evaluate(async ({pack,e02Save,e03Save})=>{
      const {mountE04Authoring}=await import('/e04/authoring-ui.mjs');
      window.__e04=mountE04Authoring(document.getElementById('e04-root'),{
        pack,e02Save,e03Save,storage:localStorage
      });
    },{pack,e02Save,e03Save});
    assert.deepEqual(await page.evaluate(()=>window.__e04.getState()),beforeReload,
      'Reload must restore the exact event-replayed draft');
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY),checkpoint);
    assert.equal(await page.locator('[data-focus-key="resume"]').count(),1,
      'A valid saved draft must offer a visible continuation shortcut');
    await action('resume');
    assert.equal(await focusKey(),'memory:station',
      'Resume must return to the unfinished station memory, not the already inspected garden memory');
    const resumedControl=await page.locator('[data-focus-key="memory:station"]').evaluate(node=>{
      const r=node.getBoundingClientRect();
      return {top:r.top,bottom:r.bottom,height:innerHeight,focused:document.activeElement===node};
    });
    assert.ok(resumedControl.focused && resumedControl.top>=-1 && resumedControl.top<resumedControl.height,
      'Resume must scroll the next action into view on mobile/desktop: '+JSON.stringify(resumedControl));
    assert.deepEqual(await page.evaluate(()=>window.__e04.getState()),beforeReload,
      'Resume is navigation only and cannot alter the draft');
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY),checkpoint,
      'Resume must not write a new checkpoint');

    // Historical replay is isolated even when a valid draft exists on disk.
    const replay=await page.evaluate(async ({pack,e02Save,e03Save,key})=>{
      const {mountE04Authoring}=await import('/e04/authoring-ui.mjs');
      const root=document.createElement('div');
      root.id='e04-replay-probe';
      document.body.append(root);
      const ui=mountE04Authoring(root,{
        pack,e02Save,e03Save,storage:localStorage,mode:'historical_replay'
      });
      root.querySelector('[data-focus-key="memory:station"]').click();
      const state=ui.getState();
      ui.reset();
      const after=localStorage.getItem(key);
      ui.destroy();root.remove();
      return {ready:ui.ready,state,after};
    },{pack,e02Save,e03Save,key:DRAFT_KEY});
    assert.equal(replay.ready,true);
    assert.equal(replay.state.mode,'historical_replay');
    assert.deepEqual(replay.state.memoryViewed,['station']);
    assert.equal(replay.after,checkpoint,'Historical replay must not overwrite E04 draft');
    assert.deepEqual(await page.evaluate(()=>window.__e04.getState()),beforeReload,
      'Historical replay must not mutate the mounted draft');

    // Corrupt or forged storage is rejected on reload without erasing the
    // earlier episodes; a subsequent valid action can replace the bad bytes.
    const corrupt='{"schema":1,"history":[{"type":"finish"}]}';
    await page.evaluate(({key,corrupt})=>localStorage.setItem(key,corrupt),
      {key:DRAFT_KEY,corrupt});
    await page.reload();
    await page.evaluate(async ({pack,e02Save,e03Save})=>{
      const {mountE04Authoring}=await import('/e04/authoring-ui.mjs');
      window.__e04=mountE04Authoring(document.getElementById('e04-root'),{
        pack,e02Save,e03Save,storage:localStorage
      });
    },{pack,e02Save,e03Save});
    const recovered=await page.evaluate(()=>window.__e04.getState());
    assert.equal(recovered.phase,'sources','Corrupt checkpoint must open a clean draft');
    assert.deepEqual(recovered.history,[],'Forged history must not be replayed');
    assert.equal(await page.locator('[data-focus-key="resume"]').count(),0,
      'A forged checkpoint must not show a continuation shortcut');
    assert.deepEqual(recovered.memoryViewed,[]);
    assert.equal(await page.getByText('The previous Episode 04 draft could not be restored',{exact:false}).count(),1,
      'Corrupt checkpoint must visibly warn the user');
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY),corrupt,
      'Loading must not silently delete or rewrite storage');
    await action('memory:station');
    assert.equal(await page.getByText('The previous Episode 04 draft could not be restored',{exact:false}).count(),0,
      'Warning clears after a valid replacement checkpoint');
    const repaired=await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY);
    assert.ok(repaired && repaired!==corrupt,'A valid action replaces corrupt storage');
    await page.reload();
    await page.evaluate(async ({pack,e02Save,e03Save})=>{
      const {mountE04Authoring}=await import('/e04/authoring-ui.mjs');
      window.__e04=mountE04Authoring(document.getElementById('e04-root'),{
        pack,e02Save,e03Save,storage:localStorage
      });
    },{pack,e02Save,e03Save});
    assert.deepEqual(await page.evaluate(()=>window.__e04.getState().memoryViewed),['station'],
      'Repaired checkpoint must survive another reload');
    assert.deepEqual(await page.evaluate(()=>[
      localStorage.getItem('wondervale-s01e02-progress-v1'),
      localStorage.getItem('wondervale-s01e03-progress-v1')
    ]),unchanged,'Reload, replay and corruption recovery must preserve E02/E03');
    await layout('reload and replay '+size.width);

    // A restored, fully placed but unsupported chronology must show a neutral
    // cue on phone and desktop, without exposing which slot is correct.
    await page.evaluate(async ({pack,key})=>{
      const {fresh,dispatch}=await import('/engine/s01e04-chronology.mjs');
      let state=fresh(pack);
      for(const which of ['station','garden'])
        state=dispatch(state,{type:'inspect-memory',which},pack);
      for(const card of pack.cards)
        state=dispatch(state,{type:'inspect-card',id:card.id},pack);
      for(const clue of pack.clues)
        state=dispatch(state,{type:'inspect-clue',id:clue.id},pack);
      for(const [id,slot] of [
        ['first-map','later'],['later-record','earlier'],['undated-photo','uncertain']
      ])state=dispatch(state,{type:'place',id,slot},pack);
      localStorage.setItem(key,JSON.stringify(state));
    },{pack,key:DRAFT_KEY});
    await page.reload();
    await page.evaluate(async ({pack,e02Save,e03Save})=>{
      const {mountE04Authoring}=await import('/e04/authoring-ui.mjs');
      window.__e04=mountE04Authoring(document.getElementById('e04-root'),{
        pack,e02Save,e03Save,storage:localStorage
      });
    },{pack,e02Save,e03Save});
    const unsupported=await page.evaluate(()=>window.__e04.getState());
    const unsupportedCheckpoint=await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY);
    const reviewCue=page.locator('.e04-review-cue');
    assert.equal(await reviewCue.count(),1,'Unsupported timeline shows review cue');
    const cueText=await reviewCue.innerText();
    assert.doesNotMatch(cueText,/First map|Later record|Earlier|Later/,
      'Review cue must not reveal the expected card positions');
    await action('resume');
    assert.equal(await reviewCue.evaluate(node=>document.activeElement===node),true,
      'Restored unsupported timeline must focus the neutral review cue');
    await layout('unsupported review cue '+size.width);
    assert.equal(await page.locator('[data-focus-key^="review-card:"]').count(),3,
      'Every placed source offers a neutral direct-review action');
    await action('review-card:later-record');
    const reviewedHeading=page.locator('.e04-card h4').filter({hasText:'Later record'});
    assert.equal(await reviewedHeading.evaluate(node=>document.activeElement===node),true,
      'Direct review focuses the chosen source heading, never a correct answer');
    await action('back-to-review:later-record');
    const overviewHeading=page.locator('.e04-position-review h4');
    assert.equal(await overviewHeading.evaluate(node=>document.activeElement===node),true,
      'Return shortcut focuses the overview on short screens');
    const overviewRect=await overviewHeading.evaluate(node=>({
      top:node.getBoundingClientRect().top,height:innerHeight
    }));
    assert.ok(overviewRect.top>=-1 && overviewRect.top<overviewRect.height,
      'Review overview must scroll into view: '+JSON.stringify(overviewRect));
    assert.deepEqual(await page.evaluate(()=>window.__e04.getState()),unsupported);
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY),unsupportedCheckpoint);
    await layout('review jump and return '+size.width);
    await action('review-positions');
    const sourceHeading=page.locator('.e04-panel h3').filter({hasText:'Source cards'});
    assert.equal(await sourceHeading.evaluate(node=>document.activeElement===node),true,
      'Review button focuses source heading, not a particular slot');
    await page.keyboard.press('Tab');
    assert.equal(await focusKey(),'place:first-map:earlier',
      'Keyboard reaches first enabled source choice from review heading');
    assert.deepEqual(await page.evaluate(()=>window.__e04.getState()),unsupported,
      'Review navigation cannot mutate the draft');
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY),unsupportedCheckpoint,
      'Review navigation cannot rewrite the checkpoint');
    await action('place:first-map:earlier');
    assert.equal(await reviewCue.count(),1,'Cue persists until all order constraints are met');
    await action('place:later-record:later');
    assert.equal(await reviewCue.count(),0,'Cue clears once relative order is supported');
    assert.equal(await page.locator('[data-focus-key="explain"]').isEnabled(),true);
    assert.deepEqual(await page.evaluate(()=>[
      localStorage.getItem('wondervale-s01e02-progress-v1'),
      localStorage.getItem('wondervale-s01e03-progress-v1')
    ]),unchanged,'Review and edits cannot change E02/E03 saves');
    await layout('corrected review cue '+size.width);

    // Eight synthetic cards stress navigation, long labels, and repeated edits
    // on short landscape as well as portrait/desktop. No canonical content or
    // production route is created, and the test store is isolated from E02/E03.
    await page.evaluate(async ({e02Save,e03Save})=>{
      const {fresh,dispatch,DRAFT_KEY}=await import('/engine/s01e04-chronology.mjs');
      const {mountE04Authoring}=await import('/e04/authoring-ui.mjs');
      const largePack={
        id:'large-navigation-fixture',revision:'test-r1',
        cards:Array.from({length:8},(_,i)=>({
          id:'source-'+(i+1),
          label:i===7?'LongSyntheticSourceLabelWithoutSpaces'.repeat(3):'Synthetic source '+(i+1),
          kind:i%2?'document':'map'
        })),
        clues:[{id:'synthetic-clue',label:'Synthetic revision clue',text:'Synthetic test-only clue.'}],
        relativeOrder:{earlier:'source-1',later:'source-2',basis:'synthetic-clue'}
      };
      let state=fresh(largePack);
      for(const which of ['station','garden'])
        state=dispatch(state,{type:'inspect-memory',which},largePack);
      for(const card of largePack.cards)
        state=dispatch(state,{type:'inspect-card',id:card.id},largePack);
      state=dispatch(state,{type:'inspect-clue',id:'synthetic-clue'},largePack);
      for(const card of largePack.cards)
        state=dispatch(state,{type:'place',id:card.id,
          slot:card.id==='source-1'?'later':card.id==='source-2'?'earlier':'uncertain'},largePack);
      const store={
        value:JSON.stringify(state),writes:0,
        getItem(k){return k===DRAFT_KEY?this.value:null;},
        setItem(k,v){if(k===DRAFT_KEY){this.value=v;this.writes++;}},
        removeItem(k){if(k===DRAFT_KEY)this.value=null;}
      };
      const root=document.createElement('div');
      root.id='e04-large-probe';document.body.append(root);
      window.__largeStore=store;
      window.__largePack=largePack;
      window.__largeMount=mountE04Authoring;
      window.__large=mountE04Authoring(root,{pack:largePack,e02Save,e03Save,storage:store});
      window.__largeInitial=state.history.length;
    },{e02Save,e03Save});
    const largeRoot=page.locator('#e04-large-probe');
    const largeAction=async key=>{
      const b=largeRoot.locator('[data-focus-key="'+key+'"]');
      if(mobile)await b.tap();else await b.click();
    };
    assert.equal(await largeRoot.locator('[data-focus-key^="review-card:"]').count(),8);
    await layout('eight-card overview '+size.width);
    await largeAction('review-card:source-8');
    const lastHeading=largeRoot.locator('.e04-card h4').filter({hasText:'LongSyntheticSourceLabelWithoutSpaces'});
    const lastRect=await lastHeading.evaluate(node=>({
      top:node.getBoundingClientRect().top,height:innerHeight,
      focused:document.activeElement===node
    }));
    assert.ok(lastRect.focused && lastRect.top>=-1 && lastRect.top<lastRect.height,
      'Long-label last source must be focused and visible: '+JSON.stringify(lastRect));
    await largeAction('back-to-review:source-8');
    const backRect=await largeRoot.locator('.e04-position-review h4').evaluate(node=>({
      top:node.getBoundingClientRect().top,height:innerHeight,
      focused:document.activeElement===node
    }));
    assert.ok(backRect.focused && backRect.top>=-1 && backRect.top<backRect.height,
      'Return from last source must show the overview: '+JSON.stringify(backRect));
    assert.equal(await page.evaluate(()=>window.__largeStore.writes),0,
      'Navigation alone must never rewrite the draft');
    await largeAction('review-card:source-1');
    await largeAction('place:source-1:earlier');
    assert.equal(await largeRoot.locator('.e04-review-cue').count(),1);
    await largeAction('back-to-review:source-1');
    await largeAction('review-card:source-2');
    await largeAction('place:source-2:later');
    assert.equal(await largeRoot.locator('.e04-review-cue').count(),0,
      'Supported order removes all review-only navigation');
    assert.equal(await largeRoot.locator('[data-focus-key^="review-card:"]').count(),0);
    assert.equal(await page.evaluate(()=>window.__largeStore.writes),2,
      'Only the two real revisions write checkpoints');
    assert.equal(await page.evaluate(()=>window.__large.getState().history.length-window.__largeInitial),2);
    await layout('eight-card resolved '+size.width);
    // A failed write must be visible at 568x320 and must not silently claim
    // the latest timeline revisions were persisted. This fixture is isolated.
    const largeCheckpoint=await page.evaluate(()=>window.__largeStore.value);
    await page.evaluate(()=>{
      const store=window.__largeStore,original=store.setItem.bind(store);
      store.blocked=true;
      store.setItem=function(k,v){
        if(this.blocked)throw new Error('Simulated E04 storage quota');
        original(k,v);
      };
    });
    await largeAction('place:source-1:later');
    const unsaved=largeRoot.locator('.e04-save-warning[role="alert"]');
    assert.equal(await unsaved.count(),1);
    const alertRect=await unsaved.evaluate(node=>({
      top:node.getBoundingClientRect().top,height:innerHeight,
      focused:document.activeElement===node
    }));
    assert.ok(alertRect.focused && alertRect.top>=-1 && alertRect.top<alertRect.height,
      'First failed write must focus visible warning: '+JSON.stringify(alertRect));
    assert.equal(await page.evaluate(()=>window.__largeStore.value),largeCheckpoint);
    await largeAction('retry-save');
    assert.equal(await largeRoot.locator('[data-focus-key="retry-save"]').evaluate(
      node=>document.activeElement===node),true);
    await largeAction('place:source-1:earlier');
    assert.equal(await page.evaluate(()=>window.__largeStore.value),largeCheckpoint);
    assert.equal(await largeRoot.locator('[data-focus-key="place:source-1:earlier"]').evaluate(
      node=>document.activeElement===node),true,
    'Repeated failure should leave focus at the current source choice');
    await page.evaluate(()=>{window.__largeStore.blocked=false;});
    await largeAction('place:source-1:later');
    const savedNotice=largeRoot.locator('.e04-save-success[role="status"]');
    assert.equal(await savedNotice.count(),1,
      'Later successful edit must announce recovery even without Retry');
    assert.equal(await savedNotice.evaluate(node=>document.activeElement===node),true);
    const recoveredState=await page.evaluate(()=>window.__large.getState());
    const recoveredBytes=await page.evaluate(()=>window.__largeStore.value);
    assert.deepEqual(JSON.parse(recoveredBytes),recoveredState);
    assert.equal(await page.evaluate(()=>window.__largeStore.writes),3,
      'Blocked edits and failed retry cannot count as saved checkpoints');
    await page.evaluate(({e02Save,e03Save})=>{
      const root=document.getElementById('e04-large-probe');
      window.__large.destroy();
      window.__large=mountLargeAgain(root,e02Save,e03Save);
      function mountLargeAgain(target,e02,e03){
        // Preserve the exact same synthetic source pack and storage on remount.
        return window.__largeMount(target,{pack:window.__largePack,
          e02Save:e02,e03Save:e03,storage:window.__largeStore});
      }
    },{e02Save,e03Save});
    assert.deepEqual(await page.evaluate(()=>window.__large.getState()),recoveredState,
      'Remount after recovered write must replay all revisions');
    await largeAction('resume');
    assert.equal(await largeRoot.locator('.e04-review-cue').evaluate(
      node=>document.activeElement===node),true);
    await page.evaluate(()=>{window.__largeStore.blocked=true;});
    await largeAction('place:source-2:earlier');
    assert.equal(await page.evaluate(()=>window.__largeStore.value),recoveredBytes);
    await page.evaluate(({e02Save,e03Save})=>{
      const root=document.getElementById('e04-large-probe');
      window.__large.destroy();
      window.__large=window.__largeMount(root,{pack:window.__largePack,
        e02Save,e03Save,storage:window.__largeStore});
    },{e02Save,e03Save});
    assert.deepEqual(await page.evaluate(()=>window.__large.getState()),recoveredState,
      'After another failed write, remount must restore last persisted state');
    await layout('eight-card save recovery '+size.width);
    await page.evaluate(()=>{
      window.__large.destroy();document.getElementById('e04-large-probe').remove();
      delete window.__large;delete window.__largeStore;delete window.__largeInitial;
      delete window.__largePack;delete window.__largeMount;
    });
    assert.deepEqual(await page.evaluate(()=>[
      localStorage.getItem('wondervale-s01e02-progress-v1'),
      localStorage.getItem('wondervale-s01e03-progress-v1')
    ]),unchanged,'Eight-card review cannot modify earlier chapter saves');

    // Near-cap keyboard/touch regression: synthesize only the setup history,
    // then make the 250th edit through the actual browser UI.
    const nearCap=await page.evaluate(async ({pack,key})=>{
      const {fresh,dispatch,MAX_ACTIONS}=await import('/engine/s01e04-chronology.mjs');
      let state=dispatch(fresh(pack),{type:'inspect-card',id:'first-map'},pack);
      for(let i=1;i<MAX_ACTIONS-1;i++)
        state=dispatch(state,{type:'place',id:'first-map',slot:i%2?'earlier':'later'},pack);
      localStorage.setItem(key,JSON.stringify(state));
      return {count:state.history.length,slot:state.slots['first-map']};
    },{pack,key:DRAFT_KEY});
    assert.equal(nearCap.count,249);
    assert.equal(nearCap.slot,'later');
    await page.reload();
    await page.evaluate(async ({pack,e02Save,e03Save})=>{
      const {mountE04Authoring}=await import('/e04/authoring-ui.mjs');
      window.__e04=mountE04Authoring(document.getElementById('e04-root'),{
        pack,e02Save,e03Save,storage:localStorage
      });
    },{pack,e02Save,e03Save});
    // Page reload resets the earlier Storage.prototype test hook; reinstall it
    // before the capped write so this is a real browser failure, not a no-op flag.
    await page.evaluate(key=>{
      const original=Storage.prototype.setItem;
      Storage.prototype.setItem=function(k,v){
        if(k===key && window.__e04Blocked)throw new Error('Simulated quota at cap');
        return original.call(this,k,v);
      };
      window.__e04Blocked=true;
    },DRAFT_KEY);
    const checkpoint249=await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY);
    await page.locator('[data-focus-key="place:first-map:earlier"]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(()=>window.__e04.getState().history.length),250);
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY),checkpoint249,
      'A blocked 250th write leaves the 249-action checkpoint intact');
    assert.equal(await page.locator('[data-focus-key="retry-save"]').count(),1);
    const capAlert=page.locator('.e04-save-warning[role="alert"]').first();
    assert.match(await capAlert.innerText(),/250-change safety limit/);
    assert.equal(await capAlert.evaluate(node=>document.activeElement===node),true,
      'The final edit must focus the limit alert, not an off-screen restart control');
    const capPosition=await capAlert.evaluate(node=>({
      top:node.getBoundingClientRect().top,bottom:node.getBoundingClientRect().bottom,height:innerHeight
    }));
    assert.ok(capPosition.top>=-1&&capPosition.top<capPosition.height,
      'Limit alert must be visible on short screens: '+JSON.stringify(capPosition));
    await layout('250-action cap '+size.width);
    assert.equal(await page.locator('[data-focus-key="place:first-map:earlier"]').isDisabled(),true);
    await page.keyboard.press('Tab');
    assert.equal(await focusKey(),'retry-save','Failed capped save keeps Retry saving reachable');
    await page.keyboard.press('Enter');
    assert.equal(await focusKey(),'retry-save','A failed retry retains keyboard focus');
    await page.evaluate(()=>{window.__e04Blocked=false;});
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(()=>window.__e04.getState().history.length),250);
    const savedStatus=page.locator('.e04-save-success[role="status"]');
    assert.equal(await savedStatus.count(),1);
    assert.equal(await savedStatus.evaluate(node=>document.activeElement===node),true,
      'Successful retry must focus the save confirmation, not the restart footer');
    assert.notEqual(await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY),checkpoint249);
    await layout('250-action retry recovered '+size.width);
    await page.keyboard.press('Tab');
    assert.equal(await focusKey(),'reset','Tab from saved status reaches the enabled restart action');
    await page.keyboard.press('Enter');
    assert.equal(await focusKey(),'keep-reset');
    await page.keyboard.press('Enter');
    assert.equal(await focusKey(),'reset');
    assert.equal(await page.evaluate(()=>window.__e04.getState().history.length),250,
      'Cancelling restart must retain the capped draft');
    assert.deepEqual(await page.evaluate(()=>[
      localStorage.getItem('wondervale-s01e02-progress-v1'),
      localStorage.getItem('wondervale-s01e03-progress-v1')
    ]),unchanged,'Near-cap editing must not touch earlier chapter saves');
    assert.deepEqual(errors,[],'No browser exceptions');
    await context.close();
    console.log('PASS E04 browser responsive, Chronicle, storage retry: '+size.width+'x'+size.height);
  }
} finally {await browser.close();}
));
    assert.equal(await page.locator('[data-focus-key="keep-reset"]').getAttribute('aria-describedby'),failureDescription);
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY),saved);
    await layout('failed reset '+size.width);
    await page.evaluate(()=>{window.__e04ResetBlocked=false;});
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(()=>window.__e04.getState().phase),'sources');
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY),null);
    const heading=page.locator('.e04-authoring h2');
    assert.equal(await heading.evaluate(node=>document.activeElement===node),true,
      'After clearing, focus should return to the beginning of the new draft');
    const headingPosition=await heading.evaluate(node=>({
      top:node.getBoundingClientRect().top,height:innerHeight
    }));
    assert.ok(headingPosition.top>=-1 && headingPosition.top<headingPosition.height,
      'Restart heading should be visible on short screens: '+JSON.stringify(headingPosition));
    await page.keyboard.press('Tab');
    assert.equal(await focusKey(),'memory:station','Tab from heading enters the first action');
    await page.keyboard.press('Tab');
    assert.equal(await focusKey(),'memory:garden');
    await page.keyboard.press('Enter');
    assert.deepEqual(await page.evaluate(()=>window.__e04.getState().memoryViewed),['garden']);
    assert.equal(await focusKey(),'inspect:first-map',
      'Inspecting a memory must not strand focus on its disabled button');
    await page.keyboard.press('Enter');
    assert.deepEqual(await page.evaluate(()=>window.__e04.getState().cardViewed),['first-map']);
    assert.equal(await focusKey(),'place:first-map:earlier',
      'Inspecting a card advances focus to an enabled placement');
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(()=>window.__e04.getState().slots['first-map']),'earlier');
    assert.deepEqual(await page.evaluate(()=>[
      localStorage.getItem('wondervale-s01e02-progress-v1'),
      localStorage.getItem('wondervale-s01e03-progress-v1')
    ]),unchanged,'Keyboard restart and new draft must not modify earlier episodes');
    await layout('keyboard and restart '+size.width);
    // A browser reload must recover the exact draft checkpoint, not just the
    // visible phase. Synthetic fixture only; no production E04 route is served.
    const beforeReload=await page.evaluate(()=>window.__e04.getState());
    const checkpoint=await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY);
    assert.ok(checkpoint,'Partial draft should persist before reload');
    await page.reload();
    await page.evaluate(async ({pack,e02Save,e03Save})=>{
      const {mountE04Authoring}=await import('/e04/authoring-ui.mjs');
      window.__e04=mountE04Authoring(document.getElementById('e04-root'),{
        pack,e02Save,e03Save,storage:localStorage
      });
    },{pack,e02Save,e03Save});
    assert.deepEqual(await page.evaluate(()=>window.__e04.getState()),beforeReload,
      'Reload must restore the exact event-replayed draft');
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY),checkpoint);
    assert.equal(await page.locator('[data-focus-key="resume"]').count(),1,
      'A valid saved draft must offer a visible continuation shortcut');
    await action('resume');
    assert.equal(await focusKey(),'memory:station',
      'Resume must return to the unfinished station memory, not the already inspected garden memory');
    const resumedControl=await page.locator('[data-focus-key="memory:station"]').evaluate(node=>{
      const r=node.getBoundingClientRect();
      return {top:r.top,bottom:r.bottom,height:innerHeight,focused:document.activeElement===node};
    });
    assert.ok(resumedControl.focused && resumedControl.top>=-1 && resumedControl.top<resumedControl.height,
      'Resume must scroll the next action into view on mobile/desktop: '+JSON.stringify(resumedControl));
    assert.deepEqual(await page.evaluate(()=>window.__e04.getState()),beforeReload,
      'Resume is navigation only and cannot alter the draft');
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY),checkpoint,
      'Resume must not write a new checkpoint');

    // Historical replay is isolated even when a valid draft exists on disk.
    const replay=await page.evaluate(async ({pack,e02Save,e03Save,key})=>{
      const {mountE04Authoring}=await import('/e04/authoring-ui.mjs');
      const root=document.createElement('div');
      root.id='e04-replay-probe';
      document.body.append(root);
      const ui=mountE04Authoring(root,{
        pack,e02Save,e03Save,storage:localStorage,mode:'historical_replay'
      });
      root.querySelector('[data-focus-key="memory:station"]').click();
      const state=ui.getState();
      ui.reset();
      const after=localStorage.getItem(key);
      ui.destroy();root.remove();
      return {ready:ui.ready,state,after};
    },{pack,e02Save,e03Save,key:DRAFT_KEY});
    assert.equal(replay.ready,true);
    assert.equal(replay.state.mode,'historical_replay');
    assert.deepEqual(replay.state.memoryViewed,['station']);
    assert.equal(replay.after,checkpoint,'Historical replay must not overwrite E04 draft');
    assert.deepEqual(await page.evaluate(()=>window.__e04.getState()),beforeReload,
      'Historical replay must not mutate the mounted draft');

    // Corrupt or forged storage is rejected on reload without erasing the
    // earlier episodes; a subsequent valid action can replace the bad bytes.
    const corrupt='{"schema":1,"history":[{"type":"finish"}]}';
    await page.evaluate(({key,corrupt})=>localStorage.setItem(key,corrupt),
      {key:DRAFT_KEY,corrupt});
    await page.reload();
    await page.evaluate(async ({pack,e02Save,e03Save})=>{
      const {mountE04Authoring}=await import('/e04/authoring-ui.mjs');
      window.__e04=mountE04Authoring(document.getElementById('e04-root'),{
        pack,e02Save,e03Save,storage:localStorage
      });
    },{pack,e02Save,e03Save});
    const recovered=await page.evaluate(()=>window.__e04.getState());
    assert.equal(recovered.phase,'sources','Corrupt checkpoint must open a clean draft');
    assert.deepEqual(recovered.history,[],'Forged history must not be replayed');
    assert.equal(await page.locator('[data-focus-key="resume"]').count(),0,
      'A forged checkpoint must not show a continuation shortcut');
    assert.deepEqual(recovered.memoryViewed,[]);
    assert.equal(await page.getByText('The previous Episode 04 draft could not be restored',{exact:false}).count(),1,
      'Corrupt checkpoint must visibly warn the user');
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY),corrupt,
      'Loading must not silently delete or rewrite storage');
    await action('memory:station');
    assert.equal(await page.getByText('The previous Episode 04 draft could not be restored',{exact:false}).count(),0,
      'Warning clears after a valid replacement checkpoint');
    const repaired=await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY);
    assert.ok(repaired && repaired!==corrupt,'A valid action replaces corrupt storage');
    await page.reload();
    await page.evaluate(async ({pack,e02Save,e03Save})=>{
      const {mountE04Authoring}=await import('/e04/authoring-ui.mjs');
      window.__e04=mountE04Authoring(document.getElementById('e04-root'),{
        pack,e02Save,e03Save,storage:localStorage
      });
    },{pack,e02Save,e03Save});
    assert.deepEqual(await page.evaluate(()=>window.__e04.getState().memoryViewed),['station'],
      'Repaired checkpoint must survive another reload');
    assert.deepEqual(await page.evaluate(()=>[
      localStorage.getItem('wondervale-s01e02-progress-v1'),
      localStorage.getItem('wondervale-s01e03-progress-v1')
    ]),unchanged,'Reload, replay and corruption recovery must preserve E02/E03');
    await layout('reload and replay '+size.width);

    // A restored, fully placed but unsupported chronology must show a neutral
    // cue on phone and desktop, without exposing which slot is correct.
    await page.evaluate(async ({pack,key})=>{
      const {fresh,dispatch}=await import('/engine/s01e04-chronology.mjs');
      let state=fresh(pack);
      for(const which of ['station','garden'])
        state=dispatch(state,{type:'inspect-memory',which},pack);
      for(const card of pack.cards)
        state=dispatch(state,{type:'inspect-card',id:card.id},pack);
      for(const clue of pack.clues)
        state=dispatch(state,{type:'inspect-clue',id:clue.id},pack);
      for(const [id,slot] of [
        ['first-map','later'],['later-record','earlier'],['undated-photo','uncertain']
      ])state=dispatch(state,{type:'place',id,slot},pack);
      localStorage.setItem(key,JSON.stringify(state));
    },{pack,key:DRAFT_KEY});
    await page.reload();
    await page.evaluate(async ({pack,e02Save,e03Save})=>{
      const {mountE04Authoring}=await import('/e04/authoring-ui.mjs');
      window.__e04=mountE04Authoring(document.getElementById('e04-root'),{
        pack,e02Save,e03Save,storage:localStorage
      });
    },{pack,e02Save,e03Save});
    const unsupported=await page.evaluate(()=>window.__e04.getState());
    const unsupportedCheckpoint=await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY);
    const reviewCue=page.locator('.e04-review-cue');
    assert.equal(await reviewCue.count(),1,'Unsupported timeline shows review cue');
    const cueText=await reviewCue.innerText();
    assert.doesNotMatch(cueText,/First map|Later record|Earlier|Later/,
      'Review cue must not reveal the expected card positions');
    await action('resume');
    assert.equal(await reviewCue.evaluate(node=>document.activeElement===node),true,
      'Restored unsupported timeline must focus the neutral review cue');
    await layout('unsupported review cue '+size.width);
    assert.equal(await page.locator('[data-focus-key^="review-card:"]').count(),3,
      'Every placed source offers a neutral direct-review action');
    await action('review-card:later-record');
    const reviewedHeading=page.locator('.e04-card h4').filter({hasText:'Later record'});
    assert.equal(await reviewedHeading.evaluate(node=>document.activeElement===node),true,
      'Direct review focuses the chosen source heading, never a correct answer');
    await action('back-to-review:later-record');
    const overviewHeading=page.locator('.e04-position-review h4');
    assert.equal(await overviewHeading.evaluate(node=>document.activeElement===node),true,
      'Return shortcut focuses the overview on short screens');
    const overviewRect=await overviewHeading.evaluate(node=>({
      top:node.getBoundingClientRect().top,height:innerHeight
    }));
    assert.ok(overviewRect.top>=-1 && overviewRect.top<overviewRect.height,
      'Review overview must scroll into view: '+JSON.stringify(overviewRect));
    assert.deepEqual(await page.evaluate(()=>window.__e04.getState()),unsupported);
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY),unsupportedCheckpoint);
    await layout('review jump and return '+size.width);
    await action('review-positions');
    const sourceHeading=page.locator('.e04-panel h3').filter({hasText:'Source cards'});
    assert.equal(await sourceHeading.evaluate(node=>document.activeElement===node),true,
      'Review button focuses source heading, not a particular slot');
    await page.keyboard.press('Tab');
    assert.equal(await focusKey(),'place:first-map:earlier',
      'Keyboard reaches first enabled source choice from review heading');
    assert.deepEqual(await page.evaluate(()=>window.__e04.getState()),unsupported,
      'Review navigation cannot mutate the draft');
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY),unsupportedCheckpoint,
      'Review navigation cannot rewrite the checkpoint');
    await action('place:first-map:earlier');
    assert.equal(await reviewCue.count(),1,'Cue persists until all order constraints are met');
    await action('place:later-record:later');
    assert.equal(await reviewCue.count(),0,'Cue clears once relative order is supported');
    assert.equal(await page.locator('[data-focus-key="explain"]').isEnabled(),true);
    assert.deepEqual(await page.evaluate(()=>[
      localStorage.getItem('wondervale-s01e02-progress-v1'),
      localStorage.getItem('wondervale-s01e03-progress-v1')
    ]),unchanged,'Review and edits cannot change E02/E03 saves');
    await layout('corrected review cue '+size.width);

    // Eight synthetic cards stress navigation, long labels, and repeated edits
    // on short landscape as well as portrait/desktop. No canonical content or
    // production route is created, and the test store is isolated from E02/E03.
    await page.evaluate(async ({e02Save,e03Save})=>{
      const {fresh,dispatch,DRAFT_KEY}=await import('/engine/s01e04-chronology.mjs');
      const {mountE04Authoring}=await import('/e04/authoring-ui.mjs');
      const largePack={
        id:'large-navigation-fixture',revision:'test-r1',
        cards:Array.from({length:8},(_,i)=>({
          id:'source-'+(i+1),
          label:i===7?'LongSyntheticSourceLabelWithoutSpaces'.repeat(3):'Synthetic source '+(i+1),
          kind:i%2?'document':'map'
        })),
        clues:[{id:'synthetic-clue',label:'Synthetic revision clue',text:'Synthetic test-only clue.'}],
        relativeOrder:{earlier:'source-1',later:'source-2',basis:'synthetic-clue'}
      };
      let state=fresh(largePack);
      for(const which of ['station','garden'])
        state=dispatch(state,{type:'inspect-memory',which},largePack);
      for(const card of largePack.cards)
        state=dispatch(state,{type:'inspect-card',id:card.id},largePack);
      state=dispatch(state,{type:'inspect-clue',id:'synthetic-clue'},largePack);
      for(const card of largePack.cards)
        state=dispatch(state,{type:'place',id:card.id,
          slot:card.id==='source-1'?'later':card.id==='source-2'?'earlier':'uncertain'},largePack);
      const store={
        value:JSON.stringify(state),writes:0,
        getItem(k){return k===DRAFT_KEY?this.value:null;},
        setItem(k,v){if(k===DRAFT_KEY){this.value=v;this.writes++;}},
        removeItem(k){if(k===DRAFT_KEY)this.value=null;}
      };
      const root=document.createElement('div');
      root.id='e04-large-probe';document.body.append(root);
      window.__largeStore=store;
      window.__largePack=largePack;
      window.__largeMount=mountE04Authoring;
      window.__large=mountE04Authoring(root,{pack:largePack,e02Save,e03Save,storage:store});
      window.__largeInitial=state.history.length;
    },{e02Save,e03Save});
    const largeRoot=page.locator('#e04-large-probe');
    const largeAction=async key=>{
      const b=largeRoot.locator('[data-focus-key="'+key+'"]');
      if(mobile)await b.tap();else await b.click();
    };
    assert.equal(await largeRoot.locator('[data-focus-key^="review-card:"]').count(),8);
    await layout('eight-card overview '+size.width);
    await largeAction('review-card:source-8');
    const lastHeading=largeRoot.locator('.e04-card h4').filter({hasText:'LongSyntheticSourceLabelWithoutSpaces'});
    const lastRect=await lastHeading.evaluate(node=>({
      top:node.getBoundingClientRect().top,height:innerHeight,
      focused:document.activeElement===node
    }));
    assert.ok(lastRect.focused && lastRect.top>=-1 && lastRect.top<lastRect.height,
      'Long-label last source must be focused and visible: '+JSON.stringify(lastRect));
    await largeAction('back-to-review:source-8');
    const backRect=await largeRoot.locator('.e04-position-review h4').evaluate(node=>({
      top:node.getBoundingClientRect().top,height:innerHeight,
      focused:document.activeElement===node
    }));
    assert.ok(backRect.focused && backRect.top>=-1 && backRect.top<backRect.height,
      'Return from last source must show the overview: '+JSON.stringify(backRect));
    assert.equal(await page.evaluate(()=>window.__largeStore.writes),0,
      'Navigation alone must never rewrite the draft');
    await largeAction('review-card:source-1');
    await largeAction('place:source-1:earlier');
    assert.equal(await largeRoot.locator('.e04-review-cue').count(),1);
    await largeAction('back-to-review:source-1');
    await largeAction('review-card:source-2');
    await largeAction('place:source-2:later');
    assert.equal(await largeRoot.locator('.e04-review-cue').count(),0,
      'Supported order removes all review-only navigation');
    assert.equal(await largeRoot.locator('[data-focus-key^="review-card:"]').count(),0);
    assert.equal(await page.evaluate(()=>window.__largeStore.writes),2,
      'Only the two real revisions write checkpoints');
    assert.equal(await page.evaluate(()=>window.__large.getState().history.length-window.__largeInitial),2);
    await layout('eight-card resolved '+size.width);
    // A failed write must be visible at 568x320 and must not silently claim
    // the latest timeline revisions were persisted. This fixture is isolated.
    const largeCheckpoint=await page.evaluate(()=>window.__largeStore.value);
    await page.evaluate(()=>{
      const store=window.__largeStore,original=store.setItem.bind(store);
      store.blocked=true;
      store.setItem=function(k,v){
        if(this.blocked)throw new Error('Simulated E04 storage quota');
        original(k,v);
      };
    });
    await largeAction('place:source-1:later');
    const unsaved=largeRoot.locator('.e04-save-warning[role="alert"]');
    assert.equal(await unsaved.count(),1);
    const alertRect=await unsaved.evaluate(node=>({
      top:node.getBoundingClientRect().top,height:innerHeight,
      focused:document.activeElement===node
    }));
    assert.ok(alertRect.focused && alertRect.top>=-1 && alertRect.top<alertRect.height,
      'First failed write must focus visible warning: '+JSON.stringify(alertRect));
    assert.equal(await page.evaluate(()=>window.__largeStore.value),largeCheckpoint);
    await largeAction('retry-save');
    assert.equal(await largeRoot.locator('[data-focus-key="retry-save"]').evaluate(
      node=>document.activeElement===node),true);
    await largeAction('place:source-1:earlier');
    assert.equal(await page.evaluate(()=>window.__largeStore.value),largeCheckpoint);
    assert.equal(await largeRoot.locator('[data-focus-key="place:source-1:earlier"]').evaluate(
      node=>document.activeElement===node),true,
    'Repeated failure should leave focus at the current source choice');
    await page.evaluate(()=>{window.__largeStore.blocked=false;});
    await largeAction('place:source-1:later');
    const savedNotice=largeRoot.locator('.e04-save-success[role="status"]');
    assert.equal(await savedNotice.count(),1,
      'Later successful edit must announce recovery even without Retry');
    assert.equal(await savedNotice.evaluate(node=>document.activeElement===node),true);
    const recoveredState=await page.evaluate(()=>window.__large.getState());
    const recoveredBytes=await page.evaluate(()=>window.__largeStore.value);
    assert.deepEqual(JSON.parse(recoveredBytes),recoveredState);
    assert.equal(await page.evaluate(()=>window.__largeStore.writes),3,
      'Blocked edits and failed retry cannot count as saved checkpoints');
    await page.evaluate(({e02Save,e03Save})=>{
      const root=document.getElementById('e04-large-probe');
      window.__large.destroy();
      window.__large=mountLargeAgain(root,e02Save,e03Save);
      function mountLargeAgain(target,e02,e03){
        // Preserve the exact same synthetic source pack and storage on remount.
        return window.__largeMount(target,{pack:window.__largePack,
          e02Save:e02,e03Save:e03,storage:window.__largeStore});
      }
    },{e02Save,e03Save});
    assert.deepEqual(await page.evaluate(()=>window.__large.getState()),recoveredState,
      'Remount after recovered write must replay all revisions');
    await largeAction('resume');
    assert.equal(await largeRoot.locator('.e04-review-cue').evaluate(
      node=>document.activeElement===node),true);
    await page.evaluate(()=>{window.__largeStore.blocked=true;});
    await largeAction('place:source-2:earlier');
    assert.equal(await page.evaluate(()=>window.__largeStore.value),recoveredBytes);
    await page.evaluate(({e02Save,e03Save})=>{
      const root=document.getElementById('e04-large-probe');
      window.__large.destroy();
      window.__large=window.__largeMount(root,{pack:window.__largePack,
        e02Save,e03Save,storage:window.__largeStore});
    },{e02Save,e03Save});
    assert.deepEqual(await page.evaluate(()=>window.__large.getState()),recoveredState,
      'After another failed write, remount must restore last persisted state');
    await layout('eight-card save recovery '+size.width);
    await page.evaluate(()=>{
      window.__large.destroy();document.getElementById('e04-large-probe').remove();
      delete window.__large;delete window.__largeStore;delete window.__largeInitial;
      delete window.__largePack;delete window.__largeMount;
    });
    assert.deepEqual(await page.evaluate(()=>[
      localStorage.getItem('wondervale-s01e02-progress-v1'),
      localStorage.getItem('wondervale-s01e03-progress-v1')
    ]),unchanged,'Eight-card review cannot modify earlier chapter saves');

    // Near-cap keyboard/touch regression: synthesize only the setup history,
    // then make the 250th edit through the actual browser UI.
    const nearCap=await page.evaluate(async ({pack,key})=>{
      const {fresh,dispatch,MAX_ACTIONS}=await import('/engine/s01e04-chronology.mjs');
      let state=dispatch(fresh(pack),{type:'inspect-card',id:'first-map'},pack);
      for(let i=1;i<MAX_ACTIONS-1;i++)
        state=dispatch(state,{type:'place',id:'first-map',slot:i%2?'earlier':'later'},pack);
      localStorage.setItem(key,JSON.stringify(state));
      return {count:state.history.length,slot:state.slots['first-map']};
    },{pack,key:DRAFT_KEY});
    assert.equal(nearCap.count,249);
    assert.equal(nearCap.slot,'later');
    await page.reload();
    await page.evaluate(async ({pack,e02Save,e03Save})=>{
      const {mountE04Authoring}=await import('/e04/authoring-ui.mjs');
      window.__e04=mountE04Authoring(document.getElementById('e04-root'),{
        pack,e02Save,e03Save,storage:localStorage
      });
    },{pack,e02Save,e03Save});
    // Page reload resets the earlier Storage.prototype test hook; reinstall it
    // before the capped write so this is a real browser failure, not a no-op flag.
    await page.evaluate(key=>{
      const original=Storage.prototype.setItem;
      Storage.prototype.setItem=function(k,v){
        if(k===key && window.__e04Blocked)throw new Error('Simulated quota at cap');
        return original.call(this,k,v);
      };
      window.__e04Blocked=true;
    },DRAFT_KEY);
    const checkpoint249=await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY);
    await page.locator('[data-focus-key="place:first-map:earlier"]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(()=>window.__e04.getState().history.length),250);
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY),checkpoint249,
      'A blocked 250th write leaves the 249-action checkpoint intact');
    assert.equal(await page.locator('[data-focus-key="retry-save"]').count(),1);
    const capAlert=page.locator('.e04-save-warning[role="alert"]').first();
    assert.match(await capAlert.innerText(),/250-change safety limit/);
    assert.equal(await capAlert.evaluate(node=>document.activeElement===node),true,
      'The final edit must focus the limit alert, not an off-screen restart control');
    const capPosition=await capAlert.evaluate(node=>({
      top:node.getBoundingClientRect().top,bottom:node.getBoundingClientRect().bottom,height:innerHeight
    }));
    assert.ok(capPosition.top>=-1&&capPosition.top<capPosition.height,
      'Limit alert must be visible on short screens: '+JSON.stringify(capPosition));
    await layout('250-action cap '+size.width);
    assert.equal(await page.locator('[data-focus-key="place:first-map:earlier"]').isDisabled(),true);
    await page.keyboard.press('Tab');
    assert.equal(await focusKey(),'retry-save','Failed capped save keeps Retry saving reachable');
    await page.keyboard.press('Enter');
    assert.equal(await focusKey(),'retry-save','A failed retry retains keyboard focus');
    await page.evaluate(()=>{window.__e04Blocked=false;});
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(()=>window.__e04.getState().history.length),250);
    const savedStatus=page.locator('.e04-save-success[role="status"]');
    assert.equal(await savedStatus.count(),1);
    assert.equal(await savedStatus.evaluate(node=>document.activeElement===node),true,
      'Successful retry must focus the save confirmation, not the restart footer');
    assert.notEqual(await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY),checkpoint249);
    await layout('250-action retry recovered '+size.width);
    await page.keyboard.press('Tab');
    assert.equal(await focusKey(),'reset','Tab from saved status reaches the enabled restart action');
    await page.keyboard.press('Enter');
    assert.equal(await focusKey(),'keep-reset');
    await page.keyboard.press('Enter');
    assert.equal(await focusKey(),'reset');
    assert.equal(await page.evaluate(()=>window.__e04.getState().history.length),250,
      'Cancelling restart must retain the capped draft');
    assert.deepEqual(await page.evaluate(()=>[
      localStorage.getItem('wondervale-s01e02-progress-v1'),
      localStorage.getItem('wondervale-s01e03-progress-v1')
    ]),unchanged,'Near-cap editing must not touch earlier chapter saves');
    assert.deepEqual(errors,[],'No browser exceptions');
    await context.close();
    console.log('PASS E04 browser responsive, Chronicle, storage retry: '+size.width+'x'+size.height);
  }
} finally {await browser.close();}
