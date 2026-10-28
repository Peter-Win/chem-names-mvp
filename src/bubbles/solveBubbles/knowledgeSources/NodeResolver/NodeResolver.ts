import { Bubble } from "../../../Bubble";
import { pushRollbackToBubble } from "../../../bubblesBase/bubbleRollbackActions";
import { stringifyBubble } from "../../../bubblesBase/stringifyBubble";
import { recursiveAssumptions } from "../../Assumption/recursiveAssumptions";
import { KnowledgeSource } from "../../KnowledgeSource";
import { execComplexNodeRes } from "./execComplexNodeRes";
import { resolveComplexBubble } from "./resolveComplexBubble";

export const createNodeResolver = (): KnowledgeSource => {
  return {
    name: "NodeResolver",
    makeAssumptions(root) {
      return recursiveAssumptions(root, (bubble) => {
        const res = resolveComplexBubble(bubble);
        return res ? {
            type: "NodeResolver",
            scope: bubble,
            apply: () => {
              if (res.alt) {
                // нужно сохранить индексы. потому что после клонирования экземпляры будут другие. 
                // но их положение в списке владельца будет такое же.
                const mainIndex = indexOf(bubble, res.main);
                const altIndex = indexOf(bubble, res.alt);
                if (mainIndex >= 0 && altIndex >= 0) {
                  pushRollbackToBubble(bubble, () => {
                    const main = bubble.nested?.[mainIndex];
                    const slave = bubble.nested?.[altIndex];
                    if (main && slave) {
                      execComplexNodeRes({main, slave});
                    }
                  })
                }
              }
              execComplexNodeRes(res);
            }
        } : undefined;
      });
    },
  }
}

const indexOf = (owner: Bubble, item: Bubble): number =>
  owner.nested?.indexOf(item) ?? -1;