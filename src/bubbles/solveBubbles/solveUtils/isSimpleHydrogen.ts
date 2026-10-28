import { Bubble } from "../../Bubble";

/**
 * Коллапсировать мржно только простой водород
 */
export const isSimpleHydrogen = ({use}: Bubble): boolean => {
  if (use.type !== "atom") return false;
  if (use.atom.id !== "H") return false;
  if (use.mass || use.charge !== undefined) return false;
  return true;
}