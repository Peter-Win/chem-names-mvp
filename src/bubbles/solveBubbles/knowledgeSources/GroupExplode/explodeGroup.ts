import { Bubble } from "../../../Bubble";
import { deleteBubble } from "../../../bubblesBase/deleteBubble";
import { GroupExplodRec } from "./canExplodeGroup";

export const explodeGroup = (group: Bubble, list: GroupExplodRec[]) => {
  const {owner} = group;
  if (!owner) return;

  list.forEach(({extLink, target}) => {
    if (extLink.bubbles[0] === group) {
      extLink.bubbles[0] = target;
    } else {
      extLink.bubbles[1] = target;
    }
    target.links = [...(target.links ?? []), extLink];
  });

  group.nested?.forEach(it => {
    it.owner = owner;
    owner.nested = [...(owner.nested ?? []), it];
  });

  group.links = undefined;
  group.nested = undefined;
  deleteBubble(group);
}