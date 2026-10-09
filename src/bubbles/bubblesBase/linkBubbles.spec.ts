import { ChemAtom } from "charchem2/core/ChemAtom";
import { createBubble } from "./createBubble";
import { PeriodicTable } from "charchem2/core/PeriodicTable";
import { linkBubbles } from "./linkBubbles";

describe("linkBubbles", () => {
  it("simple linkBubbles", () => {
    const root = createBubble({type: "root"});
    const createAtom = (atom: ChemAtom) => createBubble({type: "atom", atom}, root);
    const h = createAtom(PeriodicTable.dict.H);
    const f = createAtom(PeriodicTable.dict.F);
    const link = linkBubbles(h, f, {type: "bond", order: 1});

    expect(link.bubbles[0]).toBe(h);
    expect(link.bubbles[1]).toBe(f);
    expect(link.use?.type).toBe("bond");
    expect(link.use).toHaveProperty("order", 1);

    expect(h.links).toHaveLength(1);
    expect(h.links?.[0]).toBe(link);
    expect(f.links).toHaveLength(1);
    expect(f.links?.[0]).toBe(link);
  })
})