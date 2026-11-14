import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch();
try {
 for(const viewport of [{width:844,height:390},{width:1024,height:768}]){
  const page=await browser.newPage({viewport}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/e11-scene/paper-turn-taking.html');
  assert.equal(await page.locator('#next').isDisabled(),true);
  await page.locator('#share').click();
  await page.locator('#try').click();
  await page.locator('#next').focus();
  await page.keyboard.press('Enter');
  assert.match(await page.locator('#world').innerText(),/Nia reads/);
  assert.match(await page.locator('#chronicle').innerText(),/Nia reads first/);
  await page.locator('#next').click();
  assert.match(await page.locator('#world').innerText(),/Finn builds/);
  assert.equal(await page.locator('#next').isDisabled(),true);
  await page.locator('#undo').click();
  assert.match(await page.locator('#world').innerText(),/Nia reads/);
  await page.locator('#restart').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#next').isDisabled(),true);
  assert.equal(await page.locator('#chronicle').innerText(),'');
  assert.deepEqual(errors,[]);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.close();
 }
} finally {await browser.close()}
