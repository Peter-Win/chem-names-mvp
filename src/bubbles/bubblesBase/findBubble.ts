import { Bubble } from "../Bubble";

export const findBubble = (where: Bubble, callback: (bubble: Bubble) => boolean): Bubble | undefined => {
  if (callback(where)) {
    return where;
  }
  const {nested} = where;
  if (nested) {
    for (let item of nested) {
      const res = findBubble(item, callback);
      if (res) {
        return res;
      }
    }
  }
  return undefined;
} 