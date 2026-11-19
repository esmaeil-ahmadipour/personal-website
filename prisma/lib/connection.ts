// prisma/lib/connection.ts
//
// Pure helpers for choosing and adapting the database URL. This file must not
// import anything so it can be unit-tested without Prisma or pg installed.

/** Query-string parameters that only Prisma understands; the `pg` driver must not see them. */
const PRISMA_ONLY_PARAMS = [
  "schema",
  "connection_limit",
  "pool_timeout",
  "pgbouncer",
  "connect_timeout",
  "socket_timeout",
  "statement_cache_size",
] as const;

/**
 * Seed/release tooling prefers DIRECT_DATABASE_URL (a non-pooled, session-capable
 * connection) and falls back to DATABASE_URL.
 */
export function resolveDatabaseUrl(
  env: Record<string, string | undefined> = process.env,
): string {
  const url = env.DIRECT_DATABASE_URL || env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Set it (or DIRECT_DATABASE_URL) before running seed tooling.",
    );
  }
  return url;
}

/** Returns the URL without Prisma-specific parameters, for use with the `pg` driver. */
export function stripPrismaParams(url: string): string {
  try {
    const parsed = new URL(url);
    for (const param of PRISMA_ONLY_PARAMS) parsed.searchParams.delete(param);
    return parsed.toString();
  } catch {
    return url;
  }
}
