import { bubbleHasRollback, popRollbackFromBubble } from "../../../bubblesBase/bubbleRollbackActions";
import { recursiveAssumptions } from "../../Assumption/recursiveAssumptions";
import { KnowledgeSource } from "../../KnowledgeSource";

export const createRollback = (): KnowledgeSource => {
  return {
    name: "Rollback",
    makeAssumptions(root) {
      return recursiveAssumptions(root, (bubble) => {
        return bubbleHasRollback(bubble) ? {
          type: "Rollback",
          scope: bubble,
          apply: () => {
            popRollbackFromBubble(bubble);
          },
        } : undefined;
      })
    },
  }
}