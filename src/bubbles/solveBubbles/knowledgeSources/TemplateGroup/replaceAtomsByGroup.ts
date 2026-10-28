import { Bubble } from "../../../Bubble";
import { appendBubble } from "../../../bubblesBase/appendBubble";
import { deleteBubble } from "../../../bubblesBase/deleteBubble";
import { linkBubbles } from "../../../bubblesBase/linkBubbles";

export const replaceAtomsByGroup = (atoms: Bubble[], group: Bubble) => {
  const first = atoms[0];
  if (!first) return;
  const {owner} = first;
  if (!owner) return;
  const pos = owner.nested?.indexOf(first) ?? -1;
  if (pos < 0) return;

  const nearBubbles = new Set<Bubble>();
  const add = (b: Bubble) => {
    if (!atoms.includes(b)) nearBubbles.add(b);
  }
  atoms.forEach(({links}) => {
    links?.forEach(({bubbles: [a, b], use}) => {
      if (!use) {
        add(a);
        add(b);
      }
    })
  })

  atoms.forEach(atom => deleteBubble(atom));
  appendBubble(owner, group, pos);

  // сохранение неопределённых связей помогает быстро понять, решен пузырь или нет
  Array.from(nearBubbles).forEach(near => linkBubbles(near, group));
}