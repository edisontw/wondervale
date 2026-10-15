#!/usr/bin/env node
// Gate 2 source-geometry QA only. Never interpret as browser/device/child physics PASS.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const dir=path.join(root,"content/season-01/s01e03");
const graph=JSON.parse(fs.readFileSync(path.join(dir,"MARKET_LANE_TOPOLOGY_R2.json"),"utf8"));
const manifest=JSON.parse(fs.readFileSync(path.join(dir,"MARKET_LANE_LAYERED_R2_MANIFEST.json"),"utf8"));
const svg=fs.readFileSync(path.join(dir,"MARKET_LANE_LAYERED_R2.svg"),"utf8");
const preview=fs.readFileSync(path.join(dir,"MARKET_LANE_R2_VISUAL_QA.html"),"utf8");
const decor=fs.readFileSync(path.join(dir,"MARKET_LANE_DECOR_OVERLAY_R1.svg"),"utf8");
const check=(x,msg)=>assert.ok(x,msg);
const dist=(a,b)=>Math.hypot(graph.nodes[a].x-graph.nodes[b].x,graph.nodes[a].y-graph.nodes[b].y);
function pathLength(ids,mode){let v=0;for(let i=1;i<ids.length;i++){const a=ids[i-1],b=ids[i],e=graph.edges.find(z=>(z.from===a&&z.to===b)||(z.from===b&&z.to===a));check(e,"Missing edge "+a+" -> "+b);check(e.allow.includes(mode),"Forbidden "+mode+" edge "+e.id);v+=dist(a,b)}return v}
check(graph.artboard.width===1600&&graph.artboard.height===900,"Artboard must be 1600x900");
check(graph.artboard.protected_caption_y_start===705,"Dock reservation changed");
check(!/<text\b/i.test(svg),"Visible text baked into the backdrop");
check(!/<text\b|<script\b|<foreignObject\b/i.test(decor),"Decorative layer must not include text, scripts or embedded media");
check(decor.includes('viewBox="0 0 1600 900"'),"Decor must align to approved R2 geometry viewbox");
const decorIds=[...decor.matchAll(/id="(decor-[^"]+)"/g)].map(m=>m[1]);
check(decorIds.length===7&&new Set(decorIds).size===7,"Expected exactly seven independent decorative groups");
const layers=[...svg.matchAll(/<g id="(layer-[^"]+)"/g)].map(m=>m[1]);
check(layers.length===18&&new Set(layers).size===18,"Independent layer IDs invalid");
for(const id of manifest.layers.map(l=>l.id))check(layers.includes(id),"Missing manifest layer "+id);
for(const id of ["layer-path-level","layer-path-arcade","layer-path-stairs","layer-unloading-blockage","layer-existing-market-stone","layer-blank-sign-mounts","layer-interactive-prop-slots"])check(svg.includes('id="'+id+'"'),"Missing layer "+id);
check(svg.includes('id="layer-narrow-arcade"')&&svg.includes('transform="translate(-280 -120)"'),"Arcade correction missing");
for(const [id,n] of Object.entries(graph.nodes)){
 const m=svg.match(new RegExp('<circle data-slot="'+id+'" cx="(\\d+)" cy="(\\d+)"'));
 if(m)check(+m[1]===n.x&&+m[2]===n.y,"Stale SVG anchor "+id);
}
const step=pathLength(graph.routeFamilies.S,"books"),arcade=pathLength(graph.routeFamilies.N,"books"),outer=pathLength(graph.routeFamilies.L,"books");
check(step<arcade&&arcade<outer,"Book route ordering must be S < N < L");
check(pathLength(["H","L0","L1","L2","W","T"],"cart")>0,"Cart cannot reach tea");
check(pathLength(graph.routeFamilies.flower,"tray")>0,"Tray cannot reach flower stand");
check(graph.blocked.length===1&&graph.blocked[0].allow.length===0,"Unloading must block only the direct connector");
for(const e of graph.edges)if(/^[sn]/.test(e.id))check(!e.allow.includes("cart"),"Cart illegally uses stairs or narrow path");
// Coarse bounds of R1 shop art before R2 SVG group transforms.
// This tests conceptual visual overlap, not eventual collision polygons.
const bounds={produce:[60,188,315,490],books:[1165,-5,1515,311],tea:[1333,273,1569,575],flowers:[962,325,1192,627]};
const shops=Object.entries(bounds).map(([name,b])=>{
 const m=svg.match(new RegExp('<g data-component="shop-'+name+'" transform="translate\\((-?[\\d.]+) (-?[\\d.]+)\\) scale\\(([\\d.]+)\\)"'));
 check(m,"Missing independent transform for shop "+name);
 const [x,y,s]=m.slice(1).map(Number);
 return {name,box:[b[0]*s+x,b[1]*s+y,b[2]*s+x,b[3]*s+y]};
});
const pointDist=(x,y,[l,t,r,b])=>Math.hypot(Math.max(l-x,0,x-r),Math.max(t-y,0,y-b));
const maxRoadY=Math.max(...graph.edges.filter(e=>e.id.startsWith("l")).map(e=>Math.max(graph.nodes[e.from].y,graph.nodes[e.to].y)+(e.id==="l6"?46.5:53.5)));
check(maxRoadY<=graph.artboard.protected_caption_y_start-20,"Wide road intrudes into lower dialogue dock");
let minMargin=Infinity;
for(const e of graph.edges){
 const p=graph.nodes[e.from],q=graph.nodes[e.to],rad=/^l/.test(e.id)?(e.id==="l6"?46.5:53.5):/^s/.test(e.id)?38:27.5;
 const steps=Math.ceil(Math.hypot(p.x-q.x,p.y-q.y)/5);
 for(const shop of shops){
  let closest=Infinity;
  for(let i=0;i<=steps;i++){const f=i/steps;closest=Math.min(closest,pointDist(p.x+(q.x-p.x)*f,p.y+(q.y-p.y)*f,shop.box))}
  const margin=closest-rad;minMargin=Math.min(minMargin,margin);
  check(margin>=-0.001,"Road "+e.id+" visual outline intersects shop "+shop.name+" by "+(-margin).toFixed(1)+" design pixels");
 }
}
for(const [id,n] of Object.entries(graph.nodes))for(const shop of shops)check(pointDist(n.x,n.y,shop.box)>=28,"Interactive node "+id+" overlaps "+shop.name);
for(const size of ["1600,900","667,375","568,320","390,844"])check(preview.includes('data-size="'+size+'"'),"Missing viewport "+size);
check(preview.includes('src="./MARKET_LANE_LAYERED_R2.svg"'),"QA page not linked to actual R2 SVG");
check(preview.includes('src="./MARKET_LANE_DECOR_OVERLAY_R1.svg"'),"QA page must load editable optional accent layer");
console.log(JSON.stringify({status:"SOURCE_QA_PASS_ONLY",routeLength:{steps:Math.round(step),arcade:Math.round(arcade),outer:Math.round(outer)},layers:layers.length,shopCount:shops.length,maxWideRoadY:maxRoadY,minShopRoadMargin:Math.round(minMargin),browserRender:"NOT_TESTED",ownerArtPASS:false},null,2));
