import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const touch=viewport.width<=568;
  const context=await browser.newContext({viewport,hasTouch:touch,isMobile:touch});
  try{
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   assert.equal((await page.goto(base+'/e06-scene/'))?.status(),200);
   await page.evaluate(()=>{localStorage.setItem('e06-sentinel','keep');localStorage.setItem('canonical-save-sentinel','unchanged');});
   const b=key=>page.locator('[data-key="'+key+'"]');
   const activate=el=>touch?el.tap():el.click();
   const captureLower=async name=>{
    if(!process.env.E06_EVIDENCE_DIR)return;
    const dir=path.resolve(process.env.E06_EVIDENCE_DIR);
    await mkdir(dir,{recursive:true});
    await page.locator('#lower-scene').screenshot({path:path.join(dir,name)});
   };
   const hit=async key=>{assert.equal(await b(key).isDisabled(),false,key);await activate(b(key));};
   assert.match(await page.locator('.notice').innerText(),/AUTHORING ONLY/);
   assert.equal(await b('enter').isDisabled(),true);
   const spot=id=>page.locator('[data-spot="'+id+'"]');
   const tap=async id=>{assert.equal(await spot(id).isDisabled(),false,id);await activate(spot(id));};
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
   assert.ok(await page.locator('#lower-scene').evaluate(el=>Math.abs(el.getBoundingClientRect().top)<4),
    'entering Lower Garden brings the playable scene into view');
   assert.match(await page.locator('#current-world-note').innerText(),/completed/);
   if(viewport.width===1366){
    await spot('runoff-trace').focus();await page.keyboard.press('Enter');
    assert.equal(await spot('runoff-trace').getAttribute('data-observed'),'true','keyboard inspects the in-scene water trace');
   }else await tap('runoff-trace');
   await tap('public-path');await tap('public-path');
   assert.equal(await page.locator('#lower-map').getAttribute('data-conflict'),'none');
   assert.equal(await page.locator('.lower-watercourse').isVisible(),true);
   assert.equal(await page.locator('.lower-footway').isVisible(),true);
   assert.match(await spot('runoff-channel').innerText(),/Runoff channel/);
   assert.match(await spot('footpath').innerText(),/Shared footpath/);
   await tap('runoff-channel');await tap('runoff-channel');
   assert.equal(await spot('runoff-channel').getAttribute('data-marker'),'true');
   assert.equal(await spot('runoff-channel').locator('.marker-token').isVisible(),true,'marker appears at the selected place');
   await hit('check');
   assert.equal(await page.locator('#lower-map').getAttribute('data-conflict'),'water');
   assert.equal(await spot('runoff-channel').getAttribute('data-conflict'),'water');
   assert.match(await page.locator('#lower-map-feedback').innerText(),/Water route.*may get wet/);
   assert.match(await spot('runoff-channel').innerText(),/WET HERE/);
   assert.match(await page.locator('#marker').innerText(),/WET/);
   if(viewport.width===1366)await captureLower('lower-garden-water-conflict.png');
   await tap('footpath');await tap('footpath');
   assert.equal(await page.locator('#lower-map').getAttribute('data-conflict'),'none','moving the marker clears the prior active conflict');
   assert.equal(await spot('runoff-channel').getAttribute('data-marker'),'false');
   assert.equal(await spot('footpath').locator('.marker-token').isVisible(),true);
   assert.match(await page.locator('#marker').innerText(),/not checked/);
   await hit('check');
   assert.equal(await page.locator('#lower-map').getAttribute('data-conflict'),'path');
   assert.equal(await spot('footpath').getAttribute('data-conflict'),'path');
   assert.match(await page.locator('#lower-map-feedback').innerText(),/Shared footpath.*blocks/);
   assert.equal(await page.locator('.lower-footway').evaluate(el=>getComputedStyle(el).strokeWidth),'28px');
   if(viewport.width===1366)await captureLower('lower-garden-path-conflict.png');
   await tap('raised-pocket');await tap('raised-pocket');await hit('check');
   assert.equal(await spot('raised-pocket').getAttribute('data-marker'),'true');
   assert.equal(await page.locator('#lower-map').getAttribute('data-conflict'),'clear');
   assert.match(await page.locator('#marker').innerText(),/clear/);
   await hit('think');await hit('finish');
   assert.equal(await page.locator('#care-panel').isVisible(),true);
   await hit('heavy-care');await hit('test-care');
   assert.equal(await page.locator('#lower-growth-tile').getAttribute('data-stage'),'paper-soggy');
   assert.match(await page.locator('#lower-world-note').innerText(),/retry/);
   await hit('gentle-care');await hit('test-care');await hit('compare-care');
   assert.equal(await page.locator('#lower-growth-tile').getAttribute('data-stage'),'paper-sprout');
   assert.equal(await spot('raised-pocket').getAttribute('data-growth'),'true');
   assert.equal(await page.locator('#lower-growth-tile').isVisible(),true,'the small PAPER pocket stays visible with its possible sprout');
   assert.match(await page.locator('#lower-growth-tile').innerText(),/Small PAPER pocket.*possible sprout/);
   assert.match(await page.locator('#care-feedback').innerText(),/BEFORE \/ NOW compared/);
   assert.match(await page.locator('#note').innerText(),/PAPER CARE MODEL/);
   assert.match(await page.locator('#note').innerText(),/Actual growth.*UNKNOWN/);
   assert.match(await page.locator('#lower-world-note').innerText(),/PAPER pocket/);
   assert.equal(await b('compare-gardens').isDisabled(),true,'comparison requires both revisits');
   assert.equal(await page.locator('#garden-revisit-result').isVisible(),false);
   await hit('to-current');
   assert.equal(await b('compare-gardens').isDisabled(),true,'cannot compare from upper garden');
   assert.equal(await page.locator('#current-scene').isVisible(),true);
   assert.ok(await page.locator('#current-scene').evaluate(el=>Math.abs(el.getBoundingClientRect().top)<4),
    'revisiting Current Garden brings its scene into view');
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
   assert.equal(await page.locator('#two-place-visual-comparison').isVisible(),true);
   assert.match(await page.locator('#current-garden-comparison').innerText(),/NOW[\s\S]*Current Garden[\s\S]*Healthy bed remains/);
   assert.match(await page.locator('#lower-garden-comparison').innerText(),/POSSIBLE[\s\S]*Lower Garden[\s\S]*Hypothetical PAPER sprout[\s\S]*model only/);
   if(process.env.E06_EVIDENCE_DIR){
    const dir=path.resolve(process.env.E06_EVIDENCE_DIR);
    await mkdir(dir,{recursive:true});
    await page.screenshot({path:path.join(dir,`lower-garden-${viewport.width}x${viewport.height}.png`),fullPage:true});
   }
   assert.match(await page.locator('#garden-revisit-result').innerText(),/NOW:.*healthy.*POSSIBLE PAPER:.*not a real plant/);
   assert.match(await page.locator('#note').innerText(),/NOW is observed; POSSIBLE is a model/);
   assert.equal(await page.locator('#lower-growth-tile').getAttribute('data-stage'),'paper-sprout');
   assert.match(await page.locator('#lower-world-note').innerText(),/PAPER pocket/);
   await hit('heavy-care');
   assert.doesNotMatch(await spot('raised-pocket').innerText(),/PAPER sprout/);
   assert.equal(await page.locator('#garden-revisit-result').isVisible(),false);
   await hit('test-care');await hit('gentle-care');await hit('test-care');await hit('compare-care');
   assert.equal(await page.locator('#lower-growth-tile').isVisible(),true);
   assert.match(await page.locator('#lower-growth-tile').innerText(),/Small PAPER pocket.*possible sprout/);
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
 console.log('E06 isolated two-scene Chromium PASS: three viewports with mobile touch, spatial runoff/path conflict and marker visuals, retained PAPER pocket, NOW/POSSIBLE comparison, scene-focused revisit, reset, keyboard, storage isolation');
}finally{await browser.close();}
