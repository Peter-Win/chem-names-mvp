import { PeriodicTable } from "charchem2/core/PeriodicTable";
import { createBubble } from "./createBubble"
import { findBubble } from "./findBubble";

test("findBubble", () => {
  const root = createBubble({type: "root"});
  const group = createBubble({type: "group"}, root);
  createBubble({type: "atom", atom: PeriodicTable.dict.H, count: 4}, group);
  createBubble({type: "atom", atom: PeriodicTable.dict.C}, group);

  const h = findBubble(root, ({use}) => use.type === "atom" && use.atom.id === "H");
  expect(h?.use).toHaveProperty("count", 4);
})