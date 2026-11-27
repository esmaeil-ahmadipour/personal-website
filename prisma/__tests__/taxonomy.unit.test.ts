// prisma/__tests__/taxonomy.unit.test.ts
//
// Offline tests for content/taxonomy.yml: parsing, per-item hashes, approval and the import plan.
// Run from the project root (content/ is resolved from the working directory).

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  approveTaxonomy,
  buildTaxonomy,
  parseTaxonomyTargets,
  pinStatus,
  readTaxonomyText,
  serializeFullManifest,
  validateTaxonomy,
} from "../content/taxonomy";
import { planItem } from "../content/taxonomy-import";
import { ContentError } from "../content/types";
import { categories, tags } from "../seed/versions/v1.0.0";

const YML = `
categories:
  - slug: engineering
    order: 2
    locales:
      en: { name: "Engineering", description: "Notes" }
      fa: { name: "مهندسی" }
tags:
  - slug: flutter
    icon: smartphone
    locales:
      en: { name: "Flutter" }
      fa: { name: "فلاتر" }
      ar: { name: "فلاتر" }
`;

const issuesOf = (run: () => unknown): string => {
  try {
    run();
  } catch (error) {
    assert.ok(error instanceof ContentError, "expected a ContentError");
    return error.issues.join("\n");
  }
  return assert.fail("expected a ContentError");
};

describe("buildTaxonomy", () => {
  it("maps categories and tags to column values", () => {
    const [category, tag] = buildTaxonomy(YML);
    assert.deepEqual(category.fields, {
      order: 2,
      isActive: true,
      nameEn: "Engineering",
      descriptionEn: "Notes",
      nameFa: "مهندسی",
      descriptionFa: null,
      nameAr: "",
      descriptionAr: "",
    });
    assert.deepEqual(tag.fields, {
      color: "#3b82f6",
      icon: "smartphone",
      nameEn: "Flutter",
      nameFa: "فلاتر",
      nameAr: "فلاتر",
    });
    assert.equal(category.kind, "category");
    assert.equal(tag.kind, "tag");
  });

  it("treats a missing or empty file as no items", () => {
    assert.deepEqual(buildTaxonomy(undefined), []);
    assert.deepEqual(buildTaxonomy(""), []);
  });

  it("rejects unknown keys, duplicates, bad colors and a missing Persian name", () => {
    const tagYml = (extra: string) => `tags:\n  - slug: a\n    ${extra}\n    locales:\n      en: { name: "A" }\n      fa: { name: "A" }`;
    assert.match(issuesOf(() => buildTaxonomy(`${YML}oops: 1`)), /oops/);
    assert.match(issuesOf(() => buildTaxonomy(`${YML}  - slug: flutter\n    locales:\n      en: { name: "F" }\n      fa: { name: "F" }`)), /listed more than once/);
    assert.match(issuesOf(() => buildTaxonomy(tagYml("color: red"))), /hex color/);
    assert.match(issuesOf(() => buildTaxonomy("categories:\n  - slug: a\n    locales:\n      en: { name: A }")), /locales\.fa/);
  });
});

describe("hashes and approval", () => {
  it("hashes every item on its own", () => {
    const [category, tag] = buildTaxonomy(YML);
    const [category2, tag2] = buildTaxonomy(YML.replace('name: "Flutter"', 'name: "Flutter SDK"'));
    assert.equal(category2.sourceHash, category.sourceHash);
    assert.notEqual(tag2.sourceHash, tag.sourceHash);
    const changed = Object.keys(tag.fieldHashes).filter((k) => tag.fieldHashes[k] !== tag2.fieldHashes[k]);
    assert.deepEqual(changed, ["nameEn"]);
  });

  it("reports the approval status of an item", () => {
    const [category] = buildTaxonomy(YML);
    assert.equal(pinStatus([], category), "not in manifest");
    assert.equal(pinStatus([{ slug: "engineering" }], category), "in manifest, NOT approved");
    assert.equal(pinStatus([{ slug: "engineering", sourceHash: category.sourceHash }], category), "approved");
  });

  it("approves, re-pins and leaves other entries alone", () => {
    const items = buildTaxonomy(YML);
    const empty = { category: [], tag: [] };
    const first = approveTaxonomy(empty, items, { refresh: false, all: true, targets: [] });
    assert.equal(first.changed, true);
    assert.deepEqual(first.entries.category.map((e) => e.slug), ["engineering"]);
    assert.deepEqual(first.entries.tag.map((e) => e.slug), ["flutter"]);

    const again = approveTaxonomy(first.entries, items, { refresh: true, all: false, targets: [] });
    assert.equal(again.changed, false);

    const only = approveTaxonomy(first.entries, items, { refresh: false, all: false, targets: [{ kind: "tag", slug: "flutter" }] });
    assert.equal(only.changed, false);
    assert.throws(() => approveTaxonomy(empty, items, { refresh: false, all: false, targets: [{ kind: "tag", slug: "ghost" }] }), ContentError);
  });

  it("parses approve targets and writes a stable manifest", () => {
    assert.deepEqual(parseTaxonomyTargets(["category:a", "tag:b:c"]), [
      { kind: "category", slug: "a" },
      { kind: "tag", slug: "b:c" },
    ]);
    assert.throws(() => parseTaxonomyTargets(["post:a"]), ContentError);
    assert.throws(() => parseTaxonomyTargets(["tag:"]), ContentError);
    assert.equal(serializeFullManifest([], { category: [], tag: [] }), '{\n  "posts": []\n}\n');
    const text = serializeFullManifest([{ slug: "p" }], {
      category: [{ slug: "b", sourceHash: "h" }, { slug: "a" }],
      tag: [],
    });
    assert.deepEqual(JSON.parse(text), { posts: ["p"], categories: ["a", { slug: "b", sourceHash: "h" }] });
  });
});

describe("planItem", () => {
  const [category] = buildTaxonomy(YML);
  const row = {
    id: "1",
    slug: "engineering",
    order: 2,
    isActive: true,
    nameEn: "Engineering",
    descriptionEn: "Notes",
    nameFa: "مهندسی",
    descriptionFa: null,
    nameAr: "",
    descriptionAr: "",
  };
  const sync = {
    sourceHash: "old",
    formatVersion: 1,
    fieldHashes: category.fieldHashes,
    consumedForceTokens: [],
  };
  const renamed = buildTaxonomy(YML.replace('name: "Engineering"', 'name: "Software Engineering"'))[0];

  it("creates new items and skips unmanaged and orphaned ones with a hint", () => {
    assert.equal(planItem(category, null, null).action, "create");
    const unmanaged = planItem(category, row, null);
    assert.equal(unmanaged.action, "skip");
    assert.match(unmanaged.warnings.join(""), /content:adopt/);
    assert.equal(planItem(category, null, sync).action, "skip");
  });

  it("updates fields that only the file changed", () => {
    const plan = planItem(renamed, row, sync);
    assert.equal(plan.action, "update");
    assert.deepEqual(plan.writeFields, ["nameEn"]);
    assert.deepEqual(plan.conflicts, []);
  });

  it("keeps a database edit and reports a conflict when both changed", () => {
    const plan = planItem(renamed, { ...row, nameEn: "Edited" }, sync);
    assert.deepEqual(plan.writeFields, []);
    assert.deepEqual(plan.conflicts, ["nameEn"]);
  });

  it("only records the sync state right after adopt", () => {
    const plan = planItem(category, row, sync);
    assert.deepEqual(plan.writeFields, []);
    assert.deepEqual(plan.conflicts, []);
    assert.equal(plan.syncChanged, true);
  });
});

describe("repository taxonomy", () => {
  const result = validateTaxonomy();

  it("is valid and has no pin problems", () => {
    assert.deepEqual(result.errors, []);
    assert.deepEqual(result.pinProblems, []);
  });

  it("covers every category and tag that seed v1.0.0 created", () => {
    const slugs = (kind: string) =>
      new Set(result.items.filter((item) => item.kind === kind).map((item) => item.slug));
    for (const category of categories) assert.ok(slugs("category").has(category.slug), category.slug);
    for (const tag of tags) assert.ok(slugs("tag").has(tag.slug), tag.slug);
  });

  it("is read from taxonomy.yml", () => {
    assert.ok(readTaxonomyText() !== undefined);
  });
});
