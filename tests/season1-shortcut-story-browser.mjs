// Browser evidence for independent E07 synthetic PAPER rehearsal; not MN4/device acceptance.
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
   const res=await page.goto(base+'/authoring-labs/shortcut-story.html');
   assert.equal(res?.status(),200);
   await page.evaluate(()=>localStorage.setItem('e07-paper-sentinel','keep'));
   const button=(type,value)=>page.locator('[data-action="'+type+'"]'+(value?'[data-value="'+value+'"]':''));
   const hit=(type,value)=>button(type,value).click();
   assert.match(await page.locator('.notice').innerText(),/SYNTHETIC/);
   assert.equal(await button('trial','milo').isDisabled(),true);
   await hit('start');
   await hit('walk','shared-path');await hit('inspect','shared-path');
   await hit('walk','channel');await hit('inspect','channel');
   await hit('walk','workbench');
   await hit('trial','milo');
   assert.match(await page.locator('#first').innerText(),/Milo: PASS/);
   assert.equal(await button('finish').isDisabled(),true);
   await hit('trial','resident');await hit('trial','water');
   assert.match(await page.locator('#first').innerText(),/other traveler: BLOCKED/);
   assert.match(await page.locator('#first').innerText(),/water: BLOCKED/);
   assert.ok(await page.locator('#board [data-conflict="true"]').count()>0);
   await hit('place','path-clear-water-blocked');
   for(const k of ['milo','resident','water'])await hit('trial',k);
   assert.match(await page.locator('#now').innerText(),/water: BLOCKED/);
   assert.equal(await button('compare').isDisabled(),true);
   await hit('place','side-offset');
   assert.match(await page.locator('#now').innerText(),/not tested/);
   for(const k of ['water','milo','resident'])await hit('trial',k);
   assert.equal(await page.locator('#board [data-conflict="true"]').count(),0);
   assert.equal(await button('compare').isEnabled(),true);
   await hit('compare');
   assert.match(await page.locator('#stage').innerText(),/compare/);
   await hit('finish');
   assert.match(await page.locator('#line').innerText(),/who else/);
   assert.match(await page.locator('#note').innerText(),/UNKNOWN/);
   assert.match(await page.locator('#note').innerText(),/OFF/);
   assert.equal(await button('walk','entry').isDisabled(),true);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['e07-paper-sentinel']);
   const width=await page.evaluate(()=>({inner:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(width.scroll<=width.inner+1,JSON.stringify({size,width}));
   await page.locator('#restart').click();
   assert.match(await page.locator('#stage').innerText(),/opening/);
   await page.reload();
   assert.match(await page.locator('#stage').innerText(),/opening/);
   assert.deepEqual(errors,[]);
  }finally{await ctx.close();}
 }
 const ctx=await browser.newContext({viewport:{width:568,height:320}});
 try{
  const page=await ctx.newPage();
  await page.goto(base+'/authoring-labs/shortcut-story.html');
  await page.locator('[data-action="start"]').focus();await page.keyboard.press('Enter');
  await page.locator('[data-action="walk"][data-value="shared-path"]').focus();
  await page.keyboard.press('Space');
  assert.match(await page.locator('#stage').innerText(),/shared path/);
  await page.locator('[data-action="inspect"][data-value="shared-path"]').focus();
  await page.keyboard.press('Enter');
  assert.match(await page.locator('#observed').innerText(),/shared-path/);
 }finally{await ctx.close();}
 console.log('E07 shortcut PAPER story Chromium PASS: three viewports, keyboard, retry and no storage');
}finally{await browser.close();}
