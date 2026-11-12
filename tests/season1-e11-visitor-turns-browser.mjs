import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import * as E10 from '../authoring-labs/unnamed-story-model.mjs';
const steps=[['start',{}],['compare-symbol',{}],['walk',{to:'stone_edge'}],['inspect',{traceId:'surface'}],['suggest',{traceId:'surface',useTag:'passing'}],['revise',{traceId:'surface',oldTag:'passing',newTag:'resting'}],['walk',{to:'quiet_corner'}],['hear',{needId:'quiet'}],['place',{needId:'quiet',slot:'shared'}],['walk',{to:'meeting_edge'}],['hear',{needId:'activity'}],['place',{needId:'activity',slot:'shared'}],['test-one-slot',{}],['place',{needId:'quiet',slot:'left'}],['place',{needId:'activity',slot:'right'}],['walk',{to:'notice_wall'}],['inspect',{traceId:'holes'}],['suggest',{traceId:'holes',useTag:'display'}],['check-source',{}],['review-tradeoff',{}],['review',{}],['finish-paper',{}]];
let e10=E10.fresh();for(const [type,extra] of steps){assert.equal(E10.can(e10,{type,...extra}),true,type);e10=E10.dispatch(e10,{type,...extra});}
const upload=(events)=>({name:'e10-history.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(events))});
const browser=await chromium.launch({headless:true});
try {
  for(const [label,viewport,touch] of [['landscape',{width:844,height:390},true],['keyboard',{width:1024,height:768},false]]){
    const context=await browser.newContext({viewport,hasTouch:touch,isMobile:touch});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    const response=await page.goto('http://127.0.0.1:4173/e11-scene/visitor-turns.html');
    assert.equal(response?.status(),200);
    assert.equal(await page.locator('#test').isDisabled(),true);
    assert.equal(await page.getByRole('button',{name:'Quiet reader → first'}).isDisabled(),true);
    await page.locator('#e10-file').setInputFiles(upload([{type:'finish-paper'}]));
    await page.getByText('Visitor turns are locked.',{exact:false}).waitFor();
    assert.equal(await page.getByRole('button',{name:'Quiet reader → first'}).isDisabled(),true);
    await page.locator('#e10-file').setInputFiles(upload(e10.history));
    await page.getByText('E10 PAPER history verified.',{exact:false}).waitFor();
    const first=page.getByRole('button',{name:'Quiet reader → first'});
    if(label==='keyboard'){await first.focus();await page.keyboard.press('Enter')}else await first.click();
    await page.getByRole('button',{name:'Active builder → second'}).click();
    await page.locator('#test').click();
    await page.getByText('PAPER Chronicle: Quiet reading first, active building second.',{exact:false}).waitFor();
    assert.match(await page.locator('#feedback').innerText(),/quiet reader goes first/);
    await page.locator('#undo').click();
    assert.match(await page.locator('#note').innerText(),/No PAPER note/);
    await page.getByRole('button',{name:'Quiet reader → second'}).click();
    assert.equal(await page.locator('#test').isDisabled(),true);
    await page.locator('#restart').click();
    assert.equal(await page.locator('#test').isDisabled(),true);
    assert.equal(await page.locator('#first').innerText(),'Empty');
    assert.equal(await page.getByRole('button',{name:'Quiet reader → first'}).isDisabled(),true);
    await page.locator('#e10-file').setInputFiles(upload(e10.history));
    await page.getByText('E10 PAPER history verified.',{exact:false}).waitFor();
    assert.equal(await page.getByRole('button',{name:'Quiet reader → first'}).isEnabled(),true);
    // Simulate an in-flight file read: Restart must invalidate its late completion.
    await page.evaluate(() => { const original=File.prototype.text; File.prototype.text=async function(){await new Promise(resolve=>setTimeout(resolve,150));return original.call(this)}; });
    await page.locator('#e10-file').setInputFiles(upload(e10.history));
    await page.locator('#restart').click();
    await page.waitForTimeout(220);
    assert.equal(await page.getByRole('button',{name:'Quiet reader → first'}).isDisabled(),true);
    assert.match(await page.locator('#source-status').innerText(),/locked/);
    assert.deepEqual(errors,[]);
    await context.close();
  }
} finally {await browser.close()}
console.log('E10-earned E11 PAPER visitor turns Chromium source/forgery/reset landscape/keyboard PASS');
