import { Bubble } from "../../../Bubble";
import { deleteBubble } from "../../../bubblesBase/deleteBubble";

export const solveMononuclearHydride = (atom: Bubble, h: Bubble) => {
  if (h.use.type === "atom" && atom.use.type === "atom") {
    const count = h.use.count ?? 1;
    atom.use.H = (atom.use.H ?? 0) + count;
    deleteBubble(h);
  }
}