import { compile } from "charchem2/compiler/compile"
import { buildBubble } from "../../../buildBubble";
import { solveBubblesExt } from "../../solveBubbles";
import { createValencyPredictor } from "./ValencyPredictor";

describe("ValencyPredictor", () => {
  it("pure test", () => {
    //                    01 2345
    const expr = compile("CH3COONa");
    expect(expr.getMessage()).toBe("");
    const root = buildBubble(expr);

    const res = solveBubblesExt({
      root, 
      knowledgeSources: [createValencyPredictor()],
    })

    expect(res).toBe(false); // этот агент не может решить пузырь, но должен расставить валентности
    expect(root.nested?.length).toBe(1);
    const node = root.nested![0]!;
    expect(node?.nested?.length).toBe(6);

    expect(node.nested?.[0]?.use).toHaveProperty("atom.id", "C");
    expect(node.nested?.[0]?.use).toHaveProperty("valency", 4);

    expect(node.nested?.[1]?.use).toHaveProperty("atom.id", "H");
    expect(node.nested?.[1]?.use).toHaveProperty("valency", 1);

    expect(node.nested?.[3]?.use).toHaveProperty("atom.id", "O");
    expect(node.nested?.[3]?.use).toHaveProperty("valency", 2);

    expect(node.nested?.[5]?.use).toHaveProperty("atom.id", "Na");
    expect(node.nested?.[5]?.use).toHaveProperty("valency", 1);
  });
})