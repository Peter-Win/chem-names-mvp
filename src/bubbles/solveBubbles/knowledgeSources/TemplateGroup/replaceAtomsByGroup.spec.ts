import { compile } from "charchem2/compiler/compile"
import { buildBubble } from "../../../buildBubble";
import { findTemplateInGroup } from "./findTemplateInGroup";
import { createGroupFromStruct } from "./createGroupFromStruct";
import { replaceAtomsByGroup } from "./replaceAtomsByGroup";

test("replaceAtomsByGroup", () => {
  const ext = compile("KHCO3");
  expect(ext.getMessage()).toBe("");
  const root = buildBubble(ext);
  const node = root.nested?.[0];
  expect(node?.nested?.length).toBe(4);
  const res = findTemplateInGroup(node!);
  expect(res?.atoms.length).toBe(2);
  const subGroup = createGroupFromStruct(res!.tm.struct);
  replaceAtomsByGroup(res!.atoms, subGroup);

  expect(node?.nested?.length).toBe(3);
  expect(node?.nested?.[0]?.use.type).toBe("atom");
  expect(node?.nested?.[1]?.use.type).toBe("atom");
  expect(node?.nested?.[2]?.use.type).toBe("group");
})