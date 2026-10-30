// Isolated E09 PAPER story browser journey, not real access or production acceptance.
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
   const response=await page.goto(base+'/authoring-labs/hill-story.html');
   assert.equal(response?.status(),200);
   const b=(type,value)=>page.locator('[data-action="'+type+'"]'+(value?'[data-value="'+value+'"]':''));
   const hit=(type,value)=>b(type,value).click();
   assert.match(await page.locator('.notice').innerText(),/FICTIONAL HILL GRAPH/);
   await page.evaluate(()=>localStorage.setItem('hill-story-sentinel','keep'));
   assert.equal(await b('walk','signpost').isDisabled(),true);
   assert.equal(await b('finish-preview').isDisabled(),true);
   await hit('start');
   assert.equal(await b('walk','overlook').isDisabled(),true);
   await hit('inspect','entry_note');
   await hit('walk','signpost');await hit('inspect','boundary_sign');
   assert.match(await page.locator('#parent').innerText(),/without crossing/);
   await hit('walk','fence_view');await hit('inspect','disturbed_ground');
   await hit('walk','upper_closed');
   assert.match(await page.locator('#feedback').innerText(),/closed/i);
   assert.match(await page.locator('#stage').innerText(),/fence view/);
   await hit('consider','water_may_change_ground');
   await hit('mark','fence_view:upper_closed');
   assert.match(await page.locator('#feedback').innerText(),/closed edge/i);
   await hit('walk','signpost');await hit('walk','lower_bend');
   await hit('inspect','runoff_marks');
   await hit('walk','overlook');await hit('inspect','distant_symbol');
   await hit('mark','steps_base:signpost');await hit('mark','lower_bend:overlook');
   await hit('check-route');
   assert.match(await page.locator('#route').innerText(),/signpost:lower_bend/);
   assert.equal(await b('review').isDisabled(),true);
   await hit('mark','signpost:lower_bend');await hit('check-route');
   assert.match(await page.locator('#route').innerText(),/reaches lower overlook/);
   await hit('unmark','signpost:lower_bend');
   assert.match(await page.locator('#route').innerText(),/No checked route/);
   await hit('mark','signpost:lower_bend');await hit('check-route');
   await hit('compare-symbol');await hit('review');await hit('finish-preview');
   assert.match(await page.locator('#hook').innerText(),/UNKNOWN/);
   assert.match(await page.locator('#hook').innerText(),/NOT UNLOCKED/);
   assert.match(await page.locator('#hook').innerText(),/CLOSED/);
   assert.equal(await b('walk','lower_bend').isDisabled(),true);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['hill-story-sentinel']);
   const g=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,
    buttons:[...document.querySelectorAll('button:not(:disabled)')].map(x=>({w:x.getBoundingClientRect().width,h:x.getBoundingClientRect().height}))}));
   assert.ok(g.scroll<=g.width+1,JSON.stringify({size,g}));
   for(const x of g.buttons)assert.ok(x.w>=43.5&&x.h>=43.5,JSON.stringify(x));
   await page.locator('#restart').click();
   assert.match(await page.locator('#stage').innerText(),/opening/);
   await page.reload();
   assert.match(await page.locator('#stage').innerText(),/opening/);
   assert.deepEqual(errors,[]);
  }finally{await ctx.close();}
 }
 const ctx=await browser.newContext({viewport:{width:568,height:320}});
 try{
  const page=await ctx.newPage();await page.goto(base+'/authoring-labs/hill-story.html');
  const key=async(type,value,k)=>{
   const b=page.locator('[data-action="'+type+'"]'+(value?'[data-value="'+value+'"]':''));
   await b.focus();await page.keyboard.press(k);
  };
  await key('start',null,'Enter');
  await key('inspect','entry_note','Space');
  assert.match(await page.locator('#seen').innerText(),/old sketch/);
  await key('walk','signpost','Enter');
  assert.match(await page.locator('#stage').innerText(),/signpost/);
 }finally{await ctx.close();}
 console.log('E09 PAPER story Chromium PASS: desktop, landscape, portrait, keyboard, restart and no storage');
}finally{await browser.close();}
