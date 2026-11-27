// prisma/content/load.ts
//
// Filesystem access for the content tree. Nothing here parses or validates.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  ContentError,
  ISSUE_FILES,
  LOCALES,
  POST_FILES,
  PROJECT_FILES,
  type RawIssueSource,
  type RawPostSource,
  type RawProjectSource,
} from "./types";

/** `content/` relative to the working directory (the scripts run from the project root). */
export const DEFAULT_CONTENT_ROOT = path.resolve(process.cwd(), "content");

export function readManifestText(root: string = DEFAULT_CONTENT_ROOT): string {
  const file = path.join(root, "manifest.json");
  if (!existsSync(file)) throw new ContentError("manifest.json not found in the content directory");
  return readFileSync(file, "utf8");
}

export function loadPostSources(root: string = DEFAULT_CONTENT_ROOT): RawPostSource[] {
  const postsDir = path.join(root, "posts");
  if (!existsSync(postsDir)) throw new ContentError("posts/ directory not found in the content directory");

  const dirNames = readdirSync(postsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort();

  return dirNames.map((dirName) => {
    const dir = path.join(postsDir, dirName);
    const names = readdirSync(dir);
    const read = (name: string): string | undefined =>
      names.includes(name) ? readFileSync(path.join(dir, name), "utf8") : undefined;

    const bodies: RawPostSource["bodies"] = {};
    for (const locale of LOCALES) {
      const body = read(`${locale}.md`);
      if (body !== undefined) bodies[locale] = body;
    }

    return {
      dirName,
      postYml: read("post.yml"),
      bodies,
      unexpectedFiles: names.filter((name) => !POST_FILES.includes(name) && !name.startsWith(".")),
    };
  });
}

/** Issues live in content/newsletter/<number>/; a tree without that directory has none. */
export function loadIssueSources(root: string = DEFAULT_CONTENT_ROOT): RawIssueSource[] {
  const issuesDir = path.join(root, "newsletter");
  if (!existsSync(issuesDir)) return [];

  const dirNames = readdirSync(issuesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort();

  return dirNames.map((dirName) => {
    const dir = path.join(issuesDir, dirName);
    const names = readdirSync(dir);
    const read = (name: string): string | undefined =>
      names.includes(name) ? readFileSync(path.join(dir, name), "utf8") : undefined;

    const bodies: RawIssueSource["bodies"] = {};
    for (const locale of LOCALES) {
      const body = read(`${locale}.md`);
      if (body !== undefined) bodies[locale] = body;
    }

    return {
      dirName,
      issueYml: read("issue.yml"),
      bodies,
      unexpectedFiles: names.filter((name) => !ISSUE_FILES.includes(name) && !name.startsWith(".")),
    };
  });
}

/** Projects live in content/projects/<slug>/project.yml; a tree without that directory has none. */
export function loadProjectSources(root: string = DEFAULT_CONTENT_ROOT): RawProjectSource[] {
  const projectsDir = path.join(root, "projects");
  if (!existsSync(projectsDir)) return [];

  const dirNames = readdirSync(projectsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort();

  return dirNames.map((dirName) => {
    const dir = path.join(projectsDir, dirName);
    const names = readdirSync(dir);
    return {
      dirName,
      projectYml: names.includes("project.yml") ? readFileSync(path.join(dir, "project.yml"), "utf8") : undefined,
      unexpectedFiles: names.filter((name) => !PROJECT_FILES.includes(name) && !name.startsWith(".")),
    };
  });
}
