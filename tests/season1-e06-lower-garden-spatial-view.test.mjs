import test from 'node:test';
import assert from 'node:assert/strict';
import {SITES,siteEffect} from '../engine/s01e06-authoring-prototype.mjs';
import {lowerGardenSpatialView} from '../e06-scene/lower-garden-spatial-view.mjs';

const empty=()=>({markerSite:null,markerInspected:false,attempts:[]});

test('lower diagram starts with no marker and no inferred water or path result',()=>{
  const view=lowerGardenSpatialView(empty());
  assert.equal(view.modelOnly,true);
  assert.equal(view.marker,null);
  assert.deepEqual(view.zones.map(zone=>zone.site),Object.keys(SITES));
  assert.ok(view.zones.every(zone=>zone.check===null));
});

test('temporary marker follows the selected synthetic zone and remains unchecked until checked',()=>{
  const view=lowerGardenSpatialView({...empty(),markerSite:'raised-pocket'});
  const zone=view.zones.find(item=>item.site==='raised-pocket');
  assert.deepEqual(view.marker,{site:'raised-pocket',x:zone.x,y:zone.y,checked:false});
  assert.ok(view.marker.x>=0&&view.marker.x<=500&&view.marker.y>=0&&view.marker.y<=300);
  assert.equal(zone.check,null);
});

test('visual results appear only for actual recorded water and path checks',()=>{
  const attempts=Object.keys(SITES).map(site=>({site,...siteEffect(site)}));
  const view=lowerGardenSpatialView({...empty(),markerSite:'raised-pocket',
    markerInspected:true,attempts});
  assert.deepEqual(view.zones.map(zone=>[zone.site,zone.check.result]),[
    ['runoff-channel','wet'],['footpath','blocks-path'],['raised-pocket','clear']]);
  assert.equal(view.marker.checked,true);
  assert.deepEqual(view.zones.find(zone=>zone.site==='footpath').check,
    {result:'blocks-path',wet:false,blocksPath:true,provisional:false});
});

test('latest check per site wins while prior checked sites remain visible',()=>{
  const view=lowerGardenSpatialView({...empty(),markerSite:'footpath',markerInspected:false,
    attempts:[{site:'runoff-channel',...siteEffect('runoff-channel')},
      {site:'footpath',...siteEffect('footpath')},
      {site:'runoff-channel',wet:false,blocksPath:false,provisional:true}]});
  assert.equal(view.marker.checked,false);
  assert.equal(view.zones.find(zone=>zone.site==='runoff-channel').check.result,'clear');
  assert.equal(view.zones.find(zone=>zone.site==='footpath').check.result,'blocks-path');
  assert.equal(view.zones.find(zone=>zone.site==='raised-pocket').check,null);
});

test('invalid or forged marker/check data fails closed',()=>{
  assert.equal(lowerGardenSpatialView({...empty(),markerSite:'north-hill'}),null);
  assert.equal(lowerGardenSpatialView({...empty(),markerSite:'footpath',markerInspected:true}),null);
  assert.equal(lowerGardenSpatialView({...empty(),attempts:[
    {site:'footpath',wet:true,blocksPath:false,provisional:false,historicalCause:'flood'}]}),null);
  assert.equal(lowerGardenSpatialView({...empty(),attempts:[
    {site:'unknown',wet:false,blocksPath:false,provisional:false}]}),null);
});
