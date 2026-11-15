import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import * as E07 from '../e07-scene/scene-model.mjs';
import {encodeE07Handoff} from '../e11-scene/e07-direct-handoff.mjs';
const a=(type,value)=>({scene:'story',action:value===undefined?{type}:{type,value}});
const w=(type,value)=>({scene:'walkthrough',type,...(value===undefined?{}:{value})});
const route=[a('start'),a('walk','shared-path'),a('inspect','shared-path'),a('walk','channel'),a('inspect','channel'),a('walk','workbench'),a('trial','milo'),a('trial','resident'),a('trial','water'),a('place','path-clear-water-blocked'),a('trial','milo'),a('trial','resident'),a('trial','water'),a('place','side-offset'),a('trial','water'),a('trial','milo'),a('trial','resident'),a('compare'),a('finish'),w('start'),w('move','crossing'),w('inspect','crossing'),w('other-start'),w('other-step'),w('other-step'),w('move','water-edge'),w('inspect','water-edge'),w('move','steps-base'),w('review')];
let state=E07.fresh();for(const e of route){assert.equal(E07.can(state,e),true,JSON.stringify(e));state=E07.dispatch(state,e);}
const fragment=encodeE07Handoff(state.history);assert.ok(fragment);
const browser=await chromium.launch({headless:true});
try {
for(const [name,viewport,touch] of [['landscape',{width:844,height:390},true],['keyboard',{width:1024,height:768},false]]){
 const context=await browser.newContext({viewport,hasTouch:touch,isMobile:touch}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const base='http://127.0.0.1:4173/';
 await page.goto(base+'e11-scene/#e07-paper=invalid');
 assert.match(await page.locator('#e07-earned-context').innerText(),/No E07 child-checked/);
 await page.goto(base+'e11-scene/e07-earned-turn-taking.html#e07-paper=invalid');
 assert.equal(await page.locator('#share').isDisabled(),true);
 await page.goto(base+'e07-scene/');
 await page.goto(base+'e11-scene/'+fragment);
 assert.match(await page.locator('#e07-earned-context').innerText(),/Milo checked Finn/);
 assert.equal(new URL(page.url()).hash,'');
 assert.match(await page.locator('#story-line').innerText(),/Milo must try/);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,name);
 await page.goto(base+'e11-scene/e07-earned-turn-taking.html'+fragment);
 assert.match(await page.locator('#source-status').innerText(),/verified/);
 assert.equal(await page.locator('#share').isEnabled(),true);
 assert.equal(new URL(page.url()).hash,'');
 await page.locator('#build').click();await page.locator('#try').click();
 assert.match(await page.locator('#nia').innerText(),/read/i);
 await page.locator('#share').click();await page.locator('#try').click();
 assert.match(await page.locator('#chronicle').innerText(),/Both friends/);
 await page.locator('#next').focus();await page.keyboard.press('Enter');
 assert.match(await page.locator('#world').innerText(),/Nia reads/);
 await page.locator('#undo').click();
 assert.match(await page.locator('#world').innerText(),/paper timer alternates reading and building turns/i);
 await page.locator('#restart').focus();await page.keyboard.press('Enter');
 assert.equal(await page.locator('#share').isDisabled(),true);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,name);
 assert.deepEqual(errors,[],name);
 await context.close();
}
}finally{await browser.close();}
console.log('E07-E11 direct handoff landscape and keyboard Chromium PASS');
