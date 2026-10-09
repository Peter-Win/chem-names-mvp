import { KnowledgeSource } from "../KnowledgeSource";
import { createHydrogenCollapse } from "./HydrogenCollapse";
import { createMononuclearHydride } from "./MononuclearHydride";
import { createSingleAtom } from "./SingleAtom";

export const allKnowledgeSources = (): KnowledgeSource[] => [
  createSingleAtom(),
  createHydrogenCollapse(),
  createMononuclearHydride(),
];