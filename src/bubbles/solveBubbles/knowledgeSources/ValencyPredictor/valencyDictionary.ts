import { ElementId, IsotopeId } from "charchem2/types/ElementId";

export type ValencyDictKey = ElementId | IsotopeId;

export const valencyDictionary: Partial<Record<ValencyDictKey, number | number[]>> = {
  H: 1,
  D: 1,
  T: 1,
  He: 0,
  Li: 1,
  Be: 2,
  B: 3,
  C: 4,

  O: 2,
  F: 1,
  Ne: 0,
  Na: 1,
  Mg: 2,
  Al: 3,
  Si: 4,

  Cl: 1,

  K: 1,
  Ca: 2,
  Sc: 3,

  Cu: [2, 1],

  Br: 1,
}