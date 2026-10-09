import { compile } from "charchem2/compiler/compile"
import { Bubble } from "../../../Bubble"
import { buildBubble } from "../../../buildBubble"
import { matchAlkylGroup } from "./matchAlkylGroup"
import { DstStructAtomDef } from "./DstTemplate"

describe("matchAlkylGroup", () => {
  const makeNode = (src: string): Bubble => {
    return buildBubble(compile(src)).nested![0]!;
  }
  it("negative", () => {
    expect(matchAlkylGroup(makeNode("H2O"))).toBeUndefined();
    expect(matchAlkylGroup(makeNode("C2H6"))).toBeUndefined();
    expect(matchAlkylGroup(makeNode("H3COH"))).toBeUndefined();
  })

  it("left", () => {
    const res = matchAlkylGroup(makeNode("C3H7COOCH3"));
    expect(res).toBeDefined();
    expect(res?.atoms.length).toBe(2);
    expect(res?.atoms?.[0]?.use).toHaveProperty("atom.id", "C");
    expect(res?.atoms?.[0]?.use).toHaveProperty("count", 3);
    expect(res?.atoms?.[1]?.use).toHaveProperty("atom.id", "H");
    expect(res?.atoms?.[1]?.use).toHaveProperty("count", 7);
    expect(res?.tm.struct.code).toBe("C3H7");
    expect(res?.tm.struct.atoms).toEqual([
      {id: "C", H: 2, valency: 4},
      {id: "C", H: 2, valency: 4},
      {id: "C", H: 3, valency: 4},
    ] as DstStructAtomDef[]);
    expect(res?.tm.struct.links).toEqual([
      [0, 1, 1], [1, 2, 1],
    ]);
  });

  it("left mirror", () => {
    const res = matchAlkylGroup(makeNode("H9C4NH2"));
    expect(res).toBeDefined();
    expect(res?.atoms.length).toBe(2);
    expect(res?.atoms?.[0]?.use).toHaveProperty("atom.id", "C");
    expect(res?.atoms?.[0]?.use).toHaveProperty("count", 4);
    expect(res?.atoms?.[1]?.use).toHaveProperty("atom.id", "H");
    expect(res?.atoms?.[1]?.use).toHaveProperty("count", 9);
    expect(res?.tm.struct.code).toBe("C4H9");
    expect(res?.tm.struct.atoms).toEqual([
      {id: "C", H: 2, valency: 4},
      {id: "C", H: 2, valency: 4},
      {id: "C", H: 2, valency: 4},
      {id: "C", H: 3, valency: 4},
    ] as DstStructAtomDef[]);
    expect(res?.tm.struct.links).toEqual([
      [0, 1, 1], [1, 2, 1], [2, 3, 1],
    ]);
  });

  it("right", () => {
    const res = matchAlkylGroup(makeNode("HOOCC2H5"));
    expect(res).toBeDefined();
    expect(res?.atoms.length).toBe(2);
    expect(res?.atoms?.[0]?.use).toHaveProperty("atom.id", "C");
    expect(res?.atoms?.[0]?.use).toHaveProperty("count", 2);
    expect(res?.atoms?.[1]?.use).toHaveProperty("atom.id", "H");
    expect(res?.atoms?.[1]?.use).toHaveProperty("count", 5);
    expect(res?.tm.struct.code).toBe("C2H5");
    expect(res?.tm.struct.atoms).toEqual([
      {id: "C", H: 2, valency: 4},
      {id: "C", H: 3, valency: 4},
    ] as DstStructAtomDef[]);
    expect(res?.tm.struct.links).toEqual([
      [0, 1, 1],
    ]);
  });

  it("right mirror", () => {
    const res = matchAlkylGroup(makeNode("KH5C2"));
    expect(res).toBeDefined();
    expect(res?.atoms.length).toBe(2);
    expect(res?.atoms?.[0]?.use).toHaveProperty("atom.id", "C");
    expect(res?.atoms?.[0]?.use).toHaveProperty("count", 2);
    expect(res?.atoms?.[1]?.use).toHaveProperty("atom.id", "H");
    expect(res?.atoms?.[1]?.use).toHaveProperty("count", 5);
    expect(res?.tm.struct.code).toBe("C2H5");
    expect(res?.tm.struct.atoms).toEqual([
      {id: "C", H: 2, valency: 4},
      {id: "C", H: 3, valency: 4},
    ] as DstStructAtomDef[]);
    expect(res?.tm.struct.links).toEqual([
      [0, 1, 1],
    ]);
  });

})