import { Bubble } from "./Bubble"

export type BubbleLinkBond = {
  type: "bond";
  order: number;
}

export type BubbleLinkType = BubbleLinkBond;

export type BubbleLink = {
  bubbles: [Bubble, Bubble];
  use?: BubbleLinkType;
}