// E09 child-placed ground observations -> E10 child-sorted provenance, PAPER only.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import * as E09 from '../e09-scene/scene-model.mjs';
import * as E10 from '../authoring-labs/unnamed-story-model.mjs';
import {sevenSceneUpstream} from './fixtures/season1-e04-e09-paper.mjs';
import {encodeMemoryCourtyard} from '../authoring-labs/e04-e10-scene-transfer.mjs';
const u=sevenSceneUpstream();
const e09=E09.replay([...u.e09.history.slice(0,-1),
 {scene:'ground',type:'place',clue:'disturbed_ground',at:'fence_view'},
 {scene:'ground',type:'place',clue:'runoff_marks',at:'lower_bend'},
 {scene:'ground',type:'compare'},u.e09.history.at(-1)]);
assert.ok(e09&&E09.view(e09).groundBoard.compared);
const fragment=encodeMemoryCourtyard(u.e04,u.e05,u.e06,u.e07,u.e08,e09,E10.fresh());
assert.ok(fragment);
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const context=await browser.newContext({viewport,reducedMotion:'reduce'});
  try{
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/e10-scene/'+fragment);
   assert.equal(await page.locator('#ground-provenance').isVisible(),true);
   const card=(id,slot)=>page.locator('[data-ground-card="'+id+'"][data-ground-slot="'+slot+'"]');
   assert.equal(await card('yard-holes','courtyard').isDisabled(),true);
   await card('hill-ground','courtyard').click();
   await card('hill-water','hill').click();
   await page.locator('#ground-provenance-compare').click();
   assert.match(await page.locator('#ground-provenance-feedback').innerText(),/Not yet/);
   await page.locator('[data-action="start"]').click();
   await page.locator('[data-action="walk"][data-value="stone_edge"]').click();
   await page.locator('[data-action="inspect"][data-value="surface"]').click();
   await page.locator('[data-action="walk"][data-value="entry"]').click();
   await page.locator('[data-action="walk"][data-value="notice_wall"]').click();
   await page.locator('[data-action="inspect"][data-value="holes"]').click();
   await card('yard-surface','courtyard').click();
   await card('yard-holes','courtyard').click();
   await page.locator('#ground-provenance-compare').click();
   assert.match(await page.locator('#ground-provenance-feedback').innerText(),/Not yet/);
   await card('hill-ground','hill').click();
   await page.locator('#ground-provenance-compare').click();
   assert.match(await page.locator('#ground-provenance-feedback').innerText(),/STILL UNKNOWN.*NOT DONE/);
   assert.equal(await page.locator('#ground-provenance').getAttribute('data-compared'),'true');
   assert.match(await page.locator('#ground-provenance-summary').innerText(),/2 HERE.*2 THERE/);
   await page.locator('[data-ground-remove="hill-water"]').click();
   assert.equal(await page.locator('#ground-provenance').getAttribute('data-compared'),'false');
   await page.locator('#ground-provenance-reset').click();
   assert.match(await page.locator('#ground-provenance-summary').innerText(),/0 HERE.*0 THERE/);
   assert.equal(await page.locator('#scene .closed').innerText(),'HILL CLOSED');
   assert.equal(/\\bCommon\\b/.test(await page.locator('#ground-provenance').innerText()),false);
   const size=await page.evaluate(()=>({inner:innerWidth,scroll:document.documentElement.scrollWidth,
    buttons:[...document.querySelectorAll('#ground-provenance button:not(:disabled)')].map(b=>({w:b.getBoundingClientRect().width,h:b.getBoundingClientRect().height}))}));
   assert.ok(size.scroll<=size.inner+1,JSON.stringify({viewport,size}));
   assert.ok(size.buttons.every(b=>b.w>=43.5&&b.h>=43.5));
   await page.locator('#restart').click();
   assert.equal(await page.locator('#ground-provenance').getAttribute('data-compared'),'false');
   await page.reload();
   assert.match(await page.locator('#ground-provenance-summary').innerText(),/0 HERE.*0 THERE/);
   assert.deepEqual(errors,[]);
  }finally{await context.close();}
 }
 const context=await browser.newContext();
 try{
  const page=await context.newPage();await page.goto(base+'/e10-scene/');
  assert.equal(await page.locator('#ground-provenance').isVisible(),false);
 }finally{await context.close();}
 console.log('E09→E10 ground provenance Chromium PASS: 3 viewports, 4 cards, revision, reset, no canonical access');
}finally{await browser.close();}
