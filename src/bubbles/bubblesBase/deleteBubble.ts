import { Bubble } from "../Bubble";
import { unlinkBubbles } from "./unlinkBubbles";

export const deleteBubble = (bubble: Bubble) => {
  const {owner} = bubble;
  if (owner) {
    bubble.owner = undefined;
    const {links} = bubble;
    if (links) {
      [...links].forEach(({bubbles: [a, b]}, i) => {
        unlinkBubbles(a, b);
      });
    }
    bubble.links = undefined;
    const {nested} = owner;
    if (nested) {
      const pos = nested.indexOf(bubble);
      if (pos >=0) nested.splice(pos, 1);
    }
  }
}