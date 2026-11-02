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
   assert.equal((await page.goto(base+'/e07-scene/'))?.status(),200);
   await page.evaluate(()=>localStorage.setItem('paper-sentinel','untouched'));
   const b=k=>page.locator('[data-key="'+k+'"]');
   const hit=async k=>{assert.equal(await b(k).isDisabled(),false,k);await b(k).click();};
   assert.equal(await page.locator('#e08-transfer').isVisible(),false);
   for(const k of ['start','walk-shared','inspect-shared','walk-channel','inspect-channel',
    'walk-workbench','test-milo','test-resident','test-water','place-water',
    'test-milo','test-resident','test-water','place-upper','test-water',
    'test-milo','test-resident','compare','finish','walk-start','walk-crossing',
    'walk-check-crossing','walk-water','walk-check-water','walk-base'])await hit(k);
   assert.equal(await page.locator('#e08-transfer').isVisible(),false);
   await hit('walk-review');
   assert.equal(await page.locator('#e08-transfer').isVisible(),true);
   assert.match(await page.locator('#hook').innerText(),/OFF/);
   await page.locator('#e08-transfer').click();
   await page.waitForFunction(()=>document.querySelector('#stage')?.textContent.includes('E08 opening'));
   assert.match(page.url(),/\/e08-scene\/#paper-steps=/);
   assert.match(await page.locator('#lamp-state').innerText(),/Lower A: OFF.*Lower B: OFF/);
   assert.equal(await page.locator('#e07-return').isVisible(),true);
   assert.match(await page.locator('#connector-trace').innerText(),/checked the model crossing/);
   assert.equal(await page.locator('#connector-world-panel').isVisible(),true);
   assert.equal(await page.locator('#connector-first-grid [data-conflict="true"]').count(),2);
   assert.equal(await page.locator('#connector-now-grid [data-conflict="true"]').count(),0);
   assert.match(await page.locator('#connector-world-result').innerText(),/real passage, drainage and lighting are NOT approved/);
   for(const k of ['start','inspect-brackets','inspect-boundary','inspect-a','lamp-a',
    'walk-landing','inspect-b','lamp-b','walk-base','observe','walk-landing',
    'walk-side','observe','compare','inspect-plate','finish'])await hit(k);
   assert.equal(await page.locator('#approach-panel').isVisible(),true);
   assert.match(await page.locator('#approach-route').innerText(),/FIRST short model.*2 connector overlap/);
   assert.equal(await page.locator('#approach-map [data-approach-marker]').count(),3);
   assert.equal(await page.locator('#approach-map [data-approach-ray]').count(),3);
   await page.locator('[data-approach="pin"]').click();
   assert.match(await page.locator('#approach-note').innerText(),/1\/4/);
   await page.locator('[data-approach="there"]').click();
   const there=await page.locator('#approach-view').innerText();
   await page.locator('[data-approach="pin"]').click();
   await page.locator('[data-approach="now"]').click();
   assert.match(await page.locator('#approach-route').innerText(),/NOW revised model.*0 connector overlap/);
   assert.match(await page.locator('#approach-view').innerText(),/Changing the PAPER route does not move these marks/);
   await page.locator('[data-approach="pin"]').click();
   await page.locator('[data-approach="here"]').click();
   assert.notEqual(await page.locator('#approach-view').innerText(),there);
   await page.locator('[data-approach="pin"]').click();
   assert.match(await page.locator('#approach-note').innerText(),/PAPER COMPARED/);
   assert.match(await page.locator('#approach-note').innerText(),/No real connector, lights or access approved/);
   assert.equal(await page.locator('[data-approach="pin"]').isDisabled(),true);
   await page.locator('[data-approach="clear"]').click();
   assert.match(await page.locator('#approach-note').innerText(),/0\/4/);
   assert.equal(await page.locator('[data-approach="pin"]').isDisabled(),false);
   assert.match(await page.locator('#steps-world-note').innerText(),/real lights NOT restored/);
   await page.locator('#e07-return').click();
   await page.waitForFunction(()=>document.querySelector('#route-feedback')?.textContent.includes('reviewed'));
   assert.match(await page.locator('#e08-paper-callback').innerText(),/two lower-model viewpoints/);
   assert.match(await page.locator('#e08-paper-callback').innerText(),/real Steps remain unlit/);
   await page.locator('#e08-transfer').click();
   await page.waitForFunction(()=>document.querySelector('#stage')?.textContent.includes('E08 finished'));
   assert.match(await page.locator('#trace-detail').innerText(),/never moved/);
   await hit('restart');
   assert.equal(await page.locator('#connector-world-panel').isVisible(),true);
   assert.equal(await page.locator('#connector-now-grid [data-conflict="true"]').count(),0);
   assert.match(await page.locator('#lamp-state').innerText(),/Lower A: OFF.*Lower B: OFF/);
   assert.equal(await page.locator('#approach-panel').isVisible(),false);
   await page.locator('#e07-return').click();
   await page.waitForFunction(()=>document.querySelector('#route-feedback')?.textContent.includes('reviewed'));
   assert.match(await page.locator('#e08-paper-callback').innerText(),/not yet made/);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['paper-sentinel']);
   assert.deepEqual(errors,[]);
   const size=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(size.scroll<=size.w+1,JSON.stringify({viewport,size}));
   await hit('restart');assert.equal(await page.locator('#e08-transfer').isVisible(),false);
   assert.equal((await page.goto(base+'/e08-scene/'))?.status(),200);
   assert.equal(await page.locator('#connector-world-panel').isVisible(),false);
   assert.equal(await page.locator('#approach-panel').isVisible(),false);
  }finally{await context.close();}
 }
 console.log('E07/E08 independent PAPER transfer Chromium PASS: 3 viewports, earned link, OFF boundary, return, restart');
}finally{await browser.close();}
