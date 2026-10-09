import { compile } from "charchem2/compiler/compile";
import { buildBubble } from "../buildBubble";

describe("build bubbles with charges", () => {
  
  it("simple with charges", () => {
    //         O
    //     ___//
    //    /    \
    // H3N+     O-
    const expr = compile("H3N^+/-<//O>\\O^-");
    expect(expr.getMessage()).toBe("");

    const root = buildBubble(expr);
    expect(root.nested?.length).toBe(5);

    const n0 = root.nested?.[0];
    expect(n0?.use.type).toBe("group");
    if (n0?.use.type === "group") {
      expect(n0.use.charge).toBe(1);
      expect(n0.use.label).toBe("H3N^+");
    }

    expect(root.nested?.[4]?.use.type).toBe("group");
    expect(root.nested?.[4]?.use).toHaveProperty("charge", -1);
  })
})