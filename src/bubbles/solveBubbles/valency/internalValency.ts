import { Bubble } from "../../Bubble";
import { freeValency } from "./freeValency";

export const internalValency = ({use, nested}: Bubble): number => {
  if (use.type === "atom") {
    return use.valency ?? 0;
  }
  if (use.type === "group") {
    return nested?.reduce((sum, item) => sum + freeValency(item), 0) ?? 0;
  }
  return 0;
}