import { DstTemplate } from "./DstTemplate";
import { makeDstTemplates } from "./makeDstTemplates";
import { srcTemplatesList } from "./srcTemplatesList";

let glbDstTemplates: DstTemplate[] | undefined;

export const getDstTemplates = (): DstTemplate[] => {
  if (glbDstTemplates) return glbDstTemplates;
  const res = srcTemplatesList.reduce(
    (acc, it) => [...acc, ...makeDstTemplates(it)], 
    [] as DstTemplate[]
  );
  glbDstTemplates = res;
  return res;
}