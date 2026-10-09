import { Bubble } from "../../../Bubble";

export const getSingleAtom = ({use, nested}: Bubble): Bubble | undefined => {
  if (use.type !== "group") return undefined;

  // если у группы количественный коэффициент != 1, то она не подходит для представления единичного атома
  if (nested?.length !== 1) return undefined;

  const single = nested[0];
  if (single?.use.type !== "atom") return undefined;
  
  // нельзя считать единичным атомом, если количественный коэффициент не 1
  if ((single.use.count ?? 1) !== 1) return undefined;
  return single;
}