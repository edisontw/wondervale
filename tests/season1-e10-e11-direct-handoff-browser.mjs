import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import * as E10 from '../authoring-labs/unnamed-story-model.mjs';
import {encodeE10Handoff,decodeE10Handoff} from '../e11-scene/e10-direct-handoff.mjs';
const steps=[['start',{}],['compare-symbol',{}],['walk',{to:'stone_edge'}],['inspect',{traceId:'surface'}],['suggest',{traceId:'surface',useTag:'passing'}],['revise',{traceId:'surface',oldTag:'passing',newTag:'resting'}],['walk',{to:'quiet_corner'}],['hear',{needId:'quiet'}],['place',{needId:'quiet',slot:'shared'}],['walk',{to:'meeting_edge'}],['hear',{needId:'activity'}],['place',{needId:'activity',slot:'shared'}],['test-one-slot',{}],['place',{needId:'quiet',slot:'left'}],['place',{needId:'activity',slot:'right'}],['walk',{to:'notice_wall'}],['inspect',{traceId:'holes'}],['suggest',{traceId:'holes',useTag:'display'}],['check-source',{}],['review-tradeoff',{}],['review',{}],['finish-paper',{}]];
let s=E10.fresh();
for(const [type,extra] of steps){assert.equal(E10.can(s,{type,...extra}),true,type);s=E10.dispatch(s,{type,...extra});}
const packet=encodeE10Handoff(s.history);
assert.ok(packet.startsWith('#e10-paper='));
assert.deepEqual(decodeE10Handoff(packet),s.history);
assert.equal(encodeE10Handoff(s.history.slice(0,-1)),'');
assert.equal(decodeE10Handoff('#e10-paper=@@'),null);
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try {
 for(const [label,viewport,touch] of [['phone-landscape',{width:844,height:390},true],['keyboard',{width:1024,height:768},false]]){
  const context=await browser.newContext({viewport,hasTouch:touch,isMobile:touch});
  try{
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/e11-scene/two-needs-zones.html#e10-paper=@@');
   assert.equal(await page.locator('[data-need="quiet"]').first().isDisabled(),true);
   await page.goto(base+'/e11-scene/two-needs-zones.html'+packet);
   await page.waitForLoadState('load');
   const diagnostic=await page.evaluate(()=>({status:document.querySelector('#source-status')?.textContent,disabled:document.querySelector('[data-need="quiet"]')?.disabled,hash:location.hash.length}));
   assert.equal(diagnostic.disabled,false,JSON.stringify({label,diagnostic,errors}));
   assert.match(await page.locator('#source-status').innerText(),/verified/);
   assert.equal(new URL(page.url()).hash,'','accepted packet must be cleared from URL');
   await page.locator('[data-need="quiet"][data-zone="near"]').click();
   await page.locator('[data-need="making"][data-zone="far"]').click();
   await page.locator('#try').click();
   assert.match(await page.locator('#response').innerText(),/Nia:.*Finn:/);
   await page.locator('[data-need="quiet"][data-zone="far"]').click();
   await page.locator('[data-need="making"][data-zone="near"]').click();
   if(label==='keyboard'){await page.locator('#try').focus();await page.keyboard.press('Enter');}
   else await page.locator('#try').click();
   assert.match(await page.locator('#chronicle').innerText(),/PAPER Chronicle/);
   await page.locator('#undo').click();
   assert.equal(await page.locator('#chronicle').innerText(),'');
   await page.locator('#restart').click();
   assert.equal(await page.locator('[data-need="quiet"]').first().isDisabled(),true);
   assert.equal(await page.locator('#chronicle').innerText(),'');
   const widths=await page.evaluate(()=>({screen:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(widths.scroll<=widths.screen+1,JSON.stringify({label,widths}));
   assert.deepEqual(errors,[],label);
  }finally{await context.close();}
 }
}finally{await browser.close();}
console.log('E10-E11 direct PAPER handoff Chromium landscape/keyboard/undo/restart PASS');
