import { Bubble } from "../Bubble";

export const forEachBubble = (where: Bubble, callback: (current: Bubble) => void) => {
  callback(where);
  where.nested?.forEach(current => {
    forEachBubble(current, callback);
  })
}