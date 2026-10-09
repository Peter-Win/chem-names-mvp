import { Bubble } from "../../../Bubble";
import { deleteBubble } from "../../../bubblesBase/deleteBubble";
import { externalValency } from "../../valency/externalValency";

/**
 *   ┌─group─────[+]─┐
 *   │ ┌─atom──────┐ │               ┌─atom──[+]─┐
 * ──┤ │ V=?       │ ├──    ==>    ──┤ V=2       ├──
 *   │ └───────────┘ │               └───────────┘
 *   └───────────────┘
 * @param group 
 * @param singleAtom 
 */
export const changeToSingleAtom = (group: Bubble, singleAtom: Bubble) => {
  // предыдущие проверки должны гарантировать count=1 для группы и для атома
  const charge: number | undefined = group.use.type === "group" ? group.use.charge : undefined; 
  group.use = singleAtom.use;
  deleteBubble(singleAtom); 
  group.nested = undefined;

  if (group.use.type === "atom") {
    group.use.charge = charge;
    group.use.valency = externalValency(group);
  }
}