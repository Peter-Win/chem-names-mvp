import { makeTestNodeLoc } from "../../tests/makeTestNode"
import { freeValency } from "../../valency/freeValency";
import { execComplexNodeRes } from "./execComplexNodeRes";
import { resolveComplexBubble } from "./resolveComplexBubble";

describe("execComplexNodeRes", () => {
  it("hydrogen slave", () => {
    const node = makeTestNodeLoc("H2CO");
    expect(node.nested?.length).toBe(3);

    const res = resolveComplexBubble(node);
    expect(res?.main.use).toHaveProperty("atom.id", "C");
    expect(res?.slave.use).toHaveProperty("atom.id", "H");

    execComplexNodeRes(res!);
    expect(node.nested?.length).toBe(2);
    expect(node.nested?.[0]?.use).toHaveProperty("atom.id", "C");
    expect(node.nested?.[0]?.use).toHaveProperty("H", 2);
  });

  it("double bond", () => {
    const node = makeTestNodeLoc("OCCO"); // O=C=C=O
    expect(node.nested?.length).toBe(4);

    const res = resolveComplexBubble(node);
    expect(res?.main.use).toHaveProperty("atom.id", "C");
    expect(res?.slave.use).toHaveProperty("atom.id", "O");

    execComplexNodeRes(res!);

    expect(res?.main.links?.length).toBe(2);
    expect(res?.main.links?.[0]?.use).toBeUndefined();
    expect(res?.main.links?.[1]?.use?.type).toBe("bond");
    expect(res?.main.links?.[1]?.use).toHaveProperty("order", 2);
  });

  it("multiple slave", () => {
    const node = makeTestNodeLoc("Cl2CO");
    expect(node.nested?.length).toBe(3);

    const res = resolveComplexBubble(node);
    expect(res?.main.use).toHaveProperty("atom.id", "C");
    expect(res?.slave.use).toHaveProperty("atom.id", "Cl");

    execComplexNodeRes(res!);
    expect(node.nested?.length).toBe(4);
    expect(node.nested?.[0]?.use).toHaveProperty("atom.id", "C");
    expect(node.nested?.[1]?.use).toHaveProperty("atom.id", "O");
    expect(node.nested?.[2]?.use).toHaveProperty("atom.id", "Cl");
    expect(node.nested?.[3]?.use).toHaveProperty("atom.id", "Cl");

    expect(node.nested?.[0]?.links?.length).toBe(3);
    expect(freeValency(node.nested?.[0]!)).toBe(2);
  });
});
