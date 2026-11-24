import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {earnedHistory} from './season1-e11-e05-earned-layout.test.mjs';
const valid=earnedHistory(),browser=await chromium.launch({headless:true});
try{
 for(const [name,viewport,touch] of [['phone-landscape',{width:844,height:390},true],['keyboard',{width:1024,height:768},false]]){
  const context=await browser.newContext({viewport,hasTouch:touch,isMobile:touch});
  try{
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   assert.equal((await page.goto('http://127.0.0.1:4173/e11-scene/e05-earned-layout-trial.html'))?.status(),200);
   assert.equal(await page.locator('#test').isDisabled(),true);
   const upload=async(data)=>page.locator('#source').setInputFiles({name:'history.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
   await upload([{scene:'nav',type:'to-review'}]);assert.match(await page.locator('#source-status').innerText(),/required/);
   await upload(valid);await page.getByText('E05 PAPER review verified.',{exact:false}).waitFor();
   await page.locator('#center').click();await page.locator('#test').click();
   assert.match(await page.locator('#world').innerText(),/blocked/);assert.match(await page.locator('#feedback').innerText(),/Finn/);
   assert.ok(await page.locator('#board .blocked').count()>0);
   await page.locator('#side').click();assert.match(await page.locator('#world').innerText(),/not tested/);
   await page.locator('#test').focus();await page.keyboard.press('Enter');
   assert.match(await page.locator('#world').innerText(),/clear/);
   assert.match(await page.locator('#chronicle').innerText(),/PAPER Chronicle/);
   assert.equal(await page.locator('#board .blocked').count(),0);
   await page.locator('#undo').click();assert.match(await page.locator('#chronicle').innerText(),/No PAPER Chronicle/);
   await page.locator('#test').click();assert.match(await page.locator('#chronicle').innerText(),/PAPER Chronicle/);
   await page.locator('#restart').focus();await page.keyboard.press('Enter');
   assert.match(await page.locator('#source-status').innerText(),/required/);
   assert.equal(await page.locator('#side').isDisabled(),true);
   const size=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(size.scroll<=size.w+1,JSON.stringify({name,size}));
   assert.deepEqual(errors,[],name);
  }finally{await context.close();}
 }
}finally{await browser.close();}
console.log('E05-earned E11 PAPER layout Chromium phone landscape/keyboard PASS');
