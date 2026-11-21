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
  /** Fingerprint from a reviewed `pnpm release:dry`; the release refuses to run on any other plan. */
  expectPlan?: string;
}

const EXPECT_PLAN = "--expect-plan=";
const FINGERPRINT = /^[0-9a-f]{64}$/;

export function parseReleaseArgs(argv: readonly string[]): ReleaseOptions {
  const planArgs = argv.filter((arg) => arg.startsWith(EXPECT_PLAN));
  const unknown = argv.filter((arg) => arg !== "--dry-run" && !arg.startsWith(EXPECT_PLAN));
  if (unknown.length > 0) {
    // Never echo a value: someone may have pasted a token as an argument.
    const shown = unknown.map((arg) => (/^--[a-z-]+$/.test(arg) ? arg : "[value hidden]"));
    throw new ReleaseError(
      `Unknown argument(s): ${shown.join(" ")}. Supported: --dry-run, --expect-plan=<fingerprint> (release never accepts --all or --force).`,
    );
  }
  if (planArgs.length > 1) throw new ReleaseError("--expect-plan may be given only once.");
  const dryRun = argv.includes("--dry-run");
  if (planArgs.length === 0) return { dryRun };
  const expectPlan = planArgs[0].slice(EXPECT_PLAN.length);
  if (!FINGERPRINT.test(expectPlan)) {
    throw new ReleaseError(
      "--expect-plan must be the 64-character lowercase hex PLAN_FINGERPRINT printed by `pnpm release:dry`.",
    );
  }
  return { dryRun, expectPlan };
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

/** A production release must name the reviewed plan it is allowed to execute. */
export function assertPlanExpected(env: Env, options: ReleaseOptions): void {
  if (isProductionEnv(env) && !options.dryRun && options.expectPlan === undefined) {
    throw new ReleaseError(
      "A production release requires --expect-plan=<fingerprint> from a reviewed `pnpm release:dry`.",
    );
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
