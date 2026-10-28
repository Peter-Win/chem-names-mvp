import { Bubble } from "../../../Bubble";
import { appendBubble } from "../../../bubblesBase/appendBubble";
import { createBubble } from "../../../bubblesBase/createBubble";
import { getLinkEnd } from "../../../bubblesBase/getLinkEnd";
import { linkBubbles } from "../../../bubblesBase/linkBubbles";
import { unlinkBubbles } from "../../../bubblesBase/unlinkBubbles";

export const execCountExplode = (bubble: Bubble) => {
  const {use, owner} = bubble;
  if (owner && "count" in use) {
    const firstPos = owner.nested?.indexOf(bubble) ?? -1;
    if (firstPos >= 0) {
      const n = use.count ?? 1;
      const nextBubble = owner.nested?.[firstPos + 1];
      const nextLink = nextBubble && bubble.links?.find(link => getLinkEnd(link, bubble) === nextBubble);
      if (nextLink) {
        unlinkBubbles(bubble, nextBubble);
      }
      use.count = undefined;
      let prev = bubble;
      for (let i=1; i<n; i++) {
        const newBubble = clone(bubble);
        appendBubble(owner, newBubble, firstPos + i);
        linkBubbles(prev, newBubble);
        prev = newBubble;
      }
      if (nextLink) {
        linkBubbles(prev, nextBubble);
      }
    }
  }
}

const clone = (bubble: Bubble): Bubble => {
  const {use} = bubble;
  if (use.type === "atom") {
    return createBubble({...use});
  }
  throw Error(`Can't clone bubble with type=${use.type}`);
}