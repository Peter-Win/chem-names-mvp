import { compile } from "charchem2/compiler/compile";
import { Bubble } from "../../Bubble";
import { buildBubble } from "../../buildBubble";
import { ElementId } from "charchem2/types/ElementId";

export const makeTestNode = (code: string): Bubble => {
  const expr = compile(code);
  const root = buildBubble(expr);
  return root.nested?.[0]!
}

export const makeTestNodeLoc = (code: string): Bubble => {
  const node = makeTestNode(code);
  node.nested?.forEach(({use}) => {
    if (use.type === "atom") {
      use.valency = localValencyDict[use.atom.id as ElementId];
    }
  });
  return node;
}

const localValencyDict: Partial<Record<ElementId, number>> = {
  H: 1,
  O: 2,
  C: 4,
  Cl: 1,
  F: 1,
  Br: 1,
  B: 3,
}
