// E10 and E11 are two separate, reversible authoring-only PAPER scenes.
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
   await page.goto(base+'/e10-scene/');
   await page.evaluate(()=>localStorage.setItem('e10-e11-sentinel','keep'));
   assert.equal(await page.locator('#e11-paper').isVisible(),false);
   const b=(type,value)=>page.locator('[data-action="'+type+'"]'+(value?'[data-value="'+value+'"]':''));
   const hit=(type,value)=>b(type,value).click();
   await hit('start');await hit('compare-symbol');await hit('walk','stone_edge');
   await hit('inspect','surface');await hit('suggest','surface:passing');
   await hit('revise','surface:passing:resting');await hit('walk','quiet_corner');
   await hit('hear','quiet');await hit('place','quiet:shared');await hit('walk','meeting_edge');
   await hit('hear','activity');await hit('place','activity:shared');await hit('test-one-slot');
   await hit('place','quiet:left');await hit('place','activity:right');
   await hit('walk','notice_wall');await hit('inspect','holes');await hit('suggest','holes:display');
   await hit('check-source');await hit('review-tradeoff');await hit('review');await hit('finish-paper');
   assert.equal(await page.locator('#e11-paper').isVisible(),true);
   assert.match(await page.locator('#hook').innerText(),/E11 NOT UNLOCKED/);
   await page.locator('#e11-paper').click();
   assert.match(page.url(),/\/e11-scene\/#paper-loop=/);
   assert.match(await page.locator('#e10-linked-context').innerText(),/observed 2 fictional traces/);
   assert.match(await page.locator('#e10-linked-notes').innerText(),/SIMULATED NEEDS/);
   assert.match(await page.locator('#e10-linked-notes').innerText(),/UNKNOWN/);
   assert.equal(await page.locator('#grid .quiet').count(),0,'E10 cannot pre-place E11 pieces');
   const press=async name=>page.getByRole('button',{name,exact:true}).click();
   await press('Begin the PAPER trial');
   await press('Place access strip (two middle cells)');
   await press('Place quiet seat');await press('Cell 0,1');
   await press('Place activity area');await press('Cell 0,2');
   await press('Test Quiet reader');await press('Test Activity group');
   await press('Save tested trial');
   await press('Place activity area');await press('Cell 2,1');
   await press('Test Quiet reader');await press('Test Activity group');
   await press('Save tested trial');await press('Compare FIRST and NOW');
   assert.match(await page.locator('#revisit-first-result').innerText(),/RETRY/);
   assert.match(await page.locator('#revisit-now-result').innerText(),/PASS/);
   await page.locator('#e10-return').click();
   assert.match(page.url(),/\/e10-scene\/#paper-loop=/);
   assert.match(await page.locator('#stage').innerText(),/finished/);
   assert.equal(await page.locator('#paper-comparison').isVisible(),true);
   await page.locator('#e11-paper').click();
   assert.match(await page.locator('#comparison').innerText(),/trial-1 → NOW trial-2/);
   assert.equal(await page.locator('#revisit').isVisible(),true);
   assert.match(await page.locator('#e10-linked-notes').innerText(),/SEEN/);
   assert.match(await page.locator('.notice').innerText(),/North Hill/);
   assert.match(await page.locator('#chronicle').innerText(),/canonical events: 0; unlocks: 0/);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['e10-e11-sentinel']);
   const widths=await page.evaluate(()=>({screen:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(widths.scroll<=widths.screen+1,JSON.stringify({viewport,widths}));
   assert.deepEqual(errors,[]);
   await page.locator('#restart').click();
   assert.equal(await page.locator('#revisit').isVisible(),false);
   await page.locator('#e10-return').click();
   assert.match(await page.locator('#stage').innerText(),/finished/);
   await page.locator('#e11-paper').click();
   assert.equal(await page.locator('#revisit').isVisible(),false,'E11 reset clears E11 only');
   await page.locator('#e10-return').click();
   await page.locator('#restart').click();
   assert.equal(await page.locator('#e11-paper').isVisible(),false,'E10 reset withdraws E11 link');
  }finally{await ctx.close();}
 }
 console.log('E10-E11 independent PAPER transfer Chromium PASS: 3 viewports, earned entry, FIRST/NOW, return, resets, closed rights and no storage writes');
}finally{await browser.close();}
