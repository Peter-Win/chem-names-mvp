import { Bubble } from "../../../Bubble";
import { createBubble } from "../../../bubblesBase/createBubble";
import { deleteBubble } from "../../../bubblesBase/deleteBubble";
import { getLinkEnd } from "../../../bubblesBase/getLinkEnd";
import { linkBubbles } from "../../../bubblesBase/linkBubbles";
import { unlinkBubbles } from "../../../bubblesBase/unlinkBubbles";
import { isSimpleHydrogen } from "../../solveUtils/isSimpleHydrogen";
import { freeValency } from "../../valency/freeValency";
import { ComplexNodeRes } from "./resolveComplexBubble";

// Решено оставлять неопределённую связь между оставшимися пузырями.
// Потому что это самый простой способ понять, решена ли общая группа или нет. По наличию таких связей.
// [left]~[bubble]~[right]  ==>   [left]~[right]
//                                   [bubble]
const removeUndefinedLinks = (bubble: Bubble) => {
  const undefinedLinks = bubble.links?.filter(({use}) => !use) ?? [];
  const [link1, link2] = undefinedLinks;
  const left = link1 ? getLinkEnd(link1, bubble) : undefined;
  const right = link2 ? getLinkEnd(link2, bubble) : undefined;
  if (left) unlinkBubbles(bubble, left);
  if (right) unlinkBubbles(bubble, right);
  if (left && right) {    
    linkBubbles(left, right);
  }
}

export const execComplexNodeRes = ({main, slave}: ComplexNodeRes) => {
  removeUndefinedLinks(slave);
  if (isSimpleHydrogen(slave) && slave.use.type === "atom" && main.use.type === "atom") {
    main.use.H = slave.use.count ?? 1;
    deleteBubble(slave);
  } else {
    const order = Math.min(freeValency(main), freeValency(slave));
    const slaveCount = "count" in slave.use ? (slave.use.count ?? 1) : 1;
    // если присоединяемый пузырь один, то можно его переиспользовать
    if (slaveCount === 1) {
      linkBubbles(main, slave, {type: "bond", order});
    } else {
      // предполагается, что это атом. потому что группы используют скобки Al2(SO4)3
      const {use} = slave;
      if (use.type === "atom") {
        deleteBubble(slave);
        use.count = 1;
        for (let i=0; i<slaveCount; i++) {
          const newSlave = createBubble({...use}, main.owner);
          linkBubbles(main, newSlave, {type: "bond", order});
        }
      } else {
        throw Error(`Invalid bubble type ${slave.use.type} with count=${slaveCount}`);
      }
    }
  }
}