import { Bubble } from "../Bubble";
import { getLinkEnd } from "./getLinkEnd";

export const stringifyBubble = (bubble: Bubble): string => {
  if (bubble.use.type === "root") {
    return stringifyBubblesList(bubble.nested);
  }
  let result = "";
  result += `${bubble.owner?.nested?.indexOf(bubble)}:`;
  const {use} = bubble;
  if (use.type === "atom") {
    result += use.atom.id;
    if (use.H) {
      result += `(${use.H !== 1 ? use.H : ""}H)`
    }
  } else {
    result += `[${stringifyBubblesList(bubble.nested)}]`;
  }
  if (use.count && use.count !== 1) {
    result += String(use.count);
  }
  if (use.charge) {
    result += `^${use.charge}`;
  }
  const links = bubble.links?.map(link => {
    const end = getLinkEnd(link, bubble);
    const i = bubble.owner?.nested?.indexOf(end!) ?? -1;
    return {i, link};
  }) ?? [];
  links.sort((a, b) => a.i - b.i);
  links.forEach(({link, i}) => {
    result += "{";
    if (!link.use) {
      result += "~";
    } else if (link.use.type === "bond") {
      switch (link.use.order) {
        case 2: 
          result += "=";
          break;
        case 3:
          result += "%";
          break;
        default:
          result += "-";
      }
    }
    result += String(i);
    result += "}";
  })
  return result;
}

const stringifyBubblesList = (list: Bubble[] | undefined): string =>
  (list ?? []).map(b => stringifyBubble(b)).join("; ");