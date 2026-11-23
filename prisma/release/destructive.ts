// prisma/release/destructive.ts
//
// Pure scan of pending migration SQL for statements that can lose data. The scan is
// deliberately conservative: it matches the raw text (comments included), so it can
// over-report but never hide a statement behind a comment or string. It cannot see a
// rename that Prisma emits as drop + create unless the SQL itself contains a drop.

export interface PendingMigration {
  name: string;
  sql: string;
}

export interface DestructiveMigration {
  name: string;
  findings: string[];
  allowed: boolean;
}

const PATTERNS: ReadonlyArray<readonly [string, RegExp]> = [
  ["DROP TABLE", /\bDROP\s+TABLE\b/i],
  ["DROP COLUMN", /\bDROP\s+COLUMN\b/i],
  ["DROP SCHEMA", /\bDROP\s+SCHEMA\b/i],
  ["TRUNCATE", /\bTRUNCATE\b/i],
  ["DELETE FROM", /\bDELETE\s+FROM\b/i],
  ["ALTER COLUMN TYPE", /\bALTER\s+COLUMN\b[^;]*\bTYPE\b/i],
];

/** RELEASE_ALLOW_DESTRUCTIVE: comma-separated exact migration directory names. No wildcards. */
export function parseAllowList(value: string | undefined): Set<string> {
  return new Set(
    (value ?? "")
      .split(",")
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0),
  );
}

/** Returns only the migrations that contain a destructive statement. */
export function assessMigrations(
  pending: readonly PendingMigration[],
  allow: ReadonlySet<string>,
): DestructiveMigration[] {
  const result: DestructiveMigration[] = [];
  for (const migration of pending) {
    const findings = PATTERNS.filter(([, pattern]) => pattern.test(migration.sql)).map(([label]) => label);
    if (findings.length > 0) {
      result.push({ name: migration.name, findings, allowed: allow.has(migration.name) });
    }
  }
  return result;
}
