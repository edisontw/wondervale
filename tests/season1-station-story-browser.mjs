// Browser acceptance of isolated E05 story rehearsal, not canonical E05 production.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try{
 for(const v of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const ctx=await browser.newContext({viewport:v});
  try{
   const page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   assert.equal((await page.goto(base+'/authoring-labs/station-story.html'))?.status(),200);
   await page.evaluate(()=>localStorage.setItem('sentinel','keep'));
   const hit=async(type,value)=>page.locator('[data-action="'+type+'"]'+(value?'[data-value="'+value+'"]':'')).click();
   assert.match(await page.locator('.notice').innerText(),/AUTHORING ONLY/);
   assert.equal(await page.locator('[data-action="inspect"][data-value="peg-pair"]').isDisabled(),true);
   await hit('start');await hit('walk','board');
   await hit('inspect','peg-pair');await hit('inspect','worn-edge');
   assert.match(await page.locator('#parent').innerText(),/without changing/);
   await hit('guess','unsure');await hit('try-copy','side-b');await hit('check');
   assert.match(await page.locator('#line').innerText(),/do not fit/);
   await hit('try-copy','side-a');await hit('check');
   assert.match(await page.locator('#line').innerText(),/fits on our paper copy/);
   await hit('qualify');await hit('walk','table');
   await hit('place-table','across-walkway');
   assert.equal(await page.locator('[data-action="confirm"]').isDisabled(),true);
   await hit('place-table','near-wall');await hit('confirm');await hit('reflect');
   assert.match(await page.locator('#line').innerText(),/garden/);
   assert.match(await page.locator('#note').innerText(),/UNKNOWN/);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['sentinel']);
   const g=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(g.scroll<=g.w+1,JSON.stringify({v,g}));
   await page.locator('#restart').click();
   assert.match(await page.locator('#note').innerText(),/No real station entry/);
   assert.deepEqual(errors,[]);
  }finally{await ctx.close();}
 }
 const ctx=await browser.newContext({viewport:{width:568,height:320}});
 try{
  const page=await ctx.newPage();await page.goto(base+'/authoring-labs/station-story.html');
  await page.locator('[data-action="start"]').focus();await page.keyboard.press('Enter');
  await page.locator('[data-action="walk"][data-value="board"]').focus();await page.keyboard.press('Space');
  assert.match(await page.locator('#milo').innerText(),/board/);
 }finally{await ctx.close();}
 console.log('E05 story rehearsal Chromium PASS: 3 sizes, keyboard, wrong-first retry, table clearance, reflection, reset, no storage');
}finally{await browser.close();}
