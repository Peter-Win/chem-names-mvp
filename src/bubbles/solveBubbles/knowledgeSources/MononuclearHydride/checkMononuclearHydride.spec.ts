import { compile } from "charchem2/compiler/compile"
import { buildBubble } from "../../../buildBubble"
import { checkMononuclearHydride } from "./checkMononuclearHydride";
import { Bubble } from "../../../Bubble";

describe("checkMononuclearHydride", () => {
  const mkNode = (code: string): Bubble => {
    const root = buildBubble(compile(code));
    const node = root?.nested?.[0];
    if (!node) throw Error(`Invalid node in ${code}`);
    return node;
  }
  const check = (code: string) => checkMononuclearHydride(mkNode(code));

  it("success simple mononuclear hydride", () => {
    const node = mkNode("CH4")
    const res = checkMononuclearHydride(node);
    expect(res).toBeDefined();
    expect(res?.e.use).toHaveProperty("atom.id", "C");
    expect(res?.h.use).toHaveProperty("atom.id", "H")
    expect(res?.h.use).toHaveProperty("count", 4);

    const res2 = check("H2O");
    expect(res2?.e.use).toHaveProperty("atom.id", "O"); 
  })

  it("success mononuclear hydride with charge", () => {
    const node = mkNode("NH4^+")
    expect(node?.use).toHaveProperty("charge", +1);
    const res = checkMononuclearHydride(node!);
    expect(res).toBeDefined();
    expect(res?.e.use).toHaveProperty("atom.id", "N");
    expect(res?.h.use).toHaveProperty("atom.id", "H")
    expect(res?.h.use).toHaveProperty("count", 4);
  })

  it("wrong cases", () => {
    // только водород без второго элемента
    expect(check("H2")).toBeUndefined();

    // только элеммент без водорода
    expect(check("O")).toBeUndefined();

    // два элемента, но нет водорода
    expect(check("CO2")).toBeUndefined();

    // использован изотоп водорода
    expect(check("$M(2)H2O")).toBeUndefined();

    // три элемента данный источник не анализирует
    expect(check("HOH")).toBeUndefined();
  })

})