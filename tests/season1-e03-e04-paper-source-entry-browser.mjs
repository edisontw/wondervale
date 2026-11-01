// E03→E04 source-check launcher is an isolated, read-only PAPER entry, not E04 release.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {canonicalCheckpoints} from './fixtures/season1-e03-canonical.mjs';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const {e02,e03}=canonicalCheckpoints();
const E02='wondervale-s01e02-progress-v1',E03='wondervale-s01e03-progress-v1';
const browser=await chromium.launch({headless:true});
try{
 for(const size of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const context=await browser.newContext({viewport:size,reducedMotion:'reduce'});
  try{
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(base+'/authoring-labs/e03-e04-paper-source-entry.html');
   assert.equal(response?.status(),200);
   await page.waitForFunction(()=>document.querySelector('#gate-status')?.dataset.gate==='blocked');
   assert.equal(await page.locator('#verified').isVisible(),false);
   assert.equal(await page.locator('#paper-entry').isVisible(),false);
   assert.equal(await page.locator('#source-list li').count(),0);
   assert.match(await page.locator('.notice').innerText(),/NOT AN EPISODE UNLOCK/);
   await page.evaluate(({e02,e03,E02,E03})=>{
    localStorage.setItem('paper-entry-sentinel','keep');
    localStorage.setItem(E02,JSON.stringify(e02));
    localStorage.setItem(E03,JSON.stringify(e03));
   },{e02,e03,E02,E03});
   await page.locator('#refresh').click();
   assert.equal(await page.locator('#gate-status').getAttribute('data-gate'),'verified');
   assert.match(await page.locator('#gate-status').innerText(),/Source eligibility only/);
   assert.equal(await page.locator('#source-list li').count(),2);
   assert.match(await page.locator('#source-list').innerText(),/S01E03-COORDINATOR-009/);
   assert.match(await page.locator('#source-list').innerText(),/S01E03-RESIDENT-001/);
   assert.match(await page.locator('#source-list').innerText(),/UNKNOWN/);
   assert.match(await page.locator('#production-boundary').innerText(),/Canonical E04: CLOSED/);
   const before=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage)));
   // Same-tab reset cannot use a stale visible link to claim verified E03.
   await page.evaluate(E03=>localStorage.removeItem(E03),E03);
   await page.locator('#paper-entry').click();
   assert.ok(page.url().endsWith('/authoring-labs/e03-e04-paper-source-entry.html'));
   assert.equal(await page.locator('#gate-status').getAttribute('data-gate'),'blocked');
   assert.equal(await page.locator('#paper-entry').isVisible(),false);
   await page.evaluate(({E03,e03})=>localStorage.setItem(E03,JSON.stringify(e03)),{E03,e03});
   await page.locator('#refresh').click();
   assert.equal(await page.locator('#gate-status').getAttribute('data-gate'),'verified');
   assert.deepEqual(await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage))),before);
   // The actual E04 PAPER child action is in a separate noncanonical worktable.
   await page.locator('#paper-entry').click();
   await page.waitForURL('**/authoring-labs/arc1-memory-station-handoff.html');
   await page.locator('[data-key="inspect-station"]').waitFor();
   assert.match(await page.locator('.notice').innerText(),/NONCANONICAL/);
   assert.equal(await page.locator('[data-key="to-e05"]').isDisabled(),true);
   for(const key of ['inspect-station','inspect-garden','station-earlier','garden-later']){
    await page.locator('[data-key="'+key+'"]').click();
   }
   assert.equal(await page.locator('[data-key="compare"]').isDisabled(),true);
   for(const key of ['station-unknown','garden-unknown','compare','finish-e04']){
    await page.locator('[data-key="'+key+'"]').click();
   }
   assert.match(await page.locator('#e04-summary').innerText(),/Relative order UNKNOWN/);
   assert.match(await page.locator('#status').innerText(),/production unlock: false/);
   assert.deepEqual(await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage))),before);
   await page.goBack();
   await page.waitForFunction(()=>document.querySelector('#gate-status')?.dataset.gate==='verified');
   await page.evaluate(E02=>localStorage.removeItem(E02),E02);
   await page.locator('#refresh').click();
   assert.equal(await page.locator('#gate-status').getAttribute('data-gate'),'blocked');
   const geometry=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,
    buttons:[...document.querySelectorAll('button,a.action')].filter(x=>!x.hidden&&x.offsetParent!==null)
      .map(x=>({w:x.getBoundingClientRect().width,h:x.getBoundingClientRect().height}))}));
   assert.ok(geometry.scroll<=geometry.width+1,JSON.stringify({size,geometry}));
   for(const button of geometry.buttons)
    assert.ok(button.w>=43.5&&button.h>=43.5,JSON.stringify({size,button}));
   assert.deepEqual(errors,[]);
  }finally{await context.close();}
 }
 console.log('E03→E04 PAPER source entry Chromium PASS: three viewports, real replayed checkpoints, stale reset, child revision, no canonical writes');
}finally{await browser.close();}
