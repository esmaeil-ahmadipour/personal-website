// prisma/__tests__/project.unit.test.ts
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { buildProject, validateProject } from "../content/project";
import { ContentError, type RawProjectSource } from "../content/types";

/** `extra` is appended at the end, so it can add root keys or the `ar` locale (indented). */
const projectYml = (extra = ""): string =>
  [
    "slug: demo",
    "name: Demo",
    "kind: tool",
    "stage: live",
    "status: published",
    "locales:",
    "  en:",
    '    description: "D"',
    "  fa:",
    '    description: "د"',
  ].join("\n") + `\n${extra}`;

const source = (overrides: Partial<RawProjectSource> = {}): RawProjectSource => ({
  dirName: "demo",
  projectYml: projectYml(),
  unexpectedFiles: [],
  ...overrides,
});

const rejects = (run: () => unknown, pattern: RegExp): void =>
  assert.throws(run, (error) => error instanceof ContentError && pattern.test(error.message));

describe("buildProject", () => {
  it("maps a minimal project to the Project columns", () => {
    const project = buildProject(source());
    assert.equal(project.slug, "demo");
    assert.deepEqual(project.locales, ["en", "fa"]);
    assert.deepEqual(project.relations, { postSlugs: [] });
    assert.equal(project.fields.name, "Demo");
    assert.equal(project.fields.kind, "tool");
    assert.equal(project.fields.stage, "live");
    assert.equal(project.fields.status, "published");
    assert.equal(project.fields.year, null);
    assert.deepEqual(project.fields.badges, []);
    assert.deepEqual(project.fields.stack, []);
    assert.equal(project.fields.isFeatured, false);
    assert.equal(project.fields.order, 0);
    assert.equal(project.fields.publishedAt, null);
    assert.equal(project.fields.coverImageUrl, null);
    assert.equal(project.fields.url, null);
    assert.equal(project.fields.sourceUrl, null);
    assert.equal(project.fields.descriptionEn, "D");
    assert.equal(project.fields.descriptionFa, "د");
    assert.equal(project.fields.descriptionAr, "");
    assert.equal(project.fields.overviewEn, null);
    assert.equal(project.fields.overviewFa, null);
    assert.equal(project.fields.overviewAr, "");
    assert.deepEqual(Object.keys(project.fieldHashes).sort(), Object.keys(project.fields).sort());
  });

  it("maps every optional field and keeps the badge and stack order", () => {
    const withAr = projectYml().replace(
      '    description: "د"\n',
      '    description: "د"\n  ar:\n    description: "ع"\n    overview: |\n      أ\n\n      ب\n',
    );
    const yml =
      withAr +
      [
        "year: 2026",
        "badges: [desktop, personal]",
        "stack: [Flutter, Dart]",
        "isFeatured: true",
        "order: 3",
        'publishedAt: "2026-11-27"',
        "coverImageUrl: /images/x.svg",
        'url: "https://example.com/"',
        'sourceUrl: "https://github.com/x/y"',
        "posts: [b-post, a-post]",
      ].join("\n") +
      "\n";
    const project = buildProject(source({ projectYml: yml }));
    assert.deepEqual(project.locales, ["en", "fa", "ar"]);
    assert.equal(project.fields.year, 2026);
    assert.deepEqual(project.fields.badges, ["desktop", "personal"]);
    assert.deepEqual(project.fields.stack, ["Flutter", "Dart"]);
    assert.equal(project.fields.isFeatured, true);
    assert.equal(project.fields.order, 3);
    assert.ok(project.fields.publishedAt instanceof Date);
    assert.equal(project.fields.coverImageUrl, "/images/x.svg");
    assert.equal(project.fields.url, "https://example.com/");
    assert.equal(project.fields.sourceUrl, "https://github.com/x/y");
    assert.deepEqual(project.relations.postSlugs, ["a-post", "b-post"]);
    assert.equal(project.fields.descriptionAr, "ع");
    assert.equal(project.fields.overviewAr, "أ\n\nب");
  });

  it("keeps blank lines of an overview so the page can split paragraphs", () => {
    const yml = projectYml().replace(
      '    description: "D"',
      '    description: "D"\n    overview: |\n      One.\n\n      Two.',
    );
    assert.equal(buildProject(source({ projectYml: yml })).fields.overviewEn, "One.\n\nTwo.");
  });

  it("hashes badge and stack order but not the order of posts", () => {
    const hash = (extra: string) => buildProject(source({ projectYml: projectYml(extra) }));
    const a = hash("badges: [personal, desktop]\nposts: [x-post, y-post]\n");
    const b = hash("badges: [desktop, personal]\nposts: [x-post, y-post]\n");
    const c = hash("badges: [personal, desktop]\nposts: [y-post, x-post]\n");
    assert.notEqual(a.sourceHash, b.sourceHash);
    assert.notEqual(a.fieldHashes.badges, b.fieldHashes.badges);
    assert.equal(a.sourceHash, c.sourceHash);
    assert.equal(a.sourceHash, hash("badges: [personal, desktop]\nposts: [x-post, y-post]\n").sourceHash);
  });

  it("does not require publishedAt for a published project", () => {
    assert.equal(buildProject(source()).fields.publishedAt, null);
  });

  it("rejects a directory that differs from the slug", () => {
    rejects(() => buildProject(source({ dirName: "other" })), /does not match its directory/);
  });

  it("rejects unknown keys, bad enums and a bad date", () => {
    rejects(() => buildProject(source({ projectYml: projectYml("bogus: 1\n") })), /bogus/);
    rejects(() => buildProject(source({ projectYml: projectYml().replace("kind: tool", "kind: app") })), /kind/);
    rejects(() => buildProject(source({ projectYml: projectYml().replace("stage: live", "stage: beta") })), /stage/);
    rejects(() => buildProject(source({ projectYml: projectYml("badges: [nope]\n") })), /badges/);
    rejects(() => buildProject(source({ projectYml: projectYml('publishedAt: "2026-13-45"\n') })), /publishedAt/);
  });

  it("requires https:// for url and sourceUrl", () => {
    rejects(() => buildProject(source({ projectYml: projectYml('url: "http://example.com/"\n') })), /url/);
    rejects(() => buildProject(source({ projectYml: projectYml('sourceUrl: "ftp://example.com/"\n') })), /sourceUrl/);
  });

  it("rejects duplicates in badges, stack and posts", () => {
    rejects(() => buildProject(source({ projectYml: projectYml("badges: [personal, personal]\n") })), /badges: contains duplicates/);
    rejects(() => buildProject(source({ projectYml: projectYml("stack: [A, A]\n") })), /stack: contains duplicates/);
    rejects(() => buildProject(source({ projectYml: projectYml("posts: [a-post, a-post]\n") })), /posts: contains duplicates/);
  });

  it("requires English and Persian descriptions", () => {
    const noFa = projectYml().replace('  fa:\n    description: "د"\n', "");
    rejects(() => buildProject(source({ projectYml: noFa })), /locales/);
  });

  it("reports unexpected files and a missing project.yml", () => {
    const run = () => buildProject(source({ projectYml: undefined, unexpectedFiles: ["en.md"] }));
    rejects(run, /unexpected file "en\.md"/);
    rejects(run, /project\.yml is missing/);
  });
});

function tree(manifest: string, projects: Record<string, Record<string, string>>): string {
  const root = mkdtempSync(path.join(tmpdir(), "projects-"));
  writeFileSync(path.join(root, "manifest.json"), manifest);
  for (const [dir, files] of Object.entries(projects)) {
    mkdirSync(path.join(root, "projects", dir), { recursive: true });
    for (const [name, text] of Object.entries(files)) {
      writeFileSync(path.join(root, "projects", dir, name), text);
    }
  }
  return root;
}

const files = (slug: string): Record<string, string> => ({
  "project.yml": projectYml().replace("slug: demo", `slug: ${slug}`),
});

function withTree(manifest: string, projects: Record<string, Record<string, string>>, check: (root: string) => void): void {
  const root = tree(manifest, projects);
  try {
    check(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

describe("validateProject", () => {
  it("treats a tree without a projects directory as having no projects", () => {
    withTree('{ "posts": [] }', {}, (root) => {
      const result = validateProject(root);
      assert.equal(result.ok, true);
      assert.deepEqual(result.projects, []);
    });
  });

  it("sorts projects by slug and checks the manifest entries", () => {
    withTree(
      '{ "posts": [], "projects": ["beta", "beta", "gone"] }',
      { gamma: files("gamma"), beta: files("beta") },
      (root) => {
        const result = validateProject(root);
        assert.deepEqual(result.projects.map((project) => project.slug), ["beta", "gamma"]);
        assert.equal(result.ok, false);
        const errors = result.errors.join("\n");
        assert.match(errors, /projects lists "beta" more than once/);
        assert.match(errors, /projects lists "gone" but projects\/gone\/ does not exist/);
      },
    );
  });

  it("reports a broken project with its directory", () => {
    withTree('{ "posts": [] }', { broken: { "project.yml": "slug: broken\n" }, extra: { ...files("extra"), "en.md": "x" } }, (root) => {
      const result = validateProject(root);
      assert.equal(result.ok, false);
      const errors = result.errors.join("\n");
      assert.match(errors, /projects\/broken: project\.yml/);
      assert.match(errors, /projects\/extra: unexpected file "en\.md"/);
    });
  });
});

describe("repository projects", () => {
  it("has no validation errors", () => {
    assert.deepEqual(validateProject().errors, []);
  });
});
