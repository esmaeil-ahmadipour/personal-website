// prisma/content/cli.ts
//
// `pnpm content:validate` - offline check of content/. Never connects to a database.

import { createLogger } from "../lib/log";
import { verifyPins } from "./manifest";
import { validateNewsletter } from "./newsletter";
import { validateProject } from "./project";
import { pinStatus, validateTaxonomy } from "./taxonomy";
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

const taxonomy = validateTaxonomy();
for (const item of taxonomy.items) {
  const release = pinStatus(taxonomy.entries[item.kind], item);
  log.info(`${item.kind}:${item.slug}: ok (${release}, hash=${item.sourceHash.slice(0, 12)})`);
}
for (const error of taxonomy.errors) log.error(error);
for (const problem of taxonomy.pinProblems) log.error(problem);
log.info(`${taxonomy.items.length} taxonomy item(s), ${taxonomy.errors.length} error(s).`);

const newsletter = validateNewsletter();
for (const issue of newsletter.issues) {
  const release = pinStatus(newsletter.entries, issue);
  log.info(`newsletter:${issue.slug}: ok (locales=${issue.locales.join(",")}, ${release}, hash=${issue.sourceHash.slice(0, 12)})`);
}
for (const error of newsletter.errors) log.error(error);
log.info(`${newsletter.issues.length} newsletter issue(s), ${newsletter.errors.length} error(s).`);

const project = validateProject();
for (const item of project.projects) {
  const release = pinStatus(project.entries, item);
  log.info(`project:${item.slug}: ok (locales=${item.locales.join(",")}, ${release}, hash=${item.sourceHash.slice(0, 12)})`);
}
for (const error of project.errors) log.error(error);
log.info(`${project.projects.length} project(s), ${project.errors.length} error(s).`);

process.exitCode =
  result.ok &&
  pinProblems.length === 0 &&
  taxonomy.ok &&
  taxonomy.pinProblems.length === 0 &&
  newsletter.errors.length === 0 &&
  project.errors.length === 0
    ? 0
    : 1;
