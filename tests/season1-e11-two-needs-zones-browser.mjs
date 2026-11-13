import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const browser = await chromium.launch({headless:true});
try {
  for (const [label,viewport,touch] of [
    ['phone-landscape',{width:844,height:390},true],
    ['keyboard',{width:1024,height:768},false],
  ]) {
    const context=await browser.newContext({viewport,hasTouch:touch,isMobile:touch});
    try {
      const page=await context.newPage(),errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      assert.equal((await page.goto('http://127.0.0.1:4173/e11-scene/two-needs-zones.html'))?.status(),200);
      assert.equal(await page.locator('#try').isDisabled(),true);
      assert.match(await page.locator('#chronicle').innerText(),/^$/);
      await page.locator('[data-need="quiet"][data-zone="near"]').click();
      await page.locator('[data-need="making"][data-zone="far"]').click();
      assert.equal(await page.locator('#try').isEnabled(),true);
      if(label==='keyboard') {
        await page.locator('#try').focus();
        await page.keyboard.press('Enter');
      } else await page.locator('#try').click();
      assert.match(await page.locator('#response').innerText(),/Nia:.*sounds.*Finn:.*swap/);
      assert.equal(await page.locator('#chronicle').innerText(),'');
      await page.locator('[data-need="quiet"][data-zone="far"]').click();
      await page.locator('[data-need="making"][data-zone="near"]').click();
      assert.match(await page.locator('#near').innerText(),/Making/);
      assert.match(await page.locator('#far').innerText(),/Reading/);
      await page.locator('#try').click();
      assert.match(await page.locator('#response').innerText(),/Nia:.*Finn:/);
      assert.match(await page.locator('#chronicle').innerText(),/PAPER Chronicle/);
      await page.locator('#undo').click();
      assert.equal(await page.locator('#chronicle').innerText(),'');
      await page.locator('#try').click();
      assert.match(await page.locator('#chronicle').innerText(),/PAPER Chronicle/);
      await page.locator('#restart').focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('#try').isDisabled(),true);
      assert.equal(await page.locator('#undo').isDisabled(),true);
      assert.match(await page.locator('#near').innerText(),/Empty/);
      assert.match(await page.locator('#far').innerText(),/Empty/);
      assert.equal(await page.locator('#chronicle').innerText(),'');
      const size=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
      assert.ok(size.scroll<=size.width+1,JSON.stringify({label,size}));
      assert.deepEqual(errors,[],label);
    } finally {await context.close();}
  }
} finally {await browser.close();}
console.log('E11 PAPER two-needs real Chromium phone landscape/keyboard/revision/undo/restart PASS');
