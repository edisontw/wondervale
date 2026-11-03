// Isolated E07 PAPER trace walk: no canonical effects or site geometry claims.
import {evaluateLayout} from './s01e07-authoring-prototype.mjs';
export function traceFrames(snap,kind){
  const layout=evaluateLayout(snap);
  if(!layout||!['milo','resident','water'].includes(kind))return null;
  const trace=layout.traces[kind];
  const cells=trace.path;
  return Object.freeze(cells.map((cell,index)=>Object.freeze({
    cell,index,total:cells.length,blocked:kind!=='milo'&&trace.overlaps.includes(cell),
    caption:kind==='milo'?'Milo tries the model route.':
      kind==='resident'?'Another person needs this shared space.':
      'Water needs a clear channel.',
    source:'synthetic-model-only'
  })));
}
export function stepTrace(frames,index){
  if(!Array.isArray(frames)||!Number.isInteger(index)||index<0||index>=frames.length)return null;
  return frames[index];
}
