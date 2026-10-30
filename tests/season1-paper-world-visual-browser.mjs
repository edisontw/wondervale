// Isolated paper-atlas Chromium test. No production progress, release or real scene art.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [
  {width:1366,height:900,label:'desktop'},
  {width:568,height:320,label:'short-landscape'},
  {width:390,height:844,label:'portrait'}
 ]){
  const ctx=await browser.newContext({viewport:{width:viewport.width,height:viewport.height}});
  try{
   const page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const click=async name=>page.locator('[data-action="'+name+'"]').click();
   const stage=async id=>page.locator('[data-visual-place="'+id+'"]').getAttribute('data-stage');
   assert.equal((await page.goto(base+'/authoring-labs/world-revisit.html'))?.status(),200);
   await page.evaluate(()=>localStorage.setItem('atlas-sentinel','preserved'));
   assert.equal(await page.locator('#visual-tiles .visual-tile').count(),8);
   assert.equal(await stage('station'),'before');
   assert.equal(await stage('needs'),'locked');
   assert.equal(await page.locator('[data-visual-place="needs"] .piece').count(),0);
   assert.match(await page.locator('[data-visual-place="station"] .visual-art').getAttribute('aria-label'),/Table/);
   await click('rotate:side-a');await click('shift-table:near-wall');await click('try-fit');
   assert.equal(await stage('station'),'after');
   assert.match(await page.locator('[data-visual-place="station"] .visual-art').innerText(),/Clear way/);
   await page.locator('[data-place="current"]').click();
   await click('rain:rain');await click('channel:open');await click('run-tray');
   assert.equal(await stage('current'),'after');
   assert.match(await page.locator('[data-visual-place="current"] .visual-art').innerText(),/Rain tray/);
   await click('look:before');
   assert.equal(await stage('station'),'before');
   assert.equal(await stage('current'),'before');
   await click('look:now');
   assert.equal(await stage('current'),'after');
   await page.locator('[data-place="station"]').click();
   assert.equal(await stage('current'),'after');
   await click('rotate:side-b');
   assert.equal(await stage('station'),'before');
   assert.equal(await stage('current'),'locked');
   assert.equal(await page.locator('[data-visual-place="current"] .piece').count(),0);
   assert.match(await page.locator('.notice').innerText(),/North Hill remains CLOSED/);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage).sort()),['atlas-sentinel']);
   const geo=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(geo.scroll<=geo.viewport+1,viewport.label+' overflow '+JSON.stringify(geo));
   assert.deepEqual(errors,[]);
  }finally{await ctx.close();}
 }
 const ctx=await browser.newContext({viewport:{width:568,height:320}});
 try{
  const page=await ctx.newPage();await page.goto(base+'/authoring-labs/world-revisit.html');
  await page.locator('[data-action="rotate:side-a"]').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('[data-action="rotate:side-a"]').isDisabled(),true);
 }finally{await ctx.close();}
 console.log('Visual paper atlas Chromium PASS: three sizes, before/now, world growth, revisit, revision invalidation, hidden later places, keyboard, no storage');
}finally{await browser.close();}
