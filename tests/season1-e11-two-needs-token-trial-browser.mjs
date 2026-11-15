import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch();
try{
 for(const viewport of [{width:844,height:390},{width:1024,height:768}]){
  const page=await browser.newPage({viewport}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/e11-scene/two-needs-token-trial.html');
  await page.getByRole('button',{name:'Quiet corner'}).focus();
  await page.keyboard.press('Enter');
  await page.locator('#reader').click();
  await page.locator('#maker').click();
  assert.match(await page.locator('#reaction').innerText(),/One need is still missing/);
  await page.getByRole('button',{name:'Shared turns'}).click();
  assert.equal(await page.locator('#reader').isDisabled(),false);
  await page.locator('#reader').click();await page.locator('#maker').click();
  assert.match(await page.locator('#reaction').innerText(),/both needs have a turn/);
  assert.match(await page.locator('#chronicle').innerText(),/reader \+ maker/);
  await page.locator('#undo').click();
  assert.equal(await page.locator('#maker').isDisabled(),false);
  await page.locator('#reset').focus();await page.keyboard.press('Enter');
  assert.match(await page.locator('#chronicle').innerText(),/not placed/);
  assert.deepEqual(errors,[]);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.close();
 }
}finally{await browser.close()}
