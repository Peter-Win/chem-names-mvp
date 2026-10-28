import { Bubble } from "../../Bubble";
import { externalValency } from "./externalValency";
import { internalValency } from "./internalValency";

export const getValency = (bubble: Bubble) => {
  const int = internalValency(bubble);
  const ext = externalValency(bubble);
  const free = int - ext;
  return {int, ext, free};
}