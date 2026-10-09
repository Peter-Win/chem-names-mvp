import { Bubble } from "../Bubble";
import { BubbleLink } from "../BubbleLink";

export const unlinkBubbles = (a: Bubble, b: Bubble) => {
  const cmp = ({bubbles: [left, right]}: BubbleLink) => 
    (left === a && right === b) || (left === b && right === a);
  const deleteLink = ({links}: Bubble) => {
    if (links) {
      const pos = links.findIndex(cmp);
      if (pos >= 0) links.splice(pos, 1);
    }
  }
  deleteLink(a);
  deleteLink(b);
}