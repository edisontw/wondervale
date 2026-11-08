// E10 child-earned question/trace -> E11 reversible PAPER future marker.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import * as E10 from '../authoring-labs/unnamed-story-model.mjs';
import {decodeLoopTransfer} from '../authoring-labs/e10-e11-scene-transfer.mjs';
import {paperHillTraceRevisit} from '../e11-scene/hill-trace-revisit.mjs';
import {sevenSceneUpstream} from './fixtures/season1-e04-e09-paper.mjs';
import {encodeMemoryCourtyard} from '../authoring-labs/e04-e10-scene-transfer.mjs';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const u=sevenSceneUpstream();
const fragment=encodeMemoryCourtyard(u.e04,u.e05,u.e06,u.e07,u.e08,u.e09,E10.fresh());
assert.ok(fragment);
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:1366,height:900},{width:568,height:320},{width:390,height:844}]){
  const context=await browser.newContext({viewport,reducedMotion:'reduce'});
  try{
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/e10-scene/'+fragment);
   const hit=async(type,value)=>page.locator('[data-action="'+type+'"]'+(value?'[data-value="'+value+'"]':'')).click();
   const returnE10=async()=>{
    await page.locator('#e10-return').click();
    await page.waitForFunction(()=>document.querySelector('#hill-question-panel')?.dataset.compared==='true');
   };
   await hit('start');await hit('compare-symbol');await hit('walk','stone_edge');
   await hit('inspect','surface');await hit('suggest','surface:passing');
   await hit('revise','surface:passing:resting');await hit('walk','quiet_corner');
   await hit('hear','quiet');await hit('place','quiet:shared');await hit('walk','meeting_edge');
   await hit('hear','activity');await hit('place','activity:shared');await hit('test-one-slot');
   await hit('place','quiet:left');await hit('place','activity:right');
   await hit('walk','notice_wall');await hit('inspect','holes');await hit('suggest','holes:display');
   await hit('check-source');await hit('review-tradeoff');await hit('review');await hit('finish-paper');
   await page.locator('#question-identity').click();
   await page.locator('#question-wall').click();
   await page.locator('#question-compare').click();
   assert.equal(await page.locator('#hill-question-panel').getAttribute('data-compared'),'true');
   const e11Href=await page.locator('#e11-paper').getAttribute('href');
   const packet=decodeLoopTransfer(new URL(e11Href,base+'/e10-scene/').hash);
   assert.ok(packet,'E10 must encode a replay-valid E11 handoff');
   assert.ok(packet.questionTrial,'E10 child-checked question must be carried to E11');
   const atlas=paperHillTraceRevisit(packet.e10,packet.upstream,packet.questionTrial);
   assert.ok(atlas,'E11 must derive a valid child-earned trace atlas before navigation');
   await page.locator('#e11-paper').click();
   // Navigation can expose the static Begin button before E11 installs its
   // module click listener. Wait for the replayed handoff to hydrate first.
   await page.waitForFunction(()=>document.querySelector('#e10-linked-context')?.textContent?.includes('observed 2 fictional traces'));
   await page.getByRole('button',{name:'Begin the PAPER trial'}).click();
   await page.waitForFunction(()=>document.querySelector('#e11-work')?.hidden===false);
   await page.locator('#hill-trace-world').waitFor({state:'visible'});
   await page.waitForFunction(trace=>document.querySelector('#hill-trace-first')?.textContent?.includes(trace),'mounting holes');
   await page.locator('#hill-trace-world').waitFor({state:'visible'});
   assert.match(await page.locator('#hill-trace-first').innerText(),/mounting holes.*STILL UNKNOWN/);
   assert.equal(await page.locator('#hill-trace-now').getAttribute('data-marker'),'false');
   await page.getByRole('button',{name:/Move \? to ask the responsible person/}).click();
   assert.match(await page.locator('#hill-trace-now').innerText(),/does not check this question/);
   await page.getByRole('button',{name:/Move \? to request an attributed source/}).click();
   assert.match(await page.locator('#hill-trace-diary').innerText(),/NOT DONE/);
   assert.match(await page.locator('#hill-trace-diary').innerText(),/no real access/);
   await returnE10();
   assert.equal(await page.locator('#hill-question-panel').getAttribute('data-compared'),'true');
   await page.locator('#e11-paper').click();
   await page.waitForFunction(()=>document.querySelector('#hill-trace-now')?.dataset.marker==='true');
   assert.equal(await page.locator('#hill-trace-now').getAttribute('data-marker'),'true','strictly replayed marker survives E10 round-trip');
   assert.match(await page.locator('#hill-trace-diary').innerText(),/NOT DONE/);
   await page.getByRole('button',{name:'Remove future ? marker'}).click();
   await returnE10();
   await page.locator('#e11-paper').click();
   assert.equal(await page.locator('#hill-trace-now').getAttribute('data-marker'),'false','removal survives E10 round-trip');
   await page.getByRole('button',{name:/Move \? to request an attributed source/}).click();
   // A new E10 question invalidates the previous E11 marker across a return trip.
   // Rechecking either question earns a fresh, empty PAPER future-check map.
   await returnE10();
   await page.locator('#question-access').click();
   assert.equal(await page.locator('#hill-question-panel').getAttribute('data-compared'),'false',
    'switching the E10 question withdraws the old checked trace');
   await page.locator('#question-stone').click();
   await page.locator('#question-compare').click();
   assert.equal(await page.locator('#hill-question-panel').getAttribute('data-compared'),'true');
   await page.locator('#e11-paper').click();
   // Wait for E11 hydration: the static Begin button can be visible before
   // the module installs its click listener on a fresh return navigation.
   await page.waitForFunction(()=>document.querySelector('#e10-linked-context')?.textContent?.includes('observed 2 fictional traces'));
   if(await page.getByRole('button',{name:'Begin the PAPER trial'}).isVisible())
    await page.getByRole('button',{name:'Begin the PAPER trial'}).click();
   await page.waitForFunction(()=>document.querySelector('#e11-work')?.hidden===false);
   await page.waitForFunction(trace=>document.querySelector('#hill-trace-first')?.textContent?.includes(trace),'worn surface');
   // A valid atlas can update text while its ancestor remains hidden; report the
   // actual E11 screen/begin state rather than treating this as a transfer failure.
   const accessPanel=await page.evaluate(()=>({
    beginHidden:document.querySelector('#begin')?.hidden,
    workHidden:document.querySelector('#e11-work')?.hidden,
    traceHidden:document.querySelector('#hill-trace-world')?.hidden,
    traceText:document.querySelector('#hill-trace-first')?.textContent,
    callbackHidden:document.querySelector('#e10-notes')?.hidden,
    url:location.href.slice(0,location.href.indexOf('#')+1)
   }));
   assert.equal(accessPanel.workHidden,false,'E11 access revisit work panel hidden: '+JSON.stringify(accessPanel));
   assert.equal(accessPanel.traceHidden,false,'E11 access revisit trace panel hidden: '+JSON.stringify(accessPanel));
   await page.locator('#hill-trace-world').waitFor({state:'visible'});
   assert.match(await page.locator('#hill-trace-first').innerText(),/worn surface.*STILL UNKNOWN/);
   assert.equal(await page.locator('#hill-trace-now').getAttribute('data-marker'),'false',
    'identity source marker cannot reappear for access question');
   await page.getByRole('button',{name:/Move \? to ask the responsible person/}).click();
   assert.equal(await page.locator('#hill-trace-now').getAttribute('data-marker'),'true');
   await returnE10();
   await page.locator('#question-identity').click();
   assert.equal(await page.locator('#hill-question-panel').getAttribute('data-compared'),'false',
    'switching back to identity withdraws the checked access trace');
   await page.locator('#question-wall').click();
   await page.locator('#question-compare').click();
   await page.locator('#e11-paper').click();
   // Wait for E11 hydration: the static Begin button can be visible before
   // the module installs its click listener on a fresh return navigation.
   await page.waitForFunction(()=>document.querySelector('#e10-linked-context')?.textContent?.includes('observed 2 fictional traces'));
   if(await page.getByRole('button',{name:'Begin the PAPER trial'}).isVisible())
    await page.getByRole('button',{name:'Begin the PAPER trial'}).click();
   await page.waitForFunction(()=>document.querySelector('#e11-work')?.hidden===false);
   await page.waitForFunction(trace=>document.querySelector('#hill-trace-first')?.textContent?.includes(trace),'mounting holes');
   await page.locator('#hill-trace-world').waitFor({state:'visible'});
   assert.match(await page.locator('#hill-trace-first').innerText(),/mounting holes.*STILL UNKNOWN/);
   assert.equal(await page.locator('#hill-trace-now').getAttribute('data-marker'),'false',
    'old identity marker must not resurrect after two question changes');
   await page.getByRole('button',{name:/Move \? to request an attributed source/}).click();
   await page.locator('#restart').click();
   await page.getByRole('button',{name:'Begin the PAPER trial'}).click();
   assert.equal(await page.locator('#hill-trace-now').getAttribute('data-marker'),'false','E11 restart removes replayed marker');
   assert.equal(await page.locator('#hill-trace-world').isVisible(),true,'E11 restart keeps earned E10 evidence');
   await returnE10();
   await page.locator('#restart').click();
   assert.equal(await page.locator('#e11-paper').isVisible(),false);
   await page.goto(base+'/e11-scene/');
   assert.equal(await page.locator('#hill-trace-world').isVisible(),false);
   const widths=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(widths.scroll<=widths.w+1,JSON.stringify({viewport,widths}));
   assert.deepEqual(errors,[]);
  }finally{await context.close();}
 }
 console.log('E10→E11 question/trace PAPER callback Chromium PASS: three viewports, safe retry, E10 return, resets and no rights');
}finally{await browser.close();}
