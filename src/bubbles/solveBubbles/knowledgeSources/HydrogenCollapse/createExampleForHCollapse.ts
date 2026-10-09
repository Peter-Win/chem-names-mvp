import { PeriodicTable } from "charchem2/core/PeriodicTable";
import { createBubble } from "../../../bubblesBase/createBubble"
import { BubbleAtom } from "../../../BubbleType";
import { linkBubbles } from "../../../bubblesBase/linkBubbles";

/**
 * +------------root-------------+
 * |  +-atom-+         +-atom-+  |
 * |  |  H   |---------|  Cl  |  |
 * |  +------+         +------+  |
 * +-----------------------------+
 */
export const createExampleForHCollapse = (p?:{
  useH?: Partial<BubbleAtom>
}) => {
  const {dict} = PeriodicTable;
  const root = createBubble({type: "root"});
  const h = createBubble({type: "atom", atom: dict.H, valency: 1, ...(p?.useH)}, root);
  const cl = createBubble({type: "atom", atom: dict.Cl, valency: 1}, root);
  const link = linkBubbles(h, cl, {type: "bond", order: 1});
  return {root, h, cl, link};
}
