// Alpha-only E04 -> E05 bridge. Every carried record is replayed against the
// current fictional source pack, current E04 draft and current E02/E03 saves.
// This is not a canonical checkpoint, release unlock or historical proof.
import {e04Handoff,E02_KEY,E03_KEY} from '../engine/s01e04-handoff.mjs';
import {
  DRAFT_KEY,MAX_ACTIONS,VERSION as CHRONOLOGY_VERSION,
  replayChronology,restoreDraft,chronicleProjection,validateSourcePack
} from '../engine/s01e04-chronology.mjs';
import {E04_ALPHA_PACK} from './e04-script-model.mjs';

export const ALPHA_HANDOFF_KEY='wondervale-alpha-s01e04-e05-replay-v1';
export const ALPHA_HANDOFF_VERSION='season1-alpha-e04-e05-replay-v1';
const PREFIX='#alpha-e04-e05=';
const MAX_SAVE_CHARS=60000;
const MAX_RECORD_CHARS=48000;
const clone=value=>structuredClone(value);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const owns=(value,key)=>Object.prototype.hasOwnProperty.call(value,key);

function fingerprintPair(first,second){
  const input=JSON.stringify([first,second]);
  let hash=14695981039346656037n;
  const mask=(1n<<64n)-1n;
  for(let i=0;i<input.length;i++){
    hash^=BigInt(input.charCodeAt(i));
    hash=(hash*1099511628211n)&mask;
  }
  return `${input.length}:${hash.toString(16).padStart(16,'0')}`;
}
function parseJson(text){
  if(typeof text!=='string'||text.length===0||text.length>MAX_SAVE_CHARS)return null;
  try{return JSON.parse(text);}catch{return null;}
}
function currentReplay(storage){
  if(!storage||typeof storage.getItem!=='function')return null;
  try{
    const e02Text=storage.getItem(E02_KEY),e03Text=storage.getItem(E03_KEY),draftText=storage.getItem(DRAFT_KEY);
    const e02=parseJson(e02Text),e03=parseJson(e03Text),raw=parseJson(draftText);
    if(!e02||!e03||!raw||!e04Handoff(e02,e03).ready)return null;
    const restored=restoreDraft(raw,E04_ALPHA_PACK,'draft_preview');
    if(!restored||restored.phase!=='completed'||restored.history.length===0||
       !same(restored,raw)||restored.history.at(-1)?.type!=='finish')return null;
    const replayed=replayChronology(restored.history,E04_ALPHA_PACK,'draft_preview');
    if(!replayed||!same(replayed,restored))return null;
    const chronicle=chronicleProjection(replayed,E04_ALPHA_PACK);
    if(!chronicle.complete||chronicle.canonicalEvents.length!==0||
       !chronicle.relativeOrder||!chronicle.uncertain.includes('undated-way-photo'))return null;
    return {e02Text,e03Text,draftText,state:replayed,chronicle,
      packFingerprint:JSON.stringify(validateSourcePack(E04_ALPHA_PACK))};
  }catch{return null;}
}
function recordFor(current){
  return {
    schema:1,
    version:ALPHA_HANDOFF_VERSION,
    mode:'noncanonical_alpha_paper',
    chronologyVersion:CHRONOLOGY_VERSION,
    packFingerprint:current.packFingerprint,
    upstreamFingerprint:fingerprintPair(current.e02Text,current.e03Text),
    history:clone(current.state.history)
  };
}
function validRecordShape(record){
  if(!record||typeof record!=='object'||Array.isArray(record))return false;
  const keys=Object.keys(record).sort();
  const expected=['chronologyVersion','history','mode','packFingerprint','schema','upstreamFingerprint','version'].sort();
  return same(keys,expected)&&record.schema===1&&record.version===ALPHA_HANDOFF_VERSION&&
    record.mode==='noncanonical_alpha_paper'&&record.chronologyVersion===CHRONOLOGY_VERSION&&
    typeof record.packFingerprint==='string'&&typeof record.upstreamFingerprint==='string'&&
    Array.isArray(record.history)&&record.history.length>0&&record.history.length<=MAX_ACTIONS;
}
function encodeRecord(record){
  try{
    const bytes=new TextEncoder().encode(JSON.stringify(record));
    let binary='';
    for(const byte of bytes)binary+=String.fromCharCode(byte);
    return PREFIX+btoa(binary).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
  }catch{return null;}
}
function decodeRecord(hash){
  if(typeof hash!=='string'||!hash.startsWith(PREFIX)||hash.length>MAX_RECORD_CHARS)return null;
  try{
    const encoded=hash.slice(PREFIX.length);
    if(!/^[A-Za-z0-9_-]+$/.test(encoded))return null;
    const base64=encoded.replaceAll('-','+').replaceAll('_','/')+'='.repeat((4-encoded.length%4)%4);
    const binary=atob(base64),bytes=Uint8Array.from(binary,ch=>ch.charCodeAt(0));
    const record=JSON.parse(new TextDecoder().decode(bytes));
    return validRecordShape(record)?record:null;
  }catch{return null;}
}

export function publishE04AlphaHandoff(state,storage){
  const current=currentReplay(storage);
  if(!current||!same(state,current.state))return null;
  const record=recordFor(current),hash=encodeRecord(record);
  if(!hash||hash.length>MAX_RECORD_CHARS)return null;
  try{
    const text=JSON.stringify(record);
    storage.setItem(ALPHA_HANDOFF_KEY,text);
    if(storage.getItem(ALPHA_HANDOFF_KEY)!==text)return null;
    return `../e05-scene/${hash}`;
  }catch{return null;}
}

export function validateE04AlphaHandoff(hash,storage){
  if(!storage||typeof storage.getItem!=='function')return null;
  try{
    let supplied=null;
    if(typeof hash==='string'&&hash.startsWith(PREFIX))supplied=decodeRecord(hash);
    else if(typeof hash==='string'&&hash.includes('alpha-e04-e05='))return null;
    else supplied=parseJson(storage.getItem(ALPHA_HANDOFF_KEY));
    const stored=parseJson(storage.getItem(ALPHA_HANDOFF_KEY));
    if(!validRecordShape(supplied)||!validRecordShape(stored)||!same(supplied,stored))return null;
    const current=currentReplay(storage);
    if(!current)return null;
    const expected=recordFor(current);
    if(!same(supplied,expected))return null;
    return {record:clone(expected),chronicle:clone(current.chronicle),mode:'noncanonical_alpha_paper'};
  }catch{return null;}
}
