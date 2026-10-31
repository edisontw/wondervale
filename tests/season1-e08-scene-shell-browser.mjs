import assert from 'node:assert/strict';import {chromium} from 'playwright';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173',browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:1366,height:900},{width:568,height:320},{width:667,height:375},{width:390,height:844}]){
  const context=await browser.newContext({viewport});
  try{
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   assert.equal((await page.goto(base+'/e08-scene/'))?.status(),200);
   await page.evaluate(()=>localStorage.setItem('e08-sentinel','keep'));
   const b=key=>page.locator('[data-key="'+key+'"]');
   const hit=async key=>{assert.equal(await b(key).isDisabled(),false,key);await b(key).click();};
   assert.match(await page.locator('.notice').innerText(),/AUTHORING ONLY/);
   assert.match(await page.locator('.notice').innerText(),/CLOSED/);
   assert.equal(await b('observe').isDisabled(),true);
   for(const k of ['start','inspect-brackets','inspect-boundary','inspect-a','lamp-a'])await hit(k);
   assert.match(await page.locator('#lamp-state').innerText(),/Not enough light/);
   assert.equal(await b('observe').isDisabled(),true);
   for(const k of ['walk-landing','inspect-b','lamp-b','walk-base','observe'])await hit(k);
   assert.match(await page.locator('#first').innerText(),/base/);
   assert.match(await page.locator('#parent').innerText(),/another safe place/);
   assert.equal(await b('compare').isDisabled(),true);
   for(const k of ['walk-landing','walk-side','observe'])await hit(k);
   assert.match(await page.locator('#second').innerText(),/side/);
   assert.equal(await page.locator('#map [data-marker="true"]').count(),3);
   await hit('compare');
   assert.match(await page.locator('#comparison').innerText(),/Same fixed marks/);
   assert.equal(await b('finish').isDisabled(),true);
   await hit('inspect-plate');await hit('finish');
   assert.match(await page.locator('#note').innerText(),/UNKNOWN/);
   assert.match(await page.locator('#hook').innerText(),/NOT UNLOCKED/);
   assert.match(await page.locator('#steps-world-note').innerText(),/real lights NOT restored/);
   await hit('connector');assert.equal(await page.locator('#connector-revisit').isVisible(),true);
   await hit('steps');assert.match(await page.locator('#stage').innerText(),/finished/);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['e08-sentinel']);
   const sz=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(sz.scroll<=sz.w+1,JSON.stringify({viewport,sz}));assert.deepEqual(errors,[]);
   await hit('restart');assert.match(await page.locator('#stage').innerText(),/opening/);
   assert.match(await page.locator('#lamp-state').innerText(),/OFF/);
  }finally{await context.close();}
 }
 const ctx=await browser.newContext({viewport:{width:568,height:320}});
 try{
  const p=await ctx.newPage();await p.goto(base+'/e08-scene/');
  await p.locator('[data-key="start"]').focus();await p.keyboard.press('Enter');
  await p.locator('[data-key="inspect-brackets"]').focus();await p.keyboard.press('Space');
  assert.match(await p.locator('#inspected').innerText(),/brackets/);
  await p.locator('[data-key="walk-landing"]').focus();await p.keyboard.press('Enter');
  assert.match(await p.locator('#milo').innerText(),/lower landing/);
 }finally{await ctx.close();}
 console.log('E08 isolated scene Chromium PASS: four viewports, keyboard, partial light, two views, callback, restart');
}finally{await browser.close();}