import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {earnedHistory} from './season1-e11-e05-earned-layout.test.mjs';

const browser = await chromium.launch();
try {
  for (const viewport of [{width:844,height:390},{width:1024,height:768}]) {
    const page = await browser.newPage({viewport});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/e11-scene/paper-evidence-revision.html');
    assert.equal(await page.locator('#try').isDisabled(), true);
    assert.equal(await page.locator('#inspect').isDisabled(), true);
    await page.locator('#source').setInputFiles({name:'forged.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify([{scene:'nav',type:'to-review',admin:true}]))});
    assert.match(await page.locator('#source-status').innerText(), /required/);
    await page.locator('#source').setInputFiles({name:'incomplete.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(earnedHistory().slice(0,-1)))});
    assert.equal(await page.locator('#inspect').isDisabled(), true);
    await page.locator('#source').setInputFiles({name:'e05.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(earnedHistory()))});
    assert.match(await page.locator('#source-status').innerText(), /verified/);
    assert.equal(await page.locator('#inspect').isEnabled(), true);
    assert.match(await page.locator('#clues').innerText(), /covered/);
    await page.locator('#inspect').click();
    assert.match(await page.locator('#clues').innerText(), /Pretend old map/);
    await page.locator('#old-map').click();
    await page.locator('#try').click();
    assert.match(await page.locator('#model').innerText(), /one old line/);
    assert.match(await page.locator('#nia').innerText(), /other clue/);
    await page.locator('#both').click();
    await page.locator('#try').click();
    assert.equal(await page.locator('#model').getAttribute('class'), 'two-trace-model');
    assert.match(await page.locator('#finn').innerText(), /test this new model/);
    assert.match(await page.locator('#chronicle').innerText(), /both fictional clues/);
    await page.locator('#undo').click();
    assert.match(await page.locator('#model').innerText(), /one old line/);
    await page.locator('#restart').focus();
    await page.keyboard.press('Enter');
    assert.match(await page.locator('#model').innerText(), /blank/);
    assert.match(await page.locator('#clues').innerText(), /covered/);
    assert.equal(await page.locator('#try').isDisabled(), true);
    assert.equal(await page.locator('#inspect').isDisabled(), true);
    assert.match(await page.locator('#source-status').innerText(), /required/);
    assert.deepEqual(errors, []);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.close();
  }
} finally {
  await browser.close();
}
