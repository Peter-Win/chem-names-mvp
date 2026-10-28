import { Bubble, BubbleRollback } from "../Bubble";
import { cloneBubbleContent, restoreBubbleContent } from "./cloneBubbleContent";

export const pushRollbackToBubble = (bubble: Bubble, action: BubbleRollback["action"]) => {
  bubble.rollback = bubble.rollback ?? [];
  bubble.rollback.push({
    content: cloneBubbleContent(bubble),
    action,
});
}

export const popRollbackFromBubble = (bubble: Bubble): BubbleRollback | undefined => {
  const rollback = bubble.rollback?.pop();
  if (rollback) {
    restoreBubbleContent(bubble, rollback.content);
    rollback.action();
  }
  return rollback;
}

export const bubbleHasRollback = (bubble: Bubble | undefined): boolean =>
  !! bubble?.rollback?.length;