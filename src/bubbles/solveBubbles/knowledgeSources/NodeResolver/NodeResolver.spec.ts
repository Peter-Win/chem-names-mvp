import { compile } from "charchem2/compiler/compile"
import { buildBubble } from "../../../buildBubble";
import { solveBubbles } from "../../solveBubbles";
import { stringifyBubble } from "../../../bubblesBase/stringifyBubble";

// здесь тестируются случаи, которые более подробно рассмотрены в других тестах.
// потому что здесть проверяется комплексная работа.
// если возникнут проблемы, то нужно их устранять при помощи указанных тестов, где можно понять причину.

describe("NodeResolver", () => {
  it.each([
    // src code, stringified result
    ["H2CO", "0:C(2H){=1}; 1:O{=0}"], // see execComplexNodeRes.spec > hydrogen slave
    ["OCCO", "0:O{=1}; 1:C{=0}{=2}; 2:C{=1}{=3}; 3:O{=2}"], // see execComplexNodeRes.spec > double bond
    ["Cl2CO", "0:C{=1}{-2}{-3}; 1:O{=0}; 2:Cl{-0}; 3:Cl{-0}"], // see execComplexNodeRes.spec > multiple slave
    ["H3CCHO", "0:C(3H){-1}; 1:C(H){-0}{=2}; 2:O{=1}"], // resolveAndExecSteps.spec > Acetaldehyde
    ["CH3COOH", "0:C(3H){-1}; 1:C{-0}{=2}{-3}; 2:O{=1}; 3:O(H){-1}"], // resolveAndExecSteps.spec > Acetic acid
    ["HOHF2C", "0:O(H){-1}; 1:C(H){-0}{-2}{-3}; 2:F{-1}; 3:F{-1}"], // resolveAndExecSteps.spec > HOHF2C
    [
      "K2HPO4", 
      "0:K{-4}; 1:K{-5}; 2:P{-3}{-4}{-5}{=6}; 3:O(H){-2}; 4:O{-0}{-2}; 5:O{-1}{-2}; 6:O{=2}"
    ], // resolveWithTemplates.spec > K2HPO4
    [
      "CH3CH2CH2CH2CH3",
      "0:C(3H){-1}; 1:C(2H){-0}{-2}; 2:C(2H){-1}{-3}; 3:C(2H){-2}{-4}; 4:C(3H){-3}"
    ], // resolveAndExecSteps.spec > CH3CH2CH2CH2CH3
    ["H2BCH2BH2", "0:B(2H){-1}; 1:C(2H){-0}{-2}; 2:B(2H){-1}"], // resolveAndExecSteps.spec > H2BCH2BH2
    ["H2BCH2OBH2", "0:B(2H){-1}; 1:C(2H){-0}{-2}; 2:O{-1}{-3}; 3:B(2H){-2}"], // resolveAndExecSteps.spec > H2BCH2OBH2
  ])("NodeResolver for %s", (code, str) => {
    const expr = compile(code);
    const bubble = buildBubble(expr);
    solveBubbles(bubble);
    expect(stringifyBubble(bubble)).toBe(str);
  })
})
