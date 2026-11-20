// prisma/release/guard.ts
//
// Pure helpers for `pnpm release`: argument parsing, the production guard and the
// step plan. No imports, so it can be unit-tested without Prisma, pg or a database.

type Env = Record<string, string | undefined>;

/**
 * Advisory lock held by `pnpm release` for the whole run. The second int differs from
 * RELEASE_LOCK_KEY (prisma/lib/lock.ts), which the seed and import steps take themselves,
 * so the steps never wait on the orchestrator while concurrent releases queue behind it.
 */
export const RELEASE_ORCHESTRATOR_LOCK_KEY: readonly [number, number] = [20260701, 2];

export class ReleaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReleaseError";
  }
}

export interface ReleaseOptions {
  dryRun: boolean;
}

export function parseReleaseArgs(argv: readonly string[]): ReleaseOptions {
  const unknown = argv.filter((arg) => arg !== "--dry-run");
  if (unknown.length > 0) {
    // Never echo a value: someone may have pasted a token as an argument.
    const shown = unknown.map((arg) => (/^--[a-z-]+$/.test(arg) ? arg : "[value hidden]"));
    throw new ReleaseError(
      `Unknown argument(s): ${shown.join(" ")}. Supported: --dry-run (release never accepts --all or --force).`,
    );
  }
  return { dryRun: argv.includes("--dry-run") };
}

export function isProductionEnv(env: Env): boolean {
  return env.VERCEL_ENV === "production" || env.NODE_ENV === "production";
}

/** Heuristic: Prisma's pgbouncer flag, a pooler host name, or the common pooler port 6543. */
export function isPooledUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.searchParams.get("pgbouncer") === "true" ||
      parsed.hostname.includes("pooler") ||
      parsed.port === "6543"
    );
  } catch {
    return false;
  }
}

/** Throws ReleaseError when a production release is not safe to start. */
export function assertReleaseAllowed(env: Env): void {
  if (!isProductionEnv(env)) return;

  const direct = env.DIRECT_DATABASE_URL;
  if (!direct) {
    throw new ReleaseError(
      "A production release requires DIRECT_DATABASE_URL (a direct, non-pooled connection).",
    );
  }
  if (isPooledUrl(direct)) {
    throw new ReleaseError(
      "DIRECT_DATABASE_URL looks pooled (pgbouncer=true, a pooler host or port 6543); use a direct connection.",
    );
  }
  const token = env.ADMIN_API_TOKEN;
  if (!token || token.length < 32) {
    throw new ReleaseError("A production release requires ADMIN_API_TOKEN (at least 32 characters).");
  }
}

export interface ReleaseStep {
  name: string;
  command: string;
  args: string[];
}

/** Migrations, then system seed, then manifest content. Never `--all` and never `--force`. */
export function buildSteps(dryRun: boolean): ReleaseStep[] {
  const flag = dryRun ? ["--dry-run"] : [];
  return [
    dryRun
      ? { name: "migrate status", command: "pnpm", args: ["exec", "prisma", "migrate", "status"] }
      : { name: "migrate deploy", command: "pnpm", args: ["exec", "prisma", "migrate", "deploy"] },
    { name: "seed", command: "pnpm", args: ["exec", "tsx", "prisma/seed.ts", ...flag] },
    { name: "content import", command: "pnpm", args: ["exec", "tsx", "prisma/content/import-cli.ts", ...flag] },
  ];
}
