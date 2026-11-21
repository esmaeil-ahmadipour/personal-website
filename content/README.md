# Content

Posts live here as plain files and are validated offline with `pnpm content:validate`.
The database import (Phase 4) is a separate step; nothing in this directory touches a database.

```
content/
  manifest.json            { "posts": [ { "slug": "<slug>", "sourceHash": "<sha256>" }, ... ] }
                           the approved posts released to production, pinned to reviewed content
  posts/<slug>/
    post.yml               metadata (see below)
    en.md  fa.md           required Markdown bodies
    ar.md                  optional; must match `locales.ar` in post.yml
```

Posts that are not listed in `manifest.json` are validated but stay development-only.

## Approving a release

`manifest.json` lists every post that is live, each pinned to the `sourceHash` you reviewed.

1. Edit the post, run `pnpm content:validate`, and review it (for example with
   `pnpm content:import --all` on your development database).
2. `pnpm content:approve <slug>` pins the manifest to the files as they are now
   (`--refresh` re-pins every listed post, e.g. after a pipeline version change).
3. Commit. The release is the `git diff content/manifest.json`.

A release imports only pinned posts whose files still match their pin. If a listed post
was changed after approval, or is listed without a pin, `content:validate` and the import
fail before anything is written, until it is approved again.

## post.yml

```yaml
slug: my-post                    # must equal the directory name
author: esmaeil-ahmadipour       # slugs of existing Author / Category / Tag rows
category: engineering
tags: [flutter, architecture]
language: en                     # en | fa | ar (default en)
status: published                # draft | pending | published
publishedAt: "2025-01-15"        # quoted; "YYYY-MM-DD" or ISO UTC timestamp; required when published
isFeatured: false                # optional booleans, default false
isTrending: false
isPinned: false
priority: 1                      # integer, default 0
readingTimeMin: 5                # optional
coverImageUrl: /images/blog/x.jpg
locales:
  en:                            # en and fa are required, ar is optional
    title: "..."                 # required
    excerpt: "..."               # optional: excerpt, seoTitle, seoDescription, keywords, ogImage
```

Unknown keys are errors.

## Markdown rules

- Start at `##`: the page title is the only h1, so `#` (and raw `<h1>`) is rejected.
- Heading ids are added by the article page at render time; do not write them by hand
  (an `id` you do write on h2-h4 is kept).
- HTML is rendered with `marked` and then sanitized with an allowlist; scripts, event
  handlers, `javascript:`/`data:` URLs and unknown tags are removed.
- Code blocks keep a `language-*` class only.
