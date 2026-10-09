import { Bubble } from "../../Bubble";
import { externalValency } from "./externalValency";
import { internalValency } from "./internalValency";

export const freeValency = (bubble: Bubble): number =>
  internalValency(bubble) - externalValency(bubble);