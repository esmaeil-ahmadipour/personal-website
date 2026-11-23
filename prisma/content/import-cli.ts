// prisma/content/import-cli.ts
//
//   pnpm content:import [--dry-run] [--all] [--force]
//   pnpm content:force-token <slug>
//
// See docs/content-import.md.

import { config as loadDotenv } from "dotenv";
import { createReleaseClient } from "../lib/client";
import { resolveDatabaseUrl, stripPrismaParams } from "../lib/connection";
import { acquireReleaseLock } from "../lib/lock";
import { createLogger, errorMessage, type Logger } from "../lib/log";
import { ForceTokenError, generateForceToken, parseForceToken, redactSecrets } from "./force";
import { ImportError, assertAllAllowed, parseCommand, runImport } from "./import";
import { verifyPins } from "./manifest";
import { validateContent } from "./validate";

function scrubbing(base: Logger, secrets: readonly string[]): Logger {
  const clean = (message: string): string => redactSecrets(message, secrets);
  return {
    info: (message) => base.info(clean(message)),
    warn: (message) => base.warn(clean(message)),
    error: (message) => base.error(clean(message)),
  };
}

async function main(argv: readonly string[], env: Record<string, string | undefined>): Promise<number> {
  const secrets: string[] = [];
  const log = scrubbing(createLogger("content-import"), secrets);
  const token = env.CONTENT_FORCE_TOKEN;
  if (token) secrets.push(token);

  try {
    const command = parseCommand(argv);
    loadDotenv({ quiet: true });

    const validation = validateContent();
    if (!validation.ok) {
      for (const error of validation.errors) log.error(error);
      log.error("Content is invalid; nothing was imported. Run `pnpm content:validate`.");
      return 1;
    }

    if (command.command === "token") {
      if (!validation.posts.some((post) => post.slug === command.slug)) {
        throw new ImportError(`No post "${command.slug}" in content/posts.`);
      }
      // The one place the raw token is printed. It is not stored anywhere.
      console.log(
        `Force token for "${command.slug}" (single use; shown only now, never stored):\n\n` +
          `${generateForceToken(command.slug)}\n\n` +
          "Use it once, without leaving it in the shell history or environment:\n" +
          "  read -rs CONTENT_FORCE_TOKEN && export CONTENT_FORCE_TOKEN   # paste the token, press Enter\n" +
          "  pnpm content:import --force\n" +
          "  unset CONTENT_FORCE_TOKEN",
      );
      return 0;
    }

    // A release imports only what was approved: every manifest entry must be pinned and
    // still match its files. Checked before any database access.
    if (!command.all) {
      const pinProblems = verifyPins(validation.manifestEntries, validation.posts);
      if (pinProblems.length > 0) {
        for (const problem of pinProblems) log.error(problem);
        log.error("The manifest does not match the content; nothing was imported.");
        return 1;
      }
    }

    if (command.force && !token) {
      throw new ForceTokenError("--force requires CONTENT_FORCE_TOKEN (see `pnpm content:force-token`).");
    }
    if (!command.force && token) {
      log.warn("CONTENT_FORCE_TOKEN is set but --force was not passed; the token is ignored. Run: unset CONTENT_FORCE_TOKEN");
    }
    const force = command.force && token ? parseForceToken(token) : undefined;

    const databaseUrl = resolveDatabaseUrl(env);
    if (command.all) assertAllAllowed(env, databaseUrl);

    const selected = command.all
      ? validation.posts
      : validation.posts.filter((post) => validation.manifestSlugs.includes(post.slug));
    if (selected.length === 0 && force === undefined) {
      log.info("No posts selected (the manifest is empty). Use --all on a development database.");
      return 0;
    }

    const prisma = createReleaseClient(databaseUrl);
    const lock = command.dryRun
      ? undefined
      : await acquireReleaseLock({
          connectionString: stripPrismaParams(databaseUrl),
          applicationName: "content-import",
          log,
        });
    try {
      const summary = await runImport(prisma, selected, { dryRun: command.dryRun, log, lock, force });
      return summary.blocked ? 1 : 0;
    } finally {
      await lock?.release().catch(() => undefined);
      await prisma.$disconnect();
    }
  } catch (error) {
    log.error(error instanceof ForceTokenError || error instanceof ImportError ? error.message : errorMessage(error));
    return 1;
  }
}

main(process.argv.slice(2), process.env).then((code) => {
  process.exitCode = code;
});
