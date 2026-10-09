import { buildBubble } from "../../../buildBubble";
import { compile } from "charchem2/compiler/compile";
import { solveBubbles, solveBubblesExt } from "../../solveBubbles";
import { createSingleAtom } from "./SingleAtom";

describe("SingleAtom", () => {
  it("simple single atoms", () => {
    // Formyl chloride
    //       Cl
    //      /
    //  O==C
    //      \
    //       H
    const expr = compile("O==C</Cl>\\H");
    const root = buildBubble(expr);
    expect(root.nested?.length).toBe(4);

    // здесь исключено влияние других источников знаний
    const result = solveBubblesExt({
      root,
      knowledgeSources: [createSingleAtom()],
    });
    expect(result).toBe(true);
    const n0 = root.nested?.[0];
    expect(n0?.use.type).toBe("atom");
    expect(n0?.use).toHaveProperty("atom.id", "O");
    expect(n0?.use).toHaveProperty("valency", 2);

    expect(root.nested?.[1]?.use.type).toBe("atom");
    expect(root.nested?.[2]?.use.type).toBe("atom");
    expect(root.nested?.[3]?.use.type).toBe("atom");
  });

  it("single atoms complex", () => {
    const expr = compile("O==C</Cl>\\F");
    const root = buildBubble(expr);
    expect(root.nested?.length).toBe(4);

    // аналог предыдущего теста, то уже с полноценным составом источников знаний
    // вместо водорода использован фтор, чтобы не происходило схлопывание
    const result = solveBubbles(root);

    expect(result).toBe(true);
    expect(root.nested?.[0]?.use.type).toBe("atom");
    expect(root.nested?.[1]?.use.type).toBe("atom");
    expect(root.nested?.[2]?.use.type).toBe("atom");
    expect(root.nested?.[3]?.use.type).toBe("atom");
  })

  it("single atom with charge", () => {
    //      O-
    //    /   
    //  D      H+
    const expr = compile("D/O^-\\0H^+");
    const root = buildBubble(expr);
    expect(root.nested?.length).toBe(3);
    expect(root.nested?.[0]?.use.type).toBe("group");
    expect(root.nested?.[0]?.nested?.[0]).toHaveProperty("use.atom.id", "D");
    expect(root.nested?.[0]?.links?.length).toBe(1);
    expect(root.nested?.[0]?.links?.[0]?.use?.type).toBe("bond");
    expect(root.nested?.[0]?.links?.[0]?.use).toHaveProperty("order", 1);

    expect(root.nested?.[1]?.use.type).toBe("group");
    expect(root.nested?.[1]?.nested?.[0]).toHaveProperty("use.atom.id", "O");
    expect(root.nested?.[1]).toHaveProperty("use.charge", -1);

    const res = solveBubbles(root);
    expect(res).toBe(true);
    expect(root.nested?.length).toBe(3);

    const n0 = root.nested?.[0]?.use;
    expect(n0?.type).toBe("atom");
    if (n0?.type === "atom") {
      expect(n0.atom.id).toBe("D");
      expect(n0.valency).toBe(1);
      expect(n0.charge).toBeUndefined();
    }

    const n1 = root.nested?.[1]?.use;
    expect(n1?.type).toBe("atom");
    if (n1?.type === "atom") {
      expect(n1.atom.id).toBe("O");
      expect(n1.charge).toBe(-1);
      expect(n1.valency).toBe(2);
    }
  })

  it("single isotope", () => {
    const expr = compile("$M(40)K");
    expect(expr.getMessage()).toBe("");
    const root = buildBubble(expr);

    const res = solveBubbles(root);
    expect(res).toBe(true);
    expect(root.nested?.length).toBe(1);

    const atom = root.nested?.[0];
    expect(atom?.use.type).toBe("atom");
    if (atom?.use.type === "atom") {
      expect(atom.use.atom.id).toBe("K");
      expect(atom.use.mass).toBe(40);
    }
  })
})