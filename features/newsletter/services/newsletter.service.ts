// features/newsletter/services/newsletter.service.ts
import { prisma } from "@/lib/prisma";

export interface IssueSummary {
  number: number;
  title: string;
  summary: string;
  publishedAt: Date;
  readingTimeMin: number | null;
  authorName: string;
}

export interface IssueDetail {
  number: number;
  linkedinUrl: string;
  titleEn: string;
  titleFa: string;
  titleAr: string;
  excerptEn: string;
  excerptFa: string;
  excerptAr: string;
  contentEn: string;
  contentFa: string;
  contentAr: string;
  coverImageUrl: string | null;
  readingTimeMin: number | null;
  publishedAt: Date;
  updatedAt: Date;
  author: {
    avatarUrl: string | null;
    firstNameEn: string;
    lastNameEn: string;
    firstNameFa: string;
    lastNameFa: string;
    firstNameAr: string;
    lastNameAr: string;
  };
  /** Neighbouring published issues by number; null at either end. */
  previous: number | null;
  next: number | null;
}

const PUBLISHED = { status: "published" as const, publishedAt: { not: null } };

const pick = (locale: string, en: string, fa: string, ar: string) =>
  locale === "ar" ? ar || en : locale === "fa" ? fa || en : en;

const LIST_SELECT = {
  number: true,
  titleEn: true,
  titleFa: true,
  titleAr: true,
  excerptEn: true,
  excerptFa: true,
  excerptAr: true,
  publishedAt: true,
  readingTimeMin: true,
  author: {
    select: {
      firstNameEn: true,
      lastNameEn: true,
      firstNameFa: true,
      lastNameFa: true,
      firstNameAr: true,
      lastNameAr: true,
    },
  },
} as const;

/** Published issues, newest first (by date, then number). */
export async function getPublishedIssues(locale: string, take?: number): Promise<IssueSummary[]> {
  const rows = await prisma.newsletterIssue.findMany({
    where: PUBLISHED,
    orderBy: [{ publishedAt: "desc" }, { number: "desc" }],
    select: LIST_SELECT,
    ...(take ? { take } : {}),
  });
  return rows.flatMap((row) =>
    row.publishedAt
      ? [
          {
            number: row.number,
            title: pick(locale, row.titleEn, row.titleFa, row.titleAr),
            summary: pick(locale, row.excerptEn ?? "", row.excerptFa ?? "", row.excerptAr),
            publishedAt: row.publishedAt,
            readingTimeMin: row.readingTimeMin,
            authorName: pick(
              locale,
              `${row.author.firstNameEn} ${row.author.lastNameEn}`,
              `${row.author.firstNameFa} ${row.author.lastNameFa}`,
              `${row.author.firstNameAr} ${row.author.lastNameAr}`,
            ).trim(),
          },
        ]
      : [],
  );
}

/** Newest year first; issues keep their newest-first order inside each year. */
export function groupIssuesByYear(
  issues: IssueSummary[],
): { year: string; issues: IssueSummary[] }[] {
  const map = new Map<string, IssueSummary[]>();
  for (const issue of issues) {
    const year = String(issue.publishedAt.getUTCFullYear());
    map.set(year, [...(map.get(year) ?? []), issue]);
  }
  return [...map].map(([year, items]) => ({ year, issues: items }));
}

/** One published issue with its neighbours, or null when it does not exist. */
export async function getIssueByNumber(number: number): Promise<IssueDetail | null> {
  const row = await prisma.newsletterIssue.findFirst({
    where: { ...PUBLISHED, number },
    include: { author: true },
  });
  if (!row?.publishedAt) return null;

  const [previous, next] = await Promise.all([
    prisma.newsletterIssue.findFirst({
      where: { ...PUBLISHED, number: { lt: number } },
      orderBy: { number: "desc" },
      select: { number: true },
    }),
    prisma.newsletterIssue.findFirst({
      where: { ...PUBLISHED, number: { gt: number } },
      orderBy: { number: "asc" },
      select: { number: true },
    }),
  ]);

  return {
    number: row.number,
    linkedinUrl: row.linkedinUrl,
    titleEn: row.titleEn,
    titleFa: row.titleFa,
    titleAr: row.titleAr,
    excerptEn: row.excerptEn ?? "",
    excerptFa: row.excerptFa ?? "",
    excerptAr: row.excerptAr,
    contentEn: row.contentEn,
    contentFa: row.contentFa,
    contentAr: row.contentAr,
    coverImageUrl: row.coverImageUrl,
    readingTimeMin: row.readingTimeMin,
    publishedAt: row.publishedAt,
    updatedAt: row.updatedAt,
    author: {
      avatarUrl: row.author.avatarUrl,
      firstNameEn: row.author.firstNameEn,
      lastNameEn: row.author.lastNameEn,
      firstNameFa: row.author.firstNameFa,
      lastNameFa: row.author.lastNameFa,
      firstNameAr: row.author.firstNameAr,
      lastNameAr: row.author.lastNameAr,
    },
    previous: previous?.number ?? null,
    next: next?.number ?? null,
  };
}
