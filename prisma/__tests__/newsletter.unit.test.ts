// prisma/__tests__/newsletter.unit.test.ts
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { buildIssue, validateNewsletter } from "../content/newsletter";
import { ContentError, type RawIssueSource } from "../content/types";

const LINK = "https://www.linkedin.com/pulse/x/";

/** `extra` is appended at the end, so it can add locales (indented) or root keys. */
const issueYml = (extra = ""): string =>
  [
    "number: 5",
    "author: esmaeil-ahmadipour",
    "category: engineering",
    "tags: [typescript]",
    `linkedinUrl: "${LINK}"`,
    "status: published",
    'publishedAt: "2026-11-27"',
    "locales:",
    "  en:",
    '    title: "T"',
    "  fa:",
    '    title: "ت"',
  ].join("\n") + `\n${extra}`;

const source = (overrides: Partial<RawIssueSource> = {}): RawIssueSource => ({
  dirName: "5",
  issueYml: issueYml(),
  bodies: { en: "## A\n\nbody", fa: "## ب\n\nمتن" },
  unexpectedFiles: [],
  ...overrides,
});

const rejects = (run: () => unknown, pattern: RegExp): void =>
  assert.throws(run, (error) => error instanceof ContentError && pattern.test(error.message));

describe("buildIssue", () => {
  it("maps an issue to the NewsletterIssue columns", () => {
    const issue = buildIssue(source());
    assert.equal(issue.number, 5);
    assert.equal(issue.slug, "5");
    assert.deepEqual(issue.locales, ["en", "fa"]);
    assert.deepEqual(issue.relations, {
      authorSlug: "esmaeil-ahmadipour",
      categorySlug: "engineering",
      tagSlugs: ["typescript"],
    });
    assert.equal(issue.fields.linkedinUrl, LINK);
    assert.equal(issue.fields.titleEn, "T");
    assert.equal(issue.fields.excerptEn, null);
    assert.equal(issue.fields.titleAr, "");
    assert.equal(issue.fields.excerptAr, "");
    assert.equal(issue.fields.contentAr, "");
    assert.match(String(issue.fields.contentEn), /<h2>/);
  });

  it("accepts a complete Arabic locale", () => {
    const issue = buildIssue(
      source({ issueYml: issueYml('  ar:\n    title: "ع"\n'), bodies: { en: "## A\n\nx", fa: "## ب\n\nx", ar: "## ع\n\nx" } }),
    );
    assert.deepEqual(issue.locales, ["en", "fa", "ar"]);
    assert.equal(issue.fields.titleAr, "ع");
  });

  it("rejects a directory that differs from the number", () => {
    rejects(() => buildIssue(source({ dirName: "05" })), /does not match its directory/);
  });

  it("rejects unknown keys, a link that is not https and a missing publishedAt", () => {
    rejects(() => buildIssue(source({ issueYml: issueYml("bogus: 1\n") })), /bogus/);
    rejects(
      () => buildIssue(source({ issueYml: issueYml().replace(LINK, "http://example.com/") })),
      /linkedinUrl/,
    );
    rejects(
      () => buildIssue(source({ issueYml: issueYml().replace('publishedAt: "2026-11-27"\n', "") })),
      /publishedAt/,
    );
  });

  it("requires Markdown and metadata to agree per locale", () => {
    rejects(() => buildIssue(source({ bodies: { en: "## A\n\nx" } })), /declares locales\.fa but fa\.md is missing/);
    rejects(
      () => buildIssue(source({ bodies: { en: "## A\n\nx", fa: "## ب\n\nx", ar: "## ع\n\nx" } })),
      /ar\.md exists but issue\.yml has no locales\.ar entry/,
    );
  });

  it("reports unexpected files and a missing issue.yml", () => {
    const run = () => buildIssue(source({ issueYml: undefined, unexpectedFiles: ["notes.txt"] }));
    rejects(run, /unexpected file "notes\.txt"/);
    rejects(run, /issue\.yml is missing/);
  });
});

function tree(manifest: string, issues: Record<string, Record<string, string>>): string {
  const root = mkdtempSync(path.join(tmpdir(), "newsletter-"));
  writeFileSync(path.join(root, "manifest.json"), manifest);
  for (const [dir, files] of Object.entries(issues)) {
    mkdirSync(path.join(root, "newsletter", dir), { recursive: true });
    for (const [name, text] of Object.entries(files)) {
      writeFileSync(path.join(root, "newsletter", dir, name), text);
    }
  }
  return root;
}

const files = (number: number): Record<string, string> => ({
  "issue.yml": issueYml().replace("number: 5", `number: ${number}`),
  "en.md": "## A\n\nx",
  "fa.md": "## ب\n\nx",
});

function withTree(manifest: string, issues: Record<string, Record<string, string>>, check: (root: string) => void): void {
  const root = tree(manifest, issues);
  try {
    check(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

describe("validateNewsletter", () => {
  it("treats a tree without a newsletter directory as having no issues", () => {
    withTree('{ "posts": [] }', {}, (root) => {
      const result = validateNewsletter(root);
      assert.equal(result.ok, true);
      assert.deepEqual(result.issues, []);
    });
  });

  it("sorts issues by number and checks the manifest entries", () => {
    withTree('{ "posts": [], "newsletter": ["5", "5", "9"] }', { "10": files(10), "5": files(5) }, (root) => {
      const result = validateNewsletter(root);
      assert.deepEqual(result.issues.map((issue) => issue.number), [5, 10]);
      assert.equal(result.ok, false);
      const errors = result.errors.join("\n");
      assert.match(errors, /lists "5" more than once/);
      assert.match(errors, /lists "9" but newsletter\/9\/ does not exist/);
    });
  });

  it("reports a broken issue with its directory", () => {
    withTree('{ "posts": [] }', { "7": { "issue.yml": "number: 7\n" } }, (root) => {
      const result = validateNewsletter(root);
      assert.equal(result.ok, false);
      assert.match(result.errors.join("\n"), /newsletter\/7: issue\.yml/);
    });
  });
});

describe("repository newsletter", () => {
  it("has no validation errors", () => {
    assert.deepEqual(validateNewsletter().errors, []);
  });
});
