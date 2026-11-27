import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { contentStatus, describePlan, planFingerprint, sha256, type ReleasePlan } from "../release/plan";

const H1 = "a".repeat(64);
const H2 = "b".repeat(64);

const base = (): ReleasePlan => ({
  migrations: [
    { name: "20260101_a", sqlHash: sha256("a") },
    { name: "20260102_b", sqlHash: sha256("b") },
  ],
  seeds: ["1.1.0"],
  content: [
    { kind: "post", slug: "alpha", sourceHash: H1, status: "create" },
    { kind: "post", slug: "beta", sourceHash: H2, status: "unchanged" },
  ],
  blocked: false,
});

describe("plan fingerprint", () => {
  it("is a stable sha256 that ignores the order of migrations and posts", () => {
    const plan = base();
    const shuffled: ReleasePlan = {
      ...plan,
      migrations: [...plan.migrations].reverse(),
      content: [...plan.content].reverse(),
    };
    assert.match(planFingerprint(plan), /^[0-9a-f]{64}$/);
    assert.equal(planFingerprint(plan), planFingerprint(shuffled));
    assert.equal(planFingerprint(plan), planFingerprint(base()));
  });

  it("changes when anything the release would do changes", () => {
    const reference = planFingerprint(base());
    const variants: ReleasePlan[] = [];

    const sql = base();
    sql.migrations[0].sqlHash = sha256("changed");
    variants.push(sql);

    const extraMigration = base();
    extraMigration.migrations.push({ name: "20260103_c", sqlHash: sha256("c") });
    variants.push(extraMigration);

    variants.push({ ...base(), seeds: [] });
    variants.push({ ...base(), seeds: null });
    variants.push({ ...base(), seeds: ["1.1.0", "1.2.0"] });

    const status = base();
    status.content[0].status = "update";
    variants.push(status);

    const hash = base();
    hash.content[1].sourceHash = H1;
    variants.push(hash);

    const kind = base();
    kind.content[0].kind = "project";
    variants.push(kind);

    variants.push({ ...base(), content: base().content.slice(0, 1) });
    variants.push({ ...base(), blocked: true });

    const seen = new Set([reference]);
    for (const variant of variants) {
      const fingerprint = planFingerprint(variant);
      assert.ok(!seen.has(fingerprint), "every variant must have its own fingerprint");
      seen.add(fingerprint);
    }
  });
});

describe("plan fingerprint with several kinds", () => {
  it("tells a post, an issue and a project with the same slug apart", () => {
    const item = (kind: "post" | "newsletter" | "project") => ({ kind, slug: "5", sourceHash: H1, status: "create" });
    const withKinds = (...kinds: ("post" | "newsletter" | "project")[]): ReleasePlan => ({
      ...base(),
      content: kinds.map(item),
    });
    const fingerprints = new Set([
      planFingerprint(withKinds("post")),
      planFingerprint(withKinds("newsletter")),
      planFingerprint(withKinds("project")),
      planFingerprint(withKinds("post", "newsletter")),
    ]);
    assert.equal(fingerprints.size, 4);
  });

  it("ignores the order of items of different kinds", () => {
    const plan = base();
    plan.content.push({ kind: "newsletter", slug: "5", sourceHash: H2, status: "create" });
    plan.content.push({ kind: "project", slug: "demo", sourceHash: H1, status: "update" });
    const shuffled: ReleasePlan = { ...plan, content: [...plan.content].reverse() };
    assert.equal(planFingerprint(plan), planFingerprint(shuffled));
  });
});

describe("content status", () => {
  const outcome = {
    created: ["a"],
    updated: ["b"],
    unchanged: ["c"],
    skipped: ["d", "e"],
    conflicts: ["e"],
  };

  it("names what the import dry run decided for an item", () => {
    assert.equal(contentStatus("a", outcome), "create");
    assert.equal(contentStatus("b", outcome), "update");
    assert.equal(contentStatus("c", outcome), "unchanged");
    assert.equal(contentStatus("d", outcome), "skip");
    assert.equal(contentStatus("e", outcome), "skip+conflict");
    assert.equal(contentStatus("zzz", outcome), "none");
  });
});

describe("plan description", () => {
  it("lists migrations, seeds and content items", () => {
    const lines = describePlan(base());
    assert.deepEqual(lines, [
      "Plan: 2 pending migration(s)",
      `  migration 20260101_a (sql ${sha256("a").slice(0, 12)})`,
      `  migration 20260102_b (sql ${sha256("b").slice(0, 12)})`,
      "Plan: 1 pending seed version(s): 1.1.0",
      "Plan: 2 approved item(s)",
      `  post alpha: create (hash ${"a".repeat(12)})`,
      `  post beta: unchanged (hash ${"b".repeat(12)})`,
    ]);
  });

  it("names the kind of every item", () => {
    const plan = base();
    plan.content.push({ kind: "newsletter", slug: "5", sourceHash: H2, status: "create" });
    plan.content.push({ kind: "project", slug: "demo", sourceHash: H1, status: "after-migrations" });
    const lines = describePlan(plan);
    assert.ok(lines.includes("Plan: 4 approved item(s)"));
    assert.ok(lines.includes(`  newsletter 5: create (hash ${"b".repeat(12)})`));
    assert.ok(lines.includes(`  project demo: after-migrations (hash ${"a".repeat(12)})`));
  });

  it("explains unreadable seeds and blocked plans", () => {
    const lines = describePlan({ ...base(), seeds: null, blocked: true });
    assert.ok(lines.includes("Plan: seeds cannot be read until the migrations are applied"));
    assert.equal(lines.at(-1), "Plan: BLOCKED by conflicts that need review");
    assert.equal(describePlan({ ...base(), seeds: [] })[3], "Plan: 0 pending seed version(s)");
  });
});
