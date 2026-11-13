import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const browser = await chromium.launch({headless:true});
try {
  for (const [label, viewport, touch] of [
    ['phone-landscape', {width:844,height:390}, true],
    ['keyboard', {width:1024,height:768}, false],
  ]) {
    const context = await browser.newContext({viewport,hasTouch:touch,isMobile:touch});
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto('http://127.0.0.1:4173/e11-scene/shared-path-trial.html');
    assert.equal(response?.status(), 200);
    assert.match(await page.locator('#traveler').innerText(), /Not tested/);
    assert.match(await page.locator('#chronicle').innerText(), /No PAPER Chronicle/);
    if (label === 'keyboard') {
      await page.locator('#test').focus();
      await page.keyboard.press('Enter');
    } else {
      await page.locator('#test').click();
    }
    assert.match(await page.locator('#traveler').innerText(), /waits/);
    assert.match(await page.locator('#feedback').innerText(), /narrow model blocks/);
    assert.equal(await page.locator('#test').isDisabled(), true);
    await page.locator('#shared').click();
    assert.match(await page.locator('#traveler').innerText(), /Not tested/);
    assert.equal(await page.locator('#test').isEnabled(), true);
    assert.equal(await page.locator('#path').evaluate(el=>el.classList.contains('shared')), true);
    await page.locator('#test').click();
    assert.match(await page.locator('#traveler').innerText(), /Two PAPER travelers can pass/);
    assert.match(await page.locator('#feedback').innerText(), /made room/);
    assert.match(await page.locator('#chronicle').innerText(), /PAPER Chronicle/);
    await page.locator('#undo').click();
    assert.match(await page.locator('#traveler').innerText(), /Not tested/);
    assert.match(await page.locator('#chronicle').innerText(), /No PAPER Chronicle/);
    await page.locator('#restart').click();
    assert.match(await page.locator('#path').innerText(), /Narrow model/);
    assert.equal(await page.locator('#undo').isDisabled(), true);
    assert.match(await page.locator('#chronicle').innerText(), /No PAPER Chronicle/);
    assert.deepEqual(errors, [], label);
    await context.close();
  }
} finally {
  await browser.close();
}
console.log('E11 PAPER shared-path real Chromium phone-landscape/keyboard/undo/restart PASS');
