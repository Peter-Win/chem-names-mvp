import { BubbleLink } from "./BubbleLink";
import { BubbleType } from "./BubbleType";

export type BubbleRollback = () => void;

export type Bubble = {
  id: number;
  use: BubbleType;
  owner?: Bubble;
  nested?: Bubble[]; 
  links?: BubbleLink[];
  rollback?: BubbleRollback[];
}