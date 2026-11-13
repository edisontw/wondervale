import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});
try {
 for(const [name,viewport,touch] of [['phone-landscape',{width:844,height:390},true],['keyboard',{width:1024,height:768},false]]) {
  const context=await browser.newContext({viewport,hasTouch:touch,isMobile:touch});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  assert.equal((await page.goto('http://127.0.0.1:4173/e11-scene/e07-earned-shared-path.html'))?.status(),200);
  assert.equal(await page.locator('#test').isDisabled(),true);
  await page.locator('#source').setInputFiles({name:'forged.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify([{scene:'walkthrough',type:'review'}]))});
  assert.match(await page.locator('#source-status').innerText(),/required/);
  assert.equal(await page.locator('#shared').isDisabled(),true);
  await page.locator('#restart').focus();await page.keyboard.press('Enter');
  assert.match(await page.locator('#source-status').innerText(),/required/);
  assert.equal(await page.locator('#undo').isDisabled(),true);
  assert.deepEqual(errors,[],name);
  await context.close();
 }
} finally {await browser.close();}
console.log('E07-earned E11 fail-closed Chromium phone/keyboard PASS');
