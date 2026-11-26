// prisma/seed-dev.ts
//
// DEVELOPMENT-ONLY demo data so every page of the site can be viewed in debug mode
// (extra posts, projects, newsletter issues and their links).
//
//   pnpm db:seed:dev            # needs `pnpm db:seed` and the content import first
//   pnpm db:init:demo           # system seed + content import + this demo seed
//
// Rules:
//  - Never runs in production, and by default refuses a non-local database
//    (pass --allow-remote to override on purpose).
//  - Insert-only (createMany + skipDuplicates): re-running changes nothing and never
//    overwrites edits. To start over use `pnpm db:reset`.
//  - Does NOT use the release lock or the system-owned SeedHistory/ContentSync tables;
//    demo data is not part of any released seed version.
import { config as loadDotenv } from "dotenv";
import type { Prisma, PrismaClient } from "@prisma/client";
import { createReleaseClient } from "./lib/client";
import { resolveDatabaseUrl } from "./lib/connection";
import { createLogger, errorMessage } from "./lib/log";
import { describeInsert } from "./seed/utils/helpers";
import {
  AUTHOR_SLUG,
  DEMO_ISSUES,
  DEMO_POSTS,
  DEMO_PROJECTS,
  PROJECT_POST_LINKS,
} from "./seed/dev/sample-data";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]", "host.docker.internal"]);

function isLocalDatabase(url: string): boolean {
  try {
    return LOCAL_HOSTS.has(new URL(url).hostname);
  } catch {
    return false;
  }
}

function idBySlug(rows: { id: string; slug: string }[]): Map<string, string> {
  return new Map(rows.map((row) => [row.slug, row.id]));
}

function required(map: Map<string, string>, slug: string, what: string): string {
  const id = map.get(slug);
  if (!id) {
    throw new Error(`${what} "${slug}" not found. Run \`pnpm db:seed\` first.`);
  }
  return id;
}

async function seedDemo(
  tx: Prisma.TransactionClient,
  log: ReturnType<typeof createLogger>,
): Promise<void> {
  const author = await tx.author.findUnique({ where: { slug: AUTHOR_SLUG }, select: { id: true } });
  if (!author) throw new Error(`Author "${AUTHOR_SLUG}" not found. Run \`pnpm db:seed\` first.`);
  const categories = idBySlug(await tx.category.findMany({ select: { id: true, slug: true } }));
  const tags = idBySlug(await tx.tag.findMany({ select: { id: true, slug: true } }));

  // Posts
  const postRows: Prisma.PostCreateManyInput[] = DEMO_POSTS.map(
    ({ categorySlug, tagSlugs: _tags, publishedAt, ...text }) => ({
      ...text,
      status: "published",
      publishedAt: new Date(publishedAt),
      authorId: author.id,
      categoryId: required(categories, categorySlug, "Category"),
    }),
  );
  const posts = await tx.post.createMany({ data: postRows, skipDuplicates: true });
  log.info(describeInsert("Post", posts.count, postRows.length));
  const postIds = idBySlug(await tx.post.findMany({ select: { id: true, slug: true } }));
  const postTags = DEMO_POSTS.flatMap((p) =>
    p.tagSlugs.map((tag) => ({
      postId: required(postIds, p.slug, "Post"),
      tagId: required(tags, tag, "Tag"),
    })),
  );
  const postTagResult = await tx.postTag.createMany({ data: postTags, skipDuplicates: true });
  log.info(describeInsert("PostTag", postTagResult.count, postTags.length));

  // Projects
  const projectRows: Prisma.ProjectCreateManyInput[] = DEMO_PROJECTS.map((p) => ({
    ...p,
    status: "published",
    publishedAt: new Date("2026-11-01"),
  }));
  const projects = await tx.project.createMany({ data: projectRows, skipDuplicates: true });
  log.info(describeInsert("Project", projects.count, projectRows.length));
  const projectIds = idBySlug(await tx.project.findMany({ select: { id: true, slug: true } }));
  // Optional links: skipped when the post is not in the database (e.g. content not imported).
  const links = PROJECT_POST_LINKS.flatMap((link) => {
    const projectId = projectIds.get(link.project);
    const postId = postIds.get(link.post);
    return projectId && postId ? [{ projectId, postId }] : [];
  });
  const linkResult = await tx.projectPost.createMany({ data: links, skipDuplicates: true });
  log.info(describeInsert("ProjectPost", linkResult.count, PROJECT_POST_LINKS.length));

  // Newsletter issues
  const issueRows: Prisma.NewsletterIssueCreateManyInput[] = DEMO_ISSUES.map(
    ({ categorySlug, tagSlugs: _tags, publishedAt, ...text }) => ({
      ...text,
      status: "published",
      publishedAt: new Date(publishedAt),
      authorId: author.id,
      categoryId: required(categories, categorySlug, "Category"),
    }),
  );
  const issues = await tx.newsletterIssue.createMany({ data: issueRows, skipDuplicates: true });
  log.info(describeInsert("NewsletterIssue", issues.count, issueRows.length));
  const issueIds = new Map(
    (await tx.newsletterIssue.findMany({ select: { id: true, number: true } })).map((row) => [
      row.number,
      row.id,
    ]),
  );
  const issueTags = DEMO_ISSUES.flatMap((i) =>
    i.tagSlugs.map((tag) => {
      const issueId = issueIds.get(i.number);
      if (!issueId) throw new Error(`Newsletter issue ${i.number} not found after insert.`);
      return { issueId, tagId: required(tags, tag, "Tag") };
    }),
  );
  const issueTagResult = await tx.newsletterIssueTag.createMany({
    data: issueTags,
    skipDuplicates: true,
  });
  log.info(describeInsert("NewsletterIssueTag", issueTagResult.count, issueTags.length));
}

/** Returns the process exit code. Never throws. */
export async function runDevSeed(
  argv: readonly string[],
  env: Record<string, string | undefined> = process.env,
): Promise<number> {
  const log = createLogger("seed-dev");
  const unknown = argv.filter((arg) => arg !== "--allow-remote");
  if (unknown.length > 0) {
    log.error(`Unknown argument(s): ${unknown.join(" ")}. Supported: --allow-remote`);
    return 1;
  }
  loadDotenv({ quiet: true });
  if (env.NODE_ENV === "production" || env.VERCEL_ENV === "production") {
    log.error("Refusing to run the demo seed in production.");
    return 1;
  }
  let prisma: PrismaClient | undefined;
  try {
    const url = resolveDatabaseUrl(env);
    if (!argv.includes("--allow-remote") && !isLocalDatabase(url)) {
      log.error("The database is not local. Re-run with --allow-remote only if you really mean it.");
      return 1;
    }
    prisma = createReleaseClient(url);
    await prisma.$transaction((tx) => seedDemo(tx, log), { timeout: 60_000 });
    log.info("Done.");
    return 0;
  } catch (error) {
    log.error(errorMessage(error));
    return 1;
  } finally {
    await prisma?.$disconnect().catch(() => undefined);
  }
}

runDevSeed(process.argv.slice(2))
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
