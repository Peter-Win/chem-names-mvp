import { KnowledgeSource } from "../KnowledgeSource";
import { createGroupExplode } from "./GroupExplode";
import { createHydrogenCollapse } from "./HydrogenCollapse";
import { createMononuclearHydride } from "./MononuclearHydride";
import { createNodeResolver } from "./NodeResolver";
import { createRollback } from "./Rollback";
import { createSingleAtom } from "./SingleAtom";
import { createTemplateGroup } from "./TemplateGroup/TemplateGroup";
import { createValencyPredictor } from "./ValencyPredictor";

export const allKnowledgeSources = (): KnowledgeSource[] => [
  createSingleAtom(),
  createHydrogenCollapse(),
  createMononuclearHydride(),
  createTemplateGroup(),
  createValencyPredictor(),
  createNodeResolver(),
  createGroupExplode(),
  createRollback(),
];