// E04-E10 seven independent PAPER scenes: earned E09 -> E10 -> E09, with upstream notes.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import * as E10 from '../authoring-labs/unnamed-story-model.mjs';
import {encodeMemoryCourtyard} from '../authoring-labs/e04-e10-scene-transfer.mjs';
import {sevenSceneUpstream} from './fixtures/season1-e04-e09-paper.mjs';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const upstream=sevenSceneUpstream();
const fragment=encodeMemoryCourtyard(...Object.values(upstream),E10.fresh());
assert.ok(fragment,'seven-scene fragment must be earned by E04-E09 actions');
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const ctx=await browser.newContext({viewport,reducedMotion:'reduce'});
  try{
   const page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/e09-scene/'+fragment);
   await page.waitForFunction(()=>document.querySelector('#stage')?.textContent?.includes('finished'));
   assert.match(await page.locator('#lantern-context').innerText(),/E04 memories: UNKNOWN dates; E05 station evidence: MOCK/);
   assert.match(await page.locator('#e10-paper').innerText(),/E04 UNKNOWN memories and E05 MOCK sources/);
   assert.equal(await page.locator('#e10-paper').isVisible(),true);
   await page.evaluate(()=>localStorage.setItem('e04-e10-sentinel','keep'));
   await page.locator('#e10-paper').click();
   assert.match(page.url(),/\/e10-scene\/#paper-memory-station-garden-shortcut-steps-hill-courtyard=/);
   await page.waitForFunction(()=>document.querySelector('#hill-context')?.textContent?.includes('E04: two sincere memories'));
   assert.match(await page.locator('#hill-context').innerText(),/order UNKNOWN/);
   assert.match(await page.locator('#hill-context').innerText(),/E05: MOCK station sources/);
   assert.match(await page.locator('#e09-observation').innerText(),/I SEE/);
   assert.match(await page.locator('.notice').innerText(),/AUTHORING ONLY/);
   await page.locator('[data-action="start"]').click();
   await page.locator('[data-action="compare-symbol"]').click();
   await page.locator('[data-action="walk"][data-value="stone_edge"]').click();
   await page.locator('[data-action="inspect"][data-value="surface"]').click();
   assert.match(await page.locator('#seen').innerText(),/surface|stone|edge/i);
   await page.locator('#e09-return').click();
   await page.waitForFunction(()=>document.querySelector('#stage')?.textContent?.includes('finished'));
   assert.match(page.url(),/\/e09-scene\/#paper-memory-station-garden-shortcut-steps-hill-courtyard=/);
   assert.match(await page.locator('#lantern-context').innerText(),/E04 memories: UNKNOWN dates/);
   await page.locator('#e10-paper').click();
   await page.waitForFunction(()=>document.querySelector('#seen')?.textContent?.includes('surface')||
    document.querySelector('#seen')?.textContent?.includes('stone'));
   assert.match(await page.locator('#hill-context').innerText(),/E05: MOCK station sources/);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['e04-e10-sentinel']);
   const sizes=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(sizes.scroll<=sizes.width+1,JSON.stringify({viewport,sizes}));
   assert.deepEqual(errors,[]);
   await page.locator('#restart').click();
   assert.match(await page.locator('#stage').innerText(),/opening/);
   assert.equal(await page.locator('#e09-return').isVisible(),true);
   await page.locator('#e09-return').click();
   await page.waitForFunction(()=>document.querySelector('#stage')?.textContent?.includes('finished'));
   await page.locator('#restart').click();
   assert.equal(await page.locator('#e10-paper').isVisible(),false);
  }finally{await ctx.close();}
 }
 console.log('E04-E10 PAPER browser PASS: seven replayed scenes, E04 UNKNOWN/E05 MOCK, three viewports, return, reset and no storage');
}finally{await browser.close();}
