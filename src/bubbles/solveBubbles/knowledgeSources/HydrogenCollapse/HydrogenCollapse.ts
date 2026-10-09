import { forEachBubble } from "../../../bubblesBase/forEachBubble";
import { Assumption } from "../../Assumption/Assumption";
import { KnowledgeSource } from "../../KnowledgeSource";
import { checkToSingleHydrogenBubble } from "./checkToSingleHydrogenBubble";
import { makeHydrogenCollapse } from "./makeHydrogenCollapse";

export const createHydrogenCollapse = (): KnowledgeSource => {
  return {
    name: "HydrogenCollapse",
    makeAssumptions(root) {
      const result: Assumption[] = [];
      forEachBubble(root, bubble => {
        const scope = bubble.owner;
        const target = checkToSingleHydrogenBubble(bubble);
        if (target && scope) {
          result.push({
            type: "HydrogenCollapse",
            scope,
            apply() {
              makeHydrogenCollapse(bubble, target);
            },
          })
        }
      })
      return result;
    },
  }
}
