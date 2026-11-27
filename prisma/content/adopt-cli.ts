// prisma/content/adopt-cli.ts
//
//   pnpm content:adopt [--dry-run]
//
// Hands categories and tags that already exist in the database (for example from seed
// v1.0.0) over to the content importer: their current values are recorded as the baseline,
// so a later change in content/taxonomy.yml is an update, not a conflict. Rows that are not
// in the database yet are left to `pnpm content:import`. Nothing else is written.

import { config as loadDotenv } from "dotenv";
import { createReleaseClient } from "../lib/client";
import { resolveDatabaseUrl, stripPrismaParams } from "../lib/connection";
import { acquireReleaseLock } from "../lib/lock";
import { createLogger, errorMessage } from "../lib/log";
import { validateTaxonomy } from "./taxonomy";
import { runTaxonomyAdopt } from "./taxonomy-import";

const log = createLogger("content-adopt");

async function main(argv: readonly string[], env: Record<string, string | undefined>): Promise<number> {
  try {
    if (argv.some((arg) => arg !== "--dry-run")) {
      log.error("Unknown argument. Supported: --dry-run");
      return 1;
    }
    const dryRun = argv.includes("--dry-run");
    loadDotenv({ quiet: true });

    const taxonomy = validateTaxonomy();
    if (!taxonomy.ok) {
      for (const error of taxonomy.errors) log.error(error);
      log.error("Content is invalid; nothing was adopted. Run `pnpm content:validate`.");
      return 1;
    }
    if (taxonomy.items.length === 0) {
      log.info("content/taxonomy.yml has no items; nothing to adopt.");
      return 0;
    }

    const databaseUrl = resolveDatabaseUrl(env);
    const prisma = createReleaseClient(databaseUrl);
    const lock = dryRun
      ? undefined
      : await acquireReleaseLock({
          connectionString: stripPrismaParams(databaseUrl),
          applicationName: "content-adopt",
          log,
        });
    try {
      await runTaxonomyAdopt(prisma, taxonomy.items, { dryRun, log, lock });
      return 0;
    } finally {
      await lock?.release().catch(() => undefined);
      await prisma.$disconnect();
    }
  } catch (error) {
    log.error(errorMessage(error));
    return 1;
  }
}

main(process.argv.slice(2), process.env).then((code) => {
  process.exitCode = code;
});
