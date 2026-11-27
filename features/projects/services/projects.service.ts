// features/projects/services/projects.service.ts
import "server-only";
import { cache } from "react";
import type { Prisma, ProjectKind } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const published = { status: "published" } as const;
const ordering: Prisma.ProjectOrderByWithRelationInput[] = [{ order: "asc" }, { slug: "asc" }];

const cardSelect = {
  slug: true,
  name: true,
  coverImageUrl: true,
  descriptionEn: true,
  descriptionFa: true,
  descriptionAr: true,
  kind: true,
  stage: true,
  year: true,
  badges: true,
} satisfies Prisma.ProjectSelect;

const detailSelect = {
  ...cardSelect,
  overviewEn: true,
  overviewFa: true,
  overviewAr: true,
  stack: true,
  url: true,
  sourceUrl: true,
  posts: {
    where: { post: { status: "published", publishedAt: { not: null } } },
    orderBy: { post: { publishedAt: "desc" } },
    select: {
      post: {
        select: {
          slug: true,
          titleEn: true,
          titleFa: true,
          titleAr: true,
          publishedAt: true,
          category: { select: { nameEn: true, nameFa: true, nameAr: true } },
        },
      },
    },
  },
} satisfies Prisma.ProjectSelect;

export type ProjectCardData = Prisma.ProjectGetPayload<{ select: typeof cardSelect }>;
export type ProjectDetailData = Prisma.ProjectGetPayload<{ select: typeof detailSelect }>;

export function listPublishedProjects(kind?: ProjectKind): Promise<ProjectCardData[]> {
  return prisma.project.findMany({
    where: { ...published, kind },
    orderBy: ordering,
    select: cardSelect,
  });
}

const homeSelect = { ...cardSelect, isFeatured: true, stack: true } satisfies Prisma.ProjectSelect;

export type HomeProjectData = Prisma.ProjectGetPayload<{ select: typeof homeSelect }>;

/** Published projects for the home showcase (card fields plus isFeatured and stack). */
export function listHomeProjects(): Promise<HomeProjectData[]> {
  return prisma.project.findMany({ where: published, orderBy: ordering, select: homeSelect });
}

/** Cached per request: used by both generateMetadata and the page. */
export const getProjectBySlug = cache(
  (slug: string): Promise<ProjectDetailData | null> =>
    prisma.project.findFirst({ where: { ...published, slug }, select: detailSelect }),
);

/** The following project by order, wrapping around. Null when there is no other one. */
export async function getNextProject(
  slug: string,
): Promise<{ slug: string; name: string } | null> {
  const all = await prisma.project.findMany({
    where: published,
    orderBy: ordering,
    select: { slug: true, name: true },
  });
  const index = all.findIndex((p) => p.slug === slug);
  if (index === -1 || all.length < 2) return null;
  return all[(index + 1) % all.length];
}
