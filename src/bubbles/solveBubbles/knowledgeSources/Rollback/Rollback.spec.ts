import { compile } from "charchem2/compiler/compile"
import { buildBubble } from "../../../buildBubble";
import { solveBubbles } from "../../solveBubbles";
import { stringifyBubble } from "../../../bubblesBase/stringifyBubble";

describe("Rollback", () => {
  it("complex resolve", () => {
    // see full version in resolveAndExecSteps.spec > complex resolve
    const expr = compile("H2CBrCFH2");
    const root = buildBubble(expr);
    const res = solveBubbles(root);
    expect(stringifyBubble(root)).toBe("0:C(2H){-1}{-2}; 1:Br{-0}; 2:C(2H){-0}{-3}; 3:F{-2}");
    expect(res).toBe(true);
  })
})