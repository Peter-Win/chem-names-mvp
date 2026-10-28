import { resolveComplexBubble } from "./resolveComplexBubble";
import { deleteBubble } from "../../../bubblesBase/deleteBubble";
import { unlinkBubbles } from "../../../bubblesBase/unlinkBubbles";
import { linkBubbles } from "../../../bubblesBase/linkBubbles";
import { makeTestNode, makeTestNodeLoc } from "../../tests/makeTestNode";

describe("resolveComplexBubble", () => {
  it("is not complex node", () => {
    const {log, lastMsg} = mkLog();
    expect(resolveComplexBubble(makeTestNode("H2"), log)).toBeUndefined();
    expect(lastMsg()).toBe("is not complex node");
    expect(resolveComplexBubble(makeTestNode("NH3"), log)).toBeUndefined();
    expect(lastMsg()).toBe("is not complex node");
  });

  it("undefined valency", () => {
    const {log, lastMsg} = mkLog();
    const node = makeTestNode("CH3CH2OH");
    const {nested} = node; 
    if (nested?.[0]?.use.type === "atom") {
      expect(nested?.[0]?.use.valency).toBeUndefined();
    }
    resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("undefined valency for 0 item");
  });

  it("bubble already solved", () => {
    const {log, lastMsg} = mkLog();
    const node = makeTestNodeLoc("OCH2");
    const [o, c, h] = node.nested!;
    unlinkBubbles(o!, c!);
    if (o?.use.type === "atom") {
      linkBubbles(o, c!, {type: "bond", order: 2});
    }
    if (c?.use.type === "atom") {
      c.use.H = 2;
    }
    deleteBubble(h!);

    resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("already solved");
  });

  it("edgeLeft", () => {
    // free val: 41 41 21
    //           CH3CH2OH
    // index:    01 23 45
    // тут два углерода соседствуют с H3, но выбор падает на того, у кого один сосед
    const {log, lastMsg} = mkLog();
    const node = makeTestNodeLoc("CH3CH2OH");
    const res = resolveComplexBubble(node, log)!;
    expect(res).toBeDefined();
    expect(node.nested?.indexOf(res.main)).toBe(0);
    expect(node.nested?.indexOf(res.slave)).toBe(1);
    expect(lastMsg()).toBe("edgeLeft: 0:C{~1} > 1:H3{~0}{~2}");
  });

  it("edgeRight", () => {
    // free val: 121 41 4
    //           HOH2CH3C
    // index:    012 34 5
    const {log, lastMsg} = mkLog();
    const node = makeTestNodeLoc("HOH2CH3C");
    const res = resolveComplexBubble(node, log)!;
    expect(res).toBeDefined();
    expect(node.nested?.indexOf(res.main)).toBe(5);
    expect(node.nested?.indexOf(res.slave)).toBe(4);
    expect(lastMsg()).toBe("edgeRight: 5:C{~4} > 4:H3{~3}{~5}");
  });

  it.each([
    ["HF2COH", "doubleMin: 2:C{~1}{~3} > 1:F2{~0}{~2}"],
    ["F2HCOH" ,"doubleMin: 2:C{~1}{~3} > 1:H{~0}{~2}"],
    ["HCF2OH", "edgeLeft: 1:C{~0}{~2} > 0:H{~1}"],
    ["F2CHOH", "edgeLeft: 1:C{~0}{~2} > 0:F2{~1}"],
  ])("Expect for %s: %d -> %d", (code, msg) => {
    const {log, lastMsg} = mkLog();
    const node = makeTestNodeLoc(code);
    const res = resolveComplexBubble(node, log);
    expect(res).toBeDefined();
    expect(lastMsg()).toBe(msg);
  });

});


const mkLog = () => {
  const msgList: string[] = [];
  return {
    msgList,
    log: (msg: string) => {
      msgList.push(msg);
    },
    lastMsg(): string {
      return msgList[msgList.length - 1] ?? "";
    }
  }
}