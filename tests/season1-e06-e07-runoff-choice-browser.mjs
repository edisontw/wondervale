import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const context=await browser.newContext({viewport,reducedMotion:'reduce'});
  try{
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/e07-scene/');
   assert.equal(await page.locator('#garden-flow').isVisible(),false);
   await page.goto(base+'/e06-scene/');
   await page.evaluate(()=>localStorage.setItem('paper-runoff-sentinel','keep'));
   const b=k=>page.locator('[data-key="'+k+'"]');
   const hit=async k=>{assert.equal(await b(k).isDisabled(),false,k);await b(k).click();};
   for(const k of ['start','bed','slope-walk','slope','tray-walk','run','rain','run',
    'blocked','run','compare','enter','trace','lower-path-walk','lower-path',
    'channel-walk','channel-place','check','pocket-walk','pocket-place','check',
    'think','finish','heavy-care','test-care','gentle-care','test-care','compare-care'])
    await hit(k);
   await page.locator('#e07-transfer').click();
   await page.locator('#e06-world').waitFor({state:'visible'});
   assert.equal(await page.locator('#garden-flow').isVisible(),false);
   for(const k of ['start','walk-shared','inspect-shared','walk-channel','inspect-channel',
    'walk-workbench','test-milo','test-resident','test-water','place-water',
    'test-milo','test-resident','test-water','place-upper','test-water',
    'test-milo','test-resident','compare','finish','walk-start','walk-crossing',
    'walk-check-crossing','walk-water','walk-check-water','walk-base','walk-review'])
    await hit(k);
   await page.locator('#garden-flow').waitFor({state:'visible'});
   assert.match(await page.locator('#flow-water').innerText(),/BLOCKED: 3 of 3/);
   assert.equal(await page.locator('#flow-grid [data-conflict="true"]').count(),2);
   await page.locator('[data-flow-channel="open"]').focus();await page.keyboard.press('Enter');
   assert.match(await page.locator('#flow-water').innerText(),/OPEN: 1 of 3/);
   await page.locator('[data-flow-phase="now"]').click();
   assert.equal(await page.locator('#flow-grid [data-conflict="true"]').count(),0);
   assert.match(await page.locator('#flow-summary').innerText(),/Both separate PAPER checks are clear/);
   await page.locator('[data-flow-channel="blocked"]').click();
   assert.match(await page.locator('#flow-summary').innerText(),/two separate PAPER models/i);
   await page.locator('[data-flow-phase="first"]').click();
   assert.equal(await page.locator('#flow-grid [data-conflict="true"]').count(),2);
   await hit('restart');
   assert.equal(await page.locator('#garden-flow').isVisible(),false);
   await page.locator('#e06-return').click();
   await hit('restart');
   assert.equal(await page.locator('#e07-transfer').isVisible(),false);
   await page.goto(base+'/e07-scene/');
   assert.equal(await page.locator('#garden-flow').isVisible(),false);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['paper-runoff-sentinel']);
   const size=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(size.scroll<=size.w+1,JSON.stringify({viewport,size}));
   assert.deepEqual(errors,[]);
  }finally{await context.close();}
 }
 console.log('E06-E07 independent rain/connector PAPER choices Chromium PASS: 3 viewports, keyboard, visible consequences, reset');
}finally{await browser.close();}
