// prisma/lib/client.ts

import { PrismaClient } from "@prisma/client";

/** Creates a Prisma client bound to an explicit URL (never relies on a global instance). */
export function createReleaseClient(url: string): PrismaClient {
  return new PrismaClient({ datasourceUrl: url, log: ["warn", "error"] });
}
