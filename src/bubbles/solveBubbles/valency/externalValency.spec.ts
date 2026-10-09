import { PeriodicTable } from "charchem2/core/PeriodicTable";
import { createBubble } from "../../bubblesBase/createBubble"
import { ElementId } from "charchem2/types/ElementId";
import { BubbleAtom } from "../../BubbleType";
import { Bubble } from "../../Bubble";
import { linkBubbles } from "../../bubblesBase/linkBubbles";
import { externalValency } from "./externalValency";

const atom = (owner: Bubble, id: ElementId, options?: Omit<BubbleAtom, "type" | "atom">): Bubble => createBubble({
  type: "atom",
  atom: PeriodicTable.dict[id],
  ...options,
}, owner)

describe("externalValency", () => {

  it("zero external valency", () => {
    const group = createBubble({type: "group"});
    const left = atom(group, "H", {count: 2});
    const middle = atom(group, "C");
    const right = atom(group, "O");
    linkBubbles(left, middle);
    linkBubbles(middle, right);

    expect(externalValency(left)).toBe(0);
    expect(externalValency(middle)).toBe(0);
    expect(externalValency(right)).toBe(0);
    expect(externalValency(group)).toBe(0);
  });

  it("valency from internal hydrogen", () => {
    const group = createBubble({type: "group"});
    const c = atom(group, "C", {H: 2});
    const o = atom(group, "O");
    linkBubbles(c, o);

    expect(externalValency(c)).toBe(2);
    expect(externalValency(o)).toBe(0);
  });

  it("valency from bonds", () => {
    const group = createBubble({type: "group"});
    const h = atom(group, "H", {count: 2});
    const c = atom(group, "C");
    const o = atom(group, "O");
    expect(externalValency(c)).toBe(0);

    linkBubbles(h, c, {type: "bond", order: 1});
    expect(externalValency(h)).toBe(2);
    expect(externalValency(c)).toBe(1);
    expect(externalValency(o)).toBe(0);

    linkBubbles(c, o, {type: "bond", order: 2});
    expect(externalValency(o)).toBe(2);
    expect(externalValency(c)).toBe(3);
  })

  it("valency with charge", () => {
    //      (1) O -- H    
    //  _      /
    //   O -- N +           variant of nitric acid
    //  (3)    \\
    //          O (2)
    const group = createBubble({type: "group"});
    const n = atom(group, "N", {charge: +1});
    const o1 = atom(group, "O", {H: 1});
    const o2 = atom(group, "O");
    const o3 = atom(group, "O", {charge: -1});
    linkBubbles(n, o1, {type: "bond", order: 1});
    linkBubbles(n, o2, {type: "bond", order: 2});
    linkBubbles(n, o3, {type: "bond", order: 1});

    expect(externalValency(o1)).toBe(2);
    expect(externalValency(o2)).toBe(2);
    expect(externalValency(o3)).toBe(2);
    expect(externalValency(n)).toBe(5);
  })
})