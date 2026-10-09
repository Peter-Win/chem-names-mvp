import { compile } from "charchem2/compiler/compile"
import { buildBubble } from "../../../buildBubble";
import { solveMononuclearHydride } from "./solveMononuclearHydride";

test("solveMononuclearHydride", () => {
  const expr = compile("SiH4");
  expect(expr.getMessage()).toBe("");
  const root = buildBubble(expr);
  const node = root.nested?.[0];
  expect(node?.nested?.length).toBe(2);
  const si = node?.nested?.[0]!;
  const h = node?.nested?.[1]!;

  solveMononuclearHydride(si, h);

  expect(node?.nested?.length).toBe(1);
  expect(node?.nested?.[0]?.use).toHaveProperty("atom.id", "Si");
  expect(node?.nested?.[0]?.use).toHaveProperty("H", 4);
})