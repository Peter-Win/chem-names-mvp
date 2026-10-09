import { PeriodicTable } from "charchem2/core/PeriodicTable"
import { createBubble } from "./createBubble"
import { linkBubbles } from "./linkBubbles";
import { deleteBubble } from "./deleteBubble";

test("deleteBubble", () => {
  const {dict} = PeriodicTable;
  const root = createBubble({type: "root"});
  const c = createBubble({type: "atom", atom: dict.C}, root);
  const h = createBubble({type: "atom", atom: dict.H, count: 2}, root);
  const o = createBubble({type: "atom", atom: dict.O}, root);
  linkBubbles(c, h);
  linkBubbles(h, o);

  expect(root.nested?.length).toBe(3);
  expect(c.links?.length).toBe(1);
  expect(h.links?.length).toBe(2);
  expect(o.links?.length).toBe(1);
  expect(o.links?.[0]?.bubbles[0].use).toHaveProperty("atom.id", "H")
  expect(o.links?.[0]?.bubbles[1].use).toHaveProperty("atom.id", "O")

  deleteBubble(h);

  expect(root.nested?.length).toBe(2);
  expect(root.nested?.[0]?.use).toHaveProperty("atom.id", "C");
  expect(root.nested?.[1]?.use).toHaveProperty("atom.id", "O");
  expect(c.links?.length).toBe(0);
  expect(h.links?.length).toBeUndefined();
  expect(o.links?.length).toBe(0);

})