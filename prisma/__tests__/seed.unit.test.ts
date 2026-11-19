// prisma/__tests__/seed.unit.test.ts
//
// Unit tests that need NO database. Run from the repository root.

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { resolveDatabaseUrl, stripPrismaParams } from "../lib/connection";
import { errorMessage, redact } from "../lib/log";
import {
  compareSeedVersions,
  parseSeedVersion,
  seedVersions,
  validateSeedVersions,
} from "../seed/registry";
import type { SeedVersion } from "../seed/types";
import { describeCompareAndSet, describeInsert } from "../seed/utils/helpers";
import { author, categories, tags } from "../seed/versions/v1.0.0";
import {
  legacyAuthor,
  legacyCategories,
  legacyTags,
} from "./fixtures/legacy-system-data";

function fakeVersion(version: string, description = "test"): SeedVersion {
  return { version, description, async run() {} };
}

describe("seed registry validation", () => {
  it("accepts the production registry", () => {
    validateSeedVersions(seedVersions);
    assert.equal(seedVersions[0].version, "v1.0.0");
  });

  it("parses and compares semantic versions numerically", () => {
    assert.deepEqual(parseSeedVersion("v1.12.3"), [1, 12, 3]);
    assert.ok(compareSeedVersions("v1.2.0", "v1.10.0") < 0);
    assert.ok(compareSeedVersions("v2.0.0", "v1.99.99") > 0);
    assert.equal(compareSeedVersions("v1.0.0", "v1.0.0"), 0);
  });

  it("rejects malformed versions", () => {
    for (const bad of ["1.0.0", "v1.0", "v1.0.0-beta", "version1", ""]) {
      assert.throws(() => validateSeedVersions([fakeVersion(bad)]), /Invalid seed version/);
    }
  });

  it("rejects duplicate versions", () => {
    assert.throws(
      () => validateSeedVersions([fakeVersion("v1.0.0"), fakeVersion("v1.0.0")]),
      /Duplicate seed version/,
    );
  });

  it("rejects out-of-order versions", () => {
    assert.throws(
      () => validateSeedVersions([fakeVersion("v1.1.0"), fakeVersion("v1.0.0")]),
      /strictly ascending/,
    );
    assert.throws(
      () => validateSeedVersions([fakeVersion("v1.10.0"), fakeVersion("v1.2.0")]),
      /strictly ascending/,
    );
  });

  it("requires a description", () => {
    assert.throws(
      () => validateSeedVersions([fakeVersion("v1.0.0", "  ")]),
      /needs a description/,
    );
  });
});

describe("connection helpers", () => {
  it("prefers DIRECT_DATABASE_URL and falls back to DATABASE_URL", () => {
    assert.equal(
      resolveDatabaseUrl({ DIRECT_DATABASE_URL: "postgresql://direct", DATABASE_URL: "postgresql://pooled" }),
      "postgresql://direct",
    );
    assert.equal(resolveDatabaseUrl({ DATABASE_URL: "postgresql://pooled" }), "postgresql://pooled");
    assert.throws(() => resolveDatabaseUrl({}), /DATABASE_URL is not set/);
  });

  it("removes Prisma-only parameters and keeps the rest", () => {
    assert.equal(
      stripPrismaParams(
        "postgresql://u:p@h:5432/db?schema=public&connection_limit=5&pgbouncer=true&sslmode=require",
      ),
      "postgresql://u:p@h:5432/db?sslmode=require",
    );
  });

  it("leaves a URL without Prisma parameters unchanged, and tolerates invalid input", () => {
    assert.equal(stripPrismaParams("postgresql://u:p@h:5432/db"), "postgresql://u:p@h:5432/db");
    assert.equal(stripPrismaParams("not a url"), "not a url");
  });
});

describe("redaction", () => {
  it("masks credentials in URLs and password parameters", () => {
    assert.equal(
      redact("connect postgresql://admin:s3cret@db.example.com:5432/app failed"),
      "connect postgresql://***@db.example.com:5432/app failed",
    );
    assert.equal(redact("password=hunter2&x=1"), "password=***&x=1");
  });

  it("redacts and truncates error messages", () => {
    const message = errorMessage(new Error(`bad postgres://u:p@h/db ${"x".repeat(50)}`), 40);
    assert.ok(!message.includes("u:p@"));
    assert.ok(message.endsWith("[truncated]"));
  });
});

describe("helpers", () => {
  it("describes inserts and compare-and-set results", () => {
    assert.equal(
      describeInsert("Category", 3, 4),
      "Category: 3 inserted, 1 already present (left untouched)",
    );
    assert.match(describeCompareAndSet("x", 1), /updated \(1 row\)/);
    assert.match(describeCompareAndSet("x", 0), /skipped/);
  });
});

describe("v1.0.0 preserves the original seed data", () => {
  it("contains exactly the legacy author, categories and tags", () => {
    assert.deepEqual(author, legacyAuthor);
    assert.deepEqual(categories, legacyCategories);
    assert.deepEqual(tags, legacyTags);
    assert.equal(categories.length, 4);
    assert.equal(tags.length, 9);
  });
});

describe("seed versions stay non-destructive", () => {
  const FORBIDDEN: [RegExp, string][] = [
    [/\.upsert\s*\(/, "upsert (overwrites existing rows)"],
    [/\.update\s*\(/, "update (use updateMany with an expected old value)"],
    [/\.delete\s*\(/, "delete"],
    [/\.deleteMany\s*\(/, "deleteMany"],
    [/\$executeRaw|\$queryRaw/, "raw SQL"],
    [/\bTRUNCATE\b|\bDROP\s+(TABLE|SCHEMA|DATABASE)\b/i, "destructive SQL"],
    [/new\s+PrismaClient/, "a separate PrismaClient (must use the transaction client)"],
  ];

  it("no version file uses a forbidden operation", () => {
    const dir = path.resolve(process.cwd(), "prisma", "seed", "versions");
    const files = readdirSync(dir).filter((name) => name.endsWith(".ts"));
    assert.ok(files.length > 0, "expected at least one version file");
    for (const file of files) {
      const code = readFileSync(path.join(dir, file), "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/[^\n]*/g, "");
      for (const [pattern, label] of FORBIDDEN) {
        assert.ok(!pattern.test(code), `${file} uses ${label}`);
      }
    }
  });
});
