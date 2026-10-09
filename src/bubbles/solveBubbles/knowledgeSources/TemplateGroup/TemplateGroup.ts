import { forEachBubble } from "../../../bubblesBase/forEachBubble";
import { Assumption } from "../../Assumption/Assumption";
import { KnowledgeSource } from "../../KnowledgeSource";
import { isComplexNode } from "../../solveUtils/isComplexNode";
import { createGroupFromStruct } from "./createGroupFromStruct";
import { findTemplateInGroup } from "./findTemplateInGroup";
import { replaceAtomsByGroup } from "./replaceAtomsByGroup";

export const createTemplateGroup = (): KnowledgeSource => {
  const ignore = new Set<number>();
  return {
    name: "TemplateGroup",
    makeAssumptions(root) {
      const assumptions: Assumption[] = [];
      forEachBubble(root, (bubble) => {
        // так как проверка пузыря тут является довольно тяжелой операцией, то с целью оптимизации
        // в чёрный список заносятся те, кого больше проверять не надо
        const {owner} = bubble;
        if (!owner) return;
        if (ignore.has(bubble.id)) return;
        if (!isComplexNode(bubble)) {
          ignore.add(bubble.id);
          return;
        }
        const res = findTemplateInGroup(bubble);
        if (!res) {
          ignore.add(bubble.id);
          return;
        }
        assumptions.push({
          type: "TemplateGroup",
          scope: owner,
          apply() {
            const newGroup = createGroupFromStruct(res.tm.struct);
            replaceAtomsByGroup(res.atoms, newGroup);
          },
        })
      })
      return assumptions;
    },
  }
}