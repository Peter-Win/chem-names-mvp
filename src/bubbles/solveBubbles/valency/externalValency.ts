import { Bubble } from "../../Bubble";

export const externalValency = (bubble: Bubble): number => {
  let result = 0;
  bubble.links?.forEach(({use}) => {
    if (use?.type === "bond") {
      result += use.order;
    }
  });
  const {use} = bubble;
  if ("H" in use && typeof use.H === "number") {
    result += use.H;
  }
  if ("charge" in use && typeof use.charge === "number") {
    result += Math.abs(use.charge);
  }
  if ("count" in use && typeof use.count === "number") {
    result *= use.count;
  }
  return result;
}