import assert from 'node:assert/strict';import {chromium} from 'playwright';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173',browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:1366,height:900},{width:568,height:320},{width:667,height:375},{width:390,height:844}]){
  const context=await browser.newContext({viewport});
  try{
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   assert.equal((await page.goto(base+'/e07-scene/'))?.status(),200);
   await page.evaluate(()=>localStorage.setItem('e07-sentinel','keep'));
   const b=key=>page.locator('[data-key="'+key+'"]');
   const hit=async key=>{assert.equal(await b(key).isDisabled(),false,key);await b(key).click();};
   assert.match(await page.locator('.notice').innerText(),/AUTHORING ONLY/);
   assert.equal(await b('test-milo').isDisabled(),true);
   for(const k of ['start','walk-shared','inspect-shared','walk-channel','inspect-channel','walk-workbench','test-milo'])await hit(k);
   assert.match(await page.locator('#first').innerText(),/Milo: PASS/);
   await hit('test-resident');await hit('test-water');
   assert.match(await page.locator('#first').innerText(),/Traveler: BLOCKED/);
   assert.match(await page.locator('#first').innerText(),/Water: BLOCKED/);
   assert.ok(await page.locator('#board [data-conflict="true"]').count()>0);
   await hit('place-water');for(const k of ['test-milo','test-resident','test-water'])await hit(k);
   assert.match(await page.locator('#now').innerText(),/Water: BLOCKED/);
   assert.equal(await b('compare').isDisabled(),true);
   await hit('place-upper');assert.match(await page.locator('#now').innerText(),/NOT TESTED/);
   for(const k of ['test-water','test-milo','test-resident'])await hit(k);
   assert.equal(await page.locator('#board [data-conflict="true"]').count(),0);
   await hit('compare');await hit('finish');
   assert.match(await page.locator('#line').innerText(),/who else/);
   assert.match(await page.locator('#note').innerText(),/UNKNOWN/);
   assert.match(await page.locator('#hook').innerText(),/OFF/);
   await hit('garden');assert.equal(await page.locator('#garden-revisit').isVisible(),true);
   await hit('connector');assert.match(await page.locator('#stage').innerText(),/finished/);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['e07-sentinel']);
   const sz=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(sz.scroll<=sz.w+1,JSON.stringify({viewport,sz}));assert.deepEqual(errors,[]);
   await hit('restart');assert.match(await page.locator('#stage').innerText(),/opening/);
  }finally{await context.close();}
 }
 const ctx=await browser.newContext({viewport:{width:568,height:320}});
 try{const p=await ctx.newPage();await p.goto(base+'/e07-scene/');
  await p.locator('[data-key="start"]').focus();await p.keyboard.press('Enter');
  await p.locator('[data-key="walk-shared"]').focus();await p.keyboard.press('Space');
  assert.match(await p.locator('#milo').innerText(),/shared path/);
  await p.locator('[data-key="inspect-shared"]').focus();await p.keyboard.press('Enter');
  assert.match(await p.locator('#observed').innerText(),/shared-path/);
 }finally{await ctx.close();}
 console.log('E07 isolated scene Chromium PASS: four viewports, keyboard, wrong-first, revisit, restart');
}finally{await browser.close();}
