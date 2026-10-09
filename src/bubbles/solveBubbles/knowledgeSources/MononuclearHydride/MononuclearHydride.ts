import { forEachBubble } from "../../../bubblesBase/forEachBubble";
import { Assumption } from "../../Assumption/Assumption";
import { KnowledgeSource } from "../../KnowledgeSource";
import { checkMononuclearHydride } from "./checkMononuclearHydride";
import { solveMononuclearHydride } from "./solveMononuclearHydride";

export const createMononuclearHydride = (): KnowledgeSource => {
  return {
    name: "MononuclearHydride",
    makeAssumptions(root) {
      const assumptions: Assumption[] = [];
      forEachBubble(root, (bubble) => {
        const res = checkMononuclearHydride(bubble);
        if (res) {
          assumptions.push({
            type: "MononuclearHydride",
            scope: bubble,
            apply() {
              solveMononuclearHydride(res.e, res.h);
            }
          })
        }
      })
      return assumptions;
    },
  }
}