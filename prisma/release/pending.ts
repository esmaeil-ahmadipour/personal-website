// prisma/release/pending.ts
//
// Lists migrations that exist on disk but are not yet applied to the database.
// Read-only: one SELECT on _prisma_migrations.

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { Client } from "pg";
import type { PendingMigration } from "./destructive";

const PG_UNDEFINED_TABLE = "42P01";

export async function listPendingMigrations(
  connectionString: string,
  migrationsDir: string,
): Promise<PendingMigration[]> {
  const entries = await readdir(migrationsDir, { withFileTypes: true });
  const names = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const client = new Client({
    connectionString,
    application_name: "release-scan",
    connectionTimeoutMillis: 15_000,
    query_timeout: 15_000,
  });
  await client.connect();

  let applied: Set<string>;
  try {
    try {
      const result = await client.query<{ migration_name: string }>(
        "SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL",
      );
      applied = new Set(result.rows.map((row) => row.migration_name));
    } catch (error) {
      if ((error as { code?: string }).code !== PG_UNDEFINED_TABLE) throw error;
      applied = new Set(); // fresh database: nothing has been applied yet
    }
  } finally {
    await client.end();
  }

  return Promise.all(
    names
      .filter((name) => !applied.has(name))
      .map(async (name) => ({
        name,
        sql: await readFile(join(migrationsDir, name, "migration.sql"), "utf8"),
      })),
  );
}
