import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const context=await browser.newContext({viewport});
  try{
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   assert.equal((await page.goto(base+'/e06-scene/'))?.status(),200);
   await page.evaluate(()=>localStorage.setItem('e06-sentinel','keep'));
   const b=key=>page.locator('[data-key="'+key+'"]');
   const hit=async key=>{assert.equal(await b(key).isDisabled(),false,key);await b(key).click();};
   assert.match(await page.locator('.notice').innerText(),/AUTHORING ONLY/);
   assert.equal(await b('enter').isDisabled(),true);
   const spot=id=>page.locator('[data-spot="'+id+'"]');
   const tap=async id=>{assert.equal(await spot(id).isDisabled(),false,id);await spot(id).click();};
   await hit('start');
   await tap('present-bed');
   assert.equal(await spot('present-bed').getAttribute('data-observed'),'true');
   await tap('slope');
   assert.equal(await spot('slope').getAttribute('data-here'),'true');
   await tap('slope');
   await tap('model-tray');
   await hit('run');
   assert.equal(await page.locator('#model-catchment').getAttribute('aria-valuenow'),'0');
   await hit('rain');await hit('run');
   assert.equal(await page.locator('#model-catchment').getAttribute('aria-valuenow'),'1');
   await hit('blocked');await hit('run');
   assert.equal(await page.locator('#model-catchment').getAttribute('aria-valuenow'),'3');
   assert.match(await page.locator('#model-flow-caption').innerText(),/RAIN.*BLOCKED.*3\/3/);
   await hit('compare');await hit('enter');
   assert.equal(await page.locator('#lower-scene').isVisible(),true);
   assert.match(await page.locator('#current-world-note').innerText(),/completed/);
   await tap('runoff-trace');await tap('public-path');await tap('public-path');
   await tap('runoff-channel');await tap('runoff-channel');await hit('check');
   assert.equal(await spot('runoff-channel').getAttribute('data-marker'),'true');
   assert.match(await spot('runoff-channel').innerText(),/WET/);
   assert.match(await page.locator('#marker').innerText(),/WET/);
   await tap('raised-pocket');await tap('raised-pocket');await hit('check');
   assert.equal(await spot('raised-pocket').getAttribute('data-marker'),'true');
   assert.match(await page.locator('#marker').innerText(),/clear/);
   await hit('think');await hit('finish');
   assert.equal(await page.locator('#care-panel').isVisible(),true);
   await hit('heavy-care');await hit('test-care');
   assert.equal(await page.locator('#lower-growth-tile').getAttribute('data-stage'),'paper-soggy');
   assert.match(await page.locator('#lower-world-note').innerText(),/retry/);
   await hit('gentle-care');await hit('test-care');await hit('compare-care');
   assert.equal(await page.locator('#lower-growth-tile').getAttribute('data-stage'),'paper-sprout');
   assert.equal(await spot('raised-pocket').getAttribute('data-growth'),'true');
   assert.match(await page.locator('#care-feedback').innerText(),/BEFORE \/ NOW compared/);
   assert.match(await page.locator('#note').innerText(),/PAPER CARE MODEL/);
   assert.match(await page.locator('#note').innerText(),/Actual growth.*UNKNOWN/);
   assert.match(await page.locator('#lower-world-note').innerText(),/PAPER pocket/);
   await hit('to-current');
   assert.equal(await page.locator('#current-scene').isVisible(),true);
   assert.equal(await b('run').isDisabled(),true);
   assert.match(await page.locator('#tray').innerText(),/3 run/);
   assert.equal(await page.locator('#upper-bed-tile').getAttribute('data-stage'),'healthy');
   assert.match(await page.locator('#lower-world-note').innerText(),/hypothetical sprout/);
   assert.equal(await page.locator('#care-panel').isVisible(),false);
   await hit('to-lower');
   assert.equal(await page.locator('#lower-growth-tile').getAttribute('data-stage'),'paper-sprout');
   assert.match(await page.locator('#lower-world-note').innerText(),/PAPER pocket/);
   if(viewport.width===1366){
    assert.equal(await page.locator('#e07-transfer').isVisible(),true);
    await page.locator('#e07-transfer').click();
    assert.match(page.url(),/\/e07-scene\/#paper=/);
    await page.waitForFunction(()=>document.querySelector('#e06-transfer-note')?.textContent.includes('hypothetical PAPER sprout'));
    assert.match(await page.locator('#e06-transfer-note').innerText(),/hypothetical PAPER sprout/);
    assert.match(await page.locator('#e06-transfer-note').innerText(),/still needs/);
    for(const k of ['start','walk-shared','inspect-shared','walk-channel','inspect-channel',
      'walk-workbench','test-milo','test-resident','test-water','place-water',
      'test-milo','test-resident','test-water','place-upper','test-water',
      'test-milo','test-resident','compare','finish','walk-start','walk-crossing',
      'walk-check-crossing','walk-water','walk-check-water','walk-base','walk-review'])
      await hit(k);
    assert.match(await page.locator('#e06-transfer-note').innerText(),/MODEL water: PASS/);
    await page.locator('#e06-return').click();
    assert.match(page.url(),/\/e06-scene\/#paper=/);
    await page.locator('#lower-growth-tile[data-stage="paper-sprout"]').waitFor();
    assert.equal(await page.locator('#lower-growth-tile').getAttribute('data-stage'),'paper-sprout');
    await page.locator('#e07-transfer').click();
    await page.waitForFunction(()=>document.querySelector('#route-feedback')?.textContent.includes('reviewed'));
    assert.match(await page.locator('#route-feedback').innerText(),/reviewed/);
    assert.match(await page.locator('#e06-transfer-note').innerText(),/MODEL water: PASS/);
    await page.locator('#e06-return').click();
   }
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['e06-sentinel']);
   const size=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(size.scroll<=size.w+1,JSON.stringify({viewport,size}));
   assert.deepEqual(errors,[]);
   await hit('restart');
   assert.equal(await page.locator('#current-scene').isVisible(),true);
   assert.equal(await b('enter').isDisabled(),true);
   assert.equal(await page.locator('#care-panel').isVisible(),false);
   assert.equal(await page.locator('#lower-growth-tile').getAttribute('data-stage'),'paper-marker');
   assert.equal(await spot('raised-pocket').getAttribute('data-growth'),'false');
  }finally{await context.close();}
 }
 const context=await browser.newContext({viewport:{width:568,height:320}});
 try{
  const page=await context.newPage();
  await page.goto(base+'/e06-scene/');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').evaluate(el=>el.tagName),'BUTTON');
  await page.keyboard.press('Enter');
  assert.match(await page.locator('#stage').innerText(),/model phase current/);
 }finally{await context.close();}
 console.log('E06 isolated two-scene Chromium PASS: three viewports, wrong-first care, hypothetical sprout revisit, restart, keyboard');
}finally{await browser.close();}
