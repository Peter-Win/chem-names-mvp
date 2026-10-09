import { forEachBubble } from "../../../bubblesBase/forEachBubble";
import { Assumption } from "../../Assumption/Assumption";
import { KnowledgeSource } from "../../KnowledgeSource";
import { changeToSingleAtom } from "./changeToSingleAtom";
import { getSingleAtom } from "./getSingleAtom";

export const createSingleAtom = (): KnowledgeSource => {
  return {
    name: "SingleAtom",
    makeAssumptions(root) {
      const result: Assumption[] = [];
      forEachBubble(root, (bubble) => {
        const single = getSingleAtom(bubble);
        if (single) {
          result.push({
            type: "SingleAtom",
            scope: bubble,
            apply: () => {
              changeToSingleAtom(bubble, single);
            }
          })
        }
      })
      return result;
    },
  }
}
