// Isolated E06 Current Garden PAPER story, not production or real-device acceptance.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try{
 for(const size of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const ctx=await browser.newContext({viewport:size});
  try{
   const page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   assert.equal((await page.goto(base+'/authoring-labs/current-garden-story.html'))?.status(),200);
   await page.evaluate(()=>localStorage.setItem('e06-story-sentinel','keep'));
   const hit=async(type,value)=>page.locator('[data-action="'+type+'"]'+(value?'[data-value="'+value+'"]':'')).click();
   assert.match(await page.locator('.notice').innerText(),/SYNTHETIC TRAY/);
   assert.equal(await page.locator('[data-action="guess"][data-value="put-back"]').isDisabled(),true);
   await hit('start');await hit('inspect','present-bed');
   assert.equal(await page.locator('[data-action="guess"][data-value="put-back"]').isDisabled(),true);
   await hit('walk','slope');await hit('inspect','slope');
   await hit('guess','put-back');await hit('walk','model-tray');
   await hit('run');
   assert.match(await page.locator('#model').innerText(),/dry\/open = low 0\/3/);
   await hit('weather','rain');await hit('run');
   assert.match(await page.locator('#model').innerText(),/rain\/open = low 1\/3/);
   assert.equal(await page.locator('[data-action="compare"]').isDisabled(),true);
   await hit('channel','blocked');await hit('run');
   assert.match(await page.locator('#model').innerText(),/rain\/blocked = low 3\/3/);
   await hit('compare');
   assert.match(await page.locator('#parent').innerText(),/What might happen/);
   assert.match(await page.locator('#line').innerText(),/prove why the real garden moved/);
   await hit('revise','small-test');
   assert.match(await page.locator('#note').innerText(),/UNKNOWN/);
   assert.match(await page.locator('#line').innerText(),/need permission/);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['e06-story-sentinel']);
   assert.equal(await page.evaluate(()=>localStorage.getItem('e06-story-sentinel')),'keep');
   const g=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(g.scroll<=g.width+1,JSON.stringify({size,g}));
   await page.locator('#restart').click();
   assert.match(await page.locator('#observations').innerText(),/nothing yet/);
   assert.deepEqual(errors,[]);
  }finally{await ctx.close();}
 }
 const ctx=await browser.newContext({viewport:{width:568,height:320}});
 try{
  const page=await ctx.newPage();
  await page.goto(base+'/authoring-labs/current-garden-story.html');
  await page.locator('[data-action="start"]').focus();await page.keyboard.press('Enter');
  await page.locator('[data-action="walk"][data-value="slope"]').focus();await page.keyboard.press('Space');
  assert.match(await page.locator('#marker').innerText(),/slope/);
 }finally{await ctx.close();}
 console.log('E06 Current Garden PAPER story Chromium PASS: desktop/phone/keyboard, model revision, no storage');
}finally{await browser.close();}
