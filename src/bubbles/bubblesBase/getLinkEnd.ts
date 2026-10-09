import { Bubble } from "../Bubble";
import { BubbleLink } from "../BubbleLink";

export const getLinkEnd = ({bubbles: [from, to]}: BubbleLink, begin: Bubble): Bubble | undefined => {
  if (begin === from) return to;
  if (begin === to) return from;
  return undefined; 
}