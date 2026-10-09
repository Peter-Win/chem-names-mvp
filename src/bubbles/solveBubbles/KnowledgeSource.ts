import { Bubble } from "../Bubble";
import { Assumption } from "./Assumption/Assumption";

export type KnowledgeSource = {
  name: string;
  makeAssumptions(root: Bubble): Assumption[];
}