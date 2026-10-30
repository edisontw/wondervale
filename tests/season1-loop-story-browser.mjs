// E11 PAPER story Chromium journey. No production season completion.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try{
 for(const size of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const ctx=await browser.newContext({viewport:size,reducedMotion:'reduce'});
  try{
   const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(base+'/authoring-labs/loop-story.html');
   assert.equal(response?.status(),200);
   const b=(type,value)=>page.locator('[data-action="'+type+'"]'+(value?'[data-value="'+value+'"]':''));
   const hit=(type,value)=>b(type,value).click();
   assert.match(await page.locator('.notice').innerText(),/FICTIONAL MODEL/);
   await page.evaluate(()=>localStorage.setItem('e11-paper-sentinel','keep'));
   assert.equal(await b('finish-paper').isDisabled(),true);
   await hit('start');
   await hit('move-milo','1,1');await hit('move-milo','1,0');
   assert.match(await page.locator('#position').innerText(),/steps 2/);
   await hit('place-access');
   await page.locator('[data-tool="quiet"]').click();
   await hit('place-cell','0,1');
   await page.locator('[data-tool="activity"]').click();
   await hit('place-cell','0,2');
   await hit('test-user','quiet_reader');await hit('test-user','activity_group');
   assert.match(await page.locator('#test-results').innerText(),/RETRY/);
   assert.match(await page.locator('#parent').innerText(),/Who can use this path/);
   await hit('snapshot-trial');
   await hit('place-cell','2,1');
   await hit('test-user','quiet_reader');await hit('test-user','activity_group');
   assert.match(await page.locator('#test-results').innerText(),/PASS/);
   await hit('snapshot-trial');await hit('compare-trials');
   assert.match(await page.locator('#comparison').innerText(),/FIRST trial-1/);
   await hit('cite-earlier','e09_closure');
   for(const id of ['square-market','market-common','common-square'])await hit('add-loop-edge',id);
   await hit('check-loop');
   assert.match(await page.locator('#map').innerText(),/YES, MODEL ONLY/);
   await hit('review-preview');await hit('finish-paper');
   assert.match(await page.locator('#stage').innerText(),/paper-finished/);
   const hook=await page.locator('#hook').innerText();
   assert.match(hook,/Common CLOSED/);assert.match(hook,/Season complete: NO/);
   assert.equal(await b('add-loop-edge','square-garden').count(),1);
   assert.equal(await b('add-loop-edge','square-garden').isDisabled(),true);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['e11-paper-sentinel']);
   const g=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,
    buttons:[...document.querySelectorAll('button:not(:disabled)')].map(x=>({w:x.getBoundingClientRect().width,h:x.getBoundingClientRect().height}))}));
   assert.ok(g.scroll<=g.width+1,JSON.stringify({size,g}));
   for(const x of g.buttons)assert.ok(x.w>=43.5&&x.h>=43.5,JSON.stringify({size,x}));
   await page.locator('#restart').click();
   assert.match(await page.locator('#stage').innerText(),/opening/);
   await page.reload();assert.match(await page.locator('#stage').innerText(),/opening/);
   assert.deepEqual(errors,[]);
  }finally{await ctx.close();}
 }
 const ctx=await browser.newContext({viewport:{width:568,height:320}});
 try{
  const page=await ctx.newPage();await page.goto(base+'/authoring-labs/loop-story.html');
  await page.locator('[data-action="start"]').focus();await page.keyboard.press('Enter');
  await page.locator('[data-action="move-milo"][data-value="1,1"]').focus();await page.keyboard.press('Space');
  assert.match(await page.locator('#position').innerText(),/steps 1/);
 }finally{await ctx.close();}
 console.log('E11 PAPER story Chromium PASS: desktop, landscape, portrait, keyboard, restart, no storage');
}finally{await browser.close();}
