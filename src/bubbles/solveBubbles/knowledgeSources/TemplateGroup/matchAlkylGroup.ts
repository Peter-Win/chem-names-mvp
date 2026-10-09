import { ElementId } from "charchem2/types/ElementId";
import { Bubble } from "../../../Bubble";
import { DstStructAtomDef, DstTemplate } from "./DstTemplate";
import { LinkDef } from "./SrcTemplate";

/**
 * анализ алкильных групп любого размера типа CₙH₂ₙ₊₁
 */

export const matchAlkylGroup = (node: Bubble) => {
  const {nested} = node;
  if (!nested || nested.length < 2) return undefined;

  let res = test(nested, 0);
  if (!res && nested.length > 2) {
    res = test(nested, nested.length-2)
  }
  if (!res) return undefined;
  const [a0, a1, c, h] = res;

  const chain: DstStructAtomDef[] = [];
  const links: LinkDef[] = [];
  for (let i=0; i<c; i++) {
    if (i>0) links.push([i-1, i, 1]);
    chain.push({id: "C", valency: 4, H: i===c-1 ? 3 : 2})
  } 

  const atoms: Bubble[] = [a0, a1];
  const tm: DstTemplate = {
    mirror: true,
    pos: "edge",
    struct: {
      code: `C${c}H${h}`,
      atoms: chain,
      links,
    },
    def: [],
  };
  return {atoms, tm}
}

const test = (bubbles: Bubble[], pos: number) => {
  const a = bubbles[pos];
  const b = bubbles[pos + 1];
  const n1 = atomCount(a, "C");
  const m1 = atomCount(b, "H");
  if (n1 > 1 && n1*2+1 === m1) {
    return [a!, b!, n1, m1] as const;
  }
  const m2 = atomCount(a, "H");
  const n2 = atomCount(b, "C")
  if (n2 > 1 && n2*2+1 === m2) {
    return [b!, a!, n2, m2] as const;
  }
  return undefined;
}

const atomCount = (bubble: Bubble | undefined, id: ElementId): number => {
  if (!bubble) return 0;
  const {use} = bubble;
  if (use.type !== "atom") return 0; 
  if (use.atom.id !== id || use.H || use.mass || use.charge) return 0;
  return use.count ?? 1;
}