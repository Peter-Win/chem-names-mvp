import { Bubble } from "../../../Bubble";
import { getLinkEnd } from "../../../bubblesBase/getLinkEnd";

export const checkMononuclearHydride = (bubble: Bubble) => {
  if (bubble.use.type !== "group") return undefined;
  if (bubble.nested?.length !== 2) return undefined;
  const [a, b] = bubble.nested;
  if (a?.links?.length !== 1) return undefined;
  const aLink = a.links[0];
  if (b?.links?.length !== 1) return undefined;
  const bLink = b.links[0];
  if (!aLink || !bLink) return undefined;
  if (aLink.use || bLink.use) return undefined;
  if (getLinkEnd(aLink, a) !== b) return undefined;
  if (getLinkEnd(bLink, b) !== a) return undefined;
  
  if (a?.use.type !== "atom") return undefined;
  if (b?.use.type !== "atom") return undefined;
  const aH = a.use.atom.id === "H";
  const bH = b.use.atom.id === "H";
  let h, e: Bubble;
  if (aH && !bH) {
    h = a;
    e = b;
  } else if (!aH && bH) {
    h = b;
    e = a;
  } else {
    return undefined;
  }
  if (h.use.type === "atom") {
    if (h.use.charge || h.use.mass !== undefined) return undefined;
  }
  return {h, e}
}