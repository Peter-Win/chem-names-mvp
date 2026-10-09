import { PeriodicTable } from "charchem2/core/PeriodicTable";
import { createBubble } from "./createBubble";
import { forEachBubble } from "./forEachBubble";

test("forEachBubble", () => {
  const idRoot = 100;
  const idGroup = 101;
  const idH = 102;
  const idC = 103;
  const idO = 104;
  const root = createBubble({type: "root"}, undefined, idRoot);
  const group = createBubble({type: "group"}, root, idGroup);
  const {dict} = PeriodicTable;
  createBubble({type: "atom", atom: dict.H, count: 2}, group, idH);
  createBubble({type: "atom", atom: dict.C}, group, idC);
  createBubble({type: "atom", atom: dict.O}, group, idO);

  const ids: number[] = [];
  forEachBubble(root, ({id}) => {
    ids.push(id)
  })
  expect(ids).toEqual([idRoot, idGroup, idH, idC, idO]);
})