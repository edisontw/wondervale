// E10 -> E11 PAPER child-story handoff browser acceptance; never a production unlock.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try{
 for(const size of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const ctx=await browser.newContext({viewport:size,reducedMotion:'reduce'});
  try{
   const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(base+'/authoring-labs/unnamed-loop-handoff.html');
   assert.equal(response?.status(),200);
   const b=key=>page.locator('[data-key="'+key+'"]');
   const hit=async key=>{assert.equal(await b(key).isDisabled(),false,key);await b(key).click();};
   assert.match(await page.locator('.notice').innerText(),/NONCANONICAL/);
   assert.equal(await b('to-e11').isDisabled(),true);
   await page.evaluate(()=>localStorage.setItem('handoff-sentinel','keep'));
   for(const key of ['e10-start','compare-mark','walk-stone_edge','inspect-surface',
    'suggest-surface','revise-surface','walk-quiet_corner','hear-quiet','quiet-shared',
    'walk-meeting_edge','hear-activity','activity-shared','test-conflict','quiet-left',
    'activity-right','walk-notice_wall','inspect-holes','suggest-holes','check-source',
    'tradeoff','review-e10','finish-e10'])await hit(key);
   assert.match(await page.locator('#e10-hook').innerText(),/E11 NOT UNLOCKED/);
   assert.equal(await b('to-e11').isDisabled(),false);
   await hit('to-e11');
   assert.match(await page.locator('#status').innerText(),/SOURCE: UNKNOWN/);
   for(const key of ['e11-start','step-1','step-2','access','quiet','activity-first',
    'test-reader','test-group'])await hit(key);
   assert.match(await page.locator('#e11-tests').innerText(),/first conflict: true/);
   await hit('save-first');await hit('activity-revise');
   for(const key of ['test-reader','test-group','save-first','compare-trials','cite-needs',
    'edge-square-market','edge-market-common','edge-common-square','check-loop',
    'review-e11','finish-e11'])await hit(key);
   assert.match(await page.locator('#status').innerText(),/E11 PAPER finished: true/);
   assert.match(await page.locator('#e11-hook').innerText(),/Shared space CLOSED/);
   await hit('to-e10');assert.match(await page.locator('#status').innerText(),/Stage: e10/);
   await hit('to-e11');assert.match(await page.locator('#status').innerText(),/E11 PAPER finished: true/);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['handoff-sentinel']);
   const g=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,
    buttons:[...document.querySelectorAll('button:not(:disabled)')].filter(x=>x.offsetParent!==null)
     .map(x=>({w:x.getBoundingClientRect().width,h:x.getBoundingClientRect().height}))}));
   assert.ok(g.scroll<=g.width+1,JSON.stringify({size,g}));
   for(const x of g.buttons)assert.ok(x.w>=43.5&&x.h>=43.5,JSON.stringify({size,x}));
   await hit('restart-e10');
   assert.match(await page.locator('#status').innerText(),/E10 PAPER finished: false/);
   assert.equal(await b('to-e11').isDisabled(),true);
   await page.reload();
   assert.match(await page.locator('#status').innerText(),/E10 PAPER finished: false/);
   assert.deepEqual(errors,[]);
  }finally{await ctx.close();}
 }
 const ctx=await browser.newContext({viewport:{width:568,height:320}});
 try{
  const page=await ctx.newPage();await page.goto(base+'/authoring-labs/unnamed-loop-handoff.html');
  await page.locator('[data-key="e10-start"]').focus();await page.keyboard.press('Enter');
  await page.locator('[data-key="walk-stone_edge"]').focus();await page.keyboard.press('Space');
  assert.match(await page.locator('#e10-evidence').innerText(),/stone_edge/);
 }finally{await ctx.close();}
 console.log('E10->E11 PAPER handoff Chromium PASS: desktop, landscape, portrait, keyboard, revisit, no persistence');
}finally{await browser.close();}
