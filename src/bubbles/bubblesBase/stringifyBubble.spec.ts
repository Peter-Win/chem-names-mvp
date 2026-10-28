import { compile } from "charchem2/compiler/compile"
import { buildBubble } from "../buildBubble"
import { stringifyBubble } from "./stringifyBubble"

test("stringifyBubble", () => {
  expect(stringifyBubble(buildBubble(compile("H2O")))).toBe("0:[0:H2{~1}; 1:O{~0}]");
  expect(stringifyBubble(buildBubble(compile("H-N=O"))))
    .toBe("0:[0:H]{-1}; 1:[0:N]{-0}{=2}; 2:[0:O]{=1}")
})