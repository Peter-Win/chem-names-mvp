import { PeriodicTable } from "charchem2/core/PeriodicTable";
import { createBubble } from "./createBubble"
import { linkBubbles } from "./linkBubbles";
import { cloneBubbleContent, restoreBubbleContent } from "./cloneBubbleContent";
import { deleteBubble } from "./deleteBubble";
import { unlinkBubbles } from "./unlinkBubbles";
import { BubbleLinkBond, BubbleLinkType } from "../BubbleLink";

test("cloneBubbleContent", () => {
  // H2CBrCF(O)
  const idNode = 100;
  const idH = 101;
  const idC1 = 102;
  const idBr = 103;
  const idC2 = 104;
  const idF = 105;
  const idGroup = 106;
  const {dict} = PeriodicTable;
  const node = createBubble({type: "group"}, undefined, idNode);
  const h = createBubble({type: "atom", atom: dict.H, count: 2}, node, idH)
  const c1 = createBubble({type: "atom", atom: dict.C}, node, idC1);
  const br = createBubble({type: "atom", atom: dict.Br}, node, idBr);
  const c2 = createBubble({type: "atom", atom: dict.C}, node, idC2);
  const f = createBubble({type: "atom", atom: dict.F}, node, idF);
  const group = createBubble({type: "group"}, node, idGroup);
  createBubble({type: "atom", atom: dict.O});
  linkBubbles(h, c1);
  linkBubbles(c1, br);
  linkBubbles(br, c2);
  linkBubbles(c2, f);
  linkBubbles(f, group);
  expect(node.nested?.length).toBe(6)

  const content = cloneBubbleContent(node);

  // внести ряд изменений в узел
  // водород присоединяется к первому углероду
  if (c1.use.type === "atom" && h.use.type === "atom") c1.use.H = h.use.count;
  deleteBubble(h);
  // бром к первому углероду
  br.links![0]!.use = {type: "bond", order: 1};
  unlinkBubbles(c2, br);
  // фтор ко второму
  f.links![0]!.use = {type: "bond", order: 1};
  // группу ко второму
  unlinkBubbles(f, group);
  linkBubbles(c2, group, {type: "bond", order: 2});

  expect(node.nested?.length).toBe(5);
  expect(node.nested?.[0]?.id).toBe(idC1);
  expect(c1.use).toHaveProperty("H", 2);
  expect(c1.links?.length).toBe(1);
  expect(c1.links?.[0]?.bubbles[0].id).toBe(idC1);
  expect(c1.links?.[0]?.bubbles[1].id).toBe(idBr);
  expect(c1.links?.[0]?.use?.type).toBe("bond");
  expect(br.links?.length).toBe(1);
  expect(c2.links?.length).toBe(2);
  expect(c2.links?.[0]?.bubbles[0].id).toBe(idC2);
  expect(c2.links?.[0]?.bubbles[1].id).toBe(idF);
  expect(c2.links?.[0]?.use).toHaveProperty("order", 1);
  expect(c2.links?.[1]?.use).toHaveProperty("order", 2);
  expect(c2.links?.[1]?.bubbles[1].id).toBe(idGroup);


  
  restoreBubbleContent(node, content);

  expect(node.nested?.length).toBe(6);
  expect(node.nested?.[0]?.id).toBe(idH);
  const [aH, aC1, aBr, aC2, aF, aGr] = node.nested!;
  expect(aH?.owner?.id).toBe(idNode);

  expect(aC1?.owner?.id).toBe(idNode);
  expect(aC1?.use.type).toBe("atom");
  if (aC1?.use.type === "atom") {
    expect(aC1.use.H).toBeUndefined();
  }
  expect(aC1?.links?.length).toBe(2);
  expect(aC1?.links?.[0]?.bubbles[0].id).toBe(idH);
  expect(aC1?.links?.[0]?.bubbles[1].id).toBe(idC1);
  expect(aC1?.links?.[1]?.bubbles[0].id).toBe(idC1);
  expect(aC1?.links?.[1]?.bubbles[1].id).toBe(idBr);

  expect(aBr?.links?.length).toBe(2);

  expect(aC2?.links?.length).toBe(2);
  expect(aC2?.links?.[0]?.bubbles[0].id).toBe(idBr);
  expect(aC2?.links?.[0]?.bubbles[1].id).toBe(idC2);
  expect(aC2?.links?.[0]?.use).toBeUndefined();
  expect(aC2?.links?.[1]?.use).toBeUndefined();
  expect(aC2?.links?.[1]?.bubbles[1].id).toBe(idF);

  expect(aF?.links?.length).toBe(2);

  expect(aGr?.links?.length).toBe(1);
  expect(aGr?.id).toBe(idGroup);
  expect(aGr?.links?.[0]?.bubbles[0].id).toBe(idF);
})