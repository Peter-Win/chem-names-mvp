import { stringifyBubble } from "../../../bubblesBase/stringifyBubble";
import { makeTestNodeLoc } from "../../tests/makeTestNode"
import { execComplexNodeRes } from "../NodeResolver/execComplexNodeRes";
import { resolveComplexBubble } from "../NodeResolver/resolveComplexBubble";

test("count explode CO2H", () => {
  const node = makeTestNodeLoc("HCO2H");

  // H~C~O2~H
  const res1 = resolveComplexBubble(node)!;
  expect(node.nested?.indexOf(res1?.main)).toBe(1);
  expect(node.nested?.indexOf(res1?.slave)).toBe(0);
  execComplexNodeRes(res1);
  expect(stringifyBubble(node)).toBe("0:[0:C(H){~1}; 1:O2{~0}{~2}; 2:H{~1}]");

  // ==> C(H)~O2~H
  const res2 = resolveComplexBubble(node, s => console.log(s));
  console.log("res2", res2);
})