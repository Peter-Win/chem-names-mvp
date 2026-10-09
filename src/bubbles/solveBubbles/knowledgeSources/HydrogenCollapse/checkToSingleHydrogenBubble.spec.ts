import { PeriodicTable } from "charchem2/core/PeriodicTable";
import { createBubble } from "../../../bubblesBase/createBubble"
import { linkBubbles } from "../../../bubblesBase/linkBubbles";
import { checkToSingleHydrogenBubble } from "./checkToSingleHydrogenBubble";
import { unlinkBubbles } from "../../../bubblesBase/unlinkBubbles";
import { createExampleForHCollapse } from "./createExampleForHCollapse";


describe("checkToSingleHydrogenBubble", () => {
  it("success check", () => {
    const {h} = createExampleForHCollapse();
    const target = checkToSingleHydrogenBubble(h);
    expect(target?.use).toHaveProperty("atom.id", "Cl");
  });

  it("wrong bubble type", () => {
    const {root} = createExampleForHCollapse();
    expect(checkToSingleHydrogenBubble(root)).toBeUndefined();
  })

  it("wrong atom", () => {
    const {cl} = createExampleForHCollapse();
    expect(checkToSingleHydrogenBubble(cl)).toBeUndefined();
  })

  it("wrong charge", () => {
    const {h} = createExampleForHCollapse({useH: {charge: +1}});
    expect(checkToSingleHydrogenBubble(h)).toBeUndefined();
  })

  it("wrong mass", () => {
    const {h} = createExampleForHCollapse({useH: {mass: 1}});
    expect(checkToSingleHydrogenBubble(h)).toBeUndefined();
  })

  it("wrong link", () => {
    const {h, link} = createExampleForHCollapse();
    link.use = undefined;
    expect(checkToSingleHydrogenBubble(h)).toBeUndefined();

    link.use = {type: "bond", order: 1};
    expect(checkToSingleHydrogenBubble(h)).toBeDefined();

    link.use = {type: "bond", order: 2};
    expect(checkToSingleHydrogenBubble(h)).toBeUndefined();
  })

  it("wrong links count", () => {
    const {h, cl, root} = createExampleForHCollapse();
    unlinkBubbles(h, cl);
    expect(checkToSingleHydrogenBubble(h)).toBeUndefined();

    linkBubbles(h, cl, {type: "bond", order: 1});
    expect(checkToSingleHydrogenBubble(h)).toBeDefined();

    const b = createBubble({type: "atom", atom: PeriodicTable.dict.B}, root);
    linkBubbles(h, b, {type: "bond", order: 1});
    expect(checkToSingleHydrogenBubble(h)).toBeUndefined();
  })

  it("wrong hydrogen target", () => {
    const {h, cl} = createExampleForHCollapse();
    cl.use = {type: "atom", atom: PeriodicTable.dict.H};
    expect(checkToSingleHydrogenBubble(h)).toBeUndefined();
  })

  it("wrong hydrogen target", () => {
    const {h, cl} = createExampleForHCollapse();
    cl.use = {type: "group"};
    expect(checkToSingleHydrogenBubble(h)).toBeUndefined();
  })

})