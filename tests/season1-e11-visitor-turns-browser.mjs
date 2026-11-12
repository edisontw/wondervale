import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});
try {
  for(const [label,viewport,touch] of [['landscape',{width:844,height:390},true],['keyboard',{width:1024,height:768},false]]){
    const context=await browser.newContext({viewport,hasTouch:touch,isMobile:touch});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    const response=await page.goto('http://127.0.0.1:4173/e11-scene/visitor-turns.html');
    assert.equal(response?.status(),200);
    assert.equal(await page.locator('#test').isDisabled(),true);
    const first=page.getByRole('button',{name:'Quiet reader → first'});
    if(label==='keyboard'){await first.focus();await page.keyboard.press('Enter')}else await first.click();
    await page.getByRole('button',{name:'Active builder → second'}).click();
    await page.locator('#test').click();
    await page.getByText('PAPER Chronicle: Two imagined visitors take turns.',{exact:false}).waitFor();
    await page.locator('#undo').click();
    assert.match(await page.locator('#note').innerText(),/No PAPER note/);
    await page.getByRole('button',{name:'Quiet reader → second'}).click();
    assert.equal(await page.locator('#test').isDisabled(),true);
    await page.locator('#restart').click();
    assert.equal(await page.locator('#test').isDisabled(),true);
    assert.equal(await page.locator('#first').innerText(),'Empty');
    assert.deepEqual(errors,[]);
    await context.close();
  }
} finally {await browser.close()}
console.log('E11 PAPER visitor turns Chromium landscape/keyboard PASS');
