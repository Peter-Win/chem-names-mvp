import { Bubble } from "../../Bubble";
import { findBubble } from "../../bubblesBase/findBubble";

export const isBubblesSolved = (root: Bubble): boolean => {
  const res = findBubble(root, bubbleNotSolved);
  return !res;
}

export const bubbleNotSolved = ({use, links}: Bubble): boolean => {
  if (use.type === "root") return false;
  if (use.type === "atom") {
    // Для атома дополнительным условием является отсутствие неопределённых связей
    if (links?.find(({use}) => !use)) {
      return true
    }
    return false;
  }
  return true;
}

export const isNestedSolved = (group: Bubble): boolean =>
  !group?.nested?.find(it => !isBubblesSolved(it));