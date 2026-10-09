import { ElementId } from "charchem2/types/ElementId";
import { AtomDef, LinkDef, SrcTemplate, TemplatePos } from "./SrcTemplate";

export type DstAtomDef = {
  id: ElementId;
  count: number;
}

export type DstStructAtomDef = Omit<AtomDef, "id"> & {
  id: ElementId;
}
export type DstTargetStruct = {
  code: string;
  atoms: DstStructAtomDef[];
  links?: LinkDef[];
}


export type DstTemplate = {
  pos: TemplatePos;
  mirror?: boolean;
  struct: DstTargetStruct;
  def: DstAtomDef[];
}

