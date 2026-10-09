import { Bubble } from "../Bubble";
import { BubbleType } from "../BubbleType";
import { appendBubble } from "./appendBubble";

export const createBubble = (use: BubbleType, owner?: Bubble, id?: number): Bubble => {
  const result: Bubble = {use, id: id ?? nextId++};
  if (owner) {
    appendBubble(owner, result);
  }
  return result;
};

let nextId = 1;