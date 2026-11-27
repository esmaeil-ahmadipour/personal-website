// prisma/content/project.ts
//
// Projects as files: content/projects/<slug>/project.yml. This module builds and checks them
// offline and never touches a database. A project's `slug` is its directory name, its entry in
// the `projects` list of content/manifest.json and the ContentSync key of the importer.

import { capitalize, hashValue } from "./build";
import { DEFAULT_CONTENT_ROOT, loadProjectSources, readManifestText } from "./load";
import { toEntries, type ManifestEntry } from "./manifest";
import { parseManifest, parseProjectMeta, type ProjectMeta } from "./parse";
import {
  ContentError,
  FORMAT_VERSION,
  LOCALES,
  PROJECT_FILES,
  type FieldValue,
  type ParsedProject,
  type RawProjectSource,
} from "./types";

export function buildProject(source: RawProjectSource): ParsedProject {
  const issues = source.unexpectedFiles.map(
    (name) => `unexpected file "${name}" (allowed: ${PROJECT_FILES.join(", ")})`,
  );

  if (source.projectYml === undefined) throw new ContentError([...issues, "project.yml is missing"]);

  let meta: ProjectMeta;
  try {
    meta = parseProjectMeta(source.projectYml);
  } catch (error) {
    if (error instanceof ContentError) throw new ContentError([...issues, ...error.issues]);
    throw error;
  }

  if (meta.slug !== source.dirName) {
    issues.push(`slug "${meta.slug}" does not match its directory "${source.dirName}"`);
  }
  if (issues.length > 0) throw new ContentError(issues);

  // Column values. descriptionFa/Ar and overviewAr are NOT NULL with an empty-string default,
  // overviewEn/Fa are nullable. `badges` and `stack` keep their order: the site shows them as listed.
  const fields: Record<string, FieldValue> = {
    name: meta.name,
    kind: meta.kind,
    stage: meta.stage,
    year: meta.year ?? null,
    badges: [...meta.badges],
    stack: [...meta.stack],
    isFeatured: meta.isFeatured,
    order: meta.order,
    status: meta.status,
    publishedAt: meta.publishedAt === undefined ? null : new Date(meta.publishedAt),
    coverImageUrl: meta.coverImageUrl ?? null,
    url: meta.url ?? null,
    sourceUrl: meta.sourceUrl ?? null,
  };
  for (const locale of LOCALES) {
    const entry = meta.locales[locale];
    const suffix = capitalize(locale);
    fields[`description${suffix}`] = entry?.description ?? "";
    fields[`overview${suffix}`] = entry?.overview ?? (locale === "ar" ? "" : null);
  }

  const fieldHashes = Object.fromEntries(
    Object.entries(fields).map(([name, value]) => [name, hashValue(value)]),
  );
  const postSlugs = [...meta.posts].sort();

  return {
    slug: meta.slug,
    formatVersion: FORMAT_VERSION,
    sourceHash: hashValue({
      formatVersion: FORMAT_VERSION,
      meta: { ...meta, posts: postSlugs },
    }),
    fields,
    fieldHashes,
    relations: { postSlugs },
    locales: LOCALES.filter((locale) => meta.locales[locale] !== undefined),
  };
}

export interface ProjectValidation {
  ok: boolean;
  errors: string[];
  projects: ParsedProject[];
  /** Entries of the `projects` list in content/manifest.json. */
  entries: ManifestEntry[];
}

/** Offline check of content/projects/ and the manifest entries that refer to it. */
export function validateProject(root: string = DEFAULT_CONTENT_ROOT): ProjectValidation {
  const errors: string[] = [];

  let entries: ManifestEntry[] = [];
  let manifestValid = false;
  try {
    entries = toEntries(parseManifest(readManifestText(root)).projects ?? []);
    manifestValid = true;
  } catch (error) {
    // validateContent reports an unreadable manifest; nothing is listed from here.
    if (!(error instanceof ContentError)) throw error;
  }

  const sources = loadProjectSources(root);
  const projects: ParsedProject[] = [];
  for (const source of sources) {
    try {
      projects.push(buildProject(source));
    } catch (error) {
      if (!(error instanceof ContentError)) throw error;
      errors.push(...error.issues.map((issue) => `projects/${source.dirName}: ${issue}`));
    }
  }
  projects.sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0));

  if (manifestValid) {
    const dirNames = new Set(sources.map((source) => source.dirName));
    const seen = new Set<string>();
    for (const entry of entries) {
      if (seen.has(entry.slug)) errors.push(`manifest.json: projects lists "${entry.slug}" more than once`);
      seen.add(entry.slug);
      if (!dirNames.has(entry.slug)) {
        errors.push(`manifest.json: projects lists "${entry.slug}" but projects/${entry.slug}/ does not exist`);
      }
    }
  }

  return { ok: errors.length === 0, errors, projects, entries };
}
