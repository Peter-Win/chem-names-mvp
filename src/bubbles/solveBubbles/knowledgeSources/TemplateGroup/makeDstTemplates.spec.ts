import { DstAtomDef } from "./DstTemplate";
import { makeDstTemplates } from "./makeDstTemplates";
import { SrcTemplate } from "./SrcTemplate"

describe("makeDstTemplates", () => {

  it("single template", () => {
    const src: SrcTemplate = {
      code: "NH4",
      mirror: true,
      pos: "any",
      struct: { atoms: [{id: "N", H:4, valency: 5, charge: 1}]},
    };
    const dst = makeDstTemplates(src);
    expect(dst.length).toBe(1);
    const it = dst[0]!;
    expect(it.mirror).toBe(true);
    expect(it.pos).toBe(src.pos);
    expect(it.struct).toEqual({
      ...src.struct,
      code: src.code,
    });
    expect(it.def).toEqual([
      {id: "N", count: 1},
      {id: "H", count: 4},
    ] satisfies DstAtomDef[])
  })

  it("multi template", () => {
    const src: SrcTemplate =   {
      code: "?O3", 
      pos: "end", 
      cases: ["C", "Si"],
      struct: {
        atoms: [
          {id: "?", valency: 4}, 
          {id: "O", valency: 2, charge: -1}, 
          {id: "O", valency: 2, charge: -1},
          {id: "O", valency: 2}, 
        ],
        links: [[0,1,1], [0,2,1], [0,3,2]],
      },
    }
    const dst = makeDstTemplates(src);
    expect(dst.length).toBe(2);
    
    const d0 = dst[0]!;
    expect(d0.struct.code).toBe("CO3");
    expect(d0.struct.atoms[0]).toEqual({id: "C", valency: 4});
    expect(d0.struct.atoms[3]).toEqual({id: "O", valency: 2});
    expect(d0.def).toEqual([
      {id: "C", count: 1},
      {id: "O", count: 3},
    ] satisfies DstAtomDef[]);

    const d1 = dst[1]!;
    expect(d1.struct.code).toBe("SiO3");
    expect(d1.struct.atoms[0]).toEqual({id: "Si", valency: 4});
    expect(d1.struct.atoms[3]).toEqual({id: "O", valency: 2});
    expect(d1.def).toEqual([
      {id: "Si", count: 1},
      {id: "O", count: 3},
    ] satisfies DstAtomDef[]);

  })

})