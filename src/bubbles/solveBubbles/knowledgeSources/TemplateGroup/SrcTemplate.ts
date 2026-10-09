import { ElementId } from "charchem2/types/ElementId";
import { BubbleAtom } from "../../../BubbleType";

export type TemplatePos = "any" | "begin" | "end" | "edge";

export type AtomDef = Omit<BubbleAtom, "type" | "atom"> & {
  id: ElementId | "?";
}
export type LinkDef = [number, number, number ]; // [from, to, order]

export type TargetStruct = {
  atoms: AtomDef[];
  links?: LinkDef[];
}

export type SrcTemplate = {
  code: string;
  pos: TemplatePos;
  struct: TargetStruct;
  cases?: ElementId[];
  mirror?: boolean;
}
