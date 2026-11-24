import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const browser = await chromium.launch();
try {
  for (const viewport of [{width:844,height:390},{width:1024,height:768}]) {
    const page = await browser.newPage({viewport});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/e11-scene/paper-listening-lantern.html');
    await page.locator('#try').click();
    assert.match(await page.locator('#nia').innerText(), /too loud/);
    assert.match(await page.locator('#finn').innerText(), /see the signal/);
    assert.match(await page.locator('#chronicle').innerText(), /PAPER Chronicle/);
    assert.equal(await page.locator('#world').getAttribute('class'), 'signal');
    await page.locator('#quiet').click();
    assert.equal(await page.locator('#chronicle').innerText(), '');
    await page.locator('#try').click();
    assert.match(await page.locator('#nia').innerText(), /hear the story/);
    assert.match(await page.locator('#finn').innerText(), /cannot see/);
    assert.equal(await page.locator('#world').getAttribute('class'), 'quiet');
    await page.locator('#undo').click();
    assert.equal(await page.locator('#chronicle').innerText(), '');
    await page.locator('#restart').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#chronicle').innerText(), '');
    assert.equal(await page.locator('#world').getAttribute('class'), '');
    assert.equal(await page.locator('#signal').getAttribute('aria-pressed'), 'true');
    assert.deepEqual(errors, []);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.close();
  }
} finally {
  await browser.close();
}
