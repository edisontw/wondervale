import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {earnedHistory} from './season1-e11-e05-earned-layout.test.mjs';
import {encodeE05Handoff} from '../e11-scene/e05-direct-handoff.mjs';
const hash=encodeE05Handoff(earnedHistory());assert.ok(hash);
const browser=await chromium.launch({headless:true});
try{
 for(const [name,viewport,touch] of [['landscape',{width:844,height:390},true],['keyboard',{width:1024,height:768},false]]){
  const context=await browser.newContext({viewport,hasTouch:touch,isMobile:touch});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/e11-scene/#e05-paper=invalid');
  assert.match(await page.locator('#e05-earned-context').innerText(),/No child-checked/);
  await page.goto('http://127.0.0.1:4173/e11-scene/'+hash);
  assert.match(await page.locator('#e05-earned-context').innerText(),/Milo tried a PAPER Map Room/);
  assert.equal(new URL(page.url()).hash,'');
  assert.match(await page.locator('#e05-earned-context').innerText(),/no station access/i);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,name);
  await page.locator('#restart').focus();await page.keyboard.press('Enter');
  assert.deepEqual(errors,[],name);
  await context.close();
 }
}finally{await browser.close();}
console.log('E05 to E11 existing scene landscape and keyboard Chromium PASS');
