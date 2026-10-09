import { Bubble } from "../../../Bubble";
import { DstAtomDef, DstTemplate } from "./DstTemplate";

export const matchTemplateInGroup = (node: Bubble, {pos, def, mirror}: DstTemplate): Bubble[] | undefined => {
  // если точно следовать концепции, то нужно было бы доставать из списка атомы, связанные неопределёнными связями.
  // но чтобы не тратить впустую производительность, считаем что атомы в списке идут в нужном порядке

  // если размер шаблона больше, чем размер узла, то искать нет смысла
  const {nested} = node;
  if (!nested || nested.length < def.length) {
    return undefined;
  }

  const makeResult = (startPos: number): Bubble[] =>
    nested.slice(startPos, startPos + def.length);

  const checkPos: number[] = [];
  if (pos === "any") {
    const end = nested.length - def.length + 1;
    for (let i=0; i < end; i++) {
      checkPos.push(i);
    }
  } else if (pos === "edge") {
    checkPos.push(0);
    checkPos.push(nested.length - def.length);
  } else if (pos === "end") {
    checkPos.push(nested.length - def.length);
  } else if (pos === "begin") {
    checkPos.push(0);
  }

  for (let start of checkPos) {
    if (matchItem(nested, def, start)) {
      return makeResult(start);
    }
    if (mirror && matchItemReverse(nested, def, start)) {
      return makeResult(start);
    }
  }

  return undefined;
}

const eq = ({use}: Bubble, def: DstAtomDef): boolean => {
  if (use.type !== "atom") return false;
  if (use.atom.id !== def.id) return false;
  return use.count === def.count;
}

const matchItem = (content: Bubble[], need: DstAtomDef[], start: number): boolean => {
  for (let i=0; i<need.length; i++) {
    if (!eq(content[start + i]!, need[i]!)) return false;
  }
  return true;
}

const matchItemReverse = (content: Bubble[], need: DstAtomDef[], start: number) => {
  const n = need.length;
  for (let i=0; i<n; i++) {
    if (!eq(content[start + i]!, need[n-i-1]!)) return false;
  }
  return true;
}