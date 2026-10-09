import { compile } from "charchem2/compiler/compile"
import { buildBubble } from "../../../buildBubble";
import { solveBubblesExt } from "../../solveBubbles";
import { createTemplateGroup } from "./TemplateGroup";
import { internalValency } from "../../valency/internalValency";

describe("TemplateGroup", () => {
  it("pure test", () => {
    const expr = compile("C6H5OC4H9"); // Ph-O-But
    expect(expr.getMessage()).toBe("");
    const root = buildBubble(expr);
    expect(root.nested?.length).toBe(1);
    const node = root.nested![0]!;
    expect(node.nested?.length).toBe(5);

    const res = solveBubblesExt({
      root,
      knowledgeSources: [createTemplateGroup()]
    });
    // в одиночку этот источник знаний не может решить пузырь
    expect(res).toBe(false);

    // но он преобразует две функциональные группы в узле
    expect(node.nested?.length).toBe(3);

    const n0 = node.nested![0]!;
    expect(n0.use.type).toBe("group");
    if (n0.use.type === "group") {
      expect(n0.use.label).toBe("C6H5");
    }

    const n1 = node.nested?.[1];
    expect(n1?.use).toHaveProperty("atom.id", "O");

    const n2 = node.nested![2]!;
    expect(n2.use.type).toBe("group");
    if (n2.use.type === "group") {
      expect(n2.use.label).toBe("C4H9");
    }
    expect(internalValency(n2)).toBe(1);
  })
})