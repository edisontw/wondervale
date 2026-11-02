// E05 PAPER floor projection. Only the existing synthetic station-table model is authoritative.
// This is not surveyed geometry, a right of entry, or a production pathfinding surface.
import {TABLES,WALKWAY,TABLE_POSITIONS,corridorClear} from '../engine/s01e05-authoring-prototype.mjs';
export const PAPER_FLOOR=Object.freeze({width:5,height:4});
const inside=(x,y,rect)=>!!rect&&x>=rect.x&&x<rect.x+rect.w&&y>=rect.y&&y<rect.y+rect.h;
export function projectMapRoomLayout(station){
  if(!station||typeof station!=='object')return null;
  const position=station.table??null;
  if(position!==null&&!TABLE_POSITIONS.includes(position))return null;
  const table=position===null?null:TABLES[position];
  const cells=[];
  for(let y=0;y<PAPER_FLOOR.height;y++)for(let x=0;x<PAPER_FLOOR.width;x++){
    const walkway=inside(x,y,WALKWAY),occupied=inside(x,y,table);
    cells.push({x,y,walkway,occupied,blocked:walkway&&occupied,
      option:x===0&&y===1?'near-wall':x===3&&y===1?'across-walkway':null,
      endpoint:x===4&&y===0?'EXIT':x===4&&y===3?'ENTRY':null});
  }
  return {position,clear:position===null?null:corridorClear(position),
    ready:station.mapRoom===true,cells,
    walkwayCells:cells.filter(c=>c.walkway).length,
    tableCells:cells.filter(c=>c.occupied).length,
    blockedCells:cells.filter(c=>c.blocked).length};
}
