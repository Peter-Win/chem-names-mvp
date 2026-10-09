import { compile } from "charchem2/compiler/compile"
import { buildBubble } from "../buildBubble";

test("build bubbles with isotope", () => {
  const expr = compile("$M(40)K");
  expect(expr.getMessage()).toBe("");

  const bubble = buildBubble(expr);
  expect(bubble.use.type).toBe("root");
  expect(bubble.nested?.length).toBe(1);

  const node = bubble.nested?.[0];
  expect(node?.use.type).toBe("group");
  expect(node?.nested?.length).toBe(1);

  const atom = node?.nested?.[0];
  expect(atom?.use.type).toBe("atom");
  expect(atom?.use).toHaveProperty("atom.id", "K");

  // main test
  expect(atom?.use).toHaveProperty("mass", 40);
})