// prisma/content/import-cli.ts
//
//   pnpm content:import [--dry-run] [--all] [--force]
//   pnpm content:force-token <slug> | newsletter:<number> | project:<slug>
//
// See docs/content-import.md.

import { config as loadDotenv } from "dotenv";
import { createReleaseClient } from "../lib/client";
import { resolveDatabaseUrl, stripPrismaParams } from "../lib/connection";
import { acquireReleaseLock } from "../lib/lock";
import { createLogger, errorMessage, type Logger } from "../lib/log";
import { ForceTokenError, generateForceToken, parseForceToken, redactSecrets } from "./force";
import { ImportError, assertAllAllowed, parseCommand, parseTarget, runImport } from "./import";
import { verifyPins } from "./manifest";
import { validateNewsletter } from "./newsletter";
import { validateProject } from "./project";
import { selectListedItems, validateTaxonomy } from "./taxonomy";
import { runTaxonomyImport } from "./taxonomy-import";
import { validateContent } from "./validate";

function scrubbing(base: Logger, secrets: readonly string[]): Logger {
  const clean = (message: string): string => redactSecrets(message, secrets);
  return {
    info: (message) => base.info(clean(message)),
    warn: (message) => base.warn(clean(message)),
    error: (message) => base.error(clean(message)),
  };
}

async function main(argv: readonly string[], env: Record<string, string | undefined>): Promise<number> {
  const secrets: string[] = [];
  const log = scrubbing(createLogger("content-import"), secrets);
  const token = env.CONTENT_FORCE_TOKEN;
  if (token) secrets.push(token);

  try {
    const command = parseCommand(argv);
    loadDotenv({ quiet: true });

    const validation = validateContent();
    if (!validation.ok) {
      for (const error of validation.errors) log.error(error);
      log.error("Content is invalid; nothing was imported. Run `pnpm content:validate`.");
      return 1;
    }

    const taxonomy = validateTaxonomy();
    if (!taxonomy.ok) {
      for (const error of taxonomy.errors) log.error(error);
      log.error("Content is invalid; nothing was imported. Run `pnpm content:validate`.");
      return 1;
    }

    const newsletter = validateNewsletter();
    if (!newsletter.ok) {
      for (const error of newsletter.errors) log.error(error);
      log.error("Content is invalid; nothing was imported. Run `pnpm content:validate`.");
      return 1;
    }

    const project = validateProject();
    if (!project.ok) {
      for (const error of project.errors) log.error(error);
      log.error("Content is invalid; nothing was imported. Run `pnpm content:validate`.");
      return 1;
    }

    if (command.command === "token") {
      const target = parseTarget(command.slug);
      if (target.kind === "post" && !validation.posts.some((post) => post.slug === target.slug)) {
        throw new ImportError(`No post "${command.slug}" in content/posts.`);
      }
      if (target.kind === "newsletter" && !newsletter.issues.some((issue) => issue.slug === target.slug)) {
        throw new ImportError(`No newsletter issue "${target.slug}" in content/newsletter.`);
      }
      if (target.kind === "project" && !project.projects.some((item) => item.slug === target.slug)) {
        throw new ImportError(`No project "${target.slug}" in content/projects.`);
      }
      // The one place the raw token is printed. It is not stored anywhere.
      console.log(
        `Force token for "${command.slug}" (single use; shown only now, never stored):\n\n` +
          `${generateForceToken(target.slug, target.kind)}\n\n` +
          "Use it once, without leaving it in the shell history or environment:\n" +
          "  read -rs CONTENT_FORCE_TOKEN && export CONTENT_FORCE_TOKEN   # paste the token, press Enter\n" +
          "  pnpm content:import --force\n" +
          "  unset CONTENT_FORCE_TOKEN",
      );
      return 0;
    }

    // A release imports only what was approved: every manifest entry must be pinned and
    // still match its files. Checked before any database access.
    if (!command.all) {
      const pinProblems = [
        ...verifyPins(validation.manifestEntries, validation.posts),
        ...taxonomy.pinProblems,
        // Pinning newsletter issues and projects comes with the release phase; until then a listed
        // entry needs a sourceHash written into manifest.json by hand.
        ...verifyPins(newsletter.entries, newsletter.issues).map((problem) => `newsletter: ${problem}`),
        ...verifyPins(project.entries, project.projects).map((problem) => `project: ${problem}`),
      ];
      if (pinProblems.length > 0) {
        for (const problem of pinProblems) log.error(problem);
        log.error("The manifest does not match the content; nothing was imported.");
        return 1;
      }
    }

    if (command.force && !token) {
      throw new ForceTokenError("--force requires CONTENT_FORCE_TOKEN (see `pnpm content:force-token`).");
    }
    if (!command.force && token) {
      log.warn("CONTENT_FORCE_TOKEN is set but --force was not passed; the token is ignored. Run: unset CONTENT_FORCE_TOKEN");
    }
    const force = command.force && token ? parseForceToken(token) : undefined;
    if (force?.kind !== undefined && force.kind !== "newsletter" && force.kind !== "project") {
      throw new ForceTokenError("content:import accepts force tokens for posts, newsletter issues and projects only.");
    }

    const databaseUrl = resolveDatabaseUrl(env);
    if (command.all) assertAllAllowed(env, databaseUrl);

    const selected = command.all
      ? validation.posts
      : validation.posts.filter((post) => validation.manifestSlugs.includes(post.slug));
    const selectedTaxonomy = command.all
      ? taxonomy.items
      : selectListedItems(taxonomy.items, taxonomy.entries);
    const selectedIssues = command.all
      ? newsletter.issues
      : newsletter.issues.filter((issue) => newsletter.entries.some((entry) => entry.slug === issue.slug));
    const selectedProjects = command.all
      ? project.projects
      : project.projects.filter((item) => project.entries.some((entry) => entry.slug === item.slug));
    if (
      selected.length === 0 &&
      selectedTaxonomy.length === 0 &&
      selectedIssues.length === 0 &&
      selectedProjects.length === 0 &&
      force === undefined
    ) {
      log.info("No content selected (the manifest is empty). Use --all on a development database.");
      return 0;
    }

    const prisma = createReleaseClient(databaseUrl);
    const lock = command.dryRun
      ? undefined
      : await acquireReleaseLock({
          connectionString: stripPrismaParams(databaseUrl),
          applicationName: "content-import",
          log,
        });
    try {
      await runTaxonomyImport(prisma, selectedTaxonomy, { dryRun: command.dryRun, log, lock });
      const posts = await runImport(prisma, selected, { dryRun: command.dryRun, log, lock, force });
      if (posts.blocked) return 1;
      // Newsletter issues and projects are skipped when nothing is selected for them, so databases
      // without their tables stay untouched. A token of that kind still runs it, to be validated.
      if (selectedIssues.length > 0 || force?.kind === "newsletter") {
        const issues = await runImport(prisma, selectedIssues, {
          dryRun: command.dryRun,
          log,
          lock,
          force,
          kind: "newsletter",
        });
        if (issues.blocked) return 1;
      }
      if (selectedProjects.length > 0 || force?.kind === "project") {
        const projects = await runImport(prisma, selectedProjects, {
          dryRun: command.dryRun,
          log,
          lock,
          force,
          kind: "project",
        });
        if (projects.blocked) return 1;
      }
      return 0;
    } finally {
      await lock?.release().catch(() => undefined);
      await prisma.$disconnect();
    }
  } catch (error) {
    log.error(error instanceof ForceTokenError || error instanceof ImportError ? error.message : errorMessage(error));
    return 1;
  }
}

main(process.argv.slice(2), process.env).then((code) => {
  process.exitCode = code;
});
