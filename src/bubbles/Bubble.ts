import { BubbleLink } from "./BubbleLink";
import { BubbleType } from "./BubbleType";

export type BubbleContent = Bubble[] | undefined;

export type BubbleRollback = {
  content: BubbleContent;
  action: () => void;
}

export type Bubble = {
  id: number;
  use: BubbleType;
  owner?: Bubble;
  nested?: Bubble[]; 
  links?: BubbleLink[];
  rollback?: BubbleRollback[];
}