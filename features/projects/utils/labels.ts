// features/projects/utils/labels.ts
import type { ProjectBadge, ProjectKind, ProjectStage } from "@prisma/client";

/* Translation keys for the project enums. Record<> makes a missing value a type error. */

/** Full name: filter chips and the label above the detail title. */
export const KIND_KEY: Record<ProjectKind, string> = {
  research: "prKindResearch",
  tool: "prKindTool",
};

/** Label above the name on a card. */
export const KIND_NOTE_KEY: Record<ProjectKind, string> = {
  research: "prNoteResearch",
  tool: "prNoteTool",
};

/** Short name used in the card meta line. */
const KIND_SHORT_KEY: Record<ProjectKind, string> = {
  research: "prShortResearch",
  tool: "prKindTool",
};

export const STAGE_KEY: Record<ProjectStage, string> = {
  prototype: "prStagePrototype",
  preProduction: "prStagePreProduction",
  live: "prStageLive",
  openSource: "prStageOpenSource",
  archived: "prStageArchived",
};

const BADGE_KEY: Record<ProjectBadge, string> = {
  personal: "prBadgePersonal",
  blockchain: "prBadgeBlockchain",
  desktop: "prBadgeDesktop",
};

/** "kind · badges · stage · year". The kind is optional and a null year is left out. */
export function projectMeta(
  t: (key: string) => string,
  project: {
    kind: ProjectKind;
    stage: ProjectStage;
    badges: ProjectBadge[];
    year: number | null;
  },
  { withKind }: { withKind: boolean },
): string {
  return [
    withKind ? t(KIND_SHORT_KEY[project.kind]) : null,
    ...project.badges.map((badge) => t(BADGE_KEY[badge])),
    t(STAGE_KEY[project.stage]),
    project.year === null ? null : String(project.year),
  ]
    .filter(Boolean)
    .join(" · ");
}

/** "kind · stage" for compact rows, e.g. "Research · Pre-production". */
export function projectRowMeta(
  t: (key: string) => string,
  project: { kind: ProjectKind; stage: ProjectStage },
): string {
  return [t(KIND_SHORT_KEY[project.kind]), t(STAGE_KEY[project.stage])].join(" · ");
}
