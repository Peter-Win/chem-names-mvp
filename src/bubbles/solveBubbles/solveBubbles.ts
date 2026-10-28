import { Bubble } from "../Bubble";
import { stringifyBubble } from "../bubblesBase/stringifyBubble";
import { Assumption } from "./Assumption/Assumption";
import { assumptionWeights } from "./Assumption/assumptionWeights";
import { KnowledgeSource } from "./KnowledgeSource";
import { allKnowledgeSources } from "./knowledgeSources/allKnowledgeSources";
import { isBubblesSolved } from "./solveUtils/isBubblesSolved";

type SolveBubblesOptions = {

}

/**
 * Главная функция для решения пузыря
 * @param root IN/OUT Система пузырей мутирует. При успешном решении она же является результатом.
 * @param options 
 * @returns true, если решение успешно
 */
export const solveBubbles = (root: Bubble, options?: SolveBubblesOptions): boolean => {
  try {
    const knowledgeSources = allKnowledgeSources();
    return solveBubblesExt({...options, root, knowledgeSources});
  } catch (_) {
    // todo: позже ошибку можно будет засунуть в лог
    return false;
  }
}

type SolveBubblesSystem = SolveBubblesOptions & {
  root: Bubble;
  knowledgeSources: KnowledgeSource[];
}

export const solveBubblesExt = ({
  root, knowledgeSources
}: SolveBubblesSystem) => {
  // критерием окончания является отсутствие активности.
  // цикл выполняется хотя бы один раз.
  for (;;) {
    let hasActivity = false;
    const cmdByScope: Record<number, Assumption> = {}
    knowledgeSources.forEach(ks => {
      const assumptions = ks.makeAssumptions(root);
      hasActivity = hasActivity || assumptions.length > 0;
      assumptions.forEach(cmd => {
        updateCmdByScope(cmdByScope, cmd);
      });
    })
    if (!hasActivity) {
      break;
    }
    Object.values(cmdByScope).forEach(cmd => {
      cmd.apply();
      // console.log(cmd.type, ">", stringifyBubble(cmd.scope));
    })
  }
  return isBubblesSolved(root);
}

const updateCmdByScope = (cmdByScope: Record<number, Assumption>, cmd: Assumption) => {
  const {id} = cmd.scope;
  const oldCmd = cmdByScope[id];
  if (!oldCmd) {
    cmdByScope[id] = cmd;
    return;
  }
  const oldWeight = assumptionWeights[oldCmd.type];
  const newWeight = assumptionWeights[cmd.type];
  if (newWeight < oldWeight) {
    cmdByScope[id] = cmd;
  }
}