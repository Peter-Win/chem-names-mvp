import { createBubble } from "./createBubble";
import { PeriodicTable } from "charchem2/core/PeriodicTable";

describe("createBubble", () => {
  it("createBubble with atom", () => {
    const root = createBubble({type: "root"});
    const atom = PeriodicTable.dict.He;
    const a = createBubble({type: "atom", atom}, root);

    expect(root.owner).toBeUndefined();
    expect(root.nested).toHaveLength(1);
    expect(a.owner).toBe(root);
    expect(a.use).toHaveProperty("atom.id", "He");
  })

  it("createBubble with group", () => {
    const root = createBubble({type: "root"});
    const group = createBubble({type: "group"}, root);

    expect(group.use.type).toBe("group");
  })
})