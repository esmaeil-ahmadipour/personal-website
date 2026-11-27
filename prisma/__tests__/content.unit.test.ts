// prisma/__tests__/content.unit.test.ts
//
// Offline tests for the Markdown content pipeline. No database is used.
// Run from the project root (content/ is resolved from the working directory).

import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, describe, it } from "node:test";
import { buildPost, canonicalJson } from "../content/build";
import { renderMarkdown } from "../content/render";
import { ContentError, type RawPostSource } from "../content/types";
import { buildTaxonomy, readTaxonomyText } from "../content/taxonomy";
import { validateContent } from "../content/validate";
import { author } from "../seed/versions/v1.0.0";

const compact = (html: string): string => html.replace(/>\s+</g, "><");

const YML = (extra = ""): string =>
  [
    "slug: sample-post",
    "author: esmaeil-ahmadipour",
    "category: engineering",
    "tags: [flutter, architecture]",
    "status: published",
    'publishedAt: "2025-01-15"',
    extra,
    "locales:",
    "  en:",
    '    title: "English title"',
    "  fa:",
    '    title: "Persian title"',
  ]
    .filter(Boolean)
    .join("\n");

const YML_AR = `${YML()}\n  ar:\n    title: "Arabic title"`;

function source(overrides: Partial<RawPostSource> = {}): RawPostSource {
  return {
    dirName: "sample-post",
    postYml: YML(),
    bodies: { en: "## English\n\nBody", fa: "## Persian\n\nBody" },
    unexpectedFiles: [],
    ...overrides,
  };
}

function issuesOf(run: () => unknown): string {
  try {
    run();
  } catch (error) {
    assert.ok(error instanceof ContentError, "expected a ContentError");
    return error.issues.join("\n");
  }
  assert.fail("expected a ContentError");
}

const tempRoots: string[] = [];
after(() => {
  for (const root of tempRoots) rmSync(root, { recursive: true, force: true });
});

function tempContent(manifest: string, posts: Record<string, Record<string, string>>): string {
  const root = mkdtempSync(path.join(tmpdir(), "content-test-"));
  tempRoots.push(root);
  writeFileSync(path.join(root, "manifest.json"), manifest);
  for (const [dir, files] of Object.entries(posts)) {
    mkdirSync(path.join(root, "posts", dir), { recursive: true });
    for (const [name, text] of Object.entries(files)) {
      writeFileSync(path.join(root, "posts", dir, name), text);
    }
  }
  return root;
}

describe("renderMarkdown", () => {
  it("renders headings, paragraphs and lists without generating heading ids", () => {
    const html = compact(renderMarkdown("## A\n\nText **b**\n\n- x\n- y"));
    assert.equal(html, "<h2>A</h2><p>Text <strong>b</strong></p><ul><li>x</li><li>y</li></ul>");
  });

  it("rejects h1 headings, from Markdown and from raw HTML", () => {
    assert.throws(() => renderMarkdown("# Title\n\nBody"), ContentError);
    assert.throws(() => renderMarkdown('<h1 class="x">Title</h1>\n\nBody'), ContentError);
  });

  it("keeps an existing heading id", () => {
    assert.match(renderMarkdown('<h2 id="custom">T</h2>'), /<h2 id="custom">T<\/h2>/);
  });

  it("requires local verification: strips scripts, handlers and unsafe URLs", () => {
    const html = renderMarkdown(
      '<script>alert(1)</script>\n\n<img src="/a.png" onerror="alert(2)">\n\n' +
        "[x](javascript:alert(3))\n\n![d](data:image/png;base64,AAAA)",
    );
    assert.doesNotMatch(html, /<script/i);
    assert.doesNotMatch(html, /onerror/i);
    assert.doesNotMatch(html, /javascript:/i);
    assert.doesNotMatch(html, /data:/i);
    assert.doesNotMatch(html, /alert/);
  });

  it("requires local verification: keeps only language-* classes on code", () => {
    const fenced = renderMarkdown("```ts\nconst a = 1;\n```");
    assert.match(fenced, /<pre><code class="language-ts">/);
    assert.doesNotMatch(renderMarkdown('<code class="evil">x</code>'), /evil/);
  });
});

describe("hashing", () => {
  it("canonicalJson ignores key order and serializes dates as ISO strings", () => {
    assert.equal(canonicalJson({ b: 1, a: { d: 2, c: 3 } }), canonicalJson({ a: { c: 3, d: 2 }, b: 1 }));
    assert.equal(canonicalJson(new Date("2025-01-15")), '"2025-01-15T00:00:00.000Z"');
  });

  it("is stable across BOM, CRLF, trailing newlines and tag order", () => {
    const base = buildPost(source());
    const noisy = buildPost(
      source({
        postYml: YML().replace("[flutter, architecture]", "[architecture, flutter]"),
        bodies: { en: "\uFEFF## English\r\n\r\nBody\r\n\r\n", fa: "## Persian\n\nBody\n" },
      }),
    );
    assert.equal(noisy.sourceHash, base.sourceHash);
    assert.deepEqual(noisy.fieldHashes, base.fieldHashes);
  });

  it("changes only the affected field hashes", () => {
    const base = buildPost(source());
    const edited = buildPost(source({ bodies: { en: "## English\n\nChanged", fa: "## Persian\n\nBody" } }));
    assert.notEqual(edited.sourceHash, base.sourceHash);
    const changed = Object.keys(base.fieldHashes).filter((k) => base.fieldHashes[k] !== edited.fieldHashes[k]);
    assert.deepEqual(changed, ["contentEn"]);

    const retitled = buildPost(source({ postYml: YML().replace("English title", "Other") }));
    const changedTitle = Object.keys(base.fieldHashes).filter((k) => base.fieldHashes[k] !== retitled.fieldHashes[k]);
    assert.deepEqual(changedTitle, ["titleEn"]);
    assert.notEqual(retitled.sourceHash, base.sourceHash);
  });
});

describe("buildPost", () => {
  it("maps an absent Arabic locale to empty strings and nulls", () => {
    const { fields, locales, relations } = buildPost(source());
    assert.deepEqual(locales, ["en", "fa"]);
    assert.equal(fields.titleAr, "");
    assert.equal(fields.contentAr, "");
    assert.equal(fields.excerptAr, "");
    assert.equal(fields.keywordsAr, null);
    assert.equal(fields.excerptEn, null);
    assert.equal(compact(String(fields.contentEn)), "<h2>English</h2><p>Body</p>");
    assert.equal((fields.publishedAt as Date).toISOString(), "2025-01-15T00:00:00.000Z");
    assert.deepEqual(relations.tagSlugs, ["architecture", "flutter"]);
  });

  it("accepts a complete Arabic locale", () => {
    const post = buildPost(source({ postYml: YML_AR, bodies: { en: "## E", fa: "## F", ar: "## A" } }));
    assert.deepEqual(post.locales, ["en", "fa", "ar"]);
    assert.equal(post.fields.titleAr, "Arabic title");
  });

  it("rejects unknown keys and a missing publishedAt on published posts", () => {
    assert.match(issuesOf(() => buildPost(source({ postYml: YML("oops: 1") }))), /oops/);
    assert.match(
      issuesOf(() => buildPost(source({ postYml: YML().replace('publishedAt: "2025-01-15"\n', "") }))),
      /publishedAt/,
    );
  });

  it("rejects a slug that differs from its directory", () => {
    assert.match(issuesOf(() => buildPost(source({ dirName: "other" }))), /does not match its directory/);
  });

  it("requires Markdown and metadata to agree per locale", () => {
    assert.match(issuesOf(() => buildPost(source({ bodies: { en: "## E", fa: "## F", ar: "## A" } }))), /ar\.md exists/);
    assert.match(issuesOf(() => buildPost(source({ postYml: YML_AR }))), /ar\.md is missing/);
    assert.match(issuesOf(() => buildPost(source({ bodies: { en: "## E" } }))), /fa\.md is missing/);
    assert.match(issuesOf(() => buildPost(source({ bodies: { en: "  \n", fa: "## F" } }))), /en\.md is empty/);
  });

  it("reports unexpected files and a missing post.yml", () => {
    assert.match(issuesOf(() => buildPost(source({ unexpectedFiles: ["AR.md"] }))), /unexpected file "AR\.md"/);
    assert.match(issuesOf(() => buildPost(source({ postYml: undefined }))), /post\.yml is missing/);
  });
});

describe("validateContent", () => {
  it("validates a temporary tree and flags manifest problems", () => {
    const root = tempContent('{"posts":["sample-post","ghost","sample-post"]}', {
      "sample-post": { "post.yml": YML(), "en.md": "## E\n", "fa.md": "## F\n" },
    });
    const result = validateContent(root);
    assert.equal(result.ok, false);
    assert.equal(result.posts.length, 1);
    const errors = result.errors.join("\n");
    assert.match(errors, /"ghost" but posts\/ghost\/ does not exist/);
    assert.match(errors, /"sample-post" is listed more than once/);
  });

  it("reports a missing manifest and a missing posts directory", () => {
    const root = mkdtempSync(path.join(tmpdir(), "content-test-"));
    tempRoots.push(root);
    const errors = validateContent(root).errors.join("\n");
    assert.match(errors, /manifest\.json not found/);
    assert.match(errors, /posts\/ directory not found/);
  });
});

describe("repository content", () => {
  const result = validateContent();

  it("has no validation errors and an empty release manifest", () => {
    assert.deepEqual(result.errors, []);
    assert.deepEqual(result.manifestSlugs, []);
  });

  it("contains the three legacy sample posts in all three languages", () => {
    assert.deepEqual(result.posts.map((post) => post.slug).sort(), [
      "flutter-clean-architecture-patterns",
      "introducing-tarvix-engineering-system",
      "web3-development-best-practices",
    ]);
    for (const post of result.posts) {
      assert.deepEqual(post.locales, ["en", "fa", "ar"]);
      assert.equal(post.fields.status, "published");
      for (const suffix of ["En", "Fa", "Ar"]) {
        const html = String(post.fields[`content${suffix}`]);
        assert.match(html, /<h2>/);
        assert.doesNotMatch(html, /<h1/i);
      }
    }
  });

  it("keeps the legacy publication dates", () => {
    const dates = Object.fromEntries(
      result.posts.map((post) => [post.slug, (post.fields.publishedAt as Date).toISOString()]),
    );
    assert.deepEqual(dates, {
      "flutter-clean-architecture-patterns": "2025-02-20T00:00:00.000Z",
      "introducing-tarvix-engineering-system": "2025-01-15T00:00:00.000Z",
      "web3-development-best-practices": "2025-03-10T00:00:00.000Z",
    });
  });

  it("references only the seed author and the category and tag slugs of taxonomy.yml", () => {
    const taxonomy = buildTaxonomy(readTaxonomyText());
    const slugsOf = (kind: string) =>
      new Set(taxonomy.filter((item) => item.kind === kind).map((item) => item.slug));
    const categorySlugs = slugsOf("category");
    const tagSlugs = slugsOf("tag");
    for (const { relations, slug } of result.posts) {
      assert.equal(relations.authorSlug, author.slug, slug);
      assert.ok(categorySlugs.has(relations.categorySlug), `${slug}: category ${relations.categorySlug}`);
      for (const tag of relations.tagSlugs) assert.ok(tagSlugs.has(tag), `${slug}: tag ${tag}`);
    }
  });
});
