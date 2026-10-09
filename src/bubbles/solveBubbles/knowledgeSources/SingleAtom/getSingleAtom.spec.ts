import { PeriodicTable } from "charchem2/core/PeriodicTable";
import { createBubble } from "../../../bubblesBase/createBubble"
import { getSingleAtom } from "./getSingleAtom";

test("getSingleAtom", () => {
  const {dict} = PeriodicTable;
  const idGroup = -1;
  const idA = -2;
  const group = createBubble({type: "group"}, undefined, idGroup);
  expect(getSingleAtom(group)).toBeUndefined();

  const a = createBubble({type: "atom", atom: dict.C}, group, idA);
  expect(getSingleAtom(a)).toBeUndefined();
  expect(getSingleAtom(group)?.id).toBe(idA);

  createBubble({type: "atom", atom: dict.H}, group);
  expect(getSingleAtom(group)).toBeUndefined();
})