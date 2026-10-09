import { PeriodicTable } from "charchem2/core/PeriodicTable"
import { createBubble } from "../../bubblesBase/createBubble"
import { internalValency } from "./internalValency";
import { linkBubbles } from "../../bubblesBase/linkBubbles";

describe("internalValency", () => {
  const {dict} = PeriodicTable;

  it("atom", () => {
    const h = createBubble({type: "atom", atom: dict.H, valency: 1, count: 2});
    const c = createBubble({type: "atom", atom: dict.C, valency: 4});
    const o = createBubble({type: "atom", atom: dict.O, valency: 2});

    expect(internalValency(h)).toBe(1);
    expect(internalValency(c)).toBe(4);
    expect(internalValency(o)).toBe(2);
  })

  it("group", () => {
    // Phosphoric anion
    // (1)  --O
    //         \
    // (2) --O--P==O (4)
    //         /
    // (3)  --O
    const group = createBubble({type: "group"});
    const p = createBubble({type: "atom", atom: dict.P, valency: 5}, group);
    const o1 = createBubble({type: "atom", atom: dict.O, valency: 2}, group);
    const o2 = createBubble({type: "atom", atom: dict.O, valency: 2}, group);
    const o3 = createBubble({type: "atom", atom: dict.O, valency: 2}, group);
    const o4 = createBubble({type: "atom", atom: dict.O, valency: 2}, group);
    linkBubbles(p, o1, {type: "bond", order: 1});
    linkBubbles(p, o2, {type: "bond", order: 1});
    linkBubbles(p, o3, {type: "bond", order: 1});
    linkBubbles(p, o4, {type: "bond", order: 2});

    expect(internalValency(group)).toBe(3);
  })
})