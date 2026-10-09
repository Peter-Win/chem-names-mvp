import { ChemObj } from "charchem2/core/ChemObj";
import { Bubble } from "../Bubble";
import { createBubble } from "../bubblesBase/createBubble";
import { ChemAgent } from "charchem2/core/ChemAgent";
import { ChemExpr } from "charchem2/core/ChemExpr";
import { linkBubbles } from "../bubblesBase/linkBubbles";
import { ChemNode } from "charchem2/core/ChemNode";
import { textFormula } from "charchem2/textBuilder/textFormula";
import { ChemNodeItem } from "charchem2/core/ChemNodeItem";
import { appendBubble } from "../bubblesBase/appendBubble";
import { ChemAtom } from "charchem2/core/ChemAtom";
import { BubbleGroup, BubbleType } from "../BubbleType";
import { ChemBond } from "charchem2/core/ChemBond";

/**
 * 
 * @param src 
 * @returns 
 * @throws {Error} Can throw exception
 */
export const buildBubble = (src: ChemObj): Bubble => {
  const root = createBubble({type: "root"});
  if (src instanceof ChemExpr) {
    const agents = src.getAgents();
    if (agents.length === 1) {
      // single-agent expression
      buildAgent(agents[0]!, root);
    } else {
      // multi-agent expression
      let prevBubble: Bubble | undefined;
      agents.forEach(agent => {
        const groupBubble = createBubble({type: "group"}, root);
        buildAgent(agent, groupBubble);
        if (prevBubble) {
          linkBubbles(prevBubble, groupBubble);
        }
        prevBubble = groupBubble;
      });
    }
  } else if (src instanceof ChemAgent) {
    buildAgent(src, root);
  }
  return root;
}

const buildAgent = (src: ChemAgent, owner: Bubble) => {
  const nodesMap: Bubble[] = [];
  src.commands.forEach(cmd => {
    if (cmd instanceof ChemNode) {
      const bubble = buildNode(cmd, owner);
      nodesMap[cmd.index] = bubble;
    } else if (cmd instanceof ChemBond) {
      // связи обрабатываются во втором проходе, когда будет получена вся информация по узлам
      return;
    } else {
      throw Error(mkUnknownMsg("command", cmd, src));
    }
  });
  src.bonds.forEach(bond => {
    const nodes = bond.nodes.filter(n => !!n);
    if (nodes.length == 2) {
      const srcIndex = nodes[0]!.index;
      const dstIndex = nodes[1]!.index;
      const srcBubble = nodesMap[srcIndex];
      const dstBubble = nodesMap[dstIndex];
      if (!srcBubble || !dstBubble) {
        throw Error(`No bubbles found for nodes ${srcIndex} and ${dstIndex}`);
      }
      linkBubbles(srcBubble, dstBubble, {
        type: "bond",
        order: bond.n,
      });
    } else {
      // пока работаем только со связями, которые соединяют два узла
      throw Error(`Bonds with a node count of ${nodes.length} are not supported.`);
    }
  })
}

const buildNode = (src: ChemNode, owner: Bubble): Bubble => {
  const use: BubbleGroup = {
    type: "group",
    get label() {
      return textFormula(src, "text");
    }
  };
  if (src.charge) {
    use.charge = src.charge.value;
  }
  const result = createBubble(use, owner);
  if (src.autoMode) {
    const [c, h] = src.items;
    if (!(c?.obj instanceof ChemAtom && c.obj.id === "C")) {
      throw Error(`Expected C atom in auto node #${src.index}`);
    }
    let H: number | undefined;
    if (h?.obj instanceof ChemAtom && h.obj.id === "H") {
      H = h.n.num;
    }
    createBubble({type: "atom", atom: c.obj, H, count: 1}, result);
  } else {
    let prevBubble: Bubble | undefined;
    src.items.forEach(it => {
      const bubble = buildNodeItem(it, src);
      appendBubble(result, bubble);
      if (prevBubble) {
        linkBubbles(prevBubble, bubble);
      }
      prevBubble = bubble;
    });
  }
  return result;
}

const buildNodeItem = (item: ChemNodeItem, node: ChemNode): Bubble => {
  const {obj} = item;
  let use: BubbleType | undefined;
  if (obj instanceof ChemAtom) {
    use = {
      type: "atom",
      atom: obj,
    }
    if (item.n.isAbstract()) {
      throw Error(mkUnknownMsg("coefficient", obj, node));
    }
    use.count = item.n.num;
  }
  if (!use) {
    throw Error(mkUnknownMsg("node item", obj, node))
  }
  if (typeof item.mass === "number" && use.type === "atom") {
    use.mass = item.mass;
  }
  return createBubble(use);
}

const mkUnknownMsg = (what: string, who: ChemObj, where: ChemObj): string => {
  const whoTx = textFormula(who, "text");
  const whereTx = textFormula(where, "text");
  return `Unknown ${what} ${whoTx} in <${whereTx}>`
}