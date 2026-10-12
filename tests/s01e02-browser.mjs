import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';

const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
await mkdir('test-results',{recursive:true});
const errors=[],report=[];
const browser=await chromium.launch({headless:true});
const fakeE01={schemaVersion:1,contentVersion:'s01e01-script-v1',ledger:['episode_completed:s01e01','s01e01_town_square_old_marker_revealed','s01e01_old_route_points_toward_riverside'],checkpoint:{phase:'completed'}};
async function open({width=1366,height=900,authorized=true,touch=false}={}){
 const ctx=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch,reducedMotion:'reduce'});
 if(authorized)await ctx.addInitScript(data=>{localStorage.setItem('wondervale-progress-v1',JSON.stringify(data));},fakeE01);
 const p=await ctx.newPage();
 p.on('pageerror',e=>errors.push(e.message));
 p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await p.goto(base+'/e02/',{waitUntil:'networkidle'});
 await p.getByRole('heading',{name:authorized?'Find the way that is safe today':'Riverside is next'}).waitFor();
 return {ctx,p};
}
async function lines(p){
 let i=0;
 while(await p.getByRole('button',{name:'Continue',exact:true}).count()){
  await p.getByRole('button',{name:'Continue',exact:true}).click();
  assert.ok(++i<80,'E02 line queue failed to drain');
 }
 return i;
}
async function action(p,name){await p.getByRole('button',{name,exact:true}).first().click();}
async function saved(p){return p.evaluate(()=>JSON.parse(localStorage.getItem('wondervale-s01e02-progress-v1')));}
const passed=(id,note)=>{report.push({id,status:'PASS',note});process.stdout.write('PASS '+id+' '+note+'\n');};
try{
 {const {ctx,p}=await open({authorized:false});
  assert.equal(await p.getByRole('button',{name:'Begin Riverside adventure'}).count(),0);
  await ctx.close();passed('E02-N02','E01 prerequisite truly gates the episode');
 }
 // The completed Town Square must hand off to E02 on the same origin, without losing progress.
 {const handoffCtx=await browser.newContext({viewport:{width:667,height:375},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
  await handoffCtx.addInitScript(data=>{localStorage.setItem('wondervale-progress-v1',JSON.stringify(data));},fakeE01);
  const handoffPage=await handoffCtx.newPage();
  handoffPage.on('pageerror',e=>errors.push(e.message));
  await handoffPage.goto(base+'/',{waitUntil:'networkidle'});
  const next=handoffPage.getByRole('link',{name:'Continue to Episode 2 · Riverside →',exact:true});
  assert.equal(await next.count(),1);
  await next.click();
  await handoffPage.waitForURL('**/e02/');
  await handoffPage.getByRole('button',{name:'Begin Riverside adventure'}).waitFor();
  assert.deepEqual(await handoffPage.evaluate(()=>JSON.parse(localStorage.getItem('wondervale-progress-v1')).ledger),fakeE01.ledger);
  await handoffCtx.close();
  passed('E01-E02-REAL-LINK','Town Square completion links to unlocked E02 on same origin and preserves E01 ledger');
 }
 const {ctx,p}=await open();
 assert.equal(await p.getByText('MARKET LANE →',{exact:true}).count(),0);
 await action(p,'Begin Riverside adventure');
 assert.ok((await p.locator('[data-line]').first().getAttribute('data-line')).startsWith('S01E02-'));
 await lines(p);
 passed('E02-S01','Mandatory fence-only opening played line-by-line');
 // Touch/keyboard alike have explicit accessible Go-to station actions.
 await action(p,'Go to public lookout');await lines(p);
 const arrived=await saved(p);
 assert.equal(arrived.ledger.filter(x=>x==='s01e02_riverside_overlook_accessible').length,1);
 assert.equal(arrived.observed.length,0,'Arrival alone cannot count as inspection');
 assert.equal(await p.getByText('MARKET LANE →',{exact:true}).count(),0);
 await action(p,'Look across');assert.ok(await p.locator('img.backdrop').getAttribute('src').then(s=>s.endsWith('-r2.webp')));
 await lines(p);assert.deepEqual((await saved(p)).observed,['gap']);
 passed('E02-G04/I03','Lookout event once, child must separately inspect gap');
 await action(p,'Walk to old stones');await action(p,'Look at old stones');await lines(p);
 assert.deepEqual(new Set((await saved(p)).observed),new Set(['stones','gap']));
 await action(p,'Open evidence notebook');await lines(p);
 assert.equal(await p.getByText('MARKET LANE →',{exact:true}).count(),0);
 const parent=await p.locator('#parent').innerText();
 assert.ok(parent.includes("doesn't fit Milo's first idea"),'Parent cue now eligible');
 await p.locator('[data-a="fact-stones"]').click();await lines(p);
 assert.equal((await saved(p)).linked,false);
 await p.locator('[data-a="fact-gap"]').click();await lines(p);
 assert.equal((await saved(p)).linked,true);
 passed('E02-I02/R01','Gap-first order and unscored old-stones recovery');
 await action(p,'I was wrong about only the fence.');await lines(p);
 assert.equal((await saved(p)).ledger.filter(x=>x==='s01e02_old_connection_changed_confirmed').length,1);
 assert.equal(await p.getByText('MARKET LANE →',{exact:true}).count(),0);
 await action(p,'Go to public lookout');
 await action(p,'Look at the old mark');await lines(p);
 assert.equal((await saved(p)).ledger.filter(x=>x==='s01e02_market_lane_marker_recorded').length,1);
 assert.equal(await p.getByText('MARKET LANE →',{exact:true}).count(),1);
 passed('E02-M01/M02','Market sign and once-only event strictly gated');
 await action(p,'Read the Chronicle');await lines(p);
 await action(p,'Finish this chapter');
 const final=await saved(p);
 assert.equal(final.phase,'completed');
 assert.equal(final.ledger.filter(x=>x==='episode_completed:s01e02').length,1);
 await p.reload({waitUntil:'networkidle'});
 assert.equal(await p.getByRole('heading',{name:'Chapter complete'}).count(),1);
 assert.equal((await saved(p)).ledger.length,4);
 await p.screenshot({path:'test-results/e02-desktop-complete.png',fullPage:true});
 passed('E02-C02','Complete and restore four deduplicated E02 canonical events');
 await ctx.close();
 for(const width of [320,360,390,430]){
  const {ctx:c,p:page}=await open({width,height:width<390?700:844,authorized:true,touch:true});
  await page.getByRole('button',{name:'Begin Riverside adventure'}).tap();await lines(page);
  const labels=await page.locator('.actor-label').evaluateAll(els=>els.map(el=>({name:el.textContent,rect:el.getBoundingClientRect().toJSON()})));
  assert.equal(labels.length,3);
  for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){
   const a=labels[i].rect,b=labels[j].rect;
   const overlaps=a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
   assert.equal(overlaps,false,'Actor labels overlap on '+width+'px phone: '+labels[i].name+' / '+labels[j].name);
  }
  await page.screenshot({path:'test-results/e02-phone-'+width+'.png',fullPage:true});
  assert.equal(await page.getByRole('button',{name:'Child / Parent View'}).count(),1);
  await page.getByRole('button',{name:'Child / Parent View'}).tap();
  assert.ok(await page.locator('#parent').evaluate(el=>getComputedStyle(el).display!=='none'));
  await c.close();
 }
 passed('E02-E03','320/360/390/430 touch render screenshot and parent view toggle');
 assert.deepEqual(errors,[]);
}finally{await writeFile('test-results/e02-acceptance.json',JSON.stringify({report,errors},null,2));await browser.close();}
