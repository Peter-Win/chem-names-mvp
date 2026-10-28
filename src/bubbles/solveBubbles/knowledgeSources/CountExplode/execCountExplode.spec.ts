import { stringifyBubble } from "../../../bubblesBase/stringifyBubble";
import { makeTestNodeLoc } from "../../tests/makeTestNode"
import { execCountExplode } from "./execCountExplode";

describe("execCountExplode", () => {
  it("middle", () => {
    const node = makeTestNodeLoc("CO2H");
    const target = node.nested![1]!;
    expect(target?.use).toHaveProperty("atom.id", "O");
    expect(target?.use).toHaveProperty("count", 2);

    execCountExplode(target);
    expect(stringifyBubble(node)).toBe("0:[0:C{~1}; 1:O{~0}{~2}; 2:O{~1}{~3}; 3:H{~2}]");
  })
})