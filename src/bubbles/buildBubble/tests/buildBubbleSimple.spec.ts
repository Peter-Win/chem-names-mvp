/**
 * Construction of a bubble from systems containing only nodes and chemical bonds.
 */

import { compile } from "charchem2/compiler/compile";
import { isAbstract } from "charchem2/inspectors/isAbstract";
import { buildBubble } from "../buildBubble";
import { createBubble } from "../../bubblesBase/createBubble";

describe("buildBubble simple", () => {
  it("single atom", () => {
    const expr = compile("Si");
    expect(expr.getMessage()).toBe("");
    const root = buildBubble(expr);

    expect(root.use.type).toBe("root");
    expect(root.nested).toHaveLength(1);

    const group = root?.nested?.[0];
    expect(group?.use.type).toBe("group");
    expect(group?.nested).toHaveLength(1);

    const atom = group?.nested?.[0];
    expect(atom?.use).toHaveProperty("atom.id", "Si");
    expect(atom?.nested).toBeUndefined();
    expect(atom?.links).toBeUndefined();
  });

  it("complex single node", () => {
    const expr = compile("H2SO4");
    expect(expr.getMessage()).toBe("");
    const root = buildBubble(expr);

    expect(root.use.type).toBe("root");
    expect(root.nested?.length).toBe(1);

    const group = root.nested?.[0];
    expect(group?.use.type).toBe("group");
    expect(group?.nested?.length).toBe(3);

    const h = group?.nested?.[0];
    expect(h?.use.type).toBe("atom");
    if (h?.use.type === "atom") {
      expect(h.use.atom.id).toBe("H");
      expect(h.use.H).toBeUndefined();
      expect(h.use.count).toBe(2);
    }

    const s = group?.nested?.[1];
    expect(s?.use.type).toBe("atom");
    if (s?.use.type === "atom") {
      expect(s.use.atom.id).toBe("S");
      expect(s.use.count).toBe(1);
    }

    const o = group?.nested?.[2];
    expect(o?.use.type).toBe("atom");
    if (o?.use.type === "atom") {
      expect(o.use.atom.id).toBe("O");
      expect(o.use.count).toBe(4);
    }
  });

  it("atoms and bond", () => {
    const expr = compile("Cu=O");
    expect(expr.getMessage()).toBe("");
    const root = buildBubble(expr);

    expect(root.nested?.length).toBe(2);

    const cu = root?.nested?.[0];
    expect(cu?.use.type).toBe("group");
    expect(cu?.links?.length).toBe(1);

    const o = root?.nested?.[1];
    expect(o?.use.type).toBe("group");
    expect(o?.links?.length).toBe(1);

    const link = cu?.links?.[0];
    expect(o?.links?.[0]).toBe(link);
    expect(link?.use?.type).toBe("bond");
    if (link?.use?.type === "bond") {
      expect(link.use.order).toBe(2);
    }
  });

  it("auto nodes", () => {
    const expr = compile("/\\/OH");
    expect(expr.getMessage()).toBe("");
    const root = buildBubble(expr);

    expect(root.nested?.length).toBe(4);
 
    const a1 = root.nested?.[0];
    expect(a1?.use.type).toBe("group");
    expect(a1?.nested?.length).toBe(1);
    expect(a1?.links?.length).toBe(1);
    const c1 = a1?.nested?.[0];
    expect(c1?.use.type).toBe("atom");
    if (c1?.use?.type === "atom") {
      expect(c1.use.atom.id).toBe("C");
      expect(c1.use.H).toBe(3);
      expect(c1.use.count).toBe(1);
    }

    const a2 = root.nested?.[1];
    expect(a2?.links?.length).toBe(2);
    expect(a2?.use.type).toBe("group");
    expect(a2?.nested?.length).toBe(1);
    const c2 = a2?.nested?.[0];
    expect(c2?.use.type).toBe("atom");
    if (c2?.use?.type === "atom") {
      expect(c2.use.atom.id).toBe("C");
      expect(c2.use.H).toBe(2);
      expect(c2.use.count).toBe(1);
    }
  });

  it("abstract coefficient", () => {
    const expr = compile("C'n'H'2n+2'");
    expect(expr.getMessage()).toBe("");
    expect(() => buildBubble(expr)).toThrow("Unknown coefficient C in <CnH2n+2>")
  });

  it("comma in expression", () => {
    const expr = compile("Na,K");
    expect(expr.getMessage()).toBe("");
    expect(isAbstract(expr)).toBe(true);
    expect(() => buildBubble(expr)).toThrow("Unknown node item , in <Na,K>")
  });
});