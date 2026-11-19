// prisma/seed.ts
//
// Entry point for `prisma db seed` (see "prisma.seed" in package.json).
//
// Runs the PENDING system seed versions (author, categories, tags) under the
// release lock. It never overwrites existing records and never touches content or
// user data. Pass --dry-run to list pending versions; a dry run is read-only
// (enforced by PostgreSQL) and does not take the lock:
//
//   pnpm db:seed
//   pnpm exec tsx prisma/seed.ts --dry-run
//
// Seed versions live in prisma/seed/versions and are registered in
// prisma/seed/registry.ts.

import { runSeedCommand } from "./seed/index";

runSeedCommand(process.argv.slice(2))
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
