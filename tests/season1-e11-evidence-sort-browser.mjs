// Independent E05→E11 PAPER evidence sorting: real Chromium, landscape and keyboard.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
try {
 for(const [label,viewport,touch] of [['mobile-landscape',{width:844,height:390},true],['keyboard',{width:1024,height:768},false]]) {
  const context=await browser.newContext({viewport,hasTouch:touch,isMobile:touch});
  const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto('http://127.0.0.1:4173/e11-scene/evidence-sort.html');
  assert.equal(response?.status(),200);
  assert.match(await page.locator('body').innerText(),/Invented cards only/);
  const pick=page.getByRole('button',{name:/Paper arrow/});
  if(label==='keyboard'){await pick.focus();await page.keyboard.press('Enter');}
  else await pick.click();
  await page.getByRole('button',{name:'Rest idea'}).click();
  await page.getByRole('button',{name:'Test my idea'}).click();
  assert.match(await page.locator('#feedback').innerText(),/change your model/);
  assert.match(await page.locator('#result').innerText(),/No PAPER note yet/);
  await page.getByRole('button',{name:'Path idea'}).click();
  await page.getByRole('button',{name:'Test my idea'}).click();
  assert.match(await page.locator('#result').innerText(),/PAPER NOTE/);
  await page.getByRole('button',{name:'Undo'}).click();
  assert.match(await page.locator('#result').innerText(),/No PAPER note yet/);
  await page.getByRole('button',{name:'Restart'}).click();
  assert.equal(await page.getByRole('button',{name:'Test my idea'}).isDisabled(),true);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'horizontal overflow');
  assert.deepEqual(errors,[]);
  assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),[]);
  await context.close();
  console.log(label+' evidence-sort browser PASS');
 }
} finally {await browser.close();}
