// prisma/content/approve-cli.ts
//
//   pnpm content:approve <slug> [<slug> ...]   add or re-pin posts at their current hash
//   pnpm content:approve --refresh             re-pin every post, issue and project already in the manifest
//   pnpm content:approve newsletter:<number> project:<slug> ...   add or re-pin issues and projects
//   pnpm content:approve category:<slug> tag:<slug> ...   add or re-pin categories and tags
//   pnpm content:approve --taxonomy            add or re-pin every category and tag in taxonomy.yml
//
// Run it only after you have reviewed the post (for example by importing it into your
// development database). It pins content/manifest.json to the hash of the files as they are
// right now; a release then publishes exactly that version and refuses anything else.

import { writeFileSync } from "node:fs";
import path from "node:path";
import { createLogger, errorMessage } from "../lib/log";
import { DEFAULT_CONTENT_ROOT } from "./load";
import { approveEntries, approveTarget, type ManifestEntry, type PinKind } from "./manifest";
import { validateNewsletter } from "./newsletter";
import { validateProject } from "./project";
import { approveTaxonomy, parseTaxonomyTargets, serializeFullManifest, validateTaxonomy } from "./taxonomy";
import { ContentError, type ParsedPost } from "./types";
import { validateContent } from "./validate";

const log = createLogger("content-approve");
const short = (hash: string | undefined): string => (hash ? hash.slice(0, 12) : "none");

/** Approves `targets` of one kind, logs each result and reports whether any pin changed. */
function approveKind(
  kind: PinKind,
  entries: readonly ManifestEntry[],
  items: readonly Pick<ParsedPost, "slug" | "sourceHash">[],
  targets: readonly string[],
): { entries: ManifestEntry[]; changed: boolean } {
  const next = approveEntries(entries, items, targets, kind);
  const before = new Map(entries.map((entry) => [entry.slug, entry.sourceHash]));
  let changed = false;
  for (const entry of next) {
    if (!targets.includes(entry.slug)) continue;
    const name = approveTarget(kind, entry.slug);
    const was = before.has(entry.slug) ? before.get(entry.slug) : null;
    if (was === entry.sourceHash) {
      log.info(`${name}: unchanged (${short(entry.sourceHash)})`);
    } else {
      changed = true;
      const from = was === null ? "new" : was === undefined ? "was not approved" : `was ${short(was)}`;
      log.info(`${name}: approved ${short(entry.sourceHash)} (${from})`);
    }
  }
  return { entries: next, changed };
}

function main(argv: readonly string[]): number {
  try {
    const flags = argv.filter((arg) => arg.startsWith("-"));
    const unknownFlag = flags.find((flag) => flag !== "--refresh" && flag !== "--taxonomy");
    if (unknownFlag) throw new ContentError(`Unknown option ${unknownFlag}. Supported: --refresh, --taxonomy.`);
    const positional = argv.filter((arg) => !arg.startsWith("-"));
    const taxonomyArgs = positional.filter((arg) => /^(category|tag):/.test(arg));
    const issueArgs = positional.filter((arg) => arg.startsWith("newsletter:"));
    const projectArgs = positional.filter((arg) => arg.startsWith("project:"));
    const slugs = positional.filter(
      (arg) => !taxonomyArgs.includes(arg) && !issueArgs.includes(arg) && !projectArgs.includes(arg),
    );
    const issueSlugs = issueArgs.map((arg) => arg.slice("newsletter:".length));
    const projectSlugs = projectArgs.map((arg) => arg.slice("project:".length));
    const refresh = flags.includes("--refresh");
    const allTaxonomy = flags.includes("--taxonomy");
    if (positional.length === 0 && !refresh && !allTaxonomy) {
      throw new ContentError(
        "Usage: pnpm content:approve <slug> [newsletter:<number> | project:<slug> | category:<slug> | tag:<slug> ...] | --taxonomy | --refresh",
      );
    }

    const validation = validateContent();
    if (!validation.ok) {
      for (const error of validation.errors) log.error(error);
      log.error("Content is invalid; nothing was approved. Run `pnpm content:validate`.");
      return 1;
    }

    const taxonomy = validateTaxonomy();
    if (!taxonomy.ok) {
      for (const error of taxonomy.errors) log.error(error);
      log.error("Content is invalid; nothing was approved. Run `pnpm content:validate`.");
      return 1;
    }

    const newsletter = validateNewsletter();
    const projects = validateProject();
    for (const checked of [newsletter, projects]) {
      if (checked.ok) continue;
      for (const error of checked.errors) log.error(error);
      log.error("Content is invalid; nothing was approved. Run `pnpm content:validate`.");
      return 1;
    }

    const postResult = approveKind(
      "post",
      validation.manifestEntries,
      validation.posts,
      refresh ? [...validation.manifestSlugs, ...slugs] : slugs,
    );
    const issueResult = approveKind(
      "newsletter",
      newsletter.entries,
      newsletter.issues,
      refresh ? [...newsletter.entries.map((entry) => entry.slug), ...issueSlugs] : issueSlugs,
    );
    const projectResult = approveKind(
      "project",
      projects.entries,
      projects.projects,
      refresh ? [...projects.entries.map((entry) => entry.slug), ...projectSlugs] : projectSlugs,
    );

    const taxonomyResult = approveTaxonomy(taxonomy.entries, taxonomy.items, {
      refresh,
      all: allTaxonomy,
      targets: parseTaxonomyTargets(taxonomyArgs),
    });
    for (const line of taxonomyResult.lines) log.info(line);

    if (postResult.changed || issueResult.changed || projectResult.changed || taxonomyResult.changed) {
      const manifestPath = path.join(DEFAULT_CONTENT_ROOT, "manifest.json");
      const extra = { newsletter: issueResult.entries, projects: projectResult.entries };
      writeFileSync(manifestPath, serializeFullManifest(postResult.entries, taxonomyResult.entries, extra), "utf8");
      log.info("content/manifest.json updated. Review it with: git diff content/manifest.json");
    } else {
      log.info("content/manifest.json is already up to date.");
    }
    return 0;
  } catch (error) {
    log.error(error instanceof ContentError ? error.issues.join("\n") : errorMessage(error));
    return 1;
  }
}

process.exitCode = main(process.argv.slice(2));
