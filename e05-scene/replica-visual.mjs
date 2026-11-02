// Visual projection of the existing E05 PAPER replica experiment.
// Coordinates come only from the authoring sandbox, never from real station art.
// This module cannot grant history, access, canonical events or unlocks.
import {BOARD,REPLICA,FEATURES,alignment} from '../engine/s01e05-authoring-prototype.mjs';

export const PAPER_GRID={width:5,height:4};
export function projectReplicaBoard(station){
  if(!station||!Array.isArray(station.inspected))return null;
  const orientation=station.orientation;
  if(orientation!==null&&!Object.hasOwn(REPLICA,orientation))return null;
  const checked=station.fit!==null;
  const comparison=orientation?alignment(orientation):null;
  const cells=[];
  for(let y=0;y<PAPER_GRID.height;y++){
    for(let x=0;x<PAPER_GRID.width;x++){
      const board=FEATURES.find(id=>BOARD[id].x===x&&BOARD[id].y===y)||null;
      const copy=orientation?
        FEATURES.find(id=>REPLICA[orientation][id].x===x&&REPLICA[orientation][id].y===y)||null:null;
      cells.push({x,y,board,copy,overlap:!!board&&board===copy,
        inspected:board?station.inspected.includes(board):false});
    }
  }
  return {cells,orientation,checked,fit:station.fit,
    matches:comparison?comparison.checks.filter(c=>c.fits).length:0,
    mismatches:comparison?comparison.checks.filter(c=>!c.fits).length:0};
}
