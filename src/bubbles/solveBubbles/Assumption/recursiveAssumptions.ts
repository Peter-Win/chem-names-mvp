import { Bubble } from "../../Bubble";
import { forEachBubble } from "../../bubblesBase/forEachBubble";
import { Assumption } from "./Assumption";

type SingleAssumption = (bubble: Bubble) => Assumption | undefined;

export const recursiveAssumptions = (root: Bubble, onBubble: SingleAssumption): Assumption[] => {
  const result: Assumption[] = [];
  forEachBubble(root, bubble => {
    const assumption = onBubble(bubble);
    if (assumption) result.push(assumption);
  });
  return result;
}