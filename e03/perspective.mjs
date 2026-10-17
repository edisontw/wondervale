// Shared E03 view-only depth sizing. Derived from the M1 owner-PASS actor review.
// This is not a route/collision model and contains no foreground mask geometry.
export const spriteBox={x:60,y:0,width:490,height:990};
export function actorHeight([,y]){
 return Math.max(88,Math.min(156,88+(y-210)*68/446));
}
