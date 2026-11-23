// prisma/content/approve-cli.ts
//
//   pnpm content:approve <slug> [<slug> ...]   add or re-pin posts at their current hash
//   pnpm content:approve --refresh             re-pin every post already in the manifest
//
// Run it only after you have reviewed the post (for example by importing it into your
// development database). It pins content/manifest.json to the hash of the files as they are
// right now; a release then publishes exactly that version and refuses anything else.

import { writeFileSync } from "node:fs";
import path from "node:path";
import { createLogger, errorMessage } from "../lib/log";
import { DEFAULT_CONTENT_ROOT } from "./load";
import { approveEntries, serializeManifest } from "./manifest";
import { ContentError } from "./types";
import { validateContent } from "./validate";

const log = createLogger("content-approve");
const short = (hash: string | undefined): string => (hash ? hash.slice(0, 12) : "none");

function main(argv: readonly string[]): number {
  try {
    const flags = argv.filter((arg) => arg.startsWith("-"));
    const unknownFlag = flags.find((flag) => flag !== "--refresh");
    if (unknownFlag) throw new ContentError(`Unknown option ${unknownFlag}. Supported: --refresh.`);
    const slugs = argv.filter((arg) => !arg.startsWith("-"));
    const refresh = flags.includes("--refresh");
    if (slugs.length === 0 && !refresh) {
      throw new ContentError("Usage: pnpm content:approve <slug> [<slug> ...] | --refresh");
    }

    const validation = validateContent();
    if (!validation.ok) {
      for (const error of validation.errors) log.error(error);
      log.error("Content is invalid; nothing was approved. Run `pnpm content:validate`.");
      return 1;
    }

    const targets = refresh ? [...validation.manifestSlugs, ...slugs] : slugs;
    const next = approveEntries(validation.manifestEntries, validation.posts, targets);

    const before = new Map(validation.manifestEntries.map((entry) => [entry.slug, entry.sourceHash]));
    let changed = false;
    for (const entry of next) {
      if (!targets.includes(entry.slug)) continue;
      const was = before.has(entry.slug) ? before.get(entry.slug) : null;
      if (was === entry.sourceHash) {
        log.info(`${entry.slug}: unchanged (${short(entry.sourceHash)})`);
      } else {
        changed = true;
        const from = was === null ? "new" : was === undefined ? "was not approved" : `was ${short(was)}`;
        log.info(`${entry.slug}: approved ${short(entry.sourceHash)} (${from})`);
      }
    }

    if (changed) {
      writeFileSync(path.join(DEFAULT_CONTENT_ROOT, "manifest.json"), serializeManifest(next), "utf8");
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
