import { PeriodicTable } from "charchem2/core/PeriodicTable";
import { createBubble } from "../../../bubblesBase/createBubble";
import { linkBubbles } from "../../../bubblesBase/linkBubbles";
import { internalValency } from "../../valency/internalValency";
import { freeValency } from "../../valency/freeValency";
import { canExplodeGroup } from "./canExplodeGroup";

describe("canExplodeGroup", () => {
  const {dict} = PeriodicTable;

  it("can explode KHSO3", () => {
    const root = createBubble({type: "root"});
    const k = createBubble({type: "atom", atom: dict.K, valency: 1}, root, 101);
    const h = createBubble({type: "atom", atom: dict.H, valency: 1}, root, 102);
    const group = createBubble({type: "group"}, root);
    const linkK = linkBubbles(k, group, {type: "bond", order: 1});
    const linkH = linkBubbles(h, group, {type: "bond", order: 1});

    const s = createBubble({type: "atom", atom: dict.S, valency: 4}, group, 200);
    const o1 = createBubble({type: "atom", atom: dict.O, valency: 2}, group, 201);
    const o2 = createBubble({type: "atom", atom: dict.O, valency: 2}, group, 202);
    const oDbl = createBubble({type: "atom", atom: dict.O, valency: 2}, group, 203);
    linkBubbles(s, o1, {type: "bond", order: 1});
    linkBubbles(s, o2, {type: "bond", order: 1});
    linkBubbles(s, oDbl, {type: "bond", order: 2});

    expect(root.nested?.length).toBe(3);
    expect(group.nested?.length).toBe(4);
    expect(internalValency(group)).toBe(2);
    expect(freeValency(group)).toBe(0);
    expect(freeValency(o1)).toBe(1);
    expect(freeValency(o2)).toBe(1);

    const res = canExplodeGroup(group)!;
    expect(res?.length).toBe(2);
    expect(res[0]?.extLink).toBe(linkK);
    expect(res[0]?.target.id).toBe(201);
    expect(res[1]?.extLink).toBe(linkH);
    expect(res[1]?.target.id).toBe(202);
  });
})