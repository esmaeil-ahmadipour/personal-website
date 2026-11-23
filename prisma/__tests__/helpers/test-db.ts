// prisma/__tests__/helpers/test-db.ts
//
// Integration-test database helper.
//
// Every test gets its own PostgreSQL schema ("seedtest_<hex>") inside the
// database named by TEST_DATABASE_URL. The schema is built from the project's real
// migration SQL files and dropped afterwards. Nothing in any other schema is ever
// read, changed or dropped, and no TRUNCATE/DELETE runs outside the throwaway schema.
//
// Safety checks, all enforced before the first write:
//   - TEST_DATABASE_URL must be set explicitly (DATABASE_URL is never used);
//   - the host must be local (localhost, 127.0.0.1 or ::1);
//   - the database name must contain "test";
//   - it must not be the same database as DATABASE_URL or DIRECT_DATABASE_URL;
//   - the database name reported by the SERVER (current_database()) must match the
//     URL and contain "test", again before creating a schema and before dropping it.

import { randomBytes } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { Client } from "pg";
import { stripPrismaParams } from "../../lib/connection";
import type { Logger } from "../../lib/log";

/** Pass as `{ skip: skipReason }` so a missing database shows up as SKIPPED, never as passed. */
export const skipReason: string | false = process.env.TEST_DATABASE_URL
  ? false
  : 'TEST_DATABASE_URL is not set (point it at a throwaway local database whose name contains "test")';

export interface TestDb {
  readonly schema: string;
  readonly prisma: PrismaClient;
  /** Prisma connection string (includes ?schema=...), for extra clients on the same schema. */
  readonly prismaUrl: string;
  /** Plain connection string (no Prisma-only parameters) for pg clients and the advisory lock. */
  readonly pgUrl: string;
  /** Unique advisory-lock key so parallel test files never contend with each other. */
  readonly lockKey: readonly [number, number];
  drop(): Promise<void>;
}

const MIGRATIONS_DIR = path.resolve(process.cwd(), "prisma", "migrations");
const SCHEMA_PATTERN = /^seedtest_[0-9a-f]{8}$/;
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

function databaseName(url: URL): string {
  return decodeURIComponent(url.pathname.replace(/^\//, ""));
}

function samePlace(other: string | undefined, target: URL): boolean {
  if (!other) return false;
  try {
    const parsed = new URL(other);
    return (
      parsed.hostname === target.hostname &&
      (parsed.port || "5432") === (target.port || "5432") &&
      databaseName(parsed) === databaseName(target)
    );
  } catch {
    return false;
  }
}

function testDatabaseTarget(): { url: string; name: string } {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) throw new Error("TEST_DATABASE_URL is not set.");
  const parsed = new URL(url);
  if (!LOCAL_HOSTS.has(parsed.hostname)) {
    throw new Error(
      `Refusing to run: TEST_DATABASE_URL must point at a local database, not "${parsed.hostname}".`,
    );
  }
  const name = databaseName(parsed);
  if (!/test/i.test(name)) {
    throw new Error(
      `Refusing to run: the test database name "${name}" must contain "test".`,
    );
  }
  if (
    samePlace(process.env.DATABASE_URL, parsed) ||
    samePlace(process.env.DIRECT_DATABASE_URL, parsed)
  ) {
    throw new Error(
      "Refusing to run: TEST_DATABASE_URL is the same database as DATABASE_URL / DIRECT_DATABASE_URL.",
    );
  }
  return { url, name };
}

/** Asks the server which database this connection really is, and refuses anything but the expected test database. */
async function assertServerDatabase(
  client: Client,
  expectedName: string,
): Promise<void> {
  const result = await client.query<{ db: string }>(
    "SELECT current_database() AS db",
  );
  const actual = result.rows[0].db;
  if (actual !== expectedName || !/test/i.test(actual)) {
    throw new Error(
      `Refusing to run: the server reports database "${actual}", expected the test database "${expectedName}".`,
    );
  }
}

export async function createTestDb(
  options: { migrate?: boolean } = {},
): Promise<TestDb> {
  const migrate = options.migrate ?? true;
  const target = testDatabaseTarget();
  const pgUrl = stripPrismaParams(target.url);
  const suffix = randomBytes(4).toString("hex");
  const schema = `seedtest_${suffix}`;

  const admin = new Client({ connectionString: pgUrl });
  await admin.connect();
  try {
    await assertServerDatabase(admin, target.name); // before the first write
    await admin.query(`CREATE SCHEMA "${schema}"`);
    if (migrate) {
      await admin.query(`SET search_path TO "${schema}"`);
      const folders = readdirSync(MIGRATIONS_DIR)
        .filter((name) => /^\d{14}_/.test(name))
        .sort();
      for (const folder of folders) {
        const sql = readFileSync(
          path.join(MIGRATIONS_DIR, folder, "migration.sql"),
          "utf8",
        );
        await admin.query(sql);
      }
    }
  } finally {
    await admin.end();
  }

  const prismaUrlObject = new URL(pgUrl);
  prismaUrlObject.searchParams.set("schema", schema);
  prismaUrlObject.searchParams.set("connection_limit", "10");
  const prismaUrl = prismaUrlObject.toString();
  const prisma = new PrismaClient({ datasourceUrl: prismaUrl });

  return {
    schema,
    prisma,
    prismaUrl,
    pgUrl,
    lockKey: [20260702, parseInt(suffix, 16) % 2_000_000_000],
    async drop(): Promise<void> {
      await prisma.$disconnect();
      if (!SCHEMA_PATTERN.test(schema)) {
        throw new Error(`Refusing to drop unexpected schema "${schema}".`);
      }
      const cleaner = new Client({ connectionString: pgUrl });
      await cleaner.connect();
      try {
        await assertServerDatabase(cleaner, target.name); // before the drop
        await cleaner.query(`DROP SCHEMA "${schema}" CASCADE`);
      } finally {
        await cleaner.end();
      }
    },
  };
}

export const silentLogger: Logger = {
  info() {},
  warn() {},
  error() {},
};

export function collectingLogger(): { log: Logger; lines: string[] } {
  const lines: string[] = [];
  return {
    lines,
    log: {
      info: (message) => lines.push(`INFO ${message}`),
      warn: (message) => lines.push(`WARN ${message}`),
      error: (message) => lines.push(`ERROR ${message}`),
    },
  };
}
