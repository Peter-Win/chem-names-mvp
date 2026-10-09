import { Bubble } from "../Bubble";
import { BubbleLink, BubbleLinkType } from "../BubbleLink";

export const linkBubbles = (a: Bubble, b: Bubble, use?: BubbleLinkType): BubbleLink => {
  const link: BubbleLink = {
    bubbles: [a, b],
    use,
  }
  appendLink(a, link);
  appendLink(b, link);
  return link;
}

const appendLink = (bubble: Bubble, link: BubbleLink) => {
  bubble.links = bubble.links ?? [];
  bubble.links.push(link);
}