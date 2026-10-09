import { Bubble } from "../../../Bubble";
import { getLinkEnd } from "../../../bubblesBase/getLinkEnd";

export const checkToSingleHydrogenBubble = (bubble: Bubble): Bubble | undefined => {
  const {use, links} = bubble;
  if (use.type !== "atom") return undefined;
  if (use.atom.id !== "H") return undefined;
  if (use.charge !== undefined || use.mass !== undefined) return undefined;
  if (links?.length !== 1) return undefined;
  const link = links[0];
  if (link?.use?.type !== "bond") return undefined;
  if (link.use.order !== 1) return undefined;
  const target = getLinkEnd(link, bubble);
  if (target?.use.type !== "atom") return undefined;
  if (target.use.atom.id === "H") return undefined; 
  return target;
}

