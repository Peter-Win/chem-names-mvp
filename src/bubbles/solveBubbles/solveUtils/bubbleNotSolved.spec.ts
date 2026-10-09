import { PeriodicTable } from "charchem2/core/PeriodicTable";
import { createBubble } from "../../bubblesBase/createBubble"
import { bubbleNotSolved } from "./isBubblesSolved";
import { linkBubbles } from "../../bubblesBase/linkBubbles";

const createTestBubbles = () => {
    const root = createBubble({type: "root"});
    const node = createBubble({type: "group"}, root);
    const {dict} = PeriodicTable;
    const c = createBubble({type: "atom", atom: dict.C}, node);
    const h = createBubble({type: "atom", atom: dict.H, count: 4}, node);
    return {root, node, c, h};
}

describe("bubbleNotSolved", () => {
  
  it("root is always solvable", () => {
    const {root} = createTestBubbles();
    expect(bubbleNotSolved(root)).toBe(false);
  });

  it("group is never solvable", () => {
    const {node} = createTestBubbles();
    expect(bubbleNotSolved(node)).toBe(true);
  })

  it("atom is not solved with undefined links", () => {
    const {c, h} = createTestBubbles();
    linkBubbles(c, h);
    expect(bubbleNotSolved(c)).toBe(true);
    expect(bubbleNotSolved(h)).toBe(true);
  })

  it("atom is solved with defined links", () => {
    const {c, h} = createTestBubbles();
    linkBubbles(c, h, {type: "bond", order: 1});
    expect(bubbleNotSolved(c)).toBe(false);
    expect(bubbleNotSolved(h)).toBe(false);
  })

});