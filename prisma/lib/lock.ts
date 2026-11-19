// prisma/lib/lock.ts
//
// One PostgreSQL session-level advisory lock that serialises the whole release
// lifecycle (migrations, system seed, content import).
//
// The lock lives on its own dedicated `pg` connection that is never shared with
// Prisma's pool. A session lock is only meaningful on a direct (or session-mode
// pooled) connection, so acquisition runs a self-test and refuses to continue
// on a transaction-mode pooler.

import { Client } from "pg";
import { createLogger, errorMessage, type Logger } from "./log";

/**
 * Two-int4 advisory lock key. The two-int key space is separate from the single
 * bigint key that `prisma migrate deploy` uses for its own lock, so they never collide.
 */
export const RELEASE_LOCK_KEY: readonly [number, number] = [20260701, 1];

export class LockTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LockTimeoutError";
  }
}

export class LockLostError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LockLostError";
  }
}

export class SessionConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SessionConnectionError";
  }
}

export interface ReleaseLock {
  /** Backend process id of the connection that owns the lock. */
  readonly pid: number;
  /** Throws LockLostError unless this session still holds the lock. Call before every stage. */
  assertHeld(): Promise<void>;
  /** Idempotent. Unlocks and closes the dedicated connection. */
  release(): Promise<void>;
}

export interface AcquireLockOptions {
  /** Must not contain Prisma-only parameters; use stripPrismaParams(). */
  connectionString: string;
  key?: readonly [number, number];
  timeoutMs?: number;
  pollMs?: number;
  heartbeatMs?: number;
  applicationName?: string;
  log?: Logger;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function backendPid(client: Client): Promise<number> {
  const result = await client.query<{ pid: number }>(
    "SELECT pg_backend_pid() AS pid",
  );
  return result.rows[0].pid;
}

async function isLockHeld(
  client: Client,
  key1: number,
  key2: number,
): Promise<boolean> {
  const result = await client.query(
    `SELECT 1 FROM pg_locks
      WHERE locktype = 'advisory'
        AND classid = $1::oid AND objid = $2::oid AND objsubid = 2
        AND pid = pg_backend_pid() AND granted`,
    [key1, key2],
  );
  return result.rows.length > 0;
}

async function describeHolder(
  client: Client,
  key1: number,
  key2: number,
): Promise<string> {
  try {
    const result = await client.query<{ app: string; pid: number }>(
      `SELECT a.application_name AS app, a.pid AS pid
         FROM pg_locks l JOIN pg_stat_activity a ON a.pid = l.pid
        WHERE l.locktype = 'advisory'
          AND l.classid = $1::oid AND l.objid = $2::oid AND l.objsubid = 2
          AND l.granted
        LIMIT 1`,
      [key1, key2],
    );
    const holder = result.rows[0];
    return holder
      ? `held by "${holder.app || "unknown"}" (backend pid ${holder.pid})`
      : "holder not visible";
  } catch {
    return "holder lookup failed";
  }
}

export async function acquireReleaseLock(
  options: AcquireLockOptions,
): Promise<ReleaseLock> {
  const log = options.log ?? createLogger("lock");
  const [key1, key2] = options.key ?? RELEASE_LOCK_KEY;
  const timeoutMs = options.timeoutMs ?? 10 * 60_000;
  const pollMs = options.pollMs ?? 2_000;
  const heartbeatMs = options.heartbeatMs ?? 30_000;

  const client = new Client({
    connectionString: options.connectionString,
    application_name: options.applicationName ?? "release",
    keepAlive: true,
    connectionTimeoutMillis: 15_000,
    query_timeout: 15_000,
  });

  const state: { lost: Error | null; released: boolean } = {
    lost: null,
    released: false,
  };
  const lostError = (): Error | null => state.lost;
  const markLost = (reason: string): void => {
    if (!state.lost && !state.released) state.lost = new LockLostError(reason);
  };

  // A dropped connection must never crash the process with an unhandled 'error' event.
  client.on("error", (error: Error) =>
    markLost(`connection error: ${errorMessage(error)}`),
  );
  client.on("end", () => markLost("connection closed"));

  await client.connect();

  let pid: number;
  try {
    // Self-test: on a transaction-mode pooler consecutive queries can land on
    // different backends, which would make a session lock meaningless.
    pid = await backendPid(client);
    const secondPid = await backendPid(client);
    if (pid !== secondPid) {
      throw new SessionConnectionError(
        "The database connection is not session-stable (a transaction-mode pooler?). " +
          "Set DIRECT_DATABASE_URL to a direct or session-mode connection string.",
      );
    }

    const deadline = Date.now() + timeoutMs;
    let lastNotice = 0;
    for (;;) {
      const attempt = await client.query<{ locked: boolean }>(
        "SELECT pg_try_advisory_lock($1::int, $2::int) AS locked",
        [key1, key2],
      );
      if (attempt.rows[0].locked) break;

      const now = Date.now();
      if (now >= deadline) {
        throw new LockTimeoutError(
          `Could not obtain the release lock within ${timeoutMs} ms (${await describeHolder(client, key1, key2)}).`,
        );
      }
      if (now - lastNotice >= 10_000) {
        lastNotice = now;
        log.info(
          `Waiting for another release to finish (${await describeHolder(client, key1, key2)})`,
        );
      }
      await sleep(Math.min(pollMs, Math.max(0, deadline - now)));
    }

    if (!(await isLockHeld(client, key1, key2))) {
      throw new LockLostError(
        "Lock acquisition could not be verified in pg_locks.",
      );
    }
  } catch (error) {
    state.released = true; // suppress the 'end' notification for a deliberate close
    await client.end().catch(() => undefined);
    throw error;
  }

  // Keep the connection busy so idle timeouts on the server or network do not drop it.
  const timer = setInterval(() => {
    client
      .query("SELECT 1")
      .catch((error: unknown) =>
        markLost(`heartbeat failed: ${errorMessage(error)}`),
      );
  }, heartbeatMs);
  (timer as unknown as { unref?: () => void }).unref?.();

  return {
    pid,

    async assertHeld(): Promise<void> {
      const earlier = lostError();
      if (earlier) throw earlier;
      try {
        if (!(await isLockHeld(client, key1, key2))) {
          markLost("The advisory lock is no longer held by this session.");
        }
      } catch (error) {
        markLost(`Lock check failed: ${errorMessage(error)}`);
      }
      const lost = lostError();
      if (lost) throw lost;
    },

    async release(): Promise<void> {
      if (state.released) return;
      state.released = true;
      clearInterval(timer);
      if (!lostError()) {
        try {
          await client.query("SELECT pg_advisory_unlock($1::int, $2::int)", [
            key1,
            key2,
          ]);
        } catch {
          // Closing the connection below releases a session lock anyway.
        }
      }
      await client.end().catch(() => undefined);
    },
  };
}
