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
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    assert.match(await page.locator('#scene-position').innerText(),/Scene 3 of 12/);

    await page.locator('#scene-steps [data-slot="1"]').click();
    for(let scene=2;scene<=12;scene++){
      await page.locator('#next-scene').click();
      await page.waitForFunction(n=>document.querySelector('#scene-position')?.textContent===`Scene ${n} of 12`,scene);
      const slot=String(scene).padStart(2,'0');
      assert.equal(await page.locator(`#scene-steps [data-slot="${scene}"]`).getAttribute('aria-current'),'step');
      const frameKey=({2:'e02',3:'e03',4:'e04',5:'e05',6:'e06',7:'e06',8:'e07',9:'e08',10:'e09',11:'e10',12:'e11'})[scene];
      await page.locator(`iframe[data-frame-key="${frameKey}"][data-loaded="true"]`).waitFor();
      assert.ok(await page.locator(`#scene-steps [data-slot="${scene}"]`).isVisible(),`scene ${slot}`);
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
  console.log('Season 1 Alpha Chromium PASS: 12 ordered scene slots, E06 state continuity, E04 gate, origin isolation, four viewports and keyboard');
}finally{await browser.close();}
