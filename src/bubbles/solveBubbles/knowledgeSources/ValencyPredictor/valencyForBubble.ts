import { Bubble } from "../../../Bubble";
import { isComplexNode } from "../../solveUtils/isComplexNode";
import { valencyDictionary, ValencyDictKey } from "./valencyDictionary";

export const valencyForBubble = (bubble: Bubble) => {
  if (!isComplexNode(bubble)) return undefined;
  for (let item of bubble.nested ?? []) {
    if (item.use.type === "atom" && item.use.valency === undefined) {
      const valency = valencyDictionary[item.use.atom.id as ValencyDictKey];
      // тут отсеиваются не только undefined, но и 0. 
      // Потому что внутри сложных узлов не может быть элементов с нулевой валентностью.
      if (valency) {
        return {item, valency}
      }
    }
  }
  return undefined;
}