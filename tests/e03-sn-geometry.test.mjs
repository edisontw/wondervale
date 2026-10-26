// Source-pixel evidence gate for the unapproved E03 S/N through-routes.
// Foreground masks are for compositing review, NOT measured walkable floor or solids.
// This test intentionally cannot grant route/physical/Owner acceptance.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {contains,occluders} from '../e03/route-depth.mjs';
import {places,edges,route,restricted} from '../engine/s01e03.mjs';

const review=JSON.parse(readFileSync(new URL('../content/season-01/s01e03/M1_ROUTE_REVIEW.json',import.meta.url),'utf8'));
const sourceSize=review.dimensions;
const masks=occluders.flatMap(o=>o.polygons.map((polygon,i)=>({id:o.id,index:i,polygon})));

function sampleRoute(points){
 const result={};
 for(let i=1;i<points.length;i++){
  const [a,b]=[points[i-1],points[i]];
  const count=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])));
  for(let k=0;k<=count;k++){
   const t=k/count,p=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
   for(const mask of masks){
    if(!contains(p,mask.polygon))continue;
    const key=mask.id;
    if(!result[key])result[key]={samples:0,segments:new Set()};
    result[key].samples++;
    result[key].segments.add(i-1+'→'+i);
   }
  }
 }
 return Object.fromEntries(Object.entries(result).map(([id,v])=>
  [id,{samples:v.samples,segments:[...v.segments]}]));
}

test('S/N source-pixel foreground evidence remains unresolved; no fabricated floor approval',()=>{
 assert.deepEqual(sourceSize,[1672,941]);
 for(const [id,r] of Object.entries(review.routes)){
  assert.ok(r.points.length>2,id+' review polyline must exist');
  for(const [x,y] of r.points)assert.ok(x>=0&&x<sourceSize[0]&&y>=0&&y<sourceSize[1],id+' review feet off plate');
 }
 const findings=Object.fromEntries(Object.entries(review.routes).map(([id,r])=>[id,sampleRoute(r.points)]));
 assert.ok((findings.S['terrace-front']?.segments.length||0)>=3,'S upper terrace foreground needs floor review');
 assert.ok((findings.N['unloading-cargo']?.segments.length||0)>=2,'N rear cargo has two unresolved foreground crossings');
 assert.ok((findings.N['arcade-front-pier']?.segments.length||0)>=1,'N arcade pier transition remains unresolved');
 assert.equal(Object.keys(findings.L).length,0,'L reference should not cross registered review foreground masks');

 const m0=readFileSync(new URL('../public/art/s01e03-market-lane-m0.webp',import.meta.url));
 const m1=readFileSync(new URL('../public/art/s01e03-market-lane-m1-candidate.webp',import.meta.url));
 assert.ok(m0.equals(m1),'new/different M1 source art requires independent pavement/occlusion re-review');

 mkdirSync('test-results',{recursive:true});
 writeFileSync('test-results/e03-sn-floor-evidence.json',JSON.stringify({
  baseline:'main E03 M0/M1 same source raster; review polylines and registered foreground masks',
  verdict:'blocked-design; S/N legal walkable floor and entry/exit not established',
  sourceSize,sourceArtByteIdentical:true,findings,
  limitations:[
   'Overlap with an occlusion mask is not a physical collision or a solid-obstacle map.',
   'Zero overlap on L does not prove cart wheel, handle, yaw or swept-turn clearance.',
   'This diagnostic cannot certify pavement width, hidden exits, phone gameplay or Owner approval.'
  ]
 },null,2)+'\n');
});

test('canonical E03 stays L-only and S/N inspection-only until geometry approval',()=>{
 for(const id of ['S','N']){
  assert.ok(id in restricted,id+' inspection contract missing');
  assert.equal(restricted[id].cart,false);
  assert.equal(restricted[id].steady,false);
  assert.equal(id in places,false,id+' must not become a fabricated walkable node');
  assert.deepEqual(route('H',id,'books'),[]);
  assert.deepEqual(route(id,'B','books'),[]);
 }
 assert.ok(route('H','B','books').length>2,'existing accepted L book route must remain playable');
 assert.ok(edges.every(e=>e.clearance===null),'no unmeasured width may be advertised as verified');
});
