import { compile } from "charchem2/compiler/compile";
import { Bubble } from "../../../Bubble"
import { buildBubble } from "../../../buildBubble";
import { FindResult, findTemplateInGroup } from "./findTemplateInGroup";

describe("findTemplateInGroup", () => {
  it.each([
    ["NH4", "KNH4SO4"],
    ["C6H5", "H2NCOC6H5"],
    ["TeO3", "H2TeO3"],
    ["C2H5", "C2H5OH"],
    // negative
    ["<not found>", "HOC6H5CH3"], // wrong compound
  ])("expect %s in %s", (need: string, source: string) => {
    const group = createNode(source);
    const res = findTemplateInGroup(group);
    expect(makeResText(res)).toBe(need);
  })
})

const createNode = (code: string): Bubble => {
  const expr = compile(code);
  const root = buildBubble(expr);
  return root.nested![0]!;
}


const makeResText = (res: FindResult | undefined): string => 
  res?.atoms.map(({use}) => {
    if (use.type !== "atom") return `<${use.type}>`;
    let res: string = use.atom.id;
    const c = use.count ?? 1;
    if (c !== 1) res += String(c);
    return res;
  }).join("") ?? "<not found>";
