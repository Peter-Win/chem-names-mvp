import { PeriodicTable } from "charchem2/core/PeriodicTable";
import { createBubble } from "../../../bubblesBase/createBubble";
import { linkBubbles } from "../../../bubblesBase/linkBubbles";
import { internalValency } from "../../valency/internalValency";
import { freeValency } from "../../valency/freeValency";
import { explodeGroup } from "./explodeGroup";

describe("explodeGroup", () => {
  const {dict} = PeriodicTable;
  
  it("explode KHSO3", () => {
    const root = createBubble({type: "root"});
    const k = createBubble({type: "atom", atom: dict.K, valency: 1}, root);
    const h = createBubble({type: "atom", atom: dict.H, valency: 1}, root);
    const group = createBubble({type: "group"}, root);
    const linkK = linkBubbles(k, group, {type: "bond", order: 1});
    const linkH = linkBubbles(h, group, {type: "bond", order: 1});

    const s = createBubble({type: "atom", atom: dict.S, valency: 4}, group);
    const o1 = createBubble({type: "atom", atom: dict.O, valency: 2}, group);
    const o2 = createBubble({type: "atom", atom: dict.O, valency: 2}, group);
    const oDbl = createBubble({type: "atom", atom: dict.O, valency: 2}, group);
    linkBubbles(s, o1, {type: "bond", order: 1});
    linkBubbles(s, o2, {type: "bond", order: 1});
    linkBubbles(s, oDbl, {type: "bond", order: 2});

    expect(root.nested?.length).toBe(3);
    expect(group.nested?.length).toBe(4);
    expect(internalValency(group)).toBe(2);
    expect(freeValency(group)).toBe(0);
    expect(freeValency(o1)).toBe(1);
    expect(freeValency(o2)).toBe(1);

    explodeGroup(group, [
      {extLink: linkK, target: o1},
      {extLink: linkH, target: o2},
    ]);
    expect(root.nested?.length).toBe(6);
    expect(linkK.bubbles[1].use).toHaveProperty("atom.id", "O");
    expect(linkH.bubbles[1].use).toHaveProperty("atom.id", "O");
    expect(freeValency(o1)).toBe(0);
    expect(freeValency(o2)).toBe(0);
  });
})