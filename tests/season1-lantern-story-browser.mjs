// E08 isolated PAPER story browser regression; not real device, source or deployment acceptance.
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
   const response=await page.goto(base+'/authoring-labs/lantern-story.html');
   assert.equal(response?.status(),200);
   const b=(type,value)=>page.locator('[data-action="'+type+'"]'+(value?'[data-value="'+value+'"]':''));
   const hit=(type,value)=>b(type,value).click();
   assert.match(await page.locator('.notice').innerText(),/SYNTHETIC/);
   await page.evaluate(()=>localStorage.setItem('lantern-sentinel','keep'));
   assert.equal(await b('observe-view').isDisabled(),true);
   await hit('start');
   assert.equal(await b('walk','side').isDisabled(),true);
   for(const f of ['brackets','boundary','lower-a'])await hit('inspect',f);
   await hit('toggle-lamp','lower-a');
   assert.equal(await b('observe-view').isDisabled(),true);
   await hit('walk','lower-landing');await hit('inspect','lower-b');await hit('toggle-lamp','lower-b');
   await hit('walk','base');await hit('observe-view');
   assert.match(await page.locator('#parent').innerText(),/another safe place/);
   assert.equal(await b('compare-views').isDisabled(),true);
   await hit('walk','lower-landing');await hit('walk','side');await hit('observe-view');
   assert.match(await page.locator('#second').innerText(),/side lookout/);
   await hit('compare-views');
   assert.match(await page.locator('#compare-note').innerText(),/not historical proof/);
   assert.equal(await b('confirm-preview').isDisabled(),true);
   await hit('inspect','service-plate');await hit('confirm-preview');
   assert.match(await page.locator('#note').innerText(),/UNKNOWN/);
   assert.match(await page.locator('#note').innerText(),/NOT UNLOCKED/);
   assert.match(await page.locator('#note').innerText(),/CLOSED/);
   assert.equal(await b('walk','base').isDisabled(),true);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['lantern-sentinel']);
   const widths=await page.evaluate(()=>({inner:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(widths.scroll<=widths.inner+1,JSON.stringify({size,widths}));
   await page.locator('#restart').click();
   assert.match(await page.locator('#stage').innerText(),/opening/);
   await page.reload();
   assert.match(await page.locator('#stage').innerText(),/opening/);
   assert.deepEqual(errors,[]);
  }finally{await ctx.close();}
 }
 const ctx=await browser.newContext({viewport:{width:568,height:320}});
 try{
  const page=await ctx.newPage();await page.goto(base+'/authoring-labs/lantern-story.html');
  await bkey(page,'start',null,'Enter');
  await bkey(page,'inspect','brackets','Space');
  assert.match(await page.locator('#inspected').innerText(),/brackets/);
 }finally{await ctx.close();}
 console.log('E08 lantern PAPER story Chromium PASS: desktop, phone, keyboard, reset and no storage');
}finally{await browser.close();}
async function bkey(page,type,value,key){
 const loc=page.locator('[data-action="'+type+'"]'+(value?'[data-value="'+value+'"]':''));
 await loc.focus();await page.keyboard.press(key);
}
