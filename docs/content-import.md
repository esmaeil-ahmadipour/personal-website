# Content import

`pnpm content:import` copies posts from `content/` (see `content/README.md`) into the
database. It only ever **creates** posts and **updates** fields that nobody edited
in the database. It never deletes a post and never recreates one.

```bash
pnpm content:validate                 # offline check of content/ (no database)
pnpm content:import --dry-run         # print the plan, write nothing
pnpm content:import                   # import the posts listed in content/manifest.json
pnpm content:import --all             # development only: import every post in content/posts
pnpm db:init:dev                      # development only: seed + import --all
```

`--all` is refused when `VERCEL_ENV` is `production` or when the database host is not
local (`localhost`, `127.0.0.1`, `::1`).

## What each post does

| Situation | Result |
|---|---|
| Post and its `ContentSync` row do not exist | Created (post, tags and `ContentSync`, in one transaction) |
| Post exists, no `ContentSync` row ("unmanaged") | Skipped with a warning. Nothing adopts it automatically |
| `ContentSync` row exists, post is gone ("orphan") | Skipped with a warning. It is **not** recreated |
| Field changed in the file, untouched in the database | Updated |
| Field edited in the database, unchanged in the file | Database value kept |
| Field changed in **both** | **Conflict**: skipped with a warning, reported again on every run |
| Conflict on `status` or `publishedAt` | **Blocking**: nothing is written for any post and the command exits with code 1 |

Author, category and tags are applied only when a post is created; later differences
are reported as warnings. `views`, ids and timestamps are never touched.

The import plans every post first (read-only). If anything blocks, or a referenced
author, category or tag is missing, nothing is written. Otherwise each post is written
in its own `Serializable` transaction while the release lock is held.

## Resolving a blocking conflict

Prefer to remove the conflict: make the file and the database agree (edit one of them).
Only if you really want the file to win, use a **force token**.

A force token is single-use permission to overwrite the *conflicting fields of one post*
with the file's values. It does not touch other fields, other posts, unmanaged posts or
orphans.

1. See the conflict: `pnpm content:import --dry-run`.
2. Generate a token (no database access; the token is printed once and stored nowhere):

   ```bash
   pnpm content:force-token <slug>
   ```

3. Use it once. `--force` **and** the token are both required; neither alone enables force:

   ```bash
   read -rs CONTENT_FORCE_TOKEN && export CONTENT_FORCE_TOKEN   # paste the token, press Enter
   pnpm content:import --force
   ```

4. **Clean up immediately** so the token does not linger in the shell:

   ```bash
   unset CONTENT_FORCE_TOKEN
   ```

   On a hosting platform, remove the `CONTENT_FORCE_TOKEN` environment variable as well.
   Reading the token with `read -rs` keeps it out of the screen and the shell history; do
   not paste it into commands, tickets or chat.

How it is protected:

- The token is `<slug>.<256 random bits>`. The slug inside it is the only post it can be used for.
- Only `force:<sha256 of the token>` is stored (in `ContentSync.consumedForceTokens`), never the token.
- The token is marked used inside the same transaction that applies the forced changes.
  If that transaction fails or rolls back, the token is still usable. After a commit it
  cannot be used again, even by concurrent runs (the check is a single conditional `UPDATE`).
- A malformed, already-used, wrongly scoped or pointless token (no conflict to force) stops
  the command with a clear message before anything is written.
- The raw token is never logged or included in an error message.
- Audit: the stored hashes are in `ContentSync.consumedForceTokens`.

This is a guard against accidental and repeated forcing (for example a variable left set
in an environment), not an authentication boundary against someone who can already run
the import with database access.
