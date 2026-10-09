import { PeriodicTable } from "charchem2/core/PeriodicTable";
import { createBubble } from "./createBubble"
import { linkBubbles } from "./linkBubbles";
import { unlinkBubbles } from "./unlinkBubbles";

test("unlinkBubbles", () => {
  const root = createBubble({type: "root"});
  const {dict} = PeriodicTable;
  const idA = 101;
  const idB = 102;
  const idC = 103;
  const a = createBubble({type: "atom", atom: dict.H, count: 3}, root, idA);
  const b = createBubble({type: "atom", atom: dict.C}, root, idB);
  const c = createBubble({type: "atom", atom: dict.Br}, root, idC);
  linkBubbles(a, b);
  linkBubbles(b, c);
  expect(a.links?.length).toBe(1);
  expect(b.links?.length).toBe(2);
  expect(c.links?.length).toBe(1);
  expect(a.links?.[0]?.bubbles[0].id).toBe(idA);
  expect(a.links?.[0]?.bubbles[1].id).toBe(idB);
  expect(b.links?.[0]?.bubbles[0].id).toBe(idA);
  expect(b.links?.[0]?.bubbles[1].id).toBe(idB);
  expect(b.links?.[1]?.bubbles[0].id).toBe(idB);
  expect(b.links?.[1]?.bubbles[1].id).toBe(idC);
  expect(c.links?.[0]?.bubbles[0].id).toBe(idB);
  expect(c.links?.[0]?.bubbles[1].id).toBe(idC);

  unlinkBubbles(a, b);
  expect(a.links?.length).toBe(0);
  expect(b.links?.length).toBe(1);
  expect(c.links?.length).toBe(1);
  expect(b.links?.[0]?.bubbles[0].id).toBe(idB);
  expect(b.links?.[0]?.bubbles[1].id).toBe(idC);
  expect(c.links?.[0]?.bubbles[0].id).toBe(idB);
  expect(c.links?.[0]?.bubbles[1].id).toBe(idC);

  unlinkBubbles(c, b);
  expect(a.links?.length).toBe(0);
  expect(b.links?.length).toBe(0);
  expect(c.links?.length).toBe(0);
})