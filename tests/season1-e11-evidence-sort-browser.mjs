// Independent E05→E11 PAPER evidence sorting: real Chromium, landscape and keyboard.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {fresh,dispatch} from '../e05-scene/scene-model.mjs';
let e05=fresh();
const act=(scene,type,props={})=>{e05=dispatch(e05,scene==='nav'?{scene,type}:{scene,action:{type,...props}})};
act('station','start');act('station','walk',{value:'board'});
act('station','inspect',{value:'peg-pair'});act('station','inspect',{value:'worn-edge'});
act('station','guess',{value:'unsure'});act('station','try-copy',{value:'side-a'});
act('station','check');act('station','qualify');act('nav','to-records');
act('sources','start');
for(const card of ['a','b']){act('sources','walk',{value:'desk-'+card});act('sources','inspect',{card});act('sources','source-check',{card})}
act('sources','walk',{value:'compare'});
for(const card of ['a','b']){act('sources','place',{card,slot:'unknown'});act('sources','test',{card})}
act('sources','compare');act('sources','finish');act('nav','to-layout');
act('station','walk',{value:'table'});act('station','place-table',{value:'across-walkway'});
act('station','place-table',{value:'near-wall'});act('station','confirm');
act('station','reflect');act('nav','to-review');
const earnedJSON=JSON.stringify(e05.history);
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
  assert.equal(await pick.isDisabled(),true,'must fail closed without E05');
  await page.locator('#source').setInputFiles({name:'forged.json',mimeType:'application/json',buffer:Buffer.from('[{"scene":"nav","type":"to-review","admin":true}]')});
  await page.getByText('E05 source rejected. PAPER table locked.').waitFor();
  assert.equal(await pick.isDisabled(),true,'forged E05 must remain locked');
  await page.locator('#source').setInputFiles({name:'earned.json',mimeType:'application/json',buffer:Buffer.from(earnedJSON)});
  await page.getByText('E05 PAPER Map Room replayed').waitFor();
  await page.waitForFunction(()=>!document.querySelector('#cards button')?.disabled);
  if(label==='keyboard'){await pick.focus();await page.keyboard.press('Enter');}
  else await pick.click();
  await page.getByRole('button',{name:'Rest idea'}).click();
  await page.getByRole('button',{name:'Test my idea'}).click();
  assert.match(await page.locator('#feedback').innerText(),/change your model/);
  assert.match(await page.locator('#result').innerText(),/No PAPER note yet/);
  await page.getByRole('button',{name:'Path idea'}).click();
  await page.getByRole('button',{name:'Test my idea'}).click();
  assert.match(await page.locator('#result').innerText(),/PAPER NOTE/);assert.match(await page.locator('#result').innerText(),/MOCK records remain UNKNOWN/);
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
