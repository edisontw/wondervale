import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const context=await browser.newContext({viewport});
  try{
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   assert.equal((await page.goto(base+'/e06-scene/'))?.status(),200);
   await page.evaluate(()=>localStorage.setItem('e06-sentinel','keep'));
   const b=key=>page.locator('[data-key="'+key+'"]');
   const hit=async key=>{assert.equal(await b(key).isDisabled(),false,key);await b(key).click();};
   assert.match(await page.locator('.notice').innerText(),/AUTHORING ONLY/);
   assert.equal(await b('enter').isDisabled(),true);
   for(const k of ['start','bed','slope-walk','slope','tray-walk','run','rain','run',
    'blocked','run','compare','enter'])await hit(k);
   assert.equal(await page.locator('#lower-scene').isVisible(),true);
   assert.match(await page.locator('#current-world-note').innerText(),/completed/);
   for(const k of ['trace','lower-path-walk','lower-path','channel-walk','channel-place','check'])await hit(k);
   assert.match(await page.locator('#marker').innerText(),/WET/);
   await hit('pocket-walk');await hit('pocket-place');await hit('check');
   assert.match(await page.locator('#marker').innerText(),/clear/);
   await hit('think');await hit('finish');
   assert.match(await page.locator('#note').innerText(),/UNKNOWN/);
   assert.match(await page.locator('#lower-world-note').innerText(),/PAPER pocket/);
   await hit('to-current');
   assert.equal(await page.locator('#current-scene').isVisible(),true);
   assert.equal(await b('run').isDisabled(),true);
   assert.match(await page.locator('#tray').innerText(),/3 run/);
   await hit('to-lower');
   assert.match(await page.locator('#lower-world-note').innerText(),/PAPER pocket/);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['e06-sentinel']);
   const size=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(size.scroll<=size.w+1,JSON.stringify({viewport,size}));
   assert.deepEqual(errors,[]);
   await hit('restart');
   assert.equal(await page.locator('#current-scene').isVisible(),true);
   assert.equal(await b('enter').isDisabled(),true);
  }finally{await context.close();}
 }
 const context=await browser.newContext({viewport:{width:568,height:320}});
 try{
  const page=await context.newPage();
  await page.goto(base+'/e06-scene/');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').evaluate(el=>el.tagName),'BUTTON');
  await page.keyboard.press('Enter');
  assert.match(await page.locator('#stage').innerText(),/model phase current/);
 }finally{await context.close();}
 console.log('E06 isolated two-scene Chromium PASS: three viewports, wrong-first, revisit, restart, keyboard');
}finally{await browser.close();}
