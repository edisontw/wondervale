import assert from 'node:assert/strict';import {chromium} from 'playwright';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173',browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:1366,height:900},{width:568,height:320},{width:667,height:375},{width:390,height:844}]){
  const context=await browser.newContext({viewport});
  try{
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   assert.equal((await page.goto(base+'/e09-scene/'))?.status(),200);
   await page.evaluate(()=>localStorage.setItem('e09-sentinel','keep'));
   const b=key=>page.locator('[data-key="'+key+'"]');
   const hit=async key=>{assert.equal(await b(key).isDisabled(),false,key);await b(key).click();};
   assert.match(await page.locator('.notice').innerText(),/AUTHORING ONLY/);
   assert.match(await page.locator('.notice').innerText(),/closed/i);
   assert.equal(await b('walk-signpost').isDisabled(),true);
   await hit('start');await hit('inspect-entry_note');await hit('walk-signpost');
   await hit('inspect-boundary_sign');await hit('walk-fence_view');
   await hit('walk-upper_closed');
   assert.match(await page.locator('#feedback').innerText(),/closed/i);
   assert.match(await page.locator('#inspections').innerText(),/Milo: Fence lookout/);
   await hit('inspect-disturbed_ground');await hit('walk-signpost');
   await hit('walk-lower_bend');await hit('inspect-runoff_marks');
   await hit('walk-overlook');await hit('inspect-distant_symbol');
   await hit('mark-steps_base:signpost');await hit('mark-lower_bend:overlook');
   await hit('check-route');assert.match(await page.locator('#route-status').innerText(),/gap/);
   assert.equal(await b('review').isDisabled(),true);
   await hit('mark-signpost:lower_bend');await hit('check-route');
   assert.match(await page.locator('#route-status').innerText(),/Continuous model route/);
   await hit('compare-symbol');await hit('review');await hit('finish-preview');
   assert.match(await page.locator('#chronicle').innerText(),/NOT UNLOCKED/);
   assert.match(await page.locator('#hook').innerText(),/NOT UNLOCKED/);
   assert.equal(await page.locator('#survey-compare').isVisible(),true);
   assert.equal(await page.locator('#scene .edge.marked').count(),3);
   assert.equal(await page.locator('#scene .evidence-pin').count(),4);
   assert.match(await page.locator('#survey-summary').innerText(),/Milo walked 4 model edges/);
   await hit('blank-board');
   assert.equal(await page.locator('#scene .edge.marked').count(),0);
   assert.equal(await page.locator('#scene .evidence-pin').count(),0);
   assert.match(await page.locator('#survey-summary').innerText(),/blank fictional sketch/);
   assert.match(await page.locator('#scene .closed-label').innerText(),/CLOSED/);
   await hit('notes-board');
   assert.equal(await page.locator('#scene .edge.marked').count(),3);
   assert.equal(await page.locator('#scene .evidence-pin').count(),4);
   await hit('revisit');assert.equal(await page.locator('#lantern-revisit').isVisible(),true);
   await hit('back');assert.match(await page.locator('#stage').innerText(),/finished/);
   assert.equal(await page.locator('#scene .edge.marked').count(),3);
   assert.equal(await page.locator('#scene .evidence-pin').count(),4);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['e09-sentinel']);
   const sz=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(sz.scroll<=sz.w+1,JSON.stringify({viewport,sz}));assert.deepEqual(errors,[]);
   await page.locator('#restart').click();assert.match(await page.locator('#stage').innerText(),/opening/);
  }finally{await context.close();}
 }
 const ctx=await browser.newContext({viewport:{width:568,height:320}});
 try{
  const p=await ctx.newPage();await p.goto(base+'/e09-scene/');
  await p.locator('#start').focus();await p.keyboard.press('Enter');
  await p.locator('[data-key="walk-signpost"]').focus();await p.keyboard.press('Space');
  assert.match(await p.locator('#inspections').innerText(),/Signpost/);
 }finally{await ctx.close();}
 console.log('E09 isolated scene Chromium PASS: four viewports, keyboard, closed stop, gap revision, before/now survey, callback, restart');
}finally{await browser.close();}
