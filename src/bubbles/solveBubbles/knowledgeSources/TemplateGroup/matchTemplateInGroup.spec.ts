import { compile } from "charchem2/compiler/compile"
import { Bubble } from "../../../Bubble"
import { DstTemplate } from "./DstTemplate"
import { matchTemplateInGroup } from "./matchTemplateInGroup"
import { buildBubble } from "../../../buildBubble"

describe("matchTemplateInGroup", () => {

  const struct = {atoms: []};
  const defAmmonium: DstTemplate = {
    pos: "any",
    code: "NH4",
    def: [{id: "N", count: 1}, {id: "H", count: 4}],
    struct,
  }
  const defPhenyl: DstTemplate = {
    pos: "edge",
    code: "C6H5",
    def: [{id: "C", count: 6}, {id: "H", count: 5}],
    struct,
  } 
  const defSulfate: DstTemplate = {
    pos: "end",
    code: "SO4",
    def: [{id: "S", count: 1}, {id: "O", count: 4}],
    struct,
  }

  it("any position, without mirror", () => {
    const node1 = createNode("NH4NO3");
    const res1 = matchTemplateInGroup(node1, defAmmonium);
    expect(makeText(res1)).toBe("NH4");

    const node2 = createNode("KNH4SO4");
    const res2 = matchTemplateInGroup(node2, defAmmonium);
    expect(makeText(res2)).toBe("NH4");

    const node3 = createNode("NH4^+");
    expect(makeText(matchTemplateInGroup(node3, defAmmonium))).toBe("NH4");

    expect(matchTemplateInGroup(createNode("O2"), defAmmonium)).toBeUndefined();
    expect(matchTemplateInGroup(createNode("NH3"), defAmmonium)).toBeUndefined();
  });

  it("any position, with mirror", () => {
    const def: DstTemplate = {...defAmmonium, mirror: true};
    const node1 = createNode("NH4OH");
    expect(makeText(matchTemplateInGroup(node1, def))).toBe("NH4");

    const node2 = createNode("HOH4N");
    expect(makeText(matchTemplateInGroup(node2, def))).toBe("H4N");
  });

  it("edge position", () => {
    const node1 = createNode("C6H5CH2COOH");
    expect(makeText(matchTemplateInGroup(node1, defPhenyl))).toBe("C6H5");

    const node2 = createNode("HOC6H5")
    expect(makeText(matchTemplateInGroup(node2, defPhenyl))).toBe("C6H5");

    const node3 = createNode("Na3C6H5O7"); // Sodium Citrate
    expect(makeText(matchTemplateInGroup(node3, defPhenyl))).toBe("");
  })

  it("end position", () => {
    const node1 = createNode("CuSO4");
    expect(makeText(matchTemplateInGroup(node1, defSulfate))).toBe("SO4");

    const node2 = createNode("SO4^2-");
    expect(makeText(matchTemplateInGroup(node2, defSulfate))).toBe("SO4");

    const node3 = createNode("HSO4K"); // wrong case
    expect(makeText(matchTemplateInGroup(node3, defSulfate))).toBe("");
  })

});

const createNode = (code: string): Bubble => {
  const expr = compile(code);
  const root = buildBubble(expr);
  return root.nested![0]!;
}

const makeText = (list: Bubble[] | undefined): string => 
  list?.map(({use}) => {
    if (use.type !== "atom") return `<${use.type}>`;
    let res: string = use.atom.id;
    const c = use.count ?? 1;
    if (c !== 1) res += String(c);
    return res;
  }).join("") ?? "";

