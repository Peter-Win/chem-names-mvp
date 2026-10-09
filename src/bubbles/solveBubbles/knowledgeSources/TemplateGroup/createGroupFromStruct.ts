import { PeriodicTable } from "charchem2/core/PeriodicTable";
import { Bubble } from "../../../Bubble";
import { createBubble } from "../../../bubblesBase/createBubble";
import { DstTargetStruct } from "./DstTemplate";
import { linkBubbles } from "../../../bubblesBase/linkBubbles";

export const createGroupFromStruct = (struct: DstTargetStruct, owner?: Bubble): Bubble => {
  const group = createBubble({
    type: "group",
    label: struct.code,
  }, owner);
  const {dict} = PeriodicTable;
  const atoms: Bubble[] = struct.atoms.map(
    ({id, ...rest}) => createBubble({type: "atom", atom: dict[id], ...rest}, group)
  );
  struct.links?.forEach(([i, j, order]) => {
    const a = atoms[i];
    const b = atoms[j];
    if (a && b) {
      linkBubbles(a, b, {type: "bond", order});
    }
  });
  return group;
}