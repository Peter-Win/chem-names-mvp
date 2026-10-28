import { Bubble } from "../../../Bubble";
import { getLinkEnd } from "../../../bubblesBase/getLinkEnd";
import { isNestedSolved } from "../../solveUtils/isBubblesSolved";
import { makeTestNode } from "../../tests/makeTestNode"
import { freeValency } from "../../valency/freeValency";
import { canExplodeGroup } from "../GroupExplode/canExplodeGroup";
import { explodeGroup } from "../GroupExplode/explodeGroup";
import { createGroupFromStruct } from "../TemplateGroup/createGroupFromStruct";
import { findTemplateInGroup } from "../TemplateGroup/findTemplateInGroup";
import { replaceAtomsByGroup } from "../TemplateGroup/replaceAtomsByGroup";
import { valencyForBubble } from "../ValencyPredictor/valencyForBubble";
import { execComplexNodeRes } from "./execComplexNodeRes";
import { resolveComplexBubble } from "./resolveComplexBubble";

describe("resolve with templates", () => {
  it("K2HPO4", () => {
    // 0  1 2 3
    // K2~H~P~O4
    const node = makeTestNode("K2HPO4");
    expect(node.nested?.length).toBe(4);

    // phase 1. find templates
    const res1 = findTemplateInGroup(node)!;
    expect(res1).toBeDefined();
    expect(res1.atoms.length).toBe(2);
    expect(res1.atoms[0]?.use).toHaveProperty("atom.id", "P");
    expect(res1.atoms[1]?.use).toHaveProperty("atom.id", "O");

    //     0  1  2
    // ==> K2~H~[PO4]
    const newGroup = createGroupFromStruct(res1.tm.struct);
    replaceAtomsByGroup(res1.atoms, newGroup);
    expect(node.nested?.length).toBe(3);
    expect(node.nested?.[2]?.use.type).toBe("group");
    expect(freeValency(node.nested?.[2]!)).toBe(3);
    expect(node.nested?.[2]?.links?.length).toBe(1);
    expect(indexOf(node, getLinkEnd(node.nested?.[2]?.links?.[0]!, node.nested?.[2]!))).toBe(1);

    // no more templates
    expect(findTemplateInGroup(node)).toBeUndefined();

    // phase 2. valency prediction
    const res2 = valencyForBubble(node);
    expect(res2?.item.use).toHaveProperty("atom.id", "K");
    expect(res2?.valency).toBe(1);
    if (res2?.item.use.type === "atom" && typeof res2.valency === "number") {
      res2.item.use.valency = res2.valency;
    }

    const res3 = valencyForBubble(node);
    expect(res3?.item.use).toHaveProperty("atom.id", "H");
    expect(res3?.valency).toBe(1);
    if (res3?.item.use.type === "atom" && typeof res3.valency === "number") {
      res3.item.use.valency = res3.valency;
    }

    expect(valencyForBubble(node)).toBeUndefined();
    expect(freeValency(node)).toBe(1+1+3);

    // phase 3. resolve node
    // 0  1  2
    // K2~H~[PO4]  ==> K2~H-[PO4]
    const res4 = resolveComplexBubble(node)!;
    expect(indexOf(node, res4?.main)).toBe(2);
    expect(indexOf(node, res4?.slave)).toBe(1);
    expect(res4.slave.links?.length).toBe(2);
    expect(res4?.alt).toBeUndefined();

    execComplexNodeRes(res4);
    expect(node.nested?.length).toBe(3)
    expect(res4.slave.links?.length).toBe(1);
    expect(res4.slave.links?.[0]?.use).toHaveProperty("order", 1);

    const res5 = resolveComplexBubble(node);
    expect(indexOf(node, res5?.main)).toBe(2);
    expect(indexOf(node, res5?.slave)).toBe(0);
    expect(res4?.alt).toBeUndefined();

    //     0  1     2  3
    // ==> H-[PO4](-K)-K
    execComplexNodeRes(res5!);
    expect(node.nested?.length).toBe(4);
    expect(freeValency(node)).toBe(0);

    expect(resolveComplexBubble(node)).toBeUndefined();
    expect(isNestedSolved(node)).toBe(false);

    const group = node.nested![1]!;
    const res6 = canExplodeGroup(group);
    expect(res6?.length).toBe(3);
    expect(res6?.[0]?.target.use).toHaveProperty("atom.id", "O");
    expect(getLinkEnd(res6?.[0]?.extLink!, group)).toHaveProperty("use.atom.id", "H");
    expect(res6?.[1]?.target.use).toHaveProperty("atom.id", "O");
    expect(getLinkEnd(res6?.[1]?.extLink!, group)).toHaveProperty("use.atom.id", "K");
    expect(res6?.[2]?.target.use).toHaveProperty("atom.id", "O");
    expect(getLinkEnd(res6?.[2]?.extLink!, group)).toHaveProperty("use.atom.id", "K");

    // ==>  H--O
    //          \ 
    //     K--O--P==0
    //          /
    //      K--O
    explodeGroup(group, res6!);
    expect(node.nested?.length).toBe(8);

    expect(freeValency(node)).toBe(0);
    expect(isNestedSolved(node)).toBe(true);
  })
});

const indexOf = (node: Bubble, target: Bubble | undefined): number =>
  (target ? node.nested?.indexOf(target) : undefined) ?? -1;
