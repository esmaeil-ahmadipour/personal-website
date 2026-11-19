// prisma/content/cli.ts
//
// `pnpm content:validate` - offline check of content/. Never connects to a database.

import { createLogger } from "../lib/log";
import { validateContent } from "./validate";

const log = createLogger("content");
const result = validateContent();
const listed = new Set(result.manifestSlugs);

for (const post of result.posts) {
  const release = listed.has(post.slug) ? "in manifest" : "not in manifest";
  log.info(`${post.slug}: ok (locales=${post.locales.join(",")}, ${release}, hash=${post.sourceHash.slice(0, 12)})`);
}
for (const error of result.errors) log.error(error);
log.info(`${result.posts.length} valid post(s), ${result.errors.length} error(s), ${listed.size} in manifest.`);

process.exitCode = result.ok ? 0 : 1;
