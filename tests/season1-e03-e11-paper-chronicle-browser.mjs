// Three viewport E03 verified boundary + strictly replayed E04-E11 PAPER Chronicle.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {canonicalCheckpoints} from './fixtures/season1-e03-canonical.mjs';
import {paperLoopFixture} from './fixtures/season1-e03-e11-paper.mjs';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const {e02,e03}=canonicalCheckpoints(),fragment=paperLoopFixture();
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const ctx=await browser.newContext({viewport,reducedMotion:'reduce'});
  try{
   const page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(base+'/e11-scene/'+fragment);
   assert.equal(response?.status(),200);
   await page.waitForFunction(()=>document.querySelector('#paper-chronicle')?.textContent?.includes('E06 Lower'));
   await page.waitForFunction(()=>document.querySelector('#garden-lower-now')?.dataset.stage==='paper-sprout');
   await page.getByRole('button',{name:'Begin the PAPER trial'}).click();
   assert.equal(await page.locator('#garden-revisit').isVisible(),true);
   assert.equal(await page.locator('#garden-current').getAttribute('data-stage'),'healthy');
   assert.equal(await page.locator('#garden-lower-first').getAttribute('data-stage'),'paper-marker');
   assert.equal(await page.locator('#garden-lower-now').getAttribute('data-stage'),'paper-sprout');
   assert.match(await page.locator('#garden-lower-now-note').innerText(),/possible PAPER sprout/);
   assert.match(await page.locator('#garden-trials').innerText(),/water trials: 2/);
   assert.match(await page.locator('#garden-trials').innerText(),/permission and official unlock: NONE/);
   assert.match(await page.locator('#e03-paper-source').innerText(),/NOT verified/);
   await page.evaluate(({e02,e03})=>{
    localStorage.setItem('wondervale-s01e02-progress-v1',JSON.stringify(e02));
    localStorage.setItem('wondervale-s01e03-progress-v1',JSON.stringify(e03));
   },{e02,e03});
   await page.reload();
   await page.waitForFunction(()=>document.querySelector('#e03-paper-source')?.textContent?.includes('NOT verified'));
   // E11 deliberately never reads canonical storage, even if those keys exist.
   assert.equal(await page.locator('#paper-chronicle li').count(),9);
   assert.match(await page.locator('#paper-chronicle').innerText(),/UNKNOWN/);
   assert.match(await page.locator('#paper-chronicle').innerText(),/MOCK/);
   assert.match(await page.locator('#paper-chronicle').innerText(),/CLOSED/);
   assert.match(await page.locator('#paper-chronicle').innerText(),/placed: 0/);
   assert.match(await page.locator('#chronicle').innerText(),/canonical events: 0; unlocks: 0/);
   await page.getByRole('button',{name:'Place access strip (two middle cells)'}).click();
   assert.match(await page.locator('#paper-chronicle').innerText(),/placed: 2/);
   await page.getByRole('button',{name:'Restart fictional lab'}).click();
   assert.match(await page.locator('#paper-chronicle').innerText(),/placed: 0/);
   assert.equal(await page.locator('#garden-lower-now').getAttribute('data-stage'),'paper-sprout',
    'E11-only restart must preserve strictly replayed E06 care');
   await page.evaluate(()=>localStorage.removeItem('wondervale-s01e03-progress-v1'));
   await page.reload();
   await page.waitForFunction(()=>document.querySelector('#paper-chronicle li')?.textContent?.includes('E04'));
   assert.match(await page.locator('#e03-paper-source').innerText(),/NOT verified/);
   assert.equal(await page.locator('#paper-chronicle li').count(),9);
   assert.match(await page.locator('.notice').innerText(),/North Hill/);
   const raw=JSON.parse(decodeURIComponent(fragment.slice('#paper-loop='.length)));
   raw.e06=[];
   await page.goto(base+'/e11-scene/#paper-loop='+encodeURIComponent(JSON.stringify(raw)));
   await page.waitForFunction(()=>document.querySelector('#e10-linked-context')?.textContent?.includes('No E10 PAPER investigation'));
   assert.equal(await page.locator('#garden-revisit').isVisible(),false,
    'upstream reset cannot preserve a fabricated lower sprout');
   assert.equal(await page.locator('#paper-chronicle li').count(),1);
   await page.goto(base+'/e11-scene/');
   assert.equal(await page.locator('#garden-revisit').isVisible(),false,
    'direct E11 authoring has no claimed E06 growth');
   const widths=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(widths.scroll<=widths.viewport+1,JSON.stringify(widths));
   assert.deepEqual(errors,[]);
  }finally{await ctx.close();}
 }
 console.log('E03-E11 PAPER Chronicle Chromium PASS: 3 viewports, reset and source guard');
}finally{await browser.close();}
