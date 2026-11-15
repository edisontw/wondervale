import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch();
try{
 for(const viewport of [{width:844,height:390},{width:1024,height:768}]){
  const page=await browser.newPage({viewport}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/e11-scene/paper-visitor-use-trial.html');
  await page.getByRole('button',{name:'Quiet only'}).focus();await page.keyboard.press('Enter');
  await page.locator('#reader').click();await page.locator('#maker').click();
  assert.match(await page.locator('#reaction').innerText(),/need different turns/);
  await page.getByRole('button',{name:'Take turns'}).click();
  assert.match(await page.locator('#reader-spot').innerText(),/waiting/);
  await page.locator('#reader').click();await page.locator('#maker').click();
  assert.match(await page.locator('#chronicle').innerText(),/Both have a turn/);
  await page.locator('#undo').click();assert.equal(await page.locator('#maker').isDisabled(),false);
  await page.locator('#reset').focus();await page.keyboard.press('Enter');
  assert.match(await page.locator('#chronicle').innerText(),/no plan/);
  assert.deepEqual(errors,[]);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.close();
 }
}finally{await browser.close()}
