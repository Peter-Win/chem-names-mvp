import {ChemAtom} from "charchem2/core/ChemAtom";

// Attantion! Attention! This data is cloned using the Assign function.

export type BubbleRoot = {
  type: "root";
}

export type BubbleAtom = {
  type: "atom";
  atom: ChemAtom;
  count?: number; // 1 if not specified
  H?: number; // count of hydrogens for every single atom. total = count * H
  valency?: number;
  charge?: number;
  mass?: number; // for isotope
}

export type BubbleGroup = {
  type: "group";
  count?: number;
  charge?: number;
  readonly label?: string;
}

export type BubbleType = BubbleAtom | BubbleRoot | BubbleGroup;