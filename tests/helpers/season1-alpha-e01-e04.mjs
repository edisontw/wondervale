// Actual child-operated E01 -> E04 Alpha start, reusable by the full-season journey.
import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';

export const E01_SAVE_KEY='wondervale-progress-v1';
export const E02_SAVE_KEY='wondervale-s01e02-progress-v1';
export const E03_SAVE_KEY='wondervale-s01e03-progress-v1';

export async function playAlphaE01ToE04(page,alphaBase=process.env.WONDERVALE_ALPHA_TEST_URL||'http://127.0.0.1:4174'){
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
  await page.goto(alphaBase+'/season-alpha/');
  const frame=key=>page.frameLocator(`iframe[data-frame-key="${key}"]`);
  const ready=async(slot,key)=>page.waitForFunction(({slot,key})=>{
    const target=document.querySelector(`iframe[data-frame-key="${key}"]`);
    return document.querySelector('#scene-position')?.textContent===`Scene ${slot} of 12`&&
      target&&!target.hidden&&target.dataset.loaded==='true';
  },{slot,key});
  const drainE01=async scene=>{
    let steps=0;
    while(true){
      if(await scene.getByRole('button',{name:'Skip dialogue',exact:true}).count())
        await scene.getByRole('button',{name:'Skip dialogue',exact:true}).click();
      else if(await scene.getByRole('heading',{name:'A normal day in Town Square',exact:true}).count()&&
        await scene.getByRole('button',{name:'Continue',exact:true}).count())
        await scene.getByRole('button',{name:'Continue',exact:true}).click();
      else break;
      assert.ok(++steps<25,'E01 dialogue must progress');
    }
  };
  const e01button=(scene,name)=>scene.getByRole('button',{name,exact:true});
  const finishE02=async scene=>{
    let steps=0;
    while(await scene.getByRole('button',{name:'Continue',exact:true}).count()){
      await scene.getByRole('button',{name:'Continue',exact:true}).click();
      assert.ok(++steps<80,'E02 dialogue queue must progress');
    }
  };

  await ready(1,'e01');
  const e01=frame('e01');
  const episode=JSON.parse(await readFile(new URL('../../public/episode.json',import.meta.url),'utf8'));
  await e01button(e01,'Begin').click();await drainE01(e01);
  await e01button(e01,'Noticeboard').click();
  await e01button(e01,'Help hold the paper.').click();await drainE01(e01);
  await e01button(e01,'Look at the line').click();await drainE01(e01);
  await e01button(e01,'Look at the shape').click();await drainE01(e01);
  await e01button(e01,episode.lines['S01E01-MILO-013'].exact_text).click();await drainE01(e01);
  for(const [place,compare] of [['Fountain','Compare the round mark'],['Big tree','Compare the tree mark']]){
    await e01button(e01,place).click();await e01button(e01,compare).click();await drainE01(e01);
  }
  await e01button(e01,'Old post').click();
  await e01button(e01,'Look at the old post').click();await drainE01(e01);
  await e01button(e01,'Clean without rubbing').click();
  await e01button(e01,'Continue').click();await e01button(e01,'Continue').click();
  assert.equal(await e01.locator('.marker-original-ink').count(),1,
    'E01 reveals its original marker only after the replay-earned clean');
  await drainE01(e01);await e01button(e01,'Finish this page').click();await drainE01(e01);
  const e01Ledger=await page.locator('iframe[data-frame-key="e01"]').evaluate((element,key)=>
    JSON.parse(element.contentWindow.localStorage.getItem(key)).ledger,E01_SAVE_KEY);
  assert.ok(e01Ledger.includes('episode_completed:s01e01'));
  assert.equal(await e01.getByRole('link',{name:'Continue to Episode 2 · Riverside →',exact:true}).count(),1);
  await e01.getByRole('link',{name:'Continue to Episode 2 · Riverside →',exact:true}).click();

  await ready(2,'e02');
  const e02=frame('e02');
  assert.equal(await e02.getByRole('button',{name:'Begin Riverside adventure'}).count(),1);
  await e02.getByRole('button',{name:'Begin Riverside adventure'}).click();await finishE02(e02);
  await e02.getByRole('button',{name:'Go to public lookout',exact:true}).click();await finishE02(e02);
  await e02.getByRole('button',{name:'Look across',exact:true}).click();await finishE02(e02);
  await e02.getByRole('button',{name:'Back to Riverside',exact:true}).click();
  await e02.getByRole('button',{name:'Look at old stones',exact:true}).click();await finishE02(e02);
  await e02.getByRole('button',{name:'Back to Riverside',exact:true}).click();
  await e02.getByRole('button',{name:'Open old map',exact:true}).click();
  await e02.getByRole('button',{name:'Close map',exact:true}).click();await finishE02(e02);
  await e02.getByRole('button',{name:'Open evidence notebook',exact:true}).click();await finishE02(e02);
  await e02.getByRole('button',{name:'Not sure yet',exact:true}).click();await finishE02(e02);
  const notebookLayout=await e02.locator('body').evaluate(()=>{
    const selectors=['#app','.outer','.child','.scene-card','.notebook-sheet','.notebook-evidence','[data-a="fact-stones"]','.notebook-footer'];
    return {viewport:{width:innerWidth,height:innerHeight},items:Object.fromEntries(selectors.map(selector=>{
      const node=document.querySelector(selector),rect=node?.getBoundingClientRect();
      return [selector,node&&rect?{top:rect.top,bottom:rect.bottom,height:rect.height,display:getComputedStyle(node).display,overflow:getComputedStyle(node).overflow,pointerEvents:getComputedStyle(node).pointerEvents}:null];
    }))};
  });
  assert.ok(notebookLayout.items['.notebook-evidence'].height>=44,
    'E02 evidence cards need a visible, touchable area in short landscape');
  assert.ok(notebookLayout.items['[data-a="fact-stones"]'].bottom<=notebookLayout.items['.notebook-footer'].top,
    'E02 notebook footer must not cover an evidence card');
  await mkdir('test-results',{recursive:true});
  await page.screenshot({path:'test-results/season1-alpha-e02-notebook-fixed-568x320.png'});
  await e02.locator('[data-a="fact-stones"]').click();await finishE02(e02);
  await e02.locator('[data-a="fact-gap"]').click();await finishE02(e02);
  await e02.getByRole('button',{name:'I was wrong about only the fence.',exact:true}).click();await finishE02(e02);
  await e02.getByRole('button',{name:'Go to public lookout',exact:true}).click();
  await e02.getByRole('button',{name:'Look at the old mark',exact:true}).click();await finishE02(e02);
  await e02.getByRole('button',{name:'Read the Chronicle',exact:true}).click();await finishE02(e02);
  await e02.getByRole('button',{name:'Finish this chapter',exact:true}).click();
  assert.equal(await e02.getByRole('heading',{name:'Chapter complete'}).count(),1);
  const e02Stored=await page.locator('iframe[data-frame-key="e02"]').evaluate((element,key)=>
    JSON.parse(element.contentWindow.localStorage.getItem(key)),E02_SAVE_KEY);
  assert.equal(e02Stored.phase,'completed');
  assert.ok(e02Stored.ledger.includes('episode_completed:s01e02'));
  await e02.getByRole('link',{name:'Continue to Market Lane',exact:true}).click();

  await ready(3,'e03');
  const e03=frame('e03');
  assert.equal(await e03.getByRole('button',{name:'Begin Market Lane adventure'}).count(),1);
  await e03.locator('[data-a="begin"]').click();
  const drainE03=async()=>{
    let steps=0;
    while(await e03.locator('[data-a="next"]').count()){
      await e03.locator('[data-a="next"]').click();assert.ok(++steps<50,'E03 dialogue queue must progress');
    }
  };
  const e03act=key=>e03.locator(`[data-a="${key}"]`).click();
  const arrive=async()=>{await e03act('walk');await e03.locator('[data-a="deliver"]').waitFor();};
  const returnToHub=async()=>{
    const phase=await e03.locator('.child').getAttribute('data-phase');
    const cartReturns=phase==='return-tea';
    if(cartReturns){
      assert.equal(await e03.locator('[data-load-visual="cart"]').getAttribute('aria-label'),'Empty tea handcart',
        'the cups are delivered but Milo keeps the empty cart');
    }
    const destination=phase==='return-books'?'tea':'flowers';
    await e03act('return');await e03.locator(`.child[data-phase="${destination}"]`).waitFor();
    if(cartReturns)assert.equal(await e03.locator('[data-load-visual="cart"]').count(),0,
      'the live reverse cart journey ends at the hub before the flower tray appears');
    await drainE03();await e03.locator('[data-a="walk"]').waitFor();
  };
  await drainE03();await arrive();await e03act('deliver');await drainE03();
  await returnToHub();await arrive();await e03act('deliver');await drainE03();
  await e03act('compare-open');await e03act('inspect-S');await e03act('observe');await e03act('reason-steps');await drainE03();
  await returnToHub();await arrive();await e03act('deliver');await drainE03();
  await e03act('return');await e03.locator('.child[data-phase="signs"]').waitFor();await drainE03();
  await e03act('signs-open');await e03act('bad-cart');
  await e03.getByText('Check the arrow.',{exact:false}).waitFor();
  await e03act('walk-sign');await e03act('cart-sign');await drainE03();
  await e03act('go-glyph');await e03act('glyph');await drainE03();
  await e03act('garden');await drainE03();await e03act('station');await drainE03();
  await e03act('chronicle');await drainE03();await e03act('finish');
  await e03.getByRole('heading',{name:'Different loads, different ways'}).waitFor();
  const e03Stored=await page.locator('iframe[data-frame-key="e03"]').evaluate((element,key)=>
    JSON.parse(element.contentWindow.localStorage.getItem(key)),E03_SAVE_KEY);
  assert.ok(e03Stored.ledger.includes('episode_completed:s01e03'));
  assert.deepEqual(await page.evaluate(({e01SaveKey,e02SaveKey,e03SaveKey})=>[
    JSON.parse(localStorage.getItem(e01SaveKey)).ledger,
    JSON.parse(localStorage.getItem(e02SaveKey)).ledger,
    JSON.parse(localStorage.getItem(e03SaveKey)).ledger
  ],{e01SaveKey:E01_SAVE_KEY,e02SaveKey:E02_SAVE_KEY,e03SaveKey:E03_SAVE_KEY}),
  [e01Ledger,e02Stored.ledger,e03Stored.ledger]);

  await page.locator('#scene-steps [data-slot="4"]').click();await ready(4,'e04');
  const e04=frame('e04');
  await e04.getByRole('heading',{name:'Source cards',exact:true}).waitFor();
  assert.match(await e04.locator('.alpha-warning').innerText(),/SYNTHETIC PAPER SOURCES.*OWNER-SELECTED FICTIONAL SCRIPT MODEL.*NOT HISTORICAL EVIDENCE/);
  const e04Initial=await e04.locator('#e04-preview').innerText();
  assert.match(e04Initial,/station route board · Version 1/i);
  assert.match(e04Initial,/garden route update · Version 2/i);
  assert.match(e04Initial,/Undated photo: way sign/);
  assert.doesNotMatch(e04Initial,/E05 unlocked|E05 available/i);
  assert.equal(await e04.locator('a[href*="e05"]').count(),0,'E04 must be played before its story handoff appears');

  // Navigation to an unopened PAPER scene does not create any E04 evidence.
  await page.locator('#next-scene').click();await ready(5,'e05');
  const e05=frame('e05');
  await e05.getByRole('heading',{name:'E05 — The Station with No Trains'}).waitFor();
  assert.equal(await e05.locator('#e04-alpha-arrival').isVisible(),false,
    'Next scene preview has no replay-earned E04 handoff');
  await page.locator('#scene-steps [data-slot="4"]').click();await ready(4,'e04');

  for(const key of ['memory:station','memory:garden',
    'inspect:station-route-copy','inspect:garden-route-update','inspect:undated-way-photo','clue:version-mark'])
    await e04.locator(`[data-focus-key="${key}"]`).click();
  await e04.locator('[data-focus-key="place:station-route-copy:later"]').click();
  await e04.locator('[data-focus-key="place:garden-route-update:earlier"]').click();
  await e04.locator('[data-focus-key="place:undated-way-photo:uncertain"]').click();
  assert.equal(await e04.locator('[data-focus-key="explain"]').isDisabled(),true,
    'the draft cannot explain an unsupported paper order');
  await e04.locator('[data-focus-key="place:station-route-copy:earlier"]').click();
  await e04.locator('[data-focus-key="place:garden-route-update:later"]').click();
  assert.equal(await e04.locator('[data-focus-key="explain"]').isEnabled(),true);
  await e04.locator('[data-focus-key="explain"]').click();await e04.locator('[data-focus-key="chronicle"]').click();
  const e04Chronicle=await e04.locator('.e04-chronicle').innerText();
  assert.match(e04Chronicle,/Earlier and later show source order, not confirmed calendar dates/);
  assert.match(e04Chronicle,/Version 1/);assert.match(e04Chronicle,/Version 2/);
  assert.match(e04Chronicle,/Not sure yet:[\s\S]*Undated photo: way sign/);
  assert.match(e04Chronicle,/Neither memory has a verified date/);
  assert.match(e04Chronicle,/Different times could explain both memories/);
  assert.doesNotMatch(e04Chronicle,/19\d{2}|20\d{2}|because the garden moved/i);
  await e04.locator('[data-focus-key="finish"]').click();
  await e04.getByText('Draft timeline complete. This does not unlock production episodes.').waitFor();
  assert.equal(await e04.locator('.e04-alpha-handoff').count(),1,
    'only a finished, replay-validated E04 draft offers the child-operated handoff');
  assert.deepEqual(await page.locator('iframe[data-frame-key="e02"]').evaluate((element,key)=>
    JSON.parse(element.contentWindow.localStorage.getItem(key)),E02_SAVE_KEY),e02Stored,
    'E04 draft cannot rewrite the E02 save');
  assert.deepEqual(await page.locator('iframe[data-frame-key="e03"]').evaluate((element,key)=>
    JSON.parse(element.contentWindow.localStorage.getItem(key)),E03_SAVE_KEY),e03Stored,
    'E04 draft cannot rewrite the E03 save');
  await e04.locator('.e04-alpha-handoff').click();await ready(5,'e05');
  await e05.locator('#e04-alpha-arrival').waitFor({state:'visible'});
  await e05.locator('#e04-alpha-arrival').evaluate(element=>element.scrollIntoView({block:'start',behavior:'instant'}));
  const arrivalBounds=await e05.locator('#e04-alpha-arrival').evaluate(element=>{
    const rect=element.getBoundingClientRect();
    return {top:rect.top,bottom:rect.bottom,height:innerHeight};
  });
  assert.ok(arrivalBounds.bottom>0&&arrivalBounds.top<arrivalBounds.height,
    'the carried E04 story panel can be brought into the visible E05 scene viewport');
  const recap=e05.locator('#e04-alpha-recall');
  assert.equal(await recap.evaluate(el=>el.open),false,'the short arrival dialogue precedes optional source detail');
  assert.match(await e05.locator('#e04-alpha-story').innerText(),/Milo:.*A way to the station\. A way to the garden\.[\s\S]*Nia:.*Two memories\. We don't know when\.[\s\S]*Finn:.*Let's look at the board/);
  await recap.locator('summary').click();
  assert.equal(await recap.evaluate(el=>el.open),true);
  assert.match(await e05.locator('#e04-alpha-note').innerText(),/Market coordinator:.*undated memory.*Garden resident:.*undated memory/);
  assert.match(await e05.locator('#e04-alpha-note').innerText(),/Version 1 paper comes before Version 2.*photo stays Not sure yet/);
  await recap.locator('summary').click();
  assert.equal(await recap.evaluate(el=>el.open),false);
  assert.match(await e05.locator('.notice').first().innerText(),/AUTHORING ONLY.*no approved entry permission.*E04 canonical checkpoint/i);
  assert.match(await e05.locator('#guard').innerText(),/Production E05 LOCKED/);

  return {frame,ready,errors,e01Ledger,e02Stored,e03Stored,e04Chronicle,outsideSentinels:null,outsideOrigin:null};
}
