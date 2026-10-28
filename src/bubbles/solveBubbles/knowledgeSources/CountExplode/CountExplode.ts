import { recursiveAssumptions } from "../../Assumption/recursiveAssumptions";
import { KnowledgeSource } from "../../KnowledgeSource";
import { execCountExplode } from "./execCountExplode";
import { findCountExplode } from "./findCountExplode";

export const createCountExplode = (): KnowledgeSource => {
  return {
    name: "CountExplode",
    makeAssumptions(root) {
      return recursiveAssumptions(root, (bubble) => {
        const target = findCountExplode(bubble);
        return target && {
          type: "CountExplode",
          scope: bubble,
          apply() {
            execCountExplode(target);
          }
        }
      });
    },
  }
}