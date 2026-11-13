import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import * as E07 from '../e07-scene/scene-model.mjs';
const story=(type,value)=>({scene:'story',action:value===undefined?{type}:{type,value}});
const walk=(type,value)=>({scene:'walkthrough',type,...(value===undefined?{}:{value})});
function earnedHistory(){
 let state=E07.fresh();
 const actions=[story('start'),story('walk','shared-path'),story('inspect','shared-path'),story('walk','channel'),story('inspect','channel'),story('walk','workbench'),story('trial','milo'),story('trial','resident'),story('trial','water'),story('place','path-clear-water-blocked'),story('trial','milo'),story('trial','resident'),story('trial','water'),story('place','side-offset'),story('trial','water'),story('trial','milo'),story('trial','resident'),story('compare'),story('finish'),walk('start'),walk('move','crossing'),walk('inspect','crossing'),walk('other-start'),walk('other-step'),walk('other-step'),walk('move','water-edge'),walk('inspect','water-edge'),walk('move','steps-base'),walk('review')];
 for(const action of actions){assert.equal(E07.can(state,action),true,JSON.stringify(action));state=E07.dispatch(state,action);}
 assert.equal(E07.view(state).walkthrough.reviewed,true);
 return state.history;
}
const validHistory=earnedHistory();
const browser=await chromium.launch({headless:true});
try {
 for(const [name,viewport,touch] of [['phone-landscape',{width:844,height:390},true],['keyboard',{width:1024,height:768},false]]) {
  const context=await browser.newContext({viewport,hasTouch:touch,isMobile:touch});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  assert.equal((await page.goto('http://127.0.0.1:4173/e11-scene/e07-earned-shared-path.html'))?.status(),200);
  assert.equal(await page.locator('#test').isDisabled(),true);
  await page.locator('#source').setInputFiles({name:'forged.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify([{scene:'walkthrough',type:'review'}]))});
  assert.match(await page.locator('#source-status').innerText(),/required/);
  assert.equal(await page.locator('#shared').isDisabled(),true);
  await page.locator('#source').setInputFiles({name:'earned.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(validHistory))});
  await assert.doesNotReject(async()=>{await page.locator('#source-status').getByText('E07 PAPER review verified.',{exact:false}).waitFor();});
  assert.equal(await page.locator('#shared').isEnabled(),true);
  await page.locator('#narrow').click();await page.locator('#test').click();
  assert.match(await page.locator('#traveler').innerText(),/waits/);
  assert.match(await page.locator('#feedback').innerText(),/Finn/);
  await page.locator('#shared').click();assert.match(await page.locator('#traveler').innerText(),/Not tested/);
  await page.locator('#test').click();assert.match(await page.locator('#traveler').innerText(),/can pass/);
  assert.match(await page.locator('#chronicle').innerText(),/PAPER Chronicle/);
  await page.locator('#undo').click();assert.match(await page.locator('#traveler').innerText(),/Not tested/);
  assert.match(await page.locator('#chronicle').innerText(),/No PAPER Chronicle/);
  await page.locator('#test').focus();await page.keyboard.press('Enter');
  assert.match(await page.locator('#traveler').innerText(),/can pass/);
  await page.locator('#restart').focus();await page.keyboard.press('Enter');
  assert.match(await page.locator('#source-status').innerText(),/required/);
  assert.equal(await page.locator('#undo').isDisabled(),true);
  assert.deepEqual(errors,[],name);
  await context.close();
 }
} finally {await browser.close();}
console.log('E07-earned E11 fail-closed Chromium phone/keyboard PASS');
