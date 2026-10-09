import { compile } from "charchem2/compiler/compile";
import { solveBubbles, solveBubblesExt } from "../../solveBubbles";
import { createExampleForHCollapse } from "./createExampleForHCollapse"
import { createHydrogenCollapse } from "./HydrogenCollapse";
import { buildBubble } from "../../../buildBubble";
import { createSingleAtom } from "../SingleAtom";

describe("HydrogenCollapse", () => {

  it("pure hydrogen collapse operation", () => {
    const {root} = createExampleForHCollapse();
    expect(root.nested?.length).toBe(2);
    const res = solveBubblesExt({
      root,
      knowledgeSources: [createHydrogenCollapse()],
    });
    expect(res).toBe(true);
    expect(root.nested?.length).toBe(1);
    expect(root.nested?.[0]?.use).toHaveProperty("atom.id", "Cl");
    expect(root.nested?.[0]?.use).toHaveProperty("H", 1);
  });

  it("real case with limited knowledge sources", () => {
    //     H   H
    //     |   |
    // H---C---C---O---H     ===>  C(3H)-C(2H)-O(1H)
    //     |   |
    //     H   H
    const expr = compile("H-C-C-O-H; H|#2|H; H|#3|H");
    expect(expr.getMessage()).toBe("");
    const root = buildBubble(expr);
    expect(root.nested?.length).toBe(9);

    // ** limited version **
    const res = solveBubblesExt({
      root,
      knowledgeSources: [
        createSingleAtom(), // он необходим, чтобы раскрыть узлы
        createHydrogenCollapse(),
      ],
    });

    expect(res).toBe(true);
    expect(root.nested?.length).toBe(3);

    const n0 = root.nested?.[0];
    expect(n0?.use).toHaveProperty("atom.id", "C");
    expect(n0?.use).toHaveProperty("H", 3);
    expect(n0?.use).toHaveProperty("valency", 4);
    expect(n0?.links?.length).toBe(1);

    const n1 = root.nested?.[1];
    expect(n1?.use).toHaveProperty("atom.id", "C");
    expect(n1?.use).toHaveProperty("H", 2);
    expect(n1?.use).toHaveProperty("valency", 4);
    expect(n1?.links?.length).toBe(2);

    const n2 = root.nested?.[2];
    expect(n2?.use).toHaveProperty("atom.id", "O");
    expect(n2?.use).toHaveProperty("H", 1);
    expect(n2?.use).toHaveProperty("valency", 2);
    expect(n2?.links?.length).toBe(1);
  })

  it("real case", () => {
    // Аналог предыдущего теста, но с полным набором источников знаний
    const expr = compile("H-C-C-O-H; H|#2|H; H|#3|H");
    expect(expr.getMessage()).toBe("");
    const root = buildBubble(expr);
    expect(root.nested?.length).toBe(9);

    // ** full version **
    const res = solveBubbles(root);

    expect(res).toBe(true);
    expect(root.nested?.length).toBe(3);

    const n0 = root.nested?.[0];
    expect(n0?.use).toHaveProperty("atom.id", "C");
    expect(n0?.use).toHaveProperty("H", 3);
    expect(n0?.use).toHaveProperty("valency", 4);
    expect(n0?.links?.length).toBe(1);

    const n1 = root.nested?.[1];
    expect(n1?.use).toHaveProperty("atom.id", "C");
    expect(n1?.use).toHaveProperty("H", 2);
    expect(n1?.use).toHaveProperty("valency", 4);
    expect(n1?.links?.length).toBe(2);

    const n2 = root.nested?.[2];
    expect(n2?.use).toHaveProperty("atom.id", "O");
    expect(n2?.use).toHaveProperty("H", 1);
    expect(n2?.use).toHaveProperty("valency", 2);
    expect(n2?.links?.length).toBe(1);
  })

})