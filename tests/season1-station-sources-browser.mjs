// Isolated E05 MOCK source board: no production progress or source approval.
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
   assert.equal((await page.goto(base+'/authoring-labs/station-sources.html'))?.status(),200);
   await page.evaluate(()=>localStorage.setItem('sentinel','keep'));
   const hit=async(type,card,slot)=>{
    let selector='[data-action="'+type+'"]';
    if(card)selector+='[data-card="'+card+'"]';
    if(slot)selector+='[data-slot="'+slot+'"]';
    await page.locator(selector).click();
   };
   assert.match(await page.locator('.notice').innerText(),/AUTHORING ONLY/);
   assert.equal(await page.locator('[data-action="finish"]').isDisabled(),true);
   await hit('start');
   for(const card of ['a','b']){
    await page.locator('[data-action="walk"][data-value="desk-'+card+'"]').click();
    await hit('inspect',card);await hit('source-check',card);
    assert.match(await page.locator('#card-'+card+' .provenance').innerText(),/maker UNKNOWN.*date UNKNOWN.*original UNKNOWN/);
   }
   await page.locator('[data-action="walk"][data-value="compare"]').click();
   await hit('place','a','earlier');await hit('test','a');
   assert.match(await page.locator('#line').innerText(),/dated source/);
   assert.equal(await page.locator('[data-action="compare"]').isDisabled(),true);
   await hit('place','a','unknown');await hit('test','a');
   await hit('place','b','unknown');await hit('test','b');
   await hit('compare');assert.match(await page.locator('#comparison').innerText(),/Historical order.*UNKNOWN/);
   await hit('finish');assert.match(await page.locator('#note').innerText(),/PAPER REQUEST ONLY/);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['sentinel']);
   const size=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(size.scroll<=size.width+1,JSON.stringify({viewport,size}));
   assert.deepEqual(errors,[]);
   await page.locator('#restart').click();
   assert.match(await page.locator('#note').innerText(),/No verified source/);
  }finally{await context.close();}
 }
 const context=await browser.newContext({viewport:{width:568,height:320}});
 try{
  const page=await context.newPage();await page.goto(base+'/authoring-labs/station-sources.html');
  await page.locator('[data-action="start"]').focus();await page.keyboard.press('Enter');
  await page.locator('[data-action="walk"][data-value="desk-a"]').focus();await page.keyboard.press('Space');
  assert.match(await page.locator('#milo').innerText(),/desk-a/);
 }finally{await context.close();}
 console.log('E05 MOCK source detective Chromium PASS: 3 sizes, keyboard, provenance, uncertain chronology, retry, reset, no storage');
}finally{await browser.close();}
