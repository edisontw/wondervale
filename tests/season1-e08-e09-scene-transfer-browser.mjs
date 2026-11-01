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
   assert.equal((await page.goto(base+'/e08-scene/'))?.status(),200);
   await page.evaluate(()=>localStorage.setItem('paper-sentinel','keep'));
   const b=k=>page.locator('[data-key="'+k+'"]');
   const hit=async k=>{assert.equal(await b(k).isDisabled(),false,k);await b(k).click();};
   assert.equal(await page.locator('#e09-transfer').isVisible(),false);
   for(const k of ['start','inspect-brackets','inspect-boundary','inspect-a','lamp-a',
    'walk-landing','inspect-b','lamp-b','walk-base','observe','walk-landing',
    'walk-side','observe','compare','inspect-plate','finish'])await hit(k);
   assert.equal(await page.locator('#e09-transfer').isVisible(),true);
   assert.match(await page.locator('#hook').innerText(),/E09 NOT UNLOCKED/);
   await page.locator('#e09-transfer').click();
   await page.waitForFunction(()=>document.querySelector('#stage')?.textContent.includes('E09 opening'));
   assert.match(page.url(),/\/e09-scene\/#paper-hill=/);
   assert.match(await page.locator('#lantern-context').innerText(),/SAME marks looked different/);
   assert.match(await page.locator('#lantern-context').innerText(),/CLOSED hill/);
   assert.equal(await page.locator('#e08-return').isVisible(),true);
   assert.equal(await page.locator('#lantern-world-panel').isVisible(),true);
   assert.equal(await page.locator('#lantern-world-map .view-ray').count(),6);
   assert.equal(await page.locator('#lantern-world-map [data-fixed-marker]').count(),3);
   assert.equal(await page.locator('#lantern-world-map [data-viewpoint]').count(),2);
   assert.equal(await page.locator('#lantern-world-map [data-lamp][data-on="true"]').count(),2);
   assert.match(await page.locator('#lantern-world-result').innerText(),/Real lights NOT restored.*Upper hill CLOSED/);
   await page.locator('#lantern-first').click();
   assert.equal(await page.locator('#lantern-world-map .view-ray').count(),0);
   assert.equal(await page.locator('#lantern-world-map [data-lamp][data-on="false"]').count(),2);
   assert.match(await page.locator('#lantern-world-result').innerText(),/FIRST.*OFF.*CLOSED/);
   await page.locator('#lantern-now').click();
   assert.equal(await page.locator('#lantern-world-map .view-ray').count(),6);
   await hit('start');await hit('inspect-entry_note');await hit('walk-signpost');
   await hit('inspect-boundary_sign');await hit('walk-fence_view');await hit('walk-upper_closed');
   assert.match(await page.locator('#feedback').innerText(),/closed/i);
   await hit('inspect-disturbed_ground');await hit('walk-signpost');
   await hit('walk-lower_bend');await hit('inspect-runoff_marks');await hit('walk-overlook');
   await hit('inspect-distant_symbol');await hit('mark-steps_base:signpost');
   await hit('mark-signpost:lower_bend');await hit('mark-lower_bend:overlook');
   await hit('check-route');await hit('compare-symbol');await hit('review');await hit('finish-preview');
   assert.match(await page.locator('#chronicle').innerText(),/E10 NOT UNLOCKED/);
   await page.locator('#e08-return').click();
   await page.waitForFunction(()=>document.querySelector('#stage')?.textContent.includes('E08 finished'));
   assert.match(await page.locator('#e09-callback').innerText(),/E09 PAPER return/);
   await page.locator('#e09-transfer').click();
   await page.waitForFunction(()=>document.querySelector('#stage')?.textContent.includes('E09 finished'));
   assert.match(await page.locator('#survey-summary').innerText(),/Milo walked 4 model edges/);
   assert.equal(await page.locator('#lantern-world-map .view-ray').count(),6);
   await page.locator('#restart').click();
   assert.match(await page.locator('#stage').innerText(),/opening/);
   assert.equal(await page.locator('#lantern-world-map .view-ray').count(),6);
   await page.locator('#e08-return').click();
   await page.waitForFunction(()=>document.querySelector('#stage')?.textContent.includes('E08 finished'));
   await hit('restart');
   assert.equal(await page.locator('#e09-transfer').isVisible(),false);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['paper-sentinel']);
   assert.deepEqual(errors,[]);
   const size=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(size.scroll<=size.w+1,JSON.stringify({viewport,size}));
  }finally{await context.close();}
 }
 const context=await browser.newContext();
 try{
  const page=await context.newPage();await page.goto(base+'/e09-scene/');
  assert.equal(await page.locator('#e08-return').isVisible(),false);
  assert.match(await page.locator('#lantern-context').innerText(),/No E08 PAPER viewpoint record linked/);
  assert.equal(await page.locator('#lantern-world-panel').isVisible(),false);
 }finally{await context.close();}
 console.log('E08/E09 PAPER handoff Chromium PASS: 3 viewports, earned two-view clue, CLOSED hill, round trip, scoped resets');
}finally{await browser.close();}
