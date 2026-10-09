import { freeValency } from "../../valency/freeValency";
import { internalValency } from "../../valency/internalValency";
import { createGroupFromStruct } from "./createGroupFromStruct"
import { DstTargetStruct } from "./DstTemplate"

test("createGroupFromStruct", () => {
  //           O 1
  //         //
  //   ∙O---N + 0
  //    3    \ _
  //          O 2
  const struct: DstTargetStruct = {
    code: "NO3",
    atoms: [
      {id: "N", valency: 5, charge: +1},
      {id: "O", valency: 2},
      {id: "O", valency: 2, charge: -1},
      {id: "O", valency: 2},
    ],
    links: [
      [0, 1, 2], [0, 2, 1], [0, 3, 1],
    ],
  }
  const group = createGroupFromStruct(struct);
  expect(group.use.type).toBe("group");
  expect(group.nested?.length).toBe(4);

  const a0 = group.nested?.[0]!;
  expect(a0?.use.type).toBe("atom");
  expect(a0?.use).toHaveProperty("atom.id", "N");
  expect(a0?.use).toHaveProperty("valency", 5);
  expect(a0?.use).toHaveProperty("charge", 1);

  const a1 = group.nested?.[1]!;
  expect(a1?.use.type).toBe("atom");
  expect(a1?.use).toHaveProperty("atom.id", "O");
  expect(a1?.use).toHaveProperty("valency", 2);

  const a2 = group.nested?.[2]!;
  expect(a2?.use.type).toBe("atom");
  expect(a2?.use).toHaveProperty("atom.id", "O");
  expect(a2?.use).toHaveProperty("valency", 2);
  expect(a2?.use).toHaveProperty("charge", -1);

  const a3 = group.nested?.[3]!;
  expect(a3?.use).toHaveProperty("atom.id", "O");
  expect(a3?.use).toHaveProperty("valency", 2);

  expect(a0?.links?.length).toBe(3);
  expect(a0?.links?.[0]?.bubbles?.[0]).toBe(a0);
  expect(a0?.links?.[0]?.bubbles?.[1]).toBe(a1);
  expect(a0?.links?.[0]?.use).toHaveProperty("order", 2);

  expect(a3?.links?.length).toBe(1);
  expect(a3?.links?.[0]?.bubbles?.[0]).toBe(a0);
  expect(a3?.links?.[0]?.bubbles?.[1]).toBe(a3);
  expect(a3?.links?.[0]?.use).toHaveProperty("order", 1);

  expect(internalValency(group)).toBe(1);
  expect(freeValency(a0)).toBe(0);
  expect(freeValency(a1)).toBe(0);
  expect(freeValency(a2)).toBe(0);
  expect(freeValency(a3)).toBe(1);
})