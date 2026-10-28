import { makeTestNodeLoc } from "../../tests/makeTestNode"
import { execComplexNodeRes } from "../NodeResolver/execComplexNodeRes";
import { resolveComplexBubble } from "../NodeResolver/resolveComplexBubble";
import { findCountExplode } from "./findCountExplode";

describe("findCountExplode", () => {
  it("negative", () => {
    const node = makeTestNodeLoc("HCOOH");
    expect(findCountExplode(node)).toBeUndefined();
  })
  it("CH3CO2H", () => {
    const node = makeTestNodeLoc("CH3CO2H");
    const a = findCountExplode(node);
    expect(a?.use).toHaveProperty("atom.id", "H");
    expect(a?.use).toHaveProperty("count", 3);

    const res = resolveComplexBubble(node)!;
    expect(res).toBeDefined();
    execComplexNodeRes(res);

    const b = findCountExplode(node);
    expect(b?.use).toHaveProperty("atom.id", "O");
    expect(b?.use).toHaveProperty("count", 2);
  })
})