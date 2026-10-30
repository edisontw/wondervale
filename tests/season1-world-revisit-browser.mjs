// Child-operated paper-world retrospective, NOT production twelve-scene acceptance.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true});
const results=[],errors=[];
try{
 for(const viewport of [
  {width:1366,height:900,label:'desktop'},
  {width:568,height:320,label:'phone-landscape'},
  {width:390,height:844,label:'phone-portrait'}
 ]){
  const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},reducedMotion:'reduce'});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(viewport.label+': '+e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(viewport.label+': '+m.text());});
  const hit=async a=>page.locator('[data-action="'+a+'"]').click();
  const visit=async id=>page.locator('[data-place="'+id+'"]').click();
  try{
   assert.equal((await page.goto(base+'/authoring-labs/world-revisit.html'))?.status(),200);
   assert.match(await page.locator('.notice').innerText(),/NOT THE PRODUCTION GAME/);
   await page.evaluate(()=>localStorage.setItem('paper-sentinel','unchanged'));
   assert.equal(await page.locator('[data-place="needs"]').isDisabled(),true);
   assert.doesNotMatch(await page.locator('#story-cue').innerText(),/Common/);
   await hit('try-fit');assert.match(await page.locator('#feedback').innerText(),/Not yet/);
   await hit('rotate:side-a');await hit('shift-table:near-wall');await hit('try-fit');
   await visit('current');
   await hit('run-tray');assert.match(await page.locator('#feedback').innerText(),/retry/);
   await hit('rain:rain');await hit('channel:open');await hit('run-tray');
   await visit('lower');
   await hit('test-pocket');await hit('move-pocket:raised');await hit('test-pocket');
   await visit('connector');
   await hit('test-passage');await hit('move-bridge:clear');await hit('test-passage');
   await visit('steps');
   await hit('compare-views');await hit('lights:on');
   await hit('look-from:base');await hit('look-from:side');await hit('compare-views');
   await visit('hill');
   await hit('review-hill');await hit('inspect-sign');await hit('try-closed');
   assert.match(await page.locator('#feedback').innerText(),/stops safely/);
   await hit('mark-lower');await hit('review-hill');
   await visit('needs');
   await hit('review-needs');await hit('hear:quiet');await hit('hear:activity');
   await hit('separate-needs:separate');await hit('review-needs');
   await visit('layout');
   await hit('test-layout');await hit('move-layout:clear');await hit('test-layout');
   assert.match(await page.locator('#progress').innerText(),/8 of 8 PAPER/);
   assert.equal(await page.locator('#paper-notes .note').count(),8);
   assert.match(await page.locator('#paper-notes').innerText(),/upper hill CLOSED/);
   await visit('station');
   await hit('look:before');assert.match(await page.locator('#before-text').innerText(),/walkway/);
   await hit('look:now');assert.match(await page.locator('#now-text').innerText(),/Map Room/);
   await visit('lower');assert.match(await page.locator('#now-text').innerText(),/seed marker/);
   assert.match(await page.locator('#progress').innerText(),/8 of 8 PAPER/);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage).sort()),['paper-sentinel']);
   const geo=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(geo.scroll<=geo.viewport+1,viewport.label+' horizontal overflow '+JSON.stringify(geo));
   if(viewport.label==='desktop')await page.screenshot({path:'test-results/world-revisit-desktop.png',fullPage:true});
   await page.locator('#restart').click();
   assert.match(await page.locator('#progress').innerText(),/0 of 8 PAPER/);
   assert.equal(await page.locator('#paper-notes .note').count(),0);
   assert.equal(await page.locator('[data-place="needs"]').isDisabled(),true);
   results.push({viewport:viewport.label,journey:'PASS',revisit:'PASS',reset:'PASS',storage:'PASS'});
  }finally{await context.close();}
 }
 const context=await browser.newContext({viewport:{width:568,height:320}});
 try{
  const page=await context.newPage();
  await page.goto(base+'/authoring-labs/world-revisit.html');
  await page.locator('[data-action="try-fit"]').focus();
  await page.keyboard.press('Enter');
  assert.match(await page.locator('#feedback').innerText(),/Not yet/);
  await page.locator('[data-action="rotate:side-a"]').focus();
  await page.keyboard.press('Space');
  assert.equal(await page.locator('[data-action="rotate:side-a"]').isDisabled(),true);
  results.push({viewport:'keyboard',activation:'PASS'});
 }finally{await context.close();}
 assert.deepEqual(errors,[]);
 await writeFile('test-results/world-revisit-report.json',JSON.stringify({passed:true,results},null,2));
 console.log('Paper-world revisit Chromium PASS: desktop, short phone landscape, portrait, keyboard, wrong/retry, eight cumulative changes, before/now, revisit, reset, no storage');
}catch(e){
 await writeFile('test-results/world-revisit-report.json',JSON.stringify({passed:false,results,errors,error:String(e.stack||e)},null,2));
 throw e;
}finally{await browser.close();}
