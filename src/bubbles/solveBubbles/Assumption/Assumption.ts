import { Bubble } from "../../Bubble";
import { AssumptionType } from "./AssumptionType"

export type Assumption = {
  type: AssumptionType;
  scope: Bubble;
  apply: () => void;
}