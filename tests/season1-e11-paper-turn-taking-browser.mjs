import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const browser = await chromium.launch();
try {
  for (const viewport of [{width:844,height:390},{width:1024,height:768}]) {
    const page = await browser.newPage({viewport});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/e11-scene/paper-turn-taking.html');
    await page.locator('#try').click();
    assert.match(await page.locator('#nia').innerText(), /need time to read/);
    assert.match(await page.locator('#finn').innerText(), /model is moving/);
    assert.equal(await page.locator('#world').getAttribute('class'), 'build');
    await page.locator('#share').click();
    assert.equal(await page.locator('#chronicle').innerText(), '');
    await page.locator('#try').click();
    assert.match(await page.locator('#nia').innerText(), /during my turn/);
    assert.match(await page.locator('#finn').innerText(), /timer changes/);
    assert.match(await page.locator('#world').innerText(), /alternates/);
    assert.match(await page.locator('#chronicle').innerText(), /Both friends get a turn/);
    assert.equal(await page.locator('#world').getAttribute('class'), 'share');
    await page.locator('#undo').click();
    assert.equal(await page.locator('#chronicle').innerText(), '');
    await page.locator('#restart').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#chronicle').innerText(), '');
    assert.equal(await page.locator('#build').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#world').getAttribute('class'), '');
    assert.deepEqual(errors, []);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.close();
  }
} finally {
  await browser.close();
}
