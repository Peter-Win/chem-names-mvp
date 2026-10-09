import { Bubble } from "../../../Bubble";
import { appendBubble } from "../../../bubblesBase/appendBubble";
import { deleteBubble } from "../../../bubblesBase/deleteBubble";

export const replaceAtomsByGroup = (atoms: Bubble[], group: Bubble) => {
  const first = atoms[0];
  if (!first) return;
  const {owner} = first;
  if (!owner) return;
  const pos = owner.nested?.indexOf(first) ?? -1;
  if (pos < 0) return;
  atoms.forEach(atom => deleteBubble(atom));
  appendBubble(owner, group, pos);
}