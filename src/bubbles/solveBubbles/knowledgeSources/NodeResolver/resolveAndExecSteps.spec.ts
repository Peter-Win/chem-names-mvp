import { Bubble } from "../../../Bubble";
import { stringifyBubble } from "../../../bubblesBase/stringifyBubble";
import { bubbleNotSolved, isBubblesSolved, isNestedSolved } from "../../solveUtils/isBubblesSolved";
import { makeTestNodeLoc } from "../../tests/makeTestNode";
import { freeValency } from "../../valency/freeValency";
import { execComplexNodeRes } from "./execComplexNodeRes";
import { resolveComplexBubble } from "./resolveComplexBubble";

describe("resolveAndExecSteps", () => {
  it("CH3CH2CH2CH2CH3", () => {
    const {log, lastMsg} = mkLog();
    const node = makeTestNodeLoc("CH3CH2CH2CH2CH3");
    expect(node.nested?.length).toBe(10);
    // 0 1  2 3  4 5  6 7  8 9
    // C~H3~C~H2~C~H2~C~H2~C~H3
    // 4 1  4 1  4 1  4 1  4 1
    const res1 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeLeft: 0:C{~1} > 1:H3{~0}{~2}");
    expect(indexOf(node, res1?.main)).toBe(0);
    execComplexNodeRes(res1!);
    expect(node.nested?.length).toBe(9);

    // CH3~C~H2~C~H2~C~H2~C~H3
    // 1   4 1  4 1  4 1  4 1
    const res2 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeLeft: 1:C{~0}{~2} > 0:C(3H){~1}");
    expect(indexOf(node, res2?.main)).toBe(1);
    execComplexNodeRes(res2!);

    // 0   1 2  3 4  5 6  7 8
    // CH3-C~H2~C~H2~C~H2~C~H3
    // 0  *3 1  4 1  4 1  4 1
    const res3 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeRight: 7:C{~6}{~8} > 8:H3{~7}");
    expect(indexOf(node, res3?.main)).toBe(7);
    execComplexNodeRes(res3!);
    expect(node.nested?.length).toBe(8);
    expect(freeValency(node.nested?.[7]!)).toBe(1);

    // 0   1 2  3 4  5 6  7
    // CH3-C~H2~C~H2~C~H2~CH3
    // 0   3 1  4 1  4 1  1*
    const res4 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("doubleMin: 5:C{~4}{~6} > 6:H2{~5}{~7}");
    expect(indexOf(node, res4?.main)).toBe(5);
    execComplexNodeRes(res4!);
    expect(node.nested?.length).toBe(7);

    // 0   1 2  3 4  5   6
    // CH3-C~H2~C~H2~CH2~CH3
    // 0   3 1  4 1  2*  1
    const res5 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("extraEdge: 5:C(2H){~4}{~6} > 6:C(3H){~5}");
    expect(indexOf(node, res5?.main)).toBe(5);
    expect(freeValency(res5!.main)).toBe(2);
    execComplexNodeRes(res5!);
    expect(freeValency(node.nested?.[5]!)).toBe(1);

    // 0   1 2  3 4  5   6
    // CH3-C~H2~C~H2~CH2-CH3
    // 0   3 1  4 1  1*  0*
    const res6 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("doubleMin: 3:C{~2}{~4} > 4:H2{~3}{~5}");
    expect(indexOf(node, res6?.main)).toBe(3);
    execComplexNodeRes(res6!);

    // 0   1 2  3   4   5
    // CH3-C~H2~CH2~CH2-CH3
    // 0   3 1  2*  1   0
    const res7 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeLeft: 1:C{-0}{~2} > 2:H2{~1}{~3}");
    expect(indexOf(node, res7?.main)).toBe(1);
    expect(indexOf(node, res7?.slave)).toBe(2);
    execComplexNodeRes(res7!);

    // 0   1   2   3   4   
    // CH3-CH2~CH2~CH2-CH3
    // 0   1*  2   1   0
    const res8 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeLeft: 2:C(2H){~1}{~3} > 1:C(2H){-0}{~2}");
    expect(indexOf(node, res8?.main)).toBe(2);
    execComplexNodeRes(res8!);

    // 0   1   2   3   4   
    // CH3-CH2-CH2~CH2-CH3
    // 0   0*  1*  1   0
    const res9 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeLeft: 2:C(2H){-1}{~3} > 3:C(2H){~2}{-4}");
    execComplexNodeRes(res9!);
    expect(freeValency(node)).toBe(0);

    // CH3-CH2-CH2-CH2-CH3
    expect(resolveComplexBubble(node, log)).toBeUndefined();
    expect(lastMsg()).toBe("already solved");
  })

  it("Acetaldehyde", () => {
    const {log, lastMsg} = mkLog();
    const node = makeTestNodeLoc("H3CCHO");
    expect(node.nested?.length).toBe(5);
    expect(freeValency(node)).toBe(1+4+4+1+2);

    // step 1 - collapse H3C
    const res1 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeLeft: 1:C{~0}{~2} > 0:H3{~1}");
    expect(res1?.main.use).toHaveProperty("atom.id", "C");
    expect(node.nested?.indexOf(res1?.main!)).toBe(1);
    expect(res1?.slave.use).toHaveProperty("atom.id", "H");
    expect(node.nested?.indexOf(res1?.slave!)).toBe(0);

    execComplexNodeRes(res1!);
    expect(node.nested?.length).toBe(4);
    expect(node.nested?.[0]?.use).toHaveProperty("H", 3);
    expect(freeValency(node)).toBe(1+4+1+2);

    // step 2    edge left
    // 0   1 2 3
    // CH3~C~H~O   => CH3-C~H~O
    // 1   4 1 2      0   3 1 2
    const res2 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeLeft: 1:C{~0}{~2} > 0:C(3H){~1}");
    expect(node.nested?.length).toBe(4);
    expect(res2).toBeDefined();
    expect(node.nested?.indexOf(res2!.main)).toBe(1);
    expect(node.nested?.indexOf(res2!.slave)).toBe(0);

    execComplexNodeRes(res2!);
    expect(node.nested?.length).toBe(4);
    expect(freeValency(node.nested?.[1]!)).toBe(3);

    // step 3  edge left
    // CH3-C~H~O  =>  CH3-CH~O
    // 0   3 1 2      0   2  2
    const res3 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeLeft: 1:C{-0}{~2} > 2:H{~1}{~3}");
    expect(res3).toBeDefined();
    expect(node.nested?.indexOf(res3!.main)).toBe(1);
    expect(node.nested?.indexOf(res3!.slave)).toBe(2);

    execComplexNodeRes(res3!);
    expect(node.nested?.length).toBe(3);
    expect(freeValency(node.nested?.[0]!)).toBe(0);
    expect(freeValency(node.nested?.[1]!)).toBe(2);
    expect(freeValency(node.nested?.[2]!)).toBe(2);
    expect(freeValency(node)).toBe(4);

    // step 4
    // CH3-CH~O  ==>  CH3-CH=O
    const res4 = resolveComplexBubble(node, log)!;
    expect(lastMsg()).toBe("edgeLeft: 1:C(H){-0}{~2} > 2:O{~1}");
    expect(res4).toBeDefined();
    execComplexNodeRes(res4);
    expect(freeValency(node)).toBe(0);

    const res5 = resolveComplexBubble(node, log);
    expect(res5).toBeUndefined();
    expect(isNestedSolved(node)).toBe(true);
    expect(lastMsg()).toBe("already solved")
  });

  it("Acetic acid", () => {
    const {log, lastMsg} = mkLog();
    const node = makeTestNodeLoc("CH3COOH");
    expect(node.nested?.length).toBe(6);
    expect(freeValency(node)).toBe(4 + 1 + 4 + 2 + 2 + 1);

    // step 1     edge left
    // 0 1  2 3 4 5      0 1 2 3 4
    // 4 1  4 2 2 1     *1 4 2 2 1
    // C~H3~C~O~O~H  =>  C~C~O~O~H
    //                  3H
    const res1 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeLeft: 0:C{~1} > 1:H3{~0}{~2}");
    expect(indexOf(node, res1?.main)).toBe(0);
    expect(indexOf(node, res1?.slave)).toBe(1);

    execComplexNodeRes(res1!);
    expect(node.nested?.length).toBe(5);
    expect(node.nested?.[0]?.use).toHaveProperty("H", 3);
    
    // step 2:    edge left
    //  0   1 2 3 4     0   1 2 3 4
    //  CH3~C~O~O~H  => CH3-C~O~O~H
    //  1   4 2 2 1     0  *3 2 2 1  <- free valency
    const res2 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeLeft: 1:C{~0}{~2} > 0:C(3H){~1}");
    expect(indexOf(node, res2?.main)).toBe(1);
    expect(indexOf(node, res2?.slave)).toBe(0);

    execComplexNodeRes(res2!);
    expect(freeValency(node)).toBe(3 + 2 + 2 + 1);

    // step 3:  acquisition
    // 0   1 2 3 4      0   1  2
    // CH3-C~O~O~H  =>  CH3-C(=O)~O~H
    // 0   3 2 2 1      0  *1  0  2 1
    const res3 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("acquisition: 1:C{-0}{~2} > 2:O{~1}{~3}");
    expect(res3?.main.use).toHaveProperty("atom.id", "C");
    expect(freeValency(res3!.main)).toBe(3);
    expect(res3?.slave.use).toHaveProperty("atom.id", "O");

    execComplexNodeRes(res3!);
    expect(node.nested?.length).toBe(5);
    expect(freeValency(res3!.slave)).toBe(0);
    expect(res3?.slave.links?.length).toBe(1);
    expect(res3?.slave.links?.[0]?.use).toHaveProperty("order", 2);
    expect(freeValency(node)).toBe(4);

    // step 4       left edge
    // 0   1  2  3 4
    // CH3-C(=O)~O~H  =>  CH3-C(=O)-O~H
    // 0   1  0  2 1      0   0  0  1 1  
    const res4 = resolveComplexBubble(node, log)!;
    expect(lastMsg()).toBe("edgeLeft: 3:O{~1}{~4} > 1:C{-0}{=2}{~3}");
    expect(res4.main?.use).toHaveProperty("atom.id", "O");
    expect(freeValency(res4.main)).toBe(2);
    expect(res4.slave.use).toHaveProperty("atom.id", "C");

    execComplexNodeRes(res4);
    expect(freeValency(res4.main)).toBe(1);
    expect(freeValency(node)).toBe(2);

    // step 5
    const res5 = resolveComplexBubble(node, log)!;
    expect(lastMsg()).toBe("edgeLeft: 3:O{-1}{~4} > 4:H{~3}");
    execComplexNodeRes(res5);
    expect(freeValency(node)).toBe(0);

    expect(resolveComplexBubble(node, log)).toBeUndefined();
    expect(isNestedSolved(node)).toBe(true);
    expect(lastMsg()).toBe("already solved");
  });

  it("HOHF2C", () => {
    const {log, lastMsg} = mkLog();
    //                             0123 4
    const node = makeTestNodeLoc("HOHF2C");
    expect(node.nested?.length).toBe(5);

    // step 1    right edge
    // 0 1 2 3  4       0 1 2 3  4  5
    // H~O~H~F2~C  ==>  H~O~H~C(-F)-F
    // 1 2 1 2  4       1 2 1 2  0  0
    const res1 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeRight: 4:C{~3} > 3:F2{~2}{~4}");
    expect(indexOf(node, res1?.main)).toBe(4);
    expect(indexOf(node, res1?.slave)).toBe(3);
    execComplexNodeRes(res1!);
    expect(node.nested?.length).toBe(6);
    expect(node.nested?.[3]?.use).toHaveProperty("atom.id", "C");
    expect(node.nested?.[4]?.use).toHaveProperty("atom.id", "F");
    expect(node.nested?.[5]?.use).toHaveProperty("atom.id", "F");
    expect(unsolvedCount(node)).toBe(4);

    // step 2       left edge
    // 0 1 2 3  4   5       0  1 2  3  4
    // H~O~H~C(-F)(-F)  =>  OH~H~C(-F)-F
    // 1 2 1 2  0   0       1  1 2
    const res2 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeLeft: 1:O{~0}{~2} > 0:H{~1}");
    expect(indexOf(node, res2?.main)).toBe(1);
    expect(indexOf(node, res2?.slave)).toBe(0);

    execComplexNodeRes(res2!);
    expect(node.nested?.length).toBe(5);
    expect(freeValency(node.nested?.[2]!)).toBe(2)
    expect(unsolvedCount(node)).toBe(3);

    // step 3     edge right
    // 0  1 2  3  4       0  1   2  3
    // OH~H~C(-F)-F  ==>  OH~CH(-F)-F
    // 1  1 2             1  1
    const res3 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeRight: 2:C{~1}{-3}{-4} > 1:H{~0}{~2}");
    expect(indexOf(node, res3?.main)).toBe(2);
    expect(indexOf(node, res3?.slave)).toBe(1);

    execComplexNodeRes(res3!);
    expect(node.nested?.length).toBe(4);
    expect(freeValency(node)).toBe(2);
    expect(unsolvedCount(node)).toBe(2);

    // step 4
    const res4 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeLeft: 0:O(H){~1} > 1:C(H){~0}{-2}{-3}")
    expect(indexOf(node, res4?.main)).toBe(0);
    expect(indexOf(node, res4?.slave)).toBe(1);
    expect(node.nested?.[0]?.links?.length).toBe(1);

    execComplexNodeRes(res4!);
    expect(freeValency(node)).toBe(0);
    expect(unsolvedCount(node)).toBe(0);

    expect(resolveComplexBubble(node, log)).toBeUndefined();
    expect(isNestedSolved(node)).toBe(true);
    expect(lastMsg()).toBe("already solved");
  })


  it("H2CBrCFH2", () => {
    const {log, lastMsg} = mkLog();
    //                            0 12 345
    const node = makeTestNodeLoc("H2CBrCFH2");
    expect(node.nested?.length).toBe(6);

    // step 1     left edge
    //  0 1 2  3 4 5       0   1  2 3 4
    // H2~C~Br~C~F~H2  =>  CH2~Br~C~F~H2
    //  1 4 1  4 1 1       2   1  4 1 1
    const res1 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeLeft: 1:C{~0}{~2} > 0:H2{~1}");
    expect(indexOf(node, res1?.main)).toBe(1);
    expect(indexOf(node, res1?.slave)).toBe(0);

    execComplexNodeRes(res1!);
    expect(node.nested?.length).toBe(5);
    expect(node.nested?.[0]?.use).toHaveProperty("H", 2);

    // step 2        doubleMin
    // 0   1  2 3 4          0   1  2  3  4
    // CH2~Br~C~F~H2   ==>   CH2~Br~C(-F)~H2
    // 2   1  4 1 1          2   1  3*    1
    const res2 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("doubleMin: 2:C{~1}{~3} > 3:F{~2}{~4}");
    expect(indexOf(node, res2?.main)).toBe(2);
    expect(indexOf(node, res2?.slave)).toBe(3);

    execComplexNodeRes(res2!);
    expect(freeValency(res2!.slave)).toBe(0);
    expect(stringifyBubble(res2!.main)).toBe("2:C{~1}{-3}{~4}");

    // step 3       right edge
    // 0   1  2  3  4        0   1  2   3
    // CH2~Br~C(-F)~H2  ==>  CH2~Br~CH2-F
    // 2   1  3     1        2   1  1*
    const res3 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeRight: 2:C{~1}{-3}{~4} > 4:H2{~2}");
    expect(indexOf(node, res3?.main)).toBe(2);
    expect(indexOf(node, res3?.slave)).toBe(4);

    execComplexNodeRes(res3!);
    expect(node.nested?.length).toBe(4)
    expect(res3?.main.use).toHaveProperty("H", 2);
    expect(freeValency(res3!.main)).toBe(1);

    // step 4     left edge
    // CH2~Br~CH2-F  ==> CH2(-Br)~CH2-F
    // 2   1  1   0      1*   0   1   0
    const res4 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeLeft: 0:C(2H){~1} > 1:Br{~0}{~2}");
    expect(indexOf(node, res4?.main)).toBe(0);
    expect(indexOf(node, res4?.slave)).toBe(1);

    execComplexNodeRes(res4!);
    expect(freeValency(node)).toBe(2);

    const res5 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeLeft: 0:C(2H){-1}{~2} > 2:C(2H){~0}{-3}");
    execComplexNodeRes(res5!)
    expect(freeValency(node)).toBe(0);
    expect(isNestedSolved(node)).toBe(true);

    const res6 = resolveComplexBubble(node, log);
    expect(res6).toBeUndefined();
    expect(lastMsg()).toBe("already solved");
  });

  it("H2BCH2BH2", () => {
    const {log, lastMsg} = mkLog();
    const node = makeTestNodeLoc("H2BCH2BH2");
    expect(node.nested?.length).toBe(6);

    // 0  1 2 3  4 5
    // H2~B~C~H2~B~H2
    // 1  3 4 1  3 1
    const res1 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("extraEdge: 4:B{~3}{~5} > 5:H2{~4}");
    expect(indexOf(node, res1?.main)).toBe(4);
    execComplexNodeRes(res1!);
    expect(node.nested?.length).toBe(5);

    // 0  1 2 3  4
    // H2~B~C~H2~BH2
    // 1  3 4 1  1*
    const res2 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("doubleMin: 2:C{~1}{~3} > 3:H2{~2}{~4}");
    execComplexNodeRes(res2!);

    // 0  1 2   3
    // H2~B~CH2~BH2
    // 1  3 2*  1
    const res3 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeLeft: 1:B{~0}{~2} > 0:H2{~1}");
    execComplexNodeRes(res3!);
    expect(node.nested?.length).toBe(3);

    //   0 1   2
    // H2B~CH2~BH2
    //  *1 2   1
    const res4 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeLeft: 1:C(2H){~0}{~2} > 0:B(2H){~1}");
    execComplexNodeRes(res4!);
    expect(isNestedSolved(node)).toBe(false);

    // BH2-CH2~BH2
    const res5 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeLeft: 1:C(2H){-0}{~2} > 2:B(2H){~1}");
    execComplexNodeRes(res5!);
    expect(freeValency(node)).toBe(0);
    expect(isNestedSolved(node)).toBe(true);

    // BH2-CH2-BH2
    expect(resolveComplexBubble(node, log)).toBeUndefined();
    expect(lastMsg()).toBe("already solved");
  });

  it("H2BCH2OBH2", () => {
    const {log, lastMsg} = mkLog();
    const node = makeTestNodeLoc("H2BCH2OBH2");
    // 0  1 2 3  4 5 6
    // H2~B~C~H2~O~B~H2
    // 1  3 4 1  2 3 1
    const res1 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("attraction: 2:C{~1}{~3} > 3:H2{~2}{~4}");
    execComplexNodeRes(res1!);
    // 0  1 2   3 4 5
    // H2~B~CH2~O~B~H2
    // 1  3 2*  2 3 1
    const res2 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeLeft: 1:B{~0}{~2} > 0:H2{~1}");
    execComplexNodeRes(res2!);
    expect(node.nested?.length).toBe(5);
    // 0   1   2 3 4
    // BH2~CH2~O~B~H2
    // 1   2   2 3
    const res3 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeRight: 3:B{~2}{~4} > 4:H2{~3}");
    execComplexNodeRes(res3!);
    // 0   1   2 3 
    // BH2~CH2~O~BH2
    // 1   2   2 1
    const res4 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeLeft: 1:C(2H){~0}{~2} > 0:B(2H){~1}");
    execComplexNodeRes(res4!);
    // 0   1   2 3 
    // BH2-CH2~O~BH2
    // 0*  1*  2 1
    const res5 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeLeft: 2:O{~1}{~3} > 1:C(2H){-0}{~2}");
    execComplexNodeRes(res5!);
    // 0   1   2 3 
    // BH2-CH2-O~BH2
    // 0   0* *1 1
    const res6 = resolveComplexBubble(node, log);
    expect(lastMsg()).toBe("edgeLeft: 2:O{-1}{~3} > 3:B(2H){~2}");
    execComplexNodeRes(res6!);
    expect(freeValency(node)).toBe(0);
    expect(isNestedSolved(node)).toBe(true);
  });
});

const indexOf = (node: Bubble, target: Bubble | undefined): number =>
  (target ? node.nested?.indexOf(target) : undefined) ?? -1;

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

const unsolved = (node: Bubble) => node.nested?.filter(it => bubbleNotSolved(it)) ?? [];

const unsolvedCount = (node: Bubble) => unsolved(node).length;