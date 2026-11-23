// prisma/seed/types.ts

import type { Prisma } from "@prisma/client";
import type { Logger } from "../lib/log";

export interface SeedContext {
  readonly log: Logger;
  readonly version: string;
}

/**
 * One versioned unit of predefined data changes.
 *
 * Rules every version must follow:
 *  - Use ONLY the `tx` argument for database access. Anything done through another
 *    client is outside the transaction and cannot be rolled back.
 *  - Be insert-only for new records (createMany + skipDuplicates). Never upsert.
 *  - Change an existing record only through an explicit compare-and-set
 *    (updateMany whose `where` still contains the known old value), touching only
 *    the intended fields. See utils/helpers.ts.
 *  - Never delete. Deactivate instead (e.g. Category.isActive) via compare-and-set.
 *  - Never edit a version that has been released; add a new one.
 */
export interface SeedVersion {
  /** Format vMAJOR.MINOR.PATCH, e.g. "v1.1.0". */
  readonly version: string;
  readonly description: string;
  /** Transaction timeout; defaults to 60 seconds. */
  readonly timeoutMs?: number;
  run(tx: Prisma.TransactionClient, ctx: SeedContext): Promise<void>;
}
