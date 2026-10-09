import { Bubble } from "../Bubble";
import { BubbleLink } from "../BubbleLink";
import { createBubble } from "./createBubble";

//  +-------------------+
//  |   node            |..............> old
//  +-------------------+
//   ^        ^       ^
//   |        |       |
// +---+    +---+    +-------+
// | A |<-->| B |<-->| group |.........> new
// +---+    +---+    +-------+
//                     ^
//                     |
//                    item .............> old

export type BubbleContent = Bubble[] | undefined;

export const cloneBubbleContent = (bubble: Bubble): BubbleContent => {
  const dstMap: Record<number, Bubble> = {};
  const toDst = (src: Bubble): Bubble => dstMap[src.id] ?? src; 
  const result = bubble.nested?.map(({id, use, owner, rollback, links, nested}) => {
    const dstItem: Bubble = createBubble({...use}, undefined, id);
    dstItem.owner = owner;
    dstItem.rollback = rollback;
    dstItem.nested = nested;
    dstMap[id] = dstItem;
    return [dstItem, links] as const;
  }).map(([dstItem, links]) => ({
    ...dstItem,
    links: links?.map(({bubbles: [a, b], ...rest}: BubbleLink) => ({
      ...rest,
      bubbles: [toDst(a), toDst(b)],
    })),
  } satisfies Bubble));
  return result;
}

export const restoreBubbleContent = (bubble: Bubble, content: BubbleContent) => {
  bubble.nested = content;
}