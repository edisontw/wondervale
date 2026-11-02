// E09 still-unverified question -> E10 PAPER trace, with child-controlled revision.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import * as E10 from '../authoring-labs/unnamed-story-model.mjs';
import {sevenSceneUpstream} from './fixtures/season1-e04-e09-paper.mjs';
import {encodeMemoryCourtyard} from '../authoring-labs/e04-e10-scene-transfer.mjs';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const u=sevenSceneUpstream();
const fragment=encodeMemoryCourtyard(u.e04,u.e05,u.e06,u.e07,u.e08,u.e09,E10.fresh());
assert.ok(fragment);
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const context=await browser.newContext({viewport,reducedMotion:'reduce'});
  try{
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/e10-scene/'+fragment);
   assert.equal(await page.locator('#hill-question-panel').isVisible(),true);
   assert.match(await page.locator('#hill-question-note').innerText(),/unanswered hill question/i);
   await page.locator('#question-identity').click();
   await page.locator('#question-stone').click();
   assert.equal(await page.locator('#scene [data-anchor="stone_edge"]').getAttribute('data-paper-question'),'true');
   await page.locator('#question-compare').click();
   assert.match(await page.locator('#hill-question-note').innerText(),/Not yet/);
   await page.locator('#question-wall').click();
   assert.equal(await page.locator('#scene [data-anchor="notice_wall"]').getAttribute('data-paper-question'),'true');
   await page.locator('[data-action="start"]').click();
   await page.locator('[data-action="walk"][data-value="notice_wall"]').click();
   await page.locator('[data-action="inspect"][data-value="holes"]').click();
   await page.locator('#question-compare').click();
   assert.match(await page.locator('#hill-question-note').innerText(),/STILL UNKNOWN.*NOT DONE/);
   assert.equal(await page.locator('#hill-question-panel').getAttribute('data-compared'),'true');
   await page.locator('#question-access').focus();await page.keyboard.press('Enter');
   assert.equal(await page.locator('#hill-question-panel').getAttribute('data-compared'),'false');
   assert.equal(await page.locator('#scene [data-paper-question="true"]').count(),0);
   await page.locator('#question-stone').click();
   await page.locator('#question-clear').click();
   assert.equal(await page.locator('#scene [data-paper-question="true"]').count(),0);
   await page.locator('#restart').click();
   assert.equal(await page.locator('#hill-question-panel').getAttribute('data-compared'),'false');
   assert.equal(await page.locator('#scene [data-paper-question="true"]').count(),0);
   const widths=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(widths.scroll<=widths.w+1,JSON.stringify({viewport,widths}));
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),[]);
   assert.deepEqual(errors,[]);
  }finally{await context.close();}
 }
 const direct=await browser.newPage();
 await direct.goto(base+'/e10-scene/');
 assert.equal(await direct.locator('#hill-question-panel').isVisible(),false);
 console.log('E09→E10 PAPER question Chromium PASS: three viewports, wrong trace, inspect, compare, revise, reset, direct entry');
}finally{await browser.close();}
