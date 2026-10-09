import { Bubble } from "../../Bubble";
import { checkMononuclearHydride } from "../knowledgeSources/MononuclearHydride/checkMononuclearHydride";

export const isComplexNode = (bubble: Bubble): boolean => {
  if (bubble.use.type !== "group") return false;
  // одноатомные узлы решает специальный агент
  if ((bubble.nested?.length ?? 0) < 2) return false;
  // одноядерные гидриды не считаются сложными узлами, т.к. с высоким приоритетом их решает отдельный агент
  if (!!checkMononuclearHydride(bubble)) return false;
  return true;
}