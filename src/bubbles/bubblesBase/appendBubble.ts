import { Bubble } from "../Bubble";

export const appendBubble = (owner: Bubble, nested: Bubble, index?: number) => {
  owner.nested = owner.nested ?? [];
  if (typeof index === "number") {
    owner.nested.splice(index, 0, nested);
  } else {
    owner.nested.push(nested);
  }
  nested.owner = owner;
}