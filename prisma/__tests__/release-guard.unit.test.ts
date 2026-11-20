import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  RELEASE_ORCHESTRATOR_LOCK_KEY,
  ReleaseError,
  assertReleaseAllowed,
  buildSteps,
  isPooledUrl,
  isProductionEnv,
  parseReleaseArgs,
} from "../release/guard";

const TOKEN = "k".repeat(40);
const DIRECT = "postgresql://u:p@db.example.com:5432/app";

describe("release args", () => {
  it("accepts no arguments and --dry-run only", () => {
    assert.deepEqual(parseReleaseArgs([]), { dryRun: false });
    assert.deepEqual(parseReleaseArgs(["--dry-run"]), { dryRun: true });
  });

  it("refuses --all, --force and values without echoing values", () => {
    assert.throws(() => parseReleaseArgs(["--all"]), /--all/);
    assert.throws(() => parseReleaseArgs(["--force"]), /--force/);
    assert.throws(() => parseReleaseArgs(["secret-value"]), (error: unknown) => {
      assert.ok(error instanceof ReleaseError);
      assert.ok(!error.message.includes("secret-value"));
      assert.match(error.message, /\[value hidden\]/);
      return true;
    });
  });
});

describe("production guard", () => {
  it("detects production from VERCEL_ENV or NODE_ENV", () => {
    assert.equal(isProductionEnv({ VERCEL_ENV: "production" }), true);
    assert.equal(isProductionEnv({ NODE_ENV: "production" }), true);
    assert.equal(isProductionEnv({ VERCEL_ENV: "preview", NODE_ENV: "development" }), false);
    assert.equal(isProductionEnv({}), false);
  });

  it("allows anything outside production", () => {
    assert.doesNotThrow(() => assertReleaseAllowed({}));
    assert.doesNotThrow(() => assertReleaseAllowed({ DATABASE_URL: "postgresql://u:p@localhost/db" }));
  });

  it("requires a direct, non-pooled URL and a valid admin token in production", () => {
    const ok = { VERCEL_ENV: "production", DIRECT_DATABASE_URL: DIRECT, ADMIN_API_TOKEN: TOKEN };
    assert.doesNotThrow(() => assertReleaseAllowed(ok));
    assert.throws(() => assertReleaseAllowed({ ...ok, DIRECT_DATABASE_URL: undefined }), /DIRECT_DATABASE_URL/);
    assert.throws(
      () => assertReleaseAllowed({ ...ok, DIRECT_DATABASE_URL: `${DIRECT}?pgbouncer=true` }),
      /pooled/,
    );
    assert.throws(() => assertReleaseAllowed({ ...ok, ADMIN_API_TOKEN: undefined }), /ADMIN_API_TOKEN/);
    assert.throws(() => assertReleaseAllowed({ ...ok, ADMIN_API_TOKEN: "short" }), /ADMIN_API_TOKEN/);
  });

  it("recognises pooled URLs", () => {
    assert.equal(isPooledUrl("postgresql://u:p@h.example.com:6543/db"), true);
    assert.equal(isPooledUrl("postgresql://u:p@ep-x-pooler.example.com/db"), true);
    assert.equal(isPooledUrl("postgresql://u:p@h.example.com/db?pgbouncer=true"), true);
    assert.equal(isPooledUrl(DIRECT), false);
    assert.equal(isPooledUrl("not a url"), false);
  });
});

describe("release plan", () => {
  it("runs migrate, seed, then content import, and never passes --all or --force", () => {
    for (const dryRun of [false, true]) {
      const steps = buildSteps(dryRun);
      assert.deepEqual(
        steps.map((step) => step.name),
        [dryRun ? "migrate status" : "migrate deploy", "seed", "content import"],
      );
      const flat = steps.flatMap((step) => step.args);
      assert.ok(!flat.includes("--all"));
      assert.ok(!flat.includes("--force"));
      assert.equal(flat.includes("--dry-run"), dryRun);
    }
  });

  it("uses a lock key distinct from the seed and import key", () => {
    assert.deepEqual([...RELEASE_ORCHESTRATOR_LOCK_KEY], [20260701, 2]);
  });
});
