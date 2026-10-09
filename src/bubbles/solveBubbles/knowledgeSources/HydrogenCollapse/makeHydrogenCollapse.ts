import { Bubble } from "../../../Bubble";
import { deleteBubble } from "../../../bubblesBase/deleteBubble";

/**
 * 
 *     hydrogen            target                     target
 *  ┌─atom──────────┐    ┌─atom──────┐              ┌─atom────────┐
 *  │ id=H, count=N ├────┤ id≠H, H=x ├──...  ==>    │ id≠H, H=x+N ├──...
 *  └───────────────┘    └───────────┘              └─────────────┘
 *  
 * @param hydrogen 
 * @param target 
 */

export const makeHydrogenCollapse = (hydrogen: Bubble, target: Bubble) => {
  // предполагается, что все проверки правильности выполнены в checkToSingleHydrogenBubble
  const count = (hydrogen.use.type === "atom") ? hydrogen.use.count ?? 1 : 0;
  if (target.use.type === "atom") {
    target.use.H = (target.use.H ?? 0) + count;
  }
  deleteBubble(hydrogen);
}