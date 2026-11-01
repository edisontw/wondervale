// Independent E06 -> E07 child-earned PAPER visual comparison; no canonical unlock.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const ctx=await browser.newContext({viewport,reducedMotion:'reduce'});
  try{
   const page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/e07-scene/');
   assert.equal(await page.locator('#e06-world').isVisible(),false);
   await page.goto(base+'/e06-scene/');
   await page.evaluate(()=>localStorage.setItem('e06-e07-world-sentinel','keep'));
   const b=key=>page.locator('[data-key="'+key+'"]');
   const hit=async key=>{assert.equal(await b(key).isDisabled(),false,key);await b(key).click();};
   for(const key of ['start','bed','slope-walk','slope','tray-walk','run','rain','run',
    'blocked','run','compare','enter','trace','lower-path-walk','lower-path',
    'channel-walk','channel-place','check','pocket-walk','pocket-place','check',
    'think','finish','heavy-care','test-care','gentle-care','test-care','compare-care'])
    await hit(key);
   assert.equal(await page.locator('#e07-transfer').isVisible(),true);
   await page.locator('#e07-transfer').click();
   assert.match(page.url(),/\/e07-scene\/#paper=/);
   await page.locator('#e06-world').waitFor({state:'visible'});
   assert.equal(await page.locator('#e06-world').getAttribute('data-view'),'now');
   assert.equal(await page.locator('#e06-garden-tiles [data-marker="true"]').count(),1);
   assert.equal(await page.locator('#e06-garden-tiles [data-site="raised-pocket"]').getAttribute('data-marker'),'true');
   assert.match(await page.locator('#e06-garden-water').innerText(),/GENTLE.*hypothetical PAPER sprout/);
   assert.match(await page.locator('#e06-garden-result').innerText(),/water and shared path clear/);
   await page.locator('#e06-world-first').click();
   assert.equal(await page.locator('#e06-world-first').getAttribute('aria-pressed'),'true');
   assert.equal(await page.locator('#e06-garden-tiles [data-site="runoff-channel"]').getAttribute('data-marker'),'true');
   assert.match(await page.locator('#e06-garden-water').innerText(),/HEAVY.*PAPER soggy seed/);
   assert.match(await page.locator('#e06-garden-result').innerText(),/water-route wet/);
   await page.locator('#e06-world-now').focus();await page.keyboard.press('Enter');
   assert.equal(await page.locator('#e06-world-now').getAttribute('aria-pressed'),'true');
   await hit('restart');
   assert.equal(await page.locator('#e06-world').isVisible(),true,'E07-only reset retains E06 evidence');
   assert.match(await page.locator('#e06-transfer-note').innerText(),/hypothetical PAPER sprout/);
   await page.locator('#e06-return').click();
   assert.match(page.url(),/\/e06-scene\/#paper=/);
   await page.locator('#lower-growth-tile[data-stage="paper-sprout"]').waitFor();
   await hit('restart');
   assert.equal(await page.locator('#e07-transfer').isVisible(),false,'E06 reset revokes the callback');
   await page.goto(base+'/e07-scene/');
   assert.equal(await page.locator('#e06-world').isVisible(),false);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['e06-e07-world-sentinel']);
   const size=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(size.scroll<=size.w+1,JSON.stringify({viewport,size}));
   assert.deepEqual(errors,[]);
  }finally{await ctx.close();}
 }
 console.log('E06-E07 PAPER garden world Chromium PASS: three viewports, FIRST/NOW, keyboard, resets, no storage');
}finally{await browser.close();}
