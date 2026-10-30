// E06 Lower Garden synthetic PAPER rehearsal, not a production or real-device check.
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
   assert.equal((await page.goto(base+'/authoring-labs/lower-garden-story.html'))?.status(),200);
   await page.evaluate(()=>localStorage.setItem('e06-lower-sentinel','keep'));
   const hit=async(type,value)=>page.locator('[data-action="'+type+'"]'+(value?'[data-value="'+value+'"]':'')).click();
   assert.match(await page.locator('.notice').innerText(),/SYNTHETIC/);
   assert.equal(await page.locator('[data-action="enter"]').isDisabled(),true);
   await hit('start');await hit('inspect','present-bed');
   await hit('walk','slope');await hit('inspect','slope');
   await hit('walk','model-tray');await hit('run');
   await hit('weather','rain');await hit('run');
   await hit('channel','blocked');await hit('run');
   await hit('compare');await hit('enter');
   assert.match(await page.locator('#phase').innerText(),/lower/);
   await hit('inspect','runoff-trace');
   await hit('walk','public-path');await hit('inspect','public-path');
   await hit('walk','runoff-channel');await hit('place','runoff-channel');await hit('check');
   assert.match(await page.locator('#outcome').innerText(),/WET/);
   assert.equal(await page.locator('[data-action="finish"]').isDisabled(),true);
   await hit('walk','footpath');await hit('place','footpath');await hit('check');
   assert.match(await page.locator('#outcome').innerText(),/BLOCKED/);
   await hit('walk','raised-pocket');await hit('place','raised-pocket');await hit('check');
   assert.match(await page.locator('#outcome').innerText(),/permission UNKNOWN/);
   await hit('think','keep-path');await hit('finish');
   assert.match(await page.locator('#note').innerText(),/UNKNOWN/);
   assert.match(await page.locator('#line').innerText(),/only a plan/);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['e06-lower-sentinel']);
   const g=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(g.scroll<=g.width+1,JSON.stringify({size,g}));
   await page.locator('#restart').click();
   assert.match(await page.locator('#phase').innerText(),/opening/);
   assert.deepEqual(errors,[]);
  }finally{await ctx.close();}
 }
 const ctx=await browser.newContext({viewport:{width:568,height:320}});
 try{
  const page=await ctx.newPage();
  await page.goto(base+'/authoring-labs/lower-garden-story.html');
  await page.locator('[data-action="start"]').focus();await page.keyboard.press('Enter');
  await page.locator('[data-action="walk"][data-value="slope"]').focus();await page.keyboard.press('Space');
  assert.match(await page.locator('#marker').innerText(),/slope/);
 }finally{await ctx.close();}
 console.log('E06 Lower Garden PAPER story Chromium PASS: desktop/phone/keyboard, revision, no storage');
}finally{await browser.close();}
