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
const browser=await chromium.launch({headless:true});
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
