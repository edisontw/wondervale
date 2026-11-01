// Two independent PAPER scenes: E08 earned -> E09 surveyed -> E10 investigated -> E09 return.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import * as E08 from '../e08-scene/scene-model.mjs';
import * as E09 from '../e09-scene/scene-model.mjs';
import {encodeHillTransfer} from '../authoring-labs/e08-e09-scene-transfer.mjs';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const a=(type,key,value)=>({scene:'story',action:key?{type,[key]:value}:{type}});
function steps(){
 let s=E08.fresh();
 for(const x of [a('start'),a('inspect','feature','brackets'),a('inspect','feature','boundary'),
  a('inspect','feature','lower-a'),a('toggle-lamp','lampId','lower-a'),
  a('walk','anchor','lower-landing'),a('inspect','feature','lower-b'),
  a('toggle-lamp','lampId','lower-b'),a('walk','anchor','base'),a('observe-view'),
  a('walk','anchor','lower-landing'),a('walk','anchor','side'),a('observe-view'),
  a('compare-views'),a('inspect','feature','service-plate'),a('confirm-preview')]){
  assert.equal(E08.can(s,x),true,JSON.stringify(x));s=E08.dispatch(s,x);
 }return s;
}
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const ctx=await browser.newContext({viewport,reducedMotion:'reduce'});
  try{
   const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   const fragment=encodeHillTransfer(steps(),E09.fresh());
   assert.ok(fragment);
   await page.goto(base+'/e09-scene/'+fragment);
   await page.evaluate(()=>localStorage.setItem('paper-transfer-sentinel','keep'));
   assert.equal(await page.locator('#e10-paper').isVisible(),false);
   const hit=async key=>page.locator('[data-key="'+key+'"]').click();
   for(const key of ['start','inspect-entry_note','walk-signpost','inspect-boundary_sign',
    'walk-fence_view','walk-upper_closed','inspect-disturbed_ground','walk-signpost',
    'walk-lower_bend','inspect-runoff_marks','walk-overlook','inspect-distant_symbol',
    'mark-steps_base:signpost','mark-signpost:lower_bend','mark-lower_bend:overlook',
    'check-route','compare-symbol','review','finish-preview'])await hit(key);
   assert.equal(await page.locator('#e10-paper').isVisible(),true);
   assert.match(await page.locator('#hook').innerText(),/E10 remains NOT UNLOCKED/);
   await page.locator('#e10-paper').click();
   assert.match(page.url(),/\/e10-scene\/#paper-unnamed=/);
   await page.waitForFunction(()=>document.querySelector('#hill-context')?.textContent?.includes('Milo inspected 5 fictional clues'));
   assert.match(await page.locator('#hill-context').innerText(),/Milo inspected 5 fictional clues/);
   assert.match(await page.locator('#hill-context').innerText(),/CLOSED/);
   assert.equal(await page.locator('#e09-return').isVisible(),true);
   assert.equal(await page.locator('#hill-world-panel').isVisible(),true);
   assert.equal(await page.locator('#hill-world-map [data-edge]').count(),4);
   assert.equal(await page.locator('#hill-world-map [data-marked="true"]').count(),3);
   assert.equal(await page.locator('#hill-world-map [data-clue]').count(),5);
   assert.equal(await page.locator('#hill-world-map [data-closed="true"]').count(),1);
   assert.match(await page.locator('#hill-world-result').innerText(),/NOW.*CLOSED.*NOT approved/);
   await page.locator('#hill-first').click();
   assert.equal(await page.locator('#hill-world-map [data-marked="true"]').count(),0);
   assert.equal(await page.locator('#hill-world-map [data-clue]').count(),0);
   assert.equal(await page.locator('#hill-world-map [data-closed="true"]').count(),1);
   await page.locator('#hill-now').click();
   assert.equal(await page.locator('#hill-world-map [data-marked="true"]').count(),3);
   const b=(type,value)=>page.locator('[data-action="'+type+'"]'+(value?'[data-value="'+value+'"]':''));
   const e10=async(type,value)=>b(type,value).click();
   await e10('start');await e10('compare-symbol');await e10('walk','stone_edge');
   await e10('inspect','surface');await e10('suggest','surface:passing');
   await e10('revise','surface:passing:resting');await e10('walk','quiet_corner');
   await e10('hear','quiet');await e10('place','quiet:shared');await e10('walk','meeting_edge');
   await e10('hear','activity');await e10('place','activity:shared');await e10('test-one-slot');
   await e10('place','quiet:left');await e10('place','activity:right');
   await e10('walk','notice_wall');await e10('inspect','holes');await e10('suggest','holes:display');
   await e10('check-source');await e10('review-tradeoff');await e10('review');await e10('finish-paper');
   assert.match(await page.locator('#hook').innerText(),/E11 NOT UNLOCKED/);
   assert.equal(await page.locator('#paper-comparison').isVisible(),true);
   await page.locator('#e09-return').click();
   assert.match(page.url(),/\/e09-scene\/#paper-unnamed=/);
   await page.waitForFunction(()=>document.querySelector('#stage')?.textContent?.includes('finished'));
   assert.match(await page.locator('#stage').innerText(),/finished/);
   assert.equal(await page.locator('#scene .evidence-pin').count(),4);
   assert.match(await page.locator('#scene .closed-label').innerText(),/CLOSED/);
   await page.locator('#e10-paper').click();
   await page.waitForFunction(()=>document.querySelector('#stage')?.textContent?.includes('finished'));
   assert.match(await page.locator('#stage').innerText(),/finished/);
   assert.equal(await page.locator('#paper-comparison').isVisible(),true);
   assert.equal(await page.locator('#hill-world-map [data-marked="true"]').count(),3);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['paper-transfer-sentinel']);
   const widths=await page.evaluate(()=>({screen:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(widths.scroll<=widths.screen+1,JSON.stringify({viewport,widths}));
   assert.deepEqual(errors,[]);
   await page.locator('#restart').click();
   assert.match(await page.locator('#stage').innerText(),/opening/);
   assert.equal(await page.locator('#paper-comparison').isVisible(),false);
   assert.equal(await page.locator('#hill-world-panel').isVisible(),true);
   assert.equal(await page.locator('#hill-world-map [data-marked="true"]').count(),3);
   assert.equal(await page.locator('#e09-return').isVisible(),true);
   await page.locator('#e09-return').click();
   await page.locator('#restart').click();
   assert.equal(await page.locator('#e10-paper').isVisible(),false);
  }finally{await ctx.close();}
 }
 const direct=await browser.newContext();
 try{
  const page=await direct.newPage();
  await page.goto(base+'/e10-scene/');
  assert.equal(await page.locator('#hill-world-panel').isVisible(),false);
  assert.equal(await page.locator('#e09-return').isVisible(),false);
 }finally{await direct.close();}
 console.log('E09-E10 independent PAPER transfer Chromium PASS: earned links, closed hill, 3 viewports, reversible E10, reset and no storage writes');
}finally{await browser.close();}
