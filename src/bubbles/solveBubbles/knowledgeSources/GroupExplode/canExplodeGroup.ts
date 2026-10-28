import { Bubble } from "../../../Bubble";
import { BubbleLink } from "../../../BubbleLink";
import { isComplexNode } from "../../solveUtils/isComplexNode";
import { freeValency } from "../../valency/freeValency";

export type GroupExplodRec = {
  extLink: BubbleLink;
  target: Bubble;
}

export const canExplodeGroup = (group: Bubble) => {
  if (!group.owner) return undefined;
  if (!isComplexNode(group)) return undefined;
  if (freeValency(group) !== 0) return undefined;
  for (let it of group.nested ?? []) {
    if (it.links?.find(({use}) => !use)) return undefined;
  }
  const result: GroupExplodRec[] = [];

  // todo: пока вариант попроще
  const connections: Record<number, number> = {}
  const localFreeValency = (bubble: Bubble): number => 
    freeValency(bubble) - (connections[bubble.id] ?? 0);

  
  for (const extLink of group.links ?? []) {
    if (extLink.use?.type !== "bond") {
      return undefined;
    }
    const {order} = extLink.use;
    const target = group.nested?.find((it) => localFreeValency(it) >= order);
    if (!target) return undefined;
    connections[target.id] = (connections[target.id] ?? 0) + order;
    result.push({extLink, target});
  }

  return result;
}