// Test the isolated authoring viewer, never assert physical route acceptance.
import {chromium} from 'playwright';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const data=JSON.parse(await readFile('content/season-01/s01e03/M1_ROUTE_REVIEW.json'));
assert.equal(data.status,'owner_art_and_depth_visual_pass_runtime_pending');
assert.equal(data.depthRegistration.ownerFixReview,'PASS');
assert.equal(data.priorFindings.length,3);
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch(),p=await browser.newPage({viewport:{width:1440,height:1100},reducedMotion:'reduce'}),errors=[];
p.on('pageerror',e=>errors.push(e.message));
try{
 await p.goto((process.env.TEST_ART_BASE_URL||'http://127.0.0.1:4173')+'/e03/route-review.html');await p.locator('#plate').evaluate(i=>i.decode());
 for(const [key,r] of Object.entries(data.routes)){
  await p.locator(`[data-route="${key}"]`).click();
  for(let i=0;i<r.points.length;i++){
   if(i)await p.locator('#next').click();
   assert.match(await p.locator('#position').innerText(),new RegExp(`${i+1} / ${r.points.length}`));
   if(data.priorFindings.some(x=>x.route===key&&x.index===i))await p.screenshot({path:`test-results/e03-m1-review-${key}-${i}-DEPTH-FIX.png`,fullPage:true});
  }
 }
 await p.locator('#guides').click();await p.locator('[data-route="N"]').click();await p.locator('#cart').check();await p.locator('#walk').click();await p.waitForFunction(()=>document.querySelector('#position').textContent.includes('停點'));
 assert.match(await p.locator('#position').innerText(),/4 \/ 17/);
 await p.locator('[data-art="m0"]').click();await p.locator('#plate').evaluate(i=>i.decode());assert.equal(await p.locator('#actor').isHidden(),true);
 await p.locator('[data-art="m1"]').click();await p.locator('#plate').evaluate(i=>i.decode());
 await p.setViewportSize({width:568,height:320});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await p.screenshot({path:'test-results/e03-m1-review-568.png',fullPage:true});
 assert.equal(await p.evaluate(()=>localStorage.length),0);assert.deepEqual(errors,[]);
 const release=JSON.parse(await readFile('dist/wondervale-e03-preview/RELEASE_INTEGRITY.json'));
 assert.ok(release.files.every(x=>!x.path.includes('m1')&&!x.path.includes('route-review')&&!x.path.includes('route-depth')));
 const report={viewerChecks:'PASS',nodeStops:41,errors,storageWrites:0,runtimeLeak:false,ownerArt:'PASS',ownerDepth:'PASS',physicalRouteAcceptance:'OPEN',priorFindings:data.priorFindings};
 await writeFile('test-results/e03-m1-review-report.json',JSON.stringify(report,null,2));
 console.log('PASS isolated M1 viewer controls and release exclusion. Art owner PASS; physical route clearance remains OPEN.');
}finally{await browser.close();}
