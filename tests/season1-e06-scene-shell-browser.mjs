import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const screenshotDir=process.env.E06_SCREENSHOT_DIR||'';
if(screenshotDir)await mkdir(screenshotDir,{recursive:true});
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const context=await browser.newContext({viewport});
  try{
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   assert.equal((await page.goto(base+'/e06-scene/'))?.status(),200);
   await page.evaluate(()=>{localStorage.setItem('e06-sentinel','keep');localStorage.setItem('canonical-save-sentinel','unchanged');});
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
   assert.equal(await page.locator('#water-model').getAttribute('data-result'),'dry');
   await hit('rain');
   assert.equal(await page.locator('#water-model').getAttribute('data-result'),'dry','new weather is not observed before Run');
   assert.match(await page.locator('#model-next-setup').innerText(),/RAIN.*OPEN.*setup only/);
   await hit('run');
   assert.equal(await page.locator('#model-catchment').getAttribute('aria-valuenow'),'1');
   assert.equal(await page.locator('#water-model').getAttribute('data-result'),'rain-open');
   await page.locator('#model-channel-control').click();
   assert.equal(await page.locator('#model-channel-control').getAttribute('aria-pressed'),'false');
   assert.match(await page.locator('#model-next-setup').innerText(),/RAIN.*BLOCKED.*setup only/);
   assert.equal(await page.locator('#water-model').getAttribute('data-result'),'rain-open','spatial channel edit must not redraw old evidence');
   assert.match(await page.locator('#model-flow-caption').innerText(),/RAIN.*OPEN.*1\/3.*bypass 2\/2/);
   await hit('open');
   assert.match(await page.locator('#model-next-setup').innerText(),/RAIN.*OPEN.*setup only/);
   await page.locator('#model-channel-control').click();
   await hit('run');
   assert.equal(await page.locator('#model-catchment').getAttribute('aria-valuenow'),'3');
   assert.match(await page.locator('#model-flow-caption').innerText(),/RAIN.*BLOCKED.*3\/3/);
   assert.equal(await page.locator('#water-model').getAttribute('data-result'),'rain-blocked');
   assert.equal(await page.locator('#model-comparison').isVisible(),true);
   assert.match(await page.locator('#model-before-label').innerText(),/BEFORE.*Run 2.*RAIN \/ OPEN/);
   assert.match(await page.locator('#model-after-label').innerText(),/AFTER.*Run 3.*RAIN \/ BLOCKED/);
   assert.equal(await page.locator('#model-before').getAttribute('data-result'),'rain-open');
   assert.equal(await page.locator('#model-after').getAttribute('data-result'),'rain-blocked');
   assert.match(await page.locator('#model-before-flow').innerText(),/LOW BASIN.*1\/3.*BYPASS.*2\/2/s);
   assert.match(await page.locator('#model-after-flow').innerText(),/LOW BASIN.*3\/3.*BYPASS.*0\/2/s);
   assert.equal(await page.locator('#model-run-history .run-chip').count(),3);
   await hit('compare');await hit('enter');
   assert.equal(await page.locator('#lower-scene').isVisible(),true);
   assert.equal(await page.locator('#lower-spatial-map').isVisible(),true);
   assert.equal(await page.locator('#lower-spatial-map').getAttribute('data-marker-site'),'none');
   assert.equal(await page.locator('#lower-temp-marker').isVisible(),false);
   assert.equal(await page.locator('#lower-result-runoff-channel').getAttribute('data-result'),'unchecked');
   assert.match(await page.locator('#current-world-note').innerText(),/completed/);
   await tap('runoff-trace');await tap('public-path');await tap('public-path');
   await tap('runoff-channel');await tap('runoff-channel');await hit('check');
   assert.equal(await spot('runoff-channel').getAttribute('data-marker'),'true');
   assert.match(await spot('runoff-channel').innerText(),/WET/);
   assert.equal(await page.locator('#lower-spatial-map').getAttribute('data-marker-site'),'runoff-channel');
   assert.equal(await page.locator('#lower-temp-marker').isVisible(),true,
    'the selected temporary PAPER marker is drawn at its model zone');
   assert.equal(await page.locator('#lower-temp-marker').getAttribute('data-checked'),'true');
   assert.equal(await page.locator('#lower-result-runoff-channel').getAttribute('data-result'),'wet');
   assert.match(await page.locator('#lower-result-runoff-channel').innerText(),/Last completed check: WET/);
   assert.match(await page.locator('#marker').innerText(),/WET/);
   await tap('footpath');await tap('footpath');
   assert.equal(await page.locator('#lower-temp-marker').getAttribute('data-checked'),'false',
    'moving the marker to a new zone does not report that unchecked placement as tested');
   await hit('check');
   assert.equal(await page.locator('#lower-spatial-map').getAttribute('data-marker-site'),'footpath');
   assert.equal(await page.locator('#lower-result-footpath').getAttribute('data-result'),'blocks-path');
   assert.match(await page.locator('#lower-result-footpath').innerText(),/BLOCKS people/);
   assert.equal(await page.locator('#lower-result-runoff-channel').getAttribute('data-result'),'wet',
    'a later check retains the earlier water result at its own zone');
   await tap('raised-pocket');await tap('raised-pocket');await hit('check');
   assert.equal(await spot('raised-pocket').getAttribute('data-marker'),'true');
   assert.equal(await page.locator('#lower-spatial-map').getAttribute('data-marker-site'),'raised-pocket');
   assert.equal(await page.locator('#lower-result-raised-pocket').getAttribute('data-result'),'clear');
   assert.match(await page.locator('#lower-result-raised-pocket').innerText(),/water and path clear/);
   assert.match(await page.locator('#marker').innerText(),/clear/);
   if(screenshotDir)await page.screenshot({path:screenshotDir+'/lower-spatial-'+viewport.width+'x'+viewport.height+'.png',fullPage:true});
   await hit('think');await hit('finish');
   assert.equal(await page.locator('#care-panel').isVisible(),true);
   await hit('heavy-care');await hit('test-care');
   assert.equal(await page.locator('#lower-growth-tile').getAttribute('data-stage'),'paper-soggy');
   assert.match(await page.locator('#lower-world-note').innerText(),/retry/);
   await hit('gentle-care');await hit('test-care');await hit('compare-care');
   assert.equal(await page.locator('#lower-growth-tile').getAttribute('data-stage'),'paper-sprout');
   assert.equal(await spot('raised-pocket').getAttribute('data-growth'),'true');
   assert.match(await spot('raised-pocket').innerText(),/🌱 PAPER sprout · MODEL only/);
   assert.match(await page.locator('#care-feedback').innerText(),/BEFORE \/ NOW compared/);
   assert.match(await page.locator('#note').innerText(),/PAPER CARE MODEL/);
   assert.match(await page.locator('#note').innerText(),/Actual growth.*UNKNOWN/);
   assert.match(await page.locator('#lower-world-note').innerText(),/PAPER pocket/);
   assert.equal(await b('compare-gardens').isDisabled(),true,'comparison requires both revisits');
   assert.equal(await page.locator('#garden-revisit-result').isVisible(),false);
   await hit('to-current');
   assert.equal(await b('compare-gardens').isDisabled(),true,'cannot compare from upper garden');
   assert.equal(await page.locator('#current-scene').isVisible(),true);
   assert.equal(await b('run').isDisabled(),true);
   assert.match(await page.locator('#tray').innerText(),/3 run/);
   assert.equal(await page.locator('#upper-bed-tile').getAttribute('data-stage'),'healthy');
   assert.match(await page.locator('#lower-world-note').innerText(),/hypothetical sprout/);
   assert.equal(await page.locator('#care-panel').isVisible(),false);
   await hit('to-lower');
   assert.equal(await b('compare-gardens').isDisabled(),false);
   await hit('compare-gardens');
   assert.equal(await b('compare-gardens').isDisabled(),true,'comparison is earned once');
   assert.equal(await page.locator('#garden-revisit-result').isVisible(),true);
   assert.match(await page.locator('#garden-revisit-result').innerText(),/NOW:.*healthy.*POSSIBLE PAPER:.*not a real plant/);
   assert.match(await page.locator('#note').innerText(),/NOW is observed; POSSIBLE is a model/);
   assert.equal(await page.locator('#lower-growth-tile').getAttribute('data-stage'),'paper-sprout');
   assert.match(await page.locator('#lower-world-note').innerText(),/PAPER pocket/);
   await hit('heavy-care');
   assert.doesNotMatch(await spot('raised-pocket').innerText(),/PAPER sprout/);
   assert.equal(await page.locator('#garden-revisit-result').isVisible(),false);
   await hit('test-care');await hit('gentle-care');await hit('test-care');await hit('compare-care');
   assert.match(await spot('raised-pocket').innerText(),/🌱 PAPER sprout · MODEL only/);
   assert.equal(await b('compare-gardens').isDisabled(),true);
   await hit('to-current');await hit('to-lower');await hit('compare-gardens');
   assert.equal(await page.locator('#garden-revisit-result').isVisible(),true);
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
      'walk-check-crossing','other-start','other-step','other-step','walk-water','walk-check-water','walk-base','walk-review'])
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
   assert.deepEqual(await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage))),
    {'e06-sentinel':'keep','canonical-save-sentinel':'unchanged'});
   const size=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(size.scroll<=size.w+1,JSON.stringify({viewport,size}));
   assert.deepEqual(errors,[]);
   await hit('restart');
   assert.equal(await page.locator('#current-scene').isVisible(),true);
   assert.equal(await b('enter').isDisabled(),true);
   assert.equal(await page.locator('#care-panel').isVisible(),false);
   assert.equal(await page.locator('#lower-growth-tile').getAttribute('data-stage'),'paper-marker');
   assert.equal(await spot('raised-pocket').getAttribute('data-growth'),'false');
   assert.equal(await page.locator('#lower-spatial-map').getAttribute('data-marker-site'),'none');
   assert.ok(await page.locator('#lower-check-results [data-result="unchecked"]').count()===3);
   assert.equal(await page.locator('#water-model').getAttribute('data-result'),'none');
   assert.equal(await page.locator('#model-comparison').isVisible(),false);
   assert.equal(await page.locator('#model-run-history-panel').isVisible(),false);
   assert.deepEqual(await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage))),
    {'e06-sentinel':'keep','canonical-save-sentinel':'unchanged'});
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
  await page.locator('[data-spot="present-bed"]').click();
  await page.locator('[data-spot="slope"]').click();await page.locator('[data-spot="slope"]').click();
  await page.locator('#model-channel-control').focus();
  await page.keyboard.press('Space');
  assert.equal(await page.locator('#model-channel-control').getAttribute('aria-pressed'),'false');
  assert.match(await page.locator('#model-next-setup').innerText(),/channel BLOCKED/);
 }finally{await context.close();}
 console.log('E06 isolated two-scene Chromium PASS: three viewports, spatial runoff control, completed-run evidence comparison, wrong-first care, revisit, reset, keyboard, storage isolation');
}finally{await browser.close();}
