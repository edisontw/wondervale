// Browser: strictly replayed E04 UNKNOWN / E05 MOCK notes survive E10↔E11 PAPER visits.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import * as E10 from '../authoring-labs/unnamed-story-model.mjs';
import {encodeMemoryCourtyard} from '../authoring-labs/e04-e10-scene-transfer.mjs';
import {sevenSceneUpstream} from './fixtures/season1-e04-e09-paper.mjs';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const upstream=sevenSceneUpstream();
const fragment=encodeMemoryCourtyard(...Object.values(upstream),E10.fresh());
assert.ok(fragment);
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const ctx=await browser.newContext({viewport,reducedMotion:'reduce'});
  try{
   const page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/e10-scene/'+fragment);
   await page.waitForFunction(()=>document.querySelector('#hill-context')?.textContent?.includes('E04: two sincere memories'));
   await page.evaluate(()=>localStorage.setItem('e04-e11-sentinel','keep'));
   const hit=(type,value)=>page.locator('[data-action="'+type+'"]'+
    (value?'[data-value="'+value+'"]':'')).click();
   await hit('start');await hit('compare-symbol');await hit('walk','stone_edge');
   await hit('inspect','surface');await hit('suggest','surface:passing');
   await hit('revise','surface:passing:resting');await hit('walk','quiet_corner');
   await hit('hear','quiet');await hit('place','quiet:shared');
   await hit('walk','meeting_edge');await hit('hear','activity');
   await hit('place','activity:shared');await hit('test-one-slot');
   await hit('place','quiet:left');await hit('place','activity:right');
   await hit('walk','notice_wall');await hit('inspect','holes');
   await hit('suggest','holes:display');await hit('check-source');
   await hit('review-tradeoff');await hit('review');await hit('finish-paper');
   assert.equal(await page.locator('#e11-paper').isVisible(),true);
   assert.match(await page.locator('#e11-paper').innerText(),/E04 UNKNOWN memories and E05 MOCK sources/);
   await page.locator('#e11-paper').click();
   assert.match(page.url(),/\/e11-scene\/#paper-loop=/);
   await page.waitForFunction(()=>document.querySelector('#e04-e05-context')?.textContent?.includes('E04 PAPER'));
   assert.equal(await page.locator('#e04-e05-context').isVisible(),true);
   assert.match(await page.locator('#e04-e05-context').innerText(),/earlier\/later order UNKNOWN/);
   assert.match(await page.locator('#e04-e05-context').innerText(),/two MOCK station drawings/);
   assert.match(await page.locator('#e04-e05-context').innerText(),/NOT verified historical sources/);
   assert.match(await page.locator('#e10-linked-context').innerText(),/E11 is a separate model, NOT UNLOCKED/);
   assert.match(await page.locator('.notice').innerText(),/North Hill/);
   await page.getByRole('button',{name:'Begin the PAPER trial'}).click();
   await page.getByRole('button',{name:'Place access strip (two middle cells)'}).click();
   await page.getByRole('button',{name:'Place quiet seat',exact:true}).click();
   await page.getByRole('button',{name:'Cell 0,1'}).click();
   assert.equal(await page.locator('#grid .quiet').count(),1);
   await page.locator('#e10-return').click();
   await page.waitForFunction(()=>document.querySelector('#stage')?.textContent?.includes('finished'));
   assert.match(await page.locator('#hill-context').innerText(),/E04: two sincere memories/);
   await page.locator('#e11-paper').click();
   await page.waitForFunction(()=>document.querySelector('#e04-e05-context')?.textContent?.includes('E04 PAPER'));
   assert.equal(await page.locator('#grid .quiet').count(),1,'E11 action history must survive return');
   assert.match(await page.locator('#e04-e05-context').innerText(),/E05 PAPER/);
   assert.match(await page.locator('#chronicle').innerText(),/canonical events: 0; unlocks: 0/);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['e04-e11-sentinel']);
   const widths=await page.evaluate(()=>({screen:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(widths.scroll<=widths.screen+1,JSON.stringify({viewport,widths}));
   assert.deepEqual(errors,[]);
   await page.locator('#restart').click();
   assert.equal(await page.locator('#grid .quiet').count(),0,'E11 restart clears only E11');
   await page.locator('#e10-return').click();
   await page.waitForFunction(()=>document.querySelector('#stage')?.textContent?.includes('finished'));
   assert.equal(await page.locator('#e11-paper').isVisible(),true);
   await page.locator('#restart').click();
   assert.equal(await page.locator('#e11-paper').isVisible(),false,'E10 restart revokes downstream');
   assert.equal(await page.locator('#e09-return').isVisible(),true,'E09 PAPER context stays available');
  }finally{await ctx.close();}
 }
 console.log('E04-E11 full PAPER provenance Chromium PASS: 3 viewports, unknown/mock, reversible visits, resets, no storage');
}finally{await browser.close();}
