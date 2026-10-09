import { compile } from "charchem2/compiler/compile"
import { buildBubble } from "../../../buildBubble";
import { solveBubbles } from "../../solveBubbles";

describe("MononuclearHydride", () => {
  it("full version", () => {
    const expr = compile("CH3-CH2-OH");
    expect(expr.getMessage()).toBe("");
    const root = buildBubble(expr);
    expect(root.nested?.length).toBe(3);
    expect(root.nested?.[0]?.use.type).toBe("group");

    const res = solveBubbles(root);
    expect(res).toBe(true);
    expect(root.nested?.length).toBe(3);

    const n0 = root.nested?.[0];
    expect(n0?.use.type).toBe("atom");
    if (n0?.use.type === "atom") {
      expect(n0.use.atom.id).toBe("C");
      expect(n0.use.H).toBe(3);
      expect(n0.use.valency).toBe(4);
    }

    const n1 = root.nested?.[1];
    expect(n1?.use.type).toBe("atom");
    if (n1?.use.type === "atom") {
      expect(n1.use.atom.id).toBe("C");
      expect(n1.use.H).toBe(2);
      expect(n1.use.valency).toBe(4);
    }

    const n2 = root.nested?.[2];
    expect(n2?.use.type).toBe("atom");
    if (n2?.use.type === "atom") {
      expect(n2.use.atom.id).toBe("O");
      expect(n2.use.H).toBe(1);
      expect(n2.use.valency).toBe(2);
    }

  })
})