import { forEachBubble } from "../../../bubblesBase/forEachBubble";
import { Assumption } from "../../Assumption/Assumption";
import { KnowledgeSource } from "../../KnowledgeSource";
import { canExplodeGroup } from "./canExplodeGroup";
import { explodeGroup } from "./explodeGroup";

export const createGroupExplode = (): KnowledgeSource => {
  return {
    name: "GroupExplode",
    makeAssumptions(root) {
      const assumptions: Assumption[] = [];
      forEachBubble(root, (bubble) => {
        const res = canExplodeGroup(bubble);
        if (res) {
          assumptions.push({
            type: "GroupExplode",
            scope: bubble,
            apply() {
              explodeGroup(bubble, res);
            },
          })
        }
      })
      return assumptions;
    },
  }
}