// Arc 1 E03 memories -> E04 UNKNOWN -> E05 station PAPER browser acceptance.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try{
 for(const size of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const ctx=await browser.newContext({viewport:size,reducedMotion:'reduce'});
  try{
   const page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(base+'/authoring-labs/arc1-memory-station-handoff.html');
   assert.equal(response?.status(),200);
   const b=key=>page.locator('[data-key="'+key+'"]');
   const hit=async key=>{assert.equal(await b(key).isDisabled(),false,key);await b(key).click();};
   assert.match(await page.locator('.notice').innerText(),/NONCANONICAL/);
   assert.equal(await b('to-e05').isDisabled(),true);
   assert.doesNotMatch(await page.locator('#memories').innerText(),/I remember a way to the station/);
   await page.evaluate(()=>localStorage.setItem('arc1-sentinel','keep'));
   await hit('inspect-station');
   assert.match(await page.locator('#memories').innerText(),/I remember a way to the station/);
   assert.doesNotMatch(await page.locator('#memories').innerText(),/I remember a way to the garden/);
   await hit('inspect-garden');
   assert.match(await page.locator('#memories').innerText(),/I remember a way to the garden/);
   await hit('station-earlier');await hit('garden-later');
   assert.equal(await b('compare').isDisabled(),true,'unsupported order is not evidence');
   await hit('station-unknown');await hit('garden-unknown');
   await hit('compare');await hit('finish-e04');
   assert.match(await page.locator('#e04-summary').innerText(),/Relative order UNKNOWN/);
   await hit('to-e05');
   assert.match(await page.locator('#status').innerText(),/production unlock: false/);
   for(const key of ['start-e05','walk-board','inspect-peg','inspect-worn',
    'guess-route','copy-b','check'])await hit(key);
   assert.match(await page.locator('#e05-board').innerText(),/fit false/);
   await hit('copy-a');await hit('check');
   assert.match(await page.locator('#e05-board').innerText(),/fit true/);
   for(const key of ['qualify','walk-table','table-block'])await hit(key);
   assert.match(await page.locator('#e05-table').innerText(),/walkway clear: false/);
   for(const key of ['table-clear','confirm','reflect'])await hit(key);
   assert.match(await page.locator('#status').innerText(),/E05 PAPER finished: true/);
   assert.match(await page.locator('#e05-note').innerText(),/PAPER NOTE/);
   await hit('to-e04');assert.match(await page.locator('#status').innerText(),/Stage: e04/);
   await hit('to-e05');assert.match(await page.locator('#status').innerText(),/E05 PAPER finished: true/);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['arc1-sentinel']);
   const g=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,
    buttons:[...document.querySelectorAll('button:not(:disabled)')].filter(x=>x.offsetParent!==null)
     .map(x=>({w:x.getBoundingClientRect().width,h:x.getBoundingClientRect().height}))}));
   assert.ok(g.scroll<=g.width+1,JSON.stringify({size,g}));
   for(const x of g.buttons)assert.ok(x.w>=43.5&&x.h>=43.5,JSON.stringify({size,x}));
   await hit('restart-e04');
   assert.match(await page.locator('#status').innerText(),/E04 PAPER finished: false/);
   assert.equal(await b('to-e05').isDisabled(),true);
   await page.reload();
   assert.match(await page.locator('#status').innerText(),/E04 PAPER finished: false/);
   assert.deepEqual(errors,[]);
  }finally{await ctx.close();}
 }
 const ctx=await browser.newContext({viewport:{width:568,height:320}});
 try{
  const page=await ctx.newPage();await page.goto(base+'/authoring-labs/arc1-memory-station-handoff.html');
  await page.locator('[data-key="inspect-station"]').focus();await page.keyboard.press('Enter');
  await page.locator('[data-key="inspect-garden"]').focus();await page.keyboard.press('Space');
  assert.match(await page.locator('#memories').innerText(),/I remember a way to the garden/);
 }finally{await ctx.close();}
 console.log('Arc 1 E03-E04-E05 PAPER Chromium PASS: desktop, landscape, portrait, keyboard, revision, revisit, no save');
}finally{await browser.close();}
