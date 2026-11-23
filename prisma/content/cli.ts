// prisma/content/cli.ts
//
// `pnpm content:validate` - offline check of content/. Never connects to a database.

import { createLogger } from "../lib/log";
import { verifyPins } from "./manifest";
import { validateContent } from "./validate";

const log = createLogger("content");
const result = validateContent();
const listed = new Set(result.manifestSlugs);
const pins = new Map(result.manifestEntries.map((entry) => [entry.slug, entry.sourceHash]));
const pinProblems = verifyPins(result.manifestEntries, result.posts);

for (const post of result.posts) {
  const release = !pins.has(post.slug)
    ? "not in manifest"
    : pins.get(post.slug) === post.sourceHash
      ? "approved"
      : "in manifest, NOT approved";
  log.info(`${post.slug}: ok (locales=${post.locales.join(",")}, ${release}, hash=${post.sourceHash.slice(0, 12)})`);
}
for (const error of result.errors) log.error(error);
for (const problem of pinProblems) log.error(problem);
log.info(`${result.posts.length} valid post(s), ${result.errors.length} error(s), ${listed.size} in manifest.`);

process.exitCode = result.ok && pinProblems.length === 0 ? 0 : 1;
