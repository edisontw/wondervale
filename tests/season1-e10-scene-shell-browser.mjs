// Isolated E10 PAPER story browser journey, not production release or approved source.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try{
 for(const size of [{width:1366,height:900},{width:568,height:320},{width:667,height:375},{width:390,height:844}]){
  const ctx=await browser.newContext({viewport:size,reducedMotion:'reduce'});
  try{
   const page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(base+'/e10-scene/');
   assert.equal(response?.status(),200);
   const b=(type,value)=>page.locator('[data-action="'+type+'"]'+(value?'[data-value="'+value+'"]':''));
   const hit=(type,value)=>b(type,value).click();
   assert.match(await page.locator('.notice').innerText(),/FICTIONAL COURTYARD/);
   await page.evaluate(()=>localStorage.setItem('e10-paper-sentinel','keep'));
   assert.equal(await b('walk','stone_edge').isDisabled(),true);
   assert.equal(await b('finish-paper').isDisabled(),true);
   await hit('start');
   assert.equal(await b('walk','meeting_edge').isDisabled(),true);
   await hit('compare-symbol');
   await hit('walk','stone_edge');await hit('inspect','surface');
   await hit('suggest','surface:passing');
   await hit('revise','surface:passing:resting');
   assert.match(await page.locator('#maybe').innerText(),/resting \(MAYBE\)/);
   await hit('walk','quiet_corner');await hit('hear','quiet');
   await hit('place','quiet:shared');
   await hit('walk','meeting_edge');await hit('hear','activity');
   await hit('place','activity:shared');
   assert.match(await page.locator('#parent-needs').innerText(),/Whose need/);
   assert.equal(await b('review-tradeoff').isDisabled(),true);
   await hit('test-one-slot');
   assert.match(await page.locator('#feedback').innerText(),/one shared spot/i);
   await hit('place','quiet:left');await hit('place','activity:right');
   assert.match(await page.locator('#needs').innerText(),/left/);
   await hit('walk','notice_wall');await hit('inspect','holes');
   assert.match(await page.locator('#parent-evidence').innerText(),/more than one use/);
   await hit('suggest','holes:display');
   await hit('check-source');
   assert.match(await page.locator('#line').innerText(),/UNKNOWN/);
   await hit('review-tradeoff');await hit('review');await hit('finish-paper');
   assert.match(await page.locator('#stage').innerText(),/finished/);
   const hook=await page.locator('#hook').innerText();
   assert.match(hook,/UNKNOWN/);assert.match(hook,/E11 NOT UNLOCKED/);
   assert.equal(/\bCommon\b/.test(hook),false);
   assert.equal(await b('walk','entry').isDisabled(),true);
   assert.equal(await page.locator('#e09-callback').isDisabled(),false);
   await page.locator('#e09-callback').click();
   assert.equal(await page.locator('#e09-notes').isVisible(),true);
   assert.equal(await page.locator('#e10-work').isVisible(),false);
   await page.locator('#e10-back').click();
   assert.equal(await page.locator('#e10-work').isVisible(),true);
   assert.match(await page.locator('#stage').innerText(),/finished/);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['e10-paper-sentinel']);
   const g=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,
    buttons:[...document.querySelectorAll('button:not(:disabled)')].filter(x=>x.getClientRects().length>0).map(x=>({w:x.getBoundingClientRect().width,h:x.getBoundingClientRect().height}))}));
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
  const page=await ctx.newPage();await page.goto(base+'/e10-scene/');
  const key=async(type,value,k)=>{
   const b=page.locator('[data-action="'+type+'"]'+(value?'[data-value="'+value+'"]':''));
   await b.focus();await page.keyboard.press(k);
  };
  await key('start',null,'Enter');
  await key('compare-symbol',null,'Space');
  assert.match(await page.locator('#line').innerText(),/does not prove a name/);
  await key('walk','stone_edge','Enter');
  assert.match(await page.locator('#stage').innerText(),/stone edge/);
 }finally{await ctx.close();}
 console.log('E10 independent scene Chromium PASS: four viewports, keyboard, read-only E09 callback, restart, no storage');
}finally{await browser.close();}
