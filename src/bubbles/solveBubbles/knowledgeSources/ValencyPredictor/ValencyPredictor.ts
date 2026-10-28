import { recursiveAssumptions } from "../../Assumption/recursiveAssumptions";
import { KnowledgeSource } from "../../KnowledgeSource";
import { valencyForBubble } from "./valencyForBubble";

export const createValencyPredictor = (): KnowledgeSource => {
  return {
    name: "ValencyPredictor",
    makeAssumptions(root) {
      return recursiveAssumptions(root, bubble => {
        const res = valencyForBubble(bubble);
        if (!res) return;
        const {item, valency} = res;
        // TODO: пока упрощённая версия, без перебора вариантов
        return (typeof valency === "number") ? {
          type: "ValencyPredictor",
          scope: bubble,
          apply() {
            if (item.use.type === "atom") {
              item.use.valency = valency;
            }
          },
        } : undefined;        
      });
    },
  }
}