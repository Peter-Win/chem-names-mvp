import { PeriodicTable } from "charchem2/core/PeriodicTable";
import { createBubble } from "../../../bubblesBase/createBubble"
import { changeToSingleAtom } from "./changeToSingleAtom";
import { ElementId } from "charchem2/types/ElementId";
import { linkBubbles } from "../../../bubblesBase/linkBubbles";

test("changeToSingleAtom", () => {
  const idRoot = -1;
  const idNodeCl = -2;
  const idCl = -3;

  const root = createBubble({type: "root"}, undefined, idRoot);

  const createNode = (p: {id: ElementId, idNode?: number, idAtom?: number}) => {
    const {id, idNode, idAtom} = p;
    const node = createBubble({type: "group", charge: -1}, root, idNode);
    const atom = createBubble({type: "atom", atom: PeriodicTable.dict[id]}, node, idAtom);
    return {node, atom};
  }

  const {node: nodeCl, atom: atomCl} = createNode({id: "Cl", idNode: idNodeCl, idAtom: idCl});
  const {node: nodeH} = createNode({id: "H"});
  linkBubbles(nodeCl, nodeH, {type: "bond", order: 1})

  changeToSingleAtom(nodeCl, atomCl);
  expect(nodeCl.id).toBe(idNodeCl);
  expect(nodeCl.links?.length).toBe(1);
  expect(nodeCl.owner?.id).toBe(idRoot);
  expect(nodeCl.nested).toBeUndefined();
  expect(nodeCl.use.type).toBe("atom");
  expect(nodeCl.use).toHaveProperty("atom.id", "Cl");
  expect(nodeCl.use).toHaveProperty("charge", -1); // заряд берётся из узла (т.е. группы)

  expect(atomCl.owner).toBeUndefined();
})