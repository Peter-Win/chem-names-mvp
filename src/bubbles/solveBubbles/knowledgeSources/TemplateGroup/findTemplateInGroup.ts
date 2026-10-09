import { Bubble } from "../../../Bubble";
import { DstTemplate } from "./DstTemplate";
import { getDstTemplates } from "./getDstTemplates";
import { matchAlkylGroup } from "./matchAlkylGroup";
import { matchTemplateInGroup } from "./matchTemplateInGroup";

export type FindResult = {
  atoms: Bubble[];
  tm: DstTemplate;
}

export const findTemplateInGroup = (bubble: Bubble): FindResult | undefined => {
  if (bubble.use.type !== "group") {
    return undefined;
  }

  // особым образом происходит анализ алкильных групп любого размера типа CₙH₂ₙ₊₁
  const alkylRes = matchAlkylGroup(bubble);
  if (alkylRes) {
    return alkylRes;
  }

  // далее поиск совпадений по списку
  for (let tm of getDstTemplates()) {
    const atoms = matchTemplateInGroup(bubble, tm);
    if (atoms) return {atoms, tm};
  }
  return undefined;
}


