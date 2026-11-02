// E10 child-earned question/trace -> E11 reversible PAPER future marker.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import * as E10 from '../authoring-labs/unnamed-story-model.mjs';
import {sevenSceneUpstream} from './fixtures/season1-e04-e09-paper.mjs';
import {encodeMemoryCourtyard} from '../authoring-labs/e04-e10-scene-transfer.mjs';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const u=sevenSceneUpstream();
const fragment=encodeMemoryCourtyard(u.e04,u.e05,u.e06,u.e07,u.e08,u.e09,E10.fresh());
assert.ok(fragment);
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const context=await browser.newContext({viewport,reducedMotion:'reduce'});
  try{
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/e10-scene/'+fragment);
   const hit=async(type,value)=>page.locator('[data-action="'+type+'"]'+(value?'[data-value="'+value+'"]':'')).click();
   await hit('start');await hit('compare-symbol');await hit('walk','stone_edge');
   await hit('inspect','surface');await hit('suggest','surface:passing');
   await hit('revise','surface:passing:resting');await hit('walk','quiet_corner');
   await hit('hear','quiet');await hit('place','quiet:shared');await hit('walk','meeting_edge');
   await hit('hear','activity');await hit('place','activity:shared');await hit('test-one-slot');
   await hit('place','quiet:left');await hit('place','activity:right');
   await hit('walk','notice_wall');await hit('inspect','holes');await hit('suggest','holes:display');
   await hit('check-source');await hit('review-tradeoff');await hit('review');await hit('finish-paper');
   await page.locator('#question-identity').click();
   await page.locator('#question-wall').click();
   await page.locator('#question-compare').click();
   assert.equal(await page.locator('#hill-question-panel').getAttribute('data-compared'),'true');
   await page.locator('#e11-paper').click();
   await page.getByRole('button',{name:'Begin the PAPER trial'}).click();
   assert.equal(await page.locator('#hill-trace-world').isVisible(),true);
   assert.match(await page.locator('#hill-trace-first').innerText(),/mounting holes.*STILL UNKNOWN/);
   assert.equal(await page.locator('#hill-trace-now').getAttribute('data-marker'),'false');
   await page.getByRole('button',{name:/Move \? to ask the responsible person/}).click();
   assert.match(await page.locator('#hill-trace-now').innerText(),/does not check this question/);
   await page.getByRole('button',{name:/Move \? to request an attributed source/}).click();
   assert.match(await page.locator('#hill-trace-diary').innerText(),/NOT DONE/);
   assert.match(await page.locator('#hill-trace-diary').innerText(),/no real access/);
   await page.locator('#e10-return').click();
   assert.equal(await page.locator('#hill-question-panel').getAttribute('data-compared'),'true');
   await page.locator('#e11-paper').click();
   assert.equal(await page.locator('#hill-trace-now').getAttribute('data-marker'),'true','strictly replayed marker survives E10 round-trip');
   assert.match(await page.locator('#hill-trace-diary').innerText(),/NOT DONE/);
   await page.getByRole('button',{name:'Remove future ? marker'}).click();
   await page.locator('#e10-return').click();
   await page.locator('#e11-paper').click();
   assert.equal(await page.locator('#hill-trace-now').getAttribute('data-marker'),'false','removal survives E10 round-trip');
   await page.getByRole('button',{name:/Move \? to request an attributed source/}).click();
   await page.locator('#restart').click();
   await page.getByRole('button',{name:'Begin the PAPER trial'}).click();
   assert.equal(await page.locator('#hill-trace-now').getAttribute('data-marker'),'false','E11 restart removes replayed marker');
   assert.equal(await page.locator('#hill-trace-world').isVisible(),true,'E11 restart keeps earned E10 evidence');
   await page.locator('#e10-return').click();
   await page.locator('#restart').click();
   assert.equal(await page.locator('#e11-paper').isVisible(),false);
   await page.goto(base+'/e11-scene/');
   assert.equal(await page.locator('#hill-trace-world').isVisible(),false);
   const widths=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(widths.scroll<=widths.w+1,JSON.stringify({viewport,widths}));
   assert.deepEqual(errors,[]);
  }finally{await context.close();}
 }
 console.log('E10→E11 question/trace PAPER callback Chromium PASS: three viewports, safe retry, E10 return, resets and no rights');
}finally{await browser.close();}
