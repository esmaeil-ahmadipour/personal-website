import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assessMigrations, parseAllowList } from "../release/destructive";

const m = (name: string, sql: string) => ({ name, sql });
const labels = (sql: string) => assessMigrations([m("x", sql)], new Set()).flatMap((d) => d.findings);

describe("destructive migration scan", () => {
  it("flags each destructive statement, case-insensitively and across lines", () => {
    assert.deepEqual(labels('DROP TABLE "Post";'), ["DROP TABLE"]);
    assert.deepEqual(labels('ALTER TABLE "Post" DROP COLUMN "legacy";'), ["DROP COLUMN"]);
    assert.deepEqual(labels("drop schema old cascade;"), ["DROP SCHEMA"]);
    assert.deepEqual(labels('TRUNCATE TABLE "Tag";'), ["TRUNCATE"]);
    assert.deepEqual(labels('DELETE FROM "Tag" WHERE id = 1;'), ["DELETE FROM"]);
    assert.deepEqual(labels('ALTER TABLE "Post"\n  ALTER COLUMN "views" SET DATA TYPE BIGINT;'), ["ALTER COLUMN TYPE"]);
    assert.deepEqual(labels('ALTER TABLE "Post" ALTER COLUMN "views" TYPE BIGINT;'), ["ALTER COLUMN TYPE"]);
  });

  it("reports every finding of one migration", () => {
    assert.deepEqual(labels('DELETE FROM "A";\nDROP TABLE "B";'), ["DROP TABLE", "DELETE FROM"]);
  });

  it("ignores additive and constraint-only changes", () => {
    const safe = [
      'CREATE TABLE "Author" ("id" TEXT NOT NULL);',
      'ALTER TABLE "Post" ADD COLUMN "subtitle" TEXT;',
      'CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");',
      'DROP INDEX "Post_old_idx";',
      'ALTER TABLE "Post" DROP CONSTRAINT "Post_fk";',
      'ALTER TABLE "Post" ALTER COLUMN "title" SET NOT NULL;',
      "CREATE TYPE \"Status\" AS ENUM ('A');",
    ];
    for (const sql of safe) assert.deepEqual(labels(sql), [], sql);
  });

  it("marks only exactly named migrations as allowed and returns only destructive ones", () => {
    const pending = [
      m("20260101_safe", 'ALTER TABLE "Post" ADD COLUMN "x" TEXT;'),
      m("20260102_drop", 'DROP TABLE "Old";'),
      m("20260103_drop2", 'DROP TABLE "Older";'),
    ];
    const result = assessMigrations(pending, new Set(["20260102_drop"]));
    assert.deepEqual(result, [
      { name: "20260102_drop", findings: ["DROP TABLE"], allowed: true },
      { name: "20260103_drop2", findings: ["DROP TABLE"], allowed: false },
    ]);
    assert.equal(assessMigrations(pending, new Set(["20260102"]))[0].allowed, false);
    assert.equal(assessMigrations(pending, new Set(["*"]))[0].allowed, false);
  });
});

describe("allow list", () => {
  it("parses comma-separated names, trims and drops empties", () => {
    assert.deepEqual([...parseAllowList(" a , b,, ")], ["a", "b"]);
    assert.deepEqual([...parseAllowList("")], []);
    assert.deepEqual([...parseAllowList(undefined)], []);
  });
});
