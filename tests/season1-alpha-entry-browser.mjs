// Local Season 1 Alpha launcher: isolated dev origin, ordered scene entry and responsive shell.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const alphaBase=process.env.WONDERVALE_ALPHA_TEST_URL||'http://127.0.0.1:4174';
const otherOrigin=process.env.WONDERVALE_OTHER_ORIGIN||'http://127.0.0.1:4173';
const sizes=[
  {width:1366,height:900,label:'desktop'},
  {width:568,height:320,label:'phone-landscape-small'},
  {width:667,height:375,label:'phone-landscape-wide'},
  {width:390,height:844,label:'phone-portrait'}
];
const browser=await chromium.launch({headless:true});
try{
  for(const size of sizes){
    const context=await browser.newContext({viewport:size,reducedMotion:'reduce',hasTouch:size.width<700});
    try{
      const production=await context.newPage();
      assert.equal((await production.goto(otherOrigin+'/'))?.status(),200);
      await production.evaluate(()=>localStorage.setItem('wondervale-s01e03-progress-v1','isolated-origin-sentinel'));
      const productionOrigin=await production.evaluate(()=>location.origin);
      await production.close();

      const page=await context.newPage(),errors=[];
      page.on('pageerror',error=>errors.push(error.message));
      assert.equal((await page.goto(alphaBase+'/season-alpha/'))?.status(),200);
      assert.match(await page.title(),/Season 1 Alpha/);
      assert.match(await page.locator('.boundary-note').innerText(),/Noncanonical alpha/);
      assert.equal(await page.evaluate(()=>location.origin===parent.location.origin),true);
      assert.notEqual(await page.evaluate(()=>location.origin),productionOrigin);
      assert.equal(await page.evaluate(()=>localStorage.getItem('wondervale-s01e03-progress-v1')),null,
        'the alpha origin cannot read the other origin’s save sentinel');
      assert.match(await page.locator('#scene-position').innerText(),/Scene 1 of 12/);
      await page.locator('iframe[data-frame-key="e01"][data-loaded="true"]').waitFor();

      const widths=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));
      assert.ok(widths.scroll<=widths.viewport+1,JSON.stringify({size,widths}));
      for(const target of await page.locator('button:visible:not(:disabled)').evaluateAll(buttons=>buttons.map(button=>{
        const box=button.getBoundingClientRect();return {width:box.width,height:box.height,label:button.innerText};
      })))assert.ok(target.width>=43.5&&target.height>=43.5,JSON.stringify({size,target}));

      await page.locator('#scene-steps [data-slot="4"]').click();
      await page.locator('iframe[data-frame-key="e04"][data-loaded="true"]').waitFor();
      await page.frameLocator('iframe[data-frame-key="e04"]').getByRole('heading',{
        name:'Episode 04 is not available yet'
      }).waitFor();
      assert.match(await page.locator('#scene-position').innerText(),/Scene 4 of 12/);
      assert.equal(await page.evaluate(()=>localStorage.getItem('wondervale-s01e03-progress-v1')),null);
      assert.deepEqual(errors,[],`${size.label} page errors`);
    }finally{await context.close();}
  }

  const context=await browser.newContext({viewport:{width:568,height:320},reducedMotion:'reduce'});
  try{
    const page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(alphaBase+'/season-alpha/');
    await page.locator('#scene-steps [data-slot="2"]').focus();
    await page.keyboard.press('Enter');
    assert.match(await page.locator('#scene-position').innerText(),/Scene 2 of 12/);
    await page.locator('iframe[data-frame-key="e02"][data-loaded="true"]').waitFor();
    const e02=page.locator('iframe[data-frame-key="e02"]');
    const e02Loads=Number(await e02.getAttribute('data-load-count'));
    await page.frameLocator('iframe[data-frame-key="e02"]').getByRole('heading',{name:'Riverside is next'}).waitFor();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    assert.match(await page.locator('#scene-position').innerText(),/Scene 3 of 12/);
    await page.locator('iframe[data-frame-key="e01"]').evaluate(frame=>{
      if(getComputedStyle(frame).display!=='none')throw new Error('previous scene iframe remains visible');
    });
    await page.frameLocator('iframe[data-frame-key="e03"]').getByRole('heading',{
      name:'Market Lane comes after Riverside'
    }).waitFor();
    const e03=page.locator('iframe[data-frame-key="e03"]');
    const e03Loads=Number(await e03.getAttribute('data-load-count'));

    await page.locator('#scene-steps [data-slot="4"]').click();
    await page.frameLocator('iframe[data-frame-key="e04"]').getByRole('heading',{
      name:'Episode 04 is not available yet'
    }).waitFor();
    const e04=page.locator('iframe[data-frame-key="e04"]');
    const e04Loads=Number(await e04.getAttribute('data-load-count'));

    await page.locator('#scene-steps [data-slot="1"]').click();
    for(const [slot,frame,loads,key,heading] of [
      [2,e02,e02Loads,'e02','Riverside is next'],
      [3,e03,e03Loads,'e03','Market Lane comes after Riverside'],
      [4,e04,e04Loads,'e04','Episode 04 is not available yet']
    ]){
      await page.locator(`#scene-steps [data-slot="${slot}"]`).click();
      await page.waitForFunction(({frameKey,count})=>{
        const el=document.querySelector(`iframe[data-frame-key="${frameKey}"]`);
        return el?.dataset.loaded==='true'&&Number(el.dataset.loadCount)>count;
      },{frameKey:key,count:loads});
      assert.ok(Number(await frame.getAttribute('data-load-count'))>loads,
        `blocked scene ${slot} rechecks its gate when revisited`);
      await page.frameLocator(`iframe[data-frame-key="${key}"]`).getByRole('heading',{name:heading}).waitFor();
    }
    await page.locator('#scene-steps [data-slot="1"]').click();
    for(let scene=2;scene<=12;scene++){
      await page.locator('#next-scene').click();
      await page.waitForFunction(n=>document.querySelector('#scene-position')?.textContent===`Scene ${n} of 12`,scene);
      const slot=String(scene).padStart(2,'0');
      assert.equal(await page.locator(`#scene-steps [data-slot="${scene}"]`).getAttribute('aria-current'),'step');
      const frameKey=({2:'e02',3:'e03',4:'e04',5:'e05',6:'e06',7:'e06',8:'e07',9:'e08',10:'e09',11:'e10',12:'e11'})[scene];
      await page.locator(`iframe[data-frame-key="${frameKey}"][data-loaded="true"]`).waitFor();
      assert.ok(await page.locator(`#scene-steps [data-slot="${scene}"]`).isVisible(),`scene ${slot}`);
      for(const oldFrame of await page.locator('.scene-frame iframe[hidden]').all()){
        assert.equal(await oldFrame.evaluate(el=>getComputedStyle(el).display),'none',
          'inactive episode frames stay hidden');
      }
      if(scene===6){
        const e06=page.locator('iframe[data-frame-key="e06"]');
        await e06.evaluate(frame=>{frame.dataset.beforeLower=frame.dataset.loadCount;});
      }
      if(scene===7){
        const e06=page.locator('iframe[data-frame-key="e06"]');
        assert.equal(await e06.getAttribute('data-load-count'),await e06.getAttribute('data-before-lower'),
          'Current and Lower Garden slots keep one live E06 scene instance');
        assert.match(await page.locator('#scene-handoff-note').innerText(),/Walk to Lower Garden PAPER model/);
      }
    }
    assert.equal(await page.locator('#next-scene').isDisabled(),true);
    assert.equal(await page.locator('#scene-steps [data-opened="true"]').count(),12);
    assert.deepEqual(errors,[],'full sequence shell page errors');
  }finally{await context.close();}

  const storyContext=await browser.newContext({viewport:{width:568,height:320},reducedMotion:'reduce',hasTouch:true});
  try{
    const page=await storyContext.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(alphaBase+'/season-alpha/');
    await page.locator('#scene-steps [data-slot="9"]').click();
    await page.locator('iframe[data-frame-key="e08"][data-loaded="true"]').waitFor();
    const e08=page.frameLocator('iframe[data-frame-key="e08"]');
    const hit=async key=>{
      const action=e08.locator(`[data-key="${key}"]`);
      assert.equal(await action.isDisabled(),false,key);
      await action.click();
    };
    for(const key of ['start','inspect-brackets','inspect-boundary','inspect-a','lamp-a',
      'walk-landing','inspect-b','lamp-b','walk-base','observe','walk-landing',
      'walk-side','observe','compare','inspect-plate','finish'])await hit(key);
    await e08.locator('#e09-transfer').waitFor({state:'visible'});
    await e08.locator('#e09-transfer').click();
    await page.getByText('Scene 10 of 12').waitFor();
    await page.locator('iframe[data-frame-key="e09"][data-loaded="true"]').waitFor();
    const e09=page.frameLocator('iframe[data-frame-key="e09"]');
    assert.match(await page.locator('iframe[data-frame-key="e09"]').evaluate(frame=>frame.contentWindow.location.hash),
      /^#paper-hill=/,'the alpha carries the replay-built E08 transfer URL');
    assert.match(await e09.locator('#lantern-context').innerText(),/SAME marks looked different/);
    assert.match(await e09.locator('#lantern-context').innerText(),/CLOSED hill/);

    const hitE09=async key=>{
      const action=e09.locator(`[data-key="${key}"]`);
      assert.equal(await action.isDisabled(),false,key);
      await action.click();
    };
    for(const key of ['start','inspect-entry_note','walk-signpost','inspect-boundary_sign',
      'walk-fence_view','walk-upper_closed','inspect-disturbed_ground','walk-signpost',
      'walk-lower_bend','inspect-runoff_marks','walk-overlook','inspect-distant_symbol'])await hitE09(key);
    await e09.locator('[data-sightline-select="light"]').click();
    await e09.locator('[data-sightline-site="overlook"]').click();
    await e09.locator('[data-sightline-select="view"]').click();
    await e09.locator('[data-sightline-site="fence_view"]').click();
    await e09.locator('#sightline-compare').click();
    assert.match(await e09.locator('#sightline-feedback').innerText(),/do not yet match/,
      'Milo sees the mistaken questions before revising them');
    await e09.locator('[data-sightline-select="light"]').click();
    await e09.locator('[data-sightline-site="fence_view"]').click();
    await e09.locator('[data-sightline-select="view"]').click();
    await e09.locator('[data-sightline-site="overlook"]').click();
    await e09.locator('#sightline-compare').click();
    assert.match(await e09.locator('#sightline-feedback').innerText(),/NOT DONE/);
    await hitE09('mark-steps_base:signpost');
    await hitE09('mark-signpost:lower_bend');
    await hitE09('mark-lower_bend:overlook');
    await hitE09('check-route');
    await hitE09('compare-symbol');
    await hitE09('review');
    await hitE09('finish-preview');

    const e08Frame=page.locator('iframe[data-frame-key="e08"]');
    const e08Loads=Number(await e08Frame.getAttribute('data-load-count'));
    await e09.locator('#e08-return').click();
    await page.getByText('Scene 9 of 12').waitFor();
    await page.waitForFunction(count=>{
      const frame=document.querySelector('iframe[data-frame-key="e08"]');
      return frame&&!frame.hidden&&frame.dataset.loaded==='true'&&Number(frame.dataset.loadCount)>count;
    },e08Loads);
    const resumed=page.frameLocator('iframe[data-frame-key="e08"]');
    await resumed.getByText(/E08 finished/).waitFor();
    assert.match(await resumed.locator('#e09-callback').innerText(),/Nia: Milo.*revised PAPER questions.*CLOSED/);
    assert.deepEqual(errors,[],'earned E08/E09 alpha handoff page errors');
  }finally{await storyContext.close();}

  console.log('Season 1 Alpha Chromium PASS: 12 ordered scene slots, E06 state continuity, E04 gate, origin isolation, four viewports, keyboard and replay-earned E08/E09 handoff round trip');
}finally{await browser.close();}
