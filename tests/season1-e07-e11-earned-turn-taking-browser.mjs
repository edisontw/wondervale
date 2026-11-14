import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import * as E07 from '../e07-scene/scene-model.mjs';
const a=(type,value)=>({scene:'story',action:value===undefined?{type}:{type,value}});
const w=(type,value)=>({scene:'walkthrough',type,...(value===undefined?{}:{value})});
const route=[a('start'),a('walk','shared-path'),a('inspect','shared-path'),a('walk','channel'),a('inspect','channel'),a('walk','workbench'),a('trial','milo'),a('trial','resident'),a('trial','water'),a('place','path-clear-water-blocked'),a('trial','milo'),a('trial','resident'),a('trial','water'),a('place','side-offset'),a('trial','water'),a('trial','milo'),a('trial','resident'),a('compare'),a('finish'),w('start'),w('move','crossing'),w('inspect','crossing'),w('other-start'),w('other-step'),w('other-step'),w('move','water-edge'),w('inspect','water-edge'),w('move','steps-base'),w('review')];
let s=E07.fresh();for(const e of route){assert.equal(E07.can(s,e),true,JSON.stringify(e));s=E07.dispatch(s,e);}
const earned=s.history;
const browser=await chromium.launch({headless:true});
try{for(const [name,viewport,touch] of [['phone-landscape',{width:844,height:390},true],['keyboard',{width:1024,height:768},false]]){
const context=await browser.newContext({viewport,hasTouch:touch,isMobile:touch}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
assert.equal((await page.goto('http://127.0.0.1:4173/e11-scene/e07-earned-turn-taking.html'))?.status(),200);
assert.equal(await page.locator('#share').isDisabled(),true);
const upload=async(data)=>page.locator('#source').setInputFiles({name:'history.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
await upload([{scene:'walkthrough',type:'review'}]);
assert.match(await page.locator('#source-status').innerText(),/required/);
await upload(earned.slice(0,-1));assert.equal(await page.locator('#try').isDisabled(),true);
await upload(earned);assert.match(await page.locator('#source-status').innerText(),/verified/);
await page.locator('#build').click();await page.locator('#try').click();
assert.match(await page.locator('#nia').innerText(),/read/);
await page.locator('#share').click();await page.locator('#try').click();
assert.match(await page.locator('#chronicle').innerText(),/Both friends/);
await page.locator('#next').click();assert.match(await page.locator('#world').innerText(),/Nia reads/);
await page.locator('#next').focus();await page.keyboard.press('Enter');assert.match(await page.locator('#world').innerText(),/Finn builds/);
await page.locator('#undo').click();assert.match(await page.locator('#world').innerText(),/Nia reads/);
await page.locator('#restart').focus();await page.keyboard.press('Enter');
assert.equal(await page.locator('#share').isDisabled(),true);
assert.match(await page.locator('#source-status').innerText(),/required/);
assert.deepEqual(errors,[],name);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,name);
await context.close();
}}finally{await browser.close();}
console.log('E07 to E11 PAPER earned turn-taking phone/keyboard Chromium PASS');
