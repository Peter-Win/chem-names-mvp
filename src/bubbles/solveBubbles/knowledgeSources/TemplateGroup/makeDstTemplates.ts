import { compile } from "charchem2/compiler/compile";
import { DstAtomDef, DstTargetStruct, DstTemplate } from "./DstTemplate";
import { SrcTemplate, TargetStruct } from "./SrcTemplate";
import { ElementId } from "charchem2/types/ElementId";

export const makeDstTemplates = (src: SrcTemplate): DstTemplate[] => {
  if (!src.cases) {
    return [singleDstTemplate(src)];
  }
  return src.cases.map(elemId => {
    const inst: SrcTemplate = {
      code: src.code.replace("?", elemId),
      pos: src.pos,
      mirror: src.mirror,
      struct: {
        atoms: src.struct.atoms.map(({id, ...rest}) => ({
          id: id === "?" ? elemId : id,
          ...rest,
        })),
        links: src.struct.links,
      },
    } 
    return singleDstTemplate(inst);
  })
}

const singleDstTemplate = (src: SrcTemplate): DstTemplate => {
  const {code, pos, mirror, struct} = src;
  const expr = compile(code);
  let count = 0;
  const def: DstAtomDef[] = [];
  expr.walk({
    itemPre(obj) {
      count = obj.n.num;
    },
    atom({id}) {
      def.push({id: id as ElementId, count})
    },
  })
  return {
    pos, 
    mirror, 
    struct: {...struct as DstTargetStruct, code}, 
    def,
  };
}