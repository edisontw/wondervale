// Standalone targeted browser acceptance: node tests/s01e06-revisit-browser.mjs
// Requires installed Playwright Chromium. Starts its own preview server.
import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
const port=4189;
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
let browser;
const base='http://127.0.0.1:'+port+'/e06-prototype/';
async function ready(){
 for(let i=0;i<50;i++){
  if(server.exitCode!==null) throw Error('Preview server exited');
  try {const r=await fetch(base);if(r.ok)return;}catch{}
  await new Promise(r=>setTimeout(r,150));
 }
 throw Error('Preview server not ready');
}
async function click(page,selector,text){
 const target=page.locator(selector).getByRole('button',{name:text,exact:true});
 await target.click();
}
test('E06 FIRST/NOW is earned, visible, reversible, and restart-safe',async()=>{
 try{
  await ready();
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:800,height:600}});
  await page.goto(base);
  const first=page.getByRole('button',{name:'FIRST — before trial'});
  const now=page.getByRole('button',{name:'NOW — model revisit'});
  assert.equal(await first.isDisabled(),true);
  assert.equal(await now.isDisabled(),true);
  await click(page,'#observe-controls','Look: Healthy beds');
  await click(page,'#scene','Walk Milo to Higher slope');
  await click(page,'#observe-controls','Look: Higher slope');
  await click(page,'#scene','Walk Milo to Rain model tray');
  await click(page,'#model-controls','Run this model');
  await click(page,'#model-controls','Rain');
  await click(page,'#model-controls','Run this model');
  await click(page,'#model-controls','Channel blocked');
  await click(page,'#model-controls','Run this model');
  await click(page,'#model-controls','Compare model results');
  await click(page,'#model-controls','Walk to Lower Garden');
  await click(page,'#observe-controls','Look: Water trace');
  await click(page,'#scene','Walk Milo to Shared path');
  await click(page,'#observe-controls','Look: Shared path');
  await click(page,'#scene','Walk Milo to Raised pocket');
  await click(page,'#plant-controls','Try marker: Raised pocket');
  await click(page,'#plant-controls','Inspect marker result');
  assert.equal(await now.isDisabled(),true);
  await click(page,'#plant-controls','Confirm small trial (preview)');
  assert.equal(await now.isEnabled(),true);
  assert.match(await page.locator('.pocket').innerText(),/FIRST: empty/);
  await now.click();
  assert.match(await page.locator('.pocket').innerText(),/Synthetic sprout/);
  assert.match(await page.locator('#revisit-result').innerText(),/one synthetic sprout/);
  await first.click();
  assert.match(await page.locator('.pocket').innerText(),/FIRST: empty/);
  assert.doesNotMatch(await page.locator('#chronicle').innerText(),/Canonical events: [1-9]/);
  await page.locator('#restart').click();
  assert.equal(await now.isDisabled(),true);
  assert.equal(await page.locator('#scene').getAttribute('data-revisit'),'first');
  assert.match(await page.locator('#revisit-result').innerText(),/Finish a valid PAPER/);
  assert.match(await page.locator('#chronicle').innerText(),/Canonical events: 0; unlocks: 0/);
  await page.close();
 }finally{
  await browser?.close();
  server.kill();
 }
});
